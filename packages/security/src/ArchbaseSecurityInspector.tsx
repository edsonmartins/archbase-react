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
    Box,
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
import { ATRIBUTO_DE_ACAO } from './marcacaoDeAcao';
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

/** Um retângulo a desenhar sobre um controle marcado. */
interface Realce {
    chave: string;
    actionName: string;
    concedida: boolean;
    topo: number;
    esquerda: number;
    largura: number;
    altura: number;
}

/**
 * Mede os controles marcados com {@link archbaseActionProps}.
 *
 * <p>A medição roda em `requestAnimationFrame` enquanto o realce está ligado, em vez de reagir a
 * scroll, resize e mutação separadamente. É mais trabalho por quadro e é o certo aqui: o realce é
 * um momento deliberado de inspeção, dura segundos, e qualquer conjunto de ouvintes deixaria de
 * fora algum caso — menu que abre, linha de tabela que entra, painel que anima.
 */
function useRealces(ativo: boolean, managers: ArchbaseSecurityManager[]): Realce[] {
    const [realces, setRealces] = useState<Realce[]>([]);
    const managersRef = useRef(managers);
    managersRef.current = managers;

    useEffect(() => {
        if (!ativo) {
            setRealces([]);
            return;
        }

        let vivo = true;
        let quadro = 0;

        const medir = () => {
            if (!vivo) return;

            const encontrados: Realce[] = [];
            document.querySelectorAll<HTMLElement>(`[${ATRIBUTO_DE_ACAO}]`).forEach((elemento, indice) => {
                const actionName = elemento.getAttribute(ATRIBUTO_DE_ACAO);
                if (!actionName) return;

                const caixa = elemento.getBoundingClientRect();
                // Elemento oculto mede zero. Desenhar sobre ele produziria um badge solto no canto
                // superior esquerdo, sem nada por baixo.
                if (caixa.width === 0 && caixa.height === 0) return;

                const concedida = managersRef.current.some(m => m.hasPermission(actionName));
                encontrados.push({
                    chave: `${actionName}:${indice}`,
                    actionName,
                    concedida,
                    topo: caixa.top,
                    esquerda: caixa.left,
                    largura: caixa.width,
                    altura: caixa.height,
                });
            });

            setRealces(anteriores =>
                anteriores.length === encontrados.length &&
                anteriores.every((a, i) =>
                    a.chave === encontrados[i].chave &&
                    a.topo === encontrados[i].topo &&
                    a.esquerda === encontrados[i].esquerda &&
                    a.largura === encontrados[i].largura &&
                    a.altura === encontrados[i].altura &&
                    a.concedida === encontrados[i].concedida)
                    ? anteriores
                    : encontrados);

            quadro = requestAnimationFrame(medir);
        };

        quadro = requestAnimationFrame(medir);
        return () => {
            vivo = false;
            cancelAnimationFrame(quadro);
        };
    }, [ativo]);

    return realces;
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
    const realces = useRealces(permitido && aberto && realcar, telas);

    useEffect(() => {
        if (!permitido) return;

        const aoTeclar = (evento: KeyboardEvent) => {
            if (evento.key.toLowerCase() !== atalho.tecla.toLowerCase()) return;
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
            {realcar && (
                <Box
                    style={{
                        position: 'fixed',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 9998,
                    }}
                >
                    {realces.map(realce => (
                        <Box
                            key={realce.chave}
                            style={{
                                position: 'absolute',
                                top: realce.topo,
                                left: realce.esquerda,
                                width: realce.largura,
                                height: realce.altura,
                                border: `2px solid ${realce.concedida ? '#2f9e44' : '#e03131'}`,
                                borderRadius: 4,
                                boxShadow: '0 0 0 1px rgba(255,255,255,0.6)',
                            }}
                        >
                            <Text
                                size="10px"
                                style={{
                                    position: 'absolute',
                                    top: -16,
                                    left: -2,
                                    padding: '0 4px',
                                    borderRadius: 3,
                                    whiteSpace: 'nowrap',
                                    fontFamily: 'monospace',
                                    color: '#fff',
                                    backgroundColor: realce.concedida ? '#2f9e44' : '#e03131',
                                }}
                            >
                                {realce.actionName}
                            </Text>
                        </Box>
                    ))}
                </Box>
            )}

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
                        mb="xs"
                        checked={realcar}
                        onChange={evento => setRealcar(evento.currentTarget.checked)}
                        label={t('Highlight on screen')}
                    />

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
