export type MaskOptions = {
    delimiter?: string;
    lastOutput?: string;
    precision?: number;
    separator?: string;
    showSignal?: boolean;
    suffixUnit?: string;
    unit?: string;
    zeroCents?: boolean;
    pattern?: string;
    placeholder?: string;
};
export declare class ArchbaseMasker {
    private elements;
    constructor(elements: HTMLElement | HTMLElement[]);
    private static isAllowedKeyCode;
    private bindElementToMask;
    static toMoney(value: string, opts?: MaskOptions): string;
    static toPattern(value: string, opts: MaskOptions): string;
    maskMoney(opts: MaskOptions): void;
    maskNumber(): void;
    maskAlphaNum(): void;
    maskPattern(pattern: string, placeholder?: string): void;
    unMask(): void;
    static toNumber(value: string): string;
    static toAlphaNumeric(value: string): string;
}
//# sourceMappingURL=masker.d.ts.map