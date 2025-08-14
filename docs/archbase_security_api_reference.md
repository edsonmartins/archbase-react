# API Reference - Sistema de Segurança Archbase React v3

## 📋 Índice

- [Core Components](#core-components)
- [Security Providers](#security-providers)
- [Hooks](#hooks)
- [Types & Interfaces](#types--interfaces)
- [DataGrid Security Props](#datagrid-security-props)
- [Template Security Props](#template-security-props)
- [UI Components](#ui-components)
- [Security Manager](#security-manager)

---

## 🔧 Core Components

### ArchbaseSecurityProvider

Provider principal que gerencia o contexto de segurança da aplicação.

```typescript
interface ArchbaseSecurityProviderProps {
  /** Nome do recurso/módulo */
  resourceName: string;
  
  /** Descrição do recurso */
  resourceDescription?: string;
  
  /** Manager de segurança customizado */
  manager?: ArchbaseSecurityManager;
  
  /** Configuração de segurança */
  config?: SecurityConfig;
  
  /** Auto-registrar ações */
  autoRegisterActions?: boolean;
  
  /** Componente fallback quando acesso negado */
  fallbackComponent?: React.ComponentType;
  
  /** Callback quando segurança está pronta */
  onSecurityReady?: (manager: ArchbaseSecurityManager) => void;
  
  /** Callback quando acesso é negado */
  onAccessDenied?: (resource: string) => void;
  
  /** Callback para verificação de permissão */
  onPermissionCheck?: (permission: string, granted: boolean) => void;
  
  /** Habilitar debug */
  debug?: boolean;
  
  /** Children */
  children: React.ReactNode;
}
```

**Uso:**
```typescript
<ArchbaseSecurityProvider 
  resourceName="user_management"
  resourceDescription="Sistema de Usuários"
  autoRegisterActions={true}
  debug={process.env.NODE_ENV === 'development'}
>
  <App />
</ArchbaseSecurityProvider>
```

### ArchbaseViewSecurityProvider

Provider para segurança específica de view/página.

```typescript
interface ArchbaseViewSecurityProviderProps {
  /** Nome da view */
  viewName: string;
  
  /** Permissões obrigatórias */
  requiredPermissions?: string[];
  
  /** Componente fallback */
  fallbackComponent?: React.ComponentType;
  
  /** Children */
  children: React.ReactNode;
}
```

---

## 🔐 Security Providers

### ArchbaseConditionalSecurityWrapper

Wrapper que aplica segurança condicionalmente.

```typescript
interface ArchbaseConditionalSecurityWrapperProps {
  /** Nome do recurso */
  resourceName?: string;
  
  /** Descrição do recurso */
  resourceDescription?: string;
  
  /** Permissões obrigatórias */
  requiredPermissions?: string[];
  
  /** Componente fallback */
  fallbackComponent?: React.ComponentType;
  
  /** Callback quando segurança está pronta */
  onSecurityReady?: (manager: ArchbaseSecurityManager) => void;
  
  /** Callback quando acesso é negado */
  onAccessDenied?: (resource: string) => void;
  
  /** Children */
  children: React.ReactNode;
}
```

### ArchbaseProtectedComponent

Componente para proteção condicional baseada em permissões.

```typescript
interface ArchbaseProtectedComponentProps {
  /** Permissão obrigatória */
  permission: string;
  
  /** Componente fallback */
  fallback?: React.ReactNode;
  
  /** Children */
  children: React.ReactNode;
}
```

**Uso:**
```typescript
<ArchbaseProtectedComponent 
  permission="view_sensitive_data"
  fallback={<div>Acesso negado</div>}
>
  <SensitiveDataComponent />
</ArchbaseProtectedComponent>
```

---

## 🪝 Hooks

### useArchbaseSecurity

Hook principal para acessar funcionalidades de segurança.

```typescript
interface ArchbaseSecurityContextType {
  /** Se segurança está disponível */
  isAvailable: boolean;
  
  /** Verificar permissão */
  hasPermission: (permission: string) => boolean;
  
  /** Registrar ação */
  registerAction: (action: string, description?: string) => void;
  
  /** Manager de segurança */
  manager?: ArchbaseSecurityManager;
  
  /** Nome do recurso */
  resourceName?: string;
  
  /** Descrição do recurso */
  resourceDescription?: string;
}

function useArchbaseSecurity(): ArchbaseSecurityContextType;
```

**Uso:**
```typescript
const security = useArchbaseSecurity();

if (security.isAvailable && security.hasPermission('edit_user')) {
  // Mostrar botão de edição
}
```

### useArchbaseViewSecurity

Hook para segurança específica de view.

```typescript
interface ArchbaseViewSecurityContextType {
  /** Se view tem acesso */
  hasAccess: boolean;
  
  /** Permissões da view */
  permissions: string[];
  
  /** Verificar permissão específica */
  hasPermission: (permission: string) => boolean;
}

function useArchbaseViewSecurity(): ArchbaseViewSecurityContextType;
```

### useArchbasePermissionCheck

Hook para verificação simples de permissão.

```typescript
function useArchbasePermissionCheck(permission: string): boolean;
```

**Uso:**
```typescript
const canEdit = useArchbasePermissionCheck('edit_user');
const canDelete = useArchbasePermissionCheck('delete_user');

return (
  <div>
    {canEdit && <EditButton />}
    {canDelete && <DeleteButton />}
  </div>
);
```

### useArchbaseSecureForm

Hook para formulários seguros.

```typescript
interface UseArchbaseSecureFormProps {
  /** Nome do recurso */
  resourceName: string;
  
  /** Permissões obrigatórias */
  requiredPermissions?: string[];
}

interface UseArchbaseSecureFormReturn {
  /** Verificar permissão */
  hasPermission: (permission: string) => boolean;
  
  /** Registrar ação do formulário */
  registerFormAction: (action: string, description?: string) => void;
  
  /** Se pode submeter */
  canSubmit: boolean;
  
  /** Erros de segurança */
  securityErrors: string[];
}

function useArchbaseSecureForm(props: UseArchbaseSecureFormProps): UseArchbaseSecureFormReturn;
```

---

## 📝 Types & Interfaces

### SecurityConfig

```typescript
interface SecurityConfig {
  /** URL da API */
  apiUrl?: string;
  
  /** Armazenamento do token */
  tokenStorage?: 'localStorage' | 'sessionStorage' | 'memory';
  
  /** Auto-refresh do token */
  autoRefresh?: boolean;
  
  /** Intervalo de refresh (ms) */
  refreshInterval?: number;
  
  /** Cache de permissões */
  cachePermissions?: boolean;
  
  /** Timeout do cache (ms) */
  cacheTimeout?: number;
  
  /** Agrupar verificações */
  batchPermissionChecks?: boolean;
  
  /** Tempo de debounce (ms) */
  debounceTime?: number;
}
```

### ArchbaseTemplateSecurityProps

```typescript
interface ArchbaseTemplateSecurityProps {
  /** Nome do recurso */
  resourceName?: string;
  
  /** Descrição do recurso */
  resourceDescription?: string;
  
  /** Permissões obrigatórias */
  requiredPermissions?: string[];
  
  /** Componente fallback */
  fallbackComponent?: React.ComponentType;
  
  /** Opções de segurança */
  securityOptions?: {
    /** Auto-registrar ações */
    autoRegisterActions?: boolean;
    
    /** Callback quando segurança está pronta */
    onSecurityReady?: (manager: ArchbaseSecurityManager) => void;
    
    /** Callback quando acesso é negado */
    onAccessDenied?: (resource: string) => void;
  };
}
```

### Security DTOs

```typescript
interface UserDto {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  active: boolean;
  password?: string;
  profiles?: ProfileDto[];
  groups?: GroupDto[];
}

interface GroupDto {
  id: string;
  name: string;
  description: string;
  users?: UserDto[];
  permissions?: string[];
}

interface ProfileDto {
  id: string;
  name: string;
  description: string;
  permissions?: string[];
}

interface ApiTokenDto {
  id: string;
  name: string;
  description: string;
  token: string;
  expirationDate?: Date;
  user?: UserDto;
  active: boolean;
}
```

---

## 📊 DataGrid Security Props

### ArchbaseDataGridProps (Security Extensions)

```typescript
interface ArchbaseDataGridSecurityProps {
  /** Nome do recurso */
  resourceName?: string;
  
  /** Descrição do recurso */
  resourceDescription?: string;
  
  /** Configurações de segurança das colunas */
  columnSecurityOptions?: {
    /** Fallback padrão para colunas sem permissão */
    defaultFallback?: React.ReactNode | string;
    
    /** Se true, oculta colunas sem permissão por padrão */
    hideByDefault?: boolean;
    
    /** Prefixo para auto-registro de permissões de coluna */
    permissionPrefix?: string;
    
    /** Auto-registrar permissões */
    autoRegisterPermissions?: boolean;
  };
}
```

### ArchbaseDataGridColumnProps (Security Extensions)

```typescript
interface ArchbaseDataGridColumnSecurityProps {
  /** Nome da permissão para visualizar esta coluna */
  viewPermission?: string;
  
  /** Nome da permissão para editar esta coluna */
  editPermission?: string;
  
  /** Componente/texto a ser exibido quando não tem permissão */
  fallbackContent?: React.ReactNode | string;
  
  /** Se true, oculta coluna completamente sem permissão */
  hideWhenNoPermission?: boolean;
  
  /** Auto-registra a permissão da coluna */
  autoRegisterPermission?: boolean;
}
```

**Uso:**
```typescript
<ArchbaseDataGrid 
  dataSource={dataSource}
  resourceName="user_data"
  columnSecurityOptions={{
    defaultFallback: "🔒 Restrito",
    permissionPrefix: "user_",
    hideByDefault: false
  }}
>
  <Columns>
    <ArchbaseDataGridColumn 
      dataField="email"
      header="Email"
      viewPermission="view_email"
      fallbackContent="***@***.***"
      hideWhenNoPermission={false}
    />
  </Columns>
</ArchbaseDataGrid>
```

---

## 📋 Template Security Props

### ArchbaseGridTemplateProps (Security Extensions)

```typescript
interface ArchbaseGridTemplateSecurityProps extends ArchbaseTemplateSecurityProps {
  // Herda todas as props de ArchbaseTemplateSecurityProps
}
```

### ArchbaseFormTemplateProps (Security Extensions)

```typescript
interface ArchbaseFormTemplateSecurityProps extends ArchbaseTemplateSecurityProps {
  // Herda todas as props de ArchbaseTemplateSecurityProps
}
```

**Uso:**
```typescript
<ArchbaseGridTemplate
  title="Usuários"
  dataSource={userDataSource}
  
  // Security props
  resourceName="user_management"
  resourceDescription="Gerenciamento de Usuários"
  requiredPermissions={['view_users']}
  fallbackComponent={NoAccessComponent}
  securityOptions={{
    autoRegisterActions: true,
    onSecurityReady: (manager) => console.log('Ready'),
    onAccessDenied: (resource) => showError(resource)
  }}
  
  columns={columns}
/>
```

---

## 🎭 UI Components

### UserModal

```typescript
interface UserModalProps {
  /** DataSource do usuário */
  dataSource: ArchbaseDataSource<UserDto, string>;
  
  /** Se modal está aberto */
  opened: boolean;
  
  /** Callback ao clicar OK */
  onClickOk: (record?: UserDto, result?: any) => void;
  
  /** Callback ao cancelar */
  onClickCancel: (record?: UserDto) => void;
  
  /** Callback para save customizado */
  onCustomSave?: (record?: UserDto, callback?: (success: boolean) => void) => void;
  
  /** Callback após salvar */
  onAfterSave?: (record?: UserDto) => void;
  
  /** Conteúdo customizado antes */
  customContentBefore?: React.ReactNode;
  
  /** Conteúdo customizado depois */
  customContentAfter?: React.ReactNode;
  
  /** Opções do modal */
  options?: UserModalOptions;
}

interface UserModalOptions {
  /** Mostrar campo nickname */
  showNickname?: boolean;
  
  /** Mostrar campo ativo */
  showActive?: boolean;
  
  /** Mostrar senha */
  showPassword?: boolean;
  
  /** Mostrar perfis */
  showProfiles?: boolean;
  
  /** Mostrar grupos */
  showGroups?: boolean;
  
  /** Conteúdo customizado antes */
  customContentBefore?: React.ReactNode;
  
  /** Conteúdo customizado depois */
  customContentAfter?: React.ReactNode;
}
```

### GroupModal

```typescript
interface GroupModalProps {
  /** DataSource do grupo */
  dataSource: ArchbaseDataSource<GroupDto, string>;
  
  /** Se modal está aberto */
  opened: boolean;
  
  /** Callback ao clicar OK */
  onClickOk: (record?: GroupDto, result?: any) => void;
  
  /** Callback ao cancelar */
  onClickCancel: (record?: GroupDto) => void;
  
  /** Callback para save customizado */
  onCustomSave?: (record?: GroupDto, callback?: (success: boolean) => void) => void;
  
  /** Callback após salvar */
  onAfterSave?: (record?: GroupDto) => void;
  
  /** Opções do modal */
  options?: GroupModalOptions;
}
```

### ProfileModal

```typescript
interface ProfileModalProps {
  /** DataSource do perfil */
  dataSource: ArchbaseDataSource<ProfileDto, string>;
  
  /** Se modal está aberto */
  opened: boolean;
  
  /** Callback ao clicar OK */
  onClickOk: (record?: ProfileDto, result?: any) => void;
  
  /** Callback ao cancelar */
  onClickCancel: (record?: ProfileDto) => void;
  
  /** Callback para save customizado */
  onCustomSave?: (record?: ProfileDto, callback?: (success: boolean) => void) => void;
  
  /** Callback após salvar */
  onAfterSave?: (record?: ProfileDto) => void;
  
  /** Opções do modal */
  options?: ProfileModalOptions;
}
```

### ArchbaseSecurityView

```typescript
interface ArchbaseSecurityViewProps {
  /** Altura da view */
  height?: number | string;
  
  /** Aba padrão */
  defaultTab?: 'users' | 'groups' | 'profiles' | 'tokens';
  
  /** Opções do modal de usuário */
  userModalOptions?: UserModalOptions;
  
  /** Opções do modal de grupo */
  groupModalOptions?: GroupModalOptions;
  
  /** Opções do modal de perfil */
  profileModalOptions?: ProfileModalOptions;
  
  /** Callback ao criar usuário */
  onUserCreated?: (user: UserDto) => void;
  
  /** Callback ao atualizar usuário */
  onUserUpdated?: (user: UserDto) => void;
  
  /** Callback ao deletar usuário */
  onUserDeleted?: (userId: string) => void;
  
  /** Callback ao criar grupo */
  onGroupCreated?: (group: GroupDto) => void;
  
  /** Callback ao atualizar grupo */
  onGroupUpdated?: (group: GroupDto) => void;
  
  /** Callback ao deletar grupo */
  onGroupDeleted?: (groupId: string) => void;
}
```

---

## 🔧 Security Manager

### ArchbaseSecurityManager

Classe base para implementação de managers de segurança.

```typescript
abstract class ArchbaseSecurityManager {
  /** Verificar se tem permissão */
  abstract hasPermission(permission: string): Promise<boolean>;
  
  /** Registrar ação */
  abstract registerAction(action: string, description?: string): Promise<void>;
  
  /** Obter permissões do usuário */
  abstract getUserPermissions(): Promise<string[]>;
  
  /** Inicializar manager */
  initialize?(): Promise<void>;
  
  /** Finalizar manager */
  destroy?(): Promise<void>;
}
```

### Implementação Customizada

```typescript
class MySecurityManager extends ArchbaseSecurityManager {
  private permissions: Set<string> = new Set();
  
  async hasPermission(permission: string): Promise<boolean> {
    // Implementar lógica de verificação
    try {
      const response = await fetch(`/api/permissions/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permission })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false; // Falha segura
    }
  }
  
  async registerAction(action: string, description?: string): Promise<void> {
    // Implementar registro de ação
    console.log(`Registering action: ${action} - ${description}`);
    
    try {
      await fetch('/api/actions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, description })
      });
    } catch (error) {
      console.error('Erro ao registrar ação:', error);
    }
  }
  
  async getUserPermissions(): Promise<string[]> {
    try {
      const response = await fetch('/api/user/permissions');
      const permissions = await response.json();
      return permissions;
    } catch (error) {
      console.error('Erro ao obter permissões:', error);
      return [];
    }
  }
  
  async initialize(): Promise<void> {
    // Carregar permissões iniciais
    const userPermissions = await this.getUserPermissions();
    this.permissions = new Set(userPermissions);
  }
}
```

---

## 🔍 Utility Functions

### withArchbaseSecurity

HOC para adicionar segurança a componentes.

```typescript
interface WithSecurityOptions {
  /** Permissões obrigatórias */
  requiredPermissions?: string[];
  
  /** Componente fallback */
  fallbackComponent?: React.ComponentType;
  
  /** Nome do recurso */
  resourceName?: string;
}

function withArchbaseSecurity<T extends object>(
  Component: React.ComponentType<T>,
  options: WithSecurityOptions
): React.ComponentType<T>;
```

**Uso:**
```typescript
const SecureComponent = withArchbaseSecurity(MyComponent, {
  requiredPermissions: ['view_data'],
  fallbackComponent: NoAccessComponent,
  resourceName: 'secure_module'
});
```

### ArchbaseSecureActionButton

Botão que verifica permissões automaticamente.

```typescript
interface ArchbaseSecureActionButtonProps {
  /** Nome da ação */
  actionName: string;
  
  /** Descrição da ação */
  actionDescription?: string;
  
  /** Permissão obrigatória */
  permission?: string;
  
  /** Callback ao clicar */
  onClick?: () => void;
  
  /** Props do botão */
  [key: string]: any;
}
```

**Uso:**
```typescript
<ArchbaseSecureActionButton
  actionName="delete_user"
  actionDescription="Excluir usuário"
  permission="delete_users"
  onClick={handleDelete}
  color="red"
>
  Excluir
</ArchbaseSecureActionButton>
```

---

## 📚 Constantes e Enums

### SecurityType

```typescript
enum SecurityType {
  USER = 'USER',
  GROUP = 'GROUP',
  PROFILE = 'PROFILE',
  RESOURCE = 'RESOURCE',
  ACTION = 'ACTION',
  PERMISSION = 'PERMISSION'
}
```

### Permissões Padrão

```typescript
const DEFAULT_PERMISSIONS = {
  // CRUD básico
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  
  // Ações específicas
  VIEW: 'view',
  EDIT: 'edit',
  REMOVE: 'remove',
  ADD: 'add',
  
  // Administração
  ADMIN: 'admin',
  MANAGE: 'manage',
  CONFIGURE: 'configure'
} as const;
```

---

Esta documentação da API fornece uma referência completa para todas as interfaces, tipos e componentes do sistema de segurança do Archbase React v3. Use como guia de implementação e referência durante o desenvolvimento.