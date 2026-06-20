---
"@archbase/template": patch
---

Form templates agora respeitam o color scheme (dark/light)

`ArchbaseFormTemplate` e `ArchbaseTwoColumnFormTemplate` usavam cores claras fixas
(`--mantine-color-white`, `--mantine-color-gray-0/2/3/4`) que ficavam erradas no tema escuro
(painel branco, bordas claras). Substituídas pelos tokens dirigidos pelo atributo
`data-mantine-color-scheme` do Mantine (`--mantine-color-body`,
`--mantine-color-default-border`, `--mantine-color-default-hover`). Em light os valores são
equivalentes (sem mudança visual); em dark passam a renderizar corretamente. Backward-compatible:
não dependem da função CSS `light-dark()`, então funcionam em qualquer app sem configuração extra.
