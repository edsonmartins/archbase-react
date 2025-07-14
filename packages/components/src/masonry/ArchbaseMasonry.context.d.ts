import React from 'react';
import { ArchbaseDataSource } from '@archbase/data';
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
declare const ArchbaseMasonryContext: React.Context<ArchbaseMasonryContextValue<any, any>>;
export declare const ArchbaseMasonryProvider: React.Provider<ArchbaseMasonryContextValue<any, any>>;
export default ArchbaseMasonryContext;
//# sourceMappingURL=ArchbaseMasonry.context.d.ts.map