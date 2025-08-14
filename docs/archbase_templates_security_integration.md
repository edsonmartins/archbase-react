# Integração de Segurança - Templates Archbase

## 📋 Análise dos Templates Existentes

### Templates Identificados:
1. **ArchbaseFormModalTemplate** - Modal com formulário e botões de ação
2. **ArchbaseFormTemplate** - Formulário padrão com controles
3. **ArchbaseGridTemplate** - Grid/tabela com ações CRUD
4. **ArchbaseMasonryTemplate** - Layout em mosaico com ações
5. **ArchbaseModalTemplate** - Modal simples com botões
6. **ArchbasePanelTemplate** - Painel com filtros e ações
7. **ArchbaseSpaceTemplate** - Template base para layout

## 🎯 Estratégia de Integração (100% Opcional)

### Princípios Fundamentais:
- 🔹 **Zero Breaking Changes** - Todo código existente funciona exatamente igual
- 🔹 **Opt-in Completo** - Segurança só ativa quando explicitamente configurada
- 🔹 **Graceful Degradation** - Se não há contexto de segurança, funciona normalmente
- 🔹 **Performance** - Zero overhead quando segurança não é usada
- 🔹 **Developer Choice** - Dev decide se/quando/onde usar segurança

### Padrões Identificados nos Templates:
- ✅ Uso consistente de `userActions` para controlar botões
- ✅ Props `variant` para personalização
- ✅ Tratamento de erro padrão com `isError`, `error`, `clearError`
- ✅ DataSource já integrado na maioria dos templates
- ✅ Estrutura de botões consistente (Ok, Cancel, Save, etc.)

### Pontos de Integração OPCIONAIS:
1. **Props de Segurança Opcionais** - Só funciona se definidas
2. **Botões Inteligentes** - Usam segurança SE disponível
3. **Context Opcional** - Funciona com ou sem ArchbaseSecurityProvider
4. **UserActions Compatíveis** - Mantém funcionamento original
5. **Fallback Automático** - Se não tem segurança, comportamento normal

---

## 🚀 1. Props de Segurança OPCIONAIS

### Interface Base (Completamente Opcional):
```typescript
export interface ArchbaseTemplateSecurityProps {
  /** Nome do recurso - SE definido, ativa segurança */
  resourceName?: string;
  /** Descrição do recurso - opcional */
  resourceDescription?: string;
  /** Permissões obrigatórias - só válido SE resourceName definido */
  requiredPermissions?: string[];
  /** Fallback para acesso negado - só usado SE segurança ativa */
  fallbackComponent?: ReactNode;
  /** Configurações avançadas - só funciona SE segurança ativa */
  securityOptions?: {
    autoRegisterActions?: boolean;
    strictMode?: boolean;
    onSecurityReady?: (manager: ArchbaseSecurityManager) => void;
    onAccessDenied?: () => void;
  };
}

// IMPORTANTE: Se resourceName não for fornecido, 
// template funciona EXATAMENTE como antes!
```

### Hook Inteligente (Detecta Contexto):
```typescript
// Hook que funciona COM ou SEM contexto de segurança
export const useOptionalSecurity = () => {
  const [hasSecurityContext, setHasSecurityContext] = useState(false);
  const [securityFunctions, setSecurityFunctions] = useState({
    hasPermission: () => true, // Default: sempre permitir
    registerAction: () => {}, // Default: no-op
  });

  useEffect(() => {
    try {
      // Tenta usar contexto de segurança
      const security = useArchbaseViewSecurity();
      setHasSecurityContext(true);
      setSecurityFunctions(security);
    } catch (error) {
      // Se não há contexto, usa comportamento padrão
      setHasSecurityContext(false);
      setSecurityFunctions({
        hasPermission: () => true,
        registerAction: () => {},
      });
    }
  }, []);

  return {
    hasSecurityContext,
    hasPermission: securityFunctions.hasPermission,
    registerAction: securityFunctions.registerAction,
    canCreate: securityFunctions.hasPermission('create'),
    canEdit: securityFunctions.hasPermission('edit'),
    canDelete: securityFunctions.hasPermission('delete'),
    canView: securityFunctions.hasPermission('view'),
  };
};
```

---

## 🔧 2. Modificações Específicas por Template

### 2.1 ArchbaseFormModalTemplate (Exemplo de Integração Não-Invasiva)

**Comportamento:**
- ✅ **SEM resourceName**: Funciona exatamente como hoje
- ✅ **COM resourceName**: Ativa proteção de segurança
- ✅ **SEM ArchbaseSecurityProvider**: Funciona normalmente (ignora segurança)

**Integração de Segurança:**
```typescript
// Props OPCIONAIS adicionais (não quebra nada existente)
export interface ArchbaseFormModalTemplateProps<T, ID> 
  extends ArchbaseTemplateSecurityProps {
  // ... TODAS as props existentes permanecem iguais
  // NADA é removido ou alterado
}

// Implementação inteligente
export function ArchbaseFormModalTemplate<T, ID>({
  // ... TODAS props existentes
  resourceName, // NOVA - opcional
  resourceDescription, // NOVA - opcional  
  requiredPermissions, // NOVA - opcional
  securityOptions, // NOVA - opcional
  ...rest
}: ArchbaseFormModalTemplateProps<T, ID>) {
  
  // Hook que funciona COM ou SEM contexto de segurança
  const security = useOptionalSecurity();
  
  // Se resourceName não definido, não usa segurança
  const usesSecurity = !!resourceName;
  
  // Auto-registra ações SE segurança ativa E SE configurado
  useEffect(() => {
    if (usesSecurity && securityOptions?.autoRegisterActions && security.hasSecurityContext) {
      security.registerAction('save', resourceDescription ? `Salvar ${resourceDescription}` : 'Salvar');
      security.registerAction('cancel', 'Cancelar operação');
    }
  }, [usesSecurity, resourceDescription, securityOptions]);

  // Função para renderizar botão - inteligente
  const renderActionButton = (actionName: string, originalButton: ReactNode) => {
    // Se não usa segurança, renderiza botão original
    if (!usesSecurity || !security.hasSecurityContext) {
      return originalButton;
    }
    
    // Se usa segurança, renderiza botão protegido
    return (
      <ArchbaseSecureActionButton
        actionName={actionName}
        actionDescription={`${actionName} ${resourceDescription || 'registro'}`}
        // ... outras props do botão original
      >
        {/* conteúdo do botão original */}
      </ArchbaseSecureActionButton>
    );
  };

  // Componente principal (funciona com ou sem segurança)
  const TemplateContent = () => {
    // ... TODA lógica existente permanece igual

    return (
      <Modal {...modalProps}>
        {/* ... conteúdo existente inalterado */}
        
        {/* Botões - renderização inteligente */}
        {dataSource && !dataSource.isBrowsing() ? (
          <Group gap="md">
            {renderActionButton('save', 
              <Button
                leftSection={<IconCheck />}
                onClick={handleSave}
                disabled={dataSource?.isBrowsing()}
                color="green"
              >
                Ok
              </Button>
            )}
            
            {renderActionButton('cancel',
              <Button
                leftSection={<IconX />}
                onClick={handleCancel}
                color="red"
              >
                Cancel
              </Button>
            )}
          </Group>
        ) : (
          // ... botão close existente - INALTERADO
        )}
      </Modal>
    );
  };

  // Wrapper condicional - só envolve SE usar segurança
  if (!usesSecurity || !security.hasSecurityContext) {
    return <TemplateContent />;
  }

  return (
    <ArchbaseViewSecurityProvider
      resourceName={resourceName!}
      resourceDescription={resourceDescription || resourceName!}
      requiredPermissions={requiredPermissions}
      onSecurityReady={securityOptions?.onSecurityReady}
    >
      <TemplateContent />
    </ArchbaseViewSecurityProvider>
  );
}

// ✅ RESULTADO: 
// - Código existente: ZERO mudanças necessárias
// - Novo código: Pode usar segurança opcionalmente
```

### 2.2 ArchbaseGridTemplate

**Principais Ações:**
- Add, Edit, Remove, View na toolbar
- Ações por linha (customizáveis)
- Export/Print

**Integração de Segurança:**
```typescript
// Modificar UserActionsOptions
export interface UserActionsOptions {
  visible: boolean;
  // ... props existentes
  /** Configuração de segurança para cada ação */
  actionPermissions?: {
    add?: string;
    edit?: string;
    remove?: string;
    view?: string;
    export?: string;
    print?: string;
  };
}

// Implementação na função buildUserActions
const buildSecureUserActions = () => {
  const actions = [];
  
  if (userActions?.onAddExecute) {
    actions.push(
      <ArchbaseSecureActionButton
        key="add"
        actionName={userActions.actionPermissions?.add || 'create'}
        actionDescription="Criar novo registro"
        color="green"
        leftSection={<IconPlus />}
        onClick={userActions.onAddExecute}
      >
        {userActions.labelAdd || t('New')}
      </ArchbaseSecureActionButton>
    );
  }
  
  // Similar para edit, remove, view...
  return actions;
};
```

### 2.3 ArchbaseMasonryTemplate & ArchbasePanelTemplate

**Características:**
- Similar ao GridTemplate mas com layout diferente
- Mesma estrutura de `userActions`

**Integração:**
```typescript
// Modificar o useMemo que constrói userActionsBuilded
const userActionsBuilded: ArchbaseAction[] = useMemo(() => {
  const { hasPermission } = useArchbaseViewSecurity();
  
  const defaultActions: ArchbaseAction[] = [];
  
  if (userActionsEnd.allowAdd && hasPermission('create')) {
    defaultActions.push({
      id: 'actAdd',
      icon: <IconPlus />,
      color: 'green',
      label: userActionsEnd.labelAdd || t('New'),
      executeAction: userActionsEnd.onAddExecute,
      enabled: true,
    });
  }
  
  // Similar para outras ações...
  return defaultActions;
}, [userActions, dataSource, hasPermission]);
```

---

## 🔨 3. Implementação Prática

### 3.1 Hook Completamente Opcional

```typescript
// hooks/useOptionalTemplateSecurity.ts
export const useOptionalTemplateSecurity = (config?: {
  resourceName?: string;
  resourceDescription?: string;
  autoRegisterActions?: boolean;
}) => {
  const [securityState, setSecurityState] = useState({
    isAvailable: false,
    hasPermission: () => true, // Default: sempre permite
    registerAction: () => {}, // Default: no-op
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
  });

  useEffect(() => {
    // Só tenta usar segurança SE resourceName foi fornecido
    if (!config?.resourceName) {
      return; // Mantém estado padrão (tudo permitido)
    }

    try {
      // Tenta acessar contexto de segurança
      const security = useArchbaseViewSecurity();
      
      // Se chegou aqui, contexto existe
      setSecurityState({
        isAvailable: true,
        hasPermission: security.hasPermission,
        registerAction: security.registerAction,
        canCreate: security.hasPermission('create'),
        canEdit: security.hasPermission('edit'),
        canDelete: security.hasPermission('delete'),
        canView: security.hasPermission('view'),
      });

      // Auto-registra ações se solicitado
      if (config.autoRegisterActions) {
        security.registerAction('create', `Criar ${config.resourceDescription || config.resourceName}`);
        security.registerAction('edit', `Editar ${config.resourceDescription || config.resourceName}`);
        security.registerAction('delete', `Deletar ${config.resourceDescription || config.resourceName}`);
        security.registerAction('view', `Visualizar ${config.resourceDescription || config.resourceName}`);
      }

    } catch (error) {
      // Se deu erro, significa que não há contexto de segurança
      // Mantém comportamento padrão (tudo permitido)
      console.debug('Contexto de segurança não encontrado, usando comportamento padrão');
    }
  }, [config?.resourceName, config?.resourceDescription, config?.autoRegisterActions]);

  return securityState;
};
```

### 3.2 Componente de Botão Inteligente

```typescript
// components/ArchbaseSmartActionButton.tsx
interface ArchbaseSmartActionButtonProps extends ButtonProps {
  actionName?: string; // Se não fornecido, sempre renderiza
  actionDescription?: string;
  children: ReactNode;
  fallback?: ReactNode; // Se não tem permissão
}

export const ArchbaseSmartActionButton: React.FC<ArchbaseSmartActionButtonProps> = ({
  actionName,
  actionDescription,
  children,
  fallback = null,
  ...buttonProps
}) => {
  const security = useOptionalTemplateSecurity();
  
  // Se não especificou ação OU não tem contexto de segurança, renderiza normalmente
  if (!actionName || !security.isAvailable) {
    return <Button {...buttonProps}>{children}</Button>;
  }
  
  // Se tem contexto de segurança, verifica permissão
  if (!security.hasPermission(actionName)) {
    return <>{fallback}</>;
  }
  
  return (
    <Button {...buttonProps}>
      {children}
    </Button>
  );
};
```

### 3.3 Wrapper Condicional Ultra-Leve

```typescript
// components/ArchbaseConditionalSecurityWrapper.tsx
interface ConditionalSecurityWrapperProps {
  children: ReactNode;
  resourceName?: string; // Se não fornecido, não envolve
  resourceDescription?: string;
  requiredPermissions?: string[];
  fallbackComponent?: ReactNode;
}

export const ArchbaseConditionalSecurityWrapper: React.FC<ConditionalSecurityWrapperProps> = ({
  children,
  resourceName,
  resourceDescription,
  requiredPermissions,
  fallbackComponent
}) => {
  // Se não tem resourceName, não envolve - renderiza direto
  if (!resourceName) {
    return <>{children}</>;
  }

  // Verifica se contexto de segurança existe
  const hasSecurityProvider = useContext(ArchbaseSecurityContext) !== null;
  
  // Se não tem provider de segurança, renderiza direto (ignora segurança)
  if (!hasSecurityProvider) {
    console.debug(`Template solicitou segurança para '${resourceName}', mas ArchbaseSecurityProvider não encontrado. Renderizando sem segurança.`);
    return <>{children}</>;
  }

  // Só se tem resourceName E provider, aplica segurança
  return (
    <ArchbaseViewSecurityProvider
      resourceName={resourceName}
      resourceDescription={resourceDescription || resourceName}
      requiredPermissions={requiredPermissions}
      fallbackComponent={fallbackComponent}
    >
      {children}
    </ArchbaseViewSecurityProvider>
  );
};
```

---

## 📝 4. Modificações Detalhadas por Arquivo

### 4.1 ArchbaseFormModalTemplate.tsx

**Alterações:**
```typescript
// 1. Adicionar imports
import { 
  ArchbaseSecureActionButton, 
  useArchbaseTemplateSecurity,
  ArchbaseSecureTemplateWrapper 
} from '@archbase/security';

// 2. Estender interface
export interface ArchbaseFormModalTemplateProps<T, ID> 
  extends ArchbaseTemplateSecurityProps {
  // ... props existentes
}

// 3. Modificar componente
export function ArchbaseFormModalTemplate<T, ID>({
  // ... props existentes
  resourceName,
  resourceDescription,
  requiredPermissions,
  securityOptions,
  ...rest
}: ArchbaseFormModalTemplateProps<T, ID>) {
  
  const TemplateContent = () => {
    const { canEdit, hasPermission } = useArchbaseTemplateSecurity({
      resourceName,
      resourceDescription,
      autoRegisterActions: securityOptions?.autoRegisterActions
    });

    // ... lógica existente

    return (
      <Modal {...modalProps}>
        {/* ... conteúdo existente */}
        
        {/* Botões protegidos */}
        {dataSource && !dataSource.isBrowsing() ? (
          <Group gap="md">
            <ArchbaseSecureActionButton
              actionName="save"
              actionDescription={`Salvar ${resourceDescription || 'registro'}`}
              leftSection={<IconCheck />}
              onClick={handleSave}
              disabled={dataSource?.isBrowsing()}
              color="green"
            >
              Ok
            </ArchbaseSecureActionButton>
            
            <ArchbaseSecureActionButton
              actionName="cancel"
              actionDescription="Cancelar operação"
              leftSection={<IconX />}
              onClick={handleCancel}
              color="red"
            >
              Cancel
            </ArchbaseSecureActionButton>
          </Group>
        ) : (
          // ... botão close existente
        )}
      </Modal>
    );
  };

  return (
    <ArchbaseSecureTemplateWrapper
      resourceName={resourceName}
      resourceDescription={resourceDescription}
      requiredPermissions={requiredPermissions}
      securityOptions={securityOptions}
    >
      <TemplateContent />
    </ArchbaseSecureTemplateWrapper>
  );
}
```

### 4.2 ArchbaseGridTemplate.tsx

**Alterações:**
```typescript
// 1. Modificar UserActionsOptions
export interface UserActionsOptions {
  // ... props existentes
  actionPermissions?: {
    add?: string;
    edit?: string;
    remove?: string;
    view?: string;
    export?: string;
    print?: string;
  };
}

// 2. Modificar função principal
const TemplateContent = () => {
  const { hasPermission } = useArchbaseTemplateSecurity({
    resourceName: 'grid_' + title?.toLowerCase().replace(/\s+/g, '_'),
    resourceDescription: title,
    autoRegisterActions: true
  });

  // Modificar a seção de botões
  const buildSecureToolbarActions = () => {
    if (!userActions?.visible) return null;

    return (
      <GridToolBarActions>
        <div className="no-print">
          <Flex gap="8px" rowGap="8px">
            {userActions.onAddExecute && (
              <ArchbaseSecureActionButton
                actionName={userActions.actionPermissions?.add || 'create'}
                actionDescription="Criar novo registro"
                color="green"
                leftSection={<IconPlus />}
                onClick={userActions.onAddExecute}
              >
                {userActions.labelAdd || t('New')}
              </ArchbaseSecureActionButton>
            )}
            
            {/* Similar para edit, remove, view */}
          </Flex>
        </div>
      </GridToolBarActions>
    );
  };
  
  // ... resto do componente
};
```

---

## 🎨 5. Componentes de Apoio

### 5.1 Secure Field Wrapper para Forms

```typescript
// Para proteger campos específicos em formulários
export const ArchbaseSecureField: React.FC<{
  children: ReactNode;
  fieldName: string;
  actionName?: string;
  fallback?: ReactNode;
}> = ({ children, fieldName, actionName, fallback }) => {
  const permission = actionName || `edit_${fieldName}`;
  
  return (
    <ArchbaseProtectedComponent
      actionName={permission}
      actionDescription={`Editar campo ${fieldName}`}
      fallback={fallback || <div style={{opacity: 0.5}}>{children}</div>}
    >
      {children}
    </ArchbaseProtectedComponent>
  );
};
```

### 5.2 Secure Action Menu para Templates

```typescript
// Para menus de ação contextuais
export const ArchbaseSecureActionMenu: React.FC<{
  actions: Array<{
    key: string;
    label: string;
    icon?: ReactNode;
    permission: string;
    onClick: () => void;
  }>;
}> = ({ actions }) => {
  const { hasPermission } = useArchbaseViewSecurity();
  
  const availableActions = actions.filter(action => 
    hasPermission(action.permission)
  );
  
  if (availableActions.length === 0) return null;
  
  return (
    <Menu>
      <Menu.Target>
        <Button>Ações</Button>
      </Menu.Target>
      <Menu.Dropdown>
        {availableActions.map(action => (
          <Menu.Item
            key={action.key}
            leftSection={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
```

---

## 🔄 6. Migração Gradual

### Fase 1: Componentes Base
- [ ] Criar hooks e wrappers de segurança
- [ ] Implementar ArchbaseSecureTemplateWrapper
- [ ] Testar integração básica

### Fase 2: Templates Core
- [ ] ArchbaseFormTemplate
- [ ] ArchbaseFormModalTemplate  
- [ ] ArchbaseModalTemplate

### Fase 3: Templates Avançados
- [ ] ArchbaseGridTemplate
- [ ] ArchbaseMasonryTemplate
- [ ] ArchbasePanelTemplate

### Fase 4: Refinamento
- [ ] ArchbaseSpaceTemplate
- [ ] Testes completos
- [ ] Documentação

---

## 📋 7. Checklist de Implementação

### Para cada Template:
- [ ] Adicionar props de segurança à interface
- [ ] Envolver componente com ArchbaseSecureTemplateWrapper
- [ ] Substituir botões por ArchbaseSecureActionButton
- [ ] Implementar useArchbaseTemplateSecurity
- [ ] Proteger userActions baseado em permissões
- [ ] Testar integração com DataSource existente
- [ ] Manter compatibilidade total (zero breaking changes)

### Testes:
- [ ] Usuário sem permissões
- [ ] Usuário com permissões parciais
- [ ] Usuário administrador
- [ ] Fallbacks funcionando
- [ ] Auto-registro de ações
- [ ] Performance (sem re-renders excessivos)

---

## 🚀 8. Exemplos de Uso - Mostrando Flexibilidade Total

### Cenário 1: Dev NÃO quer usar segurança
```typescript
// Código continua EXATAMENTE igual - zero mudanças
<ArchbaseFormModalTemplate
  dataSource={userDataSource}
  opened={modalOpen}
  onClickOk={handleSave}
  onClickCancel={handleCancel}
>
  <UserForm />
</ArchbaseFormModalTemplate>

// ✅ Funciona perfeitamente, sem overhead de segurança
```

### Cenário 2: Dev quer segurança básica
```typescript
// Adiciona apenas resourceName - resto igual
<ArchbaseFormModalTemplate
  resourceName="user_management"  // ← ÚNICA linha adicionada
  dataSource={userDataSource}
  opened={modalOpen}
  onClickOk={handleSave}
  onClickCancel={handleCancel}
>
  <UserForm />
</ArchbaseFormModalTemplate>

// ✅ Ativa segurança automática com permissões padrão
```

### Cenário 3: Dev quer segurança avançada
```typescript
// Máxima configuração - tudo opcional
<ArchbaseFormModalTemplate
  resourceName="user_management"
  resourceDescription="Gerenciamento de Usuários"
  requiredPermissions={['access_users', 'manage_users']}
  securityOptions={{
    autoRegisterActions: true,
    onSecurityReady: (manager) => console.log('Ready!'),
    onAccessDenied: () => router.push('/unauthorized')
  }}
  fallbackComponent={<UnauthorizedMessage />}
  dataSource={userDataSource}
  opened={modalOpen}
  onClickOk={handleSave}
  onClickCancel={handleCancel}
>
  <UserForm />
</ArchbaseFormModalTemplate>

// ✅ Segurança completa com controle total
```

### Cenário 4: App SEM ArchbaseSecurityProvider
```typescript
// App não tem provider de segurança
function App() {
  return (
    <div>
      {/* Sem ArchbaseSecurityProvider */}
      <ArchbaseFormModalTemplate
        resourceName="user_management"  // ← Vai ignorar graciosamente
        dataSource={userDataSource}
        opened={modalOpen}
      >
        <UserForm />
      </ArchbaseFormModalTemplate>
    </div>
  );
}

// ✅ Template detecta ausência do provider e funciona normalmente
// ✅ Console mostra debug: "Template solicitou segurança mas provider não encontrado"
```

### Cenário 5: App COM ArchbaseSecurityProvider
```typescript
// App com provider - segurança ativa
function App() {
  return (
    <ArchbaseSecurityProvider user={currentUser}>
      {/* Mesmo código do cenário 4 */}
      <ArchbaseFormModalTemplate
        resourceName="user_management"  // ← Agora ativa segurança
        dataSource={userDataSource}
        opened={modalOpen}
      >
        <UserForm />
      </ArchbaseFormModalTemplate>
    </ArchbaseSecurityProvider>
  );
}

// ✅ Template detecta provider e aplica segurança automaticamente
```

---

## 🎯 Próximos Passos - Abordagem Não-Invasiva

1. ✅ **Criar componentes opcionais** primeiro (hooks, wrappers)
2. ✅ **Testar com código existente** - garantir zero impacto
3. ✅ **Implementar em FormTemplate** (mais simples) 
4. ✅ **Validar que funciona sem segurança** - cenário padrão
5. ✅ **Expandir para outros templates** gradualmente
6. ✅ **Documentar os 3 níveis de uso**:
   - 🟢 **Nível 0**: Sem segurança (comportamento atual)
   - 🟡 **Nível 1**: Segurança básica (só resourceName)
   - 🔴 **Nível 2**: Segurança avançada (configuração completa)

## 📋 Garantias de Compatibilidade

### ✅ O que NUNCA vai quebrar:
- Código existente sem props de segurança
- Templates sem ArchbaseSecurityProvider no contexto
- Comportamento atual de botões e ações
- Performance (zero overhead sem segurança)
- Props existentes (nada removido/alterado)

### ✅ O que é SEMPRE opcional:
- Todas as props de segurança
- Contexto ArchbaseSecurityProvider
- Auto-registro de ações
- Proteção de botões
- Verificação de permissões

### ✅ Como garantimos compatibilidade:
- **Detecção automática** de contexto de segurança
- **Fallback gracioso** quando segurança não disponível  
- **Props opcionais** - nada obrigatório
- **Wrapper condicional** - só envolve quando necessário
- **Botões inteligentes** - usam segurança SE disponível

Esta abordagem garante que **TODOS** os devs possam continuar usando os templates exatamente como hoje, e **apenas quem quiser** pode optar pela segurança!