/**
 * Preparação para integração com TanStack Query
 *
 * Este arquivo define as estruturas e tipos necessários para integrar
 * o ArchbaseDataSourceV2 com TanStack Query para gerenciamento avançado
 * de cache e sincronização de dados remotos.
 */
import { ArchbaseRemoteDataSourceV2Config } from './ArchbaseRemoteDataSourceV2';
import { ArchbaseRemoteApiService } from '../../service/ArchbaseRemoteApiService';
/**
 * Configuração para integração com TanStack Query
 */
export interface ArchbaseTanStackQueryConfig<T> {
    /** Chave única para o cache do TanStack Query */
    queryKey: string | string[];
    /** Configuração do DataSource */
    dataSourceConfig: Omit<ArchbaseRemoteDataSourceV2Config<T>, 'service'>;
    /** Serviço para operações remotas */
    service: ArchbaseRemoteApiService<T, any>;
    /** Tempo de cache em milissegundos (padrão: 5 minutos) */
    staleTime?: number;
    /** Tempo para considerar dados expirados em milissegundos (padrão: 30 minutos) */
    cacheTime?: number;
    /** Refetch automático quando a janela ganha foco */
    refetchOnWindowFocus?: boolean;
    /** Refetch automático em intervalos */
    refetchInterval?: number;
    /** Habilitar retry automático em caso de erro */
    retry?: boolean | number;
    /** Função para transformar dados antes do cache */
    transformData?: (data: T[]) => T[];
    /** Função para validar se os dados em cache são válidos */
    isDataValid?: (data: T[]) => boolean;
}
/**
 * Estrutura para operações de cache do TanStack Query
 */
export interface ArchbaseQueryOperations<T> {
    /** Invalidar cache */
    invalidateQueries: () => void;
    /** Refetch dados */
    refetch: () => Promise<void>;
    /** Definir dados no cache manualmente */
    setQueryData: (data: T[]) => void;
    /** Obter dados do cache */
    getQueryData: () => T[] | undefined;
    /** Remover do cache */
    removeQueries: () => void;
    /** Pré-carregar dados */
    prefetchQuery: () => Promise<void>;
}
/**
 * Estado do TanStack Query para o DataSource
 */
export interface ArchbaseQueryState {
    /** Está carregando dados */
    isLoading: boolean;
    /** Está fazendo refetch */
    isFetching: boolean;
    /** Dados estão expirados */
    isStale: boolean;
    /** Erro da última operação */
    error: Error | null;
    /** Timestamp da última atualização */
    dataUpdatedAt: number;
    /** Status da query */
    status: 'idle' | 'loading' | 'error' | 'success';
}
/**
 * Hook futuro: useArchbaseDataSourceWithQuery
 *
 * Este hook combinará ArchbaseDataSourceV2 com TanStack Query
 * para gerenciamento avançado de cache e sincronização.
 *
 * Funcionalidades planejadas:
 * 1. Cache automático de dados remotos
 * 2. Invalidação inteligente de cache
 * 3. Refetch automático em cenários específicos
 * 4. Otimistic updates para operações CRUD
 * 5. Background refetch quando dados ficam stale
 * 6. Retry automático em caso de falhas de rede
 * 7. Prefetch de dados relacionados
 * 8. Sincronização entre múltiplas instâncias do mesmo DataSource
 *
 * Exemplo de uso futuro:
 *
 * ```typescript
 * const {
 *   dataSource,
 *   currentRecord,
 *   isLoading,
 *   isFetching,
 *   error,
 *   operations
 * } = useArchbaseDataSourceWithQuery({
 *   queryKey: ['pessoas', { filter: activeFilter }],
 *   dataSourceConfig: {
 *     name: 'pessoas-datasource',
 *     pageSize: 20
 *   },
 *   service: pessoaService,
 *   staleTime: 5 * 60 * 1000, // 5 minutos
 *   cacheTime: 30 * 60 * 1000, // 30 minutos
 *   refetchOnWindowFocus: true
 * });
 *
 * // Invalidar cache quando dados são modificados
 * const handleSave = async () => {
 *   await dataSource.save();
 *   operations.invalidateQueries();
 * };
 *
 * // Prefetch dados relacionados
 * useEffect(() => {
 *   if (currentRecord) {
 *     operations.prefetchQuery(['pessoa-detalhes', currentRecord.id]);
 *   }
 * }, [currentRecord]);
 * ```
 */
/**
 * Utilitários para integração com TanStack Query
 */
export declare class ArchbaseQueryUtils {
    /**
     * Gera chave de query baseada no DataSource e filtros
     */
    static generateQueryKey<T>(dataSourceName: string, filter?: any, sort?: any, page?: number): string[];
    /**
     * Determina se os dados precisam ser refetch baseado em critérios
     */
    static shouldRefetch(lastFetch: number, staleTime: number, userInteraction?: boolean): boolean;
    /**
     * Merge optimistic updates com dados em cache
     */
    static mergeOptimisticUpdate<T>(cachedData: T[], optimisticUpdate: Partial<T>, identifier: keyof T): T[];
}
/**
 * Configurações padrão para diferentes cenários
 */
export declare const ARCHBASE_QUERY_DEFAULTS: {
    /** Configuração para dados que mudam raramente */
    readonly STATIC_DATA: {
        readonly staleTime: number;
        readonly cacheTime: number;
        readonly refetchOnWindowFocus: false;
        readonly retry: 1;
    };
    /** Configuração para dados dinâmicos */
    readonly DYNAMIC_DATA: {
        readonly staleTime: number;
        readonly cacheTime: number;
        readonly refetchOnWindowFocus: true;
        readonly retry: 3;
    };
    /** Configuração para dados em tempo real */
    readonly REALTIME_DATA: {
        readonly staleTime: number;
        readonly cacheTime: number;
        readonly refetchOnWindowFocus: true;
        readonly refetchInterval: number;
        readonly retry: 5;
    };
};
/**
 * Tipos para implementação futura
 */
export type ArchbaseQueryHookReturn<T> = {
    dataSource: any;
    queryState: ArchbaseQueryState;
    operations: ArchbaseQueryOperations<T>;
    currentRecord?: T;
    currentIndex: number;
    totalRecords: number;
    isLoading: boolean;
    error: string | null;
};
/**
 * Comentários para implementação futura:
 *
 * 1. INTEGRAÇÃO COM TANSTACK QUERY:
 *    - Instalar @tanstack/react-query como dependência
 *    - Criar wrapper que combine DataSource com useQuery/useMutation
 *    - Implementar cache inteligente baseado em chaves geradas automaticamente
 *
 * 2. OPTIMISTIC UPDATES:
 *    - Implementar updates otimistas para operações CRUD
 *    - Rollback automático em caso de erro
 *    - Sincronização com estado do DataSource
 *
 * 3. INVALIDAÇÃO DE CACHE:
 *    - Invalidação automática após mutations
 *    - Invalidação baseada em relacionamentos de dados
 *    - Invalidação inteligente para queries relacionadas
 *
 * 4. BACKGROUND SYNC:
 *    - Sincronização em background quando dados ficam stale
 *    - Notificações quando dados são atualizados
 *    - Merge inteligente de mudanças remotas
 *
 * 5. PERFORMANCE:
 *    - Lazy loading de dados relacionados
 *    - Prefetch de próximas páginas
 *    - Cache de queries frequentes
 *
 * 6. OFFLINE SUPPORT:
 *    - Persistência local de dados críticos
 *    - Queue de operações para quando voltar online
 *    - Indicadores de status de conexão
 */ 
//# sourceMappingURL=ArchbaseQueryIntegration.d.ts.map
