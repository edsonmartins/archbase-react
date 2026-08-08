import { ScrollArea, Table } from '@mantine/core';
import type { ReactNode } from 'react';

export interface TabelaRolavelProps {
	children: ReactNode;
	/** Altura máxima antes de rolar. */
	maxHeight?: number | string;
}

/**
 * Uma tabela que rola dentro de si mesma.
 *
 * <p><b>Por que não deixar o painel rolar.</b> Com o scroll no contêiner, o cabeçalho da tabela sai
 * de vista assim que a lista passa de uma tela — e uma coluna de números sem cabeçalho não diz o que
 * é. Rolando aqui dentro, o cabeçalho fica fixo e o resto da tela (título, contagem, explicação)
 * permanece onde estava.
 *
 * <p>O {@code minWidth} vem do conteúdo: tabela larga rola na horizontal aqui, e não empurra a
 * página inteira para o lado.
 */
export const TabelaRolavel = ({ children, maxHeight = 420 }: TabelaRolavelProps) => (
	<ScrollArea.Autosize mah={maxHeight} type="hover" offsetScrollbars>
		<Table.ScrollContainer minWidth={480} type="native">
			{children}
		</Table.ScrollContainer>
	</ScrollArea.Autosize>
);
