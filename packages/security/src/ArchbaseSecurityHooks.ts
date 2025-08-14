import React, { useContext } from 'react';
import { 
  ArchbaseSecurityContext, 
  ArchbaseViewSecurityContext,
  ArchbaseSecurityContextType,
  ArchbaseViewSecurityContextType
} from './ArchbaseSecurityContext';

// Hook para segurança global
export const useArchbaseSecurity = (): ArchbaseSecurityContextType => {
  const context = useContext(ArchbaseSecurityContext);
  if (!context) {
    throw new Error('useArchbaseSecurity deve ser usado dentro de um ArchbaseSecurityProvider');
  }
  return context;
};

// Hook para segurança de view específica
export const useArchbaseViewSecurity = (): ArchbaseViewSecurityContextType => {
  const context = useContext(ArchbaseViewSecurityContext);
  if (!context) {
    throw new Error('useArchbaseViewSecurity deve ser usado dentro de um ArchbaseViewSecurityProvider');
  }
  return context;
};

// Hook especializado para formulários
export interface UseArchbaseSecureFormReturn {
  hasPermission: (actionName: string) => boolean;
  hasAnyPermission: (actions: string[]) => boolean;
  hasAllPermissions: (actions: string[]) => boolean;
  registerAction: (actionName: string, actionDescription: string) => void;
  securityManager: any; // ArchbaseSecurityManager
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canList: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useArchbaseSecureForm = (
  resourceName?: string, 
  resourceDescription?: string
): UseArchbaseSecureFormReturn => {
  const viewContext = useArchbaseViewSecurity();
  const { hasPermission, hasAnyPermission, hasAllPermissions, registerAction, securityManager, isLoading, error } = viewContext;

  // Registra ações básicas automaticamente se fornecido nome do recurso
  React.useEffect(() => {
    if (resourceName && resourceDescription) {
      registerAction('create', `Criar ${resourceDescription}`);
      registerAction('edit', `Editar ${resourceDescription}`);
      registerAction('delete', `Deletar ${resourceDescription}`);
      registerAction('view', `Visualizar ${resourceDescription}`);
      registerAction('list', `Listar ${resourceDescription}`);
    }
  }, [resourceName, resourceDescription, registerAction]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    registerAction,
    securityManager,
    canCreate: hasPermission('create'),
    canEdit: hasPermission('edit'),
    canDelete: hasPermission('delete'),
    canView: hasPermission('view'),
    canList: hasPermission('list'),
    isLoading,
    error
  };
};

// Hook para verificações condicionais rápidas
export const useArchbasePermissionCheck = () => {
  const viewContext = useArchbaseViewSecurity();
  
  return {
    check: viewContext.hasPermission,
    checkAny: viewContext.hasAnyPermission,
    checkAll: viewContext.hasAllPermissions,
    isAdmin: useArchbaseSecurity().isAdmin
  };
};