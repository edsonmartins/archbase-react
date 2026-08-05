import { ArchbaseRemoteApiClient } from '@archbase/data';
import * as inversify from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from '@archbase/core';
import { ArchbaseTenantManager } from './ArchbaseTenantManager';
import type {
	ArchbaseAccessDecision,
	ArchbaseAccessOverview,
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

	/** Retrato do tenant: contagens do catálogo e o estado das proteções configuráveis. */
	public async getOverview(): Promise<ArchbaseAccessOverview> {
		return this.client.get<ArchbaseAccessOverview>(`${this.getEndpoint()}/overview`, this.configureHeaders());
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
}
inversify.decorate(inversify.inject(ARCHBASE_IOC_API_TYPE.ApiClient), ArchbaseSecurityDiagnosticsService, 0);
inversify.decorate(inversify.injectable(), ArchbaseSecurityDiagnosticsService);
