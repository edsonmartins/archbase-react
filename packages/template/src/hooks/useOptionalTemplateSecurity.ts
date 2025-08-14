import React, { useState, useEffect, useContext } from 'react';

/**
 * Hook que funciona com ou sem contexto de segurança
 * Se não há contexto de segurança, sempre retorna true (permite tudo)
 * Se há contexto de segurança, usa as verificações reais
 */
export const useOptionalTemplateSecurity = (config?: {
  resourceName?: string;
  resourceDescription?: string;
  autoRegisterActions?: boolean;
}) => {
  const [securityState, setSecurityState] = useState({
    isAvailable: false,
    hasPermission: () => true, // Default: sempre permite
    registerAction: () => {}, // Default: no-op
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
  });

  useEffect(() => {
    // Só tenta usar segurança SE resourceName foi fornecido
    if (!config?.resourceName) {
      return; // Mantém estado padrão (tudo permitido)
    }

    // Por enquanto, mantém comportamento padrão
    // A integração dinâmica será implementada posteriormente
    console.debug('Template: integração de segurança em desenvolvimento');
  }, [config?.resourceName, config?.resourceDescription, config?.autoRegisterActions]);

  return securityState;
};

/**
 * Hook mais direto para verificar se contexto de segurança está disponível
 */
export const useTemplateSecurityAvailable = (): boolean => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Por enquanto, sempre false - integração será feita posteriormente
    setIsAvailable(false);
  }, []);

  return isAvailable;
};