/**
 * ArchbaseSafeMigrationWrapper
 *
 * Sistema de fallback seguro para migração V1/V2.
 * Garante que se V2 falhar, automaticamente volta para V1.
 *
 * ⚠️ CRITICAL: Este wrapper é obrigatório para todos os componentes migrados.
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
interface Props {
    children: ReactNode;
    fallbackComponent: React.ComponentType<any>;
    componentName: string;
    v2Props: any;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
interface State {
    hasError: boolean;
    error?: Error;
    fallbackActive: boolean;
}
/**
 * Error Boundary que implementa fallback automático V2 → V1
 */
export declare class ArchbaseSafeMigrationWrapper extends Component<Props, State> {
    constructor(props: Props);
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode>> | import("react/jsx-runtime").JSX.Element;
}
/**
 * Hook para criar wrapper de migração segura
 */
export declare function useArchbaseSafeMigration<TProps>(componentName: string, V1Component: React.ComponentType<TProps>, V2Component: React.ComponentType<TProps>): {
    (props: TProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
/**
 * HOC para aplicar migração segura
 */
export declare function withSafeMigration<TProps>(componentName: string, V1Component: React.ComponentType<TProps>, V2Component: React.ComponentType<TProps>): {
    (props: TProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
/**
 * Utilitário para detectar versão do DataSource
 */
export declare function detectDataSourceVersion(dataSource: any): 'V1' | 'V2' | 'NONE';
/**
 * Métricas para monitoramento de migração
 */
export declare const MigrationMetrics: {
    trackV2Usage: (componentName: string, dataSourceVersion: string) => void;
    trackFallback: (componentName: string, reason: string) => void;
    trackError: (componentName: string, error: Error) => void;
};
export default ArchbaseSafeMigrationWrapper;
//# sourceMappingURL=ArchbaseSafeMigrationWrapper.d.ts.map