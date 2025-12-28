import type { ReactNode } from 'react';

export interface UnleashConfig {
  url: string;
  clientKey: string;
  appName: string;
  environment?: 'development' | 'production' | 'staging';
  refreshInterval?: number;
  context?: {
    userId?: string;
    sessionId?: string;
    properties?: Record<string, string>;
  };
}

export interface ArchbaseFeatureFlagsProviderProps {
  children: ReactNode;
  config: UnleashConfig;
  startClient?: boolean;
  errorComponent?: ReactNode;
  loadingComponent?: ReactNode;
}

export interface UseFeatureFlagResult {
  enabled: boolean;
  loading: boolean;
  error?: Error;
}

export interface UseVariantResult<T = any> {
  variant: {
    name: string;
    enabled: boolean;
    payload?: { type: string; value: string };
  } | undefined;
  loading: boolean;
  error?: Error;
}
