# Exemplos de Uso - ArchbaseDataGrid com Segurança

## ✅ Implementação Concluída

A integração de segurança no ArchbaseDataGrid foi implementada com sucesso seguindo o padrão **100% opcional e não-invasivo**.

## 🎯 Exemplos de Uso

### Cenário 1: Grid SEM segurança (comportamento atual)
```tsx
<ArchbaseDataGrid dataSource={userDataSource}>
  <Columns>
    <ArchbaseDataGridColumn dataField="name" header="Nome" dataType="text" />
    <ArchbaseDataGridColumn dataField="email" header="Email" dataType="text" />
    <ArchbaseDataGridColumn dataField="salary" header="Salário" dataType="currency" />
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
      dataType="text"
    />
    <ArchbaseDataGridColumn 
      dataField="email" 
      header="Email"
      dataType="text"
      viewPermission="view_user_email"  // ← Coluna protegida
    />
    <ArchbaseDataGridColumn 
      dataField="salary" 
      header="Salário"
      dataType="currency"
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
  columnSecurityOptions={{
    defaultFallback: "🔒 Restrito",
    hideByDefault: false,
    permissionPrefix: "user_"  // → user_view_email, user_view_salary
  }}
>
  <Columns>
    <ArchbaseDataGridColumn 
      dataField="name" 
      header="Nome" 
      dataType="text"
    />
    <ArchbaseDataGridColumn 
      dataField="email" 
      header="Email"
      dataType="text"
      viewPermission="view_email"  // → Vira "user_view_email" com prefix
      hideWhenNoPermission={true}  // ← Oculta coluna completamente
    />
    <ArchbaseDataGridColumn 
      dataField="salary" 
      header="Salário"
      dataType="currency"
      viewPermission="view_salary"
      fallbackContent={<span>🔒 Restrito</span>}  // ← Fallback JSX
      autoRegisterPermission={true}
    />
    <ArchbaseDataGridColumn 
      dataField="phone" 
      header="Telefone"
      dataType="text"
      viewPermission="view_contact"
      fallbackContent="***-***-****"
    />
  </Columns>
</ArchbaseDataGrid>

// ✅ Controle granular por coluna
```

## 🔧 Novas Props Disponíveis

### ArchbaseDataGridProps
```typescript
interface ArchbaseDataGridProps {
  // ... todas props existentes permanecem inalteradas
  
  /** Nome do recurso para ativar segurança no grid */
  resourceName?: string;
  
  /** Descrição do recurso para contexto de segurança */
  resourceDescription?: string;
  
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

### ArchbaseDataGridColumnProps
```typescript
interface ArchbaseDataGridColumnProps {
  // ... todas props existentes permanecem inalteradas
  
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

## 📋 Comportamento das Colunas

### Defaults de Segurança
```typescript
ArchbaseDataGridColumn.defaultProps = {
  // ... props existentes
  
  hideWhenNoPermission: false,     // Por padrão, mostra fallback
  autoRegisterPermission: true,    // Auto-registra permissões
  fallbackContent: '***',          // Conteúdo padrão quando sem permissão
};
```

### Lógica de Processamento
1. **Sem resourceName**: Funciona normalmente, sem segurança
2. **Com resourceName, sem viewPermission**: Coluna sempre visível
3. **Com resourceName + viewPermission**:
   - **Com permissão**: Renderiza conteúdo normal
   - **Sem permissão + hideWhenNoPermission=true**: Oculta coluna
   - **Sem permissão + hideWhenNoPermission=false**: Mostra fallback

## ✅ Vantagens da Implementação

### 🔹 **Zero Breaking Changes**
- ✅ Código existente funciona sem modificações
- ✅ Todas as props de segurança são **100% opcionais**
- ✅ Compatibilidade total com código legado

### 🔹 **Performance Superior**
- ✅ Processamento de segurança **uma vez** na criação das colunas
- ✅ **Zero componentes extras** envolvendo cada coluna
- ✅ **Zero re-renders** desnecessários

### 🔹 **API Limpa e Flexível**
- ✅ Permissão definida diretamente na coluna
- ✅ Fallbacks flexíveis: string, JSX ou ocultação
- ✅ Auto-registro de permissões
- ✅ Prefixos personalizáveis

### 🔹 **Controle Granular**
- ✅ Segurança **por coluna** individualmente
- ✅ Fallbacks **customizáveis** por coluna
- ✅ **Ocultação inteligente** ou conteúdo restrito
- ✅ **Auto-registro** opcional de permissões

## 🚀 Status da Implementação

✅ **CONCLUÍDO**: Integração de segurança no ArchbaseDataGrid  
✅ **VALIDADO**: Build bem-sucedido sem breaking changes  
✅ **TESTADO**: Compatibilidade com código existente  

A implementação segue exatamente o padrão estabelecido nos templates e está pronta para uso!