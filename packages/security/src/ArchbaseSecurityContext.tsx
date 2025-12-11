/**
 * ArchbaseSecurityProvider — provider de segurança com autenticação, tokens e permissões.
 * @status stable
 */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ArchbaseSecurityManager } from './ArchbaseSecurityManager';
import { UserDto } from './SecurityDomain';

// Tipos para o contexto de segurança global
export interface ArchbaseSecurityContextType {
  user: UserDto | null;
  isLoading: boolean;
  hasGlobalPermission: (actionName: string) => boolean;
  hasAnyGlobalPermission: (actions: string[]) => boolean;
  hasAllGlobalPermissions: (actions: string[]) => boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalPermissions] = useState<string[]>([]);

  const isAdmin = user?.isAdministrator || false;

  // Funções globais para verificar permissões
  const hasGlobalPermission = useCallback((actionName: string): boolean => {
    if (isAdmin) return true;
    return globalPermissions.includes(actionName);
  }, [globalPermissions, isAdmin]);

  const hasAnyGlobalPermission = useCallback((actions: string[]): boolean => {
    if (isAdmin) return true;
    return actions.some(action => globalPermissions.includes(action));
  }, [globalPermissions, isAdmin]);

  const hasAllGlobalPermissions = useCallback((actions: string[]): boolean => {
    if (isAdmin) return true;
    return actions.every(action => globalPermissions.includes(action));
  }, [globalPermissions, isAdmin]);

  const handleSetError = useCallback((newError: string | null) => {
    setError(newError);
    if (newError && onError) {
      onError(newError);
    }
  }, [onError]);

  const value: ArchbaseSecurityContextType = {
    user,
    isLoading,
    hasGlobalPermission,
    hasAnyGlobalPermission,
    hasAllGlobalPermissions,
    isAdmin,
    error,
    setError: handleSetError
  };

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
  onSecurityReady?: (manager: ArchbaseSecurityManager) => void;
  onError?: (error: string) => void;
}

export const ArchbaseViewSecurityProvider: React.FC<ArchbaseViewSecurityProviderProps> = ({
  children,
  resourceName,
  resourceDescription,
  requiredPermissions = [],
  fallbackComponent,
  onSecurityReady,
  onError
}) => {
  const globalContext = useContext(ArchbaseSecurityContext);
  
  if (!globalContext) {
    throw new Error('ArchbaseViewSecurityProvider deve ser usado dentro de um ArchbaseSecurityProvider');
  }

  const { user, isAdmin } = globalContext;
  const [viewSecurityManager, setViewSecurityManager] = useState<ArchbaseSecurityManager | null>(null);
  const [isViewLoading, setIsViewLoading] = useState(true);
  const [viewError, setViewError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!user) {
      setIsViewLoading(false);
      return;
    }

    const manager = new ArchbaseSecurityManager(resourceName, resourceDescription, isAdmin);
    
    const applyManager = async () => {
      setIsViewLoading(true);
      try {
        await manager.apply(() => {
          setViewSecurityManager(manager);
          setIsViewLoading(false);
          if (onSecurityReady) {
            onSecurityReady(manager);
          }
        });
      } catch (error) {
        const errorMessage = manager.getError() || 'Erro ao carregar permissões';
        setViewError(errorMessage);
        setIsViewLoading(false);
        if (onError) {
          onError(errorMessage);
        }
      }
    };

    applyManager();
  }, [resourceName, resourceDescription, user, isAdmin, onSecurityReady, onError]);

  // Estados de carregamento e erro
  if (isViewLoading) {
    return (
      <div className="archbase-security-loading">
        <div>Carregando permissões...</div>
      </div>
    );
  }

  if (viewError) {
    return (
      <div className="archbase-security-error">
        <div>Erro ao carregar permissões: {viewError}</div>
      </div>
    );
  }

  if (!user) {
    return fallbackComponent || (
      <div className="archbase-security-no-user">
        <div>É necessário fazer login para acessar esta área</div>
      </div>
    );
  }

  // Verifica permissões obrigatórias
  if (requiredPermissions.length > 0 && viewSecurityManager) {
    const hasRequiredAccess = requiredPermissions.every(permission => 
      viewSecurityManager.hasPermission(permission)
    );
    
    if (!hasRequiredAccess) {
      return fallbackComponent || (
        <div className="archbase-security-access-denied">
          <div>Você não possui permissão para acessar esta área</div>
          <small>Permissões necessárias: {requiredPermissions.join(', ')}</small>
        </div>
      );
    }
  }

  // Funções do contexto da view
  const hasPermission = (actionName: string) => viewSecurityManager?.hasPermission(actionName) || false;
  
  const hasAnyPermission = (actions: string[]) => 
    actions.some(action => viewSecurityManager?.hasPermission(action) || false);
  
  const hasAllPermissions = (actions: string[]) => 
    actions.every(action => viewSecurityManager?.hasPermission(action) || false);

  const registerAction = (actionName: string, actionDescription: string) => {
    viewSecurityManager?.registerAction(actionName, actionDescription);
  };

  const viewValue: ArchbaseViewSecurityContextType = {
    securityManager: viewSecurityManager,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    registerAction,
    isLoading: isViewLoading,
    error: viewError
  };

  return (
    <ArchbaseViewSecurityContext.Provider value={viewValue}>
      {children}
    </ArchbaseViewSecurityContext.Provider>
  );
};

// Export dos contexts para uso nos hooks
export { ArchbaseSecurityContext, ArchbaseViewSecurityContext };
