import { Badge } from '@mantine/core';
import type { ReactNode } from 'react';

/**
 * A situação de uma concessão, em linguagem de quem opera.
 *
 * <p>O backend fala {@code EFFECTIVE}, {@code INERT} e {@code DENIED} — vocabulário do modelo. Quem
 * lê a tela quer saber se a permissão <b>vale</b>. "Inerte" não é palavra que alguém use para
 * decidir o que fazer; "não vale" é.
 *
 * <p>A tradução fica num lugar só de propósito: repetida em cada painel, uma tela acabaria dizendo
 * "inerte" e outra "não vale" para a mesma coisa.
 */
export const situacaoBadge = (situacao?: string | null): ReactNode => {
	switch (situacao) {
		case 'EFFECTIVE':
			return (
				<Badge size="sm" color="green" variant="light">
					vale
				</Badge>
			);
		case 'INERT':
			return (
				<Badge size="sm" color="yellow" variant="light">
					não vale
				</Badge>
			);
		case 'DENIED':
			return (
				<Badge size="sm" color="red" variant="light">
					bloqueada
				</Badge>
			);
		default:
			return (
				<Badge size="sm" color="gray" variant="light">
					—
				</Badge>
			);
	}
};
