# Sistema de Build Debug/Produção

Este documento descreve o sistema unificado de build que usa **Turbo** para alternar entre modo debug e produção.

## 🚀 Comandos Disponíveis

### Build Simples

```bash
# Build de produção
npm run build

# Build de debug
npm run build:debug
```

### Build + Publicação

```bash
# Build produção + publicação NPM
npm run build:publish

# Build debug + publicação Verdaccio
npm run build:publish:debug
```

### Configuração Manual

```bash
# Configurar todos os pacotes para modo debug
npm run config:debug

# Configurar todos os pacotes para produção  
npm run config:production
```

## 📦 Diferenças entre Modos

### Modo Debug
- ✅ Source maps habilitados
- ✅ Código não minificado
- ✅ Nomes de função preservados
- ✅ Tree shaking desabilitado
- ✅ Modo development
- ✅ Ideal para depuração

### Modo Produção
- ❌ Source maps desabilitados
- ✅ Código minificado com esbuild
- ✅ Otimizações de produção
- ✅ Modo production
- ✅ Ideal para distribuição

## 🔧 Configuração Técnica

### Arquivos Principais
- `vite.config.ts` - Todos os pacotes
- `scripts/build-unified.js` - Script principal
- `scripts/build-config.js` - Configuração
- `turbo.json` - Configuração Turbo

### Ordem de Build (Turbo)
O Turbo gerencia automaticamente a ordem baseada nas dependências:
- `dependsOn: ["^build"]` no turbo.json
- Build paralelo quando possível
- Cache inteligente

## 🛠️ Workflow Recomendado

### Para Desenvolvimento
```bash
# Tudo em um comando
npm run build:publish:debug

# Ou passo a passo
npm run build:debug
npm run publish:debug
```

### Para Produção
```bash
# Tudo em um comando
npm run build:publish

# Ou passo a passo
npm run build
npm run publish:verdaccio
```

## 📁 Estrutura de Arquivos

```
archbase-react-v3/
├── scripts/
│   ├── build-unified.js        # Script principal
│   ├── build-config.js         # Configuração
│   ├── publish-debug.js        # Publicação debug
│   └── publish.js              # Publicação produção
├── packages/
│   ├── core/
│   │   ├── vite.config.ts      # Configuração dinâmica
│   │   └── vite.config.ts.backup # Backup original
│   └── ... (outros pacotes)
├── turbo.json                  # Configuração Turbo
└── BUILD-DEBUG.md              # Esta documentação
```

## 🔍 Verificação de Debug

Para verificar se as libs estão em modo debug no projeto consumer:

```bash
# No projeto que usa as libs
npm run debug:check
```

## 🐛 Troubleshooting

### Build falha
- Verificar se todos os pacotes têm `package.json` válido
- Verificar dependências entre pacotes
- Limpar cache: `turbo clean`
- Reinstalar: `pnpm install`

### Libs não aparecem em modo debug
- Executar `npm run config:debug` antes do build
- Verificar se o Verdaccio está rodando (para debug)
- Verificar se as libs foram publicadas no registry correto

### Source maps não funcionam
- Verificar se `sourcemap: true` no vite.config.ts
- Verificar se o navegador tem source maps habilitados
- Verificar se os arquivos .map estão sendo gerados

## 🎯 Exemplo de Uso Completo

```bash
# Desenvolvimento com debug (tudo em um comando)
npm run build:publish:debug

# Produção (tudo em um comando)
npm run build:publish
```

## 📋 Checklist de Verificação

- [ ] Build concluído: `npm run build:debug`
- [ ] Arquivos .js.map gerados
- [ ] Código não minificado
- [ ] Source maps funcionando no navegador
- [ ] Libs publicadas no registry correto