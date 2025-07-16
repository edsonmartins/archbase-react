# Debug do Fechamento de Abas

## Como debugar:

1. Abra o console do navegador (F12)
2. Tente fechar uma aba
3. Observe os logs no console

## Fluxo esperado:

1. `[TabContainer] handleOnCloseRequest - User clicked close on tab: /path/to/tab`
2. `[Navigation Reducer] USER_CLOSE_REQUEST link: /path/to/tab`
3. `[useArchbaseNavigationListener] Effect check - userCloseLinkRequest: /path/to/tab`
4. `[useArchbaseNavigationListener] Calling onUserCloseRequest for: /path/to/tab`
5. Sua função de cleanup é executada
6. `[useArchbaseNavigationListener] closeAllowed called for: /path/to/tab`
7. `[Navigation Reducer] CLOSE_ALLOWED link: /path/to/tab`
8. `[TabContainer] useEffect - linkClosed: /path/to/tab`
9. `[TabContainer] Calling handleOnClose from useEffect`
10. `[TabContainer] handleOnClose called for: /path/to/tab`
11. `[TabContainer] handleOnClose completed, dispatching DONE`
12. `[Navigation Reducer] DONE link:`

## Possíveis problemas:

### 1. Se parar no passo 3:
- O `useArchbaseNavigationListener` não está sendo usado corretamente
- O `id` passado para o hook não corresponde ao `path` da aba

### 2. Se parar no passo 5:
- A função `closeAllowed()` não está sendo chamada
- Verifique se está chamando `closeAllowed()` após o cleanup

### 3. Se parar no passo 8:
- Problema no useEffect do TabContainer
- Pode ser um problema de re-renderização

## Exemplo de uso correto:

```typescript
const { closeAllowed } = useArchbaseNavigationListener(DASHBOARD_ROUTE, () => {
    console.log('[MyView] Cleanup sendo executado');
    templateStore.clearAllValues();
    closeAllowed(); // IMPORTANTE: deve ser chamado!
});
```

## Verificações importantes:

1. O `id` passado para `useArchbaseNavigationListener` deve ser exatamente igual ao `path` da aba
2. A função `closeAllowed()` DEVE ser chamada dentro do callback
3. Certifique-se de que o componente está envolvido pelo `ArchbaseNavigationProvider`