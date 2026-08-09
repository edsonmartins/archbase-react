/**
 * Simular — "esta pessoa consegue fazer isto?", e em qual portão parou quando não consegue.
 *
 * <p>O valor da tela não é o sim/não: é a <b>cadeia</b>. Saber que parou em LEVEL manda ajustar
 * nível; saber que parou em GRANT manda conceder. Sem isso, o operador tenta ao acaso.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Group, Loader, Paper, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { SeletorEmArvore } from './explorer/SeletorEmArvore';
import { ARCHBASE_IOC_API_TYPE, processErrorMessage } from '@archbase/core';
import { useArchbaseRemoteServiceApi } from '@archbase/data';
import type {
	ArchbaseAccessDecision,
	ArchbaseAccessGate,
	ArchbaseSecurityDiagnosticsService,
} from '@archbase/security';
import { Section } from './DiagnosticPrimitives';
import type { ArchbaseSecurityDiagnosticsSlots } from './types';

export interface SimulationPanelProps {
	slots?: ArchbaseSecurityDiagnosticsSlots;
	onError?: (message: string) => void;
	/**
	 * Sujeito e capacidade escolhidos na árvore.
	 *
	 * <p><b>Escolher substitui lembrar.</b> Digitar {@code tms.ordemservico} de cabeça é a origem do
	 * falso negativo: errar uma letra devolve "não pode", indistinguível de uma negação real. Com a
	 * escolha vinda da árvore, a resposta passa a significar o que diz.
	 *
	 * <p>Os campos continuam editáveis — a árvore preenche, não tranca.
	 */
	initial?: { userId?: string; userLabel?: string; resource?: string; action?: string };
}

/**
 * Os cinco portões, com o papel de cada um.
 *
 * <p>O rótulo "só nega" não é enfeite: é a regra que organiza o modelo inteiro. Quatro portões
 * apenas recusam; um único concede. Quem entende isso para de procurar a concessão no lugar
 * errado.
 */
const PORTOES: Array<{ gate: ArchbaseAccessGate; titulo: string; papel: string; pergunta: string }> = [
	{ gate: 'IDENTITY', titulo: 'Identidade', papel: 'só nega', pergunta: 'O principal é resolvível e a conta está ativa?' },
	{ gate: 'SCOPE', titulo: 'Escopo', papel: 'só nega', pergunta: 'A concessão vale para o tenant, empresa e projeto pedidos?' },
	{ gate: 'RESTRICTION', titulo: 'Restrições', papel: 'só nega', pergunta: 'Perfil, papel e persona exigidos pela anotação.' },
	{ gate: 'LEVEL', titulo: 'Nível', papel: 'só nega', pergunta: 'O nível da pessoa alcança o piso da capacidade?' },
	{ gate: 'GRANT', titulo: 'Concessão', papel: 'concede', pergunta: 'Existe permissão, sem negação explícita?' },
];

export const SimulationPanel = ({ slots, onError, initial }: SimulationPanelProps) => {
	const api = useArchbaseRemoteServiceApi<ArchbaseSecurityDiagnosticsService>(
		ARCHBASE_IOC_API_TYPE.SecurityDiagnostics,
	);
	const [usuario, setUsuario] = useState<string>('');
	/**
	 * O que se mostra no campo do usuário.
	 *
	 * <p>Separado do id porque é ele que a simulação envia: mostrar o identificador para quem
	 * escolheu "Maria Silva" na árvore não ajuda ninguém a conferir se escolheu a pessoa certa.
	 */
	const [rotuloDoUsuario, setRotuloDoUsuario] = useState<string>('');
	const [recurso, setRecurso] = useState<string>('');
	const [acao, setAcao] = useState<string>('');
	const [escopo, setEscopo] = useState<{ companyId?: string; projectId?: string }>({});
	const [decision, setDecision] = useState<ArchbaseAccessDecision | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>(undefined);

	// A árvore preenche o que foi escolhido, sem apagar o que a pessoa já digitou nos outros campos.
	useEffect(() => {
		if (!initial) {
			return;
		}
		if (initial.userId) setUsuario(initial.userId);
		// O nome vem junto do id: quem escolheu "Helena Braga" na árvore não confere nada
		// olhando para um uuid no campo.
		if (initial.userLabel) setRotuloDoUsuario(initial.userLabel);
		if (initial.resource) setRecurso(initial.resource);
		if (initial.action) setAcao(initial.action);
		// Escolha nova invalida o resultado anterior: deixá-lo na tela faria a resposta parecer
		// referente ao que acabou de ser escolhido.
		setDecision(undefined);
	}, [initial?.userId, initial?.userLabel, initial?.resource, initial?.action]);

	const simular = useCallback(async () => {
		if (!usuario.trim() || !recurso.trim() || !acao.trim()) {
			return;
		}
		setLoading(true);
		setError(undefined);
		try {
			const alvo = usuario.trim();
			const resultado = await api.simulate({
				...(alvo.includes('@') ? { email: alvo } : { userId: alvo }),
				resource: recurso.trim(),
				action: acao.trim(),
				companyId: escopo.companyId,
				projectId: escopo.projectId,
			});
			setDecision(resultado);
		} catch (erro) {
			const mensagem = processErrorMessage(erro);
			setError(mensagem);
			onError?.(mensagem);
			setDecision(undefined);
		} finally {
			setLoading(false);
		}
	}, [api, usuario, recurso, acao, escopo, onError]);

	/** Um portão só é "não avaliado" quando a decisão parou antes dele. */
	const situacaoDoPortao = (gate: ArchbaseAccessGate, d: ArchbaseAccessDecision) => {
		const noResultado = d.chain?.find((o) => o.gate === gate);
		if (noResultado) {
			return noResultado.passed ? 'passou' : 'negou';
		}
		return 'nao-avaliado';
	};

	return (
		<Stack gap="lg">
			<Paper withBorder radius="md" p="md">
				<Stack gap="sm">
					<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xs">
						{/* Escolher, não digitar: o nome errado devolve "não pode" igual a uma negação
						    real, e quem simula fica sem saber qual dos dois aconteceu. */}
						<SeletorEmArvore
							label="Usuário"
							placeholder="escolher pessoa"
							branch="USERS"
							valor={rotuloDoUsuario || usuario}
							onSelecionar={(no) => {
								setUsuario(no.id);
								setRotuloDoUsuario(no.label);
							}}
						/>
						{/* Um seletor para os dois campos: a ação só existe dentro de um recurso, e
						    escolher os dois em separado permite combinar par que não existe. */}
						<SeletorEmArvore
							label="Recurso e ação"
							placeholder="escolher capacidade"
							branch="RESOURCES"
							somenteFolhas
							valor={recurso && acao ? `${recurso} · ${acao}` : ''}
							onSelecionar={(no, pai) => {
								setAcao(no.label);
								if (pai) {
									setRecurso(pai.label);
								}
							}}
						/>
						<TextInput
							label="Empresa (opcional)"
							placeholder="companyId"
							value={escopo.companyId ?? ''}
							onChange={(e) => setEscopo((s) => ({ ...s, companyId: e.currentTarget.value || undefined }))}
						/>
					</SimpleGrid>

					{slots?.afterSimulationFields?.((novoEscopo) => setEscopo((s) => ({ ...s, ...novoEscopo })))}

					<Group gap="xs" align="center">
						<Button onClick={() => void simular()} loading={loading}>
							Simular
						</Button>
						<Text size="xs" c="dimmed">
							Somente leitura — não altera permissão nenhuma.
						</Text>
					</Group>
				</Stack>
			</Paper>

			{error ? (
				<Alert color="red" title="Não foi possível simular">
					{error}
				</Alert>
			) : null}

			{loading && !decision ? <Loader size="sm" /> : null}

			{decision ? (
				<>
					<Section title="Cadeia de decisão" hint="os quatro primeiros só negam; só o quinto concede">
						<Paper withBorder radius="md" p="md">
							<Stack gap="sm">
								{PORTOES.map((portao, indice) => {
									const situacao = situacaoDoPortao(portao.gate, decision);
									const detalhe = decision.chain?.find((o) => o.gate === portao.gate)?.detail;
									return (
										<Group key={portao.gate} align="flex-start" wrap="nowrap" gap="sm">
											<Text size="xs" ff="monospace" c="dimmed" w={16}>
												{indice + 1}
											</Text>
											<Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
												<Group gap={8} align="baseline" wrap="wrap">
													<Text
														size="sm"
														fw={600}
														c={situacao === 'negou' ? 'red' : undefined}
														opacity={situacao === 'nao-avaliado' ? 0.5 : 1}
													>
														{portao.titulo}
													</Text>
													<Text size="xs" c="dimmed">
														· {portao.papel}
													</Text>
												</Group>
												<Text size="xs" c="dimmed" opacity={situacao === 'nao-avaliado' ? 0.5 : 1}>
													{portao.pergunta}
												</Text>
												{detalhe ? (
													<Text size="xs" c="dimmed">
														{detalhe}
													</Text>
												) : null}
											</Stack>
											<Badge
												variant="light"
												color={situacao === 'negou' ? 'red' : situacao === 'passou' ? 'green' : 'gray'}
											>
												{situacao === 'nao-avaliado' ? 'não avaliado' : situacao}
											</Badge>
										</Group>
									);
								})}
							</Stack>
						</Paper>
					</Section>

					<Alert color={decision.allowed ? 'green' : 'red'} title={decision.allowed ? 'Pode' : 'Não pode'}>
						<Stack gap={6}>
							<Text size="sm">{decision.message}</Text>
							<Text size="xs" ff="monospace" c="dimmed">
								reasonCode: {decision.reasonCode}
								{decision.deniedAt ? ` · deniedAt: ${decision.deniedAt}` : ''}
								{decision.grantedByName ? ` · grantedBy: ${decision.grantedByName}` : ''}
							</Text>
						</Stack>
					</Alert>

					{slots?.afterDecision?.(decision)}
				</>
			) : null}
		</Stack>
	);
};
