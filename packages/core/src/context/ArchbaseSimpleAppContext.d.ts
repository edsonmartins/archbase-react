import React, { ReactNode } from 'react';
export interface ArchbaseAppConfig {
    /** URL base da API */
    apiUrl?: string;
    /** Locale padrão da aplicação */
    locale?: string;
    /** Tema da aplicação */
    theme?: 'light' | 'dark' | 'auto';
    /** Features flags */
    features?: Record<string, boolean>;
    /** Configurações de debug */
    debug?: boolean;
    /** Formato de data */
    dateFormat?: string;
    /** Formato de data e hora */
    dateTimeFormat?: string;
    /** Formato de hora */
    timeFormat?: string;
    /** Configurações customizadas */
    custom?: Record<string, unknown>;
}
export interface ArchbaseAppContextValue {
    config: ArchbaseAppConfig;
    updateConfig: (updates: Partial<ArchbaseAppConfig>) => void;
}
declare const ArchbaseAppContext: React.Context<ArchbaseAppContextValue>;
export interface ArchbaseAppProviderProps {
    children: ReactNode;
    config: ArchbaseAppConfig;
    onConfigChange?: (config: ArchbaseAppConfig) => void;
}
export declare function ArchbaseAppProvider({ children, config: initialConfig, onConfigChange }: ArchbaseAppProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useArchbaseApp(): ArchbaseAppContextValue;
export { ArchbaseAppContext };
//# sourceMappingURL=ArchbaseSimpleAppContext.d.ts.map