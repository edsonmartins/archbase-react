import { ARCHBASE_IOC_API_TYPE } from '@archbase/core';
import { useArchbaseRemoteServiceApi } from '@archbase/data';
import type { ArchbaseGroupReport, ArchbaseSecurityDiagnosticsService } from '@archbase/security';
import { Alert, Badge, Group, Loader, Stack, Table, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Section } from '../DiagnosticPrimitives';
import type { ArchbaseSecurityDiagnosticsSlots } from '../types';
import { situacaoBadge } from './situacao';
import { TabelaRolavel } from './TabelaRolavel';

export interface GroupNodePanelProps {
	id: string;
	slots?: ArchbaseSecurityDiagnosticsSlots;
	/** `PROFILE` troca o endpoint e o texto; a forma da resposta é a mesma de propósito. */
	kind: 'GROUP' | 'PROFILE';
	onSelectUser?: (userId: string, label: string) => void;
}

/**
 * O que uma via concede, e quem está nela.
 *
 * <p><b>Os dois juntos porque separados enganam.</b> Ver o que o grupo concede não diz o que seus
 * membros podem: cada um acumula o perfil, os outros grupos e as concessões diretas. Um grupo com
 * três capacidades pode ter um membro que faz tudo, por outra via — e é o total que decide o acesso.
 *
 * <p>Grupo e perfil compartilham este painel de propósito: para quem lê, é a mesma pergunta, muda só
 * a via. Duas telas obrigariam a aprender duas coisas para uma ideia.
 */
export const GroupNodePanel = ({ id, kind, slots, onSelectUser }: GroupNodePanelProps) => {
	const service = useArchbaseRemoteServiceApi<ArchbaseSecurityDiagnosticsService>(
		ARCHBASE_IOC_API_TYPE.SecurityDiagnostics,
	);
	const [relatorio, setRelatorio] = useState<ArchbaseGroupReport | undefined>();
	const [carregando, setCarregando] = useState(true);
	const [erro, setErro] = useState<string | undefined>();

	useEffect(() => {
		let cancelado = false;
		setCarregando(true);
		setErro(undefined);
		const busca = kind === 'GROUP' ? service.getGroup(id) : service.getProfile(id);
		busca
			.then((r) => {
				if (!cancelado) setRelatorio(r);
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
	}, [service, id, kind]);

	if (carregando) {
		return (
			<Group gap={8}>
				<Loader size="sm" />
				<Text size="sm" c="dimmed">
					Carregando…
				</Text>
			</Group>
		);
	}
	if (erro) {
		return (
			<Alert color="red" title="Erro ao carregar">
				{erro}
			</Alert>
		);
	}
	if (!relatorio) {
		return null;
	}

	const rotuloDaVia = kind === 'GROUP' ? 'grupo' : 'perfil';
	const colunasExtras = slots?.additionalMemberColumns ?? [];

	return (
		<Stack gap="lg">
			<Stack gap={4}>
				<Group gap={8}>
					<Text fw={620} size="xl">
						{relatorio.groupName}
					</Text>
					<Badge variant="light">{rotuloDaVia}</Badge>
				</Group>
				{relatorio.description ? (
					<Text size="sm" c="dimmed">
						{relatorio.description}
					</Text>
				) : null}
			</Stack>

			<Section
				title="Membros"
				hint={`${relatorio.members.length} — o total de cada um soma todas as origens`}>
				{relatorio.members.length === 0 ? (
					<Text size="sm" c="dimmed">
						Ninguém está {kind === 'GROUP' ? 'neste grupo' : 'com este perfil'}.
					</Text>
				) : (
					<TabelaRolavel>
					<Table striped highlightOnHover withTableBorder stickyHeader>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Pessoa</Table.Th>
								<Table.Th>Perfil</Table.Th>
								<Table.Th ta="right">Concedidas</Table.Th>
								<Table.Th ta="right">Valem</Table.Th>
								<Table.Th ta="right">Não valem</Table.Th>
								<Table.Th ta="right">Bloqueadas</Table.Th>
								{colunasExtras.map((c) => (
									<Table.Th key={c.header}>{c.header}</Table.Th>
								))}
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{relatorio.members.map((m) => (
								<Table.Tr
									key={m.userId}
									style={{ cursor: onSelectUser ? 'pointer' : undefined }}
									onClick={() => onSelectUser?.(m.userId, m.name)}>
									<Table.Td>
										<Stack gap={0}>
											<Group gap={6}>
												<Text size="sm" fw={550}>
													{m.name}
												</Text>
												{m.administrator ? (
													<Badge size="xs" color="yellow" variant="light">
														administrador
													</Badge>
												) : null}
												{!m.enabled ? (
													<Badge size="xs" color="red" variant="light">
														desativada
													</Badge>
												) : null}
											</Group>
											<Text size="xs" c="dimmed">
												{m.email}
											</Text>
										</Stack>
									</Table.Td>
									<Table.Td>
										<Text size="xs" c="dimmed">
											{m.profileName ?? '—'}
										</Text>
									</Table.Td>
									<Table.Td ta="right">{m.total}</Table.Td>
									<Table.Td ta="right" c="green">
										{m.effective}
									</Table.Td>
									<Table.Td ta="right" c="yellow.7">
										{m.inert}
									</Table.Td>
									<Table.Td ta="right" c="red">
										{m.denied}
									</Table.Td>
									{colunasExtras.map((c) => (
										<Table.Td key={c.header}>{c.render(m, relatorio)}</Table.Td>
									))}
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
					</TabelaRolavel>
				)}
				<Text size="xs" c="dimmed" lh={1.5}>
					O total do membro não é o total {kind === 'GROUP' ? 'do grupo' : 'do perfil'}: ele soma o
					que vem de outras vias. Clique numa pessoa para ver a lista dela.
				</Text>
			</Section>

			<Section title={`O que este ${rotuloDaVia} concede`} hint="a parte que é responsabilidade dele">
				{relatorio.grants.length === 0 ? (
					<Text size="sm" c="dimmed">
						Nada concedido por esta via.
					</Text>
				) : (
					<TabelaRolavel>
					<Table striped withTableBorder stickyHeader>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Capacidade</Table.Th>
								<Table.Th>Situação</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{relatorio.grants.map((g, i) => (
								<Table.Tr key={`${g.resource}-${g.action}-${i}`}>
									<Table.Td>
										<Text size="sm" ff="monospace">
											{g.resource} · {g.action}
										</Text>
									</Table.Td>
									<Table.Td>{situacaoBadge(g.situation)}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
					</TabelaRolavel>
				)}
			</Section>

			{slots?.afterGroupMembers?.(relatorio)}
		</Stack>
	);
};
