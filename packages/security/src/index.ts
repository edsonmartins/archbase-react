// @archbase/security - Security and authentication components exports

// Authentication services
export * from './ArchbaseAccessToken';
export * from './ArchbaseAuthenticator';
export * from './ArchbaseTokenManager';
export * from './ArchbaseUser';
export * from './DefaultArchbaseTokenManager';

// Contextual authentication types
export * from './types/ContextualAuthentication';

// OAuth2 authentication
export * from './oauth2';

// Security management
export * from './ArchbaseSecurityManager';
export * from './ArchbaseTenantManager';

// User management services (core logic only)
export * from './ArchbaseUserService';
export * from './ArchbaseGroupService';
export * from './ArchbaseProfileService';
export * from './ArchbaseApiTokenService';
export * from './ArchbaseAccessTokenService';
export * from './ArchbaseResourceService';

// UI Components (non-modal components)
export * from './ArchbaseLogin';
export * from './ArchbaseResetPassword';

// Security types and domains
export * from './SecurityType';
export * from './SecurityDomain';

// Security hooks
export * from './hooks';

// New Security Context System
export {
  ArchbaseSecurityProvider,
  ArchbaseViewSecurityProvider,
  DefaultSecurityLoading
} from './ArchbaseSecurityContext';

export { 
  useArchbaseSecurity, 
  useArchbaseViewSecurity, 
  useArchbaseSecureForm,
  useArchbasePermissionCheck 
} from './ArchbaseSecurityHooks';

export { 
  ArchbaseProtectedComponent,
  ArchbaseSecureActionButton,
  ArchbaseSecureFormField,
  withArchbaseSecurity
} from './ArchbaseSecurityComponents';

export type {
  ArchbaseSecurityContextType,
  ArchbaseViewSecurityContextType,
  ArchbaseSecurityProviderProps,
  ArchbaseViewSecurityProviderProps
} from './ArchbaseSecurityContext';

export type {
  ArchbaseProtectedComponentProps,
  ArchbaseSecureActionButtonProps,
  ArchbaseSecureFormFieldProps
} from './ArchbaseSecurityComponents';

export type {
  UseArchbaseSecureFormReturn
} from './ArchbaseSecurityHooks';

export type * from './types/ArchbaseSecurityTypes';
