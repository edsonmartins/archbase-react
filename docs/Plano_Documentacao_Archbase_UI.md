# Plano de Execução – Documentação em Camadas (Archbase React + Mantine v8) (v1.0)

> **Instrução:** Sempre que uma tarefa avançar de status, atualize esta tabela com a nova situação e registre a data no campo **"Última atualização"**. Os status sugeridos são `TODO`, `IN_PROGRESS`, `BLOCKED` e `DONE`.

## Legend
- `TODO`: ainda não iniciado.
- `IN_PROGRESS`: em execução.
- `BLOCKED`: impedida por dependência externa.
- `DONE`: concluída e validada.

**IMPORTANTE (critérios e regras do projeto):**
- **Não reinventar arquitetura:** documentar a lib como ela é hoje; refactors só quando necessários para clareza/consistência.
- **Docs “living” primeiro:** exemplos executáveis (Storybook) antes de texto longo.
- **Sem travar por MCP:** começar com `llms.txt` + catálogo estruturado; MCP vem depois.
- **Sem foco em testes** neste plano (o objetivo é documentação, DX e consistência de consumo).
- **Prioridade máxima:** desbloquear onboarding e uso correto de **Provider/Theme/I18n**, **Editores** e **DataGrid/Templates**.

---

## CONTEXTO (biblioteca React)
- Biblioteca baseada em **Mantine v8** e cresceu para múltiplos pacotes e muitos exports públicos.
- Problemas típicos identificados: falta de **catálogo de componentes**, poucos **exemplos/recipes**, inconsistências de **padrões de props/eventos** e dificuldade de “ensiná-la” para IA.
- Objetivo: criar documentação **em camadas**, com **deploy**, navegação e artefatos compatíveis com consumo por pessoas e por LLMs.

---

## 🎯 Objetivos de Resultado (Definition of Done global)
- Existe um **ponto de entrada** claro (“Getting Started”) com Provider + tema + i18n + SSR (se aplicável).
- Existe um **catálogo vivo** de componentes (Storybook) com:
  - Autodocs/Props table (quando possível)
  - Pelo menos 1 exemplo mínimo por componente prioritário
  - Recipes end-to-end para fluxos principais (Form + Grid)
- Existe um **site editorial** (ou seção editorial) com decisões, padrões e migrações.
- Existe um `llms.txt` publicado + um `component-catalog.json` gerado (mesmo que inicialmente simples).

---

## 📊 STATUS GERAL (Data: 2025-12-09)

### Gaps Identificados (Prioridade Alta)

| ID | Tarefa | Status | Última Atualização |
|----|--------|--------|-------------------|
| GAP-DOC-01 | Falta de “Getting Started” único (Provider/Theme/I18n/SSR) | TODO | - |
| GAP-DOC-02 | Catálogo vivo incompleto (muitos exports sem exemplo) | TODO | - |
| GAP-DOC-03 | Recipes end-to-end inexistentes ou insuficientes (Form + Grid + Templates) | TODO | - |
| GAP-DOC-04 | Convenções inconsistentes (`onChange*`, `value/defaultValue`, style props) | TODO | - |
| GAP-DOC-05 | IA não tem guia de navegação (`llms.txt`) nem catálogo estruturado | IN_PROGRESS | 2025-12-09 |
| GAP-DOC-06 | Deploy/preview por PR para docs (feedback rápido) | TODO | - |

---

# 🧱 Plano em Camadas

## Camada A — Catálogo Vivo (Storybook 8)
**Objetivo:** documentação executável + navegação por categorias. Serve para aprendizado, QA visual e como “fonte” para IA.

### Tarefas (Camada A)

| ID | Tarefa | Status | Última Atualização |
|----|--------|--------|-------------------|
| DOC-A-01 | Criar app de docs Storybook (monorepo-friendly) e padronizar scripts (`docs:dev`, `docs:build`) | DONE | 2025-12-10 |
| DOC-A-02 | Configurar “decorators” globais: Provider, tema (light/dark), i18n init, containers necessários | DONE | 2025-12-09 |
| DOC-A-03 | Criar página **Foundations** (MDX): setup, providers, theming, i18n, “pitfalls” comuns | DONE | 2025-12-09 |
| DOC-A-04 | Definir **IA de navegação** (categorias): Foundations, Forms/Editores, DataGrid, Templates, Security, Admin, Tools, SSR | DONE | 2025-12-09 |
| DOC-A-05 | Story baseline para **Editores prioritários** (mínimo + variações) | DONE | 2025-12-09 |
| DOC-A-06 | Story baseline para **DataGrid** (mínimo + loading/empty + actions + toolbar/export/print se existir) | DONE | 2025-12-09 |
| DOC-A-07 | Story baseline para **Templates** (FormTemplate/GridTemplate/etc. com exemplos reais) | DONE | 2025-12-09 |
| DOC-A-08 | Ajustar geração de props/autodocs (TS) e padronizar docs de props (onde for possível) | DONE | 2025-12-09 |
| DOC-A-09 | Publicar Storybook (ex: Vercel/Pages) com URL canônica e versão | IN_PROGRESS | 2025-12-10 |
| DOC-A-10 | Preview por PR (Chromatic ou alternativa) para feedback rápido de docs | IN_PROGRESS | 2025-12-10 |

**Critério de DONE (Camada A):**
- Storybook publicado e navegável.
- Foundations disponível.
- Editores + DataGrid + Templates com exemplos mínimos e variações principais.

---

## Camada B — Site Editorial (Guides)
**Objetivo:** guias “de decisão” e conteúdos longos: arquitetura, padrões, migração, SSR, segurança, práticas recomendadas.

### Ferramentas recomendadas
- **Docusaurus** (bem completo para versionamento e i18n) ou **Nextra** (mais leve) — escolha conforme stack do repo.

### Tarefas (Camada B)

| ID | Tarefa | Status | Última Atualização |
|----|--------|--------|-------------------|
| DOC-B-01 | Definir stack do portal editorial (Docusaurus vs Nextra) e padrão de estrutura | DONE | 2025-12-10 |
| DOC-B-02 | “Getting Started” editorial: instalação, peer deps, setup Provider/Theme/I18n, SSR/TanStack (se aplicável) | DONE | 2025-12-10 |
| DOC-B-03 | Guia “Arquitetura da UI”: pacotes, exports públicos, o que é interno, como evoluir | DONE | 2025-12-10 |
| DOC-B-04 | Guia “Padrões de Form”: validação, loading, erro, acessibilidade, data-aware | DONE | 2025-12-10 |
| DOC-B-05 | Guia “Padrões de DataGrid”: renderers, colunas, ações, paginação, filtros, export | DONE | 2025-12-10 |
| DOC-B-06 | Guia “Templates”: como montar telas rápido, composição recomendada | DONE | 2025-12-10 |
| DOC-B-07 | Guia “Segurança/Security-UI”: autenticação/roles/tenant (visão de consumo) | DONE | 2025-12-10 |
| DOC-B-08 | Guia de Migração (por versões): mudanças breaking + recipes de migração | DONE | 2025-12-10 |
| DOC-B-09 | Publicar portal editorial e linkar com Storybook (cross-links) | DONE | 2025-12-10 |

**Critério de DONE (Camada B):**
- Site editorial publicado com no mínimo: Getting Started, Arquitetura, Forms, DataGrid, Templates e Migração.

---

## Camada C — Recipes (Guias orientados a tarefa)
**Objetivo:** reduzir suporte e acelerar entrega com exemplos copiáveis, completos e “do jeito certo”.

### Lista mínima de Recipes (prioridade sugerida)
1. Form completo (validação + submit + loading + erro)
2. DataGrid (loading/empty + ações + toolbar)
3. Flow modal/drawer com confirmação
4. Layout admin (header + filtros + conteúdo)
5. Notificações/toasts
6. Busca remota (AsyncSelect/Lookup)
7. Upload/anexos (se existir)
8. Wizard/Stepper (se existir via templates/abas)

### Tarefas (Camada C)

| ID | Tarefa | Status | Última Atualização |
|----|--------|--------|-------------------|
| DOC-C-01 | Criar pasta/padrão de recipes (MDX + TSX) com checklist de acessibilidade | TODO | - |
| DOC-C-02 | Recipe 01: Form completo (validação, loading, erro) | TODO | - |
| DOC-C-03 | Recipe 02: DataGrid completo (loading/empty + ações + toolbar) | TODO | - |
| DOC-C-04 | Recipe 03: Modal/Drawer flow com confirmação | TODO | - |
| DOC-C-05 | Recipe 04: Layout admin com filtros e conteúdo | TODO | - |
| DOC-C-06 | Recipe 05: Notificações/toasts (padrão recomendado) | TODO | - |
| DOC-C-07 | Recipe 06: Busca remota (AsyncSelect/Lookup) | TODO | - |
| DOC-C-08 | Recipe 07: Upload/anexos (se aplicável) | TODO | - |
| DOC-C-09 | Recipe 08: Wizard/Stepper (se aplicável) | TODO | - |
| DOC-C-10 | Integrar recipes no Storybook e no portal editorial (cross-links) | TODO | - |

**Critério de DONE (Camada C):**
- Pelo menos 8 recipes publicados e navegáveis, com código completo e checklist de a11y.

---

## Camada D — Consistência e Convenções (DX)
**Objetivo:** reduzir divergências e “surpresas” na API, mantendo compatibilidade. Quando não der para padronizar agora, documentar exceções.

### Tarefas (Camada D)

| ID | Tarefa | Status | Última Atualização |
|----|--------|--------|-------------------|
| DOC-D-01 | Definir documento “Conventions” (naming, controlled/uncontrolled, eventos) | TODO | - |
| DOC-D-02 | Padrão para `onChange`: value-first (`onChangeValue(value, event?)`) e guideline quando fugir | TODO | - |
| DOC-D-03 | Padrão para `value/defaultValue` + `dataSource` (prioridade e regras) | TODO | - |
| DOC-D-04 | Padrão de styling: `className/styles/classNames/vars` (o que suportar e como) | TODO | - |
| DOC-D-05 | Marcar componentes/exports “experimental/legacy” com tags e/ou docs | TODO | - |
| DOC-D-06 | Revisar exports públicos: diferenciar público vs interno (sem quebrar; usar docs/aliases) | TODO | - |
| DOC-D-07 | Checklist por componente (“Doc DoD”): 1 exemplo mínimo + props + theming + a11y notes | TODO | - |

**Critério de DONE (Camada D):**
- Convenções publicadas e aplicadas pelo menos aos componentes prioritários (Editores + DataGrid + Templates).

---

## Camada E — IA-Friendly (LLMs) + Base para MCP
**Objetivo:** permitir que IA entenda rapidamente “como usar” e “o que existe”, sem depender de leitura humana do repo.

### Tarefas (Camada E)

| ID | Tarefa | Status | Última Atualização |
|----|--------|--------|-------------------|
| DOC-E-01 | Publicar `llms.txt` na raiz do site de docs (ou repositório, se público) | DONE | 2025-12-09 |
| DOC-E-02 | Gerar `component-catalog.json` (export + props + exemplos) como artefato do build | DONE (automatizado via `pnpm generate:catalog` + `postbuild`) | 2025-12-09 |
| DOC-E-03 | Adicionar “links canônicos” no catálogo (Storybook/portal editorial) | TODO | - |
| DOC-E-04 | Definir contrato de dados para futuro MCP (somente leitura) | TODO | - |
| DOC-E-05 | (Opcional) Implementar MCP server simples que serve o catálogo (search/get) | TODO | - |

### Esqueleto sugerido de `llms.txt` (primeira versão)
```text
# Archbase UI (Mantine v8) — LLM Guide

## Quick Start
- Install: <comandos>
- Provider: <link/section>
- Theme: <link/section>
- i18n: <link/section>

## Primary building blocks
- Editors: <link>
- DataGrid: <link>
- Templates: <link>

## Recipes
- Form completo: <link>
- Grid completo: <link>
...
```

**Critério de DONE (Camada E):**
- `llms.txt` publicado e `component-catalog.json` gerado automaticamente, referenciando docs reais.

---

# 📌 Prioridades (Roadmap recomendado)
1) **Camada A (Storybook) + Foundations** para destravar onboarding e navegação.
2) **Camada C (Recipes)** para acelerar entrega e padronizar uso correto.
3) **Camada D (Convenções)** para reduzir variação e suporte.
4) **Camada B (Editorial)** para arquitetura/migração/decisões.
5) **Camada E (IA-friendly)** para suporte a LLM e base do MCP.

---

# 📦 Entregáveis e Links (preencher durante execução)
- Storybook: `<URL>`
- Portal editorial: `<URL>`
- llms.txt: `<URL>/llms.txt`
- component-catalog.json: `<URL>/component-catalog.json`
- Changelog / Migrações: `<URL>`

---

# 🧰 Template de “Definition of Done” por Componente
Para marcar um componente como “documentado”:

- [ ] Está no Storybook com categoria correta
- [ ] Tem **exemplo mínimo** + 1 variação relevante
- [ ] Props principais documentadas (autodocs ou manual)
- [ ] Notes de a11y (se aplicável)
- [ ] Notes de theming/styling (como customizar)
- [ ] Link para recipe relacionada (se aplicável)

---

# ✅ Próximos passos imediatos (primeira semana)
| ID | Ação | Status | Última Atualização |
|----|------|--------|-------------------|
| NEXT-01 | Rodar kickoff e definir owners por camada (A/B/C/D/E) | TODO | - |
| NEXT-02 | Implementar Storybook + decorators (Provider/Theme/I18n) | TODO | - |
| NEXT-03 | Publicar Foundations + 3 componentes críticos (1 editor + DataGrid + 1 template) | TODO | - |
| NEXT-04 | Escrever Recipe #1 (Form completo) e linkar no Storybook | TODO | - |
| NEXT-05 | Publicar `llms.txt` inicial apontando para Foundations + Recipes | DONE | 2025-12-09 |
