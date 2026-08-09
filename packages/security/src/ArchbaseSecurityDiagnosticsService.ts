import { ArchbaseRemoteApiClient } from '@archbase/data';
import * as inversify from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from '@archbase/core';
import { ArchbaseTenantManager } from './ArchbaseTenantManager';
import type {
	ArchbaseSecurityEvent,
	ArchbaseSecurityEventPage,
	ArchbaseSecurityEventType,
	ArchbaseAccessDecision,
	ArchbaseAccessOverview,
	ArchbaseOverviewItemPage,
	ArchbaseOverviewMetric,
	ArchbaseGroupReport,
	ArchbaseReachEntry,
	ArchbaseTreeBranch,
	ArchbaseTreeNodePage,
	ArchbaseEffectiveAccessReport,
	ArchbaseSimulationRequest,
} from './SecurityDiagnosticsDomain';

/**
 * Leitura do diagnóstico de acesso — `/api/v1/security/diagnostics/*`.
 *
 * <p><b>Por que não estende `ArchbaseRemoteApiService`.</b> A classe base modela um CRUD de
 * entidade: exige `getId`, `isNewRecord` e `transform`. Aqui não há entidade — há três
 * perguntas (o retrato do tenant, o que uma pessoa pode, e se ela pode uma coisa). Implementar
 * aqueles métodos com retorno inventado só para herdar seria mentir sobre o que este serviço é.
 * O que importava da base — o cliente HTTP injetado e os cabeçalhos de tenant — está preservado.
 *
 * <p>Todos os endpoints são <b>somente leitura</b> e exigem, no servidor,
 * `archbase.security.diagnostics.enabled=true` e usuário administrador.
 */
export class ArchbaseSecurityDiagnosticsService {
	protected client: ArchbaseRemoteApiClient;

	constructor(client: ArchbaseRemoteApiClient) {
		this.client = client;
	}

	protected configureHeaders(): Record<string, string> {
		return ArchbaseTenantManager.getInstance().getHeaders();
	}

	protected getEndpoint(): string {
		return '/api/v1/security/diagnostics';
	}

	/**
	 * Base própria: a trilha vive fora do diagnóstico porque tem chave própria no backend
	 * ({@code archbase.security.audit.enabled}) e some inteira quando ela está desligada.
	 */
	protected getAuditEndpoint(): string {
		return '/api/v1/security/audit';
	}

	/** Retrato do tenant: contagens do catálogo e o estado das proteções configuráveis. */
	public async getOverview(): Promise<ArchbaseAccessOverview> {
		return this.client.get<ArchbaseAccessOverview>(`${this.getEndpoint()}/overview`, this.configureHeaders());
	}

	/**
	 * Os itens por trás de um número do panorama.
	 *
	 * Um card diz "29 ações inativas"; sozinho, isso não permite agir. Aqui vêm quais são, com o
	 * motivo de cada uma estar na lista.
	 */
	public async getOverviewItems(
		metric: ArchbaseOverviewMetric,
		page = 0,
		size = 25,
	): Promise<ArchbaseOverviewItemPage> {
		return this.client.get<ArchbaseOverviewItemPage>(
			`${this.getEndpoint()}/overview/${metric}?page=${page}&size=${size}`,
			this.configureHeaders(),
		);
	}

	/**
	 * Um ramo da árvore, buscado ao abrir.
	 *
	 * Não existe "carregar a árvore": um tenant real tem centenas de ações e recursos, e a carga
	 * única trava o navegador. O filtro também vai para o servidor — buscar no cliente exigiria ter
	 * carregado tudo antes.
	 */
	public async browse(
		branch: ArchbaseTreeBranch,
		options: { parentId?: string; q?: string; page?: number; size?: number } = {},
	): Promise<ArchbaseTreeNodePage> {
		const params = new URLSearchParams();
		if (options.parentId) params.set('parentId', options.parentId);
		if (options.q) params.set('q', options.q);
		params.set('page', String(options.page ?? 0));
		params.set('size', String(options.size ?? 50));
		return this.client.get<ArchbaseTreeNodePage>(
			`${this.getEndpoint()}/tree/${branch}?${params.toString()}`,
			this.configureHeaders(),
		);
	}

	/** Quem está no grupo e o que cada pessoa acumula de todas as origens. */
	public async getGroup(groupId: string): Promise<ArchbaseGroupReport> {
		return this.client.get<ArchbaseGroupReport>(
			`${this.getEndpoint()}/groups/${encodeURIComponent(groupId)}`,
			this.configureHeaders(),
		);
	}

	/** Idem para perfil — a via mais ampla, que vale para todo mundo que o tem. */
	public async getProfile(profileId: string): Promise<ArchbaseGroupReport> {
		return this.client.get<ArchbaseGroupReport>(
			`${this.getEndpoint()}/profiles/${encodeURIComponent(profileId)}`,
			this.configureHeaders(),
		);
	}

	/**
	 * Quem alcança uma capacidade — a consulta reversa.
	 *
	 * Inclui administrador, com a via marcada: ele alcança sem concessão nenhuma, e omiti-lo daria
	 * a resposta errada para a pergunta "quem pode".
	 */
	public async getReach(actionId: string): Promise<ArchbaseReachEntry[]> {
		return this.client.get<ArchbaseReachEntry[]>(
			`${this.getEndpoint()}/actions/${encodeURIComponent(actionId)}/reach`,
			this.configureHeaders(),
		);
	}

	/** O que a pessoa pode, com a origem de cada concessão. */
	public async getEffectiveAccessByUserId(userId: string): Promise<ArchbaseEffectiveAccessReport> {
		return this.client.get<ArchbaseEffectiveAccessReport>(
			`${this.getEndpoint()}/users/${encodeURIComponent(userId)}/effective`,
			this.configureHeaders(),
		);
	}

	/** Idem, buscando a pessoa pelo e-mail. */
	public async getEffectiveAccessByEmail(email: string): Promise<ArchbaseEffectiveAccessReport> {
		return this.client.get<ArchbaseEffectiveAccessReport>(
			`${this.getEndpoint()}/effective?email=${encodeURIComponent(email)}`,
			this.configureHeaders(),
		);
	}

	/**
	 * "Esta pessoa consegue fazer isto?"
	 *
	 * <p>A resposta traz a cadeia dos portões avaliados — é ela, e não o booleano, que diz o
	 * que precisa mudar para o acesso passar a existir.
	 */
	public async simulate(request: ArchbaseSimulationRequest): Promise<ArchbaseAccessDecision> {
		return this.client.post<ArchbaseSimulationRequest, ArchbaseAccessDecision>(
			`${this.getEndpoint()}/simulate`,
			request,
			this.configureHeaders(),
		);
	}

	/**
	 * Os acontecimentos de segurança, do mais recente para o mais antigo.
	 *
	 * <p>Sem período informado o servidor assume os últimos trinta dias — a primeira consulta de
	 * quem abre a tela não deve varrer a tabela inteira.
	 *
	 * <p>Devolve 403 para quem não é administrador, e 404 quando a trilha está desligada: os dois
	 * casos precisam ser distinguidos na tela, porque significam coisas diferentes.
	 */
	public async getAuditEvents(options: {
		usuario?: string;
		tipo?: ArchbaseSecurityEventType;
		inicio?: string;
		fim?: string;
		page?: number;
		size?: number;
	} = {}): Promise<ArchbaseSecurityEventPage> {
		const params = new URLSearchParams();
		if (options.usuario) params.set('usuario', options.usuario);
		if (options.tipo) params.set('tipo', options.tipo);
		if (options.inicio) params.set('inicio', options.inicio);
		if (options.fim) params.set('fim', options.fim);
		params.set('page', String(options.page ?? 0));
		params.set('size', String(options.size ?? 50));
		return this.client.get<ArchbaseSecurityEventPage>(
			`${this.getAuditEndpoint()}/events?${params.toString()}`,
			this.configureHeaders(),
		);
	}
}
inversify.decorate(inversify.inject(ARCHBASE_IOC_API_TYPE.ApiClient), ArchbaseSecurityDiagnosticsService, 0);
inversify.decorate(inversify.injectable(), ArchbaseSecurityDiagnosticsService);
