import React, { Component, ErrorInfo } from 'react';
import { ArchbaseErrorBoundaryProps } from './types';
type ArchbaseErrorBoundaryState = {
    didCatch: true;
    error: any;
} | {
    didCatch: false;
    error: null;
};
export declare class ArchbaseErrorBoundary extends Component<ArchbaseErrorBoundaryProps, ArchbaseErrorBoundaryState> {
    constructor(props: ArchbaseErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): {
        didCatch: boolean;
        error: Error;
    };
    resetErrorBoundary(...args: any[]): void;
    componentDidCatch(error: Error, info: ErrorInfo): void;
    componentDidUpdate(prevProps: ArchbaseErrorBoundaryProps, prevState: ArchbaseErrorBoundaryState): void;
    render(): React.FunctionComponentElement<React.ProviderProps<import("./ArchbaseErrorBoundaryContext").ArchbaseErrorBoundaryContextType>>;
}
export {};
//# sourceMappingURL=ArchbaseErrorBoundary.d.ts.map