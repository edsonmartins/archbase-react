# Archbase CLI - Especificação Técnica

## Visão Geral

O Archbase CLI é uma ferramenta de linha de comando projetada para facilitar o desenvolvimento com a biblioteca archbase-react, fornecendo capacidades de consulta de componentes e geração automática de código. Esta ferramenta resolve o problema de IAs não conhecerem bibliotecas customizadas, criando uma interface estruturada para acesso ao conhecimento e geração de código baseada em templates testados.

## Objetivos

- **Reduzir friction** no desenvolvimento de novas aplicações, views e forms
- **Padronizar** uso de componentes archbase-react
- **Acelerar** desenvolvimento com templates pré-configurados
- **Facilitar** integração com ferramentas de IA (Claude Code, etc.)
- **Manter** conhecimento atualizado da biblioteca

## Arquitetura do CLI

### Estrutura de Diretórios

```
archbase-cli/
├── package.json
├── bin/
│   └── archbase                    # Executable principal
├── src/
│   ├── commands/
│   │   ├── query.js               # Comandos de consulta
│   │   ├── generate.js            # Geração de código
│   │   ├── create.js              # Scaffolding e boilerplates
│   │   └── index.js               # Command router
│   ├── generators/
│   │   ├── view-generator.js      # Gerador de views
│   │   ├── form-generator.js      # Gerador de forms
│   │   ├── page-generator.js      # Gerador de páginas
│   │   ├── module-generator.js    # Gerador de módulos
│   │   └── project-generator.js   # Gerador de projetos
│   ├── boilerplates/
│   │   ├── admin-dashboard/       # Boilerplate dashboard admin
│   │   │   ├── template/         # Arquivos do template
│   │   │   ├── config.json       # Configuração do boilerplate
│   │   │   └── hooks/            # Scripts de setup
│   │   ├── marketplace/          # Boilerplate e-commerce
│   │   ├── saas-starter/         # Boilerplate SaaS
│   │   ├── mobile-app/           # Boilerplate React Native
│   │   └── custom/               # Boilerplates customizados
│   ├── templates/
│   │   ├── views/
│   │   │   ├── crud.hbs          # Template CRUD
│   │   │   ├── list.hbs          # Template de listagem
│   │   │   └── dashboard.hbs     # Template dashboard
│   │   ├── forms/
│   │   │   ├── basic.hbs         # Form básico
│   │   │   ├── wizard.hbs        # Form multi-step
│   │   │   └── validation.hbs    # Form com validação
│   │   ├── pages/
│   │   │   ├── authenticated.hbs  # Página autenticada
│   │   │   └── public.hbs        # Página pública
│   │   └── components/
│   │       ├── table.hbs         # Componente de tabela
│   │       └── modal.hbs         # Componente modal
│   ├── knowledge/
│   │   ├── components.json       # Base de conhecimento dos componentes
│   │   ├── patterns.json         # Padrões de uso
│   │   ├── examples.json         # Exemplos de implementação
│   │   └── migrations.json       # Guias de migração entre versões
│   ├── utils/
│   │   ├── file-utils.js         # Utilitários para manipulação de arquivos
│   │   ├── template-engine.js    # Engine de templates
│   │   └── validation.js         # Validação de parâmetros
│   └── config/
│       ├── default.json          # Configurações padrão
│       └── schema.json           # Schema de configuração
└── docs/
    ├── commands.md               # Documentação dos comandos
    ├── templates.md              # Guia de templates
    └── contributing.md           # Guia de contribuição
```

## Comandos Principais

### 1. Query (Consulta)

Permite consultar informações sobre componentes, padrões e exemplos.

```bash
# Consultar componente específico
archbase query component <nome-componente>
archbase query component FormBuilder

# Consultar padrões de uso
archbase query pattern <descrição>
archbase query pattern "crud with validation"
archbase query pattern "data table with filters"

# Consultar exemplos
archbase query examples --component=<nome>
archbase query examples --pattern=<padrão>
archbase query examples --tag=<tag>

# Busca livre
archbase query search "how to implement user registration"
```

**Saída exemplo:**
```json
{
  "component": "FormBuilder",
  "description": "Construtor de formulários dinâmicos com validação integrada",
  "props": {
    "fields": "Array<FieldConfig>",
    "validation": "ValidationSchema",
    "onSubmit": "Function"
  },
  "examples": [
    {
      "title": "Formulário básico de usuário",
      "code": "...",
      "file": "examples/basic-user-form.tsx"
    }
  ],
  "patterns": ["validation", "async-submit", "multi-step"]
}
```

### 2. Generate (Geração)

Gera código baseado em templates pré-configurados.

```bash
# Gerar view
archbase generate view <nome> --template=<template> [options]
archbase generate view UserManagement --template=crud --entity=User

# Gerar form
archbase generate form <nome> --fields=<fields> [options]
archbase generate form UserRegistration --fields=name,email,password --validation=yup

# Gerar página
archbase generate page <nome> --layout=<layout> [options]
archbase generate page Dashboard --layout=sidebar --components=chart,table,summary

# Gerar componente customizado
archbase generate component <nome> --type=<type> [options]
archbase generate component UserCard --type=display --props=user,actions
```

**Opções comuns:**
- `--output, -o`: Diretório de saída
- `--typescript, -ts`: Gerar em TypeScript (padrão)
- `--test`: Incluir arquivos de teste
- `--story`: Incluir Storybook stories
- `--dry-run`: Mostrar o que seria gerado sem criar arquivos

### 3. Create (Scaffolding & Boilerplates)

Cria estruturas completas de aplicações ou módulos a partir de boilerplates.

```bash
# Criar projeto a partir de boilerplate
archbase create project <nome> --boilerplate=<template>
archbase create project MyApp --boilerplate=admin-dashboard
archbase create project ECommerce --boilerplate=marketplace

# Listar boilerplates disponíveis
archbase create list-boilerplates
archbase create list-boilerplates --category=admin

# Criar aplicação completa
archbase create app <nome> --features=<features>
archbase create app MyApp --features=auth,users,reports,dashboard

# Criar módulo
archbase create module <nome> --with=<components>
archbase create module Products --with=forms,lists,details,crud

# Criar workspace multi-app
archbase create workspace <nome> --apps=<apps>
archbase create workspace ERP --apps=admin,client,mobile

# Criar a partir de boilerplate customizado
archbase create project <nome> --boilerplate=./custom-template
archbase create project MyCompanyApp --boilerplate=git+https://github.com/company/archbase-boilerplate
```

## Boilerplates

### Sistema de Boilerplates

Os boilerplates são projetos completos pré-configurados que incluem:

- **Estrutura de diretórios** otimizada
- **Configurações** (ESLint, Prettier, TypeScript, etc.)
- **Dependências** essenciais já instaladas
- **Exemplos funcionais** usando archbase-react
- **Documentação** específica do template
- **Scripts** de build e desenvolvimento
- **Testes** básicos configurados

### Boilerplates Oficiais

#### 1. Admin Dashboard (`admin-dashboard`)
```json
{
  "name": "admin-dashboard",
  "version": "1.0.0",
  "description": "Dashboard administrativo completo com autenticação, usuários e relatórios",
  "category": "admin",
  "features": [
    "authentication",
    "user-management", 
    "dashboard",
    "reports",
    "settings"
  ],
  "archbaseComponents": [
    "FormBuilder",
    "DataTable", 
    "Dashboard",
    "AuthProvider",
    "Navigation"
  ],
  "dependencies": {
    "@archbase/react": "^2.0.0",
    "react-router-dom": "^6.0.0",
    "react-query": "^4.0.0"
  },
  "structure": {
    "src/": {
      "pages/": "Páginas principais",
      "components/": "Componentes reutilizáveis",
      "hooks/": "Custom hooks",
      "services/": "APIs e serviços",
      "utils/": "Utilitários",
      "types/": "Definições TypeScript"
    }
  }
}
```

#### 2. Marketplace (`marketplace`)
E-commerce/marketplace com produtos, carrinho, pagamentos.

#### 3. SaaS Starter (`saas-starter`)
Base para aplicações SaaS com multitenancy, billing, etc.

#### 4. Mobile App (`mobile-app`)
React Native com archbase-react-native.

### Estrutura de um Boilerplate

```
boilerplates/admin-dashboard/
├── config.json                    # Configuração do boilerplate
├── template/                      # Arquivos do projeto
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Users/
│   │   │   └── Reports/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json.hbs           # Template do package.json
│   ├── README.md.hbs              # Template do README
│   ├── .env.example
│   └── docker-compose.yml
├── hooks/                         # Scripts de setup
│   ├── pre-install.js            # Antes da instalação
│   ├── post-install.js           # Após instalação
│   └── setup-database.js         # Setup específico
└── docs/                         # Documentação específica
    ├── getting-started.md
    ├── architecture.md
    └── deployment.md
```

### Configuração de Boilerplate (config.json)

```json
{
  "name": "admin-dashboard",
  "version": "1.2.0",
  "description": "Dashboard administrativo completo",
  "author": "Archbase Team",
  "category": "admin",
  "tags": ["dashboard", "admin", "crud", "auth"],
  "license": "MIT",
  
  "requirements": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0",
    "archbase-react": "^2.0.0"
  },
  
  "features": {
    "authentication": {
      "description": "Sistema de autenticação completo",
      "components": ["AuthProvider", "LoginForm", "ProtectedRoute"]
    },
    "user-management": {
      "description": "Gerenciamento de usuários com CRUD",
      "components": ["UserForm", "UserTable", "UserDetails"]
    },
    "dashboard": {
      "description": "Dashboard com métricas e gráficos",
      "components": ["DashboardLayout", "MetricCard", "ChartWidget"]
    }
  },
  
  "prompts": [
    {
      "name": "projectName",
      "message": "Nome do projeto:",
      "type": "input",
      "validate": "required|alphanumeric"
    },
    {
      "name": "database",
      "message": "Tipo de banco de dados:",
      "type": "select",
      "choices": ["postgresql", "mysql", "mongodb"],
      "default": "postgresql"
    },
    {
      "name": "features",
      "message": "Funcionalidades a incluir:",
      "type": "multiselect",
      "choices": [
        { "name": "auth", "message": "Autenticação", "checked": true },
        { "name": "users", "message": "Gerenciamento de usuários", "checked": true },
        { "name": "reports", "message": "Relatórios", "checked": false },
        { "name": "notifications", "message": "Notificações", "checked": false }
      ]
    }
  ],
  
  "scripts": {
    "pre-install": "hooks/pre-install.js",
    "post-install": "hooks/post-install.js",
    "setup": "hooks/setup-database.js"
  },
  
  "customization": {
    "theme": {
      "primary": "#007bff",
      "secondary": "#6c757d"
    },
    "branding": {
      "logo": "assets/logo.svg",
      "favicon": "assets/favicon.ico"
    }
  }
}
```

### Hooks de Setup

**hooks/post-install.js:**
```javascript
module.exports = async function postInstall(context) {
  const { projectPath, answers, utils } = context;
  
  // Configurar banco de dados baseado na escolha
  if (answers.database === 'postgresql') {
    await utils.copyFile('configs/postgresql.env', '.env');
    await utils.updatePackageJson({
      dependencies: {
        'pg': '^8.0.0'
      }
    });
  }
  
  // Instalar dependências condicionais
  if (answers.features.includes('reports')) {
    await utils.installDependencies(['recharts', 'jspdf']);
  }
  
  // Configurar tema customizado
  await utils.updateFile('src/theme.ts', (content) => {
    return content.replace(
      '{{PRIMARY_COLOR}}', 
      answers.theme?.primary || '#007bff'
    );
  });
  
  console.log('✅ Projeto configurado com sucesso!');
  console.log('📖 Veja o README.md para próximos passos');
};
```

### Comandos Avançados

```bash
# Criar com configuração interativa
archbase create project MyApp --boilerplate=admin-dashboard --interactive

# Criar com configuração via arquivo
archbase create project MyApp --boilerplate=admin-dashboard --config=./project.config.json

# Preview do que será criado
archbase create project MyApp --boilerplate=admin-dashboard --dry-run

# Criar a partir de repositório Git
archbase create project MyApp --boilerplate=git+https://github.com/company/custom-boilerplate

# Criar a partir de boilerplate local
archbase create project MyApp --boilerplate=./local-templates/company-template

# Atualizar boilerplates existentes
archbase update boilerplates

# Criar boilerplate customizado a partir de projeto existente
archbase create boilerplate --from=./existing-project --name=my-custom-template
```

### Estrutura do components.json

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-06-30",
  "components": {
    "FormBuilder": {
      "category": "forms",
      "description": "Construtor de formulários dinâmicos",
      "version": "1.2.0",
      "status": "stable",
      "props": {
        "fields": {
          "type": "Array<FieldConfig>",
          "required": true,
          "description": "Configuração dos campos do formulário"
        },
        "validation": {
          "type": "ValidationSchema",
          "required": false,
          "description": "Schema de validação (Yup ou Zod)"
        },
        "onSubmit": {
          "type": "(values: any) => Promise<void>",
          "required": true,
          "description": "Callback executado no submit"
        }
      },
      "examples": [
        {
          "title": "Formulário básico",
          "description": "Implementação básica de um formulário de usuário",
          "code": "examples/form-builder-basic.tsx",
          "tags": ["basic", "user", "crud"]
        }
      ],
      "patterns": [
        {
          "name": "validation",
          "description": "Formulário com validação avançada",
          "template": "forms/validation.hbs"
        }
      ],
      "relatedComponents": ["FieldBuilder", "ValidationProvider"],
      "dependencies": ["react-hook-form", "yup"],
      "migration": {
        "from": "0.9.x",
        "guide": "migrations/form-builder-1.0.md"
      }
    }
  }
}
```

### Estrutura do patterns.json

```json
{
  "patterns": {
    "crud-with-validation": {
      "title": "CRUD com validação",
      "description": "Padrão completo de CRUD com validação de formulários",
      "components": ["FormBuilder", "DataTable", "ConfirmDialog"],
      "template": "views/crud.hbs",
      "examples": ["examples/user-crud.tsx"],
      "complexity": "medium",
      "tags": ["crud", "validation", "forms", "table"]
    },
    "data-table-with-filters": {
      "title": "Tabela de dados com filtros",
      "description": "Tabela com filtros avançados, paginação e ordenação",
      "components": ["DataTable", "FilterBuilder", "Pagination"],
      "template": "components/filtered-table.hbs",
      "examples": ["examples/product-table.tsx"],
      "complexity": "medium",
      "tags": ["table", "filters", "pagination"]
    }
  }
}
```

## Templates

### Sistema de Templates

Usar Handlebars.js para flexibilidade e facilidade de manutenção.

**Exemplo de template (forms/basic.hbs):**

```handlebars
import React from 'react';
import { FormBuilder, FieldConfig } from '@archbase/react';
{{#if useValidation}}
import * as yup from 'yup';
{{/if}}

{{#if typescript}}
interface {{componentName}}Props {
  onSubmit: (values: {{entityName}}) => Promise<void>;
  {{#if initialValues}}initialValues?: Partial<{{entityName}}>;{{/if}}
}

interface {{entityName}} {
  {{#each fields}}
  {{name}}: {{type}};
  {{/each}}
}
{{/if}}

{{#if useValidation}}
const validationSchema = yup.object({
  {{#each fields}}
  {{#if validation}}
  {{name}}: {{validation}},
  {{/if}}
  {{/each}}
});
{{/if}}

const {{componentName}}{{#if typescript}}: React.FC<{{componentName}}Props>{{/if}} = ({
  onSubmit,
  {{#if initialValues}}initialValues{{/if}}
}) => {
  const fields{{#if typescript}}: FieldConfig[]{{/if}} = [
    {{#each fields}}
    {
      name: '{{name}}',
      label: '{{label}}',
      type: '{{type}}',
      {{#if required}}required: true,{{/if}}
      {{#if placeholder}}placeholder: '{{placeholder}}',{{/if}}
    },
    {{/each}}
  ];

  return (
    <FormBuilder
      fields={fields}
      {{#if useValidation}}validation={validationSchema}{{/if}}
      onSubmit={onSubmit}
      {{#if initialValues}}initialValues={initialValues}{{/if}}
    />
  );
};

export default {{componentName}};
```

## Configuração

### Arquivo de configuração (.archbaserc.json)

```json
{
  "version": "1.0.0",
  "archbaseReactVersion": "^2.0.0",
  "defaultTemplate": "typescript",
  "outputDir": "./src",
  "structure": {
    "components": "./src/components",
    "views": "./src/views",
    "pages": "./src/pages",
    "forms": "./src/forms",
    "utils": "./src/utils"
  },
  "preferences": {
    "typescript": true,
    "includeTests": true,
    "includeStories": false,
    "cssFramework": "tailwind",
    "validationLibrary": "yup"
  },
  "templates": {
    "custom": "./templates"
  }
}
```

## Integração com Ferramentas de IA

### Estratégias de Integração

O Archbase CLI foi projetado para ser "AI-friendly", fornecendo interfaces estruturadas que IAs podem usar para entender e gerar código com archbase-react.

#### 1. **Saídas Estruturadas para IA**

Todos os comandos suportam formato JSON para consumo programático:

```bash
# Saída estruturada para IA processar
archbase query component FormBuilder --format=json --ai-context
archbase query patterns --category=forms --format=json
archbase create list-boilerplates --format=json --detailed
```

**Exemplo de saída AI-friendly:**
```json
{
  "component": "FormBuilder",
  "aiSummary": "Dynamic form builder with validation. Best for: user forms, settings, CRUD operations.",
  "complexity": "medium",
  "usage": {
    "common": "User registration, settings forms",
    "advanced": "Multi-step wizards, dynamic field generation"
  },
  "codeSnippets": {
    "basic": "const form = <FormBuilder fields={fields} onSubmit={handleSubmit} />;",
    "withValidation": "// Include validation example"
  },
  "relatedComponents": ["FieldBuilder", "ValidationProvider"],
  "suggestedTemplates": ["forms/basic", "forms/validation"],
  "aiHints": [
    "Always include onSubmit handler",
    "Use validation for user input forms",
    "Consider FieldBuilder for complex fields"
  ]
}
```

#### 2. **Modo AI Assistant**

CLI com modo especial para assistentes de IA:

```bash
# Modo assistente - saídas otimizadas para IA
archbase --ai-mode query suggest-components "user registration form"
archbase --ai-mode generate recommend "e-commerce product page"
archbase --ai-mode explain pattern "data table with filters"
```

**Saída exemplo:**
```json
{
  "intent": "user-registration-form",
  "confidence": 0.95,
  "recommendations": {
    "components": ["FormBuilder", "ValidationProvider"],
    "patterns": ["forms/validation", "auth/registration"],
    "boilerplate": "admin-dashboard (if full app needed)",
    "estimatedComplexity": "low",
    "suggestedCommand": "archbase generate form UserRegistration --fields=name,email,password --validation=yup"
  },
  "context": {
    "commonPitfalls": ["Don't forget password confirmation", "Include email validation"],
    "bestPractices": ["Use proper validation", "Include loading states"],
    "examples": ["examples/user-registration.tsx"]
  }
}
```

#### 3. **Contexto Automático para Claude Code**

Claude Code pode usar comandos especiais para obter contexto:

```bash
# Análise de projeto existente
archbase analyze project --ai-context
archbase analyze dependencies --missing-archbase-components

# Sugestões baseadas em código existente
archbase suggest improvements --file=./src/UserForm.tsx
archbase suggest archbase-migration --from=react-hook-form
```

#### 4. **Templates com Placeholders para IA**

Templates que IAs podem facilmente customizar:

```handlebars
{{!-- Template com placeholders explícitos para IA --}}
import React from 'react';
import { FormBuilder } from '@archbase/react';

// AI_PLACEHOLDER: Add additional imports based on requirements
{{#if needsValidation}}
import * as yup from 'yup';
{{/if}}

// AI_PLACEHOLDER: Define interface based on fields
interface {{entityName}} {
  {{#each fields}}
  {{name}}: {{type}}; // AI_HINT: {{description}}
  {{/each}}
}

// AI_PLACEHOLDER: Customize validation schema
const validationSchema = yup.object({
  {{#each fields}}
  {{#if validation}}
  {{name}}: {{validation}}, // AI_HINT: {{validationNote}}
  {{/if}}
  {{/each}}
});

const {{componentName}} = () => {
  // AI_PLACEHOLDER: Add custom hooks or state here
  
  const handleSubmit = async (values: {{entityName}}) => {
    // AI_PLACEHOLDER: Implement submit logic
    console.log('Form submitted:', values);
  };

  return (
    <FormBuilder
      fields={fields}
      validation={validationSchema}
      onSubmit={handleSubmit}
      // AI_PLACEHOLDER: Add additional props based on requirements
    />
  );
};

export default {{componentName}};
```

#### 5. **Integração Específica com Claude Code**

**Arquivo de configuração para Claude Code (.claude-archbase.json):**
```json
{
  "archbaseCli": {
    "enabled": true,
    "autoQuery": true,
    "contextFiles": [
      ".archbaserc.json",
      "archbase-knowledge.json"
    ]
  },
  "workflows": {
    "newComponent": [
      "archbase query suggest-components '{requirement}'",
      "archbase generate {type} {name} --based-on-query"
    ],
    "newProject": [
      "archbase create list-boilerplates --ai-context",
      "archbase create project {name} --boilerplate={selected}"
    ]
  },
  "aiHints": {
    "beforeGeneration": "Always query archbase components first",
    "preferredPatterns": ["validation", "typescript", "responsive"],
    "avoidPatterns": ["inline-styles", "direct-dom-manipulation"]
  }
}
```

**Fluxos automáticos para Claude Code:**

1. **Análise de Requisito Automática:**
```bash
# Claude Code pode usar internamente
archbase --ai-mode analyze-intent "Create a user management page with search and filters"
# Retorna: boilerplate sugestão + componentes + templates
```

2. **Geração Iterativa:**
```bash
# Claude Code cria projeto base
archbase create project UserManagement --boilerplate=admin-dashboard

# Claude Code gera componentes específicos
archbase generate view UserList --pattern=data-table-with-filters
archbase generate form UserForm --fields=name,email,role --validation=yup

# Claude Code consulta para refinamentos
archbase query examples --similar-to=./src/UserForm.tsx
```

#### 6. **Knowledge Base para IA Training**

Arquivo especial para treinar contexto de IA:

**archbase-ai-knowledge.json:**
```json
{
  "version": "1.0.0",
  "purpose": "AI context for archbase-react development",
  "quickReference": {
    "commonComponents": {
      "FormBuilder": "Use for: forms, user input, data collection",
      "DataTable": "Use for: lists, search results, data display",
      "Dashboard": "Use for: metrics, charts, admin panels"
    },
    "patterns": {
      "crud": "FormBuilder + DataTable + validation",
      "search": "DataTable + FilterBuilder + pagination",
      "wizard": "FormBuilder + multi-step + progress"
    },
    "decisionTree": {
      "needsForm": "Use FormBuilder",
      "needsList": "Use DataTable",
      "needsAuth": "Use AuthProvider + boilerplate",
      "needsFullApp": "Use boilerplate first"
    }
  },
  "codePatterns": {
    "imports": [
      "import { FormBuilder, DataTable } from '@archbase/react';",
      "import { useArchbaseForm } from '@archbase/react/hooks';"
    ],
    "commonCode": {
      "basicForm": "// Code example",
      "dataTable": "// Code example",
      "authGuard": "// Code example"
    }
  },
  "troubleshooting": {
    "commonIssues": [
      {
        "problem": "Form not validating",
        "solution": "Add validation prop to FormBuilder",
        "example": "validation={yup.object({...})}"
      }
    ]
  }
}
```

#### 7. **Comandos de Debug para IA**

```bash
# Debug de geração para IA entender erros
archbase debug last-generation --explain
archbase debug component-usage FormBuilder --in-project
archbase debug why-failed --component=UserForm --verbose

# Validação de código gerado
archbase validate generated-code --file=./src/UserForm.tsx
archbase lint archbase-patterns --fix
```

### Fluxo de trabalho completo com Claude Code:

1. **Claude Code recebe requisito** do usuário
2. **Análise automática:** `archbase --ai-mode analyze-intent "requisito"`
3. **Consulta contexto:** `archbase query suggest-components --format=json`
4. **Geração base:** `archbase create project` ou `archbase generate`
5. **Refinamento:** `archbase query examples --similar-to=generated`
6. **Validação:** `archbase validate generated-code`
7. **Customização final** pelo Claude Code

### Métricas de Integração:

- **Tempo de compreensão** da biblioteca pela IA (meta: redução de 90%)
- **Precisão** das sugestões de componentes (meta: >85%)
- **Código funcional** gerado sem intervenção manual (meta: >70%)
- **Satisfação** dos desenvolvedores usando IA + CLI (pesquisas)

## Fases de Implementação

### Fase 1: MVP (2-3 semanas)
- [ ] Comando `query component`
- [ ] Comando `generate form` básico
- [ ] **1-2 boilerplates essenciais** (admin-dashboard, basic-app)
- [ ] Base de conhecimento inicial (5-10 componentes principais)
- [ ] Templates básicos (form, view simples)
- [ ] Configuração inicial

### Fase 2: Expansão (3-4 semanas)
- [ ] Todos os comandos `query`
- [ ] Comandos `generate` completos
- [ ] **Boilerplates avançados** (marketplace, saas-starter)
- [ ] **Sistema de prompts interativos** para boilerplates
- [ ] Templates avançados (CRUD, dashboard)
- [ ] Base de conhecimento expandida (todos os componentes)
- [ ] Testes automatizados

### Fase 3: Avançado (4-6 semanas)
- [ ] **Boilerplates remotos** (Git, npm packages)
- [ ] **Criação de boilerplates customizados**
- [ ] **Hooks de setup avançados**
- [ ] Plugin system
- [ ] Integração com IDEs
- [ ] Documentação interativa

## Testes

### Estratégia de testes:

```javascript
// Exemplo de teste para generator
describe('FormGenerator', () => {
  it('should generate basic form with validation', () => {
    const options = {
      name: 'UserForm',
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'password', type: 'password', required: true }
      ],
      validation: 'yup'
    };
    
    const result = generateForm(options);
    
    expect(result.files).toHaveLength(1);
    expect(result.files[0].content).toContain('yup.object');
    expect(result.files[0].content).toContain('FormBuilder');
  });
});
```

## Métricas de Sucesso

- **Redução de tempo** para criar novos forms/views (meta: 70% redução)
- **Consistência** de código (usar análise estática)
- **Adoção** pela equipe (meta: 80% dos novos componentes via CLI)
- **Satisfação** dos desenvolvedores (pesquisas trimestrais)

## Extensibilidade

### Plugin System (Fase 3)

```javascript
// Exemplo de plugin customizado
module.exports = {
  name: 'company-forms',
  commands: {
    'generate:company-form': require('./commands/generate-company-form')
  },
  templates: './templates',
  knowledge: './knowledge.json'
};
```

### Templates Customizados

Permitir que equipes criem seus próprios templates e padrões específicos da empresa.

## Conclusão

O Archbase CLI representa uma solução prática e escalável para o problema de desenvolvimento com bibliotecas customizadas. Ao combinar consulta de conhecimento estruturado com geração automática de código, a ferramenta elimina a necessidade de IAs "conhecerem" a biblioteca, fornecendo uma interface clara e sempre atualizada para acesso às capacidades da archbase-react.

A implementação em fases permite entrega de valor rapidamente enquanto constrói uma base sólida para funcionalidades avançadas futuras.