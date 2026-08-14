import { REQUIRED_PORTS, type AnalyticsPorts } from '../ports/types';

export function missingPorts(ports: Partial<AnalyticsPorts> | undefined): string[] {
  if (!ports) return [...REQUIRED_PORTS];
  return REQUIRED_PORTS.filter((name) => ports[name] === undefined || ports[name] === null);
}

function message(missing: string[]): string {
  return (
    `AnalyticsProvider montado sem ${missing.length === 1 ? 'a porta' : 'as portas'} ` +
    `${missing.join(', ')}. ` +
    'Injete em <AnalyticsProvider ports={{ ... }}>. ' +
    'tokenProvider devolve o token do hospedeiro; savedQueryStore persiste as ' +
    'consultas salvas; formatter converte valores para exibicao. ' +
    'chartRenderer, labeler e telemetry sao opcionais.'
  );
}

/**
 * Falha explicita em desenvolvimento; em producao registra e segue.
 *
 * Derrubar a aplicacao inteira do hospedeiro por causa de um painel mal
 * configurado seria desproporcional em producao, onde o defeito ja escapou.
 */
export function validatePorts(ports: Partial<AnalyticsPorts> | undefined): void {
  const missing = missingPorts(ports);
  if (missing.length === 0) return;

  if (process.env.NODE_ENV === 'production') {
    console.error(`[archbase-analytics] ${message(missing)}`);
    return;
  }
  throw new Error(`[archbase-analytics] ${message(missing)}`);
}

/**
 * `chartRenderer` e validada no uso: consumo headless do nucleo e caso
 * legitimo. RFC de contratos, secao 4.
 */
export function requireChartRenderer(ports: AnalyticsPorts): NonNullable<AnalyticsPorts['chartRenderer']> {
  if (!ports.chartRenderer) {
    throw new Error(
      '[archbase-analytics] Renderizacao de grafico solicitada sem a porta chartRenderer. ' +
        'Injete chartRenderer no AnalyticsProvider ou use apenas visualizacao em tabela.',
    );
  }
  return ports.chartRenderer;
}
