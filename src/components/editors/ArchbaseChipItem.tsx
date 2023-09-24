import { CSSProperties } from 'react';

export interface ArchbaseChipItemProps<T> {
  /** Texto a ser apresentado no select */
  label: string;
  /** Cor de fundo do item */
  value?: T;
  /** Controla a aparência do chip, sendo padrão "filled" para dark theme e "outline" para light theme. ("outline" | "light" | "filled")*/
  variant?: 'outline' | 'light' | 'filled';
  /** Tipo do chip */
  type?: 'checkbox' | 'radio';
  /** Estilo do chip */
  style?: CSSProperties;
}

export function ArchbaseChipItem<T>(_props: ArchbaseChipItemProps<T>) {
  return null;
}

ArchbaseChipItem.displayName = 'ArchbaseChipItem';
