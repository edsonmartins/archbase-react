import type { ArchbaseTreeNodeKind } from '@archbase/security';

/**
 * O que está selecionado na árvore.
 *
 * <p>Os dois primeiros não são objetos do catálogo: são as duas ferramentas que antes eram abas
 * próprias. Tratá-los como nós da mesma árvore é o que faz a tela ter <b>uma</b> navegação em vez
 * de duas — e é o que permite a simulação receber o sujeito e a capacidade por clique, em vez de
 * digitação.
 */
export type ExplorerSelectionKind = ArchbaseTreeNodeKind | 'OVERVIEW' | 'SIMULATE';

export interface ExplorerSelection {
	kind: ExplorerSelectionKind;
	id: string;
	label: string;
}
