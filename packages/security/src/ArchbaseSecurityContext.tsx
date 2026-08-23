/**
 * ArchbaseSecurityProvider — provider de segurança com autenticação, tokens e permissões.
 * @status stable
 */
import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback, ReactNode } from 'react';
import { Box, Stack, Group, Skeleton, Loader, Text } from '@mantine/core';
import { ARCHBASE_IOC_API_TYPE, IOCContainer, processErrorMessage } from '@archbase/core';
import { ArchbaseSecurityManager } from './ArchbaseSecurityManager';
import { ArchbaseResourceService } from './ArchbaseResourceService';
import { UserDto } from './SecurityDomain';

/**
 * Componente de loading padrão para o carregamento de permissões.
 * Exibe um skeleton animado enquanto as permissões são carregadas.
 */
export const DefaultSecurityLoading: React.FC = () => (
	<Box p="xl" style={{ width: '100%', height: '100%' }}>
		<Stack gap="md">
			<Group gap="sm">
				<Loader size="sm" />
				<Text size="sm" c="dimmed">Carregando permissões...</Text>
			</Group>
			<Skeleton height={40} radius="sm" />
			<Skeleton height={200} radius="sm" />
			<Group gap="md">
				<Skeleton height={36} width={100} radius="sm" />
				<Skeleton height={36} width={100} radius="sm" />
			</Group>
		</Stack>
	</Box>
);

// Tipos para o contexto de segurança global
export interface ArchbaseSecurityContextType {
  user: UserDto | null;
  /** Verdadeiro enquanto as permissões do usuário ainda não chegaram. */
  isLoading: boolean;
  /**
   * Se o usuário alcança uma capacidade.
   *
   * Aceita as duas formas: `"tms.ordemservico:aprovar_custo"` pergunta pela capacidade exata;
   * `"aprovar_custo"` pergunta se ele tem essa ação em algum recurso — a forma antiga, mantida
   * por compatibilidade e imprecisa por natureza, já que o mesmo verbo existe em vários recursos.
   */
  hasGlobalPermission: (actionName: string) => boolean;
  hasAnyGlobalPermission: (actions: string[]) => boolean;
  hasAllGlobalPermissions: (actions: string[]) => boolean;
  /** A capacidade exata, sem a ambiguidade do nome solto. Prefira esta. */
  hasResourcePermission: (resourceName: string, actionName: string) => boolean;
  /** Se o usuário tem QUALQUER ação concedida no recurso — a pergunta que um menu faz. */
  canAccessResource: (resourceName: string) => boolean;
  /** Nome do recurso para as ações concedidas nele. Vazio enquanto carrega ou se não deu para saber. */
  permissionsByResource: Record<string, string[]>;
  /**
   * As permissões não puderam ser carregadas — backend anterior ao archbase-security 3.2.3, ou
   * falha de rede.
   *
   * <p>Existe para que "não pode nada" e "não deu para saber" não se confundam. Enquanto for
   * verdadeiro, os `has*` respondem `false`, e é o consumidor quem decide o que fazer com isso:
   * esconder o controle ou liberá-lo. Sem este campo, a decisão seria tomada em silêncio — que é
   * exatamente como este provider passou a versão inteira respondendo `false` para todo mundo.
   */
  permissionsUnavailable: boolean;
  isAdmin: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

// Context global
const ArchbaseSecurityContext = createContext<ArchbaseSecurityContextType | null>(null);

// Provider principal de segurança
export interface ArchbaseSecurityProviderProps {
  children: ReactNode;
  user: UserDto | null;
  onError?: (error: string) => void;
}

export const ArchbaseSecurityProvider: React.FC<ArchbaseSecurityProviderProps> = ({
  children,
  user,
  onError
}) => {
  const [error, setError] = useState<string | null>(null);
  const [permissionsByResource, setPermissionsByResource] = useState<Record<string, string[]>>({});
  const [permissionsUnavailable, setPermissionsUnavailable] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(!!user);

  const isAdmin = user?.isAdministrator || false;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  /**
   * Carrega, uma vez por usuário, tudo que ele alcança.
   *
   * <p>Antes este provider tinha `const [globalPermissions] = useState<string[]>([])` — sem
   * setter, nunca preenchido. `hasGlobalPermission` respondia `false` para todo não-administrador,
   * em todas as versões, sem que nada indicasse a diferença entre "não pode" e "ninguém carregou".
   * Toda tela que gatilhasse controle por ele escondia o controle de quem tinha direito.
   *
   * <p>A dependência é `user?.id` e não `user`: aplicações costumam montar o objeto do usuário
   * como literal a cada render, e com o objeto na lista isto viraria uma requisição por render.
   */
  useEffect(() => {
    if (!user?.id) {
      setPermissionsByResource({});
      setPermissionsUnavailable(false);
      setIsLoading(false);
      return;
    }

    let ativo = true;
    setIsLoading(true);

    const resourceService = IOCContainer
      .getContainer()
      .get<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource);

    resourceService
      .findLoggedUserPermissions()
      .then((resposta) => {
        if (!ativo) return;
        if (resposta === null) {
          // Endpoint ausente: backend anterior ao archbase-security 3.2.3.
          setPermissionsByResource({});
          setPermissionsUnavailable(true);
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              '[ArchbaseSecurityProvider] GET /api/v1/resource/my-permissions não existe neste ' +
              'backend (exige archbase-security 3.2.3+). hasGlobalPermission responderá false ' +
              'para quem não é administrador. Use `permissionsUnavailable` para decidir o que ' +
              'fazer nesse caso em vez de tratar o false como negação.'
            );
          }
          return;
        }
        setPermissionsByResource(resposta.permissions ?? {});
        setPermissionsUnavailable(false);
      })
      .catch((erro) => {
        if (!ativo) return;
        setPermissionsByResource({});
        setPermissionsUnavailable(true);
        const mensagem = processErrorMessage(erro);
        setError(mensagem);
        onErrorRef.current?.(mensagem);
      })
      .finally(() => {
        if (ativo) setIsLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [user?.id]);

  const hasResourcePermission = useCallback((resourceName: string, actionName: string): boolean => {
    if (isAdmin) return true;
    return (permissionsByResource[resourceName] ?? []).includes(actionName);
  }, [permissionsByResource, isAdmin]);

  const canAccessResource = useCallback((resourceName: string): boolean => {
    if (isAdmin) return true;
    return (permissionsByResource[resourceName] ?? []).length > 0;
  }, [permissionsByResource, isAdmin]);

  const hasGlobalPermission = useCallback((actionName: string): boolean => {
    if (isAdmin) return true;
    const separador = actionName.indexOf(':');
    if (separador > 0) {
      return hasResourcePermission(
        actionName.slice(0, separador),
        actionName.slice(separador + 1)
      );
    }
    // Nome solto: procura em qualquer recurso. É a semântica antiga, e é grosseira de propósito —
    // "edit" existe em dezenas de recursos. Quem precisa de precisão usa hasResourcePermission.
    return Object.values(permissionsByResource).some((acoes) => acoes.includes(actionName));
  }, [permissionsByResource, isAdmin, hasResourcePermission]);

  const hasAnyGlobalPermission = useCallback((actions: string[]): boolean => {
    if (isAdmin) return true;
    return actions.some((action) => hasGlobalPermission(action));
  }, [hasGlobalPermission, isAdmin]);

  const hasAllGlobalPermissions = useCallback((actions: string[]): boolean => {
    if (isAdmin) return true;
    return actions.every((action) => hasGlobalPermission(action));
  }, [hasGlobalPermission, isAdmin]);

  const handleSetError = useCallback((newError: string | null) => {
    setError(newError);
    if (newError && onErrorRef.current) {
      onErrorRef.current(newError);
    }
  }, []);

  const value = useMemo<ArchbaseSecurityContextType>(() => ({
    user,
    isLoading,
    hasGlobalPermission,
    hasAnyGlobalPermission,
    hasAllGlobalPermissions,
    hasResourcePermission,
    canAccessResource,
    permissionsByResource,
    permissionsUnavailable,
    isAdmin,
    error,
    setError: handleSetError
  }), [
    user, isLoading, hasGlobalPermission, hasAnyGlobalPermission, hasAllGlobalPermissions,
    hasResourcePermission, canAccessResource, permissionsByResource, permissionsUnavailable,
    isAdmin, error, handleSetError
  ]);

  return (
    <ArchbaseSecurityContext.Provider value={value}>
      {children}
    </ArchbaseSecurityContext.Provider>
  );
};

// Context específico para views
export interface ArchbaseViewSecurityContextType {
  securityManager: ArchbaseSecurityManager | null;
  hasPermission: (actionName: string) => boolean;
  hasAnyPermission: (actions: string[]) => boolean;
  hasAllPermissions: (actions: string[]) => boolean;
  registerAction: (actionName: string, actionDescription: string) => void;
  isLoading: boolean;
  error: string | null;
}

const ArchbaseViewSecurityContext = createContext<ArchbaseViewSecurityContextType | null>(null);

// Provider específico para Views/Formulários
export interface ArchbaseViewSecurityProviderProps {
  children: ReactNode;
  resourceName: string;
  resourceDescription: string;
  requiredPermissions?: string[];
  fallbackComponent?: ReactNode;
  /** Componente customizado para exibir durante o carregamento de permissões */
  loadingComponent?: ReactNode;
  onSecurityReady?: (manager: ArchbaseSecurityManager) => void;
  onError?: (error: string) => void;
}

export const ArchbaseViewSecurityProvider: React.FC<ArchbaseViewSecurityProviderProps> = ({
  children,
  resourceName,
  resourceDescription,
  requiredPermissions = [],
  fallbackComponent,
  loadingComponent,
  onSecurityReady,
  onError
}) => {
  const globalContext = useContext(ArchbaseSecurityContext);

  if (!globalContext) {
    throw new Error('ArchbaseViewSecurityProvider deve ser usado dentro de um ArchbaseSecurityProvider');
  }

  const { user, isAdmin } = globalContext;

  /**
   * O manager nasce no RENDER, não no efeito — e é isto que conserta o defeito central.
   *
   * Antes ele era criado dentro do `useEffect` e só entrava no contexto depois que o `apply()`
   * voltava; enquanto isso o provider renderizava o loading NO LUGAR dos filhos. Nenhum filho
   * chegava a montar, ninguém chamava `registerAction`, e o `apply()` saía com `actions: []`.
   * Como o backend lia lista vazia como "todas as ações estão faltando", a primeira abertura de
   * cada tela DESATIVAVA o catálogo inteiro daquele recurso. No gestor-rq isso zerou 56 dos 100
   * recursos e deixou 63% das concessões apontando para ação inativa.
   *
   * Com o manager disponível desde o primeiro render, os filhos montam, registram suas ações nos
   * próprios efeitos, e só então o efeito DESTE provider roda — porque o React executa efeitos de
   * baixo para cima, do filho para o pai. A ordem que faltava é a garantia.
   */
  const viewSecurityManager = useMemo(
    () => new ArchbaseSecurityManager(resourceName, resourceDescription, isAdmin),
    [resourceName, resourceDescription, isAdmin, user?.id]
  );

  const [isViewLoading, setIsViewLoading] = useState<boolean>(!!user);
  const [viewError, setViewError] = useState<string | null>(null);

  /**
   * Callbacks em ref, fora das dependências do efeito.
   *
   * Quem passa `onSecurityReady={() => ...}` cria uma função nova a cada render; com ela na lista
   * de dependências, o efeito redisparava, um manager novo era construído e outro
   * `POST /resource/register` saía — a cada render. O mesmo valia para `user`, que aplicações
   * costumam recriar como objeto literal. Por isso a dependência agora é `user?.id`.
   */
  const onSecurityReadyRef = useRef(onSecurityReady);
  const onErrorRef = useRef(onError);
  onSecurityReadyRef.current = onSecurityReady;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!user) {
      setIsViewLoading(false);
      return;
    }

    let ativo = true;
    setIsViewLoading(true);
    setViewError(null);

    viewSecurityManager
      .apply(() => {
        if (!ativo) return;
        setIsViewLoading(false);
        onSecurityReadyRef.current?.(viewSecurityManager);
      })
      .catch(() => {
        if (!ativo) return;
        const errorMessage = viewSecurityManager.getError() || 'Erro ao carregar permissões';
        setViewError(errorMessage);
        setIsViewLoading(false);
        onErrorRef.current?.(errorMessage);
      });

    return () => {
      ativo = false;
    };
  }, [viewSecurityManager, user?.id]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && loadingComponent) {
      console.warn(
        '[ArchbaseViewSecurityProvider] `loadingComponent` não substitui mais os filhos. ' +
        'Substituí-los impedia que registrassem suas ações e zerava o catálogo do recurso. ' +
        'Use `isLoading` de useArchbaseViewSecurity/useArchbaseSecureForm para desenhar o seu ' +
        'próprio estado de carregamento.'
      );
    }
  }, [loadingComponent]);

  const viewValue = useMemo<ArchbaseViewSecurityContextType>(() => ({
    securityManager: viewSecurityManager,
    hasPermission: (actionName: string) => viewSecurityManager.hasPermission(actionName),
    hasAnyPermission: (actions: string[]) => actions.some((a) => viewSecurityManager.hasPermission(a)),
    hasAllPermissions: (actions: string[]) => actions.every((a) => viewSecurityManager.hasPermission(a)),
    registerAction: (actionName: string, actionDescription: string) =>
      viewSecurityManager.registerAction(actionName, actionDescription),
    isLoading: isViewLoading,
    error: viewError
  }), [viewSecurityManager, isViewLoading, viewError]);

  if (!user) {
    return <>{fallbackComponent || (
      <div className="archbase-security-no-user">
        <div>É necessário fazer login para acessar esta área</div>
      </div>
    )}</>;
  }

  if (viewError) {
    return (
      <div className="archbase-security-error">
        <div>Erro ao carregar permissões: {viewError}</div>
      </div>
    );
  }

  // A tranca de `requiredPermissions` só vale depois que a resposta chegou. Aplicá-la durante o
  // carregamento negaria acesso a todo mundo no primeiro render, porque `permissions` ainda está
  // vazio — e a tela piscaria "sem permissão" antes de abrir.
  if (!isViewLoading && requiredPermissions.length > 0) {
    const hasRequiredAccess = requiredPermissions.every((permission) =>
      viewSecurityManager.hasPermission(permission)
    );

    if (!hasRequiredAccess) {
      return <>{fallbackComponent || (
        <div className="archbase-security-access-denied">
          <div>Você não possui permissão para acessar esta área</div>
          <small>Permissões necessárias: {requiredPermissions.join(', ')}</small>
        </div>
      )}</>;
    }
  }

  // Os filhos renderizam SEMPRE, inclusive carregando. É o preço — e a razão — da correção:
  // sem eles montados não há registro de ação. Enquanto carrega, `hasPermission` responde false,
  // então controle vigiado nasce desabilitado e habilita quando a resposta chega. Quem não quiser
  // esse instante usa `isLoading` para segurar o próprio conteúdo.
  return (
    <ArchbaseViewSecurityContext.Provider value={viewValue}>
      {children}
    </ArchbaseViewSecurityContext.Provider>
  );
};

// Export dos contexts para uso nos hooks
export { ArchbaseSecurityContext, ArchbaseViewSecurityContext };
