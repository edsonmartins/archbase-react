import { Component, ComponentType, ErrorInfo, FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
declare function FallbackRender(props: FallbackProps): ReactNode;
export type FallbackProps = {
    error: any;
    resetErrorBoundary: (...args: any[]) => void;
    othersProps?: any;
};
type ArchbaseErrorBoundarySharedProps = PropsWithChildren<{
    onError?: (error: Error, info: ErrorInfo) => void;
    onReset?: (details: {
        reason: "imperative-api";
        args: any[];
    } | {
        reason: "keys";
        prev: any[] | undefined;
        next: any[] | undefined;
    }) => void;
    resetKeys?: any[];
}>;
export type ArchbaseErrorBoundaryPropsWithComponent = ArchbaseErrorBoundarySharedProps & {
    fallback?: never;
    FallbackComponent: ComponentType<FallbackProps>;
    fallbackRender?: never;
    othersProps?: any;
};
export type ArchbaseErrorBoundaryPropsWithRender = ArchbaseErrorBoundarySharedProps & {
    fallback?: never;
    FallbackComponent?: never;
    fallbackRender: typeof FallbackRender;
    othersProps?: any;
};
export type ArchbaseErrorBoundaryPropsWithFallback = ArchbaseErrorBoundarySharedProps & {
    fallback: ReactElement<unknown, string | FunctionComponent | typeof Component> | null;
    FallbackComponent?: never;
    fallbackRender?: never;
    othersProps?: any;
};
export type ArchbaseErrorBoundaryProps = ArchbaseErrorBoundaryPropsWithFallback | ArchbaseErrorBoundaryPropsWithComponent | ArchbaseErrorBoundaryPropsWithRender;
export {};
//# sourceMappingURL=types.d.ts.map