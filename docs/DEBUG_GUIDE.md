# Guia de Debug - Archbase React v3

## Como depurar a lib no navegador

### 1. Configurar o DevTools

1. Abra o DevTools (F12) no navegador
2. Vá em **Settings** (⚙️) > **Sources**
3. Ative as opções:
   - ✅ **Enable source maps**
   - ✅ **Enable JavaScript source maps**

### 2. Encontrar o código fonte da lib

No DevTools, aba **Sources**:
- Procure por `webpack://` ou `node_modules/@archbase/`
- Você verá os arquivos originais `.tsx` da lib
- Navegue até o arquivo que deseja debugar

### 3. Colocar breakpoints

- Clique na linha onde deseja pausar a execução
- O navegador irá pausar quando essa linha for executada
- Você pode inspecionar variáveis, stack trace, etc.

### 4. Usar debugger statement (alternativa)

Se você tem controle sobre o código, pode adicionar:

```typescript
// No código da lib que você quer debugar
debugger; // Pausa aqui automaticamente
```

### 5. Configuração do projeto demo

Se você tem um projeto demo usando a lib:

1. Certifique-se que está usando a versão debug da lib
2. Configure o bundler (Vite/Webpack) para não minificar as dependências:

```javascript
// vite.config.js
export default {
  build: {
    sourcemap: true,
    minify: false
  },
  optimizeDeps: {
    exclude: ['@archbase/core', '@archbase/components'] // Força rebundle
  }
}
```

### 6. Verificar se source maps estão funcionando

1. Inspecione um elemento que usa a lib
2. No DevTools, vá na aba **Sources**
3. Procure por arquivos `.tsx` originais da lib
4. Se aparecer apenas arquivos `.js` minificados, os source maps não estão funcionando

### 7. Dicas adicionais

- Use `console.log` nos arquivos da lib para verificar se está carregando
- Verifique se os arquivos `.js.map` estão sendo servidos pelo servidor
- Se usar um proxy, certifique-se que ele não está removendo os source maps

## Estrutura dos arquivos de debug

```
packages/core/dist/
├── index.js          # Código não minificado
├── index.js.map      # Source map
├── index.d.ts        # Tipos TypeScript
└── index.css         # Estilos
```

## Comandos úteis

```bash
# Build debug (não minificado, com source maps)
pnpm run build:debug

# Pack debug
pnpm run pack:debug

# Publicar no verdaccio
pnpm run publish:verdaccio
```

## Verificar se a lib está em modo debug

No console do navegador:
```javascript
// Verificar se a lib não está minificada
console.log(window.React); // Se aparecer código legível, está em debug
```