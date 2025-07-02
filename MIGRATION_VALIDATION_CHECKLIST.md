# ✅ Checklist de Validação - Migração DataSource V1/V2

> **Status:** 🚧 **TEMPLATE PARA VALIDAÇÃO**  
> **Uso:** Copiar para cada componente migrado  
> **Critério:** TODOS os itens devem ser ✅ antes do merge

---

## 📋 **Checklist Obrigatório por Componente**

### **Componente:** `[NOME_DO_COMPONENTE]`
### **Data:** `[DATA_DA_MIGRAÇÃO]`
### **Responsável:** `[NOME_DO_DESENVOLVEDOR]`

---

### 🧪 **1. TESTES DE REGRESSÃO (OBRIGATÓRIO)**

- [ ] ✅ **Todos os testes V1 baseline passando (100%)**
  ```bash
  npm test -- [ComponenteName]V1Baseline.test.tsx
  ```
  - [ ] Inicialização básica
  - [ ] Integração DataSource
  - [ ] Event handling
  - [ ] Props e configuração
  - [ ] Edge cases
  - [ ] Acessibilidade

- [ ] ✅ **Testes específicos V2 passando**
  ```bash
  npm test -- [ComponenteName] --testNamePattern="V2"
  ```

- [ ] ✅ **Testes de integração passando**
  ```bash
  npm test -- [ComponenteName] --testNamePattern="integration"
  ```

---

### 🔍 **2. DETECÇÃO AUTOMÁTICA V1/V2 (CRÍTICO)**

- [ ] ✅ **Duck typing implementado corretamente**
  ```typescript
  const isDataSourceV2 = dataSource && (
    'appendToFieldArray' in dataSource || 
    'updateFieldArrayItem' in dataSource
  );
  ```

- [ ] ✅ **Detecção funcionando em runtime**
  - [ ] V1 DataSource detectado como V1
  - [ ] V2 DataSource detectado como V2
  - [ ] Sem DataSource funciona normalmente

- [ ] ✅ **Logs de debug implementados (desenvolvimento)**
  ```typescript
  if (process.env.NODE_ENV === 'development') {
    console.log('DataSource version detected:', isDataSourceV2 ? 'V2' : 'V1');
  }
  ```

---

### 🔄 **3. ESTADOS DUAIS V1/V2 (CRÍTICO)**

- [ ] ✅ **Estados V1 preservados**
  ```typescript
  const [currentValue, setCurrentValue] = useState<T>(initialValue);
  const forceUpdate = useForceUpdate(); // Apenas V1
  ```

- [ ] ✅ **Estados V2 otimizados**
  ```typescript
  const [v2Value, setV2Value] = useState<T>(initialValue);
  const [v2ShouldUpdate, setV2ShouldUpdate] = useState(0);
  ```

- [ ] ✅ **Carregamento condicional funcionando**
  ```typescript
  const loadDataSourceFieldValue = () => {
    if (isDataSourceV2) {
      setV2Value(value);
      setV2ShouldUpdate(prev => prev + 1);
    } else {
      setCurrentValue(value);
    }
  };
  ```

---

### 📡 **4. EVENT LISTENERS (CRÍTICO)**

- [ ] ✅ **Eventos V1 funcionando identicamente**
  - [ ] `dataChanged`
  - [ ] `recordChanged` 
  - [ ] `fieldChanged`
  - [ ] `afterScroll`
  - [ ] `afterEdit`
  - [ ] `afterCancel`
  - [ ] `onFieldError`

- [ ] ✅ **ForceUpdate aplicado apenas em V1**
  ```typescript
  const dataSourceEvent = useCallback((event) => {
    // ... lógica comum ...
    if (!isDataSourceV2) {
      forceUpdate(); // Apenas V1
    }
  }, [isDataSourceV2]);
  ```

- [ ] ✅ **V2 sem forceUpdate desnecessário**

---

### 🎯 **5. MANIPULAÇÃO DE MUDANÇAS (CRÍTICO)**

- [ ] ✅ **handleChange condicional implementado**
  ```typescript
  const handleChange = (newValue: T) => {
    if (isDataSourceV2) {
      setV2Value(newValue);
    } else {
      setCurrentValue(newValue);
    }
    // ... lógica comum do DataSource ...
  };
  ```

- [ ] ✅ **DataSource.setFieldValue funcionando em ambas versões**

- [ ] ✅ **Callbacks externos preservados**
  - [ ] `onChangeValue`
  - [ ] `onFocusEnter`
  - [ ] `onFocusExit`

---

### 🖼️ **6. RENDERIZAÇÃO CONDICIONAL (CRÍTICO)**

- [ ] ✅ **Valor renderizado condicionalmente**
  ```typescript
  <Component value={isDataSourceV2 ? v2Value : currentValue} />
  ```

- [ ] ✅ **UI idêntica em ambas versões**
  - [ ] Mesma aparência visual
  - [ ] Mesmo comportamento de interação
  - [ ] Mesmos estados (disabled, readonly, etc.)

---

### ⚡ **7. PERFORMANCE (MONITORAMENTO)**

- [ ] ✅ **V1 performance baseline mantida**
  ```bash
  npm run test:performance -- [ComponenteName]
  ```

- [ ] ✅ **V2 performance igual ou melhor**
  - [ ] Menos re-renders desnecessários
  - [ ] Memory usage estável
  - [ ] Bundle size não aumentado

- [ ] ✅ **Memory leaks verificados**
  ```bash
  npm run test:memory -- [ComponenteName]
  ```

---

### 🧩 **8. COMPATIBILIDADE TYPESCRIPT (CRÍTICO)**

- [ ] ✅ **Tipos existentes preservados**
  ```bash
  npx tsc --noEmit --project tsconfig.json
  ```

- [ ] ✅ **Generics funcionando**
  ```typescript
  ArchbaseComponent<T, ID>
  ```

- [ ] ✅ **Inference funcionando**
  - [ ] Props inference
  - [ ] DataSource types
  - [ ] Event types

---

### 🔒 **9. FALLBACK E SEGURANÇA (CRÍTICO)**

- [ ] ✅ **Fallback V1 implementado**
  ```typescript
  try {
    return <V2Component {...props} />;
  } catch (error) {
    console.warn('V2 fallback to V1:', error);
    return <V1Component {...props} />;
  }
  ```

- [ ] ✅ **Error boundaries funcionando**

- [ ] ✅ **Rollback instantâneo possível**
  ```typescript
  const FORCE_V1_MODE = process.env.FORCE_DATASOURCE_V1 === 'true';
  ```

---

### 📚 **10. DOCUMENTAÇÃO E EXEMPLOS**

- [ ] ✅ **Storybook atualizado**
  - [ ] Exemplo com DataSource V1
  - [ ] Exemplo com DataSource V2
  - [ ] Exemplo sem DataSource

- [ ] ✅ **Documentação atualizada**
  - [ ] Props documentation
  - [ ] Migration guide
  - [ ] Breaking changes (deve ser zero)

- [ ] ✅ **Changelog atualizado**

---

### 🔍 **11. TESTES MANUAIS (QA)**

- [ ] ✅ **Cenários V1 funcionando**
  - [ ] Com ArchbaseDataSource
  - [ ] Com ArchbaseLocalFilterDataSource
  - [ ] Com ArchbaseRemoteDataSource
  - [ ] Sem DataSource

- [ ] ✅ **Cenários V2 funcionando**
  - [ ] Com ArchbaseDataSourceV2
  - [ ] Com ArchbaseRemoteDataSourceV2
  - [ ] Performance visível melhor

- [ ] ✅ **Cenários edge case**
  - [ ] DataSource null/undefined
  - [ ] Mudança de DataSource em runtime
  - [ ] Multiple DataSources
  - [ ] Concurrent operations

---

### 🚀 **12. DEPLOY E MONITORAMENTO**

- [ ] ✅ **Feature flag configurado**
  ```typescript
  const ENABLE_V2_OPTIMIZATION = process.env.ENABLE_DATASOURCE_V2 !== 'false';
  ```

- [ ] ✅ **Métricas implementadas**
  ```typescript
  analytics.track('DataSource_Version_Usage', {
    component: '[ComponenteName]',
    version: isDataSourceV2 ? 'V2' : 'V1',
    fallbackUsed: false
  });
  ```

- [ ] ✅ **Logs de produção configurados**

---

## 🚨 **CRITÉRIOS DE APROVAÇÃO**

### ✅ **TODOS DEVEM SER VERDADEIROS:**

1. **100% dos testes V1 baseline passando**
2. **Zero breaking changes na API pública**
3. **Performance V1 baseline mantida ou melhorada**
4. **Zero erros TypeScript**
5. **Fallback V1 funcionando**
6. **QA manual aprovado**

### ❌ **CRITÉRIOS DE REJEIÇÃO (ROLLBACK IMEDIATO):**

- Qualquer teste V1 baseline falhando
- Breaking changes na API pública
- Performance degradada
- Erros TypeScript em código existente
- Comportamento visual diferente

---

## 📝 **ASSINATURAS DE APROVAÇÃO**

- [ ] **Desenvolvedor:** `[NOME]` - `[DATA]`
- [ ] **Code Review:** `[NOME]` - `[DATA]`
- [ ] **QA Manual:** `[NOME]` - `[DATA]`
- [ ] **Tech Lead:** `[NOME]` - `[DATA]`

---

## 📊 **MÉTRICAS FINAIS**

```bash
# Executar antes do merge
npm run test:regression -- [ComponenteName]
npm run test:performance -- [ComponenteName]
npm run test:memory -- [ComponenteName]
npm run build
npm run type-check
```

**Resultado:** ✅ APROVADO / ❌ REJEITADO

**Observações:**
```
[Comentários adicionais sobre a migração]
```

---

*Template criado: Dezembro 2024*  
*Versão: 1.0*