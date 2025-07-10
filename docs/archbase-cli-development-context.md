# Archbase CLI - Contexto de Desenvolvimento

> **Documentação de contexto para continuação do desenvolvimento do Archbase CLI**

## 📋 **Resumo da Discussão**

Durante a sessão de desenvolvimento em dezembro de 2024, discutimos e iniciamos a implementação do **Archbase CLI** - uma ferramenta de linha de comando AI-friendly para o ecossistema Archbase.

## 🎯 **Problema que o CLI Resolve**

**Problema Principal**: IAs (como Claude Code) não conhecem bibliotecas customizadas, dificultando o desenvolvimento com archbase-react.

**Solução**: CLI com base de conhecimento estruturada + geração automática de código baseada em templates testados.

## 🏗️ **Decisões Técnicas Tomadas**

### **1. Estrutura do Projeto**
- ✅ **Projeto separado**: `/archbase-cli` (independente do archbase-react)
- ✅ **Escopo futuro**: Vai suportar archbase-react + archbase-java
- ✅ **Distribuição**: npm/homebrew para instalação global

### **2. Stack Tecnológica**
- ✅ **Linguagem**: Node.js + TypeScript
- ✅ **CLI Framework**: Commander.js
- ✅ **Templates**: Handlebars.js
- ✅ **Parsing**: @babel/parser para análise AST de React/TS
- ✅ **Prompts**: Inquirer.js para modo interativo

**Justificativa**: Facilita análise de código React/TS e reutiliza conhecimento existente da equipe.

### **3. Arquitetura de Comandos**

#### **Query Commands** (Consulta de conhecimento)
```bash
archbase query component FormBuilder
archbase query pattern "crud with validation"
archbase query examples --component=DataTable
archbase query search "how to implement user registration"
```

#### **Generate Commands** (Geração de código)
```bash
archbase generate form UserRegistration --fields=name,email,password --validation=yup
archbase generate view UserManagement --template=crud --entity=User
archbase generate page Dashboard --layout=sidebar
archbase generate component UserCard --type=display
```

#### **Create Commands** (Scaffolding completo)
```bash
archbase create project MyApp --boilerplate=admin-dashboard
archbase create module Products --with=forms,lists,details
archbase create list-boilerplates
```

### **4. Sistema de Knowledge Base**

#### **Híbrido: Automático + Manual**
- **Automático**: AST parsing extrai props, types, complexity
- **Manual**: Descriptions, use cases, examples, AI hints

#### **Estrutura**:
```
knowledge/
├── auto-generated.json    # Via AST analysis
├── manual-curated.json    # Curado pela equipe
└── patterns.json          # Padrões de uso
```

#### **Pipeline de Atualização**:
```bash
archbase knowledge scan ./src/components  # Auto-scan
archbase knowledge validate               # Validação
archbase knowledge publish                # Publicação
```

## 📁 **Estrutura Implementada**

```
archbase-cli/
├── package.json              # ✅ Dependências configuradas
├── tsconfig.json             # ✅ TypeScript configurado
├── README.md                 # ✅ Documentação básica
└── src/
    ├── bin/
    │   └── archbase.ts       # ✅ Entry point principal
    ├── commands/
    │   ├── query.ts          # ✅ Comandos de consulta
    │   ├── generate.ts       # ✅ Comandos de geração
    │   └── create.ts         # ✅ Comandos de scaffolding
    ├── analyzers/
    │   └── ComponentAnalyzer.ts  # ✅ AST parsing para React/TS
    ├── knowledge/
    │   └── KnowledgeBase.ts      # ✅ Sistema de conhecimento
    ├── generators/
    │   ├── FormGenerator.ts      # ✅ Gerador de formulários
    │   ├── ViewGenerator.ts      # 🚧 TODO: Implementar
    │   ├── PageGenerator.ts      # 🚧 TODO: Implementar
    │   └── ComponentGenerator.ts # 🚧 TODO: Implementar
    ├── templates/            # 📁 Para templates Handlebars
    └── utils/                # 📁 Para utilitários
```

## 🎯 **Recursos AI-Friendly Implementados**

### **1. Saídas Estruturadas**
```bash
# JSON para consumo programático
archbase query component FormBuilder --format=json --ai-context
```

### **2. Modo AI Assistant**
```bash
archbase --ai-mode query suggest-components "user registration form"
archbase --ai-mode generate recommend "e-commerce product page"
```

### **3. Contexto Automático para Claude Code**
```json
{
  "component": "FormBuilder",
  "aiSummary": "Dynamic form builder with validation. Best for: user forms, settings, CRUD operations.",
  "complexity": "medium",
  "codeSnippets": {
    "basic": "const form = <FormBuilder fields={fields} onSubmit={handleSubmit} />;",
    "withValidation": "// Include validation example"
  },
  "aiHints": [
    "Always include onSubmit handler",
    "Use validation for user input forms",
    "Consider FieldBuilder for complex fields"
  ]
}
```

## 📝 **Funcionalidades Implementadas**

### ✅ **Query Command** (Completo)
- Busca por componente específico
- Busca por padrões de uso
- Busca de exemplos com filtros
- Busca livre (free-form search)
- Saída formatada e AI-friendly

### ✅ **FormGenerator** (Completo)
- Parsing de campos via string: "name:text,email:email"
- Suporte a validação: yup/zod/none
- Templates: basic/wizard/validation
- Geração de testes e stories
- TypeScript support completo

### ✅ **ComponentAnalyzer** (Completo)
- AST parsing de React/TypeScript
- Extração de props e tipos
- Detecção de DataSource V1/V2 usage
- Cálculo de complexidade automático
- Análise de dependencies e imports

### ✅ **KnowledgeBase** (Completo)
- Sistema de cache para performance
- Busca case-insensitive
- Componentes default do archbase-react
- Padrões de uso predefinidos
- Suporte a auto-scan futuro

## 🚧 **Próximos Passos Definidos**

### **Fase 1: MVP (2-3 semanas)**
1. ✅ Comando `query component` - **FEITO**
2. ✅ Comando `generate form` básico - **FEITO**
3. 🚧 **Implementar ViewGenerator e PageGenerator**
4. 🚧 **Criar templates Handlebars para diferentes padrões**
5. 🚧 **1-2 boilerplates essenciais** (admin-dashboard, basic-app)
6. 🚧 **Integração com archbase-react real** (auto-scan)

### **Fase 2: Expansão (3-4 semanas)**
- Todos os comandos `generate` completos
- Boilerplates avançados (marketplace, saas-starter)
- Sistema de prompts interativos
- Base de conhecimento expandida (todos os componentes)
- Testes automatizados

### **Fase 3: Avançado (4-6 semanas)**
- Boilerplates remotos (Git, npm packages)
- Criação de boilerplates customizados
- Plugin system
- Integração com IDEs

## 🔗 **Integração com Archbase React**

### **Análise Automática**
O CLI pode analisar o projeto archbase-react automaticamente:

```bash
# Comando para scan automático
archbase knowledge scan /path/to/archbase-react/src/components

# Saída esperada
✅ Found 91 components migrated with V1/V2 compatibility
✅ Detected DataSource patterns
✅ Extracted 200+ prop definitions
✅ Generated AI-friendly descriptions
```

### **Padrões Detectados**
- ✅ **V1/V2 Compatibility Pattern**: 91 componentes migrados
- ✅ **useArchbaseV1V2Compatibility**: Hook padrão implementado
- ✅ **Duck typing detection**: isDataSourceV2 via appendToFieldArray
- ✅ **Force update pattern**: Apenas para V1

## 🤖 **Claude Code Integration**

### **Workflow Automático**
1. **Claude Code recebe requisito** do usuário
2. **Análise automática**: `archbase --ai-mode analyze-intent "requisito"`
3. **Consulta contexto**: `archbase query suggest-components --format=json`
4. **Geração base**: `archbase create project` ou `archbase generate`
5. **Refinamento**: `archbase query examples --similar-to=generated`
6. **Validação**: `archbase validate generated-code`

### **Arquivo de Configuração Claude**
```json
{
  "archbaseCli": {
    "enabled": true,
    "autoQuery": true,
    "contextFiles": [".archbaserc.json", "archbase-knowledge.json"]
  },
  "workflows": {
    "newComponent": [
      "archbase query suggest-components '{requirement}'",
      "archbase generate {type} {name} --based-on-query"
    ]
  }
}
```

## 📊 **Métricas de Sucesso Definidas**

- **Redução de tempo** para criar novos forms/views (meta: 70% redução)
- **Tempo de compreensão** da biblioteca pela IA (meta: redução de 90%)
- **Precisão** das sugestões de componentes (meta: >85%)
- **Código funcional** gerado sem intervenção manual (meta: >70%)
- **Satisfação** dos desenvolvedores usando IA + CLI

## 💡 **Insights Importantes**

### **Sobre AI-Friendly Design**
- Saídas JSON estruturadas são essenciais
- AI hints devem ser práticos e específicos
- Exemplos de código são mais valiosos que descrições longas
- Complexidade deve ser calculada automaticamente

### **Sobre Templates**
- Handlebars é flexível para customização
- Placeholders AI_PLACEHOLDER facilitam customização por IA
- Templates devem ser incrementais (básico → avançado)

### **Sobre Knowledge Base**
- Híbrido (auto + manual) é mais sustentável
- Cache é essencial para performance
- Busca deve ser fuzzy e case-insensitive
- Versionamento é importante para evolução

## 🎮 **Como Usar Esta Documentação**

### **Para continuar desenvolvimento:**

1. **Abra Claude Code** na pasta `/archbase-cli`
2. **Referencie esta documentação**: "Baseado na especificação e contexto em docs/archbase-cli-development-context.md"
3. **Próximo foco**: Implementar ViewGenerator e PageGenerator
4. **Testar com archbase-react real**: Configurar auto-scan

### **Para novos desenvolvedores:**
1. Leia esta documentação completa
2. Estude a especificação original em `docs/archbase_cli_spec.md`
3. Analise o código implementado em `/src`
4. Execute `npm run dev --help` para ver funcionalidades

---

**Documentação criada em**: Dezembro 2024  
**Status do projeto**: MVP em desenvolvimento  
**Próxima sessão**: Implementação de generators restantes e integração com archbase-react