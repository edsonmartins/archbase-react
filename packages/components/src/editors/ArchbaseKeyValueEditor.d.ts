interface ArchbaseKeyValueEditorProps {
    initialValue: string;
    keyLabel?: string;
    valueLabel?: string;
    valueOptions?: {
        value: string;
        label: string;
    }[];
    onChangeKeyValue: (value: string) => void;
    pairSeparator?: string;
    keyValueSeparator?: string;
    useBraces?: boolean;
    readOnly?: boolean;
    label?: string;
    error?: string;
    tooltipAdd?: string;
    tooltipRemove?: string;
    layout?: 'horizontal' | 'vertical';
    spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
export declare function ArchbaseKeyValueEditor({ initialValue, keyLabel, valueLabel, valueOptions, onChangeKeyValue, pairSeparator, keyValueSeparator, useBraces, readOnly, label, error, tooltipAdd, tooltipRemove, layout, spacing }: ArchbaseKeyValueEditorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ArchbaseKeyValueEditor.d.ts.map