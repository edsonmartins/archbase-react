import { CSSProperties, Drawer, ModalBaseStylesNames } from '@mantine/core';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect } from 'react';

export interface ArchbaseDrawerContentProps {
  children: React.ReactNode;
  title?: string;
  size?: string | number;
  drawerKey: string; // Identificador único do drawer
  styles?: Partial<Record<ModalBaseStylesNames, CSSProperties>> | undefined
}

export function ArchbaseDrawerContent({ children, title = '', size = '440px', drawerKey, styles }: ArchbaseDrawerContentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Abre o drawer se o parâmetro drawer corresponder à nossa key
    if (searchParams.get('drawer') === drawerKey) {
      open();
    }
  }, [searchParams]);

  const handleClose = () => {
    close();
    // Remove o parâmetro drawer da URL mantendo os outros parâmetros
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('drawer');
    
    // Reconstrói a URL mantendo a rota atual
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString()
    });
  };

  return (
    <Drawer
      position="right" 
      opened={opened} 
      onClose={handleClose}
      title={title}
      size={size}
      styles={styles}
    >
      {children}
    </Drawer>
  );
}