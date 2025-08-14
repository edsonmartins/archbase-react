import React, { useEffect, ReactNode } from 'react';
import { useArchbaseViewSecurity } from './ArchbaseSecurityHooks';
import { ArchbaseViewSecurityProvider } from './ArchbaseSecurityContext';

// Componente de proteção genérico
export interface ArchbaseProtectedComponentProps {
  children: ReactNode;
  actionName?: string;
  requiredPermissions?: string[];
  requireAll?: boolean;
  actionDescription?: string;
  fallback?: ReactNode;
  autoRegister?: boolean;
}

export const ArchbaseProtectedComponent: React.FC<ArchbaseProtectedComponentProps> = ({
  children,
  actionName,
  requiredPermissions = [],
  requireAll = true,
  actionDescription,
  fallback = null,
  autoRegister = true
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, registerAction } = useArchbaseViewSecurity();

  // Auto-registra a ação se necessário
  useEffect(() => {
    if (autoRegister && actionName && actionDescription) {
      registerAction(actionName, actionDescription);
    }
  }, [actionName, actionDescription, autoRegister, registerAction]);

  // Determina se tem acesso
  let hasAccess = false;

  if (actionName) {
    hasAccess = hasPermission(actionName);
  } else if (requiredPermissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  } else {
    // Se não especificou nenhuma permissão, permite acesso
    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Botão de ação protegido
export interface ArchbaseSecureActionButtonProps {
  actionName: string;
  actionDescription: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset';
}

export const ArchbaseSecureActionButton: React.FC<ArchbaseSecureActionButtonProps> = ({
  actionName,
  actionDescription,
  children,
  onClick,
  disabled = false,
  className = '',
  style = {},
  variant = 'primary',
  size = 'medium',
  type = 'button'
}) => {
  const getButtonClasses = () => {
    const baseClass = 'archbase-secure-btn';
    const variantClass = `archbase-secure-btn--${variant}`;
    const sizeClass = `archbase-secure-btn--${size}`;
    return `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();
  };

  const getButtonStyle = () => {
    const sizes = {
      small: { padding: '4px 8px', fontSize: '12px' },
      medium: { padding: '8px 16px', fontSize: '14px' },
      large: { padding: '12px 24px', fontSize: '16px' }
    };

    const variants = {
      primary: { backgroundColor: '#007bff', color: 'white' },
      secondary: { backgroundColor: '#6c757d', color: 'white' },
      danger: { backgroundColor: '#dc3545', color: 'white' },
      success: { backgroundColor: '#28a745', color: 'white' },
      warning: { backgroundColor: '#ffc107', color: '#212529' }
    };

    return {
      border: 'none',
      borderRadius: '4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: '500',
      opacity: disabled ? 0.6 : 1,
      ...sizes[size],
      ...variants[variant],
      ...style
    };
  };

  return (
    <ArchbaseProtectedComponent
      actionName={actionName}
      actionDescription={actionDescription}
      fallback={null}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={getButtonClasses()}
        style={getButtonStyle()}
      >
        {children}
      </button>
    </ArchbaseProtectedComponent>
  );
};

// Campo de formulário protegido
export interface ArchbaseSecureFormFieldProps {
  children: ReactNode;
  actionName?: string;
  actionDescription?: string;
  showLabel?: boolean;
  label?: string;
  fallbackText?: string;
  fallbackComponent?: ReactNode;
}

export const ArchbaseSecureFormField: React.FC<ArchbaseSecureFormFieldProps> = ({
  children,
  actionName,
  actionDescription,
  showLabel = true,
  label,
  fallbackText = "Campo não disponível",
  fallbackComponent
}) => {
  if (!actionName) {
    return <>{children}</>;
  }

  const defaultFallback = (
    <div className="archbase-secure-field-fallback" style={{ 
      padding: '8px', 
      color: '#666', 
      fontStyle: 'italic',
      backgroundColor: '#f8f9fa',
      border: '1px dashed #dee2e6',
      borderRadius: '4px'
    }}>
      {showLabel && label && <label style={{ fontWeight: 'bold' }}>{label}: </label>}
      {fallbackText}
    </div>
  );

  return (
    <ArchbaseProtectedComponent
      actionName={actionName}
      actionDescription={actionDescription}
      fallback={fallbackComponent || defaultFallback}
    >
      {children}
    </ArchbaseProtectedComponent>
  );
};

// HOC para proteção de componentes inteiros
export function withArchbaseSecurity<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  securityOptions: {
    resourceName: string;
    resourceDescription: string;
    requiredPermissions?: string[];
    fallbackComponent?: ReactNode;
  }
) {
  return function ArchbaseSecurityWrappedComponent(props: P) {
    const { resourceName, resourceDescription, requiredPermissions, fallbackComponent } = securityOptions;
    
    return (
      <ArchbaseViewSecurityProvider
        resourceName={resourceName}
        resourceDescription={resourceDescription}
        requiredPermissions={requiredPermissions}
        fallbackComponent={fallbackComponent}
      >
        <WrappedComponent {...props} />
      </ArchbaseViewSecurityProvider>
    );
  };
}