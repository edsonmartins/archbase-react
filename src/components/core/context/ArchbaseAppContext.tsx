import React, { ReactNode, createContext, useContext } from 'react';
import { MantineTheme } from '@mantine/styles';
import '../../../../locales/config';
import { Container } from 'inversify';

interface ArchbaseAppContextValues {
  user: any | null;
  owner: string | null;
  selectedCompany: any | null;
  theme: MantineTheme | null;
  iocContainer: Container | null;
}

const ArchbaseAppContext = createContext<ArchbaseAppContextValues>({
  user: null,
  owner: null,
  selectedCompany: null,
  theme: null,
  iocContainer: null,
});

interface ArchbaseAppProviderProps {
    children: ReactNode | ReactNode[]
    user: any | null;
  owner: string | null;
  selectedCompany: any | null;
  theme: MantineTheme | null;
  iocContainer: any;
}

// Remova o provedor interno para evitar a dependência circular
const ArchbaseAppProvider: React.FC<ArchbaseAppProviderProps> = ({ user, owner, selectedCompany, children, theme,iocContainer }) => {
  return (
    <ArchbaseAppContext.Provider value={{ user,owner,selectedCompany,theme,iocContainer }}>
      {children}
    </ArchbaseAppContext.Provider>
  );
};

const useArchbaseAppContext = () => {
  const context = useContext(ArchbaseAppContext);
  if (!context) {
    throw new Error('useArchbaseAppContext deve ser usado dentro de um ArchbaseAppProvider');
  }
  return context;
};


export { ArchbaseAppContext, ArchbaseAppProvider, useArchbaseAppContext };
