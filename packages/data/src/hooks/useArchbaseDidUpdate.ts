import { useEffect } from 'react';

/**
 * Hook que executa um callback quando o componente é atualizado
 * @param callback Função a ser executada no update
 * @param deps Array de dependências (opcional)
 */
export function useArchbaseDidUpdate(callback: () => void, deps?: React.DependencyList): void {
  useEffect(() => {
    callback();
  }, deps);
}
