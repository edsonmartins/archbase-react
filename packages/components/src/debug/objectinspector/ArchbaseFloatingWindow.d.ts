import React from 'react';
import './ArchbaseFloatingWindow.css';
export interface ArchbaseFloatingWindowProps {
    id: string;
    children?: any;
    height: number;
    width: number;
    top?: number;
    left?: number;
    resizable?: boolean;
    titleBar?: {
        icon?: string | HTMLImageElement;
        title?: string;
        buttons?: {
            minimize?: boolean;
            maximize?: boolean;
            close?: () => void;
        };
    };
    style?: React.CSSProperties;
    /** Referência para o container que envolve o componente filho */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
}
export declare const ArchbaseFloatingWindow: React.FC<ArchbaseFloatingWindowProps>;
//# sourceMappingURL=ArchbaseFloatingWindow.d.ts.map