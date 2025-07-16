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
export class ArchbaseSafeMigrationWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      fallbackActive: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Ativar fallback quando V2 falhar
    return {
      hasError: true,
      error,
      fallbackActive: true
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { componentName, onError } = this.props;
    
    // Log do erro para monitoramento
    console.error(`[ArchbaseSafeMigration] V2 failed for ${componentName}:`, error);
    console.error('Error Info:', errorInfo);
    
    // Métricas de fallback
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('DataSource_V2_Fallback', {
        component: componentName,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }

    // Callback customizado de erro
    if (onError) {
      onError(error, errorInfo);
    }
  }

  render() {
    const { children, fallbackComponent: FallbackComponent, v2Props, componentName } = this.props;
    const { hasError, fallbackActive } = this.state;

    if (hasError && fallbackActive) {
      // Renderizar V1 como fallback
      console.warn(`[ArchbaseSafeMigration] Using V1 fallback for ${componentName}`);
      return <FallbackComponent {...v2Props} />;
    }

    // Renderizar V2 normalmente
    return children;
  }
}

/**
 * Hook para criar wrapper de migração segura
 */
export function useArchbaseSafeMigration<TProps>(
  componentName: string,
  V1Component: React.ComponentType<TProps>,
  V2Component: React.ComponentType<TProps>
) {
  return React.useMemo(() => {
    const SafeComponent = (props: TProps) => {
      // Feature flag para forçar V1
      const forceV1 = process.env.REACT_APP_FORCE_DATASOURCE_V1 === 'true';
      
      if (forceV1) {
        console.log(`[ArchbaseSafeMigration] Force V1 mode for ${componentName}`);
        return <V1Component {...props} />;
      }

      return (
        <ArchbaseSafeMigrationWrapper
          componentName={componentName}
          fallbackComponent={V1Component}
          v2Props={props}
        >
          <V2Component {...props} />
        </ArchbaseSafeMigrationWrapper>
      );
    };

    SafeComponent.displayName = `SafeMigration(${componentName})`;
    return SafeComponent;
  }, [componentName, V1Component, V2Component]);
}

/**
 * HOC para aplicar migração segura
 */
export function withSafeMigration<TProps>(
  componentName: string,
  V1Component: React.ComponentType<TProps>,
  V2Component: React.ComponentType<TProps>
) {
  const SafeComponent = (props: TProps) => {
    const forceV1 = process.env.REACT_APP_FORCE_DATASOURCE_V1 === 'true';
    
    if (forceV1) {
      return <V1Component {...props} />;
    }

    return (
      <ArchbaseSafeMigrationWrapper
        componentName={componentName}
        fallbackComponent={V1Component}
        v2Props={props}
      >
        <V2Component {...props} />
      </ArchbaseSafeMigrationWrapper>
    );
  };

  SafeComponent.displayName = `SafeMigration(${componentName})`;
  return SafeComponent;
}

/**
 * Utilitário para detectar versão do DataSource
 */
export function detectDataSourceVersion(dataSource: any): 'V1' | 'V2' | 'NONE' {
  if (!dataSource) {
    return 'NONE';
  }
  
  // Duck typing para detectar V2
  if ('appendToFieldArray' in dataSource || 'updateFieldArrayItem' in dataSource) {
    return 'V2';
  }
  
  return 'V1';
}

/**
 * Métricas para monitoramento de migração
 */
export const MigrationMetrics = {
  trackV2Usage: (componentName: string, dataSourceVersion: string) => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('DataSource_V2_Usage', {
        component: componentName,
        dataSourceVersion,
        timestamp: new Date().toISOString()
      });
    }
  },

  trackFallback: (componentName: string, reason: string) => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('DataSource_V2_Fallback', {
        component: componentName,
        reason,
        timestamp: new Date().toISOString()
      });
    }
  },

  trackError: (componentName: string, error: Error) => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('DataSource_V2_Error', {
        component: componentName,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  }
};

export default ArchbaseSafeMigrationWrapper;
