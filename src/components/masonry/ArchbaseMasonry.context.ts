import { ArchbaseDataSource } from '@components/datasource'
import React from 'react'

export interface ArchbaseMasonryContextValue<T,ID> {
    /** Fonte de dados da lista */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Function para notificar a lista que o item foi selecionado */
    handleSelectItem?: (index : number, data: T) => void;
    /** Id da lista pai */
    ownerId?: any;
    /** Cor de fundo do item ativo definido globalmente na lista */
    activeBackgroundColor?: string;
    /** Cor da fonte do item ativo definido globalmente na lista */
    activeColor?: string;
    /** Evento gerado quando o mouse está sobre um item */
    onItemEnter?: (event: React.MouseEvent, data: any) => void;
    /** Evento gerado quando o mouse sai de um item */
    onItemLeave?: (event: React.MouseEvent, data: any) => void;
}
const ArchbaseMasonryContext = React.createContext<ArchbaseMasonryContextValue<any,any>>({})
export const ArchbaseMasonryProvider = ArchbaseMasonryContext.Provider
export default ArchbaseMasonryContext