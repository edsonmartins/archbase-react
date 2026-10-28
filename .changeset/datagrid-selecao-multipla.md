---
"@archbase/components": patch
---

ArchbaseDataGrid: a seleção múltipla deixa de perder itens. O clique no checkbox de uma linha também foca a célula, e o onCellFocused ligava o syncInProgress por 100 ms; o onSelectionChanged que chegava nessa janela era descartado, e quem ouvia onSelectedRowsChanged (o ArchbaseLookupDataTemplate, por exemplo) ficava só com o primeiro item marcado. A seleção agora é sempre repassada; só a sincronização do cursor com o DataSource respeita a janela. Além disso, o afterScroll do DataSource não apaga mais uma seleção com várias linhas: só garante que o registro atual fique visível.
