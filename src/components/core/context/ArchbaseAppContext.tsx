import React, { ReactNode, createContext, useContext } from 'react';
import { MantineTheme } from '@mantine/styles';
import '../../../../locales/config';
import { Container } from 'inversify';
import { useMantineTheme } from '@mantine/core';

interface ArchbaseAppContextValues {
  user: any | null;
  owner: string | null;
  selectedCompany: any | null;
  theme: MantineTheme | null;
  iocContainer: Container | null;
  dateFormat: string;
  dateTimeFormat: string;
  timeFormat: string;
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
});

interface ArchbaseAppProviderProps {
  children?: ReactNode | ReactNode[];
  user: any | null;
  owner: string | null;
  selectedCompany: any | null;
  iocContainer?: any;
  dateFormat?: string;
  dateTimeFormat?: string;
  timeFormat?: string;
}


const ArchbaseAppProvider: React.FC<ArchbaseAppProviderProps> = ({
  user,
  owner,
  selectedCompany,
  children,
  iocContainer,
  dateFormat= 'dd/MM/yyyy',
  dateTimeFormat= 'dd/MM/yyyy HH:mm:ss',
  timeFormat= 'HH:mm:ss',
}) => {
  const theme = useMantineTheme();
  return (
    <ArchbaseAppContext.Provider
      value={{ user, owner, selectedCompany, theme, iocContainer, dateFormat, dateTimeFormat, timeFormat }}
    >
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
