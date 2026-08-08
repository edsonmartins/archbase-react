import { Box, Paper, ScrollArea, Stack, Text, UnstyledButton } from '@mantine/core';
import { useCallback, useState } from 'react';
import { EffectiveAccessPanel } from './EffectiveAccessPanel';
import { ActionNodePanel } from './explorer/ActionNodePanel';
import { GroupNodePanel } from './explorer/GroupNodePanel';
import { SecurityTree } from './explorer/SecurityTree';
import type { ExplorerSelection } from './explorer/selection';
import { OverviewPanel } from './OverviewPanel';
import { SimulationPanel } from './SimulationPanel';
import type { ArchbaseSecurityDiagnosticsViewProps } from './types';

const PANORAMA: ExplorerSelection = { kind: 'OVERVIEW', id: 'overview', label: 'Panorama' };
const SIMULAR: ExplorerSelection = { kind: 'SIMULATE', id: 'simulate', label: 'Simular acesso' };

/**
 * A segurança do tenant como um diretório navegável — o <b>leitor</b>.
 *
 * <p>Deliberadamente separada da {@link ArchbaseSecurityView}, que é o <b>editor</b>: aquela tem uma
 * aba por tabela e serve para mudar o estado; esta responde perguntas e não escreve nada. Misturá-las
 * produziria uma tela com dois motivos para mudar.
 *
 * <p><b>Por que árvore, e não abas.</b> As três abas anteriores — panorama, efetivo e simulação —
 * respondiam três perguntas sem se conversarem: descobrir uma permissão inerte no panorama não
 * levava a lugar nenhum, e simular exigia digitar de cabeça o nome do recurso. Uma árvore de
 * objetos, no espírito de um AD, dá <b>uma</b> navegação: seleciona-se o objeto e se vê tudo sobre
 * ele, incluindo o caminho para o próximo.
 *
 * <p>Panorama e Simular continuam existindo — como nós da mesma árvore, não como abas paralelas. É
 * o que permite a simulação receber sujeito e capacidade por clique, em vez de digitação: <b>escolher
 * substitui lembrar</b>, e errar uma letra deixa de produzir um "não pode" indistinguível de uma
 * negação real.
 */
export const ArchbaseSecurityDiagnosticsView = ({
	height = '100%',
	width = '100%',
	slots,
	onError,
}: ArchbaseSecurityDiagnosticsViewProps) => {
	const [selecao, setSelecao] = useState<ExplorerSelection>(PANORAMA);
	const [simulacao, setSimulacao] = useState<{ userId?: string; resource?: string; action?: string }>({});

	/**
	 * Navegar guarda o contexto para a simulação.
	 *
	 * <p>Clicar numa pessoa e depois numa ação monta o par a ser testado sem que ninguém digite nada
	 * — e sem obrigar a pessoa a decidir de antemão que ia simular.
	 */
	const selecionar = useCallback((s: ExplorerSelection) => {
		setSelecao(s);
		if (s.kind === 'USER') {
			setSimulacao((atual) => ({ ...atual, userId: s.id }));
		}
		if (s.kind === 'ACTION') {
			// O par completo: a ação é o rótulo do nó, o recurso é o pai na árvore. Sem os dois,
			// quem testa continua digitando — e digitar é a origem do falso negativo.
			setSimulacao((atual) => ({ ...atual, action: s.label, resource: s.parentLabel }));
		}
	}, []);

	const irParaPessoa = useCallback(
		(userId: string, label: string) => selecionar({ kind: 'USER', id: userId, label }),
		[selecionar],
	);

	const atalho = (alvo: ExplorerSelection) => (
		<UnstyledButton
			key={alvo.id}
			onClick={() => setSelecao(alvo)}
			aria-current={selecao.kind === alvo.kind ? 'true' : undefined}
			style={{
				display: 'block',
				width: '100%',
				padding: '6px 8px',
				borderRadius: 5,
				background: selecao.kind === alvo.kind ? 'var(--mantine-color-blue-light)' : undefined,
			}}>
			<Text size="sm" fw={selecao.kind === alvo.kind ? 600 : 500}>
				{alvo.label}
			</Text>
		</UnstyledButton>
	);

	const painel = () => {
		switch (selecao.kind) {
			case 'OVERVIEW':
				return <OverviewPanel slots={slots} onError={onError} />;
			case 'SIMULATE':
				return <SimulationPanel slots={slots} onError={onError} initial={simulacao} />;
			case 'USER':
				return <EffectiveAccessPanel slots={slots} onError={onError} userId={selecao.id} />;
			case 'GROUP':
				return <GroupNodePanel id={selecao.id} kind="GROUP" slots={slots} onSelectUser={irParaPessoa} />;
			case 'PROFILE':
				return <GroupNodePanel id={selecao.id} kind="PROFILE" slots={slots} onSelectUser={irParaPessoa} />;
			case 'ACTION':
				return (
					<ActionNodePanel
						id={selecao.id}
						label={selecao.parentLabel ? `${selecao.parentLabel} · ${selecao.label}` : selecao.label}
						slots={slots}
						onSelectUser={irParaPessoa}
						onSimulate={() => setSelecao(SIMULAR)}
					/>
				);
			case 'RESOURCE':
				return (
					<Stack gap="xs">
						<Text fw={620} size="xl" ff="monospace">
							{selecao.label}
						</Text>
						<Text size="sm" c="dimmed">
							Abra o recurso na árvore para ver as ações. Cada ação responde quem alcança.
						</Text>
					</Stack>
				);
			default:
				return <OverviewPanel slots={slots} onError={onError} />;
		}
	};

	return (
		// Grid CSS explícito em vez do <Grid> do Mantine: a coluna da árvore tem largura própria e
		// não uma fração de doze, e o `minmax(0, 1fr)` é o que impede uma tabela larga no painel de
		// empurrar a árvore para fora da tela.
		<Box
			style={{
				width,
				// `height` só resolve quando o contêiner de cima tem altura definida — e o padrão de
				// quem embute a view é não ter. O minHeight em vh garante que a árvore ocupe a tela
				// mesmo assim; sem ele o painel encolhe até o conteúdo e sobra metade da tela vazia.
				height,
				minHeight: 'calc(100vh - 190px)',
				display: 'grid',
				gridTemplateColumns: 'minmax(240px, 300px) minmax(0, 1fr)',
				gap: 'var(--mantine-spacing-md)',
				alignItems: 'stretch',
			}}
			className="archbase-security-explorer">
			<Paper
				withBorder
				radius="md"
				p="xs"
				style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
				<Stack gap={2} style={{ flex: 1, minHeight: 0 }}>
					{slots?.renderUserSearch ? (
						<Box mb={4}>
							{slots.renderUserSearch((idOuEmail) =>
								selecionar({ kind: 'USER', id: idOuEmail, label: idOuEmail }),
							)}
						</Box>
					) : null}
					{atalho(PANORAMA)}
					{atalho(SIMULAR)}
					<Box my={6} style={{ borderTop: '1px solid var(--mantine-color-default-border)' }} />
					{/* flex:1 em vez de altura fixa: a árvore acompanha a janela, e a rolagem fica
					    NELA — rolar a página inteira levaria o painel de propriedades junto. */}
					<ScrollArea type="hover" style={{ flex: 1, minHeight: 0 }}>
						<SecurityTree selected={selecao} onSelect={selecionar} />
					</ScrollArea>
				</Stack>
			</Paper>

			<Paper
				withBorder
				radius="md"
				p="md"
				style={{ minWidth: 0, minHeight: 0, overflowY: 'auto' }}>
				{painel()}
			</Paper>
		</Box>
	);
};
