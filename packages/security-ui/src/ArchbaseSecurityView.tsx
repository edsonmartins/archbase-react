/**
 * ArchbaseSecurityView — visão completa de usuários/grupos/permissões.
 * @status stable
 */
import { ARCHBASE_IOC_API_TYPE, builder, emit, processDetailErrorMessage, processErrorMessage, useValidationErrors } from '@archbase/core';
import { ArchbaseDataSource } from '@archbase/data';
// import { ArchbaseCountdownProgress } from '@archbase/components'; // Temporarily disabled
import {
	useArchbaseRemoteDataSourceV2,
	useArchbaseRemoteServiceApi,
	useArchbaseStore,
} from '@archbase/data';
import { useArchbaseTheme, isBase64Validate, useArchbaseValidator } from '@archbase/core';
import { useArchbaseListContext } from '@archbase/components';
import { ArchbaseListCustomItemProps } from '@archbase/components';
import { ArchbaseDialog, ArchbaseNotifications } from '@archbase/components';
import {
	ActionIcon,
	Badge,
	Button,
	Flex,
	Group,
	Paper,
	Tabs,
	Text,
	Tooltip,
	useMantineColorScheme,
} from '@mantine/core';
import { IconEdit, IconPlus, IconShieldCheckered, IconTrashX } from '@tabler/icons-react';
// Importações da DataGrid
import { ArchbaseDataGridColumn } from '@archbase/components';
import { ArchbaseDataGrid, ArchbaseDataGridRef, Columns } from '@archbase/components';
import { useArchbaseTranslation } from '@archbase/core';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ArchbaseAccessTokenService } from '@archbase/security';
import { ArchbaseGroupService } from '@archbase/security';
import { ArchbaseProfileService } from '@archbase/security';
import { ArchbaseResourceService } from '@archbase/security';
import { ArchbaseUserService } from '@archbase/security';
import { GroupModal, GroupModalOptions } from './GroupModal';
import { PermissionsSelectorModal } from './PermissionsSelectorModal';
import { ProfileModal, ProfileModalOptions } from './ProfileModal';
import { AccessTokenDto, GroupDto, ProfileDto, ResourceDto, UserDto } from '@archbase/security';
import { SecurityType } from '@archbase/security';
import { UserModal, UserModalOptions } from './UserModal';
import { IconEye } from '@tabler/icons-react';

import {
	NO_USER,
	renderGroups,
	renderProfile,
	UserItem,
	type ArchbaseSecurityManagerProps,
	type ArchbaseSecurityProps,
	type UserItemProps,
	SecurityGridPanel,
	SecurityRowActions,
	SecurityToolbarActions,
	useSecurityEntityActions,
	buildAccessTokenColumns,
	buildGroupColumns,
	buildProfileColumns,
	buildResourceColumns,
	buildUserColumns,
} from './securityView';

// Reexportados daqui porque eram declarados neste arquivo antes da separação: quem já
// importava estes nomes de 'ArchbaseSecurityView' continua importando.
export { NO_USER, UserItem, renderGroups, renderProfile };
export type { ArchbaseSecurityProps, ArchbaseSecurityManagerProps, UserItemProps };

export function ArchbaseSecurityView({
	height = '400px',
	width = '100%',
	createEntitiesWithId = true,
	userModalOptions,
	profileModalOptions,
	groupModalOptions,
	options,
}: ArchbaseSecurityManagerProps) {
	const theme = useArchbaseTheme();
	const templateStore = useArchbaseStore('securityStore');
	const validator = useArchbaseValidator();
	const { colorScheme } = useMantineColorScheme();
	const [error, setError] = useState<string | undefined>(undefined);
	const [activeTab, setActiveTab] = useState<string | null>('users');
	const userApi = useArchbaseRemoteServiceApi<ArchbaseUserService>(ARCHBASE_IOC_API_TYPE.User);
	const groupApi = useArchbaseRemoteServiceApi<ArchbaseGroupService>(ARCHBASE_IOC_API_TYPE.Group);
	const resourceApi = useArchbaseRemoteServiceApi<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource);
	const profileApi = useArchbaseRemoteServiceApi<ArchbaseProfileService>(ARCHBASE_IOC_API_TYPE.Profile);
	const [openedModal, setOpenedModal] = useState<string>('');
	const [openedPermissionsModal, setOpenedPermissionsModal] = useState<string>('');
	const accessTokenApi = useArchbaseRemoteServiceApi<ArchbaseAccessTokenService>(ARCHBASE_IOC_API_TYPE.AccessToken);
	const {t} = useArchbaseTranslation();

	// Referências para os grids
	const usersGridRef = useRef<ArchbaseDataGridRef | null>(null);
	const groupsGridRef = useRef<ArchbaseDataGridRef | null>(null);
	const profilesGridRef = useRef<ArchbaseDataGridRef | null>(null);
	const resourcesGridRef = useRef<ArchbaseDataGridRef | null>(null);
	const accessTokensGridRef = useRef<ArchbaseDataGridRef | null>(null);

	// Função para obter o ID da linha
	const getUserRowId = (row: UserDto): string => {
		return row.id;
	};

	const getGroupRowId = (row: GroupDto): string => {
		return row.id;
	};

	const getProfileRowId = (row: ProfileDto): string => {
		return row.id;
	};

	const getResourceRowId = (row: ResourceDto): string => {
		return row.id;
	};

	const getAccessTokenRowId = (row: AccessTokenDto): string => {
		return row.id;
	};

	const {
		dataSource: dsAccessTokens,
		isLoading: isLoadingAccessTokens,
		refreshData: refreshAccessTokens
	} = useArchbaseRemoteDataSourceV2<AccessTokenDto>({
		name: 'accessTokenApi',
		service: accessTokenApi,
		validator,
		pageSize: 25,
		defaultSortFields: ['user.email', 'expirationTime:desc'],
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(`${t('archbase:WARNING')}`, error, origin);
		},
	});

	const {
		dataSource: dsUsers,
		isLoading: isLoadingUsers,
		refreshData: refreshUsers
	} = useArchbaseRemoteDataSourceV2<UserDto>({
		name: 'dsUsers',
		service: userApi,
		validator,
		pageSize: 25,
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(`${t('archbase:WARNING')}`, error, origin);
		},
	});

	const {
		dataSource: dsGroups,
		isLoading: isLoadingGroups,
		refreshData: refreshGroups
	} = useArchbaseRemoteDataSourceV2<GroupDto>({
		name: 'dsGroups',
		service: groupApi,
		validator,
		pageSize: 25,
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(`${t('archbase:WARNING')}`, error, origin);
		},
	});

	const {
		dataSource: dsProfiles,
		isLoading: isLoadingProfiles,
		refreshData: refreshProfiles
	} = useArchbaseRemoteDataSourceV2<ProfileDto>({
		name: 'dsProfile',
		service: profileApi,
		validator,
		pageSize: 25,
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(`${t('archbase:WARNING')}`, error, origin);
		},
	});

	const {
		dataSource: dsResources,
		isLoading: isLoadingResources,
		refreshData: refreshResources
	} = useArchbaseRemoteDataSourceV2<ResourceDto>({
		name: 'dsResources',
		service: resourceApi,
		validator,
		pageSize: 25,
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(`${t('archbase:WARNING')}`, error, origin);
		},
	});

	// Carregar dados iniciais
	useEffect(() => {
		// AccessTokens with filter
		refreshAccessTokens({ filter: emit(builder.eq('revoked', 'false')) });
		// Other data sources
		refreshUsers();
		refreshGroups();
		refreshProfiles();
		refreshResources();
	}, []);

	// Colunas em securityView/columns.tsx — ver o porquê no cabeçalho daquele arquivo.
	const accessTokenColumns = buildAccessTokenColumns(t);
	const userColumns = buildUserColumns(t);
	const groupColumns = buildGroupColumns(t);
	const profileColumns = buildProfileColumns(t);
	const resourceColumns = buildResourceColumns(t);

	const validationContext = useValidationErrors();

	// Os gestos de cada entidade saem do mesmo hook. As cinco famílias de handler que
	// existiam aqui divergiam em detalhes que compilam igual — ver o cabeçalho de
	// securityView/useSecurityEntityActions.
	const userActions = useSecurityEntityActions<UserDto>({
		dataSource: dsUsers,
		securityType: SecurityType.USER,
		newInstance: () => UserDto.newInstance(),
		createEntitiesWithId,
		removeMessageKey: 'archbase:Deseja remover o usuário ',
		setOpenedModal,
		setOpenedPermissionsModal,
		validationContext,
		t,
	});

	const groupActions = useSecurityEntityActions<GroupDto>({
		dataSource: dsGroups,
		securityType: SecurityType.GROUP,
		newInstance: () => GroupDto.newInstance(),
		createEntitiesWithId,
		removeMessageKey: 'archbase:Deseja remover o grupo ',
		setOpenedModal,
		setOpenedPermissionsModal,
		validationContext,
		t,
	});

	const profileActions = useSecurityEntityActions<ProfileDto>({
		dataSource: dsProfiles,
		securityType: SecurityType.PROFILE,
		newInstance: () => ProfileDto.newInstance(),
		createEntitiesWithId,
		removeMessageKey: 'archbase:Deseja remover o perfil ',
		setOpenedModal,
		setOpenedPermissionsModal,
		validationContext,
		t,
	});

	const buildUserRowActions = (row: UserDto): ReactNode => (
		<SecurityRowActions<UserDto>
			row={row}
			onView={userActions.handleViewRow}
			onEdit={userActions.handleEditRow}
			onRemove={userActions.handleRemoveRow}
			onEditPermissions={userActions.handleOpenPermissionsModal}
			before={options?.beforeDefaultUserActions}
			after={options?.afterDefaultUserActions}
			t={t}
		/>
	);

	const buildGroupRowActions = (row: GroupDto): ReactNode => (
		<SecurityRowActions<GroupDto>
			row={row}
			onView={groupActions.handleViewRow}
			onEdit={groupActions.handleEditRow}
			onRemove={groupActions.handleRemoveRow}
			onEditPermissions={groupActions.handleOpenPermissionsModal}
			before={options?.beforeDefaultGroupActions}
			after={options?.afterDefaultGroupActions}
			t={t}
		/>
	);

	const buildProfileRowActions = (row: ProfileDto): ReactNode => (
		<SecurityRowActions<ProfileDto>
			row={row}
			onView={profileActions.handleViewRow}
			onEdit={profileActions.handleEditRow}
			onRemove={profileActions.handleRemoveRow}
			onEditPermissions={profileActions.handleOpenPermissionsModal}
			before={options?.beforeDefaultProfileActions}
			after={options?.afterDefaultProfileActions}
			t={t}
		/>
	);


	const handleAccessTokenRevokeRow = () => {
		const currentAccessToken = dsAccessTokens.getCurrentRecord();
		if (currentAccessToken) {
			ArchbaseDialog.showConfirmDialogYesNo(
				`${t('archbase:Confirme')}`,
				`${t('archbase:Deseja revogar o token de Acesso do usuário ')}${currentAccessToken.user.name} ?`,
				async () => {
					await accessTokenApi
						.revoke(currentAccessToken.token)
						.then(async () => {
							ArchbaseNotifications.showSuccess(
								`${t('mentors:Informação')}`,
								`${t('mentors:Token de Acesso revogado com sucesso!')}`,
							);
							dsAccessTokens.refreshData();
						})
						.catch((error) => {
							ArchbaseDialog.showErrorWithDetails(
								`${t('mentors:Atenção')}`,
								processErrorMessage(error),
								processDetailErrorMessage(error),
							);
						});
				},
				() => {},
			);
		}
	};

	const handleClosePermissionsModal = () => {
		setOpenedPermissionsModal('');
	};

	// Componentes de ações da barra de ferramentas para cada grid
	const renderAccessTokensToolbarActions = () : ReactNode => {
		return (
			<Flex justify={'space-between'} style={{ width: '50%' }}>
				<Group align="start" gap={'4px'} wrap='nowrap'>
					<Button
						disabled={!dsAccessTokens.getCurrentRecord()}
						color={'red'}
						leftSection={<IconTrashX />}
						onClick={handleAccessTokenRevokeRow}
					>
						{`${t('archbase:Revoke')}`}
					</Button>
				</Group>
			</Flex>
		);
	};

	return (
		<Paper p="md" style={{ height: height, display: 'flex', flexDirection: 'column' }}>
			<Tabs variant='pills' value={activeTab} onChange={setActiveTab}>
				<Tabs.List>
					<Tabs.Tab value="users">{`${t('Usuários')}`}</Tabs.Tab>
					<Tabs.Tab value="groups">{`${t('Grupos')}`}</Tabs.Tab>
					<Tabs.Tab value="profiles">{`${t('Perfis')}`}</Tabs.Tab>
					<Tabs.Tab value="resources">{`${t('Recursos')}`}</Tabs.Tab>
					<Tabs.Tab value="accessTokens">{`${t('Tokens Acesso')}`}</Tabs.Tab>
				</Tabs.List>
			</Tabs>
			<SecurityGridPanel<UserDto>
				active={activeTab === 'users'}
				printTitle={'Usuários'}
				gridRef={usersGridRef}
				dataSource={dsUsers}
				isLoading={isLoadingUsers}
				error={error}
				getRowId={getUserRowId}
				striped={true}
				toolbarLeftContent={
					<SecurityToolbarActions
						onAdd={userActions.handleAdd}
						onEditPermissions={userActions.handleOpenPermissionsModal}
						t={t}
					/>
				}
				renderRowActions={buildUserRowActions}
				actionsColumnWidth={options?.userActionsColumnWidth}
				children={userColumns}
			/>
			<SecurityGridPanel<GroupDto>
				active={activeTab === 'groups'}
				printTitle={'Grupos'}
				gridRef={groupsGridRef}
				dataSource={dsGroups}
				isLoading={isLoadingGroups}
				error={error}
				getRowId={getGroupRowId}
				toolbarLeftContent={
					<SecurityToolbarActions
						onAdd={groupActions.handleAdd}
						onEditPermissions={groupActions.handleOpenPermissionsModal}
						t={t}
					/>
				}
				renderRowActions={buildGroupRowActions}
				actionsColumnWidth={options?.groupActionsColumnWidth}
				children={groupColumns}
			/>
			<SecurityGridPanel<ProfileDto>
				active={activeTab === 'profiles'}
				printTitle={'Perfis'}
				gridRef={profilesGridRef}
				dataSource={dsProfiles}
				isLoading={isLoadingProfiles}
				error={error}
				getRowId={getProfileRowId}
				toolbarLeftContent={
					<SecurityToolbarActions
						onAdd={profileActions.handleAdd}
						onEditPermissions={profileActions.handleOpenPermissionsModal}
						t={t}
					/>
				}
				renderRowActions={buildProfileRowActions}
				actionsColumnWidth={options?.profileActionsColumnWidth}
				children={profileColumns}
			/>
			<SecurityGridPanel<ResourceDto>
				active={activeTab === 'resources'}
				printTitle={'Recursos'}
				gridRef={resourcesGridRef}
				dataSource={dsResources}
				isLoading={isLoadingResources}
				error={error}
				getRowId={getResourceRowId}
				enableRowActions={false}
				children={resourceColumns}
			/>
			<SecurityGridPanel<AccessTokenDto>
				active={activeTab === 'accessTokens'}
				printTitle={'Tokens de API'}
				gridRef={accessTokensGridRef}
				dataSource={dsAccessTokens}
				isLoading={isLoadingAccessTokens}
				error={error}
				getRowId={getAccessTokenRowId}
				striped={true}
				enableRowActions={false}
				toolbarLeftContent={renderAccessTokensToolbarActions()}
				children={accessTokenColumns}
			/>
			{openedModal === SecurityType.USER ? (
				<UserModal
					onClickOk={userActions.handleSaveModal}
					opened={true}
					dataSource={dsUsers}
					onClickCancel={userActions.handleCancelModal}
					options={userModalOptions}
				/>
			) : null}
			{openedModal === SecurityType.GROUP ? (
				<GroupModal
					onClickOk={groupActions.handleSaveModal}
					opened={true}
					dataSource={dsGroups}
					onClickCancel={groupActions.handleCancelModal}
					options={groupModalOptions}
				/>
			) : null}
			{openedModal === SecurityType.PROFILE ? (
				<ProfileModal
					onClickOk={profileActions.handleSaveModal}
					opened={true}
					dataSource={dsProfiles}
					onClickCancel={profileActions.handleCancelModal}
					options={profileModalOptions}
				/>
			) : null}
			{openedPermissionsModal === SecurityType.USER?
			<PermissionsSelectorModal
				dataSource={dsUsers}
				opened={!!openedPermissionsModal}
				close={handleClosePermissionsModal}
			/>:null}
			{openedPermissionsModal === SecurityType.GROUP?
			<PermissionsSelectorModal
				dataSource={dsGroups}
				opened={!!openedPermissionsModal}
				close={handleClosePermissionsModal}
			/>:null}
			{openedPermissionsModal === SecurityType.PROFILE?
			<PermissionsSelectorModal
				dataSource={dsProfiles}
				opened={!!openedPermissionsModal}
				close={handleClosePermissionsModal}
			/>:null}

		</Paper>
	);
}
