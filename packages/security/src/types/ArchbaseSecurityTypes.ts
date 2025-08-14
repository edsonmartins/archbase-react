import { ReactNode } from 'react';
import { ArchbaseSecurityManager } from '../ArchbaseSecurityManager';
import { UserDto } from '../SecurityDomain';

// Tipos base
export interface ArchbaseSecurityError {
  code: string;
  message: string;
  details?: any;
}

// Tipos para permissões
export type ArchbasePermissionAction = string;
export type ArchbasePermissionList = ArchbasePermissionAction[];

// Tipos para o contexto global
export interface ArchbaseGlobalSecurityState {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ArchbaseSecurityError | null;
}

// Tipos para configuração de segurança de view
export interface ArchbaseViewSecurityConfig {
  resourceName: string;
  resourceDescription: string;
  requiredPermissions?: ArchbasePermissionList;
  autoRegisterActions?: boolean;
  strictMode?: boolean; // Se true, bloqueia tudo que não tem permissão explícita
}

// Tipos para componentes protegidos
export interface ArchbaseProtectionConfig {
  actionName?: ArchbasePermissionAction;
  requiredPermissions?: ArchbasePermissionList;
  requireAll?: boolean;
  fallback?: ReactNode;
  autoRegister?: boolean;
}

// Tipos para callbacks
export type ArchbaseSecurityCallback = (manager: ArchbaseSecurityManager) => void;
export type ArchbaseErrorCallback = (error: string) => void;

// Tipos para resultados de verificação
export interface ArchbasePermissionCheckResult {
  hasAccess: boolean;
  missingPermissions?: ArchbasePermissionList;
  reason?: string;
}

// Enum para tipos de fallback
export enum ArchbaseFallbackType {
  HIDDEN = 'hidden',
  DISABLED = 'disabled',
  MESSAGE = 'message',
  CUSTOM = 'custom'
}

// Interface para configuração avançada
export interface ArchbaseAdvancedSecurityConfig extends ArchbaseViewSecurityConfig {
  fallbackType?: ArchbaseFallbackType;
  customFallback?: ReactNode;
  onAccessDenied?: (missingPermissions: ArchbasePermissionList) => void;
  onError?: ArchbaseErrorCallback;
  debugMode?: boolean;
}