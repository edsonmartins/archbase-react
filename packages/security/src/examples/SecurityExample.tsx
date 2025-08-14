import React from 'react';
import {
  ArchbaseSecurityProvider,
  ArchbaseViewSecurityProvider,
  ArchbaseProtectedComponent,
  ArchbaseSecureActionButton,
  useArchbaseSecurity,
  useArchbaseViewSecurity,
  useArchbaseSecureForm
} from '../index';
import { UserDto } from '../SecurityDomain';

// Exemplo de uso básico
export const SecurityExample: React.FC = () => {
  const mockUser: UserDto = {
    id: '1',
    userName: 'admin',
    email: 'admin@example.com',
    isAdministrator: true,
    active: true,
    changePasswordOnNextLogin: false,
    allowPasswordChange: true,
    allowMultipleLogins: true,
    passwordNeverExpires: false,
    accountDeactivated: false,
    accountLocked: false,
    unlimitedAccessHours: true,
    groups: [],
    profile: null,
    accessSchedule: null
  };

  return (
    <ArchbaseSecurityProvider user={mockUser}>
      <div>
        <h1>Sistema de Segurança Archbase</h1>
        <GlobalSecurityExample />
        
        <ArchbaseViewSecurityProvider 
          resourceName="user_management" 
          resourceDescription="Gerenciamento de Usuários"
        >
          <ViewSecurityExample />
        </ArchbaseViewSecurityProvider>
      </div>
    </ArchbaseSecurityProvider>
  );
};

// Exemplo de uso do contexto global
const GlobalSecurityExample: React.FC = () => {
  const { user, isAdmin, hasGlobalPermission } = useArchbaseSecurity();
  
  return (
    <div>
      <h2>Contexto Global</h2>
      <p>Usuário: {user?.userName}</p>
      <p>É Admin: {isAdmin ? 'Sim' : 'Não'}</p>
      <p>Tem permissão global 'admin': {hasGlobalPermission('admin') ? 'Sim' : 'Não'}</p>
    </div>
  );
};

// Exemplo de uso do contexto de view
const ViewSecurityExample: React.FC = () => {
  const { hasPermission, registerAction } = useArchbaseViewSecurity();
  const { canCreate, canEdit, canDelete } = useArchbaseSecureForm('user', 'usuário');
  
  React.useEffect(() => {
    registerAction('special_action', 'Ação especial do usuário');
  }, [registerAction]);

  return (
    <div>
      <h2>Contexto de View</h2>
      <p>Pode criar: {canCreate ? 'Sim' : 'Não'}</p>
      <p>Pode editar: {canEdit ? 'Sim' : 'Não'}</p>
      <p>Pode deletar: {canDelete ? 'Sim' : 'Não'}</p>
      
      <ArchbaseProtectedComponent
        actionName="special_action"
        actionDescription="Ação especial"
        fallback={<p>Você não tem permissão para ver esta ação especial</p>}
      >
        <p>Conteúdo da ação especial!</p>
      </ArchbaseProtectedComponent>

      <ArchbaseSecureActionButton
        actionName="delete"
        actionDescription="Deletar usuário"
        variant="danger"
        onClick={() => alert('Deletar usuário')}
      >
        Deletar Usuário
      </ArchbaseSecureActionButton>
    </div>
  );
};