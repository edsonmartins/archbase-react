import { ArchbaseDataGridColumnProps } from './archbase-data-grid-types';
export type GridFieldDataType = 'text' | 'integer' | 'currency' | 'boolean' | 'date' | 'datetime' | 'time' | 'enum' | 'image' | 'uuid';
export type InputFieldType = 'text' | 'select' | 'multi-select' | 'range' | 'checkbox' | 'date' | 'date-range';
export type AlignType = 'left' | 'center' | 'right';
export type EnumValuesColumnFilter = {
    label: string;
    value: string;
};
declare function ArchbaseDataGridColumn<T>(_props: ArchbaseDataGridColumnProps<T>): any;
declare namespace ArchbaseDataGridColumn {
    var defaultProps: {
        visible: boolean;
        size: number;
        align: string;
        enableColumnFilter: boolean;
        enableGlobalFilter: boolean;
        headerAlign: string;
        footerAlign: string;
        enableClickToCopy: boolean;
        enableSorting: boolean;
        dataType: string;
        inputFilterType: string;
        enumValues: any[];
    };
}
export default ArchbaseDataGridColumn;
//# sourceMappingURL=archbase-data-grid-column.d.ts.map