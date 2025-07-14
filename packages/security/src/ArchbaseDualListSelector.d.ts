import { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseDualListSelectorProps<T, U> {
    availableItemsDS: ArchbaseDataSource<T, any>;
    assignedItemsDS: ArchbaseDataSource<U, any>;
    idFieldAvailable: string | ((item: T) => string);
    labelFieldAvailable: string | ((item: T) => string);
    idFieldAssigned: string | ((item: U) => string);
    labelFieldAssigned: string | ((item: U) => string);
    handleCreateAssociationObject: (item: T) => U;
    width?: string;
    height?: string;
    titleAvailable?: string;
    titleAssigned?: string;
}
export declare function ArchbaseDualListSelector<T, U>({ availableItemsDS, assignedItemsDS, idFieldAvailable, labelFieldAvailable, idFieldAssigned, labelFieldAssigned, handleCreateAssociationObject, width, height, titleAvailable, titleAssigned }: ArchbaseDualListSelectorProps<T, U>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseDualListSelector.d.ts.map