import { ReactNode } from 'react';
import { MaskOptions } from '@archbase/core';
/**
 * Renderers padrão para cada tipo de dados no ArchbaseDataGrid
 */
/**
 * Renderiza texto com máscara opcional
 */
export declare const renderText: (cell: any, maskOptions?: MaskOptions) => ReactNode;
/**
 * Renderiza números inteiros
 */
export declare const renderInteger: (cell: any) => ReactNode;
/**
 * Renderiza valores monetários
 */
export declare const renderCurrency: (cell: any) => ReactNode;
/**
 * Renderiza valores com decimais
 */
export declare const renderFloat: (cell: any) => ReactNode;
/**
 * Renderiza valores percentuais
 */
export declare const renderPercent: (cell: any, decimalPlaces?: number) => ReactNode;
/**
 * Renderiza valores booleanos com checkbox
 */
export declare const renderBoolean: (cell: any) => ReactNode;
/**
 * Renderiza datas
 */
export declare const renderDate: (cell: any, dateFormat?: string) => ReactNode;
/**
 * Renderiza data e hora
 */
export declare const renderDateTime: (cell: any, dateTimeFormat?: string) => ReactNode;
/**
 * Renderiza valores de hora
 */
export declare const renderTime: (cell: any, timeFormat?: string) => ReactNode;
/**
 * Renderiza valores de enum/lista
 */
export declare const renderEnum: (cell: any, enumValues: Array<{
    label: string;
    value: string;
}>) => ReactNode;
/**
 * Renderiza UUID formatado
 */
export declare const renderUUID: (cell: any) => ReactNode;
/**
 * Retorna o renderer adequado com base no tipo de dado
 */
export declare const getRendererByDataType: (dataType: string, customRender?: (data: any) => ReactNode, options?: any) => ((cell: any) => ReactNode);
/**
 * Retorna o alinhamento recomendado com base no tipo de dado
 */
export declare const getAlignmentByDataType: (dataType: string, customAlign?: string) => string;
//# sourceMappingURL=archbase-data-grid-formatters.d.ts.map