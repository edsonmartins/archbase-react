import React, { useState, useEffect, useMemo } from 'react';
import { FlagProvider } from '@unleash/proxy-client-react';
import { useArchbaseTranslation } from '@archbase/core';
import type {
  ArchbaseFeatureFlagsProviderProps,
} from '../types';

export function ArchbaseFeatureFlagsProvider({
  children,
  config,
  startClient = true,
  errorComponent,
  loadingComponent,
}: ArchbaseFeatureFlagsProviderProps) {
  const { t } = useArchbaseTranslation();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const unleashConfig = useMemo(() => ({
    url: config.url,
    clientKey: config.clientKey,
    appName: config.appName,
    environment: config.environment || 'production',
    refreshInterval: config.refreshInterval || 30000,
    context: config.context,
  }), [config]);

  useEffect(() => {
    if (!startClient) {
      setIsReady(true);
      return;
    }

    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, [startClient]);

  if (error) {
    return <>{errorComponent || <div>{String(t('Error loading feature flags'))}</div>}</>;
  }

  if (!isReady) {
    return <>{loadingComponent || <div>{String(t('Loading feature flags...'))}</div>}</>;
  }

  return (
    <FlagProvider
      config={unleashConfig}
      startClient={startClient}
    >
      {children}
    </FlagProvider>
  );
}
