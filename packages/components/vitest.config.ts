import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * globals: true porque as suítes destes pacotes usam describe/it/expect sem importá-los. Sem isto
 * elas nem carregam — falham com "describe is not defined" antes de rodar um único caso.
 *
 * setupFiles instala os duplos de ResizeObserver e matchMedia. O jsdom não os implementa, e o
 * Mantine os consulta ao montar: sem eles o componente lança dentro do render, e o erro chega
 * como AggregateError, que não diz o que está faltando.
 */
export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./test/setup.ts'],
	},
});
