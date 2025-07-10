import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar estado booleano com funções helper
 * @param initialValue Valor inicial (padrão: false)
 * @returns [valor, setTrue, setFalse, toggle]
 */
export function useArchbaseBool(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);
  
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  
  return [value, setTrue, setFalse, toggle] as const;
}