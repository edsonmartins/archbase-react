import { ARCHBASE_IOC_API_TYPE } from '@archbase/core';
import { useArchbaseRemoteServiceApi } from '@archbase/data';
import type { ArchbaseReachEntry, ArchbaseSecurityDiagnosticsService } from '@archbase/security';
import { Alert, Badge, Group, Loader, Stack, Table, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Section } from '../DiagnosticPrimitives';
import type { ArchbaseSecurityDiagnosticsSlots } from '../types';
import { situacaoBadge } from './situacao';
import { FiltroDeLista, useFiltroDeTexto } from './FiltroDeLista';
import { TabelaRolavel } from './TabelaRolavel';

export interface ActionNodePanelProps {
	id: string;
	label: string;
	slots?: ArchbaseSecurityDiagnosticsSlots;
	onSelectUser?: (userId: string, label: string) => void;
	onSimulate?: () => void;
}

/**
 * Quem alcança esta capacidade — a consulta reversa.
 *
 * <p><b>A pergunta que antes não tinha resposta.</b> "Quem consegue aprovar custo?" só se
 * respondia abrindo grupo por grupo no admin e cruzando na cabeça, com resultado que dependia de
 * quem cruzou.
 *
 * <p>Administrador aparece na lista com a via marcada. Ele alcança sem concessão nenhuma, e
 * omiti-lo daria a resposta errada justamente para as contas que mais importam numa auditoria.
 */
export const ActionNodePanel = ({ id, label, slots, onSelectUser, onSimulate }: ActionNodePanelProps) => {
	const service = useArchbaseRemoteServiceApi<ArchbaseSecurityDiagnosticsService>(
		ARCHBASE_IOC_API_TYPE.SecurityDiagnostics,
	);
	const [quem, setQuem] = useState<ArchbaseReachEntry[]>([]);

	// Uma ação usada por muita gente devolve uma lista longa, e a pergunta costuma ser sobre uma
	// pessoa ou uma via específica — procurar pelo nome é mais direto que percorrer.
	const {
		filtro: filtroDeQuem,
		setFiltro: setFiltroDeQuem,
		filtrados: quemFiltrado,
	} = useFiltroDeTexto(quem, (q) => [q.userName, q.email, q.via]);
	const [carregando, setCarregando] = useState(true);
	const [erro, setErro] = useState<string | undefined>();

	useEffect(() => {
		let cancelado = false;
		setCarregando(true);
		setErro(undefined);
		service
			.getReach(id)
			.then((r) => {
				if (!cancelado) setQuem(r ?? []);
			})
			.catch((e: unknown) => {
				if (!cancelado) setErro(e instanceof Error ? e.message : 'Não foi possível carregar.');
			})
			.finally(() => {
				if (!cancelado) setCarregando(false);
			});
		return () => {
			cancelado = true;
		};
	}, [service, id]);

	const porAtalho = quem.filter((q) => q.kind === 'ADMINISTRADOR').length;

	return (
		<Stack gap="lg">
			<Stack gap={4}>
				<Text fw={620} size="xl" ff="monospace">
					{label}
				</Text>
				<Text size="sm" c="dimmed">
					Quem alcança esta capacidade, e por qual via.
				</Text>
			</Stack>

			{erro ? (
				<Alert color="red" title="Erro ao carregar">
					{erro}
				</Alert>
			) : null}

			<Section
				title="Quem alcança"
				hint={carregando ? 'carregando…' : `${quem.length} ${quem.length === 1 ? 'pessoa' : 'pessoas'}`}>
				{carregando ? (
					<Loader size="sm" />
				) : quem.length === 0 ? (
					<Text size="sm" c="dimmed">
						Ninguém. A capacidade existe no catálogo e nunca foi concedida.
					</Text>
				) : (
					<>
						<FiltroDeLista
							value={filtroDeQuem}
							onChange={setFiltroDeQuem}
							assunto="pessoas"
							visiveis={quemFiltrado.length}
							total={quem.length}
						/>
						<TabelaRolavel>
					<Table striped highlightOnHover withTableBorder stickyHeader>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Pessoa</Table.Th>
									<Table.Th>Por qual via</Table.Th>
									<Table.Th>Situação</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{quemFiltrado.map((q) => (
									<Table.Tr
										key={q.userId}
										style={{ cursor: onSelectUser ? 'pointer' : undefined }}
										onClick={() => onSelectUser?.(q.userId, q.userName)}>
										<Table.Td>
											<Stack gap={0}>
												<Text size="sm" fw={550}>
													{q.userName}
												</Text>
												<Text size="xs" c="dimmed">
													{q.email}
												</Text>
											</Stack>
										</Table.Td>
										<Table.Td>
											<Group gap={6}>
												<Text size="xs" c="dimmed">
													{q.via}
												</Text>
												{q.kind === 'ADMINISTRADOR' ? (
													<Badge size="xs" color="yellow" variant="light">
														atalho
													</Badge>
												) : null}
											</Group>
										</Table.Td>
										<Table.Td>{situacaoBadge(q.situation)}</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</TabelaRolavel>

						{porAtalho > 0 ? (
							<Text size="xs" c="dimmed" lh={1.5}>
								{porAtalho === 1 ? 'Uma conta alcança' : `${porAtalho} contas alcançam`} pelo atalho de
								administrador — sem concessão nenhuma. Revisar permissões não muda o que elas podem.
							</Text>
						) : null}
					</>
				)}
			</Section>

			{slots?.afterReachList?.(id, quem)}

			{onSimulate ? (
				<Text size="xs" c="dimmed">
					Para testar uma pessoa específica contra esta capacidade, use <strong>Simular</strong> na
					árvore — ela já vem escolhida.
				</Text>
			) : null}
		</Stack>
	);
};
