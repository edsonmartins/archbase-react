import { useState, useEffect } from 'react';

export function useArchbasePasswordRemember() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('archbase-username');
    const savedPassword = localStorage.getItem('archbase-password');
    const savedRemember = localStorage.getItem('archbase-remember-me') === 'true';

    if (savedRemember && savedUsername) {
      setUsername(savedUsername);
      setPassword(savedPassword || '');
      setRememberMe(true);
    }
  }, []);

  const saveCredentials = (user: string, pass: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem('archbase-username', user);
      localStorage.setItem('archbase-password', pass);
      localStorage.setItem('archbase-remember-me', 'true');
    } else {
      localStorage.removeItem('archbase-username');
      localStorage.removeItem('archbase-password');
      localStorage.removeItem('archbase-remember-me');
    }
  };

  const clearCredentials = () => {
    localStorage.removeItem('archbase-username');
    localStorage.removeItem('archbase-password');
    localStorage.removeItem('archbase-remember-me');
    setUsername('');
    setPassword('');
    setRememberMe(false);
  };

  return {
    rememberMe,
    username,
    password,
    setRememberMe,
    setUsername,
    setPassword,
    saveCredentials,
    clearCredentials
  };
}