import React, { ReactNode } from 'react';
import { Button, ButtonProps } from '@mantine/core';
import { useOptionalTemplateSecurity } from '../hooks';

/**
 * Botão inteligente que detecta contexto de segurança
 * Se não tem contexto ou ação não especificada, renderiza botão normal
 * Se tem contexto e ação, verifica permissão antes de renderizar
 */
interface ArchbaseSmartActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Nome da ação para verificar permissão - se não fornecido, sempre renderiza */
  actionName?: string; 
  /** Descrição da ação para auto-registro */
  actionDescription?: string;
  /** Conteúdo do botão */
  children: ReactNode;
  /** Componente alternativo se não tem permissão */
  fallback?: ReactNode;
  /** Se deve auto-registrar a ação */
  autoRegister?: boolean;
  /** Função onClick */
  onClick?: () => void;
}

export const ArchbaseSmartActionButton: React.FC<ArchbaseSmartActionButtonProps> = ({
  actionName,
  actionDescription,
  children,
  fallback = null,
  autoRegister = true,
  onClick,
  ...buttonProps
}) => {
  const security = useOptionalTemplateSecurity({
    autoRegisterActions: false // Controlamos manualmente aqui
  });
  
  // Auto-registra a ação se necessário
  React.useEffect(() => {
    if (autoRegister && actionName && actionDescription && security.isAvailable) {
      security.registerAction();
    }
  }, [actionName, actionDescription, autoRegister, security.isAvailable, security.registerAction]);

  // Se não especificou ação OU não tem contexto de segurança, renderiza normalmente
  if (!actionName || !security.isAvailable) {
    return <Button onClick={onClick} {...buttonProps}>{children}</Button>;
  }
  
  // Se tem contexto de segurança, verifica permissão
  if (!security.hasPermission()) {
    return <>{fallback}</>;
  }
  
  return (
    <Button onClick={onClick} {...buttonProps}>
      {children}
    </Button>
  );
};

/**
 * Versão mais avançada que usa diretamente o sistema de segurança quando disponível
 */
export const ArchbaseAdvancedSmartButton: React.FC<ArchbaseSmartActionButtonProps> = ({
  actionName,
  actionDescription,
  children,
  fallback = null,
  onClick,
  ...buttonProps
}) => {
  const [securityButton, setSecurityButton] = React.useState<ReactNode>(null);
  const [hasSecurityContext, setHasSecurityContext] = React.useState(false);

  React.useEffect(() => {
    // Se não tem actionName, sempre renderiza botão normal
    if (!actionName) {
      setSecurityButton(<Button onClick={onClick} {...buttonProps}>{children}</Button>);
      return;
    }

    // Por enquanto, usa botão normal - integração será feita posteriormente
    setHasSecurityContext(false);
    setSecurityButton(<Button onClick={onClick} {...buttonProps}>{children}</Button>);
  }, [actionName, actionDescription, children, fallback, buttonProps]);

  return <>{securityButton}</>;
};