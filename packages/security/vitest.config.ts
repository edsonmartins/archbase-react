import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * globals: true porque as suítes destes pacotes usam describe/it/expect sem importá-los. Sem isto
 * elas nem carregam — falham com "describe is not defined" antes de rodar um único caso.
 */
export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
	},
});
