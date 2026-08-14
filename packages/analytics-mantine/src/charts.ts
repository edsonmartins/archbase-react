/**
 * Subpacote de renderizacao de grafico: `@archbase/analytics-mantine/charts`.
 *
 * Ponto de entrada separado para que `@mantine/charts` e o seu proprio peer de
 * grafico fiquem fora do grafo de dependencias de quem usa apenas tabela.
 */
export { createMantineChartRenderer } from './reference/chartRendererMantine';
