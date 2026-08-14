import { useMemo, type ReactNode } from 'react';
import { AnalyticsClient } from '../client/AnalyticsClient';
import { createDefaultLabeler } from '../meta/defaultLabeler';
import type { AnalyticsPorts } from '../ports/types';
import { DEFAULT_STRINGS, type AnalyticsStrings } from '../strings';
import { AnalyticsContext, type AnalyticsConfig, type AnalyticsContextValue } from './AnalyticsContext';
import { validatePorts } from './validatePorts';

const DEFAULT_LOCALE = 'pt-BR';
const DEFAULT_META_CACHE_TTL_MS = 5 * 60 * 1000;

export interface AnalyticsProviderProps {
  /**
   * Prefixo do backend do hospedeiro. A biblioteca acrescenta `v1/meta` e
   * `v1/load` e nunca monta prefixo proprio. RFC de contratos, secao 3.1.
   */
  baseUrl: string;
  ports: AnalyticsPorts;
  locale?: string;
  defaultLocale?: string;
  deepLinkParams?: { query?: string; savedQueryId?: string };
  metaCacheTtlMs?: number;
  strings?: Partial<AnalyticsStrings>;
  fetchImpl?: typeof fetch;
  children: ReactNode;
}

export function AnalyticsProvider({
  baseUrl,
  ports,
  locale,
  defaultLocale = DEFAULT_LOCALE,
  deepLinkParams,
  metaCacheTtlMs = DEFAULT_META_CACHE_TTL_MS,
  strings,
  fetchImpl,
  children,
}: AnalyticsProviderProps) {
  validatePorts(ports);

  const config = useMemo<AnalyticsConfig>(
    () => ({
      baseUrl,
      locale: locale ?? defaultLocale,
      defaultLocale,
      deepLinkParams: {
        query: deepLinkParams?.query ?? 'aq',
        savedQueryId: deepLinkParams?.savedQueryId ?? 'aqid',
      },
      metaCacheTtlMs,
    }),
    [
      baseUrl,
      locale,
      defaultLocale,
      deepLinkParams?.query,
      deepLinkParams?.savedQueryId,
      metaCacheTtlMs,
    ],
  );

  const client = useMemo(
    () => new AnalyticsClient({ baseUrl, tokenProvider: ports.tokenProvider, fetchImpl }),
    [baseUrl, ports.tokenProvider, fetchImpl],
  );

  const value = useMemo<AnalyticsContextValue>(
    () => ({
      ports,
      config,
      client,
      labeler: ports.labeler ?? createDefaultLabeler(defaultLocale),
      strings: { ...DEFAULT_STRINGS, ...strings },
    }),
    [ports, config, client, defaultLocale, strings],
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}
