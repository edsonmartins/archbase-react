import { useEffect, useState } from 'react';
import { useContainer } from 'inversify-react';
import { ARCHBASE_IOC_API_TYPE } from '../core/ioc';
import { ArchbaseTokenManager } from '../auth/ArchbaseTokenManager';

export interface PasswordRememberReturnType {
  saveUsernameAndPassword: (username: string, password: string) => void;
  clear: () => void;
  username: string | null;
  password: string | null;
  rememberMe: boolean;
}
export const useArchbasePasswordRemember = (): PasswordRememberReturnType => {
  const tokenManager = useContainer((container) => container.get<ArchbaseTokenManager>(ARCHBASE_IOC_API_TYPE.TokenManager));
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const usernameAndPassword = tokenManager.getUsernameAndPassword();
    if (usernameAndPassword) {
      setUsername(usernameAndPassword.username);
      setPassword(usernameAndPassword.password);
    }
  }, []);

  const clear = () => {
    tokenManager.clearUsernameAndPassword();
    setUsername(null);
    setPassword(null);
  };

  const saveUsernameAndPassword = (username: string, password: string) => {
    tokenManager.saveUsernameAndPassword(username, password);
  };

  return {
    saveUsernameAndPassword,
    clear,
    username,
    password,
    rememberMe: !username && !password,
  };
};
