# DataSource V2 - Padrões de Migração e Exemplos

## Visão Geral

Este documento define os padrões e estratégias para migrar componentes do ArchbaseDataSource V1 para V2, mantendo compatibilidade e melhorando performance através do uso do Immer para imutabilidade.

## Estratégia de Migração

### 1. Abordagem Incremental (Coexistência)

- **V1 e V2 coexistem** na mesma aplicação
- **Migração gradual** por componente
- **Backward compatibility** mantida
- **No breaking changes** durante a transição

### 2. Interfaces Compatíveis

```typescript
// Interface base comum entre V1 e V2
interface IDataSource<T> {
  setFieldValue(fieldName: string, value: any): void;
  getFieldValue(fieldName: string): any;
  edit(): void;
  save(): Promise<T>;
  // ... métodos compatíveis
}

// V2 adiciona novos métodos sem quebrar V1
interface IDataSourceV2<T> extends IDataSource<T> {
  appendToFieldArray<K extends keyof T>(fieldName: K, item: any): void;
  updateFieldArrayItem<K extends keyof T>(fieldName: K, index: number, updater: (draft: any) => void): void;
  // ... novos métodos V2
}
```

## Padrões de Migração por Tipo de Componente

### 1. Editor Components (ArchbaseEdit, ArchbaseSelect, etc.)

#### Padrão V1 (Atual)
```typescript
export interface ArchbaseEditProps<T, ID> {
  dataSource?: ArchbaseDataSource<T, ID>;
  dataField?: string;
  // ... outras props
}

const ArchbaseEdit = <T, ID>(props: ArchbaseEditProps<T, ID>) => {
  const { dataSource, dataField, value, onChangeValue } = props;
  
  const [currentValue, setCurrentValue] = useState<string>('');
  
  useArchbaseDataSourceListener<T, ID>({
    dataSource,
    listener: (event: DataSourceEvent<T>) => {
      if (event.type === DataSourceEventNames.dataChanged) {
        const newValue = dataSource?.getFieldValue(dataField);
        setCurrentValue(newValue || '');
      }
    }
  });
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCurrentValue(newValue);
    dataSource?.setFieldValue(dataField, newValue);
    onChangeValue?.(newValue, event);
  };
  
  return <input value={currentValue} onChange={handleChange} />;
};
```

#### Padrão V2 (Migrado)
```typescript
export interface ArchbaseEditV2Props<T, ID> {
  dataSource?: ArchbaseDataSourceV2<T> | ArchbaseDataSource<T, ID>; // Aceita ambos
  dataField?: string;
  // ... outras props
}

const ArchbaseEditV2 = <T, ID>(props: ArchbaseEditV2Props<T, ID>) => {
  const { dataSource, dataField, value, onChangeValue } = props;
  
  // Detecta se é V2 ou V1
  const isV2 = dataSource && 'appendToFieldArray' in dataSource;
  
  // Para V2: usa hook otimizado
  const v2Result = isV2 ? useArchbaseDataSourceV2({
    name: 'temp-v2',
    records: []
  }) : null;
  
  // Para V1: mantém comportamento atual
  const [currentValue, setCurrentValue] = useState<string>('');
  
  useArchbaseDataSourceListener<T, ID>({
    dataSource,
    listener: (event: DataSourceEvent<T>) => {
      if (event.type === DataSourceEventNames.dataChanged) {
        const newValue = dataSource?.getFieldValue(dataField);
        setCurrentValue(newValue || '');
      }
    }
  });
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    if (isV2) {
      // V2: usa hook otimizado
      v2Result?.setFieldValue(dataField!, newValue);
    } else {
      // V1: comportamento original
      setCurrentValue(newValue);
      dataSource?.setFieldValue(dataField, newValue);
    }
    
    onChangeValue?.(newValue, event);
  };
  
  const displayValue = isV2 
    ? v2Result?.getFieldValue(dataField!) || ''
    : currentValue;
  
  return <input value={displayValue} onChange={handleChange} />;
};
```

### 2. Template Components (ArchbaseFormTemplate, etc.)

#### Padrão V1 (Atual)
```typescript
const ArchbaseFormTemplate = <T, ID>(props: ArchbaseFormTemplateProps<T, ID>) => {
  const { dataSource } = props;
  
  const [isEditing, setIsEditing] = useState(false);
  
  useArchbaseDataSourceListener<T, ID>({
    dataSource,
    listener: (event: DataSourceEvent<T>) => {
      if (event.type === DataSourceEventNames.afterEdit) {
        setIsEditing(true);
      }
    }
  });
  
  const handleSave = async () => {
    await dataSource?.save();
  };
  
  return (
    <form>
      {/* Form fields */}
      <button onClick={handleSave} disabled={!isEditing}>
        Salvar
      </button>
    </form>
  );
};
```

#### Padrão V2 (Migrado)
```typescript
const ArchbaseFormTemplateV2 = <T, ID>(props: ArchbaseFormTemplateV2Props<T, ID>) => {
  const { dataSource, useV2Hook = false } = props;
  
  // Se useV2Hook=true, usa o hook V2 diretamente
  const v2Hook = useV2Hook && dataSource ? useArchbaseDataSourceV2({
    name: 'form-template',
    records: []  // Será sincronizado com dataSource externo
  }) : null;
  
  // Estado tradicional para V1
  const [isEditing, setIsEditing] = useState(false);
  
  // Listener para V1
  useArchbaseDataSourceListener<T, ID>({
    dataSource: !useV2Hook ? dataSource : undefined,
    listener: (event: DataSourceEvent<T>) => {
      if (event.type === DataSourceEventNames.afterEdit) {
        setIsEditing(true);
      }
    }
  });
  
  const handleSave = async () => {
    if (v2Hook) {
      await v2Hook.save();
    } else {
      await dataSource?.save();
    }
  };
  
  const currentIsEditing = v2Hook ? v2Hook.isEditing : isEditing;
  
  return (
    <form>
      {/* Form fields */}
      <button onClick={handleSave} disabled={!currentIsEditing}>
        Salvar
      </button>
    </form>
  );
};
```

### 3. Data Display Components (ArchbaseDataTable, etc.)

#### Padrão de Migração para Componentes Complexos
```typescript
interface ArchbaseDataTableV2Props<T, ID> {
  dataSource?: ArchbaseDataSourceV2<T> | ArchbaseRemoteDataSourceV2<T> | ArchbaseDataSource<T, ID>;
  enableV2Features?: boolean; // Opt-in para features V2
  // ... outras props
}

const ArchbaseDataTableV2 = <T, ID>(props: ArchbaseDataTableV2Props<T, ID>) => {
  const { dataSource, enableV2Features = false } = props;
  
  // Auto-detecta se é V2
  const isV2 = dataSource && ('appendToFieldArray' in dataSource || 'applyRemoteFilter' in dataSource);
  
  // Para V2: usa hook apropriado
  const v2Local = isV2 && !('applyRemoteFilter' in dataSource!) 
    ? useArchbaseDataSourceV2ReadOnly({
        name: 'datatable-local',
        records: []
      })
    : null;
    
  const v2Remote = isV2 && ('applyRemoteFilter' in dataSource!)
    ? useArchbaseRemoteDataSourceV2ReadOnly({
        name: 'datatable-remote',
        service: (dataSource as any).getService()
      })
    : null;
  
  // Estado para V1
  const [currentData, setCurrentData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Para V1: mantém comportamento original
  useArchbaseDataSourceListener<T, ID>({
    dataSource: !isV2 ? dataSource : undefined,
    listener: (event: DataSourceEvent<T>) => {
      if (event.type === DataSourceEventNames.dataChanged) {
        setCurrentData(dataSource?.getRecords() || []);
      }
    }
  });
  
  // Estado derivado baseado na versão
  const finalData = isV2 
    ? (v2Local?.dataSource.getRecords() || v2Remote?.dataSource.getRecords() || [])
    : currentData;
    
  const finalIsLoading = isV2
    ? (v2Local?.isLoading || v2Remote?.isLoading || false)
    : isLoading;
  
  return (
    <div>
      {finalIsLoading && <div>Carregando...</div>}
      <table>
        {finalData.map((record, index) => (
          <tr key={index}>
            {/* Render record */}
          </tr>
        ))}
      </table>
    </div>
  );
};
```

## Estratégias por Feature

### 1. Array Operations (Nova Feature V2)

```typescript
// V1: Não suportado nativamente
const handleAddContact = () => {
  const currentRecord = dataSource.getCurrentRecord();
  const contacts = currentRecord.contacts || [];
  const newContacts = [...contacts, newContact];
  dataSource.setFieldValue('contacts', newContacts);
};

// V2: Suporte nativo com Immer
const handleAddContact = () => {
  dataSource.appendToFieldArray('contacts', newContact);
};

// V2: Atualização imutável de item do array
const handleUpdateContact = (index: number) => {
  dataSource.updateFieldArrayItem('contacts', index, (draft) => {
    draft.principal = true;
  });
};
```

### 2. Performance Optimization

```typescript
// V1: Re-render em toda mudança
useArchbaseDataSourceListener({
  dataSource,
  listener: (event) => {
    // Sempre força re-render
    forceUpdate();
  }
});

// V2: Re-render otimizado
const { currentRecord, isEditing } = useArchbaseDataSourceV2({
  name: 'optimized',
  records: []
});
// Apenas re-render quando valores específicos mudam
```

### 3. Type Safety

```typescript
// V1: Type safety limitada
dataSource.setFieldValue('contatos', newValue); // any type

// V2: Type safety completa
dataSource.appendToFieldArray('contatos', newContact); // Type-safe
//                             ^^^^^^^^^ 
//                             TypeScript knows this is Contato[]
```

## Migration Checklist

### Para Editor Components
- [ ] Adicionar suporte a ambos V1 e V2 nas props
- [ ] Detectar automaticamente a versão do DataSource
- [ ] Usar hook V2 quando disponível
- [ ] Manter backward compatibility com V1
- [ ] Testar ambos os cenários

### Para Template Components  
- [ ] Adicionar prop opcional `useV2Hook`
- [ ] Implementar lógica condicional para V1/V2
- [ ] Gerenciar estado reativo adequadamente
- [ ] Testar operações CRUD em ambas versões

### Para Data Display Components
- [ ] Auto-detectar V2 vs V1
- [ ] Usar hooks ReadOnly apropriados
- [ ] Otimizar performance para grandes datasets
- [ ] Manter compatibilidade com filtros/sorting

## Testes para Migração

### Test Utilities V2
```typescript
// Teste com V1
const testV1 = () => {
  const dataSource = new ArchbaseDataSource('test', { records: testData });
  render(<ComponentV2 dataSource={dataSource} />);
  // Verificar comportamento V1
};

// Teste com V2
const testV2 = () => {
  const dataSource = new ArchbaseDataSourceV2({ name: 'test', records: testData });
  render(<ComponentV2 dataSource={dataSource} />);
  // Verificar comportamento V2
};

// Teste de coexistência
const testCoexistence = () => {
  const dataSourceV1 = new ArchbaseDataSource('v1', { records: testData });
  const dataSourceV2 = new ArchbaseDataSourceV2({ name: 'v2', records: testData });
  
  render(
    <div>
      <ComponentV2 dataSource={dataSourceV1} />
      <ComponentV2 dataSource={dataSourceV2} />
    </div>
  );
  
  // Verificar que ambos funcionam independentemente
};
```

## Cronograma de Migração

### Fase 1: Core Components (4-6 semanas)
- ArchbaseEdit, ArchbaseSelect, ArchbaseCheckbox
- ArchbaseTextArea, ArchbaseNumberEdit
- ArchbaseFormTemplate

### Fase 2: Advanced Components (6-8 semanas)
- ArchbaseDataTable
- ArchbaseTableTemplate
- ArchbaseAsyncSelect, ArchbaseLookupSelect

### Fase 3: Specialized Components (4-6 semanas)
- Security Components
- Query Builder Components
- Theme Components

### Fase 4: Cleanup & Optimization (2-4 semanas)
- Performance benchmarks
- Documentation updates
- Migration tools
- Deprecation warnings para V1

## Breaking Changes Plan

### Version 3.0 (Futuro)
- Remove V1 support completely
- Default to V2 behavior
- Clean up compatibility code
- Full TypeScript strict mode

### Deprecation Timeline
- **2.1.4**: V2 introduced, V1 maintained
- **2.2.0**: V1 marked as deprecated
- **2.3.0**: V1 warnings in console
- **3.0.0**: V1 removed completely

---

**Data de criação**: $(date)
**Última atualização**: Migração em andamento
**Status**: Padrões definidos, iniciando implementação