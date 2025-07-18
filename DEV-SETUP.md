# Configuração de Desenvolvimento Direto

Este guia explica como configurar o desenvolvimento direto do código fonte sem precisar compilar/empacotar a cada mudança.

## 🚀 Configuração Rápida

### 1. Configurar para desenvolvimento
```bash
npm run dev:link
```

Este comando irá:
- Fazer backup dos package.json originais
- Alterar os exports para apontar para `src/` em vez de `dist/`
- Configurar TypeScript para usar arquivos `.ts` diretamente

### 2. Desenvolver normalmente
Agora você pode:
- Editar arquivos em `packages/*/src/`
- Ver as mudanças refletidas imediatamente no projeto que usa a lib
- Não precisa compilar/empacotar a cada mudança

### 3. Restaurar para produção
```bash
npm run dev:restore
```

## 📋 Fluxo de Desenvolvimento

1. **Primeira vez:**
   ```bash
   npm run dev:link
   ```

2. **Desenvolver:**
   - Edite arquivos em `packages/*/src/`
   - Teste no projeto que usa a lib
   - Os imports continuam funcionando: `import { Component } from '@archbase/components'`

3. **Antes de publicar:**
   ```bash
   npm run dev:restore
   npm run build:prod
   npm run publish:prod
   ```

## 🛠️ Como Funciona

O script `dev-link.js` modifica temporariamente os `package.json` para:

### Antes (produção):
```json
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### Depois (desenvolvimento):
```json
{
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts"
    }
  }
}
```

## 🎯 Vantagens

- ✅ **Desenvolvimento rápido** - Sem compilação necessária
- ✅ **Hot reload** - Mudanças refletidas imediatamente
- ✅ **Debug fácil** - Pode colocar breakpoints diretamente no código fonte
- ✅ **TypeScript completo** - Verificação de tipos em tempo real
- ✅ **Reversível** - Pode voltar ao estado original facilmente

## ⚠️ Cuidados

1. **Sempre restaure antes de publicar:**
   ```bash
   npm run dev:restore
   ```

2. **Não commite os backups:**
   Os arquivos `*.backup` são criados temporariamente e não devem ser commitados.

3. **TypeScript pode reclamar:**
   Alguns imports podem mostrar warnings no IDE, mas funcionam normalmente.

## 🔧 Troubleshooting

### "Module not found" errors
- Certifique-se de que executou `npm run dev:link`
- Verifique se o arquivo `src/index.ts` existe no package
- Tente restartar o TypeScript server no seu IDE

### Para voltar ao normal
```bash
npm run dev:restore
```

### Para verificar o status
Verifique se existem arquivos `.backup` nos packages:
```bash
find packages -name "*.backup"
```