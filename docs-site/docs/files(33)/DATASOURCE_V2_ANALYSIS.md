# 📊 Análise do Archbase DataSource V2 - Pontos para Diagrama SVG

## 🎯 Visão Geral das Melhorias V2

O DataSource V2 traz melhorias significativas que devem ser destacadas visualmente:

### 1. **IMUTABILIDADE COM IMMER** 🔒
**Principal diferencial do V2**

```typescript
// V2 usa Immer para garantir imutabilidade
this.records = produce(this.records, draft => {
  const record = draft[this.currentIndex];
  if (record) {
    this.setNestedValue(record as Draft<T>, fieldName, value);
  }
});
```

**Representação no SVG:**
- Ícone de "cadeado" ou "escudo" no DataSource
- Indicar "Immutable State" com Immer logo
- Mostrar que todas as operações mantêm imutabilidade

---

### 2. **ESTADOS DO DATASOURCE** 🔄
**Três estados principais: browse, edit, insert**

```typescript
type DataSourceState = 'browse' | 'edit' | 'insert';
```

**Estados e Transições:**
- **BROWSE**: Navegação e leitura
- **EDIT**: Edição de registro existente (salva originalRecord)
- **INSERT**: Inserção de novo registro

**Representação no SVG:**
- Diagrama de estados com setas de transição
- Cores diferentes para cada estado
- Indicar operações permitidas em cada estado

**Transições:**
```
BROWSE → edit() → EDIT → save()/cancel() → BROWSE
BROWSE → insert() → INSERT → save()/cancel() → BROWSE
```

---

### 3. **OPERAÇÕES EM ARRAYS** 🎯
**NOVA funcionalidade exclusiva do V2**

```typescript
// Operações type-safe em arrays
appendToFieldArray<K extends keyof T>(fieldName: K, item: T[K] extends Array<infer U> ? U : never)
updateFieldArrayItem<K extends keyof T>(fieldName: K, index: number, updater: (draft: any) => void)
removeFromFieldArray<K extends keyof T>(fieldName: K, index: number)
insertIntoFieldArray<K extends keyof T>(fieldName: K, index: number, item: T[K] extends Array<infer U> ? U : never)
getFieldArray<K extends keyof T>(fieldName: K)
isFieldArray<K extends keyof T>(fieldName: K)
```

**Exemplo de Uso:**
```typescript
// Adicionar item ao array de pedidos
dsPedidos.appendToFieldArray('itens', novoItem);

// Atualizar item específico
dsPedidos.updateFieldArrayItem('itens', 0, draft => {
  draft.quantidade = 5;
  draft.precoUnitario = 10;
});
```

**Representação no SVG:**
- Seção destacada mostrando operações em arrays
- Ícone de "lista" ou "array"
- Conectar com itens de pedido (dsPedidoItens)
- Mostrar que é type-safe

---

### 4. **SISTEMA DE EVENTOS** 📡
**Sistema completo e tipado de eventos**

```typescript
// Eventos do ciclo de vida
DataSourceEventNames.beforeEdit
DataSourceEventNames.afterEdit
DataSourceEventNames.beforeInsert
DataSourceEventNames.afterInsert
DataSourceEventNames.beforeSave
DataSourceEventNames.afterSave
DataSourceEventNames.afterCancel
DataSourceEventNames.beforeRemove
DataSourceEventNames.afterRemove

// Eventos de dados
DataSourceEventNames.dataChanged
DataSourceEventNames.recordChanged
DataSourceEventNames.fieldChanged
DataSourceEventNames.afterScroll
DataSourceEventNames.refreshData

// Eventos de erro
DataSourceEventNames.onError
DataSourceEventNames.onFieldError
```

**Representação no SVG:**
- Timeline de eventos
- Indicar eventos "before" e "after"
- Mostrar propagação de eventos para listeners
- Conectar com hooks React

---

### 5. **LOCAL vs REMOTE DATASOURCE** 🌐
**Diferenças importantes entre as duas implementações**

#### ArchbaseDataSourceV2 (Local)
- Dados em memória
- Sem paginação
- Sem operações remotas
- Ideal para: formulários simples, dados já carregados

#### ArchbaseRemoteDataSourceV2 (Remote)
- Dados do backend
- Paginação completa
- CRUD remoto via service
- Filtragem RSQL
- grandTotalRecords vs totalRecords

**Representação no SVG:**
- Dois tipos de DataSource visualmente diferentes
- Local: ícone de banco de dados local
- Remote: ícone de nuvem/servidor
- Mostrar conexão com ArchbaseRemoteApiService

---

### 6. **PAGINAÇÃO E FILTRAGEM** 📄
**Recursos do RemoteDataSource**

```typescript
// Paginação
currentPage: number
pageSize: number
grandTotalRecords: number  // Total no servidor
totalRecords: number       // Total na página atual

// Filtragem
applyRemoteFilter(filter: ArchbaseQueryFilter, page: number, callback)
getDataWithFilter()
getDataWithRsqlFilter()
getDataWithQuickFilter()
```

**Tipos de Filtro:**
- QUICK: Busca rápida por texto
- NORMAL: Filtros estruturados
- ADVANCED: Filtros avançados/RSQL

**Representação no SVG:**
- Mostrar filtro sendo aplicado no servidor
- Indicar paginação (página atual/total de páginas)
- Diferenciar filteredRecords vs records

---

### 7. **HOOKS REACT** ⚛️
**Integração reativa com React**

```typescript
// Hook principal
useArchbaseDataSourceV2<T>(config)

// Hook read-only (otimizado)
useArchbaseDataSourceV2ReadOnly<T>(config)

// Hook para edição
useArchbaseDataSourceV2Editor<T>(config)

// Hooks remotos
useArchbaseRemoteDataSourceV2<T>(config)
useArchbaseRemoteDataSourceV2ReadOnly<T>(config)
useArchbaseRemoteDataSourceV2Editor<T>(config)
```

**Features dos Hooks:**
- Estado reativo automático
- Callbacks memoizados
- forceRender otimizado
- Cleanup automático
- Type safety completa

**Representação no SVG:**
- Mostrar hooks como camada entre DataSource e React
- Indicar estado reativo (currentRecord, isLoading, error)
- Conectar com componentes React

---

### 8. **VALIDAÇÃO** ✅
**Sistema de validação integrado**

```typescript
validator?: IDataSourceValidator

// Validação no save
if (this.validator) {
  const errors = this.validator.validateEntity<T>(currentRecord);
  if (errors && errors.length > 0) {
    throw new Error(errors[0].errorMessage);
  }
}

// Callbacks de erro
onFieldError?: (fieldName: string, error: string) => void;
onError?: (error: string, originalError?: any) => void;
```

**Representação no SVG:**
- Ícone de validação (checkmark/x)
- Indicar validação antes do save
- Mostrar eventos de erro (onFieldError, onError)

---

### 9. **CACHE E PERFORMANCE** ⚡
**Otimizações do V2**

```typescript
// Dois arrays para performance
private records: T[] = [];           // Todos os registros
private filteredRecords: T[] = [];   // Registros filtrados (Remote)

// Timestamps para cache
private lastDataChangedAt: number = 0;
private lastDataBrowsingOn: number = 0;

// Estado estável no hook
const dataSourceRef = useRef<ArchbaseDataSourceV2<T> | null>(null);
```

**Representação no SVG:**
- Indicar cache interno
- Mostrar filteredRecords vs records
- Highlight em "Performance Optimized"

---

### 10. **TANSTACK QUERY INTEGRATION** 🔌
**Preparado para integração futura**

```typescript
/**
 * Preparada para integração com TanStack Query
 * - Gestão de cache e sincronização otimizada
 */
```

**Representação no SVG:**
- Indicar "TanStack Query Ready"
- Mostrar camada de cache externa (opcional)
- Conectar com React Query

---

## 🎨 NOVO DESIGN DO DIAGRAMA SVG

### Sugestões de Melhorias para o Diagrama Atual:

#### 1. **Adicionar Seção de Estados**
```
┌─────────────────────────────────────┐
│  ESTADOS DO DATASOURCE             │
│                                     │
│  [BROWSE] ←→ [EDIT] ←→ [INSERT]   │
│                                     │
│  • Browse: Navegação               │
│  • Edit: Edição (backup original)  │
│  • Insert: Novo registro           │
└─────────────────────────────────────┘
```

#### 2. **Destacar Imutabilidade**
Adicionar badge "🔒 Immutable with Immer" em cada DataSource

#### 3. **Mostrar Operações de Array**
```
┌─────────────────────────────────┐
│  OPERAÇÕES EM ARRAYS (V2)      │
│                                 │
│  • appendToFieldArray()        │
│  • updateFieldArrayItem()      │
│  • removeFromFieldArray()      │
│  • insertIntoFieldArray()      │
│                                 │
│  Type-Safe ✓                   │
└─────────────────────────────────┘
```

#### 4. **Diferenciar Local vs Remote**
- **dsPedidos (Local)**: Badge "💾 Local"
- **dsPedidosRemote**: Badge "☁️ Remote + Pagination"

#### 5. **Adicionar Timeline de Eventos**
```
beforeEdit → afterEdit → beforeSave → afterSave
     ↓           ↓            ↓           ↓
  [Eventos emitidos para todos os listeners]
```

#### 6. **Mostrar Hooks React**
```
┌────────────────────────────────┐
│  REACT HOOKS                   │
│                                │
│  useArchbaseDataSourceV2       │
│  • Estado reativo              │
│  • Callbacks memoizados        │
│  • Type-safe                   │
└────────────────────────────────┘
```

#### 7. **Indicar Validação**
Adicionar ícone de validação (✓/✗) próximo ao método save()

#### 8. **Mostrar Paginação (Remote)**
```
┌─────────────────────────────────┐
│  PAGINAÇÃO                      │
│                                 │
│  Página: 1 / 10                │
│  grandTotal: 1000 registros    │
│  pageSize: 100                 │
└─────────────────────────────────┘
```

---

## 📐 ESTRUTURA SUGERIDA DO NOVO SVG

### Layout Hierárquico:

```
┌───────────────────────────────────────────────────────────────┐
│                   ARCHBASE REACT V3                          │
│              DATA BINDING ARCHITECTURE                        │
└───────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌──────────────────┐
│  REACT HOOKS    │────────>│   DATASOURCES    │
│  ⚛️             │<────────│   🔒 Immutable   │
│                 │         │                  │
│ • useState      │         │ Local  │ Remote  │
│ • useCallback   │         └──────────────────┘
│ • useMemo       │                 │
└─────────────────┘                 │
                                    ↓
┌───────────────────────────────────────────────┐
│            ESTADOS DO DATASOURCE              │
│                                               │
│  [BROWSE] ←─edit()──→ [EDIT] ──save()──→ ◯  │
│      ↑                   ↓                    │
│      └────cancel()───────┘                    │
│                                               │
│  [BROWSE] ←insert()→ [INSERT] ─save()→ ◯    │
│      ↑                   ↓                    │
│      └────cancel()───────┘                    │
└───────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│         OPERAÇÕES EM ARRAYS (V2 🆕)          │
│                                              │
│  dsPedidos.appendToFieldArray('itens', {})  │
│  dsPedidos.updateFieldArrayItem('itens', 0) │
│  dsPedidos.removeFromFieldArray('itens', 0) │
│                                              │
│  ✓ Type-Safe   ✓ Immutable   ✓ Reactive    │
└──────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          SISTEMA DE EVENTOS                  │
│                                             │
│  beforeEdit → afterEdit → fieldChanged      │
│  beforeSave → afterSave → dataChanged       │
│                                             │
│  ↓ Propagação para listeners (UI, Hooks)   │
└─────────────────────────────────────────────┘

┌──────────────────┬─────────────────────────┐
│   LOCAL DS       │   REMOTE DS             │
│   💾             │   ☁️                    │
│                  │                         │
│ • Memória        │ • Backend API          │
│ • Sem paginação  │ • Paginação            │
│ • Rápido         │ • Filtragem RSQL       │
└──────────────────┴─────────────────────────┘
```

---

## 🎯 ELEMENTOS VISUAIS RECOMENDADOS

### Ícones e Badges:
- 🔒 Immutable (Immer)
- ⚛️ React Hooks
- 💾 Local DataSource
- ☁️ Remote DataSource
- 📡 Events
- ✅ Validation
- 🎯 Type-Safe
- ⚡ Performance
- 📄 Pagination
- 🔍 Filtering
- 🔄 Reactive
- 🆕 New in V2

### Cores Sugeridas:
- **Immutability**: Verde (#7CB342) - Segurança
- **States**: Azul (#0066CC) - Estados
- **Events**: Laranja (#FF9800) - Ações
- **Arrays**: Roxo (#9C27B0) - Novidade V2
- **Remote**: Ciano (#00BCD4) - Cloud
- **Validation**: Vermelho (#F44336) - Crítico

---

## 📊 DADOS PARA O EXEMPLO

### Exemplo Completo de Pedido com Arrays:

```typescript
interface Pedido {
  id: number;
  cliente: string;
  dataPedido: Date;
  itens: ItemPedido[];      // Array de itens
  parcelas: Parcela[];      // Array de parcelas
  totalPedido: number;
}

interface ItemPedido {
  id: number;
  produto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

interface Parcela {
  numeroParcela: number;
  valorParcela: number;
  dataVencimento: Date;
  pago: boolean;
}
```

### Fluxo de Operação:

```typescript
// 1. Criar DataSource
const dsPedidos = new ArchbaseDataSourceV2<Pedido>({
  name: 'dsPedidos',
  records: []
});

// 2. Inserir novo pedido
dsPedidos.insert({
  id: 1,
  cliente: 'Cliente A',
  dataPedido: new Date(),
  itens: [],
  parcelas: [],
  totalPedido: 0
});

// 3. Adicionar item (usando operação de array V2)
dsPedidos.appendToFieldArray('itens', {
  id: 101,
  produto: 'Produto 1',
  quantidade: 3,
  precoUnitario: 10,
  subtotal: 30
});

// 4. Atualizar item (usando operação de array V2)
dsPedidos.updateFieldArrayItem('itens', 0, draft => {
  draft.quantidade = 5;
  draft.subtotal = draft.quantidade * draft.precoUnitario;
});

// 5. Salvar
await dsPedidos.save();
```

---

## 🚀 COMPARAÇÃO V1 vs V2

### O que mudou:

| Aspecto | V1 | V2 |
|---------|----|----|
| **Imutabilidade** | Manual | Automática (Immer) |
| **Arrays** | setFieldValue | Operações específicas type-safe |
| **Estados** | Implícito | Explícito (browse/edit/insert) |
| **Performance** | OK | Otimizada (memoização, refs) |
| **Type Safety** | Parcial | Completa |
| **Hooks** | Básico | Completo com otimizações |
| **Remote** | Básico | Avançado (paginação, filtros) |

---

## 💡 INSIGHTS PARA DOCUMENTAÇÃO

1. **V2 é backward compatible** - Mantém interface V1
2. **Migração gradual** - Pode usar V1 e V2 juntos
3. **Type-safe** - Erros em tempo de compilação
4. **Performance** - Memoização e imutabilidade
5. **Developer Experience** - APIs mais intuitivas
6. **Production Ready** - Testado e validado

---

## 📝 CHECKLIST PARA O NOVO SVG

- [ ] Adicionar seção de Estados (browse/edit/insert)
- [ ] Destacar imutabilidade com Immer
- [ ] Mostrar operações de array como feature V2
- [ ] Diferenciar Local vs Remote DataSource
- [ ] Adicionar timeline de eventos
- [ ] Mostrar React Hooks como camada
- [ ] Indicar validação
- [ ] Mostrar paginação (Remote)
- [ ] Adicionar badges (🆕, ✓, 🔒)
- [ ] Criar legenda completa
- [ ] Adicionar exemplo de código
- [ ] Incluir fluxo de operação completo

---

**Documento criado por:** Claude
**Data:** 28/12/2025
**Versão:** 1.0
**Arqubase React Version:** V3 (DataSource V2)
