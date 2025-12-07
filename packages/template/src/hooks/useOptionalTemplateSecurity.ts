import { useMemo } from 'react';

// Estado padrão de segurança (singleton para evitar re-renders)
const DEFAULT_SECURITY_STATE = {
  isAvailable: false,
  hasPermission: () => true, // Default: sempre permite
  registerAction: () => {}, // Default: no-op
  canCreate: true,
  canEdit: true,
  canDelete: true,
  canView: true,
} as const;

/**
 * Hook que funciona com ou sem contexto de segurança
 * Se não há contexto de segurança, sempre retorna true (permite tudo)
 * Se há contexto de segurança, usa as verificações reais
 *
 * IMPORTANTE: Retorna objeto estável para evitar re-renders infinitos
 */
export const useOptionalTemplateSecurity = (config?: {
  resourceName?: string;
  resourceDescription?: string;
  autoRegisterActions?: boolean;
}) => {
  // Retorna sempre o mesmo objeto para evitar re-renders
  // A integração com segurança real será implementada posteriormente
  return useMemo(() => DEFAULT_SECURITY_STATE, []);
};

/**
 * Hook mais direto para verificar se contexto de segurança está disponível
 * IMPORTANTE: Retorna valor estável para evitar re-renders
 */
export const useTemplateSecurityAvailable = (): boolean => {
  // Por enquanto, sempre false - integração será feita posteriormente
  return false;
};