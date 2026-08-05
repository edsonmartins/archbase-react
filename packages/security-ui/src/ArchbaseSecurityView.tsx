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

	const handleAddUserExecute = () => {
		const user = UserDto.newInstance();
		if (!createEntitiesWithId) {
			(user as any).id = undefined;
		}
		dsUsers.insert(user);
		setOpenedModal(SecurityType.USER);
	};

	const handleUserEditRow = (row: any) => {
		if (!dsUsers.isEmpty()) {
			const currentUser = dsUsers.gotoRecordByData(row);
			if (currentUser) {
				dsUsers.edit();
				setOpenedModal(SecurityType.USER);
			}
		}
	};

	const handleUserRemoveRow = (row: any) => {
		if (!dsUsers.isEmpty()) {
			const currentUser = dsUsers.gotoRecordByData(row);
			if (currentUser) {
				ArchbaseDialog.showConfirmDialogYesNo(
					`${t('archbase:Confirme')}`,
					`${t('archbase:Deseja remover o usuário ')}${row.name} ?`,
					() => {
						dsUsers.remove();
					},
					() => {},
				);
			}
		}
	};

	const handleUserViewRow = (row: any) => {
		if (!dsUsers.isEmpty()) {
			const currentUser = dsUsers.gotoRecordByData(row);
			if (currentUser) {
				setOpenedModal(SecurityType.USER);
			}
		}
	};

	const buildUserRowActions = (row: UserDto): ReactNode => {
		return (
			<Group gap={1} wrap="nowrap">
				{options?.beforeDefaultUserActions?.(row)}
				<ActionIcon variant="transparent" onClick={() => handleUserViewRow(row)}>
					<IconEye size={20} color={colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleUserEditRow(row)}>
					<IconEdit size={20} color={colorScheme === 'dark' ? theme.colors.yellow[8] : theme.colors.yellow[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleUserRemoveRow(row)}>
					<IconTrashX size={20} color={colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} />
				</ActionIcon>
				<Tooltip withinPortal withArrow position="left" label={`${t('archbase:Edit permissions')}`}>
					<ActionIcon variant="transparent" onClick={handleOpenUserPermissionsModal}>
						<IconShieldCheckered size={20} color={colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[4]} />
					</ActionIcon>
				</Tooltip>
				{options?.afterDefaultUserActions?.(row)}
			</Group>
		);
	};

	const handleAddGroupExecute = () => {
		const group = GroupDto.newInstance();
		if (!createEntitiesWithId) {
			(group as any).id = undefined;
		}
		dsGroups.insert(group);
		setOpenedModal(SecurityType.GROUP);
	};

	const handleGroupEditRow = (row: any) => {
		if (!dsGroups.isEmpty()) {
			const currentGroup = dsGroups.gotoRecordByData(row);
			if (currentGroup) {
				if (!dsGroups.isEditing()) {
					dsGroups.edit();
				}
				setOpenedModal(SecurityType.GROUP);
			}
		}
	};

	const handleGroupRemoveRow = (row: any) => {
		if (!dsGroups.isEmpty()) {
			const currentGroup = dsGroups.gotoRecordByData(row);
			if (currentGroup) {
				ArchbaseDialog.showConfirmDialogYesNo(
					`${t('archbase:Confirme')}`,
					`${t('archbase:Deseja remover o grupo ')}${row.name} ?`,
					() => {
						dsGroups.remove();
					},
					() => {},
				);
			}
		}
	};

	const handleGroupViewRow = (row: any) => {
		if (!dsGroups.isEmpty()) {
			const currentGroup = dsGroups.gotoRecordByData(row);
			if (currentGroup) {
				setOpenedModal(SecurityType.GROUP);
			}
		}
	};

	const buildGroupRowActions = (row: GroupDto): ReactNode => {
		return (
			<Group gap={1} wrap="nowrap">
				{options?.beforeDefaultGroupActions?.(row)}
				<ActionIcon variant="transparent" onClick={() => handleGroupViewRow(row)}>
					<IconEye size={20} color={colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleGroupEditRow(row)}>
					<IconEdit size={20} color={colorScheme === 'dark' ? theme.colors.yellow[8] : theme.colors.yellow[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleGroupRemoveRow(row)}>
					<IconTrashX size={20} color={colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} />
				</ActionIcon>
				<Tooltip withinPortal withArrow position="left" label={`${t('archbase:Edit permissions')}`}>
					<ActionIcon variant="transparent" onClick={handleOpenGroupPermissionsModal}>
						<IconShieldCheckered size={20} color={colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[4]} />
					</ActionIcon>
				</Tooltip>
				{options?.afterDefaultGroupActions?.(row)}
			</Group>
		);
	};

	const validationContext = useValidationErrors();

	const handleSaveUserModal = async () => {
		try {
			await dsUsers.save();
		} catch (_error) {
			return;
		}
		setOpenedModal('');
		validationContext?.clearAll();
	};

	const handleCancelUserModal = () => {
		setOpenedModal('');
		if (!dsUsers.isBrowsing()) {
			dsUsers.cancel();
		}
		validationContext?.clearAll();
	};

	const handleSaveGroupModal = async () => {
		try {
			await dsGroups.save();
		} catch (_error) {
			return;
		}
		setOpenedModal('');
		validationContext?.clearAll();
	};

	const handleCancelGroupModal = () => {
		setOpenedModal('');
		if (!dsGroups.isBrowsing()) {
			dsGroups.cancel();
		}
		validationContext?.clearAll();
	};

	const handleSaveProfileModal = async () => {
		try {
			await dsProfiles.save();
		} catch (_error) {
			return;
		}
		setOpenedModal('');
		validationContext?.clearAll();
	};

	const handleCancelProfileModal = () => {
		setOpenedModal('');
		if (!dsProfiles.isBrowsing()) {
			dsProfiles.cancel();
		}
		validationContext?.clearAll();
	};

	const handleAddProfileExecute = () => {
		const profile = ProfileDto.newInstance();
		if (!createEntitiesWithId) {
			(profile as any).id = undefined;
		}
		dsProfiles.insert(profile);
		setOpenedModal(SecurityType.PROFILE);
	};

	const handleProfileEditRow = (row: any) => {
		if (!dsProfiles.isEmpty()) {
			const currentProfile = dsProfiles.gotoRecordByData(row);
			if (currentProfile) {
				if (!dsProfiles.isEditing()) {
					dsProfiles.edit();
				}
				setOpenedModal(SecurityType.PROFILE);
			}
		}
	};

	const handleProfileRemoveRow = (row: any) => {
		if (!dsProfiles.isEmpty()) {
			const currentProfile = dsProfiles.gotoRecordByData(row);
			if (currentProfile) {
				ArchbaseDialog.showConfirmDialogYesNo(
					`${t('archbase:Confirme')}`,
					`${t('archbase:Deseja remover o perfil ')}${row.name} ?`,
					() => {
						dsProfiles.remove();
					},
					() => {},
				);
			}
		}
	};

	const handleProfileViewRow = (row: any) => {
		if (!dsProfiles.isEmpty()) {
			const currentProfile = dsProfiles.gotoRecordByData(row);
			if (currentProfile) {
				setOpenedModal(SecurityType.PROFILE);
			}
		}
	};

	const buildProfileRowActions = (row: ProfileDto): ReactNode => {
		return (
			<Group gap={1} wrap="nowrap">
				{options?.beforeDefaultProfileActions?.(row)}
				<ActionIcon variant="transparent" onClick={() => handleProfileViewRow(row)}>
					<IconEye size={20} color={colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleProfileEditRow(row)}>
					<IconEdit size={20} color={colorScheme === 'dark' ? theme.colors.yellow[8] : theme.colors.yellow[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleProfileRemoveRow(row)}>
					<IconTrashX size={20} color={colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} />
				</ActionIcon>
				<Tooltip withinPortal withArrow position="left" label={`${t('archbase:Edit permissions')}`}>
					<ActionIcon variant="transparent" onClick={handleOpenProfilePermissionsModal}>
						<IconShieldCheckered size={20} color={colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[4]} />
					</ActionIcon>
				</Tooltip>
				{options?.afterDefaultProfileActions?.(row)}
			</Group>
		);
	};

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

	const handleOpenUserPermissionsModal = () => {
		setOpenedPermissionsModal(SecurityType.USER);
	};

	const handleOpenGroupPermissionsModal = () => {
		setOpenedPermissionsModal(SecurityType.GROUP);
	};

	const handleOpenProfilePermissionsModal = () => {
		setOpenedPermissionsModal(SecurityType.PROFILE);
	};

	const handleClosePermissionsModal = () => {
		setOpenedPermissionsModal('');
	};

	// Componentes de ações da barra de ferramentas para cada grid
	const renderUsersToolbarActions = () : ReactNode => {
		return (
			<Flex justify={'space-between'} style={{ width: '50%' }}>
				<Group align="end" gap={'4px'} wrap="nowrap">
					<Button color={'green'} leftSection={<IconPlus />} onClick={handleAddUserExecute}>
						{`${t('archbase:New')}`}
					</Button>
					<Button color={'blue'} leftSection={<IconEdit />} onClick={handleOpenUserPermissionsModal}>
						{`${t('archbase:Edit permissions')}`}
					</Button>
				</Group>
				<Flex align={'flex-start'} justify={'flex-end'} style={{ width: '200px' }}></Flex>
			</Flex>
		);
	};

	const renderGroupsToolbarActions = () : ReactNode => {
		return (
			<Flex justify={'space-between'} style={{ width: '50%' }}>
				<Group align="end" gap={'4px'} wrap="nowrap">
					<Button color={'green'} leftSection={<IconPlus />} onClick={handleAddGroupExecute}>
						{`${t('archbase:New')}`}
					</Button>
					<Button color={'blue'} leftSection={<IconEdit />} onClick={handleOpenGroupPermissionsModal}>
						{`${t('archbase:Edit permissions')}`}
					</Button>
				</Group>
				<Flex align={'flex-start'} justify={'flex-end'} style={{ width: '200px' }}></Flex>
			</Flex>
		);
	};

	const renderProfilesToolbarActions = ()  : ReactNode => {
		return (
			<Flex justify={'space-between'} style={{ width: '50%' }}>
				<Group align="end" gap={'4px'} wrap='nowrap'>
					<Button color={'green'} leftSection={<IconPlus />} onClick={handleAddProfileExecute}>
						{`${t('archbase:New')}`}
					</Button>
					<Button color={'blue'} leftSection={<IconEdit />} onClick={handleOpenProfilePermissionsModal}>
						{`${t('archbase:Edit permissions')}`}
					</Button>
				</Group>
				<Flex align={'flex-start'} justify={'flex-end'} style={{ width: '200px' }}></Flex>
			</Flex>
		);
	};

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
			<Paper
				withBorder
				mt="md"
				style={{
					display: activeTab === 'users' ? 'flex' : 'none',
					width: '100%',
					flex: 1,
					minHeight: 0,
					overflow: 'auto'
				}}
			>
				<ArchbaseDataGrid<UserDto, string>
					gridRef={usersGridRef}
					printTitle={'Usuários'}
					width={'100%'}
					height={'100%'}
					withBorder={false}
					dataSource={dsUsers}
					withColumnBorders={true}
					striped={true}
					enableTopToolbar={true}
					enableRowActions={true}
					pageSize={50}
					isLoading={isLoadingUsers}
					isError={!!error}
					error={error}
					enableGlobalFilter={true}
					getRowId={getUserRowId}
					toolbarLeftContent={renderUsersToolbarActions()}
					renderRowActions={buildUserRowActions}
					actionsColumnWidth={options?.userActionsColumnWidth}
					children={userColumns}
				/>
			</Paper>
			<Paper
				withBorder
				mt="md"
				style={{
					display: activeTab === 'groups' ? 'flex' : 'none',
					flex: 1,
					minHeight: 0,
					overflow: 'auto'
				}}
			>
				<ArchbaseDataGrid<GroupDto, string>
					gridRef={groupsGridRef}
					printTitle={'Grupos'}
					width={'100%'}
					height={'100%'}
					withBorder={false}
					dataSource={dsGroups}
					withColumnBorders={true}
					striped={false}
					enableTopToolbar={true}
					enableRowActions={true}
					pageSize={50}
					isLoading={isLoadingGroups}
					isError={!!error}
					error={error}
					enableGlobalFilter={true}
					getRowId={getGroupRowId}
					renderRowActions={buildGroupRowActions}
					actionsColumnWidth={options?.groupActionsColumnWidth}
					children={groupColumns}
					toolbarLeftContent={renderGroupsToolbarActions()}
				/>
			</Paper>
			<Paper
				withBorder
				mt="md"
				style={{
					display: activeTab === 'profiles' ? 'flex' : 'none',
					flex: 1,
					minHeight: 0,
					overflow: 'auto'
				}}
			>
				<ArchbaseDataGrid<ProfileDto, string>
					gridRef={profilesGridRef}
					printTitle={'Perfis'}
					width={'100%'}
					height={'100%'}
					withBorder={false}
					dataSource={dsProfiles}
					withColumnBorders={true}
					striped={false}
					enableTopToolbar={true}
					enableRowActions={true}
					pageSize={50}
					isLoading={isLoadingProfiles}
					isError={!!error}
					error={error}
					enableGlobalFilter={true}
					getRowId={getProfileRowId}
					toolbarLeftContent={renderProfilesToolbarActions()}
					renderRowActions={buildProfileRowActions}
					actionsColumnWidth={options?.profileActionsColumnWidth}
					children={profileColumns}
				/>
			</Paper>
			<Paper
				withBorder
				mt="md"
				style={{
					display: activeTab === 'resources' ? 'flex' : 'none',
					flex: 1,
					minHeight: 0,
					overflow: 'auto'
				}}
			>
				<ArchbaseDataGrid<ResourceDto, string>
					gridRef={resourcesGridRef}
					printTitle={'Recursos'}
					width={'100%'}
					height={'100%'}
					withBorder={false}
					dataSource={dsResources}
					withColumnBorders={true}
					striped={false}
					enableTopToolbar={true}
					enableRowActions={false}
					pageSize={50}
					isLoading={isLoadingResources}
					isError={!!error}
					error={error}
					enableGlobalFilter={true}
					getRowId={getResourceRowId}
					children={resourceColumns}
				/>
			</Paper>
			<Paper
				withBorder
				mt="md"
				style={{
					display: activeTab === 'accessTokens' ? 'flex' : 'none',
					width: '100%',
					flex: 1,
					minHeight: 0,
					overflow: 'auto'
				}}
			>
				<ArchbaseDataGrid<AccessTokenDto, string>
					gridRef={accessTokensGridRef}
					printTitle={'Tokens de API'}
					width={'100%'}
					height={'100%'}
					withBorder={false}
					dataSource={dsAccessTokens}
					withColumnBorders={true}
					striped={true}
					enableTopToolbar={true}
					enableRowActions={false}
					pageSize={50}
					isLoading={isLoadingAccessTokens}
					isError={!!error}
					error={error}
					enableGlobalFilter={true}
					getRowId={getAccessTokenRowId}
					toolbarLeftContent={renderAccessTokensToolbarActions()}
					children={accessTokenColumns}
				/>
			</Paper>
			{openedModal === SecurityType.USER ? (
				<UserModal
					onClickOk={handleSaveUserModal}
					opened={true}
					dataSource={dsUsers}
					onClickCancel={handleCancelUserModal}
					options={userModalOptions}
				/>
			) : null}
			{openedModal === SecurityType.GROUP ? (
				<GroupModal
					onClickOk={handleSaveGroupModal}
					opened={true}
					dataSource={dsGroups}
					onClickCancel={handleCancelGroupModal}
					options={groupModalOptions}
				/>
			) : null}
			{openedModal === SecurityType.PROFILE ? (
				<ProfileModal
					onClickOk={handleSaveProfileModal}
					opened={true}
					dataSource={dsProfiles}
					onClickCancel={handleCancelProfileModal}
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
