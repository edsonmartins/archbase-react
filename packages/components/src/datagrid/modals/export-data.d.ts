export type ExportFormat = 'csv' | 'excel' | 'pdf';
export interface ExportConfig {
    format: ExportFormat;
    filename?: string;
    includeHeaders?: boolean;
    delimiter?: string;
    encoding?: string;
    sheetName?: string;
    selectedColumns?: string[];
    dateFormat?: string;
    numberFormat?: string;
}
export declare function exportData(data: any[], columns: any[], config: ExportConfig): Promise<void>;
//# sourceMappingURL=export-data.d.ts.map