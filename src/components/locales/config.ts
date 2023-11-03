import { ptBR } from 'date-fns/locale';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/pt-br';
import translation from './en/translation.json';
import translation_es from './es/translation.json';
import translation_ptbr from './pt-BR/translation.json';

setDefaultOptions({ locale: ptBR });

export const archbaseTranslationResources = {
	en: {
		archbase: translation,
	},
	'pt-BR': {
		archbase: translation_ptbr,
	},
	es: {
		archbase: translation_es,
	},
};
