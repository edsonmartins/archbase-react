import { useCallback, useState } from 'react';

/**
 * Hook que força o re-render do componente
 * @returns Função para forçar o re-render
 */
export function useArchbaseForceRerender(): () => void {
  const [, setToggle] = useState(0);
  
  const forceRerender = useCallback(() => {
    setToggle(prev => prev + 1);
  }, []);
  
  return forceRerender;
}