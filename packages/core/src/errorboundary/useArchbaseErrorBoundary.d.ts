export type UseArchbaseErrorBoundaryApi<TError> = {
    resetBoundary: () => void;
    showBoundary: (error: TError) => void;
};
export declare function useArchbaseErrorBoundary<TError = any>(): UseArchbaseErrorBoundaryApi<TError>;
//# sourceMappingURL=useArchbaseErrorBoundary.d.ts.map