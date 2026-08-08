import type { ReactNode } from 'react';
import type {
	ArchbaseAccessDecision,
	ArchbaseAccessOverview,
	ArchbaseEffectiveAccessReport,
	ArchbaseEffectiveCapability,
	ArchbaseGroupMember,
	ArchbaseGroupReport,
	ArchbaseOverviewMetric,
	ArchbaseReachEntry,
} from '@archbase/security';

/**
 * Um atributo de negócio exibido no painel de identidade — rótulo e valor.
 *
 * <p>Existe para o caso mais comum de composição: a aplicação sabe o departamento, o centro
 * de custo, a matrícula; o framework não sabe e não deveria saber. Entregando <b>dado</b> em
 * vez de JSX, o atributo sai no mesmo layout de "Perfil / Grupos / Nível" — sem cada projeto
 * inventar a própria formatação de rótulo.
 */
export interface ArchbaseDiagnosticAttribute {
	label: string;
	value: ReactNode;
}

/** Severidade de um cartão ou indicador. Separada do acento visual, de propósito. */
export type ArchbaseDiagnosticSeverity = 'critical' | 'warning' | 'ok' | 'neutral';

/** Cartão de métrica no Panorama, no mesmo formato dos que o framework desenha. */
export interface ArchbaseDiagnosticCard {
	severity: ArchbaseDiagnosticSeverity;
	value: ReactNode;
	/** Denominador ou unidade — "de 61 usuários". */
	of?: string;
	label: string;
	description?: string;
	/**
	 * A métrica cujos itens este cartão representa.
	 *
	 * Presente, o cartão fica clicável e abre a lista do que forma o número — que é o que permite
	 * agir: "29 ações inativas" não diz quais. Ausente (caso dos cartões de negócio injetados por
	 * slot, que o framework não sabe detalhar), o cartão continua só de leitura.
	 */
	metric?: ArchbaseOverviewMetric;
}

/** Indicador de proteção ligada/desligada, na faixa do topo do Panorama. */
export interface ArchbaseDiagnosticFlag {
	key: string;
	label: string;
	value: string;
	severity: ArchbaseDiagnosticSeverity;
	description?: string;
}

/**
 * Pontos de inserção da view — os <b>slots</b>.
 *
 * <p><b>Três verbos, três significados.</b> A regra vale para toda a view e é o que evita que
 * a extensão vire colcha de retalhos:
 *
 * <ul>
 *   <li>{@code before<X>} / {@code after<X>} — <b>insere</b> um nó antes ou depois da região
 *       X, que continua desenhada pelo framework. É a convenção que a
 *       {@code ArchbaseSecurityView} já usa em {@code beforeDefaultUserActions}.</li>
 *   <li>{@code additional<X>} — <b>acrescenta dado</b> a uma coleção que o framework desenha.
 *       A aplicação entrega o dado, não o JSX, e a coerência visual se mantém sozinha.</li>
 *   <li>{@code render<X>} — <b>substitui</b> a região inteira. Válvula de escape, para quando
 *       o que o framework desenha não serve.</li>
 * </ul>
 *
 * <p>Prefira {@code additional} ao {@code render} sempre que couber: é o que mantém as telas
 * de todos os produtos parecidas entre si.
 */
export interface ArchbaseSecurityDiagnosticsSlots {
	// ─────────────── Panorama ───────────────

	/** Indicadores de proteção da própria aplicação, ao lado dos do framework. */
	additionalFlags?: (overview: ArchbaseAccessOverview) => ArchbaseDiagnosticFlag[];
	/** Cartões de métrica de negócio, na mesma grade e linguagem visual. */
	additionalOverviewCards?: (overview: ArchbaseAccessOverview) => ArchbaseDiagnosticCard[];
	/** Região livre no fim do Panorama — painel próprio, gráfico, link para relatório. */
	afterOverview?: (overview: ArchbaseAccessOverview) => ReactNode;

	// ─────────── Efetivo do usuário ───────────

	/**
	 * Uma segunda porta de entrada para chegar a uma pessoa, acima da árvore.
	 *
	 * <p>É por aqui que entra "buscar pessoa por departamento": o framework identifica alguém por id
	 * ou e-mail e não tem como saber o que é departamento.
	 *
	 * <p><b>Mudou de lugar, não de propósito.</b> Quando a tela era um formulário, este slot
	 * substituía a caixa de busca. Agora a árvore é a navegação, e o que a aplicação oferece aparece
	 * ao lado dela — as duas convivem, porque quem sabe o e-mail usa a árvore e quem sabe só o
	 * departamento usa isto.
	 */
	renderUserSearch?: (onSelect: (userIdOrEmail: string) => void) => ReactNode;
	/** Selos ao lado do nome — "terceirizado", "afastado", "contrato vencido". */
	afterUserBadges?: (report: ArchbaseEffectiveAccessReport) => ReactNode;
	/** Atributos de negócio no painel de identidade. O lugar dos departamentos. */
	userAttributes?: (report: ArchbaseEffectiveAccessReport) => ArchbaseDiagnosticAttribute[];
	/** Entre os contadores e a tabela de capacidades. */
	afterEffectiveTally?: (report: ArchbaseEffectiveAccessReport) => ReactNode;
	/** Colunas extras na tabela, com o cabeçalho e o conteúdo por linha. */
	additionalCapabilityColumns?: Array<{
		header: string;
		render: (capability: ArchbaseEffectiveCapability, report: ArchbaseEffectiveAccessReport) => ReactNode;
	}>;

	// ─────────── Grupo e perfil ───────────

	/**
	 * Colunas extras na tabela de membros — o lugar do departamento, do centro de custo.
	 *
	 * <p>Mesma convenção da tabela de capacidades: a aplicação entrega cabeçalho e conteúdo por
	 * linha, e o framework desenha.
	 */
	additionalMemberColumns?: Array<{
		header: string;
		render: (member: ArchbaseGroupMember, report: ArchbaseGroupReport) => ReactNode;
	}>;
	/** Região livre no fim do painel de grupo ou perfil. */
	afterGroupMembers?: (report: ArchbaseGroupReport) => ReactNode;

	// ─────────── Quem alcança ───────────

	/**
	 * Região livre depois da lista de quem alcança uma capacidade.
	 *
	 * <p>O lugar de um "exportar para auditoria" ou de um aviso próprio da aplicação sobre aquela
	 * capacidade.
	 */
	afterReachList?: (actionId: string, entries: ArchbaseReachEntry[]) => ReactNode;

	// ─────────────── Simular ───────────────

	/**
	 * Campos de negócio no formulário de simulação.
	 *
	 * <p><b>Limite:</b> o que for coletado aqui só chega ao servidor se a aplicação mapear para
	 * {@code companyId} ou {@code projectId} pelo {@code onScopeChange} — o avaliador não
	 * conhece outra dimensão de escopo.
	 */
	afterSimulationFields?: (onScopeChange: (scope: { companyId?: string; projectId?: string }) => void) => ReactNode;
	/** Depois do veredito — a tradução do motivo técnico para a linguagem do negócio. */
	afterDecision?: (decision: ArchbaseAccessDecision) => ReactNode;
}

/**
 * Props da view de diagnóstico.
 *
 * <p>Não há mais {@code defaultTab} nem {@code tabs}: a tela deixou de ser um conjunto de abas
 * paralelas e virou um explorador de árvore. Panorama e Simular continuam existindo, como nós — e
 * restringir quais nós aparecem seria esconder objetos de segurança de quem está auditando, que é o
 * oposto do que a tela existe para fazer.
 */
export interface ArchbaseSecurityDiagnosticsViewProps {
	height?: string | number;
	width?: string | number;
	slots?: ArchbaseSecurityDiagnosticsSlots;
	onError?: (message: string) => void;
}
