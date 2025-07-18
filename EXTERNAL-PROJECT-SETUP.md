# Como usar archbase-react-v3 em desenvolvimento em outro projeto

## Método 1: Usando pnpm link (Recomendado)

### 1. Na pasta do archbase-react-v3:
```bash
# Configurar para desenvolvimento direto (usar src ao invés de dist)
npm run dev:link

# Linkar para o seu projeto
npm run link:project /caminho/do/seu/projeto
```

### 2. No seu projeto:
Pronto! Agora o seu projeto está usando o código fonte diretamente.

### 3. Para desfazer:
```bash
# Na pasta do archbase-react-v3
npm run link:project /caminho/do/seu/projeto --unlink
npm run dev:restore
```

## Método 2: Configuração manual no vite.config.ts

No seu projeto que usa archbase-react, adicione ao `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@archbase/core': path.resolve(__dirname, '../archbase-react-v3/packages/core/src'),
      '@archbase/data': path.resolve(__dirname, '../archbase-react-v3/packages/data/src'),
      '@archbase/components': path.resolve(__dirname, '../archbase-react-v3/packages/components/src'),
      '@archbase/security': path.resolve(__dirname, '../archbase-react-v3/packages/security/src'),
      '@archbase/admin': path.resolve(__dirname, '../archbase-react-v3/packages/admin/src'),
      '@archbase/layout': path.resolve(__dirname, '../archbase-react-v3/packages/layout/src'),
      '@archbase/advanced': path.resolve(__dirname, '../archbase-react-v3/packages/advanced/src'),
      '@archbase/template': path.resolve(__dirname, '../archbase-react-v3/packages/template/src'),
    }
  }
})
```

## Método 3: Usando tsconfig paths

No seu projeto, adicione ao `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@archbase/core": ["../archbase-react-v3/packages/core/src"],
      "@archbase/core/*": ["../archbase-react-v3/packages/core/src/*"],
      "@archbase/data": ["../archbase-react-v3/packages/data/src"],
      "@archbase/data/*": ["../archbase-react-v3/packages/data/src/*"],
      "@archbase/components": ["../archbase-react-v3/packages/components/src"],
      "@archbase/components/*": ["../archbase-react-v3/packages/components/src/*"],
      "@archbase/security": ["../archbase-react-v3/packages/security/src"],
      "@archbase/security/*": ["../archbase-react-v3/packages/security/src/*"],
      "@archbase/admin": ["../archbase-react-v3/packages/admin/src"],
      "@archbase/admin/*": ["../archbase-react-v3/packages/admin/src/*"],
      "@archbase/layout": ["../archbase-react-v3/packages/layout/src"],
      "@archbase/layout/*": ["../archbase-react-v3/packages/layout/src/*"],
      "@archbase/advanced": ["../archbase-react-v3/packages/advanced/src"],
      "@archbase/advanced/*": ["../archbase-react-v3/packages/advanced/src/*"],
      "@archbase/template": ["../archbase-react-v3/packages/template/src"],
      "@archbase/template/*": ["../archbase-react-v3/packages/template/src/*"]
    }
  }
}
```

## Método 4: Usando workspace (pnpm)

Se ambos os projetos estão na mesma máquina, crie um workspace:

1. Crie um `pnpm-workspace.yaml` na pasta pai:
```yaml
packages:
  - 'archbase-react-v3/**'
  - 'seu-projeto/**'
```

2. No `package.json` do seu projeto:
```json
{
  "dependencies": {
    "@archbase/core": "workspace:*",
    "@archbase/data": "workspace:*",
    "@archbase/components": "workspace:*",
    "@archbase/security": "workspace:*",
    "@archbase/admin": "workspace:*",
    "@archbase/layout": "workspace:*",
    "@archbase/advanced": "workspace:*",
    "@archbase/template": "workspace:*"
  }
}
```

## Dicas Importantes

1. **Hot Reload**: Com qualquer método acima, mudanças no código fonte do archbase-react serão refletidas imediatamente.

2. **TypeScript**: O TypeScript pode reclamar inicialmente. Reinicie o servidor TS no seu IDE.

3. **Cache**: Se tiver problemas, limpe o cache:
   ```bash
   rm -rf node_modules/.vite
   rm -rf node_modules/.cache
   ```

4. **Performance**: O desenvolvimento direto do fonte pode ser um pouco mais lento que usar dist compilado.

## Exemplo Completo

```bash
# Terminal 1 - archbase-react-v3
cd /Users/edsonmartins/tmp/archbase-react-v3
npm run dev:link
npm run link:project /Users/edsonmartins/meu-projeto

# Terminal 2 - seu projeto
cd /Users/edsonmartins/meu-projeto
npm run dev

# Agora edite qualquer arquivo em archbase-react-v3/packages/*/src/
# e veja as mudanças refletidas imediatamente no seu projeto!
```