# Plano de Melhorias para o Sistema DataSource

## Sumário Executivo

Este documento apresenta um plano abrangente de melhorias para o sistema DataSource da biblioteca Archbase React, baseado na análise detalhada dos pontos fortes, fracos e casos de uso reais encontrados em projetos de produção.

As melhorias propostas mantêm total compatibilidade com o código existente, focando em evolução incremental que resolve limitações identificadas sem quebrar implementações atuais.

## 1. Problemas Identificados

### 1.1 Limitações Arquiteturais

- **Mutabilidade vs Imutabilidade**: DataSource usa mutações diretas, conflitando com princípios React
- **Forçar Re-renders**: Uso excessivo de `forceUpdate()` indica problemas no sistema de eventos
- **Estado Duplicado**: Componentes mantêm estado local + estado no DataSource
- **Sistema de Eventos Desacoplado**: Listeners manuais não integrados com ciclo React
- **Falta de Type Safety**: Eventos baseados em strings sem garantias de tipos

### 1.2 Dificuldades em Cenários Complexos

- **Arrays Aninhados**: Manipulação desajeitada de estruturas como `objeto.regras[]`
- **Múltiplas Entidades**: Múltiplos DataSources sem coordenação entre eles
- **Edição Inline**: Estado temporário para cada campo sendo editado
- **Quebra de Encapsulamento**: Acesso direto a `browseRecords()` expõe implementação
- **Componentes Não Preparados**: Muito código boilerplate para usar componentes externos

### 1.3 Problemas com React Moderno

- **Server Components**: Não funciona com React Server Components
- **SSR/Hidratação**: Problemas de sincronização em renderização server-side
- **Concurrent Features**: Não aproveita otimizações do React 18+
- **DevTools**: Debugging limitado com React DevTools

## 2. Melhorias Propostas

### 2.1 Melhorias para Arrays Aninhados

#### 2.1.1 Hook useArchbaseNestedDataSource

```typescript
export function useArchbaseNestedDataSource<T, P>(
  parentDataSource: ArchbaseDataSource<P>,
  fieldName: keyof P,
  options?: {
    autoSync?: boolean;
    validator?: IDataSourceValidator;
  }
) {
  const nestedDataSource = useRef(new ArchbaseDataSource<T>());
  
  // Sincroniza automaticamente com o pai
  useArchbaseDataSourceListener({
    dataSource: parentDataSource,
    listener: (event) => {
      if (event.type === DataSourceEventNames.recordChanged ||
          event.type === DataSourceEventNames.afterScroll) {
        const items = parentDataSource.getFieldValue(fieldName as string) || [];
        nestedDataSource.current.setRecords(items);
      }
    }
  });
  
  // Auto-sync de volta para o pai quando configurado
  if (options?.autoSync) {
    useArchbaseDataSourceListener({
      dataSource: nestedDataSource.current,
      listener: (event) => {
        if (event.type === DataSourceEventNames.dataChanged) {
          parentDataSource.setFieldValue(
            fieldName as string,
            nestedDataSource.current.browseRecords()
          );
        }
      }
    });
  }
  
  return nestedDataSource.current;
}
```

**Benefícios**:
- Elimina manipulação manual de arrays
- Reutiliza padrão DataSource familiar
- Sincronização automática pai-filho
- Type-safe com generics

#### 2.1.2 ArchbaseNestedListTemplate (Revisado)

Baseado na análise do `ArchbaseGridTemplate` existente, o componente deve ser um **template wrapper** mais robusto:

```typescript
interface ArchbaseNestedListTemplateProps<T, ID> {
  // Configuração básica (similar ao GridTemplate)
  title: string;
  parentDataSource: ArchbaseDataSource<any, any>;
  parentField: string;
  
  // Componente filho que renderiza a lista
  children: (props: {
    dataSource: ArchbaseDataSource<T, ID>;
    level: number;
    parentItem?: any;
  }) => ReactNode;
  
  // Sistema de filtros hierárquicos (baseado no GridTemplate)
  filterType?: 'none' | 'normal' | 'advanced';
  allowFilterChildren?: boolean;
  filterPersistenceDelegator?: ArchbaseQueryFilterDelegator;
  
  // Ações por nível (similar ao userActions do GridTemplate)
  levelActions?: Record<number, UserActionsOptions>;
  onLevelAction?: (action: string, level: number, item?: T) => void;
  
  // Controle de expansão
  expandedNodes?: ID[];
  onExpandedChange?: (nodes: ID[]) => void;
  defaultExpanded?: boolean;
  
  // Configurações visuais
  showLevelIndicator?: boolean;
  enableLevelNumbers?: boolean;
  maxDepth?: number;
  
  // Estado persistente (baseado no GridTemplate)
  stateStorageHash?: string;
}

export function ArchbaseNestedListTemplate<T, ID>({
  title,
  parentDataSource,
  parentField,
  children,
  filterType = 'none',
  levelActions,
  stateStorageHash,
  ...props
}: ArchbaseNestedListTemplateProps<T, ID>) {
  
  // Hook para DataSource aninhado
  const nestedDataSource = useArchbaseNestedDataSource<T, any>(
    parentDataSource,
    parentField,
    { autoSync: true }
  );
  
  // Estado persistente (padrão do GridTemplate)
  const [stateValues, setStateValues] = useArchbaseStateValues({
    storageHash: stateStorageHash || `nested-list-${title}`,
    defaultValues: {
      expandedNodes: props.defaultExpanded ? [] : [],
      filterState: {},
      levelStates: {}
    }
  });
  
  return (
    <ArchbaseCard title={title}>
      {/* Sistema de filtros (se habilitado) */}
      {filterType !== 'none' && (
        <ArchbaseNestedListFilters
          filterType={filterType}
          dataSource={nestedDataSource}
          onFilterChange={handleFilterChange}
        />
      )}
      
      {/* Toolbar com ações por nível */}
      {levelActions && (
        <ArchbaseNestedListToolbar
          levelActions={levelActions}
          currentLevel={0}
          onAction={props.onLevelAction}
        />
      )}
      
      {/* Renderiza o componente filho com o DataSource */}
      {children({
        dataSource: nestedDataSource,
        level: 0,
        parentItem: parentDataSource.getCurrentRecord()
      })}
    </ArchbaseCard>
  );
}
```

**Exemplos de uso com componentes existentes**:

```typescript
// Com ArchbaseDataGrid
<ArchbaseNestedListTemplate
  title="Itens do Pedido"
  parentDataSource={pedidoDS}
  parentField="itens"
  filterType="normal"
  levelActions={{
    0: { add: true, edit: true, remove: true }
  }}
>
  {({ dataSource }) => (
    <ArchbaseDataGrid
      dataSource={dataSource}
      columns={[
        <Column field="produto" title="Produto" />,
        <Column field="quantidade" title="Qtd" />,
        <Column field="valor" title="Valor" />
      ]}
    />
  )}
</ArchbaseNestedListTemplate>

// Com ArchbaseList
<ArchbaseNestedListTemplate
  title="Comentários"
  parentDataSource={postDS}
  parentField="comentarios"
  maxDepth={3}
>
  {({ dataSource, level }) => (
    <ArchbaseList
      dataSource={dataSource}
      renderItem={(item) => (
        <CommentItem item={item} level={level} />
      )}
    />
  )}
</ArchbaseNestedListTemplate>
```

**Benefícios desta abordagem**:
- **Reutiliza padrões** do `ArchbaseGridTemplate` existente
- **Flexibilidade** para usar qualquer componente filho
- **Sistema de filtros** hierárquicos integrado
- **Estado persistente** entre sessões
- **Compatibilidade** com `ArchbaseDataGrid`, `ArchbaseList` existentes

**Benefícios**:
- Interface padronizada para listas aninhadas
- Reduz código boilerplate
- Reutiliza componentes existentes
- Facilita casos master-detail

#### 2.1.3 Métodos Utilitários para Arrays

```typescript
class ArchbaseDataSource<T, ID> {
  // Helper para campos array
  getFieldArray<K extends keyof T>(fieldName: K): T[K] extends Array<infer U> ? U[] : never {
    const value = this.getFieldValue(fieldName as string);
    return (value || []) as any;
  }
  
  // Atualizar item em array
  updateFieldArrayItem<K extends keyof T>(
    fieldName: K,
    index: number,
    updater: (item: T[K] extends Array<infer U> ? U : never) => T[K] extends Array<infer U> ? U : never
  ) {
    const array = [...this.getFieldArray(fieldName)];
    array[index] = updater(array[index]);
    this.setFieldValue(fieldName as string, array);
  }
  
  // Adicionar item em array
  appendToFieldArray<K extends keyof T>(
    fieldName: K,
    item: T[K] extends Array<infer U> ? U : never
  ) {
    const array = [...this.getFieldArray(fieldName)];
    array.push(item);
    this.setFieldValue(fieldName as string, array);
  }
  
  // Remover item de array
  removeFromFieldArray<K extends keyof T>(fieldName: K, index: number) {
    const array = [...this.getFieldArray(fieldName)];
    array.splice(index, 1);
    this.setFieldValue(fieldName as string, array);
  }
}
```

**Benefícios**:
- API mais intuitiva para arrays
- Operações imutáveis por padrão
- Type-safety melhorado
- Compatibilidade com código existente

### 2.2 Sistema de Eventos Melhorado

#### 2.2.1 Novos Tipos de Eventos

```typescript
export enum DataSourceEventNames {
  // Eventos existentes...
  
  // Novos eventos para arrays
  fieldArrayItemAdded = 'fieldArrayItemAdded',
  fieldArrayItemUpdated = 'fieldArrayItemUpdated',
  fieldArrayItemRemoved = 'fieldArrayItemRemoved',
  
  // Eventos para validação
  beforeValidation = 'beforeValidation',
  afterValidation = 'afterValidation',
  validationError = 'validationError',
  
  // Eventos para sincronização
  syncStart = 'syncStart',
  syncComplete = 'syncComplete',
  syncError = 'syncError'
}

interface FieldArrayEvent<T> extends DataSourceEvent<T> {
  fieldName: string;
  index: number;
  item?: any;
  oldItem?: any;
}
```

#### 2.2.2 Hook para Edição Inline

```typescript
export function useArchbaseInlineEdit<T>(
  dataSource: ArchbaseDataSource<T>,
  fieldName: string,
  index?: number
) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState<any>(null);
  
  const startEdit = () => {
    const currentValue = index !== undefined
      ? dataSource.getFieldArray(fieldName)[index]
      : dataSource.getFieldValue(fieldName);
    
    setTempValue(currentValue);
    setEditing(true);
  };
  
  const save = () => {
    if (index !== undefined) {
      dataSource.updateFieldArrayItem(fieldName, index, () => tempValue);
    } else {
      dataSource.setFieldValue(fieldName, tempValue);
    }
    setEditing(false);
  };
  
  const cancel = () => {
    setTempValue(null);
    setEditing(false);
  };
  
  return {
    editing,
    tempValue,
    setTempValue,
    startEdit,
    save,
    cancel
  };
}
```

### 2.3 Wrappers para Componentes Externos

#### 2.3.1 Hooks Utilitários

```typescript
export function useArchbaseFieldValue<T, ID>(
  dataSource?: ArchbaseDataSource<T, ID>,
  dataField?: string
) {
  const [value, setValue] = useState<any>();
  const forceUpdate = useForceUpdate();
  
  const loadValue = useCallback(() => {
    if (dataSource && dataField) {
      setValue(dataSource.getFieldValue(dataField));
    }
  }, [dataSource, dataField]);
  
  useArchbaseDataSourceListener({
    dataSource,
    listener: (event) => {
      if ((event.type === DataSourceEventNames.fieldChanged && event.fieldName === dataField) ||
          event.type === DataSourceEventNames.recordChanged) {
        loadValue();
        forceUpdate();
      }
    }
  });
  
  useArchbaseDidMount(loadValue);
  return value;
}

export function useArchbaseFieldError<T, ID>(
  dataSource?: ArchbaseDataSource<T, ID>,
  dataField?: string
) {
  const [error, setError] = useState<string>();
  
  useArchbaseDataSourceListener({
    dataSource,
    listener: (event) => {
      if (event.type === DataSourceEventNames.onFieldError && 
          event.fieldName === dataField) {
        setError(event.error);
      }
    }
  });
  
  return error;
}

export function useArchbaseIsReadOnly<T, ID>(
  dataSource?: ArchbaseDataSource<T, ID>
) {
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  useArchbaseDataSourceListener({
    dataSource,
    listener: (event) => {
      if (event.type === DataSourceEventNames.afterEdit ||
          event.type === DataSourceEventNames.afterCancel) {
        setIsReadOnly(dataSource?.isBrowsing() || false);
      }
    }
  });
  
  useEffect(() => {
    setIsReadOnly(dataSource?.isBrowsing() || false);
  }, [dataSource]);
  
  return isReadOnly;
}
```

#### 2.3.2 Factory Function para Wrappers

```typescript
export function createArchbaseWrapper<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  config: {
    valueProps: string;
    onChangeProps: string;
    errorProps?: string;
    disabledProps?: string;
  }
) {
  return function ArchbaseWrapped<T, ID>({
    dataSource,
    dataField,
    ...props
  }: P & ArchbaseDataSourceProps<T, ID>) {
    
    const value = useArchbaseFieldValue(dataSource, dataField);
    const error = useArchbaseFieldError(dataSource, dataField);
    const isReadOnly = useArchbaseIsReadOnly(dataSource);
    
    const handleChange = (newValue: any) => {
      if (dataSource && dataField && !dataSource.isBrowsing()) {
        dataSource.setFieldValue(dataField, newValue);
      }
      
      const originalOnChange = props[config.onChangeProps];
      if (originalOnChange) {
        originalOnChange(newValue);
      }
    };
    
    const wrappedProps = {
      ...props,
      [config.valueProps]: dataSource && dataField ? value : props[config.valueProps],
      [config.onChangeProps]: handleChange,
    };
    
    if (config.errorProps) {
      wrappedProps[config.errorProps] = dataSource && dataField ? error : props[config.errorProps];
    }
    
    if (config.disabledProps) {
      wrappedProps[config.disabledProps] = props[config.disabledProps] || isReadOnly;
    }
    
    return <Component {...wrappedProps as P} />;
  };
}
```

#### 2.3.3 Wrappers para Componentes Mantine Comuns

```typescript
// Criar wrappers para componentes mais usados
export const ArchbaseSelect = createArchbaseWrapper(Select, {
  valueProps: 'value',
  onChangeProps: 'onChange',
  errorProps: 'error',
  disabledProps: 'disabled'
});

export const ArchbaseSlider = createArchbaseWrapper(Slider, {
  valueProps: 'value',
  onChangeProps: 'onChange',
  disabledProps: 'disabled'
});

export const ArchbaseRating = createArchbaseWrapper(Rating, {
  valueProps: 'value',
  onChangeProps: 'onChange'
});

export const ArchbaseSwitch = createArchbaseWrapper(Switch, {
  valueProps: 'checked',
  onChangeProps: 'onChange',
  errorProps: 'error',
  disabledProps: 'disabled'
});

export const ArchbaseCheckbox = createArchbaseWrapper(Checkbox, {
  valueProps: 'checked',
  onChangeProps: 'onChange',
  errorProps: 'error',
  disabledProps: 'disabled'
});
```

### 2.4 Melhorias Master-Detail

#### 2.4.1 Componente ArchbaseMasterDetail

```typescript
export function ArchbaseMasterDetail<M, D>({
  masterDataSource,
  detailConfig,
  masterRender,
  detailRender,
  layout = 'horizontal'
}: ArchbaseMasterDetailProps<M, D>) {
  
  const detailDataSource = useArchbaseNestedDataSource<D, M>(
    masterDataSource,
    detailConfig.field,
    { autoSync: true }
  );
  
  const GridComponent = layout === 'horizontal' ? Grid : Stack;
  const masterSize = layout === 'horizontal' ? 6 : 12;
  const detailSize = layout === 'horizontal' ? 6 : 12;
  
  return (
    <GridComponent>
      <Grid.Col span={masterSize}>
        {masterRender(masterDataSource)}
      </Grid.Col>
      <Grid.Col span={detailSize}>
        {detailRender(detailDataSource)}
      </Grid.Col>
    </GridComponent>
  );
}
```

#### 2.4.2 Hook para Múltiplos DataSources Coordenados

```typescript
export function useArchbaseCoordinatedDataSources<T extends Record<string, any>>(
  config: {
    [K in keyof T]: {
      service: ArchbaseRemoteApiService<T[K], any>;
      dependencies?: (keyof T)[];
      filter?: (parentData: any) => string;
    }
  }
) {
  const dataSources = {} as { [K in keyof T]: ArchbaseDataSource<T[K], any> };
  const [loading, setLoading] = useState<Partial<Record<keyof T, boolean>>>({});
  
  // Criar DataSources
  Object.entries(config).forEach(([key, cfg]) => {
    const { dataSource, isLoading } = useArchbaseRemoteDataSource({
      name: key as string,
      service: cfg.service,
      loadOnStart: !cfg.dependencies?.length
    });
    
    dataSources[key as keyof T] = dataSource;
    loading[key as keyof T] = isLoading;
  });
  
  // Configurar dependências
  Object.entries(config).forEach(([key, cfg]) => {
    if (cfg.dependencies) {
      cfg.dependencies.forEach(dep => {
        useArchbaseDataSourceListener({
          dataSource: dataSources[dep],
          listener: (event) => {
            if (event.type === DataSourceEventNames.afterScroll) {
              const filter = cfg.filter?.(dataSources[dep].getCurrentRecord());
              if (filter) {
                dataSources[key as keyof T].applyRemoteFilter(filter);
              }
            }
          }
        });
      });
    }
  });
  
  return { dataSources, loading };
}
```

### 2.5 Sistema de Validação Aprimorado

#### 2.5.1 Integração com Schema Validation

```typescript
// Suporte para Zod, Yup, Joi
export function useArchbaseDataSourceWithSchema<T>(
  config: ArchbaseDataSourceConfig<T> & {
    schema?: z.ZodSchema<T> | yup.Schema<T>;
    validateOnChange?: boolean;
    validateOnSave?: boolean;
  }
) {
  const dataSource = useArchbaseDataSource(config);
  
  const validate = useCallback((record: T) => {
    if (!config.schema) return { hasErrors: false, errors: {} };
    
    try {
      config.schema.parse(record);
      return { hasErrors: false, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors;
        return { hasErrors: true, errors };
      }
      return { hasErrors: true, errors: { _root: error.message } };
    }
  }, [config.schema]);
  
  // Validação automática
  useArchbaseDataSourceListener({
    dataSource,
    listener: (event) => {
      if ((config.validateOnChange && event.type === DataSourceEventNames.fieldChanged) ||
          (config.validateOnSave && event.type === DataSourceEventNames.beforeSave)) {
        
        const validation = validate(dataSource.getCurrentRecord());
        if (validation.hasErrors) {
          Object.entries(validation.errors).forEach(([field, error]) => {
            dataSource.setFieldError(field, error);
          });
          
          if (event.type === DataSourceEventNames.beforeSave) {
            event.preventDefault();
          }
        }
      }
    }
  });
  
  return { dataSource, validate };
}
```

#### 2.5.2 Validação Cross-Field

```typescript
export function useArchbaseCrossFieldValidation<T>(
  dataSource: ArchbaseDataSource<T>,
  rules: CrossFieldValidationRule<T>[]
) {
  useArchbaseDataSourceListener({
    dataSource,
    listener: (event) => {
      if (event.type === DataSourceEventNames.fieldChanged ||
          event.type === DataSourceEventNames.beforeSave) {
        
        const record = dataSource.getCurrentRecord();
        
        rules.forEach(rule => {
          const isValid = rule.validator(record);
          if (!isValid) {
            rule.fields.forEach(field => {
              dataSource.setFieldError(field, rule.message);
            });
          } else {
            rule.fields.forEach(field => {
              dataSource.clearFieldError(field);
            });
          }
        });
      }
    }
  });
}

interface CrossFieldValidationRule<T> {
  fields: (keyof T)[];
  validator: (record: T) => boolean;
  message: string;
}
```

### 2.6 Versões V2 com TanStack Query e Immer

#### 2.6.1 ArchbaseDataSource V2 com Immer

```typescript
import { produce, Draft } from 'immer';

export class ArchbaseDataSourceV2<T, ID> extends ArchbaseDataSource<T, ID> {
  
  // Override setFieldValue para usar Immer
  setFieldValue(fieldName: string, value: any): void {
    if (!this.currentRecord) return;
    
    const oldValue = this.getFieldValue(fieldName);
    if (oldValue === value) return;
    
    // Criar nova versão imutável
    const newRecord = produce(this.currentRecord, (draft: Draft<T>) => {
      // Suporte para campos aninhados usando dot notation
      const fields = fieldName.split('.');
      let current: any = draft;
      
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {};
        }
        current = current[fields[i]];
      }
      
      current[fields[fields.length - 1]] = value;
    });
    
    // Atualizar records de forma imutável
    const newRecords = produce(this.records, (draft: Draft<T[]>) => {
      draft[this.currentRecordIndex] = newRecord as T;
    });
    
    // Emitir eventos antes da mudança
    this.emit({
      type: DataSourceEventNames.beforeFieldChange,
      record: this.currentRecord,
      fieldName,
      oldValue,
      newValue: value,
      index: this.currentRecordIndex
    });
    
    // Aplicar mudanças
    this.records = newRecords;
    this.currentRecord = newRecord;
    
    // Emitir eventos após mudança
    this.emit({
      type: DataSourceEventNames.fieldChanged,
      record: this.currentRecord,
      fieldName,
      oldValue,
      newValue: value,
      index: this.currentRecordIndex
    });
  }
  
  // Métodos para manipulação de arrays com Immer
  updateFieldArrayItem<K extends keyof T>(
    fieldName: K,
    index: number,
    updater: (draft: Draft<T[K] extends Array<infer U> ? U : never>) => void
  ): void {
    const newRecord = produce(this.currentRecord!, (draft: Draft<T>) => {
      const array = draft[fieldName] as any;
      if (Array.isArray(array) && array[index] !== undefined) {
        updater(array[index]);
      }
    });
    
    this.updateCurrentRecord(newRecord);
  }
  
  appendToFieldArray<K extends keyof T>(
    fieldName: K,
    item: T[K] extends Array<infer U> ? U : never
  ): void {
    const newRecord = produce(this.currentRecord!, (draft: Draft<T>) => {
      const array = draft[fieldName] as any;
      if (Array.isArray(array)) {
        array.push(item);
      } else {
        (draft[fieldName] as any) = [item];
      }
    });
    
    this.updateCurrentRecord(newRecord);
  }
  
  removeFromFieldArray<K extends keyof T>(fieldName: K, index: number): void {
    const newRecord = produce(this.currentRecord!, (draft: Draft<T>) => {
      const array = draft[fieldName] as any;
      if (Array.isArray(array)) {
        array.splice(index, 1);
      }
    });
    
    this.updateCurrentRecord(newRecord);
  }
  
  // Helper para atualizar registro atual
  private updateCurrentRecord(newRecord: T): void {
    const oldRecord = this.currentRecord;
    
    this.emit({
      type: DataSourceEventNames.beforeRecordChange,
      record: oldRecord!,
      newRecord,
      index: this.currentRecordIndex
    });
    
    // Atualizar de forma imutável
    this.records = produce(this.records, (draft: Draft<T[]>) => {
      draft[this.currentRecordIndex] = newRecord;
    });
    
    this.currentRecord = newRecord;
    
    this.emit({
      type: DataSourceEventNames.recordChanged,
      record: newRecord,
      oldRecord: oldRecord!,
      index: this.currentRecordIndex
    });
  }
  
  // Inserir registro com Immer
  insert(record?: Partial<T>): void {
    const newRecord = record || {} as T;
    
    // Adicionar de forma imutável
    this.records = produce(this.records, (draft: Draft<T[]>) => {
      draft.push(newRecord as T);
    });
    
    this.goToRecord(this.records.length - 1);
    this.setState(DataSourceState.INSERTING);
    
    this.emit({
      type: DataSourceEventNames.afterInsert,
      record: this.currentRecord!,
      index: this.currentRecordIndex
    });
  }
  
  // Remover registro com Immer
  async remove(id?: ID): Promise<void> {
    const recordToRemove = this.currentRecord!;
    const indexToRemove = this.currentRecordIndex;
    
    this.emit({
      type: DataSourceEventNames.beforeRemove,
      record: recordToRemove,
      index: indexToRemove
    });
    
    try {
      // Remover de forma imutável
      this.records = produce(this.records, (draft: Draft<T[]>) => {
        draft.splice(indexToRemove, 1);
      });
      
      // Ajustar índice atual
      if (this.records.length === 0) {
        this.currentRecord = null;
        this.currentRecordIndex = -1;
      } else if (indexToRemove >= this.records.length) {
        this.goToRecord(this.records.length - 1);
      } else {
        this.goToRecord(indexToRemove);
      }
      
      this.emit({
        type: DataSourceEventNames.afterRemove,
        record: recordToRemove,
        index: indexToRemove
      });
      
    } catch (error) {
      this.emit({
        type: DataSourceEventNames.onError,
        error: error.message,
        originError: error
      });
      throw error;
    }
  }
}
```

**Benefícios do ArchbaseDataSource V2**:
- Imutabilidade garantida em todas as operações
- Suporte nativo para arrays aninhados
- Melhor integração com React (sem necessidade de forceUpdate)
- Type-safety melhorado
- Performance otimizada com shallow comparisons

#### 2.6.2 ArchbaseRemoteDataSource V2 com TanStack Query

```typescript
export class ArchbaseRemoteDataSourceV2<T, ID> extends ArchbaseDataSourceV2<T, ID> {
  private queryClient?: QueryClient;
  private queryKey: QueryKey;
  
  constructor(config: ArchbaseRemoteDataSourceConfig<T, ID> & {
    queryClient?: QueryClient;
    queryKey?: QueryKey;
  }) {
    super(config);
    this.queryClient = config.queryClient;
    this.queryKey = config.queryKey || [config.name];
  }
  
  // Override save para usar TanStack Query
  async save(): Promise<T> {
    const currentRecord = this.getCurrentRecord();
    
    if (this.queryClient) {
      // Optimistic update
      this.queryClient.setQueryData(this.queryKey, (old: any) => 
        produce(old, (draft: any) => {
          if (!draft) return;
          const index = draft.content.findIndex((r: any) => r.id === currentRecord.id);
          if (index >= 0) {
            draft.content[index] = currentRecord;
          } else {
            draft.content.unshift(currentRecord);
            draft.totalElements += 1;
          }
        })
      );
    }
    
    try {
      const savedRecord = await super.save();
      
      // Atualizar cache definitivamente
      if (this.queryClient) {
        this.queryClient.setQueryData(this.queryKey, (old: any) => 
          produce(old, (draft: any) => {
            if (!draft) return;
            const index = draft.content.findIndex((r: any) => r.id === savedRecord.id);
            if (index >= 0) {
              draft.content[index] = savedRecord;
            }
          })
        );
        
        // Invalidar queries relacionadas
        this.queryClient.invalidateQueries({ 
          queryKey: [this.name], 
          exact: false 
        });
      }
      
      return savedRecord;
    } catch (error) {
      // Rollback em caso de erro
      if (this.queryClient) {
        this.queryClient.invalidateQueries(this.queryKey);
      }
      throw error;
    }
  }
  
  // Override remove para usar TanStack Query
  async remove(id?: ID): Promise<void> {
    const recordId = id || this.getCurrentRecord().id;
    const recordToRemove = this.getCurrentRecord();
    
    if (this.queryClient) {
      // Optimistic update
      this.queryClient.setQueryData(this.queryKey, (old: any) => 
        produce(old, (draft: any) => {
          if (!draft) return;
          draft.content = draft.content.filter((r: any) => r.id !== recordId);
          draft.totalElements -= 1;
        })
      );
    }
    
    try {
      if (this.service) {
        await this.service.remove(recordId);
      }
      
      // Atualizar DataSource local
      await super.remove(id);
      
    } catch (error) {
      // Rollback
      if (this.queryClient) {
        this.queryClient.invalidateQueries(this.queryKey);
      }
      throw error;
    }
  }
  
  // Método para invalidar cache
  invalidateCache(): void {
    if (this.queryClient) {
      this.queryClient.invalidateQueries(this.queryKey);
    }
  }
  
  // Método para atualizar cache manualmente
  updateCache(updater: (draft: any) => void): void {
    if (this.queryClient) {
      this.queryClient.setQueryData(this.queryKey, (old: any) => 
        produce(old, updater)
      );
    }
  }
  
  // Método para refetch dos dados
  async refetch(): Promise<void> {
    if (this.queryClient) {
      await this.queryClient.refetchQueries(this.queryKey);
    }
  }
}
```

**Benefícios do ArchbaseRemoteDataSource V2**:
- Cache inteligente com TanStack Query
- Optimistic updates automáticos
- Background synchronization
- Automatic retry em caso de falha
- Melhor performance com menos requests
- DevTools para debugging de queries

#### 2.6.3 Hook useArchbaseDataSource V2

```typescript
interface ArchbaseDataSourceConfigV2<T, ID> extends ArchbaseDataSourceConfig<T, ID> {
  useImmer?: boolean;
  enableDevTools?: boolean;
  enableLogging?: boolean;
}

export function useArchbaseDataSource<T, ID>({
  useImmer = true,
  enableDevTools = false,
  enableLogging = false,
  ...config
}: ArchbaseDataSourceConfigV2<T, ID>) {
  
  const dataSource = useMemo(() => {
    const DataSourceClass = useImmer 
      ? ArchbaseDataSourceV2 
      : ArchbaseDataSource;
    
    return new DataSourceClass<T, ID>(config);
  }, [config.name, useImmer]);
  
  // DevTools integration
  useArchbaseDataSourceDevTools(dataSource, config.name, { enabled: enableDevTools });
  
  // Logging
  useArchbaseDataSourceLogger(dataSource, { enabled: enableLogging });
  
  // Estado reativo
  const [state, setState] = useState({
    isLoading: false,
    hasErrors: false,
    currentRecord: dataSource.getCurrentRecord(),
    currentIndex: dataSource.getCurrentRecordIndex(),
    totalRecords: dataSource.getTotalRecords(),
    mode: dataSource.getState()
  });
  
  // Listener para atualizações
  useArchbaseDataSourceListener({
    dataSource,
    listener: (event) => {
      setState(prev => ({
        ...prev,
        currentRecord: dataSource.getCurrentRecord(),
        currentIndex: dataSource.getCurrentRecordIndex(),
        totalRecords: dataSource.getTotalRecords(),
        mode: dataSource.getState(),
        hasErrors: dataSource.hasErrors()
      }));
    }
  });
  
  // Cleanup
  useArchbaseWillUnmount(() => {
    dataSource.close();
  });
  
  return {
    dataSource,
    ...state,
    
    // Operações
    insert: () => dataSource.insert(),
    edit: () => dataSource.edit(),
    save: () => dataSource.save(),
    cancel: () => dataSource.cancel(),
    remove: (id?: ID) => dataSource.remove(id),
    
    // Navegação
    first: () => dataSource.first(),
    last: () => dataSource.last(),
    next: () => dataSource.next(),
    prior: () => dataSource.prior(),
    goToRecord: (index: number) => dataSource.goToRecord(index),
    
    // Estado
    isBrowsing: () => dataSource.isBrowsing(),
    isEditing: () => dataSource.isEditing(),
    isInserting: () => dataSource.isInserting()
  };
}
```

#### 2.6.4 Hook useArchbaseRemoteDataSource V2

```typescript
interface ArchbaseRemoteDataSourceConfigV2<T, ID> extends ArchbaseRemoteDataSourceConfig<T, ID> {
  useQuery?: boolean;
  useImmer?: boolean;
  queryOptions?: UseQueryOptions;
  mutationOptions?: UseMutationOptions;
  enableDevTools?: boolean;
  enableLogging?: boolean;
}

export function useArchbaseRemoteDataSource<T, ID>({
  name,
  service,
  useQuery = true,
  useImmer = true,
  queryOptions = {},
  mutationOptions = {},
  enableDevTools = false,
  enableLogging = false,
  ...config
}: ArchbaseRemoteDataSourceConfigV2<T, ID>) {
  
  const queryClient = useQueryClient();
  
  // Estado para paginação e filtros
  const [state, setState] = useState({
    page: config.currentPage || 0,
    size: config.pageSize || 50,
    filter: config.filter,
    sort: config.sort
  });
  
  // TanStack Query para fetch de dados
  const queryResult = useQuery({
    queryKey: [name, state],
    queryFn: () => service.findAllWithFilterAndSort(
      state.filter || '',
      state.page,
      state.size,
      state.sort || []
    ),
    enabled: useQuery && !!service,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    keepPreviousData: true,
    ...queryOptions
  });
  
  // Mutations para operações CRUD
  const saveMutation = useMutation({
    mutationFn: (record: T) => service.save(record),
    onMutate: async (record) => {
      // Optimistic update
      if (useQuery) {
        await queryClient.cancelQueries([name, state]);
        
        const previousData = queryClient.getQueryData([name, state]);
        
        queryClient.setQueryData([name, state], (old: any) => 
          produce(old, (draft: any) => {
            if (!draft) return;
            const index = draft.content.findIndex((r: any) => r.id === record.id);
            if (index >= 0) {
              draft.content[index] = record;
            } else {
              draft.content.unshift(record);
              draft.totalElements += 1;
            }
          })
        );
        
        return { previousData };
      }
    },
    onError: (err, record, context) => {
      // Rollback
      if (context?.previousData && useQuery) {
        queryClient.setQueryData([name, state], context.previousData);
      }
    },
    onSettled: () => {
      // Invalidar queries
      if (useQuery) {
        queryClient.invalidateQueries([name]);
      }
    },
    ...mutationOptions
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: ID) => service.remove(id),
    onMutate: async (deletedId) => {
      if (useQuery) {
        await queryClient.cancelQueries([name, state]);
        
        const previousData = queryClient.getQueryData([name, state]);
        
        queryClient.setQueryData([name, state], (old: any) => 
          produce(old, (draft: any) => {
            if (!draft) return;
            draft.content = draft.content.filter((r: any) => r.id !== deletedId);
            draft.totalElements -= 1;
          })
        );
        
        return { previousData };
      }
    },
    onError: (err, deletedId, context) => {
      if (context?.previousData && useQuery) {
        queryClient.setQueryData([name, state], context.previousData);
      }
    },
    onSettled: () => {
      if (useQuery) {
        queryClient.invalidateQueries([name]);
      }
    },
    ...mutationOptions
  });
  
  // Criar DataSource
  const dataSource = useMemo(() => {
    const DataSourceClass = useImmer 
      ? ArchbaseRemoteDataSourceV2 
      : ArchbaseRemoteDataSource;
    
    return new DataSourceClass<T, ID>({
      ...config,
      name,
      service,
      initialData: queryResult.data?.content || [],
      totalRecords: queryResult.data?.totalElements || 0,
      currentPage: state.page,
      queryClient: useQuery ? queryClient : undefined,
      queryKey: [name, state],
      
      // Integrar mutations
      customSave: saveMutation.mutateAsync,
      customRemove: deleteMutation.mutateAsync,
      
      // Integrar state management
      customApplyFilter: (filter: string) => {
        setState(prev => ({ ...prev, filter, page: 0 }));
      },
      customGoToPage: (page: number) => {
        setState(prev => ({ ...prev, page }));
      },
      customSort: (sort: string[]) => {
        setState(prev => ({ ...prev, sort }));
      }
    });
  }, [queryResult.data, state, useImmer, useQuery]);
  
  // DevTools e Logging
  useArchbaseDataSourceDevTools(dataSource, name, { enabled: enableDevTools });
  useArchbaseDataSourceLogger(dataSource, { enabled: enableLogging });
  
  // Sincronizar dados quando query muda
  useEffect(() => {
    if (queryResult.data && useQuery) {
      dataSource.setRecords(queryResult.data.content);
      dataSource.setTotalRecords(queryResult.data.totalElements);
    }
  }, [queryResult.data, dataSource]);
  
  // Estado reativo local do DataSource
  const dsState = useArchbaseDataSource({ 
    useImmer: false, // Já está sendo usado na classe
    ...config 
  });
  
  return {
    dataSource,
    
    // Estados do TanStack Query
    isLoading: queryResult.isLoading || saveMutation.isLoading || deleteMutation.isLoading,
    isError: queryResult.isError || saveMutation.isError || deleteMutation.isError,
    error: queryResult.error || saveMutation.error || deleteMutation.error,
    
    // Estados específicos
    isFetching: queryResult.isFetching,
    isSaving: saveMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    
    // Dados
    data: queryResult.data,
    
    // Operações do TanStack Query
    refetch: queryResult.refetch,
    invalidate: () => queryClient.invalidateQueries([name]),
    
    // Operações do DataSource
    ...dsState,
    
    // Controle de estado
    state,
    setState,
    
    // Métodos de paginação
    goToPage: (page: number) => setState(prev => ({ ...prev, page })),
    applyFilter: (filter: string) => setState(prev => ({ ...prev, filter, page: 0 })),
    applySort: (sort: string[]) => setState(prev => ({ ...prev, sort }))
  };
}
```

#### 2.6.5 Exemplos de Uso das Versões V2

**DataSource V2 para dados em memória**:
```typescript
const MyFormComponent = () => {
  const { dataSource, isEditing, isBrowsing } = useArchbaseDataSource<Pessoa, number>({
    name: 'formPessoa',
    useImmer: true,
    enableDevTools: true,
    initialData: [{ id: 1, nome: 'João', contatos: [] }]
  });
  
  // Manipulação imutável de arrays
  const handleAddContato = () => {
    dataSource.appendToFieldArray('contatos', {
      tipo: 'EMAIL',
      valor: '',
      principal: false
    });
  };
  
  const handleUpdateContato = (index: number, valor: string) => {
    dataSource.updateFieldArrayItem('contatos', index, (draft) => {
      draft.valor = valor;
    });
  };
  
  return (
    <Form>
      <ArchbaseEdit dataSource={dataSource} dataField="nome" />
      
      {/* Lista de contatos com edição inline */}
      {dataSource.getFieldArray('contatos').map((contato, index) => (
        <Group key={index}>
          <ArchbaseSelect
            value={contato.tipo}
            onChange={(tipo) => 
              dataSource.updateFieldArrayItem('contatos', index, (draft) => {
                draft.tipo = tipo;
              })
            }
            data={['EMAIL', 'TELEFONE']}
          />
          <ArchbaseEdit
            value={contato.valor}
            onChange={(valor) => handleUpdateContato(index, valor)}
          />
        </Group>
      ))}
      
      <Button onClick={handleAddContato}>Adicionar Contato</Button>
      <Button onClick={() => dataSource.save()} disabled={isBrowsing}>
        Salvar
      </Button>
    </Form>
  );
};
```

**RemoteDataSource V2 com cache inteligente**:
```typescript
const MyListComponent = () => {
  const {
    dataSource,
    isLoading,
    isFetching,
    isSaving,
    refetch,
    invalidate
  } = useArchbaseRemoteDataSource<Pessoa, number>({
    name: 'listPessoas',
    service: pessoaService,
    useQuery: true,
    useImmer: true,
    enableDevTools: true,
    pageSize: 20,
    queryOptions: {
      staleTime: 10 * 60 * 1000, // 10 minutos
      retry: 3
    }
  });
  
  // Filtros e paginação reativa
  const handleFilter = (filter: string) => {
    dataSource.applyFilter(filter);
  };
  
  const handleSort = (field: string) => {
    dataSource.applySort([`${field}:ASC`]);
  };
  
  return (
    <div>
      {isLoading && <Loader />}
      {isFetching && <Badge>Atualizando...</Badge>}
      
      <ArchbaseDataTable
        dataSource={dataSource}
        onFilter={handleFilter}
        onSort={handleSort}
        enableEdit
        enableRemove
      />
      
      <Group>
        <Button onClick={refetch} loading={isFetching}>
          Atualizar
        </Button>
        <Button onClick={invalidate}>
          Limpar Cache
        </Button>
        <Button 
          onClick={() => dataSource.save()} 
          loading={isSaving}
          disabled={dataSource.isBrowsing()}
        >
          Salvar
        </Button>
      </Group>
    </div>
  );
};
```

### 2.7 Performance e React Moderno

#### 2.6.1 Fine-grained Subscriptions

```typescript
// Hook que só re-renderiza quando campo específico muda
export function useArchbaseFieldSubscription<T, ID>(
  dataSource: ArchbaseDataSource<T, ID>,
  fieldName: string
) {
  const [value, setValue] = useState(() => 
    dataSource.getFieldValue(fieldName)
  );
  
  useEffect(() => {
    const listener = (event: DataSourceEvent<T>) => {
      if (event.type === DataSourceEventNames.fieldChanged &&
          event.fieldName === fieldName) {
        setValue(event.newValue);
      }
    };
    
    dataSource.addListener(listener);
    return () => dataSource.removeListener(listener);
  }, [dataSource, fieldName]);
  
  return value;
}

// Componente que só re-renderiza quando necessário
export const ArchbaseFieldRenderer = React.memo(<T, ID>({
  dataSource,
  fieldName,
  render
}: {
  dataSource: ArchbaseDataSource<T, ID>;
  fieldName: string;
  render: (value: any) => React.ReactNode;
}) => {
  const value = useArchbaseFieldSubscription(dataSource, fieldName);
  return <>{render(value)}</>;
});
```

#### 2.6.2 Suporte a Suspense

```typescript
export function useArchbaseDataSourceSuspense<T, ID>(
  config: ArchbaseDataSourceConfig<T, ID>
) {
  const [dataSource, setDataSource] = useState<ArchbaseDataSource<T, ID>>();
  
  if (!dataSource) {
    // Throw promise para Suspense
    throw new Promise((resolve) => {
      const ds = new ArchbaseDataSource(config);
      ds.open().then(() => {
        setDataSource(ds);
        resolve(ds);
      });
    });
  }
  
  return dataSource;
}

// Uso com Suspense
<Suspense fallback={<Loader />}>
  <MyComponent />
</Suspense>
```

### 2.7 DevTools e Debugging

#### 2.7.1 DevTools Extension

```typescript
// Hook para debugging
export function useArchbaseDataSourceDevTools<T, ID>(
  dataSource: ArchbaseDataSource<T, ID>,
  name: string
) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__ARCHBASE_DEVTOOLS__) {
      window.__ARCHBASE_DEVTOOLS__.register(name, dataSource);
      
      return () => {
        window.__ARCHBASE_DEVTOOLS__.unregister(name);
      };
    }
  }, [dataSource, name]);
  
  useArchbaseDataSourceListener({
    dataSource,
    listener: (event) => {
      if (typeof window !== 'undefined' && window.__ARCHBASE_DEVTOOLS__) {
        window.__ARCHBASE_DEVTOOLS__.logEvent(name, event);
      }
    }
  });
}
```

#### 2.7.2 Logging Estruturado

```typescript
export function useArchbaseDataSourceLogger<T, ID>(
  dataSource: ArchbaseDataSource<T, ID>,
  options: {
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
    includeData?: boolean;
    customLogger?: (event: DataSourceEvent<T>) => void;
  } = {}
) {
  useArchbaseDataSourceListener({
    dataSource,
    listener: (event) => {
      const logData = {
        timestamp: new Date().toISOString(),
        type: event.type,
        ...(options.includeData && { data: event })
      };
      
      if (options.customLogger) {
        options.customLogger(event);
      } else {
        console.log('[DataSource]', logData);
      }
    }
  });
}
```

### 2.8 Estratégia Abrangente de Testes

#### 2.8.1 Arquitetura de Testes

**Stack de Testes Recomendada**:
```json
{
  "dependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.3.1",
    "jest-environment-jsdom": "^29.3.1",
    "msw": "^0.49.2",
    "@testing-library/react-hooks": "^8.0.1"
  }
}
```

**Estrutura de Testes**:
```
src/
├── __tests__/
│   ├── datasource/
│   │   ├── ArchbaseDataSource.test.ts
│   │   ├── ArchbaseDataSourceV2.test.ts
│   │   ├── ArchbaseRemoteDataSource.test.ts
│   │   └── ArchbaseRemoteDataSourceV2.test.ts
│   ├── hooks/
│   │   ├── useArchbaseDataSource.test.ts
│   │   ├── useArchbaseRemoteDataSource.test.ts
│   │   └── useArchbaseNestedDataSource.test.ts
│   ├── components/
│   │   ├── editors/
│   │   │   ├── ArchbaseEdit.test.tsx
│   │   │   ├── ArchbaseEditV2.test.tsx
│   │   │   └── ...
│   │   ├── templates/
│   │   │   ├── ArchbaseFormTemplate.test.tsx
│   │   │   ├── ArchbaseNestedListTemplate.test.tsx
│   │   │   └── ...
│   │   └── wrappers/
│   │       ├── createArchbaseWrapper.test.tsx
│   │       └── ...
│   ├── integration/
│   │   ├── datasource-components.test.tsx
│   │   ├── v1-v2-compatibility.test.tsx
│   │   └── performance.test.tsx
│   └── utils/
│       ├── test-utils.tsx
│       ├── mock-datasource.ts
│       └── test-data.ts
```

#### 2.8.2 Mock DataSource para Testes

```typescript
// src/__tests__/utils/mock-datasource.ts
export function createMockDataSource<T, ID>(
  initialData: T[] = [],
  config: Partial<ArchbaseDataSourceConfig<T, ID>> = {}
): ArchbaseDataSource<T, ID> {
  const mockDataSource = new ArchbaseDataSource({
    records: initialData,
    ...config
  });
  
  // Adicionar métodos de teste
  (mockDataSource as any).__test__ = {
    getEvents: () => mockDataSource.__events__ || [],
    clearEvents: () => mockDataSource.__events__ = [],
    simulate: (event: DataSourceEvent<T>) => {
      mockDataSource.emit(event);
    },
    getListenerCount: () => mockDataSource.__listeners__?.length || 0
  };
  
  return mockDataSource;
}

// Mock para RemoteDataSource
export function createMockRemoteDataSource<T, ID>(
  initialData: T[] = [],
  config: Partial<ArchbaseRemoteDataSourceConfig<T, ID>> = {}
): ArchbaseRemoteDataSource<T, ID> {
  const mockService = createMockService(initialData);
  
  return new ArchbaseRemoteDataSource({
    service: mockService,
    records: initialData,
    ...config
  });
}

// Mock Service com MSW integration
export function createMockService<T, ID>(data: T[]): ArchbaseRemoteApiService<T, ID> {
  return {
    findAll: jest.fn().mockResolvedValue({ 
      content: data, 
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length
    }),
    findAllWithSort: jest.fn().mockImplementation((page, size, sort) => 
      Promise.resolve({ 
        content: data.slice(page * size, (page + 1) * size), 
        totalElements: data.length 
      })
    ),
    findAllWithFilter: jest.fn().mockImplementation((filter, page, size) => 
      Promise.resolve({ 
        content: data.filter(item => JSON.stringify(item).includes(filter)), 
        totalElements: data.length 
      })
    ),
    findAllWithFilterAndSort: jest.fn().mockResolvedValue({ 
      content: data, 
      totalElements: data.length 
    }),
    findOne: jest.fn().mockImplementation((id) => 
      Promise.resolve(data.find(item => (item as any).id === id))
    ),
    save: jest.fn().mockImplementation((record) => Promise.resolve(record)),
    remove: jest.fn().mockResolvedValue(undefined),
    removeMultiple: jest.fn().mockResolvedValue(undefined)
  };
}

// Helpers para testes
export const DataSourceTestUtils = {
  waitForEvent: async <T>(
    dataSource: ArchbaseDataSource<T, any>,
    eventType: string,
    timeout = 1000
  ): Promise<DataSourceEvent<T>> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timeout waiting for event: ${eventType}`)), timeout);
      
      const listener = (event: DataSourceEvent<T>) => {
        if (event.type === eventType) {
          clearTimeout(timer);
          dataSource.removeListener(listener);
          resolve(event);
        }
      };
      
      dataSource.addListener(listener);
    });
  },
  
  waitForFieldChange: async <T>(
    dataSource: ArchbaseDataSource<T, any>,
    fieldName: string,
    timeout = 1000
  ) => {
    return DataSourceTestUtils.waitForEvent(dataSource, DataSourceEventNames.fieldChanged, timeout);
  },
  
  simulateUserInput: async (element: HTMLElement, value: string) => {
    const user = userEvent.setup();
    await user.clear(element);
    await user.type(element, value);
  },
  
  expectDataSourceState: (dataSource: ArchbaseDataSource<any, any>, expectedState: {
    currentIndex?: number;
    totalRecords?: number;
    state?: DataSourceState;
    hasErrors?: boolean;
  }) => {
    if (expectedState.currentIndex !== undefined) {
      expect(dataSource.getCurrentRecordIndex()).toBe(expectedState.currentIndex);
    }
    if (expectedState.totalRecords !== undefined) {
      expect(dataSource.getTotalRecords()).toBe(expectedState.totalRecords);
    }
    if (expectedState.state !== undefined) {
      expect(dataSource.getState()).toBe(expectedState.state);
    }
    if (expectedState.hasErrors !== undefined) {
      expect(dataSource.hasErrors()).toBe(expectedState.hasErrors);
    }
  }
};
```

#### 2.8.3 Test Utilities e Setup

```typescript
// src/__tests__/utils/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Setup para componentes com Mantine
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, cacheTime: 0 },
      mutations: { retry: false }
    }
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock para localStorage
export const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockLocalStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  })
};

// Dados de teste padronizados
export const createTestData = {
  pessoa: (overrides: Partial<Pessoa> = {}): Pessoa => ({
    id: Math.floor(Math.random() * 1000),
    nome: 'João Silva',
    email: 'joao@test.com',
    idade: 30,
    ativo: true,
    dataNascimento: new Date('1990-01-01'),
    endereco: {
      rua: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      cep: '01234-567'
    },
    contatos: [
      { tipo: 'EMAIL', valor: 'joao@test.com', principal: true },
      { tipo: 'TELEFONE', valor: '(11) 99999-9999', principal: false }
    ],
    ...overrides
  }),
  
  pessoaList: (count: number = 5): Pessoa[] => 
    Array.from({ length: count }, (_, i) => createTestData.pessoa({ 
      id: i + 1, 
      nome: `Pessoa ${i + 1}`,
      email: `pessoa${i + 1}@test.com`
    }))
};
```

#### 2.8.4 Testes para DataSource Core

```typescript
// src/__tests__/datasource/ArchbaseDataSource.test.ts
describe('ArchbaseDataSource', () => {
  let dataSource: ArchbaseDataSource<Pessoa, number>;
  let testData: Pessoa[];
  
  beforeEach(() => {
    testData = createTestData.pessoaList(3);
    dataSource = createMockDataSource(testData);
  });
  
  afterEach(() => {
    dataSource.close();
  });
  
  describe('Basic Operations', () => {
    test('should initialize with correct data', () => {
      expect(dataSource.getTotalRecords()).toBe(3);
      expect(dataSource.getCurrentRecordIndex()).toBe(0);
      expect(dataSource.getCurrentRecord()).toEqual(testData[0]);
    });
    
    test('should navigate between records', () => {
      dataSource.next();
      expect(dataSource.getCurrentRecordIndex()).toBe(1);
      expect(dataSource.getCurrentRecord()).toEqual(testData[1]);
      
      dataSource.prior();
      expect(dataSource.getCurrentRecordIndex()).toBe(0);
    });
    
    test('should handle field changes', async () => {
      const eventPromise = DataSourceTestUtils.waitForFieldChange(dataSource, 'nome');
      
      dataSource.setFieldValue('nome', 'Novo Nome');
      
      const event = await eventPromise;
      expect(event.newValue).toBe('Novo Nome');
      expect(dataSource.getFieldValue('nome')).toBe('Novo Nome');
    });
  });
  
  describe('CRUD Operations', () => {
    test('should insert new record', () => {
      const initialCount = dataSource.getTotalRecords();
      dataSource.insert({ nome: 'Nova Pessoa' } as Pessoa);
      
      expect(dataSource.getTotalRecords()).toBe(initialCount + 1);
      expect(dataSource.isInserting()).toBe(true);
      expect(dataSource.getFieldValue('nome')).toBe('Nova Pessoa');
    });
    
    test('should edit existing record', () => {
      dataSource.edit();
      expect(dataSource.isEditing()).toBe(true);
      
      dataSource.setFieldValue('nome', 'Nome Editado');
      expect(dataSource.getFieldValue('nome')).toBe('Nome Editado');
    });
    
    test('should cancel changes', () => {
      const originalNome = dataSource.getFieldValue('nome');
      dataSource.edit();
      dataSource.setFieldValue('nome', 'Nome Temporário');
      dataSource.cancel();
      
      expect(dataSource.getFieldValue('nome')).toBe(originalNome);
      expect(dataSource.isBrowsing()).toBe(true);
    });
  });
  
  describe('Validation', () => {
    test('should handle field errors', () => {
      dataSource.setFieldError('email', 'Email inválido');
      expect(dataSource.getFieldError('email')).toBe('Email inválido');
      expect(dataSource.hasErrors()).toBe(true);
    });
    
    test('should clear field errors', () => {
      dataSource.setFieldError('email', 'Email inválido');
      dataSource.clearFieldError('email');
      expect(dataSource.getFieldError('email')).toBeUndefined();
      expect(dataSource.hasErrors()).toBe(false);
    });
  });
  
  describe('Events', () => {
    test('should emit and receive events', async () => {
      const events: DataSourceEvent<Pessoa>[] = [];
      dataSource.addListener((event) => events.push(event));
      
      dataSource.setFieldValue('nome', 'Teste Evento');
      
      await waitFor(() => {
        expect(events).toHaveLength(1);
        expect(events[0].type).toBe(DataSourceEventNames.fieldChanged);
      });
    });
    
    test('should remove listeners properly', () => {
      const listener = jest.fn();
      dataSource.addListener(listener);
      dataSource.removeListener(listener);
      
      dataSource.setFieldValue('nome', 'Teste');
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
```

#### 2.8.5 Testes para DataSource V2 (Immer)

```typescript
// src/__tests__/datasource/ArchbaseDataSourceV2.test.ts
describe('ArchbaseDataSourceV2 (Immer)', () => {
  let dataSource: ArchbaseDataSourceV2<Pessoa, number>;
  let testData: Pessoa[];
  
  beforeEach(() => {
    testData = createTestData.pessoaList(1);
    dataSource = new ArchbaseDataSourceV2({ records: testData });
  });
  
  describe('Immutability', () => {
    test('should not mutate original data on field change', () => {
      const originalRecord = dataSource.getCurrentRecord();
      const originalRecords = dataSource.browseRecords();
      
      dataSource.setFieldValue('nome', 'Novo Nome');
      
      // Original data should remain unchanged
      expect(originalRecord.nome).not.toBe('Novo Nome');
      expect(originalRecords[0]).toBe(originalRecord);
      
      // New data should have changes
      expect(dataSource.getCurrentRecord().nome).toBe('Novo Nome');
      expect(dataSource.getCurrentRecord()).not.toBe(originalRecord);
    });
    
    test('should not mutate original array on record changes', () => {
      const originalRecords = dataSource.browseRecords();
      
      dataSource.insert({ nome: 'Nova Pessoa' } as Pessoa);
      
      expect(originalRecords).toHaveLength(1);
      expect(dataSource.browseRecords()).toHaveLength(2);
      expect(dataSource.browseRecords()).not.toBe(originalRecords);
    });
  });
  
  describe('Nested Arrays', () => {
    test('should handle appendToFieldArray immutably', () => {
      const originalContatos = dataSource.getFieldValue('contatos');
      const novoContato = { tipo: 'TELEFONE', valor: '123456789', principal: false };
      
      dataSource.appendToFieldArray('contatos', novoContato);
      
      expect(originalContatos).toHaveLength(2);
      expect(dataSource.getFieldValue('contatos')).toHaveLength(3);
      expect(dataSource.getFieldValue('contatos')).not.toBe(originalContatos);
      expect(dataSource.getFieldValue('contatos')[2]).toEqual(novoContato);
    });
    
    test('should handle updateFieldArrayItem immutably', () => {
      const originalContatos = dataSource.getFieldValue('contatos');
      
      dataSource.updateFieldArrayItem('contatos', 0, (draft) => {
        draft.valor = 'novo@email.com';
      });
      
      expect(originalContatos[0].valor).not.toBe('novo@email.com');
      expect(dataSource.getFieldValue('contatos')[0].valor).toBe('novo@email.com');
      expect(dataSource.getFieldValue('contatos')).not.toBe(originalContatos);
    });
    
    test('should handle removeFromFieldArray immutably', () => {
      const originalContatos = dataSource.getFieldValue('contatos');
      
      dataSource.removeFromFieldArray('contatos', 0);
      
      expect(originalContatos).toHaveLength(2);
      expect(dataSource.getFieldValue('contatos')).toHaveLength(1);
      expect(dataSource.getFieldValue('contatos')).not.toBe(originalContatos);
    });
  });
  
  describe('Dot notation support', () => {
    test('should handle nested field changes', () => {
      dataSource.setFieldValue('endereco.cidade', 'Rio de Janeiro');
      
      expect(dataSource.getFieldValue('endereco.cidade')).toBe('Rio de Janeiro');
      expect(dataSource.getCurrentRecord().endereco.cidade).toBe('Rio de Janeiro');
    });
  });
});
```

#### 2.8.6 Testes para Components

```typescript
// src/__tests__/components/editors/ArchbaseEdit.test.tsx
describe('ArchbaseEdit', () => {
  let dataSource: ArchbaseDataSource<Pessoa, number>;
  let testData: Pessoa[];
  
  beforeEach(() => {
    testData = createTestData.pessoaList(1);
    dataSource = createMockDataSource(testData);
  });
  
  afterEach(() => {
    dataSource.close();
  });
  
  test('should render with datasource value', () => {
    render(
      <ArchbaseEdit 
        dataSource={dataSource} 
        dataField="nome" 
        label="Nome"
      />
    );
    
    const input = screen.getByLabelText('Nome') as HTMLInputElement;
    expect(input.value).toBe(testData[0].nome);
  });
  
  test('should update datasource on user input', async () => {
    render(
      <ArchbaseEdit 
        dataSource={dataSource} 
        dataField="nome" 
        label="Nome"
      />
    );
    
    const input = screen.getByLabelText('Nome');
    await DataSourceTestUtils.simulateUserInput(input, 'Novo Nome');
    
    expect(dataSource.getFieldValue('nome')).toBe('Novo Nome');
  });
  
  test('should update UI when datasource changes', async () => {
    render(
      <ArchbaseEdit 
        dataSource={dataSource} 
        dataField="nome" 
        label="Nome"
      />
    );
    
    const input = screen.getByLabelText('Nome') as HTMLInputElement;
    
    act(() => {
      dataSource.setFieldValue('nome', 'Nome do DataSource');
    });
    
    await waitFor(() => {
      expect(input.value).toBe('Nome do DataSource');
    });
  });
  
  test('should be readonly when datasource is browsing', () => {
    render(
      <ArchbaseEdit 
        dataSource={dataSource} 
        dataField="nome" 
        label="Nome"
      />
    );
    
    const input = screen.getByLabelText('Nome') as HTMLInputElement;
    expect(input.readOnly).toBe(true); // DataSource starts in browsing mode
    
    act(() => {
      dataSource.edit();
    });
    
    expect(input.readOnly).toBe(false);
  });
  
  test('should display field errors', async () => {
    render(
      <ArchbaseEdit 
        dataSource={dataSource} 
        dataField="email" 
        label="Email"
      />
    );
    
    act(() => {
      dataSource.setFieldError('email', 'Email inválido');
    });
    
    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });
  
  test('should call onChangeValue callback', async () => {
    const onChangeValue = jest.fn();
    
    render(
      <ArchbaseEdit 
        dataSource={dataSource} 
        dataField="nome" 
        label="Nome"
        onChangeValue={onChangeValue}
      />
    );
    
    const input = screen.getByLabelText('Nome');
    await DataSourceTestUtils.simulateUserInput(input, 'Novo Nome');
    
    expect(onChangeValue).toHaveBeenCalledWith('Novo Nome', expect.any(Object));
  });
});
```

#### 2.8.7 Testes de Integração V1/V2

```typescript
// src/__tests__/integration/v1-v2-compatibility.test.tsx
describe('V1/V2 Compatibility', () => {
  test('should work with same components', () => {
    const dataV1 = createTestData.pessoaList(1);
    const dataV2 = createTestData.pessoaList(1);
    
    const dsV1 = new ArchbaseDataSource({ records: dataV1 });
    const dsV2 = new ArchbaseDataSourceV2({ records: dataV2 });
    
    const { rerender } = render(
      <ArchbaseEdit dataSource={dsV1} dataField="nome" label="Nome V1" />
    );
    
    expect(screen.getByDisplayValue(dataV1[0].nome)).toBeInTheDocument();
    
    rerender(
      <ArchbaseEdit dataSource={dsV2} dataField="nome" label="Nome V2" />
    );
    
    expect(screen.getByDisplayValue(dataV2[0].nome)).toBeInTheDocument();
  });
  
  test('should maintain same API surface', () => {
    const dsV1 = new ArchbaseDataSource({ records: [] });
    const dsV2 = new ArchbaseDataSourceV2({ records: [] });
    
    // Both should have same methods
    expect(typeof dsV1.setFieldValue).toBe('function');
    expect(typeof dsV2.setFieldValue).toBe('function');
    expect(typeof dsV1.getFieldValue).toBe('function');
    expect(typeof dsV2.getFieldValue).toBe('function');
    expect(typeof dsV1.addListener).toBe('function');
    expect(typeof dsV2.addListener).toBe('function');
  });
});
```

#### 2.8.8 Testes de Performance

```typescript
// src/__tests__/integration/performance.test.tsx
describe('Performance Tests', () => {
  test('should handle large datasets efficiently', () => {
    const largeDataset = createTestData.pessoaList(1000);
    const dataSource = createMockDataSource(largeDataset);
    
    const startTime = performance.now();
    
    render(
      <ArchbaseDataTable dataSource={dataSource}>
        <Column field="nome" title="Nome" />
        <Column field="email" title="Email" />
      </ArchbaseDataTable>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render large dataset in under 100ms
    expect(renderTime).toBeLessThan(100);
  });
  
  test('should not cause memory leaks', () => {
    const dataSource = createMockDataSource(createTestData.pessoaList(10));
    
    const { unmount } = render(
      <ArchbaseEdit dataSource={dataSource} dataField="nome" />
    );
    
    const initialListenerCount = (dataSource as any).__test__.getListenerCount();
    
    unmount();
    
    const finalListenerCount = (dataSource as any).__test__.getListenerCount();
    
    // Should remove listeners on unmount
    expect(finalListenerCount).toBeLessThan(initialListenerCount);
  });
});
```

## 3. Alternativas Modernas Avaliadas

### 3.1 React Query/TanStack Query

**Vantagens**:
- Cache inteligente
- Sincronização automática
- Optimistic updates
- Background refetch

**Desvantagens**:
- Não tem conceito de "registro atual"
- Sem navegação built-in
- Focado em server state

### 3.2 Zustand com Immer

**Vantagens**:
- Imutabilidade com sintaxe simples
- Performance otimizada
- TypeScript friendly

**Desvantagens**:
- Sem funcionalidades específicas para forms
- Sem validação integrada

### 3.3 Redux Toolkit + RTK Query

**Vantagens**:
- Ecosystem maduro
- DevTools excelentes
- Padrões estabelecidos

**Desvantagens**:
- Complexidade alta
- Boilerplate significativo
- Curva de aprendizado

### 3.4 SWR

**Vantagens**:
- Simples e leve
- Bom cache
- React-first

**Desvantagens**:
- Limitado para casos complexos
- Sem estado de edição

## 4. Plano de Implementação

### 4.1 Fase 1: Melhorias de Base (2-3 sprints)

**Prioridade Alta**:
1. Hooks utilitários (`useArchbaseFieldValue`, `useArchbaseFieldError`, `useArchbaseIsReadOnly`)
2. Métodos utilitários para arrays na classe DataSource
3. Factory function para criar wrappers
4. Sistema de logging melhorado

**Critérios de Sucesso**:
- Redução de 50% no uso de `forceUpdate()` em componentes existentes
- API mais intuitiva para manipulação de arrays
- Facilidade para criar novos wrappers

### 4.1.1 Fase 1.5: Preparação para Versões V2 (1-2 sprints)

**Prioridade Alta**:
1. Instalar e configurar dependências (Immer, TanStack Query)
2. Criar interfaces e tipos para versões V2
3. Estrutura base para ArchbaseDataSourceV2 e ArchbaseRemoteDataSourceV2
4. Configuração de testes para novas funcionalidades

**Critérios de Sucesso**:
- Infraestrutura pronta para desenvolvimento das versões V2
- Documentação de migração inicial
- Ambiente de testes configurado

### 4.2 Fase 2: Componentes e Wrappers (2-3 sprints)

**Prioridade Alta**:
1. Wrappers para componentes Mantine mais usados
2. Componente `ArchbaseNestedList`
3. Hook `useArchbaseNestedDataSource`
4. Componente `ArchbaseMasterDetail`

**Critérios de Sucesso**:
- Redução de 70% no código boilerplate para componentes externos
- Padrão consistente para listas aninhadas
- Facilidade para cenários master-detail

### 4.2.1 Fase 2.5: Revisão de Componentes Existentes (2-3 sprints)

**Levantamento Completo**: Identificados **95+ componentes** que usam DataSource na biblioteca.

#### **Alta Prioridade (Críticos)**
1. **ArchbaseEdit.tsx** - Base para todos os editores
2. **ArchbaseFormTemplate.tsx** - Template principal para formulários  
3. **archbase-data-grid.tsx** - Grid principal da biblioteca
4. **useArchbaseDataSource.ts** - Hook core
5. **useArchbaseDataSourceListener.ts** - Hook de eventos

#### **Média Prioridade (Importantes)**
6. **ArchbaseDatePickerEdit.tsx** / **ArchbaseDateTimePickerEdit.tsx**
7. **ArchbaseSelect.tsx** / **ArchbaseAsyncSelect.tsx** 
8. **ArchbaseList.tsx**
9. **ArchbaseSecurityView.tsx**
10. **useArchbaseLocalFilterDataSource.ts**

#### **Componentes por Categoria Identificados**

**Editores (22 componentes principais)**:
- Editores básicos: Edit, TextArea, NumberEdit, MaskEdit, PasswordEdit, TimeEdit
- Data/Tempo: DatePickerEdit, DateTimePickerEdit, DateTimePickerRange
- Seleção: Select, AsyncSelect, AsyncMultiSelect, LookupSelect, LookupEdit
- Especializados: Checkbox, Switch, RadioGroup, Rating, RichTextEdit, JsonEdit

**Templates (9 componentes)**:
- FormTemplate, FormModalTemplate, GridTemplate, TableTemplate
- PanelTemplate, MasonryTemplate, SpaceTemplate
- ModalTemplate, SearchTemplate

**Hooks (6 hooks relacionados)**:
- useArchbaseDataSource, useArchbaseDataSourceListener
- useArchbaseLocalFilterDataSource, useArchbaseRemoteDataSource
- useArchbaseRemoteFilterDataSource

**Visualização (8 componentes)**:
- ArchbaseDataTable, archbase-data-grid, ArchbaseList
- ArchbaseMasonry, use-grid-data hooks

**Segurança (8 componentes)**:
- ArchbaseSecurityView, ApiTokenView, UserModal, GroupModal
- ProfileModal, ApiTokenModal, PermissionsSelectorModal

#### **Melhorias Necessárias para Compatibilidade V2**

**1. Padronização de Interface**:
```typescript
// Padronizar todas as interfaces para:
interface ArchbaseDataSourceProps<T, ID> {
  dataSource?: ArchbaseDataSource<T, ID>;
  dataField?: string;
  onChangeValue?: (value: any, event: any) => void;
  onFocusEnter?: FocusEventHandler<any>;
  onFocusExit?: FocusEventHandler<any>;
}
```

**2. Performance**:
- Substituir `forceUpdate()` por hooks apropriados
- Implementar memoização com `React.memo` onde necessário
- Otimizar listeners de DataSource

**3. Type Safety**:
- Melhorar tipagem com generics consistentes
- Eliminar `any` types onde possível
- Adicionar validação em tempo de compilação

**4. Compatibilidade V2**:
- Suporte a Immer para imutabilidade
- Integração com TanStack Query para componentes remotos
- Manter compatibilidade total com V1

**Critérios de Sucesso Fase 2.5**:
- 100% dos componentes críticos (alta prioridade) revisados
- 80% dos componentes importantes (média prioridade) revisados  
- Redução de 60% no uso de `forceUpdate()`
- Padronização completa das interfaces DataSource
- Zero breaking changes para usuários finais

### 4.2.2 Fase 2.6: Implementação das Versões V2 (3-4 sprints)

**Prioridade Alta**:
1. **ArchbaseDataSourceV2** com Immer
   - Implementação da classe base com imutabilidade
   - Métodos para arrays aninhados (`updateFieldArrayItem`, `appendToFieldArray`, `removeFromFieldArray`)
   - Sistema de eventos melhorado
   - Testes unitários completos

2. **ArchbaseRemoteDataSourceV2** com TanStack Query
   - Extensão da V2 com integração TanStack Query
   - Optimistic updates automáticos
   - Cache management
   - Background synchronization

3. **Hooks V2**
   - `useArchbaseDataSource` V2 com suporte a Immer
   - `useArchbaseRemoteDataSource` V2 com TanStack Query
   - Configuração opt-in para versões V2
   - DevTools e logging integrados

4. **Componentes V2 (Críticos)**
   - `ArchbaseEditV2` - Versão com Immer integrado
   - `ArchbaseFormTemplateV2` - Template com cache inteligente
   - Migração gradual dos 5 componentes de alta prioridade

**Critérios de Sucesso Fase 2.6**:
- 100% de compatibilidade com versões V1
- Performance 40% melhor em cenários com arrays aninhados
- Redução de 80% no uso de `forceUpdate()`
- Cache funcionando corretamente com background updates
- Optimistic updates funcionando em operações CRUD
- 5 componentes críticos funcionando com V2

### 4.2.3 Fase de Testes Abrangentes (1-2 sprints paralelos)

**Esta fase acontece em paralelo com todas as outras fases para garantir qualidade**

#### **Setup de Testes (Sprint inicial)**

**Infraestrutura**:
1. **Test Utilities**: Criar helpers e mocks padronizados
2. **Mock DataSource**: Sistema completo para testes isolados
3. **Test Data**: Dados de teste padronizados e reutilizáveis
4. **CI/CD Integration**: Testes automáticos em todas as PRs

**Configuração**:
```bash
# Dependências de teste
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event jest-environment-jsdom
npm install --save-dev msw @testing-library/react-hooks
```

#### **Tipos de Testes por Categoria**

**1. Testes Unitários (DataSource Core)**
- ✅ `ArchbaseDataSource.test.ts` - 50+ testes básicos
- ✅ `ArchbaseDataSourceV2.test.ts` - 30+ testes de imutabilidade  
- ✅ `ArchbaseRemoteDataSource.test.ts` - 40+ testes de API
- ✅ `ArchbaseRemoteDataSourceV2.test.ts` - 25+ testes de cache

**2. Testes de Hooks**
- ✅ `useArchbaseDataSource.test.ts` - Lifecycle e estado
- ✅ `useArchbaseRemoteDataSource.test.ts` - Integração TanStack Query
- ✅ `useArchbaseNestedDataSource.test.ts` - Hierarquias

**3. Testes de Componentes (95+ componentes)**
- ✅ **Alta Prioridade (5 componentes)**: 100% de cobertura
- ✅ **Média Prioridade (10 componentes)**: 90% de cobertura
- ✅ **Baixa Prioridade**: 70% de cobertura

**4. Testes de Integração**
- ✅ **V1/V2 Compatibility**: Garantir zero breaking changes
- ✅ **DataSource + Components**: Fluxo completo de dados
- ✅ **Performance**: Benchmarks automatizados
- ✅ **Memory Leaks**: Detecção de vazamentos

#### **Estratégia de Cobertura de Testes**

```typescript
// Cobertura por tipo
{
  "DataSource Core": "95%",      // Classes fundamentais
  "Hooks": "90%",                // Lógica de negócio
  "Componentes Críticos": "100%", // ArchbaseEdit, FormTemplate, etc
  "Componentes Importantes": "90%", // Editores principais
  "Componentes Auxiliares": "70%",  // Funcionalidades secundárias
  "Integration": "85%",           // Fluxos end-to-end
  "Performance": "100%"           // Benchmarks obrigatórios
}
```

#### **Testes Automatizados Críticos**

**1. Regression Tests**:
```typescript
// Executar antes de cada release
describe('Regression Tests V2', () => {
  test('V1 components still work unchanged');
  test('V2 provides same API surface as V1');
  test('Performance benchmarks meet targets');
  test('No memory leaks in long-running apps');
  test('Cache invalidation works correctly');
});
```

**2. Compatibility Matrix**:
```typescript
// Testar todas as combinações
[
  { ds: 'V1', component: 'ArchbaseEdit' },
  { ds: 'V2', component: 'ArchbaseEdit' },
  { ds: 'V1', component: 'ArchbaseSelect' },
  { ds: 'V2', component: 'ArchbaseSelect' },
  // ... todos os componentes críticos
].forEach(combination => {
  test(`${combination.ds} + ${combination.component} compatibility`);
});
```

**3. Performance Benchmarks**:
```typescript
describe('Performance Benchmarks', () => {
  test('Large dataset (1000 records) renders in <100ms');
  test('Field changes update in <16ms (60fps)');
  test('Cache hit rate >85% for repeated queries');
  test('Memory usage stable over 1000 operations');
});
```

#### **Métricas de Qualidade por Fase**

**Fase 1 (Melhorias Base)**:
- ✅ 80% cobertura nos hooks utilitários
- ✅ Regression tests para factory function
- ✅ Performance benchmarks baseline

**Fase 2.5 (Revisão Componentes)**:
- ✅ 100% dos componentes críticos testados
- ✅ Compatibility matrix 100% verde
- ✅ Zero breaking changes verificados

**Fase 2.6 (V2 Implementation)**:
- ✅ 95% cobertura nas classes V2
- ✅ Immutability tests 100% passando
- ✅ TanStack Query integration 100% testada
- ✅ Performance targets atingidos

**Fase 3 (Funcionalidades Avançadas)**:
- ✅ Schema validation 90% coberta
- ✅ DevTools 80% testadas
- ✅ Suspense integration validada

#### **Gates de Qualidade**

**Antes de cada release**:
1. **Cobertura geral >85%** em todas as categorias
2. **Zero regressões** em testes existentes
3. **Performance benchmarks** dentro dos targets
4. **Compatibility matrix** 100% verde
5. **Memory leak tests** passando
6. **Manual testing** dos 5 componentes críticos

**Automação CI/CD**:
```yaml
# .github/workflows/tests.yml
- name: Unit Tests
  run: npm run test:unit
- name: Integration Tests  
  run: npm run test:integration
- name: Performance Tests
  run: npm run test:performance
- name: Coverage Report
  run: npm run test:coverage
- name: Compatibility Tests
  run: npm run test:compatibility
```

#### **Cronograma de Testes**

**Sprint 1**: Setup + Testes DataSource Core
**Sprint 2**: Testes Hooks + Componentes Críticos  
**Sprint 3**: Testes V2 + Integration Tests
**Sprint 4**: Performance + Compatibility Matrix
**Contínuo**: Regression tests em cada PR

**Critérios de Sucesso da Fase de Testes**:
- 📊 **85%+ cobertura geral** de testes
- 🔄 **100% compatibilidade** V1/V2 verificada
- 🚀 **Performance targets** atingidos e documentados
- 🛡️ **Zero regressões** detectadas
- 🧠 **Memory leak protection** implementada
- ⚡ **CI/CD pipeline** com gates de qualidade
- 📝 **Test documentation** completa para novos devs

### 4.3 Fase 3: Funcionalidades Avançadas (3-4 sprints)

**Prioridade Média**:
1. Sistema de validação com schema
2. Hook `useArchbaseCoordinatedDataSources`
3. Suporte a Suspense
4. DevTools extension

**Critérios de Sucesso**:
- Validação declarativa e type-safe
- Coordenação automática entre múltiplos DataSources
- Melhor experiência de debugging

### 4.4 Fase 4: Performance e React Moderno (2-3 sprints)

**Prioridade Baixa**:
1. Fine-grained subscriptions
2. Otimizações de re-render
3. Suporte a Server Components
4. Concurrent features

**Critérios de Sucesso**:
- Performance melhorada em 40%
- Compatibilidade com React 18+
- Suporte a SSR/RSC

## 5. Compatibilidade e Migração

### 5.1 Estratégia de Compatibilidade

- **100% backward compatible**: Código existente continua funcionando
- **Opt-in gradual**: Desenvolvedores podem adotar melhorias incrementalmente
- **Deprecation warnings**: Avisos para práticas desatualizadas
- **Migration guides**: Documentação detalhada de migração

### 5.2 Exemplos de Migração

#### Antes (Código Atual):
```typescript
// Manipulação manual de arrays
const regras = dataSource.getFieldValue('regras') || [];
regras.push(novaRegra);
dataSource.setFieldValue('regras', regras);
forceUpdate();

// Wrapper manual para Select
<Select
  value={dataSource.getFieldValue('status')}
  onChange={(value) => {
    dataSource.setFieldValue('status', value);
    forceUpdate();
  }}
  error={dataSource.getFieldError('status')}
  disabled={dataSource.isBrowsing()}
/>
```

#### Depois (Com Melhorias):
```typescript
// API simplificada para arrays
dataSource.appendToFieldArray('regras', novaRegra);

// Wrapper automático
<ArchbaseSelect
  dataSource={dataSource}
  dataField="status"
/>
```

## 6. Métricas de Sucesso

### 6.1 Métricas Técnicas

- **Redução de Boilerplate**: -70% no código para componentes externos
- **Performance**: -40% em re-renders desnecessários
- **Type Safety**: 100% coverage em APIs públicas
- **Bundle Size**: Impacto <10% no tamanho do bundle

**Métricas Específicas das Versões V2**:
- **Imutabilidade**: 100% das operações utilizando Immer nas versões V2
- **Cache Hit Rate**: >85% de cache hits com TanStack Query
- **Background Sync**: <2s para sincronização em background
- **Optimistic Updates**: <100ms para feedback visual de operações
- **Memory Usage**: Redução de 30% no uso de memória com cache inteligente

### 6.2 Métricas de Developer Experience

- **Time to Market**: -50% no tempo para implementar forms complexos
- **Learning Curve**: Onboarding 30% mais rápido para novos devs
- **Bug Reduction**: -60% em bugs relacionados a sincronização de estado
- **Developer Satisfaction**: Score >8/10 em pesquisas internas

**Métricas Específicas das Versões V2**:
- **Arrays Aninhados**: -80% no código necessário para manipular arrays
- **forceUpdate Usage**: -90% na necessidade de usar forceUpdate()
- **Debug Time**: -50% no tempo para debuggar problemas de estado
- **DevTools Usage**: >70% dos devs usando as novas ferramentas de debug

### 6.3 Métricas de Adoção

- **Migration Rate**: >80% dos projetos ativos usando novas APIs em 6 meses
- **Community Feedback**: Score >4.5/5 em issues e discussions
- **Documentation Usage**: Aumento de 200% no acesso à documentação

**Métricas de Adoção V2**:
- **V2 Adoption Rate**: >50% dos novos projetos usando versões V2 em 3 meses
- **Migration Success**: >95% de sucesso na migração V1 → V2
- **Performance Improvement Reports**: >90% dos projetos reportando melhorias
- **V2 Feature Usage**: >80% dos projetos V2 usando pelo menos 3 features novas

## 7. Riscos e Mitigações

### 7.1 Riscos Técnicos

**Risco**: Breaking changes acidentais
**Mitigação**: Test suite abrangente, CI/CD rigoroso, beta releases

**Risco**: Performance regression
**Mitigação**: Benchmarks automatizados, profiling contínuo

**Risco**: Complexidade excessiva
**Mitigação**: Code reviews rigorosos, princípio YAGNI

### 7.2 Riscos de Adoção

**Risco**: Resistência da equipe
**Mitigação**: Training sessions, documentação clara, migration guides

**Risco**: Fragmentação da API
**Mitigação**: Consistent naming, clear deprecation policy

### 7.3 Riscos de Negócio

**Risco**: Investimento sem retorno
**Mitigação**: Implementação incremental, métricas claras de sucesso

**Risco**: Dependência de tecnologias instáveis
**Mitigação**: Uso de tecnologias estabelecidas, abstrações próprias

## 8. Roadmap das Versões V2

### 8.1 Estratégia de Coexistência

As versões V2 coexistirão com as V1 durante o período de transição:

```typescript
// V1 (Atual) - Mantém compatibilidade total
const { dataSource } = useArchbaseRemoteDataSource({
  name: 'pessoas',
  service: pessoaService
});

// V2 (Nova) - Opt-in com recursos modernos
const { dataSource } = useArchbaseRemoteDataSourceV2({
  name: 'pessoas',
  service: pessoaService,
  useQuery: true,    // TanStack Query
  useImmer: true     // Imutabilidade
});
```

### 8.2 Migration Path

**Migração Gradual Recomendada**:

1. **Novos Projetos**: Começar direto com V2
2. **Projetos Existentes**: Migrar módulo por módulo
3. **APIs Críticas**: Manter V1 até estabilização completa da V2
4. **Deprecation Timeline**: V1 será deprecated após 12 meses da release da V2

**Ferramentas de Migração**:
- Codemod automático para casos simples
- Migration guide detalhado
- Exemplos side-by-side V1 vs V2
- Workshop interno de migração

### 8.3 Benefits Summary V2

**ArchbaseDataSourceV2 (Immer)**:
- ✅ Imutabilidade garantida
- ✅ Melhor performance React
- ✅ Arrays aninhados simplificados
- ✅ Type-safety melhorado
- ✅ Debugging facilitado

**ArchbaseRemoteDataSourceV2 (TanStack Query)**:
- ✅ Cache inteligente automático
- ✅ Background synchronization
- ✅ Optimistic updates
- ✅ Automatic retry logic
- ✅ DevTools integration
- ✅ SSR/RSC ready

**Combined Benefits**:
- ✅ 90% menos `forceUpdate()`
- ✅ 80% menos código para arrays
- ✅ 40% melhor performance
- ✅ 100% backward compatible
- ✅ Modern React patterns

## 9. Conclusão

O plano apresentado oferece uma evolução natural e incremental do sistema DataSource, mantendo seus pontos fortes enquanto resolve limitações identificadas em projetos reais.

As melhorias propostas focam em:
- **Manter compatibilidade** com código existente
- **Reduzir complexidade** em cenários avançados  
- **Melhorar performance** e integração com React moderno
- **Facilitar adoção** através de APIs intuitivas

**As versões V2 adicionam**:
- **Imutabilidade nativa** com Immer para melhor integração React
- **Cache inteligente** com TanStack Query para performance superior
- **APIs modernas** que resolvem limitações identificadas
- **Ferramentas de desenvolvimento** para melhor debugging

A implementação em fases permite validação contínua e ajustes baseados no feedback real dos desenvolvedores, garantindo que as melhorias realmente resolvam problemas práticos sem introduzir complexidade desnecessária.

O investimento nas melhorias propostas resultará em:
- Maior produtividade da equipe de desenvolvimento
- Código mais maintível e testável
- Melhor experiência do usuário final
- Posicionamento competitivo da biblioteca no mercado
- **Preparação para o futuro** com React Server Components e Concurrent Features

**Next Steps**:
1. Aprovação do roadmap pela equipe
2. Setup do ambiente para versões V2
3. Implementação incremental conforme plano de fases
4. Feedback contínuo e ajustes
5. Documentation e training da equipe

---

*Este documento será atualizado conforme feedback da equipe e resultados da implementação das fases iniciais.*