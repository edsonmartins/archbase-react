import { ARCHBASE_IOC_API_TYPE } from '@archbase/core';
import { useArchbaseRemoteServiceApi } from '@archbase/data';
import type {
	ArchbaseSecurityDiagnosticsService,
	ArchbaseTreeBranch,
	ArchbaseTreeNode,
} from '@archbase/security';
import { Badge, Box, Group, Loader, Text, TextInput, UnstyledButton } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ExplorerSelection } from './selection';

const TAMANHO_DA_PAGINA = 50;

/** Os ramos fixos do topo. A ordem é a de quem investiga: pessoa primeiro, catálogo por último. */
const RAMOS: { branch: ArchbaseTreeBranch; label: string }[] = [
	{ branch: 'USERS', label: 'Pessoas' },
	{ branch: 'GROUPS', label: 'Grupos' },
	{ branch: 'PROFILES', label: 'Perfis' },
	{ branch: 'RESOURCES', label: 'Recursos' },
];

interface EstadoDoRamo {
	nodes: ArchbaseTreeNode[];
	total: number;
	carregando: boolean;
	carregouTudo: boolean;
	erro?: string;
}

const VAZIO: EstadoDoRamo = { nodes: [], total: 0, carregando: false, carregouTudo: false };

/**
 * A seta de abrir e fechar.
 *
 * <p>Desenhada, e não um caractere de texto: o glifo ▸ herda o tamanho da fonte e sai minúsculo,
 * quase invisível numa árvore de linhas compactas. Um triângulo em CSS tem tamanho próprio, gira
 * suave ao abrir e respeita quem pediu menos animação.
 */
const Seta = ({ aberta }: { aberta: boolean }) => (
	<Box
		aria-hidden
		style={{
			width: 14,
			height: 14,
			flex: 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}>
		<Box
			style={{
				width: 0,
				height: 0,
				borderLeft: '5px solid currentColor',
				borderTop: '4px solid transparent',
				borderBottom: '4px solid transparent',
				opacity: 0.55,
				transform: aberta ? 'rotate(90deg)' : 'none',
				transformOrigin: '2px 4px',
				transition: 'transform 130ms ease',
			}}
		/>
	</Box>
);

export interface SecurityTreeProps {
	selected: ExplorerSelection | null;
	onSelect: (selecao: ExplorerSelection) => void;
}

/**
 * A árvore de objetos de segurança.
 *
 * <p><b>Carrega por demanda, ramo a ramo.</b> Um tenant real tem centenas de recursos e ações;
 * montar a árvore inteira numa carga obriga o servidor a materializar o catálogo para exibir cinco
 * linhas, e trava o navegador ao renderizar. Cada ramo busca ao abrir, e a busca vai para o
 * servidor — filtrar no cliente exigiria ter carregado tudo antes, que é o problema que a
 * paginação existe para evitar.
 *
 * <p>O marcador colorido no nó vem do servidor e é o que leva o olho até onde há problema. Sem ele,
 * achar um recurso com ação desativada entre uma centena exige abrir ramo por ramo — e ninguém faz
 * isso.
 */
export const SecurityTree = ({ selected, onSelect }: SecurityTreeProps) => {
	const service = useArchbaseRemoteServiceApi<ArchbaseSecurityDiagnosticsService>(
		ARCHBASE_IOC_API_TYPE.SecurityDiagnostics,
	);

	const [busca, setBusca] = useState('');
	// Sem o atraso, cada tecla vira uma requisição por ramo aberto.
	const [buscaAplicada] = useDebouncedValue(busca, 300);

	const [abertos, setAbertos] = useState<Record<string, boolean>>({});
	const [ramos, setRamos] = useState<Record<string, EstadoDoRamo>>({});

	const chaveDe = (branch: ArchbaseTreeBranch, parentId?: string) =>
		parentId ? `${branch}:${parentId}` : branch;

	const carregar = useCallback(
		async (branch: ArchbaseTreeBranch, parentId: string | undefined, proximaPagina: boolean) => {
			const chave = chaveDe(branch, parentId);
			const atual = ramos[chave] ?? VAZIO;
			if (atual.carregando || (proximaPagina && atual.carregouTudo)) {
				return;
			}
			const pagina = proximaPagina ? Math.floor(atual.nodes.length / TAMANHO_DA_PAGINA) : 0;

			setRamos((r) => ({ ...r, [chave]: { ...(r[chave] ?? VAZIO), carregando: true, erro: undefined } }));
			try {
				const resultado = await service.browse(branch, {
					parentId,
					q: buscaAplicada || undefined,
					page: pagina,
					size: TAMANHO_DA_PAGINA,
				});
				setRamos((r) => {
					const anterior = proximaPagina ? (r[chave]?.nodes ?? []) : [];
					const nodes = [...anterior, ...(resultado.content ?? [])];
					return {
						...r,
						[chave]: {
							nodes,
							total: resultado.totalElements ?? nodes.length,
							carregando: false,
							carregouTudo: nodes.length >= (resultado.totalElements ?? 0),
						},
					};
				});
			} catch (e: unknown) {
				setRamos((r) => ({
					...r,
					[chave]: {
						...(r[chave] ?? VAZIO),
						carregando: false,
						erro: e instanceof Error ? e.message : 'Não foi possível carregar.',
					},
				}));
			}
		},
		[service, buscaAplicada, ramos],
	);

	// Buscar reabre e recarrega o que está aberto: manter o resultado antigo mostraria a árvore
	// filtrada por um termo que já não está na caixa.
	useEffect(() => {
		setRamos({});
		if (buscaAplicada) {
			const todos: Record<string, boolean> = {};
			RAMOS.forEach((r) => {
				todos[r.branch] = true;
			});
			setAbertos((a) => ({ ...a, ...todos }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buscaAplicada]);

	useEffect(() => {
		RAMOS.forEach((r) => {
			if (abertos[r.branch] && !ramos[r.branch]) {
				void carregar(r.branch, undefined, false);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [abertos, ramos, buscaAplicada]);

	const alternar = (chave: string) => setAbertos((a) => ({ ...a, [chave]: !a[chave] }));

	const corDaSeveridade = (s?: string | null) =>
		s === 'critical' ? 'red' : s === 'warning' ? 'yellow' : undefined;

	const renderNo = (node: ArchbaseTreeNode, nivel: number, paiLabel?: string) => {
		const chaveFilhos = chaveDe('ACTIONS_OF_RESOURCE', node.id);
		const aberto = Boolean(abertos[chaveFilhos]);
		const filhos = ramos[chaveFilhos];
		const selecionado =
			selected?.kind === node.kind && selected?.id === node.id;

		return (
			<Box key={`${node.kind}-${node.id}`}>
				<UnstyledButton
					onClick={() => {
						onSelect({ kind: node.kind, id: node.id, label: node.label, parentLabel: paiLabel });
						if (node.hasChildren) {
							alternar(chaveFilhos);
							if (!filhos) {
								void carregar('ACTIONS_OF_RESOURCE', node.id, false);
							}
						}
					}}
					aria-current={selecionado ? 'true' : undefined}
					aria-expanded={node.hasChildren ? aberto : undefined}
					style={{
						display: 'block',
						width: '100%',
						padding: '5px 8px',
						paddingLeft: 8 + nivel * 14,
						borderRadius: 5,
						background: selecionado ? 'var(--mantine-color-blue-light)' : undefined,
					}}>
					<Group gap={7} wrap="nowrap">
						{node.severity ? (
							<Badge size="xs" circle color={corDaSeveridade(node.severity)} />
						) : (
							<Box w={8} />
						)}
						<Text size="sm" fw={selecionado ? 600 : 400} truncate style={{ flex: 1 }}>
							{node.label}
						</Text>
						{node.badge ? (
							<Text size="xs" c="dimmed" ff="monospace">
								{node.badge}
							</Text>
						) : null}
					</Group>
				</UnstyledButton>

				{node.hasChildren && aberto ? (
					<Box>
						{filhos?.nodes.map((f) => renderNo(f, nivel + 1, node.label))}
						{filhos?.carregando ? (
							<Group gap={6} pl={8 + (nivel + 1) * 14} py={4}>
								<Loader size="xs" />
								<Text size="xs" c="dimmed">
									carregando…
								</Text>
							</Group>
						) : null}
						{filhos && !filhos.erro && !filhos.carregouTudo && !filhos.carregando
							&& filhos.total > filhos.nodes.length ? (
							<UnstyledButton
								onClick={() => void carregar('ACTIONS_OF_RESOURCE', node.id, true)}
								style={{ paddingLeft: 8 + (nivel + 1) * 14, paddingTop: 3, paddingBottom: 3 }}>
								<Text size="xs" c="blue">
									mais {filhos.total - filhos.nodes.length} →
								</Text>
							</UnstyledButton>
						) : null}
					</Box>
				) : null}
			</Box>
		);
	};

	const ramosVisiveis = useMemo(() => RAMOS, []);

	return (
		<Box>
			<TextInput
				size="xs"
				placeholder="Buscar pessoa, grupo, capacidade…"
				value={busca}
				onChange={(e) => setBusca(e.currentTarget.value)}
				aria-label="Buscar na árvore"
				mb="xs"
				rightSection={busca && busca !== buscaAplicada ? <Loader size="xs" /> : null}
			/>

			{ramosVisiveis.map((r) => {
				const aberto = Boolean(abertos[r.branch]);
				const estado = ramos[r.branch];
				return (
					<Box key={r.branch} mb={2}>
						<UnstyledButton
							onClick={() => {
								alternar(r.branch);
								if (!estado) {
									void carregar(r.branch, undefined, false);
								}
							}}
							aria-expanded={aberto}
							style={{ display: 'block', width: '100%', padding: '5px 8px', borderRadius: 5 }}>
							<Group gap={7} wrap="nowrap">
								<Seta aberta={aberto} />
								<Text size="sm" fw={600} style={{ flex: 1 }}>
									{r.label}
								</Text>
								{estado ? (
									<Text size="xs" c="dimmed" ff="monospace">
										{estado.total}
									</Text>
								) : null}
							</Group>
						</UnstyledButton>

						{aberto ? (
							<Box>
								{estado?.erro ? (
									<Text size="xs" c="red" pl={22} py={4}>
										{estado.erro}
									</Text>
								) : null}
								{estado?.nodes.map((n) => renderNo(n, 1))}
								{estado?.carregando ? (
									<Group gap={6} pl={22} py={4}>
										<Loader size="xs" />
										<Text size="xs" c="dimmed">
											carregando…
										</Text>
									</Group>
								) : null}
								{estado && !estado.erro && !estado.carregouTudo && !estado.carregando
								&& estado.total > estado.nodes.length ? (
									<UnstyledButton
										onClick={() => void carregar(r.branch, undefined, true)}
										style={{ paddingLeft: 22, paddingTop: 3, paddingBottom: 3 }}>
										<Text size="xs" c="blue">
											mais {estado.total - estado.nodes.length} →
										</Text>
									</UnstyledButton>
								) : null}
								{estado && !estado.erro && estado.nodes.length === 0 && !estado.carregando ? (
									<Text size="xs" c="dimmed" pl={22} py={4}>
										{buscaAplicada ? 'Nada encontrado.' : 'Vazio.'}
									</Text>
								) : null}
							</Box>
						) : null}
					</Box>
				);
			})}
		</Box>
	);
};
