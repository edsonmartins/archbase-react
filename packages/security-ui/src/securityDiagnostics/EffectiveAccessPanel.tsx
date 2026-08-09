/**
 * Efetivo do usuário — o que a pessoa realmente pode, com a origem de cada concessão.
 *
 * <p>A coluna <b>Origem</b> é a razão de a tela existir: a consulta de autorização devolve
 * sim/não, e sem saber de onde veio o acesso o diagnóstico vira tentativa e erro.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Chip, Group, Loader, Paper, SimpleGrid, Stack, Table, Text, TextInput } from '@mantine/core';
import { FiltroDeLista, useFiltroDeTexto } from './explorer/FiltroDeLista';
import { TabelaRolavel } from './explorer/TabelaRolavel';
import { ARCHBASE_IOC_API_TYPE, processErrorMessage } from '@archbase/core';
import { useArchbaseRemoteServiceApi } from '@archbase/data';
import type {
	ArchbaseCapabilitySituation,
	ArchbaseEffectiveAccessReport,
	ArchbaseSecurityDiagnosticsService,
} from '@archbase/security';
import { AttributeList, Section, severityColor } from './DiagnosticPrimitives';
import type { ArchbaseDiagnosticAttribute, ArchbaseSecurityDiagnosticsSlots } from './types';

export interface EffectiveAccessPanelProps {
	slots?: ArchbaseSecurityDiagnosticsSlots;
	onError?: (message: string) => void;
	/**
	 * Pessoa escolhida fora do painel — na árvore do explorador.
	 *
	 * Quando presente, o painel consulta sozinho e a caixa de busca some: escolher na árvore já é a
	 * busca, e deixar as duas na tela faria a pessoa se perguntar qual das duas vale.
	 */
	userId?: string;
}

type Filtro = 'all' | ArchbaseCapabilitySituation | 'inherited';

const SITUACAO: Record<ArchbaseCapabilitySituation, { label: string; color: string }> = {
	EFFECTIVE: { label: 'Efetiva', color: 'green' },
	INERT: { label: 'Inerte', color: 'orange' },
	DENIED: { label: 'Negada', color: 'red' },
};

const ORIGEM: Record<string, string> = { GROUP: 'grupo', PROFILE: 'perfil', USER: 'direto' };

const FILTROS: Array<{ value: Filtro; label: string }> = [
	{ value: 'all', label: 'Todas' },
	{ value: 'EFFECTIVE', label: 'Só efetivas' },
	{ value: 'INERT', label: 'Só inertes' },
	{ value: 'DENIED', label: 'Negadas' },
	{ value: 'inherited', label: 'Só herdadas' },
];

export const EffectiveAccessPanel = ({ slots, onError, userId }: EffectiveAccessPanelProps) => {
	const api = useArchbaseRemoteServiceApi<ArchbaseSecurityDiagnosticsService>(
		ARCHBASE_IOC_API_TYPE.SecurityDiagnostics,
	);
	const [busca, setBusca] = useState<string>('');
	const [report, setReport] = useState<ArchbaseEffectiveAccessReport | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const [filtro, setFiltro] = useState<Filtro>('all');
	const externo = Boolean(userId);

	const consultar = useCallback(
		async (identificador: string) => {
			const alvo = identificador.trim();
			if (!alvo) {
				return;
			}
			setLoading(true);
			setError(undefined);
			try {
				// Um e-mail tem '@'; qualquer outra coisa é tratada como id.
				const resultado = alvo.includes('@')
					? await api.getEffectiveAccessByEmail(alvo)
					: await api.getEffectiveAccessByUserId(alvo);
				setReport(resultado);
			} catch (erro) {
				const mensagem = processErrorMessage(erro);
				setError(mensagem);
				onError?.(mensagem);
				setReport(undefined);
			} finally {
				setLoading(false);
			}
		},
		[api, onError],
	);

	const atributos = useMemo<ArchbaseDiagnosticAttribute[]>(() => {
		if (!report) {
			return [];
		}
		return [
			{ label: 'Perfil', value: report.profileName || '—' },
			{ label: 'Grupos', value: report.groupNames.length ? report.groupNames.join(', ') : '—' },
			...(slots?.userAttributes?.(report) ?? []),
		];
	}, [report, slots]);

	const capacidades = useMemo(() => {
		if (!report) {
			return [];
		}
		if (filtro === 'all') {
			return report.capabilities;
		}
		if (filtro === 'inherited') {
			return report.capabilities.filter((c) => c.grantedByType !== 'USER');
		}
		return report.capabilities.filter((c) => c.situation === filtro);
	}, [report, filtro]);

	// O texto procura no nome do recurso, da ação e de quem concedeu: as três formas pelas quais
	// alguém se lembra de uma capacidade ("aprovar", "ordemservico", "o perfil do Comercial").
	const {
		filtro: textoDoFiltro,
		setFiltro: setTextoDoFiltro,
		filtrados: porTexto,
	} = useFiltroDeTexto(capacidades, (c) => [c.resource, c.action, c.grantedByName]);

	// Escolher na árvore já é a busca: consultar sozinho evita o passo redundante de clicar em
	// "Consultar" logo depois de clicar na pessoa.
	useEffect(() => {
		if (userId) {
			setFiltro('all');
			void consultar(userId);
		}
	}, [userId, consultar]);

	const colunasExtras = slots?.additionalCapabilityColumns ?? [];

	return (
		<Stack gap="lg">
			{externo ? null : (
			<Section title="Consultar" hint="por e-mail ou id do usuário">
				{slots?.renderUserSearch ? (
					slots.renderUserSearch((identificador) => {
						setBusca(identificador);
						void consultar(identificador);
					})
				) : (
					<Group gap="xs" align="flex-end">
						<TextInput
							style={{ flex: 1, minWidth: 240 }}
							label="Usuário"
							placeholder="pessoa@empresa.com.br"
							value={busca}
							onChange={(event) => setBusca(event.currentTarget.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									void consultar(busca);
								}
							}}
						/>
						<Button onClick={() => void consultar(busca)} loading={loading}>
							Consultar
						</Button>
					</Group>
				)}
			</Section>
			)}

			{error ? (
				<Alert color="red" title="Não foi possível ler o efetivo">
					{error}
				</Alert>
			) : null}

			{loading && !report ? <Loader size="sm" /> : null}

			{report ? (
				<>
					<Paper withBorder radius="md" p="md">
						<Stack gap="sm">
							<Group gap={8} wrap="wrap" align="center">
								<Text fw={620}>{report.userLabel}</Text>
								{report.administrator ? <Badge color="red">administrador</Badge> : null}
								{report.enabled ? null : <Badge color="red">conta desativada</Badge>}
								{slots?.afterUserBadges?.(report)}
							</Group>
							<AttributeList attributes={atributos} />
						</Stack>
					</Paper>

					{report.administrator ? (
						<Alert color="orange" title="Administrador passa direto">
							O portão GRANT concede sem consultar o catálogo. A lista abaixo vir vazia não é falta de
							dado — é o atalho que a flag <code>isAdministrator</code> representa.
						</Alert>
					) : null}

					<SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
						{(
							[
								['concedidas', report.granted, 'neutral'],
								['efetivas', report.effective, 'ok'],
								['inertes', report.inert, 'warning'],
								['negadas', report.denied, 'critical'],
							] as const
						).map(([rotulo, valor, severidade]) => (
							<Paper key={rotulo} withBorder radius="md" p="sm">
								<Stack gap={2}>
									<Text size="1.3rem" fw={620} c={severityColor(severidade)}>
										{valor}
									</Text>
									<Text size="xs" c="dimmed">
										{rotulo}
									</Text>
								</Stack>
							</Paper>
						))}
					</SimpleGrid>

					{slots?.afterEffectiveTally?.(report)}

					<Section title="Capacidades" hint={`${report.capabilities.length} no total`}>
						<Chip.Group multiple={false} value={filtro} onChange={(v) => setFiltro(v as Filtro)}>
							<Group gap={6}>
								{FILTROS.map((f) => (
									<Chip key={f.value} value={f.value} size="xs" variant="outline">
										{f.label}
									</Chip>
								))}
							</Group>
						</Chip.Group>

						{/* Os dois filtros se combinam: os chips recortam por situação, este por texto.
						    Uma pessoa com muitos perfis passa de cem capacidades, e aí rolar não é
						    procurar. */}
						<FiltroDeLista
							value={textoDoFiltro}
							onChange={setTextoDoFiltro}
							assunto="capacidades"
							visiveis={porTexto.length}
							total={capacidades.length}
						/>

						<TabelaRolavel maxHeight="calc(100vh - 460px)">
							<Table striped highlightOnHover withTableBorder stickyHeader>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Capacidade</Table.Th>
										<Table.Th>Origem</Table.Th>
										<Table.Th>Situação</Table.Th>
										{colunasExtras.map((coluna) => (
											<Table.Th key={coluna.header}>{coluna.header}</Table.Th>
										))}
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{porTexto.map((capacidade, indice) => (
										<Table.Tr key={`${capacidade.resource}:${capacidade.action}:${indice}`}>
											<Table.Td>
												<Text size="sm" ff="monospace">
													{capacidade.resource}:{capacidade.action}
												</Text>
											</Table.Td>
											<Table.Td>
												<Text size="sm">
													<Text span c="dimmed">
														{ORIGEM[capacidade.grantedByType] ?? capacidade.grantedByType}{' '}
													</Text>
													{capacidade.grantedByName}
												</Text>
											</Table.Td>
											<Table.Td>
												<Badge color={SITUACAO[capacidade.situation].color} variant="light">
													{SITUACAO[capacidade.situation].label}
												</Badge>
											</Table.Td>
											{colunasExtras.map((coluna) => (
												<Table.Td key={coluna.header}>{coluna.render(capacidade, report)}</Table.Td>
											))}
										</Table.Tr>
									))}
									{capacidades.length === 0 ? (
										<Table.Tr>
											<Table.Td colSpan={3 + colunasExtras.length}>
												<Text size="sm" c="dimmed" ta="center" py="md">
													Nenhuma capacidade neste filtro.
												</Text>
											</Table.Td>
										</Table.Tr>
									) : null}
								</Table.Tbody>
							</Table>
						</TabelaRolavel>
					</Section>
				</>
			) : null}
		</Stack>
	);
};
