import { CloseButtonProps, MantineSize, TextInputProps } from '@mantine/core';
import { ArchbaseDataSource } from '@archbase/data';
import type { CSSProperties } from 'react';
import React from 'react';
export interface ArchbaseNumberEditProps<T, ID> extends TextInputProps, Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'value' | 'defaultValue' | 'onChange'>, React.RefAttributes<HTMLInputElement> {
    clearable?: boolean;
    clearButtonProps?: CloseButtonProps;
    dataSource?: ArchbaseDataSource<T, ID>;
    dataField?: string;
    disabled?: boolean;
    readOnly?: boolean;
    style?: CSSProperties;
    size?: MantineSize;
    width?: string | number | undefined;
    className?: string;
    error?: string;
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChangeValue?: (maskValue: string, value: number | null, event: any) => void;
    value?: number | string;
    decimalSeparator?: string;
    thousandSeparator?: string;
    precision?: number;
    allowNegative?: boolean;
    allowEmpty?: boolean;
    prefix?: string;
    suffix?: string;
    integer?: boolean;
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    onClear?: () => void;
    minValue?: number;
    maxValue?: number;
}
export declare function ArchbaseNumberEdit<T, ID>({ dataSource, dataField, disabled, readOnly, style, className, onFocusExit, onFocusEnter, onChangeValue, value, decimalSeparator, thousandSeparator, precision, allowNegative, allowEmpty, clearable, prefix, suffix, integer, wrapperProps, clearButtonProps, rightSection, unstyled, classNames, width, size, error, innerRef, onClear, minValue, maxValue, ...others }: ArchbaseNumberEditProps<T, ID>): import("react/jsx-runtime").JSX.Element;
export declare namespace ArchbaseNumberEdit {
    var defaultProps: {
        decimalSeparator: string;
        thousandSeparator: string;
        precision: number;
        allowNegative: boolean;
        prefix: string;
        suffix: string;
        integer: boolean;
        disabled: boolean;
        allowEmpty: boolean;
        clearable: boolean;
        value: string;
    };
    var displayName: string;
}
//# sourceMappingURL=ArchbaseNumberEdit.d.ts.map