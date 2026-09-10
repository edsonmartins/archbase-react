import { ARCHBASE_IOC_API_TYPE, getI18nextInstance } from '@archbase/core';
import { useArchbaseRemoteServiceApi } from '@archbase/data';
import type {
	ArchbaseSecurityDiagnosticsService,
	ArchbaseTreeBranch,
	ArchbaseTreeNode,
} from '@archbase/security';
import { Box, Group, Loader, Popover, ScrollArea, Text, TextInput, UnstyledButton } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';

export interface SeletorEmArvoreProps {
	label: string;
	/** O que aparece no campo quando algo está escolhido. */
	valor?: string;
	placeholder?: string;
	branch: ArchbaseTreeBranch;
	/**
	 * Quando o ramo tem dois níveis (recurso → ação), só o segundo é escolha válida: simular contra
	 * um recurso sem ação não é uma pergunta que o backend saiba responder.
	 */
	somenteFolhas?: boolean;
	/**
	 * O ramo a pedir ao abrir um nó.
	 *
	 * <p>Não é o mesmo do nível de cima: as ações de um recurso vivem em ACTIONS_OF_RESOURCE, e
	 * pedir RESOURCES com parentId faz o servidor ignorar o pai e devolver os recursos de novo —
	 * o nó abria mostrando recursos e nunca chegava numa ação para escolher.
	 */
	branchDosFilhos?: ArchbaseTreeBranch;
	/** Devolve o nó escolhido e, quando existir, o pai — é dele que sai o nome do recurso. */
	onSelecionar: (no: ArchbaseTreeNode, pai?: ArchbaseTreeNode) => void;
}

const TAMANHO = 40;

/**
 * O que o número à direita conta — depende do que o nó é.
 *
 * <p>Sem isto o seletor mostrava `aprovar 4` e `ticket.kanban 14` lado a lado, com significados
 * diferentes e nenhuma legenda: o primeiro conta concessões, o segundo conta ações.
 */
const LEGENDA_DO_BADGE: Record<string, string> = {
	USER: 'grupos de que participa',
	GROUP: 'pessoas no grupo',
	PROFILE: 'pessoas com este perfil',
	RESOURCE: 'ações neste recurso',
	ACTION: 'concessões que alcançam esta capacidade',
};

/** Recurso e ação têm identificador técnico no `label`; pessoa, grupo e perfil têm o nome. */
const ehTecnico = (no: ArchbaseTreeNode) => no.kind === 'RESOURCE' || no.kind === 'ACTION';

/**
 * O texto grande da linha.
 *
 * <p>Para recurso e ação é a DESCRIÇÃO, quando existe — é o que quem administra reconhece. Para
 * pessoa é o nome. A descrição pode ser uma chave de tradução (`archbase:Navegação` é o que está
 * gravado no catálogo do gestor-rq), então passa pelo i18n antes de aparecer.
 */
const principal = (no: ArchbaseTreeNode) =>
	ehTecnico(no) && no.description ? traduzir(no.description) : no.label;

/** O texto pequeno ao lado: o identificador técnico, ou o e-mail que distingue homônimos. */
const secundario = (no: ArchbaseTreeNode) =>
	ehTecnico(no) ? (no.description ? no.label : undefined) : (no.description ?? undefined);

/** A descrição pode vir como chave de i18n; sem entrada, o próprio texto vale. */
const traduzir = (texto: string) => {
	try {
		const traduzido = getI18nextInstance().t(texto);
		return typeof traduzido === 'string' ? traduzido : texto;
	} catch {
		return texto;
	}
};


/**
 * Escolher na árvore em vez de digitar.
 *
 * <p>Os campos da simulação eram de texto livre, com exemplos do tipo {@code tms.ordemservico} no
 * placeholder. O problema não é a digitação em si: é que <b>errar uma letra devolve "não pode"</b>,
 * indistinguível de uma negação real de permissão. Quem simula fica sem saber se descobriu um
 * problema ou se errou o nome — e a tela existe justamente para tirar essa dúvida.
 *
 * <p>Carrega por demanda e busca no servidor, como a árvore principal: a lista de pessoas de um
 * tenant grande não cabe numa requisição só, e filtrar no cliente exigiria tê-la carregado inteira.
 */
export const SeletorEmArvore = ({
	label,
	valor,
	placeholder,
	branch,
	somenteFolhas,
	branchDosFilhos,
	onSelecionar,
}: SeletorEmArvoreProps) => {
	const service = useArchbaseRemoteServiceApi<ArchbaseSecurityDiagnosticsService>(
		ARCHBASE_IOC_API_TYPE.SecurityDiagnostics,
	);

	const [aberto, setAberto] = useState(false);
	const [busca, setBusca] = useState('');
	const [raiz, setRaiz] = useState<ArchbaseTreeNode[]>([]);
	const [filhos, setFilhos] = useState<Record<string, ArchbaseTreeNode[]>>({});
	const [expandido, setExpandido] = useState<string | undefined>();
	const [carregando, setCarregando] = useState(false);
	const [erro, setErro] = useState<string | undefined>();

	const carregarRaiz = useCallback(
		async (q: string) => {
			setCarregando(true);
			setErro(undefined);
			try {
				const pagina = await service.browse(branch, { q: q || undefined, page: 0, size: TAMANHO });
				setRaiz(pagina.content ?? []);
			} catch (e: unknown) {
				setErro(e instanceof Error ? e.message : 'Não foi possível carregar.');
			} finally {
				setCarregando(false);
			}
		},
		[service, branch],
	);

	// Só busca com o painel aberto: montar o seletor não deveria disparar requisição, e são três
	// deles na mesma tela.
	useEffect(() => {
		if (!aberto) {
			return;
		}
		const t = setTimeout(() => void carregarRaiz(busca), busca ? 300 : 0);
		return () => clearTimeout(t);
	}, [aberto, busca, carregarRaiz]);

	const abrirNo = useCallback(
		async (no: ArchbaseTreeNode) => {
			if (expandido === no.id) {
				setExpandido(undefined);
				return;
			}
			setExpandido(no.id);
			if (filhos[no.id]) {
				return;
			}
			try {
				const pagina = await service.browse(branchDosFilhos ?? branch, {
					parentId: no.id,
					page: 0,
					size: TAMANHO,
				});
				setFilhos((atual) => ({ ...atual, [no.id]: pagina.content ?? [] }));
			} catch (e: unknown) {
				setErro(e instanceof Error ? e.message : 'Não foi possível abrir.');
			}
		},
		[service, branch, branchDosFilhos, expandido, filhos],
	);

	/**
	 * Devolve o seletor ao estado inicial ao fechar.
	 *
	 * <p>Sem isto a busca ficava presa na consulta anterior: quem já tinha escolhido
	 * `tms.abastecimento` reabria o seletor e via a lista daquele recurso, com o campo interno ainda
	 * preenchido. Digitar no campo de cima não ajuda — ele é `readOnly`, só exibe o escolhido —,
	 * então trocar de capacidade exigia achar a caixa de dentro e limpá-la à mão.
	 *
	 * <p>O ramo aberto e os filhos carregados vão junto: reabrir mostrando um recurso expandido do
	 * uso anterior sugere que aquela é a escolha corrente, e não é.
	 */
	const fechar = useCallback(() => {
		setAberto(false);
		setBusca('');
		setExpandido(undefined);
		setFilhos({});
	}, []);

	const escolher = (no: ArchbaseTreeNode, pai?: ArchbaseTreeNode) => {
		onSelecionar(no, pai);
		fechar();
	};

	/**
	 * Uma linha, sem recursão.
	 *
	 * <p>A versão anterior chamava a si mesma para desenhar os filhos e parava quando
	 * {@code expandido === no.id}. Como {@code expandido} é um estado só, compartilhado por todos os
	 * níveis, bastava o servidor devolver um filho com o mesmo id do pai para a parada nunca
	 * acontecer: a tela morria com "Maximum call stack size exceeded" ao abrir o recurso.
	 *
	 * <p>A árvore aqui tem exatamente dois níveis — recurso e ação. Escrever os dois explicitamente
	 * elimina a classe inteira do problema: não há recursão que possa não terminar, e ids repetidos
	 * deixam de importar.
	 */
	const linha = (no: ArchbaseTreeNode, pai?: ArchbaseTreeNode) => {
		const podeAbrir = no.hasChildren;
		const selecionavel = !somenteFolhas || !podeAbrir;
		return (
			<UnstyledButton
				key={`${pai?.id ?? 'raiz'}:${no.id}`}
				onClick={() => (podeAbrir && somenteFolhas ? void abrirNo(no) : escolher(no, pai))}
				style={{
					display: 'block',
					width: '100%',
					padding: '5px 8px',
					paddingLeft: pai ? 24 : 8,
					borderRadius: 4,
				}}>
				<Group gap={6} wrap="nowrap">
					<Text size="sm" fw={selecionavel ? 500 : 600} truncate>
						{principal(no)}
					</Text>
					{secundario(no) ? (
						<Text size="xs" c="dimmed" ff="monospace" truncate>
							{secundario(no)}
						</Text>
					) : null}
					{no.badge ? (
						<Text size="xs" c="dimmed" title={LEGENDA_DO_BADGE[no.kind] ?? undefined}>
							{no.badge}
						</Text>
					) : null}
				</Group>
			</UnstyledButton>
		);
	};

	const ramo = (no: ArchbaseTreeNode) => (
		<Box key={`ramo:${no.id}`}>
			{linha(no)}
			{expandido === no.id ? (filhos[no.id] ?? []).map((f) => linha(f, no)) : null}
		</Box>
	);

	return (
		<Popover
			opened={aberto}
			onChange={(v) => (v ? setAberto(true) : fechar())}
			width={340}
			position="bottom-start"
			withinPortal
			shadow="md">
			<Popover.Target>
				<TextInput
					label={label}
					placeholder={placeholder}
					value={valor ?? ''}
					readOnly
					onClick={() => (aberto ? fechar() : setAberto(true))}
					styles={{ input: { cursor: 'pointer' } }}
				/>
			</Popover.Target>
			<Popover.Dropdown p={6}>
				<TextInput
					size="xs"
					placeholder="Buscar…"
					value={busca}
					onChange={(e) => setBusca(e.currentTarget.value)}
					mb={6}
					autoFocus
				/>
				{carregando ? (
					<Group gap={6} p={6}>
						<Loader size="xs" />
						<Text size="xs" c="dimmed">
							Carregando…
						</Text>
					</Group>
				) : null}
				{erro ? (
					<Text size="xs" c="red" p={6}>
						{erro}
					</Text>
				) : null}
				{!carregando && !erro && raiz.length === 0 ? (
					<Text size="xs" c="dimmed" p={6}>
						Nada encontrado.
					</Text>
				) : null}
				<ScrollArea.Autosize mah={280} type="hover">
					{raiz.map((no) => ramo(no))}
				</ScrollArea.Autosize>
			</Popover.Dropdown>
		</Popover>
	);
};
