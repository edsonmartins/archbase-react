import type { ReactNode } from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
import type { GroupDto, ProfileDto, UserDto } from '@archbase/security';
import type { GroupModalOptions } from '../GroupModal';
import type { ProfileModalOptions } from '../ProfileModal';
import type { UserModalOptions } from '../UserModal';

/**
 * Pontos de inserção da view — os <b>slots</b>.
 *
 * <p>A convenção é {@code before<Região>} / {@code after<Região>}: a aplicação devolve o
 * nó a inserir e o framework decide onde ele cai. É o que permite compor informação de
 * negócio (departamento, centro de custo, contrato) numa tela que o framework desenha,
 * sem que o framework precise conhecer esses conceitos.
 */
export interface ArchbaseSecurityProps {
	beforeDefaultUserActions?: (row: UserDto) => ReactNode;
	afterDefaultUserActions?: (row: UserDto) => ReactNode;
	beforeDefaultProfileActions?: (row: ProfileDto) => ReactNode;
	afterDefaultProfileActions?: (row: ProfileDto) => ReactNode;
	beforeDefaultGroupActions?: (row: GroupDto) => ReactNode;
	afterDefaultGroupActions?: (row: GroupDto) => ReactNode;
	userActionsColumnWidth?: number;
	profileActionsColumnWidth?: number;
	groupActionsColumnWidth?: number;
}

export interface ArchbaseSecurityManagerProps {
	height?: any;
	width?: any;
	dataSourceUsers?: ArchbaseDataSource<UserDto, string>;
	createEntitiesWithId?: boolean;
	userModalOptions?: UserModalOptions;
	groupModalOptions?: GroupModalOptions;
	profileModalOptions?: ProfileModalOptions;
	options?: ArchbaseSecurityProps;
}
