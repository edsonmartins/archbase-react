import React, { useContext } from 'react';
import { RegisterActionOptions } from './ArchbaseSecurityManager';
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
  registerAction: (actionName: string, actionDescription: string, opcoes?: RegisterActionOptions) => void;
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
      // O RÓTULO É O VERBO; a descrição continua sendo a frase inteira.
      //
      // Estas cinco linhas são a origem do problema que o rótulo veio resolver: elas geram a
      // descrição de TODA capacidade de tela do sistema, e o resultado é um catálogo com centenas de
      // "Criar X", "Editar X", "Listar X" — o único texto que a tela de permissões exibia. Separando
      // os dois, a lista passa a mostrar "Criar" sob o recurso, que é o que quem administra procura,
      // sem perder a frase completa, que continua explicando.
      registerAction('create', `Criar ${resourceDescription}`, { label: 'Criar' });
      registerAction('edit', `Editar ${resourceDescription}`, { label: 'Editar' });
      registerAction('delete', `Deletar ${resourceDescription}`, { label: 'Deletar' });
      registerAction('view', `Visualizar ${resourceDescription}`, { label: 'Visualizar' });
      registerAction('list', `Listar ${resourceDescription}`, { label: 'Listar' });
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