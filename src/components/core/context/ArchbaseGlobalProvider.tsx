import React, { useLayoutEffect } from 'react'
import { Provider as IOCProvider } from 'inversify-react'
import i18next, { ResourceLanguage, i18n } from 'i18next'
import setDefaultOptions from 'date-fns/setDefaultOptions'
import { enUS, es, ptBR } from 'date-fns/locale'
import dayjs from 'dayjs'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { DatesProvider } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import {
  ColorScheme,
  ColorSchemeProvider,
  EmotionCache,
  MantineProvider,
  MantineThemeOverride
} from '@mantine/styles'
import '../../locales/config'
import { archbaseTranslationResources } from '../../locales/config'
import { Resource, t } from 'i18next'


interface ArchbaseThemeOverride extends MantineThemeOverride {}

interface ArchbaseTranslationResource {
  [language: string]: ResourceLanguage;
}

interface ArchbaseAppProviderProps {
  children?: React.ReactNode
  colorScheme: 'dark' | 'light'
  containerIOC: any | undefined
  themeDark?: ArchbaseThemeOverride
  themeLight?: ArchbaseThemeOverride
  emotionCache?: EmotionCache
  withNormalizeCSS?: boolean
  withGlobalStyles?: boolean
  withCSSVariables?: boolean
  toggleColorScheme: (colorScheme?: ColorScheme) => void
  notificationAutoClose?: number
  translationName?: string;
  translationResource?: ArchbaseTranslationResource;
  notificationPosition?:
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center'
}

const buildResources = (resource: Resource, translationName? : string, translationResource?: ArchbaseTranslationResource) : Resource|undefined => {
    let result = resource;
    if (translationResource){
      const name = translationName?translationName:'app';
      Object.keys(translationResource).forEach((language)=>{
        if (!resource[language]) {
          resource[language] = {[name]:translationResource[language]}
        } if (!resource[language][name]){
            resource[language][name] = translationResource[language];
        }       
      })
      return result;
    }    
}


export const initArchbaseTranslation = (translationName,
  translationResource) : any => {
  i18next.use(initReactI18next).use(LanguageDetector).init({
    debug: false,
    resources: buildResources(archbaseTranslationResources, translationName, translationResource),
    keySeparator: ".",
    ns: translationName?["archbase",translationName]:["archbase"],
    defaultNS: "archbase"
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
  return i18next
}


function ArchbaseGlobalProvider({
  children,
  colorScheme = 'light',
  containerIOC,
  themeDark,
  themeLight,
  emotionCache,
  withCSSVariables,
  withGlobalStyles,
  withNormalizeCSS,
  notificationAutoClose = 5000,
  notificationPosition = 'top-right',
  translationName,
  translationResource,
  toggleColorScheme
} : ArchbaseAppProviderProps) {
  useLayoutEffect(()=>{
    initArchbaseTranslation(translationName,translationResource) 
  },[])
  return (
      <IOCProvider container={containerIOC}>
        <DatesProvider settings={{ locale: i18next.language }}>
          <MantineProvider
            theme={colorScheme === 'dark' ? themeDark : themeLight}
            emotionCache={emotionCache}
            withGlobalStyles={withGlobalStyles}
            withNormalizeCSS={withNormalizeCSS}
            withCSSVariables={withCSSVariables}
          >
              <Notifications autoClose={notificationAutoClose} position={notificationPosition} />
              <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                {children}
              </ColorSchemeProvider>
          </MantineProvider>
        </DatesProvider>
      </IOCProvider>
  )
}

export { ArchbaseGlobalProvider }
export type { ArchbaseThemeOverride }
