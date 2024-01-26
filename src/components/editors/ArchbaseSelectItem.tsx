import { ReactNode } from 'react';

export interface ArchbaseSelectItemProps<T> {
	/** Texto a ser apresentado no select */
	label: ReactNode;
	/** Cor de fundo do item */
	value?: T;
	/** Indicador se o item está desabilitado */
	disabled: boolean;
}

export function ArchbaseSelectItem<T>(_props: ArchbaseSelectItemProps<T>) {
	return null;
}

ArchbaseSelectItem.displayName = 'ArchbaseSelectItem';
