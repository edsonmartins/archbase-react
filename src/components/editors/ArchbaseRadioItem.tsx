export interface ArchbaseRadioItemProps<T> {
  /** Texto a ser apresentado no radio */
  label: string;
  /** Cor de fundo do item */
  value?: T;
  /** Indicador se o item está desabilitado */
  disabled: boolean;
}

export function ArchbaseSelectItem<T>(_props: ArchbaseRadioItemProps<T>) {
  return null;
}

ArchbaseSelectItem.displayName = 'ArchbaseRadioItem';
