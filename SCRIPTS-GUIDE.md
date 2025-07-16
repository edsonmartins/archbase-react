# 📜 Guia de Scripts - Archbase React v3

## 🎯 Scripts Disponíveis

### 🚀 **Desenvolvimento**
```bash
# Inicia modo desenvolvimento
npm run dev

# Executa testes
npm run test

# Verifica tipos TypeScript
npm run typecheck
```

### 🔨 **Build (Construção)**
```bash
# Build padrão (produção otimizada)
npm run build

# Build para desenvolvimento (com debug)
npm run build:dev

# Build para produção (otimizado + empacotado)
npm run build:prod
```

### 📦 **Pack (Empacotamento)**
```bash
# Empacota todos os pacotes (produção)
npm run pack

# Empacota todos os pacotes (desenvolvimento)
npm run pack:dev
```

### 🚀 **Publish (Publicação)**
```bash
# Publica versão de produção
npm run publish:prod

# Publica versão de desenvolvimento
npm run publish:dev
```

### 🧹 **Utilitários**
```bash
# Limpa todos os builds e node_modules
npm run clean

# Atualiza versões de todos os pacotes
npm run version:update

# Formata código
npm run format

# Executa linter
npm run lint
```

## 🔄 **Fluxo Recomendado**

### Para **Desenvolvimento:**
```bash
npm run clean          # Limpa tudo
npm run dev           # Inicia desenvolvimento
npm run test          # Executa testes
npm run build:dev     # Build com debug
npm run pack:dev      # Empacota com debug
npm run publish:dev   # Publica versão dev
```

### Para **Produção:**
```bash
npm run clean           # Limpa tudo
npm run test           # Executa testes
npm run typecheck      # Verifica tipos
npm run lint           # Verifica código
npm run version:update # Atualiza versões
npm run build:prod     # Build + pack otimizado
npm run publish:prod   # Publica versão final
```

## 📁 **Arquivos de Script**

| Script | Descrição |
|--------|-----------|
| `build-unified.js` | Build principal com flags debug/publish |
| `pack.js` | Empacotamento de pacotes NPM |
| `publish.js` | Publicação normal no Verdaccio |
| `publish-debug.js` | Publicação debug no Verdaccio |
| `clean.js` | Limpeza de builds e dependências |
| `update-version.js` | Atualização de versões |

## 🚨 **Scripts Removidos**

Os seguintes scripts foram removidos para evitar confusão:
- ❌ `build-config.js` - Redundante (build-unified já configura)
- ❌ `build-all-debug.sh` - Auto-gerado (removido)
- ❌ `build-all-production.sh` - Auto-gerado (removido)
- ❌ `config:debug` - Comando removido
- ❌ `config:production` - Comando removido