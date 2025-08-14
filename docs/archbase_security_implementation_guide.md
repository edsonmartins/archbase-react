# Guia de Implementação - Sistema de Segurança Archbase

Este documento descreve as alterações necessárias para implementar o novo sistema de segurança baseado em React Context na biblioteca Archbase.

## 📋 Resumo das Alterações

### Arquivos a serem criados:
1. `ArchbaseSecurityContext.tsx` - Context e Providers principais
2. `ArchbaseSecurityHooks.ts` - Hooks customizados
3. `ArchbaseSecurityComponents.tsx` - Componentes de proteção
4. `types/ArchbaseSecurityTypes.ts` - Tipos TypeScript
5. `index.ts` - Exports da biblioteca

### Arquivos a serem modificados:
1. `ArchbaseSecurityManager.tsx` - Adicionar métodos públicos
2. `package.json` - Dependências se necessário

---

## 🚀 1. Criação dos Arquivos Principais

### 1.1 Context Principal (`ArchbaseSecurityContext.tsx`)

```typescript
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
```

### 1.2 Hooks Customizados (`ArchbaseSecurityHooks.ts`)

```typescript
import { useContext } from 'react';
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
```

### 1.3 Componentes de Proteção (`ArchbaseSecurityComponents.tsx`)

```typescript
import React, { useEffect, ReactNode } from 'react';
import { useArchbaseViewSecurity } from './ArchbaseSecurityHooks';

// Componente de proteção genérico
export interface ArchbaseProtectedComponentProps {
  children: ReactNode;
  actionName?: string;
  requiredPermissions?: string[];
  requireAll?: boolean;
  actionDescription?: string;
  fallback?: ReactNode;
  autoRegister?: boolean;
}

export const ArchbaseProtectedComponent: React.FC<ArchbaseProtectedComponentProps> = ({
  children,
  actionName,
  requiredPermissions = [],
  requireAll = true,
  actionDescription,
  fallback = null,
  autoRegister = true
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, registerAction } = useArchbaseViewSecurity();

  // Auto-registra a ação se necessário
  useEffect(() => {
    if (autoRegister && actionName && actionDescription) {
      registerAction(actionName, actionDescription);
    }
  }, [actionName, actionDescription, autoRegister, registerAction]);

  // Determina se tem acesso
  let hasAccess = false;

  if (actionName) {
    hasAccess = hasPermission(actionName);
  } else if (requiredPermissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  } else {
    // Se não especificou nenhuma permissão, permite acesso
    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Botão de ação protegido
export interface ArchbaseSecureActionButtonProps {
  actionName: string;
  actionDescription: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset';
}

export const ArchbaseSecureActionButton: React.FC<ArchbaseSecureActionButtonProps> = ({
  actionName,
  actionDescription,
  children,
  onClick,
  disabled = false,
  className = '',
  style = {},
  variant = 'primary',
  size = 'medium',
  type = 'button'
}) => {
  const getButtonClasses = () => {
    const baseClass = 'archbase-secure-btn';
    const variantClass = `archbase-secure-btn--${variant}`;
    const sizeClass = `archbase-secure-btn--${size}`;
    return `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();
  };

  const getButtonStyle = () => {
    const sizes = {
      small: { padding: '4px 8px', fontSize: '12px' },
      medium: { padding: '8px 16px', fontSize: '14px' },
      large: { padding: '12px 24px', fontSize: '16px' }
    };

    const variants = {
      primary: { backgroundColor: '#007bff', color: 'white' },
      secondary: { backgroundColor: '#6c757d', color: 'white' },
      danger: { backgroundColor: '#dc3545', color: 'white' },
      success: { backgroundColor: '#28a745', color: 'white' },
      warning: { backgroundColor: '#ffc107', color: '#212529' }
    };

    return {
      border: 'none',
      borderRadius: '4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: '500',
      opacity: disabled ? 0.6 : 1,
      ...sizes[size],
      ...variants[variant],
      ...style
    };
  };

  return (
    <ArchbaseProtectedComponent
      actionName={actionName}
      actionDescription={actionDescription}
      fallback={null}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={getButtonClasses()}
        style={getButtonStyle()}
      >
        {children}
      </button>
    </ArchbaseProtectedComponent>
  );
};

// Campo de formulário protegido
export interface ArchbaseSecureFormFieldProps {
  children: ReactNode;
  actionName?: string;
  actionDescription?: string;
  showLabel?: boolean;
  label?: string;
  fallbackText?: string;
  fallbackComponent?: ReactNode;
}

export const ArchbaseSecureFormField: React.FC<ArchbaseSecureFormFieldProps> = ({
  children,
  actionName,
  actionDescription,
  showLabel = true,
  label,
  fallbackText = "Campo não disponível",
  fallbackComponent
}) => {
  if (!actionName) {
    return <>{children}</>;
  }

  const defaultFallback = (
    <div className="archbase-secure-field-fallback" style={{ 
      padding: '8px', 
      color: '#666', 
      fontStyle: 'italic',
      backgroundColor: '#f8f9fa',
      border: '1px dashed #dee2e6',
      borderRadius: '4px'
    }}>
      {showLabel && label && <label style={{ fontWeight: 'bold' }}>{label}: </label>}
      {fallbackText}
    </div>
  );

  return (
    <ArchbaseProtectedComponent
      actionName={actionName}
      actionDescription={actionDescription}
      fallback={fallbackComponent || defaultFallback}
    >
      {children}
    </ArchbaseProtectedComponent>
  );
};

// HOC para proteção de componentes inteiros
export function withArchbaseSecurity<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  securityOptions: {
    resourceName: string;
    resourceDescription: string;
    requiredPermissions?: string[];
    fallbackComponent?: ReactNode;
  }
) {
  return function ArchbaseSecurityWrappedComponent(props: P) {
    const { resourceName, resourceDescription, requiredPermissions, fallbackComponent } = securityOptions;
    
    return (
      <ArchbaseViewSecurityProvider
        resourceName={resourceName}
        resourceDescription={resourceDescription}
        requiredPermissions={requiredPermissions}
        fallbackComponent={fallbackComponent}
      >
        <WrappedComponent {...props} />
      </ArchbaseViewSecurityProvider>
    );
  };
}
```

### 1.4 Tipos TypeScript (`types/ArchbaseSecurityTypes.ts`)

```typescript
import { ReactNode } from 'react';
import { ArchbaseSecurityManager } from '../ArchbaseSecurityManager';
import { UserDto } from '../SecurityDomain';

// Tipos base
export interface ArchbaseSecurityError {
  code: string;
  message: string;
  details?: any;
}

// Tipos para permissões
export type ArchbasePermissionAction = string;
export type ArchbasePermissionList = ArchbasePermissionAction[];

// Tipos para o contexto global
export interface ArchbaseGlobalSecurityState {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ArchbaseSecurityError | null;
}

// Tipos para configuração de segurança de view
export interface ArchbaseViewSecurityConfig {
  resourceName: string;
  resourceDescription: string;
  requiredPermissions?: ArchbasePermissionList;
  autoRegisterActions?: boolean;
  strictMode?: boolean; // Se true, bloqueia tudo que não tem permissão explícita
}

// Tipos para componentes protegidos
export interface ArchbaseProtectionConfig {
  actionName?: ArchbasePermissionAction;
  requiredPermissions?: ArchbasePermissionList;
  requireAll?: boolean;
  fallback?: ReactNode;
  autoRegister?: boolean;
}

// Tipos para callbacks
export type ArchbaseSecurityCallback = (manager: ArchbaseSecurityManager) => void;
export type ArchbaseErrorCallback = (error: string) => void;

// Tipos para resultados de verificação
export interface ArchbasePermissionCheckResult {
  hasAccess: boolean;
  missingPermissions?: ArchbasePermissionList;
  reason?: string;
}

// Enum para tipos de fallback
export enum ArchbaseFallbackType {
  HIDDEN = 'hidden',
  DISABLED = 'disabled',
  MESSAGE = 'message',
  CUSTOM = 'custom'
}

// Interface para configuração avançada
export interface ArchbaseAdvancedSecurityConfig extends ArchbaseViewSecurityConfig {
  fallbackType?: ArchbaseFallbackType;
  customFallback?: ReactNode;
  onAccessDenied?: (missingPermissions: ArchbasePermissionList) => void;
  onError?: ArchbaseErrorCallback;
  debugMode?: boolean;
}
```

---

## 🔧 2. Modificações no ArchbaseSecurityManager

### 2.1 Adicionar métodos públicos (`ArchbaseSecurityManager.tsx`)

Adicionar estes métodos à classe `ArchbaseSecurityManager`:

```typescript
// Adicionar na classe ArchbaseSecurityManager

/**
 * Retorna todas as permissões atuais
 */
public getPermissions(): string[] {
  return [...this.permissions];
}

/**
 * Retorna o status de carregamento
 */
public isLoading(): boolean {
  return !this.alreadyApplied;
}

/**
 * Verifica múltiplas permissões
 */
public hasAnyPermission(permissions: string[]): boolean {
  return permissions.some(permission => this.hasPermission(permission));
}

/**
 * Verifica se tem todas as permissões
 */
public hasAllPermissions(permissions: string[]): boolean {
  return permissions.every(permission => this.hasPermission(permission));
}

/**
 * Retorna informações detalhadas sobre uma permissão
 */
public getPermissionInfo(actionName: string): {
  hasPermission: boolean;
  isAdmin: boolean;
  reason: string;
} {
  const hasPermission = this.hasPermission(actionName);
  return {
    hasPermission,
    isAdmin: this.isAdmin,
    reason: hasPermission 
      ? (this.isAdmin ? 'Usuário é administrador' : 'Usuário tem permissão específica')
      : 'Usuário não tem permissão'
  };
}

/**
 * Registra múltiplas ações de uma vez
 */
public registerActions(actions: Array<{ actionName: string; actionDescription: string }>): void {
  actions.forEach(({ actionName, actionDescription }) => {
    this.registerAction(actionName, actionDescription);
  });
}

/**
 * Retorna todas as ações registradas
 */
public getRegisteredActions(): Array<{ actionName: string; actionDescription: string }> {
  return [...this.actions];
}
```

---

## 📦 3. Arquivo de Index (`index.ts`)

```typescript
// Exports principais
export { 
  ArchbaseSecurityProvider, 
  ArchbaseViewSecurityProvider 
} from './ArchbaseSecurityContext';

export { 
  useArchbaseSecurity, 
  useArchbaseViewSecurity, 
  useArchbaseSecureForm,
  useArchbasePermissionCheck 
} from './ArchbaseSecurityHooks';

export { 
  ArchbaseProtectedComponent,
  ArchbaseSecureActionButton,
  ArchbaseSecureFormField,
  withArchbaseSecurity
} from './ArchbaseSecurityComponents';

export type {
  ArchbaseSecurityContextType,
  ArchbaseViewSecurityContextType,
  ArchbaseSecurityProviderProps,
  ArchbaseViewSecurityProviderProps
} from './ArchbaseSecurityContext';

export type {
  UseArchbaseSecureFormReturn,
  ArchbaseProtectedComponentProps,
  ArchbaseSecureActionButtonProps,
  ArchbaseSecureFormFieldProps
} from './ArchbaseSecurityComponents';

export type * from './types/ArchbaseSecurityTypes';

// Re-exports existentes
export { ArchbaseSecurityManager } from './ArchbaseSecurityManager';
export { ArchbaseResourceService } from './ArchbaseResourceService';
export * from './SecurityDomain';
export * from './SecurityType';
```

---

## 🎨 4. Estilos CSS Opcionais (`styles/archbase-security.css`)

```css
/* Estilos base para componentes de segurança */
.archbase-security-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #6c757d;
  font-style: italic;
}

.archbase-security-error {
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 10px 0;
}

.archbase-security-no-user {
  padding: 20px;
  text-align: center;
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  border-radius: 4px;
}

.archbase-security-access-denied {
  padding: 20px;
  text-align: center;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.archbase-security-access-denied small {
  display: block;
  margin-top: 5px;
  font-size: 0.875em;
  opacity: 0.8;
}

/* Botões seguros */
.archbase-secure-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.archbase-secure-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.archbase-secure-btn:active:not(:disabled) {
  transform: translateY(0);
}

.archbase-secure-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Campos seguros */
.archbase-secure-field-fallback {
  display: block;
  width: 100%;
  margin: 5px 0;
}
```

---

## 🚀 5. Comandos para Claude Code

Execute estes comandos no terminal com Claude Code:

```bash
# 1. Criar estrutura de diretórios
mkdir -p src/security/components src/security/hooks src/security/types src/security/styles

# 2. Criar arquivos principais
touch src/security/ArchbaseSecurityContext.tsx
touch src/security/hooks/ArchbaseSecurityHooks.ts
touch src/security/components/ArchbaseSecurityComponents.tsx
touch src/security/types/ArchbaseSecurityTypes.ts
touch src/security/styles/archbase-security.css

# 3. Atualizar index principal
# (Claude Code vai modificar o arquivo src/index.ts)
```

### Prompts para Claude Code:

1. **Criar Context Principal:**
```
Crie o arquivo src/security/ArchbaseSecurityContext.tsx com o código do context principal e providers de segurança. Use o código fornecido no guia de implementação.
```

2. **Criar Hooks:**
```
Crie o arquivo src/security/hooks/ArchbaseSecurityHooks.ts com todos os hooks customizados para segurança. Use o código fornecido no guia.
```

3. **Criar Componentes:**
```
Crie o arquivo src/security/components/ArchbaseSecurityComponents.tsx com os componentes de proteção. Use o código fornecido no guia.
```

4. **Modificar ArchbaseSecurityManager:**
```
Modifique a classe ArchbaseSecurityManager adicionando os novos métodos públicos conforme especificado no guia de implementação.
```

5. **Atualizar exports:**
```
Atualize o arquivo src/index.ts para incluir todos os novos exports do sistema de segurança conforme listado no guia.
```

---

## 📋 6. Checklist de Implementação

### Fase 1 - Arquivos Base ✅
- [ ] Criar `ArchbaseSecurityContext.tsx`
- [ ] Criar `ArchbaseSecurityHooks.ts`
- [ ] Criar `ArchbaseSecurityComponents.tsx`
- [ ] Criar tipos TypeScript
- [ ] Criar estilos CSS

### Fase 2 - Modificações ✅
- [ ] Adicionar métodos ao `ArchbaseSecurityManager`
- [ ] Atualizar exports no `index.ts`
- [ ] Verificar dependências no `package.json`

### Fase 3 - Testes ✅
- [ ] Criar testes unitários
- [ ] Testar integração com componentes existentes
- [ ] Validar TypeScript

### Fase 4 - Documentação ✅
- [ ] Atualizar README
- [ ] Criar exemplos de uso
- [ ] Documentar breaking changes

---

## 🔍 7. Exemplos de Uso Após Implementação

### Uso Básico:
```tsx
// App principal
<ArchbaseSecurityProvider user={currentUser}>
  <MyApp />
</ArchbaseSecurityProvider>

// View protegida
<ArchbaseViewSecurityProvider 
  resourceName="user_management"
  resourceDescription="Gerenciamento de Usuários"
>
  <UserForm />
</ArchbaseViewSecurityProvider>

// Botão protegido
<ArchbaseSecureActionButton
  actionName="delete_user"
  actionDescription="Deletar usuário"
  variant="danger"
  onClick={handleDelete}
>
  Deletar
</ArchbaseSecureActionButton>
```

### Com Hooks:
```tsx
function MyComponent() {
  const { hasPermission } = useArchbaseViewSecurity();
  const { canCreate, canEdit } = useArchbaseSecureForm();
  
  return (
    <div>
      {hasPermission('view_data') && <DataTable />}
      {canCreate && <CreateButton />}
    </div>
  );
}
```

---

## 🚨 8. Considerações Importantes

1. **Compatibilidade**: O sistema mantém total compatibilidade com o código existente
2. **Performance**: Usa React Context otimizado para evitar re-renders desnecessários
3. **TypeScript**: Tipagem completa para melhor DX
4. **Extensibilidade**: Fácil de estender com novos componentes e funcionalidades
5. **Debug**: Suporte para modo debug para desenvolvimento

---

Este guia fornece tudo o que você precisa para implementar o novo sistema de segurança na biblioteca Archbase. Use Claude Code para executar as modificações seguindo a ordem sugerida.