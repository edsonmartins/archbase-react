export interface ArchbaseTenantInfo {
    id: string;
    code?: string;
    descricao: string;
    imagemApresentacao?: string;
}
export declare class ArchbaseTenantManager {
    private static instance;
    private _currentTenant;
    private _availableTenants;
    private constructor();
    static getInstance(): ArchbaseTenantManager;
    get currentTenant$(): import("rxjs").Observable<ArchbaseTenantInfo | null>;
    get currentTenant(): ArchbaseTenantInfo | null;
    get availableTenants$(): import("rxjs").Observable<ArchbaseTenantInfo[]>;
    get availableTenants(): ArchbaseTenantInfo[];
    setCurrentTenant(tenant: ArchbaseTenantInfo | null): void;
    setAvailableTenants(tenants: ArchbaseTenantInfo[]): void;
    clear(): void;
    getHeaders(): Record<string, string>;
}
export declare function useArchbaseTenantManager(): ArchbaseTenantManager;
