import { PrintConfig } from './print-data';
export interface PrintModalProps {
    opened: boolean;
    onClose: () => void;
    onPrint: (config: PrintConfig) => void;
    columns: any[];
    defaultConfig?: Partial<PrintConfig>;
}
export declare function PrintModal({ opened, onClose, onPrint, columns, defaultConfig }: PrintModalProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=print-modal.d.ts.map