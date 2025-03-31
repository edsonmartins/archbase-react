import { BehaviorSubject } from 'rxjs';

export interface ArchbaseTenantInfo {
  id: string;
  code?: string;
  descricao: string;
  imagemApresentacao?: string;
}

export class ArchbaseTenantManager {
  private static instance: ArchbaseTenantManager;
  private _currentTenant = new BehaviorSubject<ArchbaseTenantInfo | null>(null);
  private _availableTenants = new BehaviorSubject<ArchbaseTenantInfo[]>([]);

  private constructor() {
    // Inicializa com o tenant armazenado, se existir
    const storedTenant = localStorage.getItem('tenant_info');
    if (storedTenant) {
      try {
        this._currentTenant.next(JSON.parse(storedTenant));
      } catch (e) {
        console.error('Erro ao carregar tenant armazenado:', e);
      }
    }
  }

  public static getInstance(): ArchbaseTenantManager {
    if (!ArchbaseTenantManager.instance) {
      ArchbaseTenantManager.instance = new ArchbaseTenantManager();
    }
    return ArchbaseTenantManager.instance;
  }

  get currentTenant$() {
    return this._currentTenant.asObservable();
  }

  get currentTenant(): ArchbaseTenantInfo | null {
    return this._currentTenant.getValue();
  }

  get availableTenants$() {
    return this._availableTenants.asObservable();
  }

  get availableTenants(): ArchbaseTenantInfo[] {
    return this._availableTenants.getValue();
  }

  setCurrentTenant(tenant: ArchbaseTenantInfo | null): void {
    this._currentTenant.next(tenant);
    if (tenant) {
      localStorage.setItem('tenant_id', tenant.id);
      localStorage.setItem('tenant_info', JSON.stringify(tenant));
    } else {
      localStorage.removeItem('tenant_id');
      localStorage.removeItem('tenant_info');
    }
  }

  setAvailableTenants(tenants: ArchbaseTenantInfo[]): void {
    this._availableTenants.next(tenants);
  }

  clear(): void {
    this._currentTenant.next(null);
    this._availableTenants.next([]);
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('tenant_info');
  }

  // Helper para headers de API
  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const tenant = this.currentTenant;

    if (tenant) {
      headers['X-TENANT-ID'] = tenant.id;
    }

    return headers;
  }
}

// Hook para usar o TenantManager nos componentes React
export function useArchbaseTenantManager() {
  return ArchbaseTenantManager.getInstance();
}
