import { DateTimePickerProps } from '@mantine/dates';
import type { CSSProperties, ForwardedRef } from 'react';
import React from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
type OmittedDateTimePickerProps = Omit<DateTimePickerProps, 'value' | 'onChange'>;
export interface ArchbaseDateTimePickerEditProps<T, ID> extends OmittedDateTimePickerProps {
    /** Data source where the edit value will be assigned */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Field where the edit value should be assigned in the data source */
    dataField?: string;
    /** Indicates if the edit is disabled */
    disabled?: boolean;
    /** Indicates if the edit is read-only. Note: used in conjunction with data source status */
    readOnly?: boolean;
    /** Indicates if filling the edit is required */
    required?: boolean;
    /** Initial value */
    value?: Date | null;
    /** Edit style */
    style?: CSSProperties;
    /** Edit width */
    width?: string | number | undefined;
    /** Event occurs when focus exits the edit */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Event occurs when the edit receives focus */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Event when the edit value changes (internal use) */
    onChange?: (value: Date | null) => void;
    /** Event when the edit value changes (external use) */
    onChangeValue?: (value: Date | null) => void;
    /** Clear button properties */
    clearButtonProps?: Record<string, any>;
    /** With seconds input */
    withSeconds?: boolean;
    /** Value format */
    valueFormat?: string;
}
export declare const ArchbaseDateTimePickerEdit: <T, ID>(props: ArchbaseDateTimePickerEditProps<T, ID> & {
    ref?: ForwardedRef<HTMLButtonElement>;
}) => React.JSX.Element;
export {};
//# sourceMappingURL=ArchbaseDateTimePickerEdit.d.ts.map