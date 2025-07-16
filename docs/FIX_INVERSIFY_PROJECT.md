# Fix para Projeto com Erro do Inversify Provider

## Problema Identificado

O erro "Cannot find Inversify container on React Context" está ocorrendo devido a incompatibilidades de versões entre:

1. `reflect-metadata`: Projeto usa `0.1.14`, mas libs Archbase precisam de `0.2.2`
2. Múltiplas instâncias de `inversify-react` e `reflect-metadata` sendo resolvidas

## Solução

### 1. Atualizar package.json

```json
{
  "dependencies": {
    // Atualizar reflect-metadata para versão correta
    "reflect-metadata": "^0.2.2",
    
    // Manter outras dependências
    "inversify": "6.2.0",
    "inversify-react": "^1.2.0"
  },
  
  // Adicionar resolutions para forçar versão única (PNPM)
  "pnpm": {
    "overrides": {
      "reflect-metadata": "0.2.2"
    }
  }
}
```

### 2. Limpar e Reinstalar Dependências

```bash
# Limpar node_modules e lock files
rm -rf node_modules pnpm-lock.yaml

# Reinstalar com versões corretas
pnpm install

# Comando principal para PNPM
pnpm install
```

### 3. Verificar Resolução de Dependências

```bash
# Verificar se todas as versões estão corretas
pnpm ls reflect-metadata
pnpm ls inversify
pnpm ls inversify-react
```

### 4. Atualizar Import no App.tsx

Certifique-se que o import está correto:

```typescript
// No topo do App.tsx
import 'reflect-metadata'

// Resto dos imports...
```

### 5. Verificar vite.config.ts

Adicionar otimização de dependências:

```typescript
export default defineConfig(({ mode }) => {
  return {
    // ... outras configurações
    
    optimizeDeps: {
      include: [
        'reflect-metadata',
        'inversify',
        'inversify-react'
      ]
    },
    
    // ... resto da configuração
  }
})
```

## Resultado Esperado

Após essas correções:

1. ✅ Todas as instâncias de `reflect-metadata` serão `0.2.2`
2. ✅ `inversify-react` funcionará corretamente
3. ✅ Container IOC será encontrado corretamente
4. ✅ Erro "Cannot find Inversify container" será resolvido

## Verificação

Para confirmar que o problema foi resolvido:

```bash
# 1. Verificar dependências
pnpm ls reflect-metadata

# 2. Executar aplicação
pnpm dev

# 3. Verificar no browser console
# Não deve mais aparecer erro do Inversify container
```

## Dependências Corretas Finais

```json
{
  "dependencies": {
    "@archbase/admin": "^3.0.0",
    "@archbase/components": "^3.0.0", 
    "@archbase/core": "^3.0.0",
    "@archbase/data": "^3.0.0",
    "@archbase/layout": "^3.0.0",
    "@archbase/security": "^3.0.0",
    "@archbase/template": "^3.0.0",
    
    "inversify": "6.2.0",
    "inversify-react": "^1.2.0",
    "reflect-metadata": "^0.2.2"
  }
}
```

---

**Nota**: Este problema é causado pela migração para a versão 3.0.0 da lib Archbase, que atualiza `reflect-metadata` para `0.2.2`. Projetos existentes precisam atualizar suas dependências para manter compatibilidade.