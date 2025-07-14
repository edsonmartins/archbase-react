import 'jspdf-autotable';
export interface PrintConfig {
    title?: string;
    subtitle?: string;
    orientation?: 'portrait' | 'landscape';
    pageSize?: 'A4' | 'A3' | 'Letter';
    showHeader?: boolean;
    showFooter?: boolean;
    headerText?: string;
    footerText?: string;
    showPageNumbers?: boolean;
    showDate?: boolean;
    logo?: string;
    selectedColumns?: string[];
}
export declare function printData<T>(data: T[], columns: any[], config: PrintConfig): void;
//# sourceMappingURL=print-data.d.ts.map