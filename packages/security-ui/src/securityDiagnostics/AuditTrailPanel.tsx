import { ARCHBASE_IOC_API_TYPE } from '@archbase/core';
import { useArchbaseRemoteServiceApi } from '@archbase/data';
import type {
	ArchbaseSecurityDiagnosticsService,
	ArchbaseSecurityEvent,
	ArchbaseSecurityEventType,
} from '@archbase/security';
import { Alert, Badge, Group, Loader, Pagination, Select, Stack, Table, Text, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Section } from './DiagnosticPrimitives';
import { TabelaRolavel } from './explorer/TabelaRolavel';
import type { ArchbaseSecurityDiagnosticsSlots } from './types';

const TAMANHO = 50;

/**
 * O rótulo e a cor de cada tipo.
 *
 * <p>Só a negação e a falha de login aparecem em vermelho: pintar tudo de cor forte faria a lista
 * inteira parecer problema, e aí nenhuma linha chama atenção.
 */
const TIPOS: Record<ArchbaseSecurityEventType, { label: string; cor?: string }> = {
	LOGIN: { label: 'Entrou' },
	LOGIN_FALHOU: { label: 'Falha ao entrar', cor: 'red' },
	LOGOUT: { label: 'Saiu' },
	ACESSO_NEGADO: { label: 'Acesso negado', cor: 'red' },
	SIMULACAO: { label: 'Simulação', cor: 'blue' },
};

export interface AuditTrailPanelProps {
	slots?: ArchbaseSecurityDiagnosticsSlots;
	onError?: (message: string) => void;
}

/**
 * A trilha: o que aconteceu, e não o que está configurado.
 *
 * <p>É a única parte do explorador que olha para o <b>passado</b>. As outras respondem "como está
 * agora"; esta responde "quem entrou, quem tentou o que não podia, quem simulou" — as perguntas que
 * aparecem depois que algo deu errado.
 *
 * <p>Depende de {@code archbase.security.audit.enabled} no backend. Desligada, o endpoint não
 * existe, e a tela diz isso em vez de mostrar uma lista vazia: lista vazia leva a concluir que nada
 * aconteceu, que é a conclusão errada.
 */
export const AuditTrailPanel = ({ slots, onError }: AuditTrailPanelProps) => {
	const service = useArchbaseRemoteServiceApi<ArchbaseSecurityDiagnosticsService>(
		ARCHBASE_IOC_API_TYPE.SecurityDiagnostics,
	);

	const [eventos, setEventos] = useState<ArchbaseSecurityEvent[]>([]);
	const [pagina, setPagina] = useState(1);
	const [totalDePaginas, setTotalDePaginas] = useState(1);
	const [total, setTotal] = useState(0);
	const [usuario, setUsuario] = useState('');
	const [tipo, setTipo] = useState<ArchbaseSecurityEventType | null>(null);
	const [carregando, setCarregando] = useState(false);
	const [erro, setErro] = useState<string | null>(null);
	const [desligada, setDesligada] = useState(false);

	useEffect(() => {
		let cancelado = false;
		setCarregando(true);
		setErro(null);

		// O filtro por texto espera a digitação parar; a troca de página e de tipo não deveria
		// esperar nada.
		const atraso = usuario ? 400 : 0;
		const t = setTimeout(() => {
			service
				.getAuditEvents({
					usuario: usuario || undefined,
					tipo: tipo ?? undefined,
					page: pagina - 1,
					size: TAMANHO,
				})
				.then((resultado) => {
					if (cancelado) {
						return;
					}
					setEventos(resultado.content ?? []);
					setTotal(resultado.totalElements ?? 0);
					setTotalDePaginas(Math.max(resultado.totalPages ?? 1, 1));
					setDesligada(false);
				})
				.catch((e: unknown) => {
					if (cancelado) {
						return;
					}
					const mensagem = e instanceof Error ? e.message : 'Não foi possível ler a trilha.';
					// 404 aqui não é erro de rede: é a trilha desligada no backend, e dizer isso poupa
					// alguém de procurar defeito onde só falta uma configuração.
					if (/404/.test(mensagem)) {
						setDesligada(true);
						setEventos([]);
					} else {
						setErro(mensagem);
						onError?.(mensagem);
					}
				})
				.finally(() => {
					if (!cancelado) {
						setCarregando(false);
					}
				});
		}, atraso);

		return () => {
			cancelado = true;
			clearTimeout(t);
		};
	}, [service, usuario, tipo, pagina, onError]);

	if (desligada) {
		return (
			<Alert color="yellow" title="Trilha desligada">
				O servidor está com <code>archbase.security.audit.enabled=false</code>. Nada é registrado
				enquanto estiver assim — a lista vazia aqui significaria "nada aconteceu", e não é o caso.
			</Alert>
		);
	}

	return (
		<Stack gap="md" style={{ flex: 1, minHeight: 0 }}>
			<Stack gap={4}>
				<Text fw={620} size="xl">
					Trilha de auditoria
				</Text>
				<Text size="sm" c="dimmed">
					O que aconteceu — entradas, falhas, acessos negados e simulações. As outras telas mostram
					como a segurança está agora; esta mostra o que passou.
				</Text>
			</Stack>

			<Group gap="xs" align="flex-end">
				<TextInput
					size="xs"
					label="Pessoa"
					placeholder="e-mail ou parte dele"
					value={usuario}
					onChange={(e) => {
						setUsuario(e.currentTarget.value);
						setPagina(1);
					}}
					style={{ minWidth: 220 }}
				/>
				<Select
					size="xs"
					label="Tipo"
					placeholder="todos"
					clearable
					value={tipo}
					onChange={(v) => {
						setTipo((v as ArchbaseSecurityEventType) ?? null);
						setPagina(1);
					}}
					data={Object.entries(TIPOS).map(([valor, { label }]) => ({ value: valor, label }))}
					style={{ minWidth: 180 }}
				/>
				<Badge variant="light">{total} {total === 1 ? 'evento' : 'eventos'}</Badge>
				{carregando ? <Loader size="xs" /> : null}
			</Group>

			{erro ? (
				<Alert color="red" title="Erro ao ler a trilha">
					{erro}
				</Alert>
			) : null}

			{!carregando && !erro && eventos.length === 0 ? (
				<Text size="sm" c="dimmed">
					Nenhum evento no período.
				</Text>
			) : null}

			{eventos.length > 0 ? (
				<Section title="Eventos" hint="do mais recente para o mais antigo">
					<TabelaRolavel maxHeight="calc(100vh - 420px)">
						<Table striped highlightOnHover withTableBorder stickyHeader>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Quando</Table.Th>
									<Table.Th>O quê</Table.Th>
									<Table.Th>Quem</Table.Th>
									<Table.Th>Sobre</Table.Th>
									<Table.Th>Por quê</Table.Th>
									<Table.Th>Origem</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{eventos.map((evento) => (
									<Table.Tr key={evento.id}>
										<Table.Td>
											<Text size="xs">{formatarData(evento.dataHora)}</Text>
										</Table.Td>
										<Table.Td>
											<Badge size="sm" variant="light" color={TIPOS[evento.tipo]?.cor}>
												{TIPOS[evento.tipo]?.label ?? evento.tipo}
											</Badge>
										</Table.Td>
										<Table.Td>
											<Text size="sm">{evento.usuario ?? '—'}</Text>
										</Table.Td>
										<Table.Td>
											{evento.recurso || evento.acao ? (
												<Text size="xs" ff="monospace">
													{evento.recurso} · {evento.acao}
												</Text>
											) : (
												<Text size="xs" c="dimmed">
													—
												</Text>
											)}
										</Table.Td>
										<Table.Td>
											<Text size="xs" c="dimmed">
												{evento.detalhe ?? '—'}
											</Text>
										</Table.Td>
										<Table.Td>
											<Text size="xs" c="dimmed">
												{evento.origem ?? '—'}
											</Text>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</TabelaRolavel>
				</Section>
			) : null}

			{totalDePaginas > 1 ? (
				<Group justify="center">
					<Pagination value={pagina} onChange={setPagina} total={totalDePaginas} size="sm" />
				</Group>
			) : null}

			{slots?.afterAuditTrail?.(eventos)}
		</Stack>
	);
};

/** Data legível. O ISO cru serve à máquina; quem investiga lê dia e hora. */
const formatarData = (iso: string) => {
	try {
		return new Date(iso).toLocaleString();
	} catch {
		return iso;
	}
};
