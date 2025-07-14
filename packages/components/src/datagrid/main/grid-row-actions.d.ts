export interface ArchbaseGridRowActionsProps<T extends Object> {
    onEditRow?: (row: T) => void;
    onRemoveRow?: (row: T) => void;
    onViewRow?: (row: T) => void;
    row: T;
    variant?: string;
    table?: any;
    cell?: any;
}
export declare function ArchbaseGridRowActions<T extends Object>({ onEditRow, onRemoveRow, onViewRow, row, variant, table, cell }: ArchbaseGridRowActionsProps<T>): import("react/jsx-runtime").JSX.Element;
export declare function createDataTableRowActions<T extends Object>(onEditRow?: (row: T) => void, onRemoveRow?: (row: T) => void, onViewRow?: (row: T) => void, variant?: string): ({ row, table }: {
    row: any;
    table: any;
}) => import("react/jsx-runtime").JSX.Element;
export default ArchbaseGridRowActions;
//# sourceMappingURL=grid-row-actions.d.ts.map