# Integração de Segurança - ArchbaseDataGrid & Colunas

## 🎯 Abordagem: Segurança Nativa nas Colunas

### Estratégia Diferenciada para Grid:
Em vez de envolver colunas com componentes protegidos, **integraremos segurança diretamente na definição das colunas** e no processamento interno da Grid.

## 📋 1. Extensão do ArchbaseDataGridColumn

### Props de Segurança Opcionais:
```typescript
// archbase-data-grid-types.ts
export interface ArchbaseDataGridColumnProps<T> {
  // ... todas props existentes permanecem inalteradas
  
  // NOVAS props de segurança (100% opcionais)
  /** Nome da permissão para visualizar esta coluna */
  viewPermission?: string;
  
  /** Nome da permissão para editar esta coluna (futuro) */
  editPermission?: string;
  
  /** Componente/texto a ser exibido quando não tem permissão */
  fallbackContent?: ReactNode | string;
  
  /** Se true, oculta coluna completamente sem permissão. Se false, mostra fallback */
  hideWhenNoPermission?: boolean;
  
  /** Auto-registra a permissão da coluna (padrão: true) */
  autoRegisterPermission?: boolean;
}
```

### Comportamento da Coluna:
```typescript
// archbase-data-grid-column.ts
ArchbaseDataGridColumn.defaultProps = {
  // ... props existentes
  
  // Novos defaults de segurança
  hideWhenNoPermission: false, // Por padrão, mostra fallback
  autoRegisterPermission: true, // Auto-registra permissões
  fallbackContent: '***', // Conteúdo padrão quando sem permissão
};
```

## 🔧 2. Modificações no ArchbaseDataGrid

### Hook de Segurança Interno:
```typescript
// Dentro do ArchbaseDataGrid
const useGridSecurity = (resourceName?: string) => {
  const [securityState, setSecurityState] = useState({
    isAvailable: false,
    hasPermission: () => true,
    registerAction: () => {},
  });

  useEffect(() => {
    // Só ativa segurança SE resourceName fornecido
    if (!resourceName) return;

    try {
      const security = useArchbaseViewSecurity();
      setSecurityState({
        isAvailable: true,
        hasPermission: security.hasPermission,
        registerAction: security.registerAction,
      });
    } catch (error) {
      // Sem contexto de segurança, comportamento padrão
      console.debug('Grid solicitou segurança mas contexto não encontrado');
    }
  }, [resourceName]);

  return securityState;
};
```

### Processamento Inteligente das Colunas:
```typescript
// Dentro do useMemo que processa columns
const columns = useMemo(() => {
  const columnsDefs: GridColDef[] = [];
  const security = useGridSecurity(resourceName);

  // Extrair colunas dos children com segurança
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Columns) {
      Children.forEach(child.props.children, (column) => {
        if (isValidElement(column)) {
          const columnProps = column.props as ArchbaseDataGridColumnProps<any>;
          
          // VERIFICAR SEGURANÇA DA COLUNA
          const hasColumnPermission = !security.isAvailable || 
                                     !columnProps.viewPermission || 
                                     security.hasPermission(columnProps.viewPermission);

          // SE NÃO TEM PERMISSÃO E deve ocultar completamente
          if (!hasColumnPermission && columnProps.hideWhenNoPermission) {
            return; // Pula esta coluna completamente
          }

          // SE TEM PERMISSÃO OU deve mostrar com fallback
          if (columnProps.visible !== false) {
            // Auto-registrar permissão se solicitado
            if (security.isAvailable && 
                columnProps.autoRegisterPermission !== false && 
                columnProps.viewPermission) {
              security.registerAction(
                columnProps.viewPermission, 
                `Visualizar coluna ${columnProps.header}`
              );
            }

            // Criar renderizador seguro
            const originalRenderer = getRendererByDataType(columnProps.dataType, columnProps.render, {
              maskOptions: columnProps.maskOptions,
              dateFormat: appContext?.dateFormat || globalDateFormat,
              enumValues: columnProps.enumValues,
              decimalPlaces: 2
            });

            const secureRenderer = (params: any) => {
              // Se não tem permissão, mostrar fallback
              if (!hasColumnPermission) {
                const fallback = columnProps.fallbackContent || '***';
                return typeof fallback === 'string' ? 
                  <span style={{ color: '#999', fontStyle: 'italic' }}>{fallback}</span> : 
                  fallback;
              }
              
              // Se tem permissão, renderizar normalmente
              return originalRenderer(params);
            };

            columnsDefs.push({
              field: columnProps.dataField,
              headerName: columnProps.header,
              width: columnProps.size || 150,
              sortable: columnProps.enableSorting !== false,
              filterable: columnProps.enableColumnFilter !== false,
              renderCell: (params) => (
                <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: getAlignment(columnProps),
                  alignItems: 'center'
                }}>
                  {secureRenderer(params)}
                </div>
              ),
              // ... resto da configuração da coluna
            });
          }
        }
      });
    }
  });

  return columnsDefs;
}, [children, security, resourceName, /* outras dependências */]);
```

## 🎨 3. Exemplos de Uso

### Cenário 1: Grid SEM segurança (comportamento atual)
```tsx
<ArchbaseDataGrid dataSource={userDataSource}>
  <Columns>
    <ArchbaseDataGridColumn dataField="name" header="Nome" />
    <ArchbaseDataGridColumn dataField="email" header="Email" />
    <ArchbaseDataGridColumn dataField="salary" header="Salário" />
  </Columns>
</ArchbaseDataGrid>

// ✅ Funciona exatamente como sempre funcionou
```

### Cenário 2: Grid COM segurança básica
```tsx
<ArchbaseDataGrid 
  dataSource={userDataSource}
  resourceName="user_grid"  // ← Ativa segurança
>
  <Columns>
    <ArchbaseDataGridColumn 
      dataField="name" 
      header="Nome" 
    />
    <ArchbaseDataGridColumn 
      dataField="email" 
      header="Email"
      viewPermission="view_user_email"  // ← Coluna protegida
    />
    <ArchbaseDataGridColumn 
      dataField="salary" 
      header="Salário"
      viewPermission="view_user_salary"  // ← Coluna protegida
      fallbackContent="Confidencial"     // ← Fallback customizado
    />
  </Columns>
</ArchbaseDataGrid>

// ✅ Colunas sem permissão mostram fallback
```

### Cenário 3: Grid COM segurança avançada
```tsx
<ArchbaseDataGrid 
  dataSource={userDataSource}
  resourceName="user_grid"
  resourceDescription="Lista de Usuários"
>
  <Columns>
    <ArchbaseDataGridColumn 
      dataField="name" 
      header="Nome" 
    />
    <ArchbaseDataGridColumn 
      dataField="email" 
      header="Email"
      viewPermission="view_user_email"
      hideWhenNoPermission={true}  // ← Oculta coluna completamente
    />
    <ArchbaseDataGridColumn 
      dataField="salary" 
      header="Salário"
      viewPermission="view_user_salary"
      fallbackContent={<span>🔒 Restrito</span>}  // ← Fallback JSX
      autoRegisterPermission={true}
    />
    <ArchbaseDataGridColumn 
      dataField="phone" 
      header="Telefone"
      viewPermission="view_user_contact"
      fallbackContent="***-***-****"
    />
  </Columns>
</ArchbaseDataGrid>

// ✅ Controle granular por coluna
```

## 🔧 4. Integração com UserActions

### Toolbar com Segurança:
```typescript
// Modificar UserActionsOptions para incluir permissões
export interface UserActionsOptions {
  visible: boolean;
  // ... props existentes
  
  // NOVAS props de segurança
  actionPermissions?: {
    add?: string;
    edit?: string;
    remove?: string;
    view?: string;
    export?: string;
    print?: string;
  };
}

// No buildSecureToolbarActions dentro do ArchbaseDataGrid
const buildSecureToolbarActions = () => {
  const security = useGridSecurity(resourceName);
  
  if (!userActions?.visible) return null;

  return (
    <GridToolBarActions>
      <div className="no-print">
        <Flex gap="8px" rowGap="8px">
          {/* Botão Add com segurança */}
          {userActions.onAddExecute && 
           (!security.isAvailable || 
            !userActions.actionPermissions?.add || 
            security.hasPermission(userActions.actionPermissions.add)) && (
            <Button
              color="green"
              leftSection={<IconPlus />}
              onClick={userActions.onAddExecute}
            >
              {userActions.labelAdd || t('New')}
            </Button>
          )}
          
          {/* Botão Edit com segurança */}
          {userActions.onEditExecute && 
           (!security.isAvailable || 
            !userActions.actionPermissions?.edit || 
            security.hasPermission(userActions.actionPermissions.edit)) && (
            <Button
              color="blue"
              leftSection={<IconEdit />}
              disabled={!dataSource.isBrowsing() || dataSource.isEmpty()}
              onClick={userActions.onEditExecute}
            >
              {userActions.labelEdit || t('Edit')}
            </Button>
          )}
          
          {/* Similar para outros botões... */}
        </Flex>
      </div>
    </GridToolBarActions>
  );
};
```

## 🚀 5. Props Adicionais para ArchbaseDataGrid

### Extensão da Interface:
```typescript
export interface ArchbaseDataGridProps<T, ID> extends ArchbaseTemplateSecurityProps {
  // ... todas props existentes permanecem inalteradas
  
  // NOVAS props de segurança (100% opcionais)
  
  /** Configurações de segurança para colunas */
  columnSecurityOptions?: {
    /** Fallback padrão para colunas sem permissão */
    defaultFallback?: ReactNode | string;
    /** Se true, oculta colunas sem permissão por padrão */
    hideByDefault?: boolean;
    /** Prefixo para auto-registro de permissões de coluna */
    permissionPrefix?: string;
  };
}
```

### Uso Avançado:
```tsx
<ArchbaseDataGrid 
  dataSource={userDataSource}
  resourceName="user_management"
  resourceDescription="Gerenciamento de Usuários"
  requiredPermissions={['access_users']}
  columnSecurityOptions={{
    defaultFallback: "🔒 Restrito",
    hideByDefault: false,
    permissionPrefix: "user_"  // → user_view_email, user_view_salary
  }}
  userActions={{
    visible: true,
    onAddExecute: handleAdd,
    onEditExecute: handleEdit,
    onRemoveExecute: handleRemove,
    actionPermissions: {
      add: 'create_user',
      edit: 'edit_user',
      remove: 'delete_user'
    }
  }}
>
  <Columns>
    <ArchbaseDataGridColumn 
      dataField="name" 
      header="Nome" 
    />
    <ArchbaseDataGridColumn 
      dataField="email" 
      header="Email"
      viewPermission="view_email"  // → Vira "user_view_email" com prefix
    />
    <ArchbaseDataGridColumn 
      dataField="salary" 
      header="Salário"
      viewPermission="view_salary"
      hideWhenNoPermission={true}
    />
  </Columns>
</ArchbaseDataGrid>
```

## ✅ 6. Vantagens da Abordagem

### 🔹 **Performance Superior:**
- ✅ Processamento de segurança acontece **uma vez** na criação das colunas
- ✅ **Zero componentes extras** envolvendo cada coluna
- ✅ **Zero re-renders** desnecessários por mudanças de permissão

### 🔹 **Developer Experience:**
- ✅ **API limpa** - permissão definida na própria coluna
- ✅ **Fallbacks flexíveis** - string, JSX ou ocultação completa
- ✅ **Auto-registro** de permissões por coluna
- ✅ **Compatibilidade total** - funciona com ou sem segurança

### 🔹 **Controle Granular:**
- ✅ **Por coluna** - cada coluna pode ter permissão diferente
- ✅ **Por ação** - botões da toolbar protegidos individualmente
- ✅ **Fallbacks customizáveis** - controle total da UX
- ✅ **Ocultação inteligente** - pode ocultar ou mostrar conteúdo restrito

### 🔹 **Flexibilidade Total:**
```typescript
// Cenário 1: Sem segurança
<ArchbaseDataGridColumn dataField="email" />

// Cenário 2: Com proteção simples  
<ArchbaseDataGridColumn dataField="email" viewPermission="view_email" />

// Cenário 3: Com fallback customizado
<ArchbaseDataGridColumn 
  dataField="salary" 
  viewPermission="view_salary"
  fallbackContent="💰 Confidencial" 
/>

// Cenário 4: Ocultar completamente
<ArchbaseDataGridColumn 
  dataField="secret" 
  viewPermission="view_secrets"
  hideWhenNoPermission={true} 
/>
```

## 🎯 7. Implementação

A implementação seguiria exatamente o padrão estabelecido:
1. **Extensão opcional** das interfaces existentes
2. **Hook interno** para detectar contexto de segurança
3. **Processamento inteligente** das colunas no `useMemo`
4. **Zero breaking changes** - tudo opcional
5. **Fallback gracioso** quando não há contexto de segurança

Esta abordagem é **muito mais eficiente** que envolver cada coluna individualmente e oferece uma **API mais limpa** e **performance superior**!