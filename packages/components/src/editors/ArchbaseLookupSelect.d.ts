import { ArchbaseDataSource } from '@archbase/data';
import { ArchbaseSelectProps } from './ArchbaseSelect';
export interface ArchbaseLookupSelectProps<T, ID, O> extends Omit<ArchbaseSelectProps<T, ID, O>, 'getOptionLabel'> {
    lookupDataSource: ArchbaseDataSource<O, ID> | undefined;
    lookupDataFieldText: string | ((record: any) => string);
    lookupDataFieldId: string;
    simpleValue?: boolean;
}
export declare function ArchbaseLookupSelect<T, ID, O>({ lookupDataSource, lookupDataFieldText, lookupDataFieldId, simpleValue, children, dataSource, dataField, options, error, getOptionValue, ...otherProps }: ArchbaseLookupSelectProps<T, ID, O>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseLookupSelect.d.ts.map