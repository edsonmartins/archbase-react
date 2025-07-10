import { useMantineTheme, MantineTheme } from '@mantine/core';

/**
 * Hook que retorna o tema atual do Mantine
 * @returns Tema do Mantine
 */
export function useArchbaseTheme(): MantineTheme {
  return useMantineTheme();
}