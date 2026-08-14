import { createContext, useContext } from 'react';
import type { AnalyticsClient } from '../client/AnalyticsClient';
import type { AnalyticsPorts, MemberLabeler } from '../ports/types';
import type { AnalyticsStrings } from '../strings';

export interface DeepLinkParams {
  /** Parametro que carrega o estado de exploracao. Default `aq`. */
  query: string;
  /** Parametro que carrega o identificador de consulta salva. Default `aqid`. */
  savedQueryId: string;
}

export interface AnalyticsConfig {
  baseUrl: string;
  locale: string;
  defaultLocale: string;
  deepLinkParams: DeepLinkParams;
  metaCacheTtlMs: number;
}

export interface AnalyticsContextValue {
  ports: AnalyticsPorts;
  config: AnalyticsConfig;
  client: AnalyticsClient;
  labeler: MemberLabeler;
  strings: AnalyticsStrings;
}

export const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function useAnalyticsContext(): AnalyticsContextValue {
  const value = useContext(AnalyticsContext);
  if (!value) {
    throw new Error(
      '[archbase-analytics] Hook de analytics usado fora de <AnalyticsProvider>. ' +
        'Envolva a arvore que consome analytics com o provider.',
    );
  }
  return value;
}
