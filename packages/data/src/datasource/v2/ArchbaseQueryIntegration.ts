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
export class ArchbaseQueryUtils {
  /**
   * Gera chave de query baseada no DataSource e filtros
   */
  static generateQueryKey<T>(
    dataSourceName: string,
    filter?: any,
    sort?: any,
    page?: number
  ): string[] {
    const baseKey = ['archbase-datasource', dataSourceName];
    
    if (filter) {
      baseKey.push('filter', JSON.stringify(filter));
    }
    
    if (sort) {
      baseKey.push('sort', JSON.stringify(sort));
    }
    
    if (page !== undefined) {
      baseKey.push('page', page.toString());
    }
    
    return baseKey;
  }
  
  /**
   * Determina se os dados precisam ser refetch baseado em critérios
   */
  static shouldRefetch(
    lastFetch: number,
    staleTime: number,
    userInteraction: boolean = false
  ): boolean {
    const now = Date.now();
    const isStale = now - lastFetch > staleTime;
    
    // Sempre refetch em interações do usuário se dados estão stale
    if (userInteraction && isStale) {
      return true;
    }
    
    // Refetch se dados estão muito antigos (2x stale time)
    if (now - lastFetch > staleTime * 2) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Merge optimistic updates com dados em cache
   */
  static mergeOptimisticUpdate<T>(
    cachedData: T[],
    optimisticUpdate: Partial<T>,
    identifier: keyof T
  ): T[] {
    return cachedData.map(item => 
      item[identifier] === optimisticUpdate[identifier]
        ? { ...item, ...optimisticUpdate }
        : item
    );
  }
}

/**
 * Configurações padrão para diferentes cenários
 */
export const ARCHBASE_QUERY_DEFAULTS = {
  /** Configuração para dados que mudam raramente */
  STATIC_DATA: {
    staleTime: 30 * 60 * 1000, // 30 minutos
    cacheTime: 60 * 60 * 1000, // 1 hora
    refetchOnWindowFocus: false,
    retry: 1
  },
  
  /** Configuração para dados dinâmicos */
  DYNAMIC_DATA: {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: true,
    retry: 3
  },
  
  /** Configuração para dados em tempo real */
  REALTIME_DATA: {
    staleTime: 30 * 1000, // 30 segundos
    cacheTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // 1 minuto
    retry: 5
  }
} as const;

/**
 * Tipos para implementação futura
 */
export type ArchbaseQueryHookReturn<T> = {
  dataSource: any; // Será ArchbaseDataSourceV2<T> | ArchbaseRemoteDataSourceV2<T>
  queryState: ArchbaseQueryState;
  operations: ArchbaseQueryOperations<T>;
  // Todos os retornos do hook do DataSource normal
  currentRecord?: T;
  currentIndex: number;
  totalRecords: number;
  isLoading: boolean;
  error: string | null;
  // ... outros campos
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
