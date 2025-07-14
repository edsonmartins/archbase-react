import { ContextModalProps } from '@mantine/modals';
import { ChangeEventHandler, ReactNode } from 'react';
export declare class ArchbaseDialog {
    static showConfirmDialogYesNo: (title: string, question: string, onConfirm: () => void, onCancel: () => void) => void;
    static showInfo: (message: ReactNode, title?: string, onConfirm?: () => void) => void;
    static showWarning: (message: ReactNode, title?: string, onConfirm?: () => void) => void;
    static showSuccess: (message: ReactNode, title?: string, onConfirm?: () => void) => void;
    static showError: (message: ReactNode, title?: string, onConfirm?: () => void) => void;
    static showErrorWithDetails: (title: string, message: string, detailMessage?: string, onConfirm?: () => void) => void;
    static showInputDialog: (label: string, placeholder?: string, title?: string, onInputChange?: ChangeEventHandler<any> | undefined, onConfirm?: () => void, onCancel?: () => void) => void;
}
export declare const CustomShowErrorModal: ({ context, id, innerProps, }: ContextModalProps<{
    message: ReactNode;
    detailMessage?: ReactNode;
    onConfirm?: () => void;
}>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseDialog.d.ts.map