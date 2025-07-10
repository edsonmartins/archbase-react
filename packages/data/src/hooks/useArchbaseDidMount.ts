import { useEffect } from 'react';

/**
 * Hook que executa um callback quando o componente é montado
 * @param callback Função a ser executada no mount
 */
export function useArchbaseDidMount(callback: () => void): void {
  useEffect(() => {
    callback();
  }, []);
}