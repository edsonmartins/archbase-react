# Storybook Playbook

## 1. Navegação IA (categorias)
O Storybook serve como catálogo vivo. Para orientar LLMs e manter o portal editorial navegável, seguimos estas categorias:

- **Foundations**: `docs/stories/Foundations.stories.mdx`, Providers (`ArchbaseGlobalProvider`, tema, i18n) e environment props.
- **Forms / Editores**: histórias em `packages/components/src/editors/*.stories.tsx` (ArchbaseEdit, AsyncSelect, MaskEdit, etc.).
- **DataGrid**: `archbase-data-grid.stories.tsx` e `archbase-data-grid-toolbar.stories.tsx`, com toolbar/exports/detail panels.
- **Templates**: `packages/template/*/stories.tsx` e `docs/stories/TemplateRecipes.stories.mdx`.
- **Security + Admin**: `security-ui` stories (SecurityView, ApiTokenView, UserModal) e layout admin (`ArchbaseAdminMainLayout.stories.tsx`).
- **Tools / Debug**: (planejar historias para `ArchbaseDebugPanel`, `useArchbaseDataSourceDebug` etc.)
- **SSR / Providers**: `docs/stories/CatalogLinks.stories.mdx` ou futuras histórias para `ArchbaseSSRProvider`.
- **Recipes**: MDX (`docs/stories/*Recipes.stories.mdx`) desacopladas, cada uma referenciando `component-catalog.json`.

Use esses nomes ao registrar stories para manter a coerência do catálogo (isso alimenta o `llms.txt` e serve de índice para IA).

## 2. Autodocs & Props

- A configuração `.storybook/main.ts` habilita `docs.autodocs = 'tag'`, então toda componente com `tags: ['autodocs']` ganha doc page com prop tables.
- Boas práticas:
  1. Declare props no componente (tipo `interface ArchbaseEditProps ...`). O script de catálogo também extraí JSDoc e `@status`.
  2. Nos stories, exporte `Meta` com `tags: ['autodocs']` e `parameters.docs.description.component`.
  3. Sempre que adicionar props (ex: `onChangeValue`, `size`, `dataSource`), atualize a interface e adicione descrição JSDoc para alimentar o catálogo.
  4. Use `render`/`args` nos stories para mostrar variações (loading, error, toolbar). Isso aparece automaticamente nas docs.

## 3. Publicação Storybook

1. Build: `pnpm storybook:build` (usa Vite).
2. Configure hospedagem (Vercel, Netlify, GitHub Pages) apontando `storybook-static`.
3. Defina `STORYBOOK_DEPLOY_URL` e use esse valor ao gerar `component-catalog.json` via `CATALOG_CANONICAL_BASE` (linke o portal editorial e o `llms.txt` aos mesmos URLs).
4. Inclua script no `package.json` ou `turbo` pipeline para gerar catálogo e, idealmente, fazer upload de preview (ex: `turbo run storybook:build && pnpm storybook:publish`). O `component-catalog.json` deve ser parte do deploy para o MCP ou IA consumirem a lista completa.

## 4. Preview por PR

-- Pipeline sugerido:
  1. Job `pnpm install`.
  2. Job `pnpm storybook:build`.
  3. Job `pnpm docs:site:build`.
  4. Job `CATALOG_CANONICAL_BASE="${STORYBOOK_DEPLOY_URL}" pnpm generate:catalog`.
  5. Artefatos: `storybook-static`, `docs-site/build`, `component-catalog.json`.
  6. Publicação: Chromatic / Vercel Preview (linka automaticamente ao PR).
  7. Opcional: anexar `component-catalog.json` e `llms.txt` como artefatos para audit trail.

- A cada PR, o catálogo pode ser regenerado com `CATALOG_CANONICAL_BASE` apontando para o preview (ex: `https://storybook-preview.example.com/${PR_NUMBER}`) para validar links antes da publicação final.

## 5. Documentação cruzada

- Linke cada story/recipe com o `canonicalUrl` do catálogo (`component-catalog.json`) para garantir consistência e rastreabilidade (veja `docs/stories/CatalogLinks.stories.mdx` e os demais recipes).
- Use `llms.txt` para direcionar IA a esses links e mantenha `DOCS_AUDIT.md` com o plano em camadas quando novas categorias ou stories forem criadas.
