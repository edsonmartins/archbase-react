import { MantineSize } from '@mantine/core';
import React from 'react';
import { CSSProperties, ReactNode } from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseDateTimePickerRangeProps<T, ID> {
    /** Data source where the range values will be assigned */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Field for start date in the data source */
    dataFieldStart?: string;
    /** Field for end date in the data source */
    dataFieldEnd?: string;
    /** Indicates if the date picker range is disabled */
    disabled?: boolean;
    /** Indicates if the date picker range is read-only */
    readOnly?: boolean;
    /** Indicates if filling the date picker range is required */
    required?: boolean;
    /** Initial value */
    value?: [Date | null, Date | null];
    /** Style of the date picker range */
    style?: CSSProperties;
    /** Size of the date picker range */
    size?: MantineSize;
    /** Width of the date picker range */
    width?: string | number | undefined;
    /** Custom right section icon */
    icon?: ReactNode;
    /** Placeholder text for start date */
    placeholderStart?: string;
    /** Placeholder text for end date */
    placeholderEnd?: string;
    /** Label for the date picker range */
    label?: string;
    /** Description for the date picker range */
    description?: string;
    /** Error message */
    error?: string;
    /** Event when range value changes */
    onRangeChange?: (value: [Date | null, Date | null]) => void;
    /** Event when key down */
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    /** Event when key up */
    onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    /** Minimum date allowed */
    minDate?: Date;
    /** Maximum date allowed */
    maxDate?: Date;
    /** Date format */
    valueFormat?: string;
    /** With seconds input */
    withSeconds?: boolean;
    /** Clear button properties */
    clearButtonProps?: Record<string, any>;
}
export declare function ArchbaseDateTimePickerRange<T, ID>({ dataSource, dataFieldStart, dataFieldEnd, label, disabled, readOnly, size, width, style, description, onRangeChange, placeholderStart, placeholderEnd, icon, error, value, minDate, maxDate, valueFormat, withSeconds, clearButtonProps, required, }: ArchbaseDateTimePickerRangeProps<T, ID>): import("react/jsx-runtime").JSX.Element;
export declare namespace ArchbaseDateTimePickerRange {
    var displayName: string;
}
//# sourceMappingURL=ArchbaseDateTimePickerRange.d.ts.map