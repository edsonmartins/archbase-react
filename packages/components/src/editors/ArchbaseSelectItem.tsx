import { ReactNode } from 'react';

export interface ArchbaseSelectItemProps<T> {
	/** Texto a ser apresentado no select */
	label: ReactNode;
	/** Valor do item */
	value?: T;
	/** Indicador se o item está desabilitado */
	disabled?: boolean;
	/** Parâmetros adicionais */
	[key: string]: any;
}

export function ArchbaseSelectItem<T>(_props: ArchbaseSelectItemProps<T>) {
	return null;
}

ArchbaseSelectItem.displayName = 'ArchbaseSelectItem';
