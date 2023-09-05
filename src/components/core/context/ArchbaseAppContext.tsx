import React, { ReactNode, createContext, useContext } from 'react'
import { MantineTheme, Variants } from '@mantine/styles'
import '../../locales/config'
import { Container } from 'inversify'
import { useMantineTheme } from '@mantine/core'
import { BrowserRouter as Router } from 'react-router-dom'
import { ProSidebarProvider } from 'react-pro-sidebar'
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import queryString from 'query-string';


interface ArchbaseAppContextValues {
  user: any | null
  owner: string | null
  selectedCompany: any | null
  theme: MantineTheme | null
  iocContainer: Container | null
  dateFormat: string
  dateTimeFormat: string
  timeFormat: string
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
}

const ArchbaseAppContext = createContext<ArchbaseAppContextValues>({
  user: null,
  owner: null,
  selectedCompany: null,
  theme: null,
  iocContainer: null,
  dateFormat: 'dd/MM/yyyy',
  dateTimeFormat: 'dd/MM/yyyy HH:mm:ss',
  timeFormat: 'HH:mm:ss',
  variant: 'filled'
})

interface ArchbaseAppProviderProps {
  children?: ReactNode | ReactNode[]
  user: any | null
  owner: string | null
  selectedCompany: any | null
  iocContainer?: any
  dateFormat?: string
  dateTimeFormat?: string
  timeFormat?: string
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
}

const ArchbaseAppProvider: React.FC<ArchbaseAppProviderProps> = ({
  user,
  owner,
  selectedCompany,
  children,
  iocContainer,
  dateFormat = 'dd/MM/yyyy',
  dateTimeFormat = 'dd/MM/yyyy HH:mm:ss',
  timeFormat = 'HH:mm:ss',
  variant = 'filled'
}) => {
  const theme = useMantineTheme()
  return (
    <ArchbaseAppContext.Provider
      value={{
        user,
        owner,
        selectedCompany,
        theme,
        iocContainer,
        dateFormat,
        dateTimeFormat,
        timeFormat,
        variant
      }}
    >
      <ProSidebarProvider>
        <Router>
          <QueryParamProvider 
            adapter={ReactRouter6Adapter} 
            options={{
              searchStringToObject: queryString.parse,
              objectToSearchString: queryString.stringify,
            }}>
            {children}
          </QueryParamProvider>
        </Router>        
      </ProSidebarProvider>
    </ArchbaseAppContext.Provider>
  )
}

const useArchbaseAppContext = () => {
  const context = useContext(ArchbaseAppContext)
  if (!context) {
    throw new Error('useArchbaseAppContext deve ser usado dentro de um ArchbaseAppProvider')
  }
  return context
}

export { ArchbaseAppContext, ArchbaseAppProvider, useArchbaseAppContext }
export type { ArchbaseAppContextValues }
