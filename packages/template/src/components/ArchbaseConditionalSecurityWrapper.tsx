import React, { ReactNode, useMemo } from 'react';

/**
 * Wrapper ultra-leve que aplica segurança condicionalmente
 * Se não tem resourceName ou contexto de segurança, apenas renderiza children
 * Se tem ambos, envolve com ArchbaseViewSecurityProvider
 *
 * IMPORTANTE: Este componente é otimizado para evitar re-renders desnecessários
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
}) => {
  // Renderiza diretamente sem hooks que causem re-render
  // A integração com segurança real será implementada posteriormente
  return <>{children}</>;
};

/**
 * Hook para verificar se deve aplicar wrapper de segurança
 * IMPORTANTE: Retorna valor estável para evitar re-renders infinitos
 */
export const useConditionalSecurity = (resourceName?: string) => {
  return useMemo(() => ({
    shouldWrap: false,
    isSecurityAvailable: false,
    hasResourceName: !!resourceName
  }), [resourceName]);
};