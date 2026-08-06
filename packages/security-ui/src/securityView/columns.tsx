/**
 * Definições de coluna dos grids da {@link ArchbaseSecurityView}.
 *
 * <p>Eram 250 das 1047 linhas da view — JSX declarativo que empurrava a lógica para longe
 * de quem a lia. Dependiam apenas da função de tradução, então saem como fábricas que a
 * recebem, e passam a poder ser reusadas por outras telas do pacote.
 */
import React from 'react';
import { Badge, Text } from '@mantine/core';
import { ArchbaseDataGridColumn, Columns } from '@archbase/components';
import { NO_USER } from './noUserAvatar';
import { renderGroups, renderProfile } from './UserItem';
import type { AccessTokenDto, GroupDto, ProfileDto, ResourceDto, UserDto } from '@archbase/security';

/** A função de tradução do {@code useArchbaseTranslation}. */
/** Assinatura do `t` devolvido por useArchbaseTranslation. */
export type TranslateFn = (chave: string, opcoes?: any) => string | object;


export const buildAccessTokenColumns = (t: TranslateFn) => (
	<Columns>
		<ArchbaseDataGridColumn<AccessTokenDto>
			dataField="user.avatar"
			dataType="image"
			size={80}
			header={`${t('archbase:Foto')}`}
			render={(data) => (
				<img
					style={{ borderRadius: 50, height: '32px', maxHeight: '32px' }}
					src={data.row.user && data.row.user.avatar ? atob(data.row.user.avatar) : NO_USER}
				/>
			)}
			inputFilterType="text"
			align="center"
			exportable={false}
		/>
		<ArchbaseDataGridColumn<AccessTokenDto>
			dataField="user.userName"
			dataType="text"
			size={300}
			header={`${t('archbase:Nome de Usuário')}`}
			inputFilterType="text"
		/>
		<ArchbaseDataGridColumn<AccessTokenDto>
			dataField="user.email"
			dataType="text"
			header={`${t('archbase:Email')}`}
			size={300}
			inputFilterType="text"
		/>
		<ArchbaseDataGridColumn<AccessTokenDto>
			dataField="expirationDate"
			dataType="text"
			size={300}
			header={`${t('archbase:Expira em')}`}
			render={(data) => <Text size="sm">{data.row.expirationDate}</Text>}
			inputFilterType="text"
		/>
		<ArchbaseDataGridColumn<AccessTokenDto>
			dataField="revoked"
			dataType="boolean"
			header={`${t('archbase:Revogado ?')}`}
			inputFilterType="checkbox"
		/>
		<ArchbaseDataGridColumn<AccessTokenDto>
			dataField="expired"
			dataType="boolean"
			header={`${t('archbase:Expirado ?')}`}
			inputFilterType="checkbox"
		/>
		<ArchbaseDataGridColumn<AccessTokenDto>
			dataField="token"
			dataType="text"
			header={`${t('archbase:Token Acesso')}`}
			size={300}
			inputFilterType="text"
		/>
	</Columns>
);

export const buildUserColumns = (t: TranslateFn) => (
	<Columns>
		<ArchbaseDataGridColumn<UserDto>
			dataField="avatar"
			dataType="image"
			size={80}
			header={`${t('archbase:Foto')}`}
			render={(data) => (
				<img
					style={{ borderRadius: 50, height: '32px', maxHeight: '32px' }}
					src={data.row.avatar ? atob(data.row.avatar) : NO_USER}
				/>
			)}
			enableSorting={false}
			enableColumnFilter={false}
			enableGlobalFilter={false}
			align="center"
			exportable={false}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="name"
			dataType="text"
			size={300}
			header={`${t('archbase:Nome')}`}
			inputFilterType="text"
			truncate={true}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="nickname"
			dataType="text"
			size={120}
			header={`${t('archbase:Apelido')}`}
			inputFilterType="text"
			truncate={true}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="email"
			dataType="text"
			header={`${t('archbase:Email')}`}
			size={300}
			inputFilterType="text"
			truncate={true}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="accountDeactivated"
			dataType="boolean"
			header={`${t('archbase:Desativado?')}`}
			inputFilterType="checkbox"
			size={120}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="profile.name"
			dataType="text"
			header={`${t('archbase:Perfil')}`}
			size={200}
			render={(data) => renderProfile(data.row)}
			inputFilterType="text"
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="groups"
			dataType="text"
			size={300}
			header={`${t('archbase:Grupos')}`}
			render={(data) => renderGroups(data.row)}
			exportValue={(row) =>
				row.groups
					?.slice()
					.sort((a, b) => (a.group?.name ?? '').localeCompare(b.group?.name ?? ''))
					.map((g) => g.group?.name)
					.filter(Boolean)
					.join(', ') || ''
			}
			enableSorting={false}
			enableColumnFilter={false}
			enableGlobalFilter={false}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="isAdministrator"
			dataType="boolean"
			header={`${t('archbase:Admin ?')}`}
			inputFilterType="checkbox"
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="changePasswordOnNextLogin"
			dataType="boolean"
			header={`${t('archbase:Alt.senha próximo login?')}`}
			inputFilterType="checkbox"
			size={120}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="allowPasswordChange"
			dataType="boolean"
			header={`${t('archbase:Pode alterar senha?')}`}
			inputFilterType="checkbox"
			size={120}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="allowMultipleLogins"
			dataType="boolean"
			header={`${t('archbase:Permite multiplos logins?')}`}
			inputFilterType="checkbox"
			size={120}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="passwordNeverExpires"
			dataType="boolean"
			header={`${t('archbase:Senha nunca expira?')}`}
			inputFilterType="checkbox"
			size={120}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="passwordChangedAt"
			dataType="datetime"
			header={`${t('archbase:Última troca de senha')}`}
			inputFilterType="date-range"
			size={160}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="accountLocked"
			dataType="boolean"
			header={`${t('archbase:Bloqueado?')}`}
			inputFilterType="checkbox"
			size={120}
		/>
		<ArchbaseDataGridColumn<UserDto>
			dataField="unlimitedAccessHours"
			dataType="boolean"
			header={`${t('archbase:Horário acesso ilimitado?')}`}
			inputFilterType="checkbox"
			size={140}
		/>
	</Columns>
);

export const buildGroupColumns = (t: TranslateFn) => (
	<Columns>
		<ArchbaseDataGridColumn<GroupDto>
			dataField="name"
			dataType="text"
			size={300}
			header={`${t('archbase:Nome do grupo')}`}
			inputFilterType="text"
		/>
		<ArchbaseDataGridColumn<GroupDto>
			dataField="description"
			dataType="text"
			header={`${t('archbase:Descrição')}`}
			size={800}
			inputFilterType="text"
		/>
	</Columns>
);

export const buildProfileColumns = (t: TranslateFn) => (
	<Columns>
		<ArchbaseDataGridColumn<ProfileDto>
			dataField="name"
			dataType="text"
			size={300}
			header={`${t('archbase:Nome do perfil')}`}
			inputFilterType="text"
		/>
		<ArchbaseDataGridColumn<ProfileDto>
			dataField="description"
			dataType="text"
			header={`${t('archbase:Descrição')}`}
			size={800}
			inputFilterType="text"
		/>
	</Columns>
);

export const buildResourceColumns = (t: TranslateFn) => (
	<Columns>
		<ArchbaseDataGridColumn<ResourceDto>
			dataField="name"
			dataType="text"
			size={300}
			header={`${t('archbase:Nome do recurso')}`}
			inputFilterType="text"
		/>
		<ArchbaseDataGridColumn<ResourceDto>
			dataField="description"
			dataType="text"
			header={`${t('archbase:Descrição')}`}
			size={800}
			inputFilterType="text"
		/>
	</Columns>
);
