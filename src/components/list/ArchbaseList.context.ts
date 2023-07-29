import { ArchbaseDataSource } from '@components/datasource'
import React from 'react'

export interface ArchbaseListContextValue<T,ID> {
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
    /** Alinhamento do item na lista */
    align?: 'left' | 'right' | 'center';
    /** Tipo de lista */
    type?: 'ordered' | 'unordered' | 'none';
    /** Evento gerado quando o mouse está sobre um item */
    onItemEnter?: (event: React.MouseEvent, data: any) => void;
    /** Evento gerado quando o mouse sai de um item */
    onItemLeave?: (event: React.MouseEvent, data: any) => void;
}
const ArchbaseListContext = React.createContext<ArchbaseListContextValue<any,any>>({})
export const ArchbaseListProvider = ArchbaseListContext.Provider
export default ArchbaseListContext