/**
 * Função para formatar valor com base no tipo de dados
 */
export declare function getFormattedValueByDataType(value: any, dataType: string, appContext: any, maskOptions?: any): string | number | boolean | null;
/**
 * Função para formatar valor para exportação
 */
export declare function getFormattedValueForExport(value: any, dataType: string, appContext: any, dateFormat?: string): string;
/**
 * Formata um valor decimal com número específico de casas decimais
 */
export declare function formatDecimal(value: number | string | undefined, decimalPlaces?: number, useThousandSeparator?: boolean): string;
/**
 * Formata um valor como moeda
 */
export declare function formatCurrency(value: number | string | undefined, currency?: string, locale?: string): string;
/**
 * Formata um valor como data
 */
export declare function formatDate(value: string | Date | undefined, dateFormat?: string): string;
/**
 * Formata um valor como data e hora
 */
export declare function formatDateTime(value: string | Date | undefined, dateTimeFormat?: string): string;
/**
 * Formata um valor como hora
 */
export declare function formatTime(value: string | Date | number | undefined, timeFormat?: string): string;
/**
 * Formata um valor booleano
 */
export declare function formatBoolean(value: boolean | undefined | null, trueLabel?: string, falseLabel?: string): string;
/**
 * Formata um valor enum com base em opções
 */
export declare function formatEnum(value: any, options: {
    value: any;
    label: string;
}[]): string;
//# sourceMappingURL=formatter.d.ts.map