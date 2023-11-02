import React from 'react';
import { ArchbaseDataSource } from '../datasource';

export interface ArchbaseMasonryContextValue<T, ID> {
	/** Fonte de dados do masonry */
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Function para notificar o masonry que o item foi selecionado */
	handleSelectItem?: (index: number, data: T) => void;
	/** Id do masonry pai */
	ownerId?: any;
	/** Cor de fundo do item ativo definido globalmente no masonry */
	activeBackgroundColor?: string;
	/** Cor da fonte do item ativo definido globalmente no masonry */
	activeColor?: string;
	/** Evento gerado quando o mouse está sobre um item */
	onItemEnter?: (event: React.MouseEvent, data: any) => void;
	/** Evento gerado quando o mouse sai de um item */
	onItemLeave?: (event: React.MouseEvent, data: any) => void;
}
const ArchbaseMasonryContext = React.createContext<
	ArchbaseMasonryContextValue<any, any>
>({});
export const ArchbaseMasonryProvider = ArchbaseMasonryContext.Provider;
export default ArchbaseMasonryContext;
