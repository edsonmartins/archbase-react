# Validation Errors Context - Guia de Integração

## 📋 Visão Geral

O **ValidationErrorsContext** foi criado para resolver um problema fundamental nos formulários do Archbase v3:

### Problema

Quando o `ArchbaseFormTemplate` re-renderiza (por exemplo, ao mostrar um erro de validação no alert do topo), todos os componentes filhos são desmontados e remontados. Isso causava a perda dos erros de validação que estavam armazenados no estado local dos componentes.

### Solução

Armazenar os erros em um **Context** React que sobrevive a unmounts/remounts dos componentes. O `ArchbaseFormTemplate` agora automaticamente envolve seus children com `ValidationErrorsProvider`.

## 🔧 Como Integrar nos Componentes

### Padrão de Implementação

Todos os componentes de edição devem seguir este padrão:

```typescript
import { useValidationErrors } from '@archbase/template';

export function ArchbaseEdit<T, ID>({ dataSource, dataField, error, ...props }) {
  // Estado local do erro (para compatibilidade)
  const [internalError, setInternalError] = useState<string | undefined>(error);

  // Contexto de validação (opcional - pode não existir)
  const validationContext = useValidationErrors();

  // Chave única para o field
  const fieldKey = `${dataField}`;

  // Recuperar erro do contexto se existir
  const contextError = validationContext?.getError(fieldKey);

  // Erro a ser exibido: local ou do contexto
  const displayError = internalError || contextError;

  // Listener de eventos do DataSource
  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
      // Setar erro localmente
      setInternalError(event.error);

      // Salvar no contexto (se disponível)
      validationContext?.setError(fieldKey, event.error);
    }
  }, [dataField, fieldKey, validationContext]);

  // Handler de mudança de valor
  const handleChange = (value) => {
    // Limpar erros quando usuário edita
    const hasError = internalError || contextError;
    if (hasError) {
      setInternalError(undefined);
      validationContext?.clearError(fieldKey);
    }

    // ... resto da lógica
  };

  return (
    <Input
      {...props}
      value={value}
      error={displayError}  // Usar displayError, não internalError
      onChange={handleChange}
    />
  );
}
```

## 📝 Componentes que Precisam ser Atualizados

### Prioridade Alta (usados em forms com validação)
- [x] ArchbaseFormTemplate - ✅ Já integrado
- [ ] ArchbaseEdit
- [ ] ArchbaseTextArea
- [ ] ArchbaseSelect
- [ ] ArchbaseNumberEdit
- [ ] ArchbaseMaskEdit

### Prioridade Média
- [ ] ArchbaseDatePicker
- [ ] ArchbaseTimePicker
- [ ] ArchbaseSwitch
- [ ] ArchbaseCheckbox
- [ ] ArchbaseRadio

### Prioridade Baixa
- [ ] ArchbaseColorPicker
- [ ] ArchbaseSlider
- [ ] Outros componentes de input

## ✅ Checklist de Integração

Para cada componente:

1. [ ] Importar `useValidationErrors` de `@archbase/template`
2. [ ] Adicionar `const validationContext = useValidationErrors()` no início do componente
3. [ ] Criar `fieldKey` usando dataField
4. [ ] Recuperar `contextError` usando `validationContext?.getError(fieldKey)`
5. [ ] Criar `displayError = internalError || contextError`
6. [ ] No listener `onFieldError`: adicionar `validationContext?.setError(fieldKey, event.error)`
7. [ ] No `handleChange`: adicionar `validationContext?.clearError(fieldKey)`
8. [ ] Usar `displayError` ao invés de `internalError` no componente visual

## 🔍 Testes

Após integrar em um componente:

1. **Teste de persistência**:
   - Submeter form com validação
   - Verificar que erros aparecem
   - Editar um campo válido
   - Voltar a submeter
   - Erros devem persistir nos campos não editados

2. **Teste de limpeza**:
   - Submeter com erros
   - Editar campo com erro
   - Erro deve desaparecer imediatamente

3. **Teste de compatibilidade**:
   - Usar componente FORA de ArchbaseFormTemplate
   - Deve funcionar normalmente (sem contexto)

## 💡 Benefícios

✅ Erros persistem através de re-renders
✅ Melhor UX - usuário sempre vê onde estão os erros
✅ Compatível com código antigo
✅ Zero configuração para desenvolvedores (automático com ArchbaseFormTemplate)
✅ Funciona com DataSource V1 e V2

## 📚 Exemplo Completo

Veja `/Users/edsonmartins/tmp/gestor-rq-admin/src/views/checklist/components/ArchbaseEdit.tsx` para um exemplo completo de implementação.
