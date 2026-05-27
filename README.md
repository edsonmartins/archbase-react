# Archbase React v4 🚀

Uma biblioteca moderna de componentes React TypeScript com arquitetura modular para desenvolvimento rápido de aplicações SAAS.

## ✨ Principais Melhorias

- **🔧 Stack Moderna**: React 19, TypeScript 5.7+, Vite 6, Vitest
- **🎨 Mantine 9.2.1**: design system atualizado, novo runtime de estilos
- **📦 Arquitetura Modular**: 12 pacotes independentes com tree-shaking otimizado
- **⚡ Performance**: Build 5x mais rápido com Vite 6 e bundles otimizados
- **🎯 Type Safety**: TypeScript rigoroso com inferência melhorada
- **🧪 Testing**: Vitest nativo com cobertura completa
- **🏗️ Monorepo**: pnpm workspaces com Turbo para builds paralelos
- **🚀 Scripts Simplificados**: Build, empacotamento e publicação automatizados

## 🆕 Novidades na v4

Releases 4.0.x trouxeram, além da migração para Mantine 9, várias melhorias acumulativas:

- **AG-Grid como engine padrão do `ArchbaseDataGrid`** (`@archbase/components`).
  A implementação MUI X continua disponível para compatibilidade, mas o export
  default agora vem do AG-Grid Community 35+.
- **Scroll perf** (release 4.0.25): `AgGridReact` envolvido em `React.memo`,
  `getRowId` estabilizado, `useStableChildren` evita rebuild de `columnDefs`
  quando as colunas são estruturalmente iguais; objeto `sx` da DataGrid (MUI X)
  movido para `useMemo`. Recomendações da [doc oficial AG-Grid](https://www.ag-grid.com/javascript-data-grid/scrolling-performance/).
- **`truncate` em colunas** (4.0.25): nova prop `truncate?: boolean` em
  `ArchbaseDataGridColumn` que ativa ellipsis + tooltip nativo do browser,
  contornando o overflow horizontal causado pelo wrapper flex do AG-Grid.
- **`actionsColumnWidth` default 120px** (4.0.24): antes era 60px, espremia 3+ ícones.
- **KeepAlive migrado para `keepalive-for-react`** (4.0.0): preserva estado das
  tabs entre navegações; expõe `useKeepAliveVisibility`, `useArchbaseRouteParams`,
  `useKeepAliveCache`.
- **Feedback visual ao fechar uma aba** (4.0.26): o `X` da aba vira um Loader
  enquanto o close está em andamento e a barra de progresso (`NavigationProgress`)
  dispara imediatamente; fallback timeout do reducer reduzido de 100ms para 0ms.
- **`ArchbaseAdminMainLayout`** ganhou variantes de sidebar (`standard`, `rail`,
  `minimal`) via `ArchbaseMantineSidebar`.
- **~60 novos componentes** documentados em [RELEASE_NOTES_v4.0.0.md](./RELEASE_NOTES_v4.0.0.md).

## 🔧 Scripts Rápidos

```bash
# Build produção
pnpm run build

# Build debug
pnpm run build:debug

# Build + publicação (produção)
pnpm run build:publish

# Build + publicação (debug no Verdaccio)
pnpm run build:publish:debug

# Limpar projeto
pnpm run clean
```

> 📖 **Documentação completa**: [BUILD-DEBUG.md](./BUILD-DEBUG.md)

## 📁 Estrutura de Pacotes

```
@archbase/core          # Fundação (contexts, error handling, IOC, validator)
@archbase/data          # Camada de dados (datasource, service, hooks)
@archbase/components    # Componentes base (editors, buttons, containers)
@archbase/layout        # Layouts avançados (spaces, masonry, tabs)
@archbase/security      # Sistema de segurança (auth, users, permissions)
@archbase/security-ui   # Componentes UI de segurança (forms, modals, views)
@archbase/feature-flags # Feature flags com Unleash
@archbase/admin         # Layout administrativo completo
@archbase/advanced      # Componentes avançados (querybuilder, datagrid)
@archbase/template      # Templates CRUD (form, panel, masonry, space)
@archbase/tools         # Ferramentas para desenvolvedores (debug, performance, dev-utils)
@archbase/ssr           # Utilitários SSR para TanStack Start e Next.js
```

## 🛠️ Tecnologias

- **React 19** com React Compiler
- **TypeScript 5.7+** 
- **Vite 6** (build system)
- **Vitest** (testing framework)
- **pnpm workspaces** (monorepo)
- **Turbo** (build pipeline)
- **Mantine 9.2.1** (UI components)
- **AG-Grid Community 35+** (DataGrid engine)
- **Tabler Icons 3.x** (iconografia)
- **TanStack Query v5** (data fetching)
- **Zustand 5** (state management)
- **i18next** (internacionalização)

## 🚀 Instalação

### Dependências Obrigatórias

Todos os pacotes requerem React e Mantine como peer dependencies:

```bash
# Instalar dependências base
pnpm install react react-dom @mantine/core @mantine/hooks
```

### Instalação por Pacote

```bash
# Pacote básico
pnpm install @archbase/core

# Componentes com dependências específicas
pnpm install @archbase/components @mantine/form @mantine/dates @mantine/notifications @mantine/modals @mantine/spotlight @mantine/dropzone @mantine/emotion @mantine/tiptap @tabler/icons-react

# Segurança
pnpm install @archbase/security @mantine/modals @mantine/notifications @tabler/icons-react

# Layout
pnpm install @archbase/layout @mantine/modals @mantine/notifications @tabler/icons-react

# Administrativo
pnpm install @archbase/admin @mantine/modals @mantine/notifications @tabler/icons-react
```

### Instalação Completa

```bash
# Instalar todos os pacotes com dependências
pnpm install @archbase/core @archbase/data @archbase/components @archbase/layout @archbase/security @archbase/security-ui @archbase/feature-flags @archbase/admin @archbase/advanced @archbase/template @archbase/tools @archbase/ssr
pnpm install @mantine/core @mantine/hooks @mantine/form @mantine/dates @mantine/notifications @mantine/modals @mantine/spotlight @mantine/dropzone @mantine/emotion @mantine/tiptap @tabler/icons-react
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

✅ **Atual: v4.0.26** — Mantine 9, AG-Grid como engine padrão da DataGrid,
otimizações de performance e UX (close de tabs com feedback visual).

✅ Migração v3 → v4 estável e em produção. Para detalhes consulte
[RELEASE_NOTES_v4.0.0.md](./RELEASE_NOTES_v4.0.0.md).

### ✅ Implementado

- ✅ Estrutura base do monorepo com pnpm workspaces
- ✅ Configuração Vite 6 + TypeScript 5.7
- ✅ Package @archbase/core com IOC, contexts, validação
- ✅ Package @archbase/data com datasources e hooks
- ✅ Package @archbase/components com 80+ componentes
- ✅ Package @archbase/layout com layouts avançados
- ✅ Package @archbase/security com sistema de autenticação
- ✅ Package @archbase/security-ui com componentes UI de segurança
- ✅ Package @archbase/feature-flags com integração Unleash
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
import { UserModal, GroupModal } from '@archbase/security-ui';
import { useFlag } from '@archbase/feature-flags';
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

## 🔐 @archbase/security-ui - Componentes UI de Segurança

O pacote **@archbase/security-ui** oferece componentes de interface prontos para gestão de segurança:

### 🚀 **Principais Recursos**

- **UserModal**: Modal completo para criação/edição de usuários
- **GroupModal**: Modal para gestão de grupos e permissões
- **ArchbaseSecurityView**: Visualização de configurações de segurança
- **Formulários validados**: Com integração automática com DataSource

### 💡 **Exemplo de Uso**

```typescript
import { UserModal, GroupModal } from '@archbase/security-ui';

function SecurityPage() {
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setUserModalOpen(true)}>Novo Usuário</Button>
      <Button onClick={() => setGroupModalOpen(true)}>Novo Grupo</Button>

      <UserModal
        opened={isUserModalOpen}
        onClose={() => setUserModalOpen(false)}
        dataSource={userDataSource}
      />

      <GroupModal
        opened={isGroupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        dataSource={groupDataSource}
      />
    </>
  );
}
```

## 🚦 @archbase/feature-flags - Feature Flags com Unleash

O pacote **@archbase/feature-flags** integra o sistema de feature flags **Unleash** ao Archbase React:

### 🚀 **Principais Recursos**

- **Integração Unleash**: Cliente proxy do Unleash para React
- **Hooks otimizados**: `useFlag` e `useVariant` para feature flags
- **Type-safe**: Tipagem completa para flags e variantes
- **Performance otimizada**: Cache inteligente de flags

### 💡 **Exemplo de Uso**

```typescript
import { useFlag, useVariant } from '@archbase/feature-flags';

function NewFeature() {
  const isEnabled = useFlag('new-feature');
  const variant = useVariant('new-feature');

  if (!isEnabled) {
    return <LegacyFeature />;
  }

  return <ModernFeature variant={variant} />;
}
```

### 🎯 **Vantagens**
- **Rollout control**: Libere recursos gradualmente
- **A/B testing**: Teste diferentes variantes
- **Kill switch**: Desative recursos instantaneamente
- **Targeting**: Habilite recursos para usuários específicos

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

## 🔄 Migração da v3 para v4

### Principais Breaking Changes

1. **Mantine 8 → 9**: peer dependencies sobem para `9.2.1`.
   ```bash
   pnpm add @mantine/core@9.2.1 @mantine/hooks@9.2.1 \
            @mantine/dates@9.2.1 @mantine/form@9.2.1 \
            @mantine/notifications@9.2.1 @mantine/modals@9.2.1 \
            @mantine/spotlight@9.2.1 @mantine/charts@9.2.1 \
            @mantine/code-highlight@9.2.1
   ```

2. **Renomes de props do Mantine 9** (aplicar no seu código consumidor):
   - `<Grid gutter=>` → `<Grid gap=>`
   - `<Collapse in=>` → `<Collapse expanded=>`
   - `useFullscreen()` → `useFullscreenDocument()`
   - `<Text color="...">` continua funcionando mas `c=` é o atalho preferido.

3. **`@tabler/icons-react` 2.x → 3.x**: peer dep agora `^3.27.0`.

4. **DataGrid passa a ser AG-Grid** (`@archbase/components`).
   A API de `<ArchbaseDataGrid>` + `<Columns>` + `<ArchbaseDataGridColumn>` foi
   preservada e funciona como antes. Cell renderers e value formatters
   continuam funcionando.

5. **KeepAlive interno**: troca de implementação custom para
   `keepalive-for-react`. Se você usava apenas `keepAlive: true` no
   `ArchbaseNavigationItem`, nada muda. Se você dependia de APIs internas como
   `register`/`unregister`/`touchAccess`, migre para `useKeepAliveCache()` —
   agora exposta com `destroy(cacheKey)`, `destroyAll()`, `destroyOther(...)`.

6. **`actionsColumnWidth` default**: 60 → 120. Caso tenha um override explícito
   `actionsColumnWidth={60}`, remova para usar o novo default.

### Migração da v2 (legado)

```typescript
// v2
import { ArchbaseEdit } from 'archbase-react';

// v4
import { ArchbaseEdit } from '@archbase/components';
```

Para mais detalhes consulte [RELEASE_NOTES_v4.0.0.md](./RELEASE_NOTES_v4.0.0.md).

## 🎯 Próximos Passos

- [ ] Documentação detalhada completa
- [ ] Testes de integração completos
- [ ] Exemplos de uso prático
- [ ] Migração assistida da v2

## 🧭 Portal editorial (Docusaurus)

O `docs-site` monta um portal com Getting Started, guias (Forms, DataGrid, Templates, Security, Migração) e receitas que referenciam o `component-catalog.json` (links canônicos).

### Comandos úteis

```bash
# Desenvolvimento da documentação
pnpm --filter docs-site install
pnpm --filter docs-site dev

# Build da documentação
pnpm --filter docs-site build

# Gerar catálogo de componentes
pnpm generate:catalog
```

## 🚀 Releases e Publicação

### Criando um Release

Existem duas formas de criar releases:

#### Opção 1: Via Git Tag

```bash
# Criar e pushar tag (dispara workflow automático)
git tag v4.0.27
git push origin v4.0.27
```

> ⚠️ A tag DEVE começar com `v` para os workflows (`publish-npm.yml` e
> `build-and-publish.yml`) dispararem. Eles têm trigger `tags: 'v*'`.

#### Opção 2: Via GitHub Actions (Manual)

1. Vá para: https://github.com/edsonmartins/archbase-react/actions/workflows/release.yml
2. Clique em "Run workflow"
3. Informe a versão (ex: 4.0.27)
4. Selecione se é pre-release

### O que acontece no Release

O workflow `.github/workflows/release.yml` executa:

1. **Build**: Compila todos os pacotes
2. **Pack**: Gera arquivos `.tgz` de cada pacote
3. **Release Notes**: Gera notas com commits desde a última versão
4. **GitHub Release**: Cria release com artefatos
5. **Deploy Docs**: Publica documentação em react.archbase.dev (apenas releases estáveis)

### Estrutura de Versões

- `v4.0.26` - Release estável
- `v4.0.26-beta.1` - Pre-release (beta)
- `v4.0.26-alpha.1` - Pre-release (alpha)

### Deploy Automático da Documentação

A cada push na branch `main` ou `archbase-react-develop`, o workflow `.github/workflows/deploy-docs-vps.yml`:

1. Build dos pacotes
2. Build da documentação Next.js
3. Deploy no VPS via Self-Hosted Runner
4. Atualização do container Docker Swarm

**Documentação disponível em**: https://react.archbase.dev

## 🤝 Desenvolvimento

### 🔧 Scripts Simplificados

O projeto foi completamente reorganizado com scripts modernos e simplificados:

```bash
# Atualizar versão de todos os packages
pnpm run version:update 4.0.26

# Build de todos os packages
pnpm run build              # Modo release
pnpm run build:debug        # Modo debug (com timestamp)

# Empacotar packages
pnpm run pack               # Modo release
pnpm run pack:debug         # Modo debug

# Publicar no Verdaccio
pnpm run publish:verdaccio

# Limpar projeto
pnpm run clean

# Outros comandos úteis
pnpm run format             # Formatar código
pnpm run lint               # Verificar código
```

### 📋 Fluxo de Trabalho Completo

```bash
# 1. Atualizar versão (quando necessário)
pnpm run version:update 4.0.26

# 2. Build completo
pnpm run build

# 3. Empacotar packages
pnpm run pack

# 4. Publicar no Verdaccio
pnpm run publish:verdaccio
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
pnpm install -g verdaccio

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
pnpm run publish:verdaccio
```

## 📄 Licença

MIT © Edson Martins e Mayker Miyanaga 

---

**Archbase React v4** - Desenvolvido com ❤️ para acelerar o desenvolvimento de aplicações SAAS modernas.
