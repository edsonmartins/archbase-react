import React, { createContext, ReactNode, useContext, useState, useCallback } from 'react';

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

const ArchbaseAppContext = createContext<ArchbaseAppContextValue | undefined>(undefined);

export interface ArchbaseAppProviderProps {
  children: ReactNode;
  config: ArchbaseAppConfig;
  onConfigChange?: (config: ArchbaseAppConfig) => void;
}

export function ArchbaseAppProvider({ 
  children, 
  config: initialConfig,
  onConfigChange 
}: ArchbaseAppProviderProps) {
  const [config, setConfig] = useState<ArchbaseAppConfig>(initialConfig);

  const updateConfig = useCallback((updates: Partial<ArchbaseAppConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  }, [config, onConfigChange]);

  const contextValue = React.useMemo(() => ({
    config,
    updateConfig,
  }), [config, updateConfig]);

  return (
    <ArchbaseAppContext.Provider value={contextValue}>
      {children}
    </ArchbaseAppContext.Provider>
  );
}

export function useArchbaseApp(): ArchbaseAppContextValue {
  const context = useContext(ArchbaseAppContext);
  if (!context) {
    throw new Error('useArchbaseApp must be used within ArchbaseAppProvider');
  }
  return context;
}

export { ArchbaseAppContext };