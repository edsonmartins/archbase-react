import { useForceUpdate } from '@mantine/hooks';

/**
 * Hook para forçar update do componente
 * @returns Função para forçar o update
 */
export function useArchbaseForceUpdate() {
  return useForceUpdate();
}