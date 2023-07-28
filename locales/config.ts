import { enUS, es, ptBR } from 'date-fns/locale'
import setDefaultOptions from 'date-fns/setDefaultOptions'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import 'dayjs/locale/en'
import 'dayjs/locale/es'
import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'

import translation from './en/translation.json'
import translation_ptbr from './pt-BR/translation.json'

setDefaultOptions({ locale: es })

export const resources = {
  en: {
    translation
  },
  'pt-BR': {
    translation: translation_ptbr
  }
}

i18next.use(initReactI18next).use(LanguageDetector).init({
  debug: true,
  resources
})

i18next.on('languageChanged', (lng: string) => {
  if (lng === 'en') {
    setDefaultOptions({ locale: enUS })
    dayjs.locale('en')
  } else if (lng === 'es') {
    setDefaultOptions({ locale: es })
    dayjs.locale('es')
  } else if (lng === 'pt-BR') {
    setDefaultOptions({ locale: ptBR })
    dayjs.locale('pt-BR')
  }
})
