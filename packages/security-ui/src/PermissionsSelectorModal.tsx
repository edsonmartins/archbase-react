/**
 * PermissionsSelectorModal — modal para selecionar permissões/roles.
 * @status stable
 */
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { ARCHBASE_IOC_API_TYPE, getKeyByEnumValue, getI18nextInstance } from "@archbase/core";
import { ActionIcon, Alert, Badge, Button, Checkbox, Group, Modal, Paper, ScrollArea, Stack, Text, TextInput, ThemeIcon, Tooltip, Tree, TreeNodeData, useMantineColorScheme, useTree } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconBorderCornerSquare, IconChevronDown, IconInfoCircle } from "@tabler/icons-react";
import { SecurityType } from "@archbase/security";
import { useArchbaseRemoteServiceApi, IArchbaseDataSourceBase } from "@archbase/data";
import { CapabilityDependencyNodeDto, ResouceActionPermissionDto, ResoucePermissionsWithTypeDto, TipoRecurso } from "@archbase/security";
import { ArchbaseResourceService } from "@archbase/security";
import { useDebouncedValue } from "@mantine/hooks";
import { ArchbaseSpaceBottom, ArchbaseSpaceFill, ArchbaseSpaceFixed } from "@archbase/layout";

const translateDelimitedString = (inputString) => {
    const delimiter = "->"
    if (inputString.includes(delimiter)) {
        const parts = inputString.split(delimiter).map(part => part.trim());

        const translatedParts = parts.map(part => getI18nextInstance().t(part));

        return translatedParts.join(` ${delimiter} `);
    }

    return getI18nextInstance().t(inputString);
};

/**
 * As três seções da árvore, na ordem em que aparecem.
 *
 * <p>Recurso de tela e recurso de endpoint sempre foram coisas diferentes — o banco os distingue em
 * {@code SEGURANCA_RECURSO.TIPO_RECURSO} desde que a coluna existe —, mas chegavam aqui sem o campo
 * e eram desenhados lado a lado, indistinguíveis. Quem administra via "Ordens de serviço" duas
 * vezes, uma vinda da tela e outra do controller, sem nada que dissesse qual era qual.
 *
 * <p>O rótulo da segunda é <b>Serviços</b>, e não "Endpoints": endpoint é vocabulário de quem
 * escreve o código, e esta tela é operada por quem administra acesso. O tipo no banco continua
 * {@code API} — o que muda é só o que a pessoa lê.
 *
 * <p>O terceiro balde não é enfeite: {@code TIPO_RECURSO} é nulável e chegou depois de muita gente
 * já ter catálogo. Recurso sem tipo é mostrado como sem tipo, em vez de ser empurrado para um dos
 * dois — empurrar seria a interface afirmando algo que ela não sabe. Eles se classificam sozinhos
 * assim que a varredura da aplicação ou a abertura da tela os encontrar de novo.
 */
const CLASSIFICACOES: Array<{ chave: string; tipo: TipoRecurso | null; rotulo: string }> = [
    { chave: "view", tipo: TipoRecurso.VIEW, rotulo: "archbase:Screens" },
    { chave: "api", tipo: TipoRecurso.API, rotulo: "archbase:Services" },
    { chave: "sem-tipo", tipo: null, rotulo: "archbase:Unclassified" },
];

/**
 * Agrupa as capacidades de um recurso por categoria, quando alguma declara categoria.
 *
 * <p>O nível extra só aparece quando o dado justifica: recurso cujas capacidades não têm categoria
 * continua com a mesma árvore de dois níveis de sempre. As sem categoria, num recurso que tem
 * outras com, ficam soltas ao lado dos grupos — inventar um "Outros" seria a interface afirmando uma
 * classificação que ninguém declarou.
 *
 * <p>O `value` dos nós de categoria é prefixado e carrega o id do recurso, porque a árvore do
 * Mantine identifica o nó por ele: duas categorias de mesmo nome em recursos diferentes colidiriam,
 * e valor repetido quebra a seleção.
 */
const agruparPorCategoria = (nosDeAcao: TreeNodeData[], resourceId: string): TreeNodeData[] => {
    const categorias: string[] = [];
    nosDeAcao.forEach(no => {
        const categoria = no?.nodeProps?.actionCategory;
        if (categoria && !categorias.includes(categoria)) {
            categorias.push(categoria);
        }
    });

    if (categorias.length === 0) {
        return nosDeAcao;
    }

    const semCategoria = nosDeAcao.filter(no => !no?.nodeProps?.actionCategory);
    const agrupadas = categorias.sort((a, b) => a.localeCompare(b)).map(categoria => ({
        value: `categoria:${resourceId}:${categoria}`,
        label: categoria,
        nodeProps: { kind: "category" },
        children: nosDeAcao.filter(no => no?.nodeProps?.actionCategory === categoria),
    }));

    return [...agrupadas, ...semCategoria];
};

/**
 * Descarta o recurso que ficou sem nenhuma capacidade depois do filtro.
 *
 * <p>O filtro reduz as ações DENTRO de cada recurso, e sem isto o recurso continuava na lista com
 * zero filhos: filtrar por `aprovar_custo` deixava os 154 recursos na tela, e quem procurava tinha
 * de rolar a lista inteira até achar o único que interessava — exatamente o trabalho que o filtro
 * existe para poupar.
 *
 * <p>Com o filtro vazio nada é escondido: toda ação passa, e todo recurso mantém filhos.
 */
const comCapacidades = (nosDeRecurso: TreeNodeData[]): TreeNodeData[] =>
    nosDeRecurso.filter(no => (no.children?.length ?? 0) > 0);

/** As folhas de ação de um nó, atravessando os agrupamentos de categoria. */
const folhasDe = (nos: TreeNodeData[]): TreeNodeData[] =>
    nos.flatMap(no => (no?.nodeProps?.kind === "action" ? [no] : folhasDe(no.children ?? [])));

/**
 * Envolve os nós de recurso nas seções de classificação.
 *
 * <p>Seção vazia não é renderizada: numa instalação só de telas, "Serviços" vazio seria uma pasta
 * que nunca abre. E backend anterior a 3.4 não envia {@code resourceType} nenhum — tudo cai em
 * "sem classificação", que é exatamente o que se deve dizer nesse caso, e a árvore continua
 * funcionando com um nível a mais em vez de quebrar.
 */
const agruparPorClassificacao = (nosDeRecurso: TreeNodeData[]): TreeNodeData[] =>
    CLASSIFICACOES
        .map(({ chave, tipo, rotulo }) => ({
            value: `classificacao:${chave}`,
            label: rotulo,
            nodeProps: { kind: "group" },
            children: nosDeRecurso.filter(no => (no.nodeProps?.resourceType ?? null) === tipo),
        }))
        .filter(secao => secao.children.length > 0);

/**
 * Traduz pela **chave estável** quando ela existe, e cai no texto humano quando não.
 *
 * <p>Até aqui a chave de tradução era a própria descrição — o texto que o desenvolvedor escreveu na
 * anotação. Renomear a descrição quebrava a tradução, e traduzir exigia repetir a frase inteira como
 * chave. `recurso:acao` é estável: sobrevive a mudança de texto, e é o mesmo identificador que o
 * backend usa em toda parte.
 *
 * <p><b>Os dois separadores são desligados na chamada, e isso não é detalhe.</b> O i18next do
 * archbase roda com `keySeparator: '.'` e o `nsSeparator: ':'` padrão — e a capacidade contém os
 * dois. Sem desligá-los, `tms.abastecimento:aprovar` é lido como namespace `tms`, caminho aninhado
 * `abastecimento:aprovar`, e nunca casa com a chave plana do arquivo de tradução.
 *
 * <p><b>E a ausência é detectada com `exists`, não comparando o retorno.</b> Para chave ausente o
 * i18next devolve a chave **sem o namespace** — então comparar o retorno contra a chave completa
 * dava sempre "diferente", e esta função devolvia o identificador cru no lugar da descrição. Era
 * exatamente o que aparecia na tela: `tms.abastecimento.aprovar` onde deveria estar
 * "aprovar em Abastecimentos".
 */
const traduzir = (chaveEstavel: string | undefined, texto: string): string => {
    if (chaveEstavel) {
        const i18n: any = getI18nextInstance();
        const opcoes = { ns: "archbase", keySeparator: false, nsSeparator: false };
        try {
            if (typeof i18n?.exists === "function" && i18n.exists(chaveEstavel, opcoes)) {
                const traduzido = i18n.t(chaveEstavel, opcoes);
                if (typeof traduzido === "string" && traduzido !== chaveEstavel) {
                    return traduzido;
                }
            }
        } catch {
            // i18next não inicializado, ou instância sem `exists`: o texto humano segue valendo.
        }
    }
    return translateDelimitedString(texto);
};

/**
 * A capacidade em texto, `recurso:acao` — a mesma chave que o backend usa nas dependências.
 *
 * <p>Indefinida quando o backend não envia os nomes (anterior a 3.4). Nesse caso as funções de
 * dependência ficam inertes, em vez de casarem por engano com outra coisa.
 */
const capacidadeDe = (recurso?: string, acao?: string): string | undefined =>
    recurso && acao ? `${recurso}:${acao}` : undefined;

/** O identificador técnico, quando o backend o envia — nunca a descrição de novo. */
const nomeTecnico = (node: TreeNodeData): string | undefined => {
    const nome = node?.nodeProps?.kind === "action"
        ? node?.nodeProps?.actionName
        : node?.nodeProps?.resourceName;
    return nome && nome !== node.label ? nome : undefined;
};

export interface PermissionsSelectorProps {
    dataSource: IArchbaseDataSourceBase<any> | null
    opened: boolean
    close: () => void
}

export function PermissionsSelectorModal({ dataSource, opened, close }: PermissionsSelectorProps) {
    // Memoiza os valores do dataSource para evitar recálculos
    const name = useMemo(() => dataSource?.getFieldValue("name") || '', [dataSource]);
    const securityId = useMemo(() => dataSource?.getFieldValue("id") || '', [dataSource]);
    const type = useMemo(() => dataSource?.getFieldValue("type") || '', [dataSource]);

    const availablePermissionsTree = useTree()
    const grantedPermissionsTree = useTree()
    const [availablePermissions, setAvailablePermissions] = useState<ResoucePermissionsWithTypeDto[]>([])
    const [grantedPermissions, setGrantedPermissions] = useState<ResoucePermissionsWithTypeDto[]>([])
    const [selectedAvailablePermission, setSelectedAvailablePermission] = useState<TreeNodeData>()
    const [selectedGrantedPermission, setSelectedGrantedPermission] = useState<TreeNodeData>()
    const [availablePermissionsFilter, setAvailablePermissionsFilter] = useState("")
    const [debouncedAvailablePermissionsFilter] = useDebouncedValue(availablePermissionsFilter, 200);
    const [grantedPermissionsFilter, setGrantedPermissionsFilter] = useState("")
    /** A confirmação "esta capacidade depende de outras que a entidade não tem". */
    const [sugestao, setSugestao] = useState<{
        alvo: TreeNodeData
        faltando: CapabilityDependencyNodeDto[]
        marcadas: Set<string>
        truncado: boolean
    } | null>(null)
    /** O aviso "removendo esta, as que dependem dela ficam sem efeito prático". */
    const [avisoDeRemocao, setAvisoDeRemocao] = useState<{
        capacidade?: string
        dependentes: string[]
    } | null>(null)
    const [debouncedGrantedPermissionsFilter] = useDebouncedValue(grantedPermissionsFilter, 200);


    const resourceApi = useArchbaseRemoteServiceApi<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource)

    const { colorScheme } = useMantineColorScheme();
    const selectedColor = colorScheme === "dark" ? "var(--mantine-primary-color-7)" : "var(--mantine-primary-color-4)"

    /** As capacidades que a entidade já alcança, em texto — inclusive as herdadas de grupo e perfil. */
    const capacidadesConcedidas = useMemo(() => {
        const conjunto = new Set<string>()
        grantedPermissions.forEach(recurso => recurso.permissions.forEach(permissao => {
            const capacidade = capacidadeDe(recurso.resourceName, permissao.actionName)
            if (capacidade) {
                conjunto.add(capacidade)
            }
        }))
        return conjunto
    }, [grantedPermissions])

    /**
     * Quem, entre as capacidades JÁ CONCEDIDAS, depende de cada capacidade.
     *
     * <p>É o índice invertido de `requires`, e é o que permite avisar ao revogar sem nenhuma
     * requisição a mais: a informação já veio no catálogo.
     *
     * <p>Diretas apenas. O fecho responderia "quem depende disto, em algum nível", que numa árvore
     * grande é quase tudo — um aviso que assusta sem informar.
     */
    const dependentesConcedidos = useMemo(() => {
        const porCapacidade = new Map<string, string[]>()
        grantedPermissions.forEach(recurso => recurso.permissions.forEach(permissao => {
            const dependente = capacidadeDe(recurso.resourceName, permissao.actionName)
            if (!dependente) {
                return
            }
            (permissao.requires ?? []).forEach(exigida => {
                porCapacidade.set(exigida, [...(porCapacidade.get(exigida) ?? []), dependente])
            })
        }))
        return porCapacidade
    }, [grantedPermissions])

    /**
     * Quais TELAS consomem cada capacidade de API.
     *
     * <p>A pergunta que o aninhamento resolveria — "quem usa este endpoint?" — respondida sem
     * aninhar. Aninhar exigiria repetir a mesma capacidade sob cada tela que a usa, e a árvore do
     * Mantine identifica o nó pelo `value`: valores repetidos quebram a seleção, e é pela seleção
     * que se concede e se remove. A etiqueta diz a mesma coisa e não mexe em nada disso.
     */
    const usadaPorTelas = useMemo(() => {
        const porCapacidade = new Map<string, string[]>()
        availablePermissions
            .filter(recurso => recurso.resourceType === TipoRecurso.VIEW)
            .forEach(tela => tela.permissions.forEach(permissao => {
                (permissao.requires ?? []).forEach(exigida => {
                    const jaTem = porCapacidade.get(exigida) ?? []
                    if (!jaTem.includes(tela.resourceDescription)) {
                        porCapacidade.set(exigida, [...jaTem, tela.resourceDescription])
                    }
                })
            }))
        return porCapacidade
    }, [availablePermissions])

    const permissionsGrantedData = useMemo(() => grantedPermissions
        .sort((a, b) => a.resourceDescription.localeCompare(b.resourceDescription))
        .map(resourcePermissions => {
            return (
                {
                    value: resourcePermissions.resourceId,
                    label: resourcePermissions.resourceDescription,
                    nodeProps: {
                        kind: "resource",
                        resourceName: resourcePermissions.resourceName,
                        // Nulo e ausente dão no mesmo aqui: os dois significam "não sei o que isto
                        // é", e a seção "sem classificação" existe para dizer exatamente isso.
                        resourceType: resourcePermissions.resourceType ?? null,
                        // Ausente é tratado como ativo: backend que não envia o campo se comporta
                        // como antes.
                        resourceInactive: resourcePermissions.resourceActive === false
                    },
                    children: agruparPorCategoria(resourcePermissions.permissions
                        // O filtro passa a alcançar também o identificador técnico e o rótulo: quem
                        // administra costuma procurar por 'aprovar_custo', que é o que está na
                        // anotação, e não pela frase gerada que aparece na linha.
                        .filter(permission => `${permission.actionDescription} ${permission.actionLabel ?? ""} ${permission.actionName ?? ""}`
                            .toLowerCase().includes(debouncedGrantedPermissionsFilter.toLowerCase()))
                        .sort((a, b) => (a.actionLabel ?? a.actionDescription).localeCompare(b.actionLabel ?? b.actionDescription))
                        .map(permission => {
                            return {
                                value: permission.actionId,
                                // O rótulo quando existe; a descrição quando não. Enquanto ninguém
                                // declarar rótulo, a tela mostra exatamente o que mostra hoje.
                                label: permission.actionLabel ?? permission.actionDescription,
                                nodeProps: {
                                    kind: "action",
                                    actionName: permission.actionName,
                                    actionDescription: permission.actionDescription,
                                    actionCategory: permission.actionCategory,
                                    capability: capacidadeDe(resourcePermissions.resourceName, permission.actionName),
                                    requires: permission.requires ?? [],
                                    permissionId: permission.permissionId,
                                    types: permission.types ?? [],
                                    owner: resourcePermissions
                                }
                            }
                        }), resourcePermissions.resourceId)
                }
            )
        }), [grantedPermissions, debouncedGrantedPermissionsFilter])

    const grantedPermissionsActionIds = useMemo(() => grantedPermissions
        .map(resourcePermissions => resourcePermissions.permissions.map(permission => permission.actionId))
        .flat(), [grantedPermissions])

    const allPermissionsData = useMemo(() => availablePermissions
        .sort((a, b) => a.resourceDescription.localeCompare(b.resourceDescription))
        .map(resourcePermissions => {
            return (
                {
                    value: resourcePermissions.resourceId,
                    label: resourcePermissions.resourceDescription,
                    nodeProps: {
                        kind: "resource",
                        resourceName: resourcePermissions.resourceName,
                        resourceType: resourcePermissions.resourceType ?? null,
                        resourceInactive: resourcePermissions.resourceActive === false
                    },
                    children: agruparPorCategoria(resourcePermissions.permissions
                        .filter(permission => `${permission.actionDescription} ${permission.actionLabel ?? ""} ${permission.actionName ?? ""}`
                            .toLowerCase().includes(debouncedAvailablePermissionsFilter.toLowerCase()))
                        .sort((a, b) => (a.actionLabel ?? a.actionDescription).localeCompare(b.actionLabel ?? b.actionDescription))
                        .map(permission => {
                            const permissionGranted = grantedPermissions
                                .find(resourcePermissionsGranted => resourcePermissionsGranted.resourceId === resourcePermissions.resourceId)?.permissions
                                .find(permissionGranted => permissionGranted.actionId === permission.actionId)
                            return (
                                {
                                    value: permission.actionId,
                                    label: permission.actionLabel ?? permission.actionDescription,
                                    nodeProps: {
                                        kind: "action",
                                        actionName: permission.actionName,
                                        actionDescription: permission.actionDescription,
                                        actionCategory: permission.actionCategory,
                                        capability: capacidadeDe(resourcePermissions.resourceName, permission.actionName),
                                        requires: permission.requires ?? [],
                                        granted: grantedPermissionsActionIds.includes(permission.actionId) && permissionGranted?.types?.includes(getKeyByEnumValue(SecurityType, type)!),
                                        // As origens por onde a capacidade JÁ chega, mesmo que não
                                        // pela entidade em edição. É o que permite dizer "esta
                                        // pessoa já tem isto pelo grupo" em vez de oferecer a
                                        // concessão como se ela não tivesse nada.
                                        types: permissionGranted?.types ?? [],
                                        owner: resourcePermissions
                                    }
                                }
                            )
                        }), resourcePermissions.resourceId)
                }
            )
        }), [availablePermissions, grantedPermissions, grantedPermissionsActionIds, type, debouncedAvailablePermissionsFilter])

    /** As duas árvores exibidas — os mesmos nós de recurso, agrupados por classificação. */
    const allPermissionsTreeData = useMemo(
        () => agruparPorClassificacao(comCapacidades(allPermissionsData as TreeNodeData[])),
        [allPermissionsData])
    const grantedPermissionsTreeData = useMemo(
        () => agruparPorClassificacao(comCapacidades(permissionsGrantedData as TreeNodeData[])),
        [permissionsGrantedData])

    const loadPermissions = useCallback(async () => {
        if (securityId) {
            const permissionsGranted = await resourceApi.getPermissionsBySecurityId(securityId, type)
            const allPermissions = await resourceApi.getAllPermissionsAvailable()
            setAvailablePermissions(allPermissions)
            setGrantedPermissions(permissionsGranted)
        }
    }, [securityId, type])

    /**
     * Aplica no estado local a concessão que o servidor confirmou.
     *
     * <p>Extraído de dentro do `handleAdd` sem mudar uma linha da lógica, com uma única diferença:
     * a chave passou a ser `dto.actionId` em vez do valor do nó selecionado. Os dois sempre foram o
     * mesmo — a resposta é da ação que se concedeu —, e a troca é o que torna a função reutilizável
     * para conceder uma **dependência**, que não é a linha selecionada.
     */
    const aplicarConcessao = useCallback((dto: ResouceActionPermissionDto) => {
        setGrantedPermissions(permissionsGranted => {
            let updatedPermissionsGranted;
            if (permissionsGranted.map(resourcePermissions => resourcePermissions.resourceId).includes(dto.resourceId)) {
                updatedPermissionsGranted = permissionsGranted.map(resourcePermissions => {
                    if (resourcePermissions.resourceId === dto.resourceId) {
                        if (resourcePermissions.permissions.map(permission => permission.actionId).includes(dto.actionId)) {
                            return (
                                {
                                    ...resourcePermissions,
                                    permissions: resourcePermissions.permissions.map(permission =>
                                        permission.actionId === dto.actionId ? {
                                            ...permission,
                                            permissionId: dto.permissionId,
                                            types: [...(permission.types ?? []), getKeyByEnumValue(SecurityType, type)!],
                                        } : permission
                                    )
                                }
                            )
                        }
                        return (
                            {
                                ...resourcePermissions,
                                permissions: [...(resourcePermissions.permissions ?? []),
                                {
                                    actionId: dto.actionId,
                                    actionName: dto.actionName,
                                    actionDescription: dto.actionDescription,
                                    permissionId: dto.permissionId,
                                    types: [getKeyByEnumValue(SecurityType, type)!]
                                }]
                            }
                        )
                    }
                    return resourcePermissions
                });
            } else {
                updatedPermissionsGranted = [
                    ...permissionsGranted,
                    {
                        resourceId: dto.resourceId,
                        resourceName: dto.resourceName,
                        resourceDescription: dto.resourceDescription,
                        resourceType: dto.resourceType,
                        permissions: [
                            {
                                actionId: dto.actionId,
                                actionName: dto.actionName,
                                actionDescription: dto.actionDescription,
                                permissionId: dto.permissionId,
                                types: [getKeyByEnumValue(SecurityType, type)!]
                            }
                        ]
                    }
                ]
            }

            return updatedPermissionsGranted
        })
        grantedPermissionsTree.expand(dto.resourceId)
    }, [type, grantedPermissionsTree])

    /** Concede uma capacidade e reflete o resultado na árvore das concedidas. */
    const concederCapacidade = useCallback(async (actionId: string) => {
        const dto: ResouceActionPermissionDto = await resourceApi.createPermission(securityId, actionId, type)
        if (dto) {
            aplicarConcessao(dto)
        }
        return dto
    }, [resourceApi, securityId, type, aplicarConcessao])

    /** Passa a seleção para a próxima capacidade ainda não concedida do mesmo recurso. */
    const avancarSelecaoDisponivel = useCallback((selecionada: TreeNodeData) => {
        // folhasDe atravessa os nós de categoria: sem isso, num recurso agrupado a lista devolveria
        // as categorias em vez das capacidades, e a seleção nunca avançaria.
        const resourceAvailablePermissions = folhasDe(allPermissionsData
            .filter((resourcePermissionsNode: any) => resourcePermissionsNode.value === selecionada?.nodeProps?.owner?.resourceId)
            .map((resourcePermissionsNode: any) => resourcePermissionsNode.children).flat() as TreeNodeData[])

        const previousSelectedPermissionIndex = resourceAvailablePermissions.map((permission: any) => permission.value).indexOf(selecionada.value)
        const nextSelectedAvailablePermission = resourceAvailablePermissions
            .find((permissionNode: any, index: any) => !permissionNode?.nodeProps?.granted
                && permissionNode?.value !== selecionada.value
                && (resourceAvailablePermissions.length > previousSelectedPermissionIndex + 1
                    ? index > previousSelectedPermissionIndex
                    : true))
        if (nextSelectedAvailablePermission?.value) {
            availablePermissionsTree.select(nextSelectedAvailablePermission.value)
        }
        setSelectedAvailablePermission(nextSelectedAvailablePermission)
    }, [allPermissionsData, availablePermissionsTree])

    /**
     * Concede — e, antes disso, verifica de que essa capacidade depende.
     *
     * <p>Conceder `aprovar_custo` sem `view` produz alguém que passa na autorização do endpoint e
     * não chega até ele pela interface. O catálogo agora registra essa relação; a tela passa a
     * usá-la em vez de deixar quem administra descobrir pelo chamado do usuário.
     *
     * <p><b>Só pergunta ao servidor quando há o que perguntar.</b> O catálogo já diz, em `requires`,
     * se a capacidade declara alguma dependência direta. Sem nenhuma, não há fecho a buscar e a
     * concessão sai na hora — que é o caso de quase todo o catálogo.
     */
    const handleAdd = useCallback(async () => {
        const selecionada = selectedAvailablePermission
        if (selecionada?.nodeProps?.kind !== "action" || !selecionada?.value || !securityId) {
            return
        }

        const diretas: string[] = selecionada?.nodeProps?.requires ?? []
        if (diretas.length === 0) {
            await concederCapacidade(selecionada.value)
            avancarSelecaoDisponivel(selecionada)
            return
        }

        // O fecho, e não só as diretas: conceder `aprovar_custo` e `view` não adianta se `view`
        // depende de `tms.cliente:view`. Uma requisição responde a cadeia inteira.
        const fecho = await resourceApi.getCapabilityDependencies(selecionada.value)
        const faltando = (fecho?.dependencies ?? [])
            .filter(no => no.resolved && no.actionId && !capacidadesConcedidas.has(no.capability))

        if (faltando.length === 0) {
            await concederCapacidade(selecionada.value)
            avancarSelecaoDisponivel(selecionada)
            return
        }

        setSugestao({
            alvo: selecionada,
            faltando,
            marcadas: new Set(faltando.map(no => no.capability)),
            truncado: !!fecho?.truncated,
        })
    }, [selectedAvailablePermission, securityId, resourceApi, capacidadesConcedidas,
        concederCapacidade, avancarSelecaoDisponivel])

    /** Concede as dependências marcadas e, por fim, a capacidade pedida. */
    const confirmarSugestao = useCallback(async () => {
        if (!sugestao) {
            return
        }
        const { alvo, faltando, marcadas } = sugestao
        setSugestao(null)

        // As dependências primeiro: se a última chamada falhar, o que ficou concedido é o
        // pré-requisito, não a capacidade que depende dele. A ordem inversa deixaria o acesso pela
        // metade justamente do lado que o usuário não consegue usar.
        for (const no of faltando) {
            if (marcadas.has(no.capability) && no.actionId) {
                await concederCapacidade(no.actionId)
            }
        }
        await concederCapacidade(alvo.value as string)
        avancarSelecaoDisponivel(alvo)
    }, [sugestao, concederCapacidade, avancarSelecaoDisponivel])

    /** Concede apenas o que foi pedido, deixando as dependências de fora — decisão de quem administra. */
    const ignorarSugestao = useCallback(async () => {
        if (!sugestao) {
            return
        }
        const alvo = sugestao.alvo
        setSugestao(null)
        await concederCapacidade(alvo.value as string)
        avancarSelecaoDisponivel(alvo)
    }, [sugestao, concederCapacidade, avancarSelecaoDisponivel])

    const executarRemocao = useCallback(() => {
        if (selectedGrantedPermission?.nodeProps?.permissionId) {
            resourceApi.deletePermission(selectedGrantedPermission.nodeProps.permissionId)
                .then(() => {
                    setGrantedPermissions(permissionsGranted => {
                        const updatedPermissionsGranted = [...permissionsGranted]
                            .filter(resourcePermissions => {
                                let hasOnePermissionOnResource = true
                                resourcePermissions.permissions?.forEach(permission => {
                                    if (permission.permissionId !== undefined
                                        && permission.permissionId === selectedGrantedPermission?.nodeProps?.permissionId
                                        && resourcePermissions.permissions.length === 1
                                        && permission?.types?.length === 1
                                        && permission.types[0] === getKeyByEnumValue(SecurityType, type)) {
                                        hasOnePermissionOnResource = false;
                                    }
                                })
                                return hasOnePermissionOnResource;
                            })
                            .map(resourcePermissions => {
                                const resource: ResoucePermissionsWithTypeDto = selectedGrantedPermission?.nodeProps?.owner
                                if (resourcePermissions.resourceId === resource.resourceId) {
                                    if (selectedGrantedPermission?.nodeProps?.types?.length === 1) {
                                        return ({
                                            ...resourcePermissions,
                                            permissions: [...(resourcePermissions.permissions ?? [])
                                                .filter(permission => permission.permissionId !== selectedGrantedPermission?.nodeProps?.permissionId)]
                                        })
                                    }
                                    return (
                                        {
                                            ...resourcePermissions,
                                            permissions: (resourcePermissions.permissions ?? [])
                                                .map(permission => permission.actionId === selectedGrantedPermission.value
                                                    ? ({
                                                        actionId: permission.actionId,
                                                        actionName: permission.actionName,
                                                        actionDescription: permission.actionDescription,
                                                        types: [...(permission.types?.filter(currentType => currentType && (currentType !== getKeyByEnumValue(SecurityType, type))) ?? [])]
                                                    }) : permission)
                                        }
                                    )
                                }
                                return resourcePermissions
                            })
                        return updatedPermissionsGranted
                    })

                    const resourceGrantedPermissions = folhasDe(permissionsGrantedData
                        .filter((resourcePermissionsNode: any) => resourcePermissionsNode.value === selectedGrantedPermission?.nodeProps?.owner?.resourceId)
                        .map((resourcePermissionsNode: any) => resourcePermissionsNode.children).flat() as TreeNodeData[])

                    const previousSelectedPermissionIndex = resourceGrantedPermissions.map((permission: any) => permission.value).indexOf(selectedGrantedPermission.value)

                    const nextSelectedGrantedPermission = resourceGrantedPermissions
                        .find((permissionNode: any, index: any) => permissionNode?.nodeProps?.types.includes(getKeyByEnumValue(SecurityType, type))
                            && permissionNode?.value !== selectedGrantedPermission.value
                            && (resourceGrantedPermissions.length > previousSelectedPermissionIndex + 1 ? index > previousSelectedPermissionIndex : true))
                    if (nextSelectedGrantedPermission?.value) {
                        grantedPermissionsTree.select(nextSelectedGrantedPermission.value)
                    }
                    setSelectedGrantedPermission(nextSelectedGrantedPermission)
                })
        }
    }, [selectedGrantedPermission, resourceApi, type, permissionsGrantedData, grantedPermissions, grantedPermissionsTree])

    /**
     * Remove — e, antes disso, avisa quem fica no vácuo.
     *
     * <p>Tirar `view` de quem tem `aprovar_custo` não devolve erro nenhum: a concessão de
     * `aprovar_custo` continua lá, o backend continua autorizando o endpoint, e a pessoa
     * simplesmente não chega mais até ele. É o defeito mais difícil de diagnosticar dos que esta
     * tela produz, porque nada aparece errado em lugar nenhum.
     *
     * <p>O aviso sai das **dependências diretas** que já vieram no catálogo — nenhuma requisição a
     * mais. Não é bloqueio: quem administra pode ter um motivo, e a tela não decide por ele.
     */
    const handleRemove = useCallback(() => {
        if (selectedGrantedPermission?.nodeProps?.kind !== "action"
            || !selectedGrantedPermission?.nodeProps?.permissionId) {
            return
        }

        const capacidade = selectedGrantedPermission?.nodeProps?.capability
        const dependentes = capacidade ? (dependentesConcedidos.get(capacidade) ?? []) : []
        if (dependentes.length > 0) {
            setAvisoDeRemocao({ capacidade, dependentes })
            return
        }
        executarRemocao()
    }, [selectedGrantedPermission, dependentesConcedidos, executarRemocao])


    useEffect(() => {
        if (opened && dataSource) {
            setSelectedAvailablePermission(undefined)
            setSelectedGrantedPermission(undefined)
            setAvailablePermissionsFilter("")
            setGrantedPermissionsFilter("")
            grantedPermissionsTree.collapseAllNodes()
            availablePermissionsTree.collapseAllNodes()
            loadPermissions()
        }
    }, [opened, type, securityId, loadPermissions])

    // Não exibir o modal se não houver dataSource
    if (!dataSource) {
        return null;
    }

    return (
        <Modal opened={opened} onClose={close} title={`${getI18nextInstance().t(`archbase:${type}`)}: ${name}`} size={"80%"} styles={{ root: { overflow: "hidden" } }}>
            <ArchbaseSpaceFixed height={"540px"}>
                <ArchbaseSpaceFill>
                    <Paper withBorder my={20} p={20} style={{ height: 'calc(100% - 40px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', minHeight: 0, gap: '8px' }}>
                                <div style={{ flex: 9, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                                    <Group mb={20}>
                                        <Text>{getI18nextInstance().t('archbase:Available')}</Text>
                                        {/*
                                          * A regra que ninguém conta a quem administra: o catálogo
                                          * de uma tela nasce quando um ADMINISTRADOR a abre. O
                                          * registro escreve o catálogo, e por isso é endpoint
                                          * administrativo — usuário comum apenas lê. Tela que nenhum
                                          * administrador abriu não tem capacidade cadastrada, e não
                                          * há como distingui-la de uma tela que não existe. Sem este
                                          * aviso, a lista parece completa quando não é.
                                          */}
                                        <Tooltip
                                            multiline
                                            w={320}
                                            label={getI18nextInstance().t('archbase:The catalog of a screen is created when an administrator opens it')}
                                        >
                                            <ThemeIcon variant="subtle" color="gray" size="sm">
                                                <IconInfoCircle size={16} />
                                            </ThemeIcon>
                                        </Tooltip>
                                        <TextInput
                                            size="xs"
                                            value={availablePermissionsFilter}
                                            onChange={(event) => setAvailablePermissionsFilter(event.target.value)}
                                            placeholder={getI18nextInstance().t('archbase:Filter available permissions')}
                                        />
                                    </Group>
                                    <ScrollArea style={{ flex: 1, minHeight: 0 }}>
                                        <Tree
                                            data={allPermissionsTreeData}
                                            selectOnClick={true}
                                            allowRangeSelection={false}
                                            tree={availablePermissionsTree}
                                            renderNode={({ level, node, expanded, hasChildren, selected, elementProps }) => {
                                                const isGranted = node?.nodeProps?.granted;
                                                const textColor = isGranted ? "dimmed" : undefined;
                                                const textDecoration = isGranted ? "line-through" : undefined;

                                                const handleClick = useCallback((event: any) => {
                                                    setSelectedAvailablePermission(node)
                                                    elementProps.onClick(event)
                                                }, [node, elementProps.onClick])

                                                const tecnico = nomeTecnico(node);
                                                // A capacidade já chega por outra via. Antes ela
                                                // aparecia aqui como se a pessoa não tivesse nada,
                                                // e ao mesmo tempo com etiqueta "grupo" do outro
                                                // lado — a tela se contradizendo na mesma linha.
                                                const herdada = !isGranted
                                                    && (node?.nodeProps?.types?.length ?? 0) > 0;
                                                // Quem usa este endpoint, e de que ele depende — as
                                                // duas perguntas que a lista plana não respondia.
                                                const telasQueUsam: string[] = node?.nodeProps?.capability
                                                    ? (usadaPorTelas.get(node.nodeProps.capability) ?? [])
                                                    : [];
                                                const quantasDependencias = node?.nodeProps?.requires?.length ?? 0;

                                                return (
                                                    <Group ml={hasChildren ? 0 : 5} gap={5} {...elementProps}
                                                        bg={selected && !hasChildren ? selectedColor : ""}
                                                        onClick={handleClick}
                                                    >
                                                        {hasChildren && (
                                                            <IconChevronDown
                                                                size={18}
                                                                style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                                            />
                                                        )}
                                                        {!hasChildren && (
                                                            <IconBorderCornerSquare
                                                                size={12}
                                                                style={{ transform: 'rotate(-90deg)', marginTop: "-5px" }}
                                                            />
                                                        )}
                                                        <Tooltip
                                                            label={node?.nodeProps?.actionDescription ?? node.label}
                                                            disabled={!node?.nodeProps?.actionDescription
                                                                || node?.nodeProps?.actionDescription === node.label}
                                                        >
                                                            <Text
                                                                c={textColor}
                                                                td={textDecoration}
                                                                fw={node?.nodeProps?.kind === "group" ? 600 : undefined}
                                                                fs={node?.nodeProps?.kind === "category" ? "italic" : undefined}
                                                            >
                                                                {traduzir(node?.nodeProps?.capability, node.label as string)}
                                                            </Text>
                                                        </Tooltip>
                                                        {tecnico && (
                                                            <Text size="xs" c="dimmed" ff="monospace">{tecnico}</Text>
                                                        )}
                                                        {herdada && (
                                                            <Badge size="xs" variant="light" color="gray">
                                                                {getI18nextInstance().t('archbase:already inherited')}
                                                            </Badge>
                                                        )}
                                                        {node?.nodeProps?.resourceInactive && (
                                                            <Tooltip label={getI18nextInstance().t('archbase:Grants here stop working when require-active is enabled')}>
                                                                <Badge size="xs" variant="outline" color="red">
                                                                    {getI18nextInstance().t('archbase:inactive resource')}
                                                                </Badge>
                                                            </Tooltip>
                                                        )}
                                                        {telasQueUsam.length > 0 && (
                                                            <Tooltip label={telasQueUsam.join(', ')}>
                                                                <Badge size="xs" variant="light" color="grape">
                                                                    {getI18nextInstance().t('archbase:used by')} {telasQueUsam.length}
                                                                </Badge>
                                                            </Tooltip>
                                                        )}
                                                        {quantasDependencias > 0 && (
                                                            <Badge size="xs" variant="light" color="cyan">
                                                                {getI18nextInstance().t('archbase:depends on')} {quantasDependencias}
                                                            </Badge>
                                                        )}
                                                    </Group>
                                                )
                                            }
                                            }
                                        />
                                    </ScrollArea>
                                </div>
                                <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Stack gap={5} align="center">
                                        <Tooltip label={getI18nextInstance().t('archbase:Add')}>
                                            {/* O marcador `kind` substitui o antigo `!nodeProps`, que
                                                servia para dizer "é um nó de recurso, não dá para
                                                conceder". Com a árvore agrupada por classificação há
                                                três tipos de nó, e a ausência de nodeProps deixou de
                                                distingui-los. */}
                                            <ActionIcon onClick={handleAdd} disabled={selectedAvailablePermission?.nodeProps?.kind !== "action" || selectedAvailablePermission?.nodeProps?.granted}>
                                                <IconArrowRight />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label={selectedGrantedPermission?.nodeProps?.kind === "action" && !selectedGrantedPermission?.nodeProps?.permissionId
                                            ? getI18nextInstance().t('archbase:Inherited permission cannot be removed here')
                                            : getI18nextInstance().t('archbase:Remove')}>
                                            <ActionIcon onClick={handleRemove} disabled={selectedGrantedPermission?.nodeProps?.kind !== "action" || !selectedGrantedPermission?.nodeProps?.permissionId}>
                                                <IconArrowLeft />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Stack>
                                </div>
                                <div style={{ flex: 9, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                                    <Group mb={20}>
                                        <Text>{getI18nextInstance().t('archbase:Granted')}</Text>
                                        <TextInput
                                            size="xs"
                                            value={grantedPermissionsFilter}
                                            onChange={(event) => setGrantedPermissionsFilter(event.target.value)}
                                            placeholder={getI18nextInstance().t('archbase:Filter granted permissions')}
                                        />
                                    </Group>
                                    <ScrollArea style={{ flex: 1, minHeight: 0 }}>
                                        <Tree
                                            data={grantedPermissionsTreeData}
                                            selectOnClick={true}
                                            allowRangeSelection={false}
                                            tree={grantedPermissionsTree}
                                            renderNode={({ level, node, expanded, hasChildren, selected, elementProps }) => {
                                                const handleClick = useCallback((event: any) => {
                                                    setSelectedGrantedPermission(node)
                                                    elementProps.onClick(event)
                                                }, [node, elementProps.onClick])

                                                const tecnico = nomeTecnico(node);
                                                // Sem concessão própria não há o que remover: a
                                                // capacidade é do grupo ou do perfil. Dizer isso na
                                                // linha é o que faltava — o botão desabilitado
                                                // sozinho faz clicar e não entender.
                                                const somenteHerdada = node?.nodeProps?.kind === "action"
                                                    && !node?.nodeProps?.permissionId;
                                                // Quantas capacidades já concedidas ficam sem efeito
                                                // prático se esta sair.
                                                const quantosDependem = node?.nodeProps?.capability
                                                    ? (dependentesConcedidos.get(node.nodeProps.capability) ?? []).length
                                                    : 0;

                                                return (
                                                    <Group ml={hasChildren ? 0 : 5} gap={5} {...elementProps} bg={selected && !hasChildren ? selectedColor : ""}
                                                        onClick={handleClick}
                                                    >
                                                        {hasChildren && (
                                                            <IconChevronDown
                                                                size={18}
                                                                style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                                            />
                                                        )}
                                                        {!hasChildren && (
                                                            <IconBorderCornerSquare
                                                                size={12}
                                                                style={{ transform: 'rotate(-90deg)', marginTop: "-5px" }}
                                                            />
                                                        )}
                                                        <Tooltip
                                                            label={node?.nodeProps?.actionDescription ?? node.label}
                                                            disabled={!node?.nodeProps?.actionDescription
                                                                || node?.nodeProps?.actionDescription === node.label}
                                                        >
                                                            <Text
                                                                fw={node?.nodeProps?.kind === "group" ? 600 : undefined}
                                                                fs={node?.nodeProps?.kind === "category" ? "italic" : undefined}
                                                            >
                                                                {traduzir(node?.nodeProps?.capability, node.label as string)}
                                                            </Text>
                                                        </Tooltip>
                                                        {tecnico && (
                                                            <Text size="xs" c="dimmed" ff="monospace">{tecnico}</Text>
                                                        )}
                                                        {node?.nodeProps?.resourceInactive && (
                                                            <Tooltip label={getI18nextInstance().t('archbase:Grants here stop working when require-active is enabled')}>
                                                                <Badge size="xs" variant="outline" color="red">
                                                                    {getI18nextInstance().t('archbase:inactive resource')}
                                                                </Badge>
                                                            </Tooltip>
                                                        )}
                                                        {node?.nodeProps?.types?.includes("USER") && <Badge color="blue">{getI18nextInstance().t('archbase:user')}</Badge>}
                                                        {node?.nodeProps?.types?.includes("GROUP") && <Badge color="orange">{getI18nextInstance().t('archbase:group')}</Badge>}
                                                        {node?.nodeProps?.types?.includes("PROFILE") && <Badge color="pink">{getI18nextInstance().t('archbase:profile')}</Badge>}
                                                        {somenteHerdada && (
                                                            <Tooltip label={getI18nextInstance().t('archbase:Inherited permission cannot be removed here')}>
                                                                <Badge size="xs" variant="outline" color="gray">
                                                                    {getI18nextInstance().t('archbase:inherited')}
                                                                </Badge>
                                                            </Tooltip>
                                                        )}
                                                        {quantosDependem > 0 && (
                                                            <Badge size="xs" variant="light" color="orange">
                                                                {getI18nextInstance().t('archbase:required by')} {quantosDependem}
                                                            </Badge>
                                                        )}
                                                    </Group>
                                                )
                                            }}
                                        />
                                    </ScrollArea>
                                </div>
                            </div>
                        </Paper>
                </ArchbaseSpaceFill>
                <ArchbaseSpaceBottom size="40px">
                    <Group justify="flex-end">
                        <Button onClick={close}>{getI18nextInstance().t("archbase:Close")}</Button>
                    </Group>
                </ArchbaseSpaceBottom>
            </ArchbaseSpaceFixed>

            {/*
              * Conceder `aprovar_custo` sem `view` produz alguém que passa na autorização do
              * endpoint e não chega até ele pela interface — e ninguém descobre até o usuário
              * reclamar. O catálogo registra a relação; aqui ela vira uma pergunta.
              *
              * Sugestão, não regra: as caixas vêm marcadas porque conceder junto é o que se quer na
              * quase totalidade dos casos, e desmarcáveis porque quem administra pode ter um motivo.
              */}
            <Modal
                opened={!!sugestao}
                onClose={() => setSugestao(null)}
                title={getI18nextInstance().t('archbase:This permission depends on others')}
                zIndex={400}
            >
                <Stack gap="sm">
                    <Text size="sm">
                        {getI18nextInstance().t('archbase:Without these, the permission will not work in practice')}
                    </Text>
                    <Stack gap={4}>
                        {(sugestao?.faltando ?? []).map(no => (
                            <Checkbox
                                key={no.capability}
                                checked={sugestao?.marcadas.has(no.capability) ?? false}
                                onChange={(event) => setSugestao(atual => {
                                    if (!atual) {
                                        return atual
                                    }
                                    const marcadas = new Set(atual.marcadas)
                                    if (event.currentTarget.checked) {
                                        marcadas.add(no.capability)
                                    } else {
                                        marcadas.delete(no.capability)
                                    }
                                    return { ...atual, marcadas }
                                })}
                                label={
                                    <Group gap={6}>
                                        <Text size="sm">{no.actionDescription ?? no.capability}</Text>
                                        <Text size="xs" c="dimmed" ff="monospace">{no.capability}</Text>
                                        {no.depth > 1 && (
                                            <Badge size="xs" variant="light" color="gray">
                                                {getI18nextInstance().t('archbase:indirect')}
                                            </Badge>
                                        )}
                                    </Group>
                                }
                            />
                        ))}
                    </Stack>
                    {sugestao?.truncado && (
                        <Alert color="yellow" variant="light">
                            {getI18nextInstance().t('archbase:The dependency chain is longer than shown')}
                        </Alert>
                    )}
                    <Group justify="flex-end" gap="xs">
                        <Button variant="subtle" onClick={ignorarSugestao}>
                            {getI18nextInstance().t('archbase:Grant only this one')}
                        </Button>
                        <Button onClick={confirmarSugestao}>
                            {getI18nextInstance().t('archbase:Grant together')}
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/*
              * Tirar `view` de quem tem `aprovar_custo` não devolve erro nenhum: a concessão fica,
              * o backend segue autorizando o endpoint, e a pessoa só não chega mais até ele. Aviso,
              * não bloqueio — a decisão continua sendo de quem administra.
              */}
            <Modal
                opened={!!avisoDeRemocao}
                onClose={() => setAvisoDeRemocao(null)}
                title={getI18nextInstance().t('archbase:Other permissions depend on this one')}
                zIndex={400}
            >
                <Stack gap="sm">
                    <Text size="sm">
                        {getI18nextInstance().t('archbase:Removing it leaves these without practical effect')}
                    </Text>
                    <Stack gap={2}>
                        {(avisoDeRemocao?.dependentes ?? []).map(capacidade => (
                            <Text key={capacidade} size="xs" ff="monospace">{capacidade}</Text>
                        ))}
                    </Stack>
                    <Group justify="flex-end" gap="xs">
                        <Button variant="subtle" onClick={() => setAvisoDeRemocao(null)}>
                            {getI18nextInstance().t('archbase:Cancel')}
                        </Button>
                        <Button color="red" onClick={() => { setAvisoDeRemocao(null); executarRemocao(); }}>
                            {getI18nextInstance().t('archbase:Remove anyway')}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Modal>
    )
}
