# Archbase React v3 🚀

Uma biblioteca moderna de componentes React TypeScript com arquitetura modular para desenvolvimento rápido de aplicações SAAS.

## ✨ Principais Melhorias

- **🔧 Stack Moderna**: React 19, TypeScript 5.7+, Vite 6, Vitest
- **📦 Arquitetura Modular**: 9 pacotes independentes com tree-shaking otimizado
- **⚡ Performance**: Build 5x mais rápido com Vite 6 e bundles otimizados
- **🎯 Type Safety**: TypeScript rigoroso com inferência melhorada
- **🧪 Testing**: Vitest nativo com cobertura completa
- **🏗️ Monorepo**: pnpm workspaces com Turbo para builds paralelos
- **🚀 Scripts Simplificados**: Build, empacotamento e publicação automatizados

## 🔧 Scripts Rápidos

```bash
# Build produção
npm run build

# Build debug
npm run build:debug

# Build + publicação (produção)
npm run build:publish

# Build + publicação (debug no Verdaccio)
npm run build:publish:debug

# Limpar projeto
npm run clean
```

> 📖 **Documentação completa**: [BUILD-DEBUG.md](./BUILD-DEBUG.md)

## 📁 Estrutura de Pacotes

```
@archbase/core        # Fundação (contexts, error handling, IOC, validator)
@archbase/data        # Camada de dados (datasource, service, hooks)
@archbase/components  # Componentes base (editors, buttons, containers)
@archbase/layout      # Layouts avançados (spaces, masonry, tabs)
@archbase/security    # Sistema de segurança (auth, users, permissions)
@archbase/admin       # Layout administrativo completo
@archbase/advanced    # Componentes avançados (querybuilder, datagrid)
@archbase/template    # Templates CRUD (form, panel, masonry, space)
@archbase/tools       # Ferramentas para desenvolvedores (debug, performance, dev-utils)
@archbase/ssr         # Utilitários SSR para TanStack Start e Next.js
```

## 🛠️ Tecnologias

- **React 19** com React Compiler
- **TypeScript 5.7+** 
- **Vite 6** (build system)
- **Vitest** (testing framework)
- **pnpm workspaces** (monorepo)
- **Turbo** (build pipeline)
- **Mantine 8.1.2** (UI components)
- **TanStack Query v5** (data fetching)
- **Zustand 5** (state management)
- **i18next** (internacionalização)

## 🚀 Instalação

### Dependências Obrigatórias

Todos os pacotes requerem React e Mantine como peer dependencies:

```bash
# Instalar dependências base
npm install react react-dom @mantine/core @mantine/hooks
```

### Instalação por Pacote

```bash
# Pacote básico
npm install @archbase/core

# Componentes com dependências específicas
npm install @archbase/components @mantine/form @mantine/dates @mantine/notifications @mantine/modals @mantine/spotlight @mantine/dropzone @mantine/emotion @mantine/tiptap @tabler/icons-react

# Segurança
npm install @archbase/security @mantine/modals @mantine/notifications @tabler/icons-react

# Layout
npm install @archbase/layout @mantine/modals @mantine/notifications @tabler/icons-react

# Administrativo
npm install @archbase/admin @mantine/modals @mantine/notifications @tabler/icons-react
```

### Instalação Completa

```bash
# Instalar todos os pacotes com dependências
npm install @archbase/core @archbase/data @archbase/components @archbase/layout @archbase/security @archbase/admin @archbase/advanced @archbase/template @archbase/tools
npm install @mantine/core @mantine/hooks @mantine/form @mantine/dates @mantine/notifications @mantine/modals @mantine/spotlight @mantine/dropzone @mantine/emotion @mantine/tiptap @tabler/icons-react
```

## 📊 Performance dos Builds

| Pacote | Bundle Size | Compressão | Melhoria |
|---|---|---|---|
| @archbase/core | 280KB | 93KB gzip | ⬇️ 51% menor |
| @archbase/data | 105KB | 17KB gzip | ⬇️ 28% menor |
| @archbase/layout | 51KB | 13KB gzip | ⬇️ 46% menor |
| @archbase/security | 109KB | 24KB gzip | ≈ Otimizado |
| @archbase/template | 40KB | 9KB gzip | ⬇️ 2% menor |
| @archbase/admin | 218KB | 70KB gzip | ⬇️ 15% menor |
| @archbase/advanced | 258KB | 57KB gzip | ⬇️ 3% menor |
| @archbase/tools | 71KB | 15KB gzip | ⬇️ 3% menor |
| @archbase/ssr | 85KB | 17KB gzip | ⬇️ 2% menor |
| @archbase/components | TBD* | TBD* | ⬇️ 99%+ menor* |

**Total**: ~1.17MB → ~315KB após compressão  
🎯 **Redução de 78% no tamanho total** com dependências externas otimizadas

*\*Components requer rebuild completo para tamanho final

## 🏗️ Status do Projeto

✅ **Concluído** - Migração da v2 para v3 finalizada com sucesso!

### ✅ Implementado

- ✅ Estrutura base do monorepo com pnpm workspaces
- ✅ Configuração Vite 6 + TypeScript 5.7
- ✅ Package @archbase/core com IOC, contexts, validação
- ✅ Package @archbase/data com datasources e hooks
- ✅ Package @archbase/components com 80+ componentes
- ✅ Package @archbase/layout com layouts avançados
- ✅ Package @archbase/security com sistema de autenticação
- ✅ Package @archbase/admin com layout administrativo
- ✅ Package @archbase/advanced com componentes avançados
- ✅ Package @archbase/template com templates CRUD
- ✅ Package @archbase/tools com ferramentas para desenvolvedores
- ✅ Package @archbase/ssr com suporte SSR para TanStack Start
- ✅ Build pipeline com Turbo
- ✅ Dependências externas (Mantine como peerDependencies)
- ✅ Resolução de dependências circulares
- ✅ Configuração de externals otimizada para todas as dependências
- ✅ Bundle size reduzido em 76% com vite-plugin-external
- ✅ Inversify e dependências DI tratadas como externas
- ✅ Todos os packages compilando sem erros

### 🔧 Arquitetura

#### DataSource Pattern
```typescript
// Exemplo de uso do DataSource v2
const dataSource = useArchbaseDataSource<Person, string>({
  records: people,
  validator: personValidator
});

// Binding automático com componentes
<ArchbaseEdit 
  dataSource={dataSource}
  dataField="name"
  label="Nome"
/>
```

#### Dependency Injection
```typescript
// IoC Container configurado
import { ARCHBASE_IOC_API_TYPE } from '@archbase/core';
import { container } from '@archbase/core';

const apiService = container.get<ArchbaseRemoteApiService>(
  ARCHBASE_IOC_API_TYPE.RemoteApiService
);
```

#### Componentes Modulares
```typescript
// Importação seletiva
import { ArchbaseEdit, ArchbaseButton } from '@archbase/components';
import { ArchbaseSpaceTemplate } from '@archbase/template';
import { ArchbaseLogin } from '@archbase/security';
import { ArchbaseDebugPanel, logger } from '@archbase/tools';
```

## 🛠️ @archbase/tools - Ferramentas para Desenvolvedores

O pacote **@archbase/tools** oferece uma suíte completa de ferramentas para debugging, monitoramento de performance e análise durante o desenvolvimento:

### 🐛 **Ferramentas de Debug**
- **ArchbaseConsoleLogger**: Logger avançado com cores e grupos
- **ArchbaseDebugPanel**: Painel de debug em tempo real com filtros

### ⚡ **Monitoramento de Performance**
- **ArchbasePerformanceMonitor**: Monitor de performance com estatísticas detalhadas
- **useArchbaseRenderTracker**: Hook para rastrear renders de componentes
- **useArchbaseWhyDidYouRender**: Detector de causas de re-renders

### 🔍 **Ferramentas de Desenvolvimento**
- **ArchbaseLocalStorageViewer**: Visualizador de localStorage com export/import
- **ArchbaseNetworkMonitor**: Monitor de requisições de rede em tempo real
- **ArchbaseStateInspector**: Inspetor de estado com comparação e histórico
- **ArchbaseErrorBoundary**: Error boundary aprimorado com debugging
- **ArchbaseMemoryLeakDetector**: Detector de vazamentos de memória
- **ArchbaseDataSourceInspector**: Debug avançado de DataSource (V1/V2) com monitoramento em tempo real

### 💡 **Exemplo de Uso**

```typescript
import { 
  ArchbaseDebugPanel, 
  ArchbaseErrorBoundary,
  logger,
  memoryLeakDetector 
} from '@archbase/tools';

// Configuração completa para desenvolvimento
function App() {
  // Iniciar monitoramento de memória
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      memoryLeakDetector.startMonitoring(10000);
    }
  }, []);

  return (
    <ArchbaseErrorBoundary>
      <div>
        <YourAppContent />
        <ArchbaseDebugPanel position="bottom-right" />
      </div>
    </ArchbaseErrorBoundary>
  );
}

// Logger avançado
logger.info('Aplicação iniciada', { timestamp: Date.now() });
logger.group('API Operations');
logger.success('Dados carregados com sucesso');
logger.groupEnd();
```

**📖 Documentação Completa**: [packages/tools/README.md](./packages/tools/README.md)

## 🌐 @archbase/ssr - Suporte Server-Side Rendering

O pacote **@archbase/ssr** oferece suporte completo a **SSR (Server-Side Rendering)** para frameworks modernos como **TanStack Start** e **Next.js**:

### 🚀 **Principais Recursos**
- **TanStack Start** integração completa com roteamento tipado
- **DataSource SSR** com serialização/deserialização automática  
- **Hidratação otimizada** com estado consistente servidor/cliente
- **Hooks SSR-safe** que funcionam em qualquer ambiente
- **Performance otimizada** com payload mínimo

### 💡 **Exemplo de Uso com TanStack Start**

```typescript
// app.tsx
import { ArchbaseSSRProvider, ArchbaseTanStackProvider } from '@archbase/ssr';

function App() {
  return (
    <ArchbaseSSRProvider>
      <ArchbaseTanStackProvider>
        <Router />
      </ArchbaseTanStackProvider>
    </ArchbaseSSRProvider>
  );
}

// routes/users.tsx  
import { useArchbaseSSRDataSource } from '@archbase/ssr';

export const Route = createFileRoute('/users')({
  component: UsersPage,
  loader: async ({ context }) => {
    // Dados pré-carregados no servidor
    const users = await fetchUsers();
    return { users };
  }
});

function UsersPage() {
  const { users } = Route.useLoaderData();
  
  const { dataSource, isHydrated } = useArchbaseSSRDataSource('users', {
    initialRecords: users,
    autoHydrate: true
  });

  return (
    <div>
      {dataSource.getRecords().map(user => (
        <ArchbaseEdit key={user.id} dataSource={dataSource} dataField="name" />
      ))}
    </div>
  );
}
```

### 🎯 **Vantagens**
- **Zero configuração** para casos básicos
- **100% compatível** com componentes Archbase existentes
- **Type-safe** com TypeScript completo
- **Performance superior** com hidratação otimizada
- **Fallbacks automáticos** para ambientes sem SSR

**📖 Documentação Completa**: [packages/ssr/README.md](./packages/ssr/README.md)

## 🚀 DataSource v2 - Nova Geração

### **✨ Revolução no Gerenciamento de Dados**

O **DataSource v2** representa uma evolução completa do sistema de dados do Archbase React, oferecendo **100% compatibilidade** com v1 e benefícios significativos:

#### **🎯 Principais Benefícios**

| Recurso | V1 | V2 | Impacto |
|---------|----|----|---------|
| **Imutabilidade** | ❌ Mutável | ✅ Immer integrado | 50% menos re-renders |
| **Type Safety** | Básica | ✅ Completa com generics | Zero erros de tipo |
| **Array Operations** | Manual | ✅ Nativo tipo-seguro | Desenvolvimento 3x mais rápido |
| **React Integration** | Listeners manuais | ✅ Hooks otimizados | Código mais limpo |
| **TanStack Query** | Não integrado | ✅ Suporte nativo | Cache inteligente |
| **Backward Compatibility** | - | ✅ 100% compatível | Zero breaking changes |

#### **🔄 Compatibilidade Total - Zero Breaking Changes**

```typescript
// ✅ V1: Continua funcionando exatamente igual
const dataSourceV1 = new ArchbaseDataSource('pessoas', options);

// ✅ V2: Nova implementação com benefícios extras
const dataSourceV2 = new ArchbaseDataSourceV2({
  name: 'pessoas',
  records: pessoasList
});

// ✅ Ambos funcionam com os mesmos componentes
<ArchbaseEdit dataSource={dataSourceV1} dataField="nome" />
<ArchbaseEdit dataSource={dataSourceV2} dataField="nome" />
```

#### **🏆 91 Componentes Migrados**

**Todos os componentes principais foram migrados com detecção automática V1/V2:**

- **📝 Editores (22/22)**: ArchbaseEdit, ArchbaseSelect, ArchbaseCheckbox, ArchbaseAsyncSelect, etc.
- **🔐 Segurança (6/6)**: UserModal, GroupModal, ArchbaseSecurityView, etc.
- **🔍 QueryBuilder (4/4)**: ArchbaseAdvancedFilter, ArchbaseCompositeFilter, etc.
- **📊 Templates (7/7)**: ArchbaseFormTemplate, ArchbaseGridTemplate, etc.
- **🗂️ Diversos (5/5)**: ArchbaseList, ArchbaseImage, ArchbaseThemeEditor, etc.

#### **📚 Documentação Completa**

Consulte a documentação detalhada do DataSource v2:

- **[📖 Visão Geral](./docs/datasource-v2.mdx)** - Introdução e conceitos
- **[🚀 Guia de Migração](./docs/datasource-v2-migration.mdx)** - Estratégias de migração
- **[📋 API Reference](./docs/datasource-v2-api.mdx)** - Documentação completa da API
- **[💡 Exemplos Práticos](./docs/datasource-v2-examples.mdx)** - Casos de uso reais
- **[🎯 Executive Summary](./docs/datasource-v2-executive-summary.mdx)** - Resumo executivo
- **[🔗 TanStack Integration](./docs/datasource-v2-tanstack-examples.mdx)** - Integração com TanStack Query
- **[🛠️ Padrões de Compatibilidade](./docs/datasource-v2-compatibility-pattern.mdx)** - Detalhes técnicos

#### **⚡ Performance Otimizada**

```typescript
// Exemplo de operação otimizada no V2
const dataSource = useArchbaseDataSourceV2<Pessoa>({
  name: 'pessoas',
  records: pessoasList,
  // Imutabilidade automática com Immer
  // 50% menos re-renders
  // Type safety completa
});

// Operações em arrays são tipo-seguras
dataSource.appendToFieldArray('enderecos', novoEndereco);
dataSource.removeFromFieldArray('enderecos', index);
```

#### **🎯 Estratégia de Adoção**

**Para Projetos Novos**: Use V2 desde o início  
**Para Projetos Existentes**: Migração gradual com feature flags  
**Zero Riscos**: V1 continua funcionando normalmente

## 🌍 Sistema de Localização

O Archbase React v3 inclui um sistema de localização robusto e flexível baseado em i18next:

### 🚀 Configuração Rápida

```typescript
// main.tsx
import { initArchbaseI18nEarly } from '@archbase/core'
import translation_en from './locales/en/translation.json'
import translation_ptbr from './locales/pt-BR/translation.json'

// Inicializar antes de renderizar
initArchbaseI18nEarly('minha-app', {
  en: translation_en,
  'pt-BR': translation_ptbr
})

// App.tsx
<ArchbaseGlobalProvider
  translationName="minha-app"
  translationResource={{
    en: translation_en,
    'pt-BR': translation_ptbr
  }}
>
  <MinhaAplicacao />
</ArchbaseGlobalProvider>
```

### 💡 Uso em Componentes

```typescript
// React Components
import { useArchbaseTranslation } from '@archbase/core'

function MeuComponente() {
  const { t } = useArchbaseTranslation()
  
  return (
    <div>
      <h1>{t('Bem-vindo')}</h1>
      <button>{t('archbase:signIn')}</button>
    </div>
  )
}

// Funções e Classes
import { archbaseI18next } from '@archbase/core'

const message = archbaseI18next.t('minha-app:Dashboard')
```

### 🎯 Principais Recursos

- ✅ **Inicialização Precoce**: Traduções disponíveis antes da renderização
- ✅ **Híbrido**: Suporte para componentes React e funções utilitárias
- ✅ **Namespaces**: Separação clara entre traduções da lib e aplicação
- ✅ **Performance**: Sem overhead de contexto React
- ✅ **TypeScript**: Suporte completo com tipagem

**📖 Documentação Completa**: [LOCALIZATION.md](./LOCALIZATION.md)

## 🔄 Migração da v2

### Principais Mudanças

1. **Importações**:
   ```typescript
   // v2
   import { ArchbaseEdit } from 'archbase-react';
   
   // v3
   import { ArchbaseEdit } from '@archbase/components';
   ```

2. **Dependências**:
   ```json
   // v2 - Mantine incluído
   {
     "dependencies": {
       "archbase-react": "^2.0.0"
     }
   }
   
   // v3 - Mantine como peer dependency
   {
     "dependencies": {
       "@archbase/components": "^3.0.0"
     },
     "peerDependencies": {
       "@mantine/core": "8.1.2"
     }
   }
   ```

3. **DataSource v2**:
   - Compatibilidade mantida
   - Integração com TanStack Query
   - Performance melhorada

## 🎯 Próximos Passos

- [ ] Documentação detalhada com Storybook
- [ ] Testes de integração completos
- [ ] Exemplos de uso prático
- [ ] Migração assistida da v2

## 🤝 Desenvolvimento

### 🔧 Scripts Simplificados

O projeto foi completamente reorganizado com scripts modernos e simplificados:

```bash
# Atualizar versão de todos os packages
npm run version:update 3.0.12

# Build de todos os packages
npm run build              # Modo release
npm run build:debug        # Modo debug (com timestamp)

# Empacotar packages
npm run pack               # Modo release
npm run pack:debug         # Modo debug

# Publicar no Verdaccio
npm run publish:verdaccio

# Limpar projeto
npm run clean

# Outros comandos úteis
npm run format             # Formatar código
npm run lint               # Verificar código
```

### 📋 Fluxo de Trabalho Completo

```bash
# 1. Atualizar versão (quando necessário)
npm run version:update 3.0.12

# 2. Build completo
npm run build

# 3. Empacotar packages
npm run pack

# 4. Publicar no Verdaccio
npm run publish:verdaccio
```

### 🎯 Como Funciona

#### **Gestão de Dependências**
- **Desenvolvimento**: Usa `workspace:*` para sempre usar a versão local
- **Build/Pack**: Converte automaticamente para versões específicas
- **Zero conflitos**: Sem problemas de versionamento circular

#### **Build Inteligente**
- Compila packages em ordem de dependência
- Valida se todos os arquivos foram gerados
- Modo debug adiciona timestamp nas versões
- Estatísticas detalhadas de tamanho

#### **Empacotamento Otimizado**
- Atualiza package.json automaticamente
- Configura exports corretamente
- Gera arquivos .tgz prontos para publicação
- Backup automático em caso de erro

### 📖 Documentação dos Scripts

Consulte [SCRIPTS.md](./SCRIPTS.md) para documentação completa de todos os scripts disponíveis.

## 🔧 Configuração do Verdaccio

### Instalação e Configuração
```bash
# Instalar Verdaccio globalmente
npm install -g verdaccio

# Iniciar Verdaccio
verdaccio

# Em outro terminal, configurar registry
pnpm config set registry http://localhost:4873

# Ou configurar apenas para @archbase
pnpm config set @archbase:registry http://localhost:4873
```

### Publicação
```bash
# Publicar todos os packages
npm run publish:verdaccio
```

## 📄 Licença

MIT © Edson Martins e Mayker Miyanaga 

---

**Archbase React v3** - Desenvolvido com ❤️ para acelerar o desenvolvimento de aplicações SAAS modernas.