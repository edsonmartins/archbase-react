/**
 * ArchbaseSecurityInspector — mostra, sobre a aplicação rodando, quais capacidades cada tela
 * declara e quais o usuário alcança.
 * @status stable
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getI18nextInstance } from '@archbase/core';
import {
    ActionIcon,
    Badge,
    FloatingWindow,
    Group,
    ScrollArea,
    Stack,
    Switch,
    Text,
    TextInput,
    Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy, IconGripVertical, IconX } from '@tabler/icons-react';
import { ArchbaseSecurityManager } from './ArchbaseSecurityManager';
import { useTelasInspecionadas } from './registroDeTelasInspecionadas';
import { ATRIBUTO_DE_ACAO } from '@archbase/core';
import { useArchbaseSecurity } from './ArchbaseSecurityHooks';

const t = (chave: string): string => {
    try {
        return getI18nextInstance().t(`archbase:${chave}`) as string;
    } catch {
        // i18next não inicializado: o texto em inglês é a própria chave.
        return chave;
    }
};

/** Uma linha do painel: a capacidade e o que se sabe dela. */
interface LinhaDeAcao {
    resourceName: string;
    actionName: string;
    /** `recurso:acao` — o identificador que se concede, e o que o botão de cópia entrega. */
    capacidade: string;
    rotulo: string;
    categoria?: string;
    concedida: boolean;
    /**
     * Concedida ao usuário mas não declarada por esta tela.
     *
     * <p>Acontece o tempo todo e não é defeito: um recurso pode ser declarado por mais de uma tela,
     * e cada uma registra só as ações que usa. Mostrar em vez de esconder evita a conclusão errada
     * de que a capacidade "não existe" porque esta tela não a declarou.
     */
    forasteira: boolean;
}

function linhasDe(manager: ArchbaseSecurityManager): LinhaDeAcao[] {
    const { resourceName } = manager.getResource();
    const declaradas = manager.getRegisteredActions();
    const concedidas = new Set(manager.getPermissions());

    const linhas: LinhaDeAcao[] = declaradas.map(acao => ({
        resourceName,
        actionName: acao.actionName,
        capacidade: `${resourceName}:${acao.actionName}`,
        rotulo: acao.actionLabel || acao.actionDescription || acao.actionName,
        categoria: acao.actionCategory,
        concedida: manager.hasPermission(acao.actionName),
        forasteira: false,
    }));

    const jaListadas = new Set(declaradas.map(a => a.actionName));
    concedidas.forEach(nome => {
        if (!jaListadas.has(nome)) {
            linhas.push({
                resourceName,
                actionName: nome,
                capacidade: `${resourceName}:${nome}`,
                rotulo: nome,
                concedida: true,
                forasteira: true,
            });
        }
    });

    return linhas.sort((a, b) => a.actionName.localeCompare(b.actionName));
}

/** Marca, no elemento, se o usuário alcança a capacidade — é o que dá a cor ao realce. */
const ATRIBUTO_DE_CONCESSAO = 'data-archbase-granted';

/**
 * O realce inteiro, em CSS.
 *
 * <p><b>Por que não medir.</b> A primeira versão percorria os elementos marcados a cada quadro,
 * lia `getBoundingClientRect` e desenhava caixas absolutas por cima. Funcionava e era trabalho
 * desperdiçado: o navegador já sabe onde cada elemento está, e mantê-lo em sincronia por conta
 * própria significa reagir a scroll, resize, menu que abre, painel que anima — tudo o que o
 * `position` de um pseudo-elemento resolve de graça.
 *
 * <p>`outline` e não `border`: outline não ocupa espaço, então o realce não empurra o layout.
 * `::after` com `attr()` põe o nome da capacidade sem nenhum nó novo na árvore.
 */
const CSS_DO_REALCE = `
[${ATRIBUTO_DE_ACAO}] {
    /* Anel POR DENTRO, e não outline.
       Outline e border desenham fora da caixa, e qualquer ancestral com overflow:hidden os come —
       foi o que aconteceu na grade, onde o span.ag-cell-value recorta a célula e o realce sumia
       justamente nas listas, que são a maior parte das telas. Sombra interna nunca é recortada. */
    box-shadow: inset 0 0 0 2px #e03131 !important;
    border-radius: 4px;
    position: relative;
    overflow: visible !important;
}
[${ATRIBUTO_DE_ACAO}][${ATRIBUTO_DE_CONCESSAO}="true"] {
    box-shadow: inset 0 0 0 2px #2f9e44 !important;
}
/* Cinza: o controle anuncia uma capacidade que nenhuma tela registrou. Nao e falta de permissao,
   e nome que nao existe no catalogo — quase sempre erro de digitacao ou de sincronia. */
[${ATRIBUTO_DE_ACAO}][${ATRIBUTO_DE_CONCESSAO}="unknown"] {
    box-shadow: inset 0 0 0 2px #868e96 !important;
}
[${ATRIBUTO_DE_ACAO}]::after {
    content: attr(${ATRIBUTO_DE_ACAO});
    position: absolute;
    bottom: 100%;
    left: -2px;
    margin-bottom: 3px;
    padding: 0 4px;
    border-radius: 3px;
    font: 10px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
    white-space: nowrap;
    color: #fff;
    background: #e03131;
    pointer-events: none;
    z-index: 9997;
}
[${ATRIBUTO_DE_ACAO}][${ATRIBUTO_DE_CONCESSAO}="true"]::after {
    background: #2f9e44;
}
[${ATRIBUTO_DE_ACAO}][${ATRIBUTO_DE_CONCESSAO}="unknown"]::after {
    background: #868e96;
    content: attr(${ATRIBUTO_DE_ACAO}) " ?";
}
/* Vizinhos adjacentes poem os rotulos na mesma linha e um cobre o outro. Passar o mouse traz o
   de baixo para a frente, que e o gesto natural de quem esta lendo um deles. */
[${ATRIBUTO_DE_ACAO}]:hover::after {
    z-index: 9998;
}
`;
/**
 * O que se sabe da capacidade que um controle anuncia.
 *
 * <p>O terceiro valor é o que mais ensina. Um controle pode declarar um nome que <b>nenhuma tela
 * registrou</b> — foi assim que apareceu que a barra do {@code ArchbaseGridTemplate} pedia
 * `"add"` enquanto o catálogo só conhece `create`. Pintar isso de vermelho diria "você não tem
 * essa permissão", quando a verdade é "essa capacidade não existe". São problemas diferentes e
 * levam a ações diferentes.
 */
function situacaoDe(actionName: string, managers: ArchbaseSecurityManager[]): string {
    if (managers.some(m => m.hasPermission(actionName))) {
        return 'true';
    }
    const conhecida = managers.some(m =>
        m.getRegisteredActions().some(acao => acao.actionName === actionName)
        || m.getPermissions().includes(actionName));
    return conhecida ? 'false' : 'unknown';
}

/** Onde o `title` que já existia é guardado enquanto o realce o empresta. */
const ATRIBUTO_DE_TITULO_ORIGINAL = 'data-archbase-title';

/** Devolve os controles ao estado anterior — inclusive o `title` de quem já tinha um. */
function desanotar() {
    document.querySelectorAll<HTMLElement>(`[${ATRIBUTO_DE_CONCESSAO}]`).forEach(elemento => {
        elemento.removeAttribute(ATRIBUTO_DE_CONCESSAO);
        const original = elemento.getAttribute(ATRIBUTO_DE_TITULO_ORIGINAL);
        if (original !== null) {
            if (original) {
                elemento.setAttribute('title', original);
            } else {
                elemento.removeAttribute('title');
            }
            elemento.removeAttribute(ATRIBUTO_DE_TITULO_ORIGINAL);
        }
    });
}

/**
 * Anota em cada controle marcado se o usuário alcança a capacidade, e conta quantos são.
 *
 * <p>É o único trabalho de JavaScript que sobrou, e ele não é por quadro: roda uma vez ao ligar e
 * de novo quando a árvore muda. O CSS faz o resto.
 */
function useMarcados(ativo: boolean, managers: ArchbaseSecurityManager[]): number {
    const [quantidade, setQuantidade] = useState(0);
    const managersRef = useRef(managers);
    managersRef.current = managers;

    useEffect(() => {
        if (!ativo) {
            desanotar();
            setQuantidade(0);
            return;
        }

        let agendado = 0;

        const anotar = () => {
            const marcados = document.querySelectorAll<HTMLElement>(`[${ATRIBUTO_DE_ACAO}]`);
            marcados.forEach(elemento => {
                const actionName = elemento.getAttribute(ATRIBUTO_DE_ACAO);
                if (!actionName) return;
                elemento.setAttribute(ATRIBUTO_DE_CONCESSAO, situacaoDe(actionName, managersRef.current));
                // O rotulo do ::after fica preso dentro de ancestral que recorta — numa celula de
                // grade, por exemplo. O title nativo nao: o navegador o desenha fora da pagina.
                // Guarda o original para devolver ao desligar; sobrescrever e perder nao serviria.
                if (!elemento.hasAttribute(ATRIBUTO_DE_TITULO_ORIGINAL)) {
                    elemento.setAttribute(ATRIBUTO_DE_TITULO_ORIGINAL, elemento.getAttribute('title') ?? '');
                }
                elemento.setAttribute('title', actionName);
            });
            setQuantidade(marcados.length);
        };

        anotar();

        // Agrupa rajadas de mutação num quadro: abrir um modal produz dezenas de alterações, e
        // reanotar em cada uma percorreria a árvore dezenas de vezes pelo mesmo resultado.
        const observador = new MutationObserver(() => {
            if (agendado) return;
            agendado = requestAnimationFrame(() => {
                agendado = 0;
                anotar();
            });
        });
        observador.observe(document.body, { childList: true, subtree: true, attributes: true,
            attributeFilter: [ATRIBUTO_DE_ACAO] });

        return () => {
            observador.disconnect();
            if (agendado) cancelAnimationFrame(agendado);
            desanotar();
        };
    }, [ativo]);

    return quantidade;
}

export interface ArchbaseSecurityInspectorProps {
    /**
     * Se o inspetor pode ser aberto.
     *
     * <p>Ausente significa "apenas para administradores", que é o padrão deliberado: o inspetor
     * existe para descobrir o nome da capacidade que se vai conceder, e quem concede é quem
     * administra. Passar `true` o libera para qualquer usuário — útil em desenvolvimento, e uma
     * decisão consciente em produção, já que ele revela a malha de capacidades da aplicação.
     */
    enabled?: boolean;
    /**
     * O atalho que abre e fecha. Padrão: `Ctrl+Alt+A`.
     *
     * <p>`Ctrl+Alt` em vez de `Ctrl+Shift` porque a segunda combinação é reivindicada pelos
     * navegadores em quase toda letra útil.
     */
    atalho?: { ctrl?: boolean; alt?: boolean; shift?: boolean; tecla: string };
    /** Começa aberto. Útil para quem prefere um botão próprio em vez do atalho. */
    defaultOpened?: boolean;
}

/**
 * Se o evento é a tecla pedida — pela POSIÇÃO física, não pelo caractere produzido.
 *
 * <p>No macOS, Option é uma tecla de composição: `Option+A` produz `'å'`, `Option+C` produz `'ç'`.
 * Comparar `event.key` com `'a'` faz o atalho nunca casar em nenhum Mac. `event.code` descreve a
 * tecla física (`'KeyA'`) e não muda com modificador nem com layout.
 *
 * <p>`event.key` fica como reserva, para o que não é letra (`'Escape'`, `'F2'`) e para teclados cujo
 * `code` não siga o padrão.
 */
function ehATecla(evento: KeyboardEvent, tecla: string): boolean {
    if (tecla.length === 1 && /[a-z0-9]/i.test(tecla)) {
        const esperado = /[0-9]/.test(tecla) ? `Digit${tecla}` : `Key${tecla.toUpperCase()}`;
        if (evento.code === esperado) return true;
    }
    return evento.key.toLowerCase() === tecla.toLowerCase();
}

/** A faixa por onde a janela é arrastada. Classe, porque o Mantine a localiza por seletor CSS. */
const CLASSE_DA_ALCA = 'archbase-inspector-alca';

const ATALHO_PADRAO = { ctrl: true, alt: true, shift: false, tecla: 'a' };

/**
 * O inspetor de capacidades.
 *
 * <p>Monte uma vez, dentro do {@link ArchbaseSecurityProvider} e acima das telas:
 *
 * ```tsx
 * <ArchbaseSecurityProvider user={user}>
 *   <ArchbaseSecurityInspector />
 *   <SuaAplicacao />
 * </ArchbaseSecurityProvider>
 * ```
 *
 * <p>Ele responde a duas perguntas que a tela de permissões não responde: <i>qual é o nome técnico
 * da ação que eu preciso conceder</i>, e <i>quais capacidades esta tela declara</i>. Sem ele, o
 * caminho é ler o código.
 *
 * <p><b>Não participa de autorização.</b> Só lê o que os managers já sabem. Remover o componente não
 * muda o acesso de ninguém.
 */
export const ArchbaseSecurityInspector: React.FC<ArchbaseSecurityInspectorProps> = ({
    enabled,
    atalho = ATALHO_PADRAO,
    defaultOpened = false,
}) => {
    const { isAdmin } = useArchbaseSecurity();
    const permitido = enabled ?? isAdmin;

    const [aberto, setAberto] = useState<boolean>(defaultOpened && permitido);
    const [realcar, setRealcar] = useState<boolean>(false);
    const [busca, setBusca] = useState<string>('');
    const [copiada, setCopiada] = useState<string | null>(null);
    const [sobPonteiro, setSobPonteiro] = useState<boolean>(false);

    const telas = useTelasInspecionadas();
    const marcados = useMarcados(permitido && aberto && realcar, telas);

    useEffect(() => {
        if (!permitido) return;

        const aoTeclar = (evento: KeyboardEvent) => {
            if (!ehATecla(evento, atalho.tecla)) return;
            if (!!atalho.ctrl !== (evento.ctrlKey || evento.metaKey)) return;
            if (!!atalho.alt !== evento.altKey) return;
            if (!!atalho.shift !== evento.shiftKey) return;
            evento.preventDefault();
            setAberto(atual => !atual);
        };

        window.addEventListener('keydown', aoTeclar);
        return () => window.removeEventListener('keydown', aoTeclar);
    }, [permitido, atalho.tecla, atalho.ctrl, atalho.alt, atalho.shift]);

    // Fechar desliga o realce: deixá-lo ligado pintaria a tela inteira sem nada explicando por quê.
    useEffect(() => {
        if (!aberto) setRealcar(false);
    }, [aberto]);

    const grupos = useMemo(() => telas.map(manager => ({
        manager,
        recurso: manager.getResource(),
        linhas: linhasDe(manager).filter(linha => {
            const termo = busca.trim().toLowerCase();
            if (!termo) return true;
            return `${linha.actionName} ${linha.rotulo} ${linha.categoria ?? ''}`.toLowerCase().includes(termo);
        }),
    })), [telas, busca]);

    const copiar = useCallback((texto: string) => {
        const guardar = () => {
            setCopiada(texto);
            window.setTimeout(() => setCopiada(atual => (atual === texto ? null : atual)), 1500);
        };
        // `navigator.clipboard` exige contexto seguro e não existe em todo navegador; falhar em
        // silêncio deixaria o botão parecendo quebrado.
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(texto).then(guardar).catch(() => undefined);
        }
    }, []);

    if (!permitido) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
        <>
            {realcar && <style>{CSS_DO_REALCE}</style>}

            {aberto && (
                <FloatingWindow
                    shadow="md"
                    withBorder
                    p="sm"
                    /* O arraste, o limite de viewport e o redimensionamento são do Mantine. A mão
                       escrita que estava aqui reimplementava os três, pior e com mais código. */
                    dragHandleSelector={`.${CLASSE_DA_ALCA}`}
                    excludeDragHandleSelector="button"
                    constrainToViewport
                    constrainOffset={8}
                    initialPosition={{ right: 16, bottom: 16 }}
                    dimensions={{
                        initialWidth: 420,
                        minWidth: 280,
                        maxWidth: 720,
                        initialHeight: 420,
                        minHeight: 160,
                        maxHeight: 800,
                    }}
                    zIndex={9999}
                    /* Com o realce ligado, a janela apaga até o toque do mouse: o controle que se
                       quer inspecionar pode estar exatamente embaixo dela, e uma janela opaca
                       esconderia a resposta que ela mesma acabou de desenhar. */
                    onMouseEnter={() => setSobPonteiro(true)}
                    onMouseLeave={() => setSobPonteiro(false)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: realcar && !sobPonteiro ? 0.25 : 1,
                        transition: 'opacity 120ms ease',
                    }}
                >
                    <Group
                        justify="space-between"
                        wrap="nowrap"
                        mb="xs"
                        className={CLASSE_DA_ALCA}
                        style={{ cursor: 'move', touchAction: 'none', userSelect: 'none' }}
                    >
                        <Group gap={6} wrap="nowrap">
                            <IconGripVertical size={14} opacity={0.5} />
                            <Text fw={600} size="sm">{t('Action inspector')}</Text>
                        </Group>
                        <ActionIcon variant="subtle" size="sm" onClick={() => setAberto(false)} aria-label={t('Close')}>
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>

                    <TextInput
                        size="xs"
                        mb="xs"
                        placeholder={t('Filter actions')}
                        value={busca}
                        onChange={evento => setBusca(evento.currentTarget.value)}
                    />

                    <Switch
                        size="xs"
                        mb={realcar ? 4 : 'xs'}
                        checked={realcar}
                        onChange={evento => setRealcar(evento.currentTarget.checked)}
                        label={t('Highlight on screen')}
                    />

                    {/* Realce ligado e nada desenhado é o caso comum numa tela ainda não marcada, e
                        sem uma palavra aqui é indistinguível de defeito: liga-se o interruptor e a
                        tela não muda. Quem vê isto precisa saber que falta a marcação, não que o
                        inspetor quebrou. */}
                    {realcar && marcados === 0 && (
                        <Text size="10px" c="dimmed" mb="xs">
                            {t('No control marked on this screen')}
                        </Text>
                    )}
                    {realcar && marcados > 0 && (
                        <Text size="10px" c="dimmed" mb="xs">
                            {`${marcados} ${t('marked controls')}`}
                        </Text>
                    )}

                    <ScrollArea style={{ flex: 1 }}>
                        {grupos.length === 0 && (
                            <Text size="xs" c="dimmed">{t('No screen registered')}</Text>
                        )}

                        <Stack gap="md">
                            {grupos.map(({ recurso, linhas }) => (
                                <Stack key={recurso.resourceName} gap={4}>
                                    <Group gap={6} wrap="nowrap">
                                        <Text size="xs" fw={600}>{recurso.resourceDescription}</Text>
                                        <Text size="10px" c="dimmed" style={{ fontFamily: 'monospace' }}>
                                            {recurso.resourceName}
                                        </Text>
                                    </Group>

                                    {linhas.length === 0 && (
                                        <Text size="xs" c="dimmed">—</Text>
                                    )}

                                    {linhas.map(linha => (
                                        <Group key={linha.capacidade} gap={6} wrap="nowrap" align="center">
                                            <Tooltip label={linha.concedida ? t('Capability granted') : t('Capability not granted')}>
                                                {linha.concedida
                                                    ? <IconCheck size={14} color="#2f9e44" />
                                                    : <IconX size={14} color="#e03131" />}
                                            </Tooltip>

                                            {/* Sem rótulo próprio, o texto seria o identificador
                                                repetido lado a lado com a coluna técnica. */}
                                            {linha.rotulo !== linha.actionName && (
                                                <Text size="xs" style={{ flexShrink: 0 }}>{linha.rotulo}</Text>
                                            )}

                                            <Text size="10px" c="dimmed" style={{ fontFamily: 'monospace' }}>
                                                {linha.actionName}
                                            </Text>

                                            {linha.categoria && (
                                                <Badge size="xs" variant="light">{linha.categoria}</Badge>
                                            )}

                                            {linha.forasteira && (
                                                <Badge size="xs" variant="light" color="gray">
                                                    {t('Not declared by this screen')}
                                                </Badge>
                                            )}

                                            <Tooltip label={copiada === linha.capacidade ? t('Copied') : t('Copy capability')}>
                                                <ActionIcon
                                                    variant="subtle"
                                                    size="xs"
                                                    ml="auto"
                                                    onClick={() => copiar(linha.capacidade)}
                                                    aria-label={t('Copy capability')}
                                                >
                                                    {copiada === linha.capacidade
                                                        ? <IconCheck size={12} color="#2f9e44" />
                                                        : <IconCopy size={12} />}
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    ))}
                                </Stack>
                            ))}
                        </Stack>
                    </ScrollArea>

                    <FloatingWindow.ResizeHandle />
                </FloatingWindow>
            )}
        </>,
        document.body,
    );
};
