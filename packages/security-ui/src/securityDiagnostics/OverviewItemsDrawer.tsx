import { useArchbaseRemoteServiceApi } from '@archbase/data';
import { ARCHBASE_IOC_API_TYPE } from '@archbase/core';
import type {
	ArchbaseOverviewItem,
	ArchbaseOverviewMetric,
	ArchbaseSecurityDiagnosticsService,
} from '@archbase/security';
import { Alert, Badge, Drawer, Group, Loader, Pagination, Stack, Table, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { ArchbaseDiagnosticCard } from './types';

const TAMANHO_DA_PAGINA = 25;

export interface OverviewItemsDrawerProps {
	/** O cartão clicado. `null` mantém o painel fechado. */
	card: ArchbaseDiagnosticCard | null;
	onClose: () => void;
}

/**
 * A lista por trás de um número do Panorama.
 *
 * <p>Um cartão diz "29 ações inativas". Sozinho, isso informa que existe um problema e não permite
 * fazer nada a respeito — para agir é preciso saber <b>quais</b> são, e por quê. Este painel é o que
 * transforma o Panorama de tela de leitura em ponto de partida de trabalho.
 *
 * <p>É um só para as seis métricas, e não seis listas: o backend devolve a mesma forma
 * ({@code label} / {@code detail} / {@code reason}) para permissões, usuários, ações e recursos.
 * Seis telas divergiriam com o tempo; esta acompanha qualquer métrica nova sem alteração.
 */
export const OverviewItemsDrawer = ({ card, onClose }: OverviewItemsDrawerProps) => {
	const service = useArchbaseRemoteServiceApi<ArchbaseSecurityDiagnosticsService>(
		ARCHBASE_IOC_API_TYPE.SecurityDiagnostics,
	);

	const [itens, setItens] = useState<ArchbaseOverviewItem[]>([]);
	const [pagina, setPagina] = useState(1);
	const [totalDePaginas, setTotalDePaginas] = useState(1);
	const [total, setTotal] = useState(0);
	const [carregando, setCarregando] = useState(false);
	const [erro, setErro] = useState<string | null>(null);

	const metric = card?.metric;

	// Trocar de cartão precisa voltar para a primeira página: manter a página do cartão anterior
	// mostraria "página 3 de 1" e uma lista vazia.
	useEffect(() => {
		setPagina(1);
	}, [metric]);

	useEffect(() => {
		if (!metric) {
			return;
		}
		let cancelado = false;
		setCarregando(true);
		setErro(null);
		service
			.getOverviewItems(metric as ArchbaseOverviewMetric, pagina - 1, TAMANHO_DA_PAGINA)
			.then((resultado) => {
				// A resposta de um pedido antigo não pode sobrescrever a do atual: sem esta guarda,
				// clicar rápido entre cartões deixa a lista mostrando a métrica errada.
				if (cancelado) {
					return;
				}
				setItens(resultado.content ?? []);
				setTotal(resultado.totalElements ?? 0);
				setTotalDePaginas(Math.max(resultado.totalPages ?? 1, 1));
			})
			.catch((e: unknown) => {
				if (!cancelado) {
					setErro(e instanceof Error ? e.message : 'Não foi possível carregar os itens.');
				}
			})
			.finally(() => {
				if (!cancelado) {
					setCarregando(false);
				}
			});
		return () => {
			cancelado = true;
		};
	}, [service, metric, pagina]);

	return (
		<Drawer
			opened={Boolean(card)}
			onClose={onClose}
			position="right"
			size="xl"
			title={
				<Stack gap={2}>
					<Text fw={600}>{card?.label}</Text>
					{card?.description ? (
						<Text size="xs" c="dimmed" lh={1.4}>
							{card.description}
						</Text>
					) : null}
				</Stack>
			}>
			<Stack gap="sm">
				<Group gap={8}>
					<Badge variant="light">{total} {total === 1 ? 'item' : 'itens'}</Badge>
					{carregando ? <Loader size="xs" /> : null}
				</Group>

				{erro ? (
					<Alert color="red" title="Erro ao carregar">
						{erro}
					</Alert>
				) : null}

				{!carregando && !erro && itens.length === 0 ? (
					<Text size="sm" c="dimmed">
						Nada aqui — o número é zero.
					</Text>
				) : null}

				{itens.length > 0 ? (
					<Table striped highlightOnHover withTableBorder>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Item</Table.Th>
								<Table.Th>Onde</Table.Th>
								<Table.Th>Por que está aqui</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{itens.map((item) => (
								<Table.Tr key={item.id}>
									<Table.Td>
										<Text size="sm" fw={550}>
											{item.label}
										</Text>
									</Table.Td>
									<Table.Td>
										<Text size="xs" c="dimmed">
											{item.detail}
										</Text>
									</Table.Td>
									<Table.Td>
										<Text size="xs">{item.reason}</Text>
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				) : null}

				{totalDePaginas > 1 ? (
					<Group justify="center">
						<Pagination value={pagina} onChange={setPagina} total={totalDePaginas} size="sm" />
					</Group>
				) : null}
			</Stack>
		</Drawer>
	);
};
