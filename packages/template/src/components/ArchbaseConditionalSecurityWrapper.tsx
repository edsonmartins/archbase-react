import React, { ReactNode, useContext } from 'react';

/**
 * Wrapper ultra-leve que aplica segurança condicionalmente
 * Se não tem resourceName ou contexto de segurança, apenas renderiza children
 * Se tem ambos, envolve com ArchbaseViewSecurityProvider
 */
interface ConditionalSecurityWrapperProps {
  children: ReactNode;
  /** Se não fornecido, não envolve com segurança */
  resourceName?: string; 
  /** Descrição opcional do recurso */
  resourceDescription?: string;
  /** Permissões obrigatórias para acessar */
  requiredPermissions?: string[];
  /** Componente de fallback se acesso negado */
  fallbackComponent?: ReactNode;
  /** Callback quando segurança está pronta */
  onSecurityReady?: (manager: any) => void;
  /** Callback quando acesso negado */
  onAccessDenied?: () => void;
}

export const ArchbaseConditionalSecurityWrapper: React.FC<ConditionalSecurityWrapperProps> = ({
  children,
  resourceName,
  resourceDescription,
  requiredPermissions,
  fallbackComponent,
  onSecurityReady,
  onAccessDenied
}) => {
  // Se não tem resourceName, renderiza direto sem estado
  if (!resourceName) {
    return <>{children}</>;
  }

  // Por enquanto, apenas renderiza o conteúdo diretamente
  // A integração completa será feita posteriormente
  console.debug(`Template solicitou segurança para '${resourceName}', mas integração ainda em desenvolvimento.`);
  
  return <>{children}</>;
};

/**
 * Hook para verificar se deve aplicar wrapper de segurança
 */
export const useConditionalSecurity = (resourceName?: string) => {
  const [shouldWrap, setShouldWrap] = React.useState(false);
  const [isSecurityAvailable, setIsSecurityAvailable] = React.useState(false);

  React.useEffect(() => {
    if (!resourceName) {
      setShouldWrap(false);
      return;
    }

    // Simplified for now
    setIsSecurityAvailable(false);
    setShouldWrap(false);
  }, [resourceName]);

  return {
    shouldWrap,
    isSecurityAvailable,
    hasResourceName: !!resourceName
  };
};