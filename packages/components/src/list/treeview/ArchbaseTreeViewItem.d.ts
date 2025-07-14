import React, { ReactNode } from 'react';
import { ArchbaseTreeNode, ArchbaseTreeViewOptions } from './ArchbaseTreeView.types';
export interface ArchbaseTreeViewItemProps {
    id: string;
    node: ArchbaseTreeNode;
    options: ArchbaseTreeViewOptions;
    level: number;
    onLoadDataSource: (id: string) => void;
    onSelectedStatusChanged: (id: string, selected: boolean) => void;
    onExpandedCollapsedChanged: (id: string, expanded: boolean) => void;
    onFocusedChanged: (id: string) => void;
    getFocused: () => ArchbaseTreeNode | undefined;
    onNodeDoubleClicked: (id: string, selected: boolean) => void;
    addNode: (id: string, text: string) => void;
    removeNode: (id: string) => void;
    customRenderText?: (node: ArchbaseTreeNode) => ReactNode;
    update: number;
}
export declare const ArchbaseTreeViewItem: React.FC<ArchbaseTreeViewItemProps>;
//# sourceMappingURL=ArchbaseTreeViewItem.d.ts.map