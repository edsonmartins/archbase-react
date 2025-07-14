import { ExportConfig } from './export-data';
export interface ExportModalProps {
    opened: boolean;
    onClose: () => void;
    onExport: (config: ExportConfig) => void;
    columns: any[];
    defaultConfig?: Partial<ExportConfig>;
}
export declare function ExportModal({ opened, onClose, onExport, columns, defaultConfig }: ExportModalProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=export-modal.d.ts.map