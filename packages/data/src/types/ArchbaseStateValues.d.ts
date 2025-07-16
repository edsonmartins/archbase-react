export type ArchbaseStateValues = {
    values: Map<string, any>;
    setValue: (key: string, value: any) => void;
    getValue: (key: any) => any;
    existsValue: (key: string) => boolean;
    clearValue: (key: string) => void;
    clearAllValues: () => void;
    reset: () => void;
};
//# sourceMappingURL=ArchbaseStateValues.d.ts.map
