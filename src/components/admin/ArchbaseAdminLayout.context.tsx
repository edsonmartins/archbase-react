import React, { ReactNode, useState } from 'react';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';
import { ArchbaseUser } from '../../components/auth/ArchbaseUser';

export interface ArchbaseAdminLayoutListener {
  onChangeLocationPath: (item: ArchbaseNavigationItem) => void;
}

export interface ArchbaseAdminLayoutContextValue {
  navigationData?: ArchbaseNavigationItem[];
  user?: ArchbaseUser;
  owner?: ArchbaseOwner;
  company?: ArchbaseCompany;
  navigationRootLink?: string;
  collapsed?: boolean;
  setCollapsed?: (value: boolean)=>void;
}

export interface ArchbaseAdminLayoutContextProps {
  navigationData?: ArchbaseNavigationItem[];
  user?: ArchbaseUser;
  owner?: ArchbaseOwner;
  company?: ArchbaseCompany;
  navigationRootLink?: string;
  children?: ReactNode;
  opened?: boolean;
}

const ArchbaseAdminLayoutContext = React.createContext<ArchbaseAdminLayoutContextValue>({});

const ArchbaseAdminLayoutProvider: React.FC<ArchbaseAdminLayoutContextProps> = ({
  navigationData,
  user,
  owner,
  company,
  navigationRootLink,
  children,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <ArchbaseAdminLayoutContext.Provider
      value={{ navigationData, user, owner, company, navigationRootLink, collapsed, setCollapsed }}
    >
      {children}
    </ArchbaseAdminLayoutContext.Provider>
  );
};

export { ArchbaseAdminLayoutContext, ArchbaseAdminLayoutProvider };
