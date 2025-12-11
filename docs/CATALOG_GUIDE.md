# Catálogo de Componentes (component-catalog.json)

## Por que o catálogo existe
- Gera uma visão completa e atualizada de todos os exports públicos (componentes, hooks, utils).
- Serve como fonte única para IA, Storybook, portal editorial e scripts de ingestão.

## Como usar
1. Rodar `pnpm generate:catalog` (ou `pnpm build` / `pnpm postbuild`), preferencialmente com `CATALOG_CANONICAL_BASE` definido. No momento usamos `https://docs.archbase.com/storybook` para gerar `canonicalUrl` compatíveis com o Storybook hospedado:
   ```bash
   CATALOG_CANONICAL_BASE="https://docs.archbase.com/storybook" pnpm generate:catalog
   ```
2. O arquivo `component-catalog.json` publicado conterá:
   - `description`, `props`, `tags`, `examples`.
   - `status` (ex.: `stable`, `experimental`, deduzido por `@status` ou por interface).
   - `canonicalUrl` calculado a partir de `CATALOG_CANONICAL_BASE` ou do caminho fonte.
3. Use esse `canonicalUrl` para linkar:
   - Stories/MDX: `<a href="https://docs.../archbaseedit">ArchbaseEdit</a>`.
   - Recipes: mencionar no texto que o `component-catalog` fornece o link definitivo para cada componente.
   - `llms.txt` e `DOCS_AUDIT.md` (veja o parágrafo de cross-link em 9.1/9.2).

## Manutenção
- Ao adicionar novos componentes ou alterar props, rode `pnpm generate:catalog`.
- Se `CATALOG_CANONICAL_BASE` mudar (novo host de docs), regenere o catálogo para refletir os novos links.
- Considere incorporar a geração no pipeline de docs/storybook (deploy preview, prebuild, etc.).

## Reutilização
- O `component-catalog.json` também pode alimentar um site personalizado (ex: MCP/IA), que busca componentes por `tags` ou `status`.
- Quando publicar o Storybook, alinhe a navegação com as `tags` e `canonicalUrl` para evitar duplicidade.
