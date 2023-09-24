export interface ArchbaseRadioItemProps<T> {
  /** Texto a ser apresentado no radio */
  label: string;
  /** Cor de fundo do item */
  value?: T;
  /** Indicador se o item está desabilitado */
  disabled: boolean;
}

export function ArchbaseRadioItem<T>(_props: ArchbaseRadioItemProps<T>) {
  return null;
}

ArchbaseRadioItem.displayName = 'ArchbaseRadioItem';
