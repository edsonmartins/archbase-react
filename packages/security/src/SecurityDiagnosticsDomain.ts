/**
 * Tipos dos endpoints de diagnóstico de acesso — `/api/v1/security/diagnostics/*`.
 *
 * <p>Espelham os records do `archbase-security` 3.1.0 campo a campo. Onde o nome aqui
 * diverge do backend, é bug: a tela existe para responder "por que esta pessoa não passou?",
 * e ela só responde isso se o que chega for exatamente o que o avaliador decidiu.
 */

/**
 * Os cinco portões do core de autorização, na ordem em que são avaliados.
 *
 * <p>A regra que organiza o modelo: <b>IDENTITY a LEVEL só sabem NEGAR; só GRANT CONCEDE.</b>
 * É por isso que a tela de simulação mostra a cadeia inteira em vez de um sim/não — saber
 * em qual portão parou é o que diz o que precisa ser mudado.
 */
export type ArchbaseAccessGate = 'IDENTITY' | 'SCOPE' | 'RESTRICTION' | 'LEVEL' | 'GRANT';

/** Escala de nível de acesso. `NONE` é sentinela de anotação, não valor de perfil. */
export type ArchbaseAccessLevel = 'NONE' | 'READER' | 'OPERATOR' | 'SUPERVISOR' | 'TENANT_ADMIN';

/**
 * Situação de uma capacidade concedida.
 *
 * - `EFFECTIVE` — concedida e valendo.
 * - `INERT` — concedida, mas a ação ou o recurso está inativo. É o acesso que o operador
 *   acredita ter dado e que não decide nada.
 * - `DENIED` — bloqueada por negação explícita ou por nível insuficiente.
 */
export type ArchbaseCapabilitySituation = 'EFFECTIVE' | 'INERT' | 'DENIED';

/** Quem recebeu a permissão. */
export type ArchbaseSecurityTypeName = 'USER' | 'GROUP' | 'PROFILE';

/**
 * Estado das proteções configuráveis.
 *
 * <p>Vem antes dos números na tela de propósito: contagem alta de permissões não significa
 * nada se o portão correspondente está inerte.
 */
export interface ArchbaseAccessFlags {
	/** `false` = permissão apontando para ação inativa ainda decide. */
	requireActive: boolean;
	/** `false` = o catálogo não se alimenta do código; nada de `@HasPermission` foi varrido. */
	scanConfigured: boolean;
	/** `permit` = qualquer autenticado administra segurança. */
	adminEndpointsPolicy: string;
	requireRoleNoResolverPolicy: string;
	/** `false` = `@RequireRole` não restringe nada. */
	roleResolverRegistered: boolean;
}

/** Retrato do tenant — `GET /diagnostics/overview`. */
export interface ArchbaseAccessOverview {
	users: number;
	administrators: number;
	groups: number;
	profiles: number;
	resources: number;
	apiResources: number;
	apiResourcesInactive: number;
	resourcesWithoutAction: number;
	actions: number;
	actionsInactive: number;
	actionsWithoutPermission: number;
	permissions: number;
	permissionsPointingToInactive: number;
	permissionsBySecurityType: Record<string, number>;
	flags: ArchbaseAccessFlags;
}

/** Uma capacidade que a pessoa recebeu, com a origem da concessão. */
export interface ArchbaseEffectiveCapability {
	resource: string;
	action: string;
	grantedBy: string;
	grantedByName: string;
	grantedByType: ArchbaseSecurityTypeName;
	actionActive: boolean;
	resourceActive: boolean;
	situation: ArchbaseCapabilitySituation;
}

/** O que a pessoa pode — `GET /diagnostics/users/{id}/effective`. */
export interface ArchbaseEffectiveAccessReport {
	userId: string;
	userLabel: string;
	profileName: string;
	groupNames: string[];
	administrator: boolean;
	enabled: boolean;
	granted: number;
	effective: number;
	inert: number;
	denied: number;
	capabilities: ArchbaseEffectiveCapability[];
}

/** O que aconteceu em um portão. */
export interface ArchbaseGateOutcome {
	gate: ArchbaseAccessGate;
	passed: boolean;
	reasonCode: string;
	detail: string;
}

/** Resultado de `POST /diagnostics/simulate`. */
export interface ArchbaseAccessDecision {
	allowed: boolean;
	/** Portão onde parou, ou `null` quando concedeu. */
	deniedAt: ArchbaseAccessGate | null;
	reasonCode: string;
	message: string;
	grantedBy: string | null;
	grantedByName: string | null;
	chain: ArchbaseGateOutcome[];
}

/**
 * Pergunta da simulação.
 *
 * <p>Identifica a pessoa por `userId` <b>ou</b> `email`. O escopo aceito é o que o avaliador
 * conhece — tenant, empresa e projeto. Dimensão de negócio (departamento, filial) só chega
 * aqui se a aplicação a mapear para um destes.
 */
export interface ArchbaseSimulationRequest {
	userId?: string;
	email?: string;
	resource: string;
	action: string;
	tenantId?: string;
	companyId?: string;
	projectId?: string;
}
