import { useElementSize } from '@mantine/hooks';

/**
 * Hook que retorna o tamanho de um elemento
 * @returns Objeto com ref e dimensões do elemento
 */
export function useArchbaseSize() {
  return useElementSize();
}