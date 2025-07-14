# Scripts de Build e Deploy - Archbase React v3

Este documento descreve os scripts organizados para o projeto Archbase React v3.

## Scripts Disponíveis

### 1. `npm run version:update <version>`
**Objetivo**: Atualizar a versão de todos os packages de forma unificada.

**Uso**: `npm run version:update 3.0.12`

**O que faz**:
- ✅ Atualiza a versão do projeto principal
- ✅ Atualiza a versão de todos os packages
- ✅ Configura dependências internas como `workspace:*` para desenvolvimento
- ✅ Configura vite.config.ts para usar versões específicas no build
- ✅ Cria configs do vite automaticamente se não existirem

### 2. `npm run build` | `npm run build:debug`
**Objetivo**: Compilar todos os packages.

**Uso**: 
- `npm run build` (modo release)
- `npm run build:debug` (modo debug)

**O que faz**:
- ✅ Compila packages em ordem de dependência
- ✅ Gera arquivos JS, CSS e TypeScript declarations
- ✅ Valida se todos os arquivos foram gerados corretamente
- ✅ Exibe estatísticas de tamanho
- ✅ Modo debug adiciona timestamp nas versões

### 3. `npm run pack` | `npm run pack:debug`
**Objetivo**: Empacotar packages para distribuição.

**Uso**: 
- `npm run pack` (modo release)
- `npm run pack:debug` (modo debug)

**O que faz**:
- ✅ Atualiza package.json para usar versões específicas das dependências
- ✅ Gera arquivos .tgz de cada package
- ✅ Configura exports corretamente
- ✅ Valida se build existe antes de empacotar
- ✅ Exibe estatísticas de tamanho dos packages

### 4. `npm run publish:verdaccio`
**Objetivo**: Publicar packages no registry Verdaccio.

**Uso**: `npm run publish:verdaccio`

**O que faz**:
- ✅ Verifica se o registry está configurado para Verdaccio
- ✅ Publica packages em ordem de dependência
- ✅ Usa os arquivos .tgz gerados pelo pack
- ✅ Aguarda entre publicações para evitar conflitos
- ✅ Valida se todos os packages foram publicados

### 5. `npm run clean`
**Objetivo**: Limpar arquivos temporários e builds.

**Uso**: `npm run clean`

**O que faz**:
- ✅ Remove diretórios dist, node_modules, .turbo
- ✅ Remove arquivos .tgz, .log, .tsbuildinfo
- ✅ Remove backups de package.json
- ✅ Limpa tanto o diretório raiz quanto todos os packages

## Fluxo de Trabalho Recomendado

### Desenvolvimento
```bash
# 1. Atualizar versão (apenas quando necessário)
npm run version:update 3.0.12

# 2. Desenvolver usando workspace dependencies
# As dependências internas usam workspace:* durante desenvolvimento
```

### Build e Deploy
```bash
# 1. Limpar projeto
npm run clean

# 2. Compilar packages
npm run build

# 3. Empacotar packages
npm run pack

# 4. Publicar no Verdaccio
npm run publish:verdaccio
```

### Debug
```bash
# Para builds de debug (com timestamp)
npm run build:debug
npm run pack:debug
npm run publish:verdaccio
```

## Configuração do Verdaccio

Para usar o Verdaccio localmente:

```bash
# Instalar Verdaccio
npm install -g verdaccio

# Iniciar Verdaccio
verdaccio

# Configurar registry (em outro terminal)
pnpm config set registry http://localhost:4873
```

## Estrutura dos Scripts

Todos os scripts estão em `/scripts/` e seguem as seguintes convenções:

- ✅ **ES Modules**: Usando import/export
- ✅ **Colorização**: Output colorido para melhor UX
- ✅ **Validação**: Verificações antes de executar operações
- ✅ **Backup**: Backup automático de arquivos modificados
- ✅ **Recovery**: Restauração automática em caso de erro
- ✅ **Logs**: Informações detalhadas sobre o processo

## Dependências Durante Desenvolvimento vs Build

### Desenvolvimento
```json
{
  "dependencies": {
    "@archbase/core": "workspace:*",
    "@archbase/data": "workspace:*"
  }
}
```

### Build/Pack
```json
{
  "dependencies": {
    "@archbase/core": "3.0.11",
    "@archbase/data": "3.0.11"
  }
}
```

Essa abordagem garante que:
- ✅ Durante desenvolvimento, sempre use a versão local mais recente
- ✅ Durante build/pack, use versões específicas para garantir compatibilidade
- ✅ Vite configs são atualizados automaticamente
- ✅ Não há conflitos entre workspace e versões específicas

## Ordem de Build

Os packages são construídos na seguinte ordem para respeitar dependências:

1. **core** - Utilitários base
2. **data** - Camada de dados
3. **security** - Segurança
4. **layout** - Sistema de layout
5. **components** - Componentes UI
6. **advanced** - Componentes avançados
7. **admin** - Interface admin
8. **template** - Templates
9. **tools** - Ferramentas
10. **ssr** - Server-side rendering

## Troubleshooting

### Erro de dependência circular
```bash
npm run clean
npm run version:update <version>
npm run build
```

### Erro de permissão
```bash
chmod +x scripts/*.js
```

### Registry não configurado
```bash
pnpm config set registry http://localhost:4873
```

### Build falha
```bash
npm run clean
npm run build:debug  # Para mais informações
```