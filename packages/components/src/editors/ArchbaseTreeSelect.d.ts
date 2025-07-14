import { ArchbaseTreeNode, ArchbaseTreeViewProps } from '../list';
import React, { ReactNode } from 'react';
export interface ArchbaseTreeSelectProps extends ArchbaseTreeViewProps {
    icon?: ReactNode | undefined;
    label?: string | undefined;
    placeholder?: string | undefined;
    value?: string;
    width: string;
    widthTreeView?: string;
    heightTreeView?: string;
    renderComponent?: ReactNode | undefined;
    allowNodeSelectType?: string[];
    onConfirm?: (node: ArchbaseTreeNode) => void;
    onCancel?: () => void;
    disabled?: boolean;
}
export declare const ArchbaseTreeSelect: React.ForwardRefExoticComponent<ArchbaseTreeSelectProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=ArchbaseTreeSelect.d.ts.map