import { useEffect } from 'react';

/**
 * Hook que executa um callback quando o componente será desmontado
 * @param callback Função a ser executada no unmount
 */
export function useArchbaseWillUnmount(callback: () => void): void {
  useEffect(() => {
    return () => {
      callback();
    };
  }, []);
}