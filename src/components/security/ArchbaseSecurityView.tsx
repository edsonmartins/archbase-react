import { ARCHBASE_IOC_API_TYPE, builder, emit, processDetailErrorMessage, processErrorMessage } from '@components/core';
import { ArchbaseDataSource } from '@components/datasource';
import { ArchbaseCountdownProgress } from '@components/editors';
import { useArchbaseV1V2Compatibility } from '@components/core/patterns/ArchbaseV1V2CompatibilityPattern';
import {
	useArchbaseListContext,
	useArchbaseRemoteDataSource,
	useArchbaseRemoteServiceApi,
	useArchbaseStore,
	useArchbaseTheme,
	useArchbaseValidator,
} from '@components/hooks';
import { ArchbaseListCustomItemProps } from '@components/list';
import { ArchbaseDialog, ArchbaseNotifications } from '@components/notification';
import { isBase64 } from '@components/validator';
import {
	ActionIcon,
	Badge,
	Box,
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
import { ArchbaseDataGridColumn } from 'components/datagrid';
import { ArchbaseDataGrid, ArchbaseDataGridRef, GridColumns } from 'components/datagrid/main';
import { t } from 'i18next';
import React, { ReactNode, useRef, useState } from 'react';
import { ArchbaseAccessTokenService } from './ArchbaseAccessTokenService';
import { ArchbaseGroupService } from './ArchbaseGroupService';
import { ArchbaseProfileService } from './ArchbaseProfileService';
import { ArchbaseResourceService } from './ArchbaseResourceService';
import { ArchbaseUserService } from './ArchbaseUserService';
import { GroupModal, GroupModalOptions } from './GroupModal';
import { PermissionsSelectorModal } from './PermissionsSelectorModal';
import { ProfileModal, ProfileModalOptions } from './ProfileModal';
import { AccessTokenDto, GroupDto, ProfileDto, ResourceDto, UserDto } from './SecurityDomain';
import { SecurityType } from './SecurityType';
import { UserModal, UserModalOptions } from './UserModal';
import { IconEye } from '@tabler/icons-react';

interface ArchbaseSecurityManagerProps {
	height?: any;
	width?: any;
	dataSourceUsers?: ArchbaseDataSource<UserDto, string>;
	createEntitiesWithId?: boolean;
	userModalOptions?: UserModalOptions;
	groupModalOptions?: GroupModalOptions;
	profileModalOptions?: ProfileModalOptions;
}

export const NO_USER =
	'data:image/png;base64,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';

const renderGroups = (user: UserDto) => {
	if (!user.groups) {
		return null;
	}
	return (
		<div style={{ display: 'flex' }}>
			{user.groups
				? user.groups.map((item, index) => {
						return (
							<div key={index} style={{ paddingRight: '2px' }}>
								<Badge color="blue">{item.group?.name}</Badge>
							</div>
						);
				  })
				: null}
		</div>
	);
};

const renderProfile = (user: UserDto) => {
	if (!user.profile) {
		return null;
	}
	return <Badge color="green">{user.profile?.name}</Badge>;
};

export interface UserItemProps extends ArchbaseListCustomItemProps<UserDto, string> {}

export const UserItem = (props: UserItemProps) => {
	const theme = useArchbaseTheme();
	const listContextValue = useArchbaseListContext<UserDto, string>();
	const itemRef = useRef<any>(null);

	const handleClick = (event) => {
		event.preventDefault();
		if (!props.disabled) {
			if (listContextValue.handleSelectItem) {
				listContextValue.handleSelectItem(props.index, props.recordData!);
			}
		}
	};

	const avatar =
		props.recordData && props.recordData.avatar && isBase64(props.recordData.avatar)
			? atob(props.recordData.avatar)
			: NO_USER;
	const backgroundColor = props.active ? listContextValue.activeBackgroundColor : '';
	const color = props.active ? listContextValue.activeColor : '';

	return (
		<div
			onClick={handleClick}
			style={{
				padding: '8px',
				backgroundColor,
				color,
				cursor: props.disabled ? 'not-allowed' : 'pointer',
			}}
			ref={itemRef}
			tabIndex={-1}
		>
			<Group wrap="nowrap">
				<img
					style={{ width: '48px', borderRadius: 50 }}
					src={avatar}
					alt={props.recordData ? props.recordData.userName : ''}
				/>
				<div>
					<Text size="sm">{props.recordData.name}</Text>
					<Text size="xs" opacity={0.65}>
						{props.recordData.email}
					</Text>
				</div>
			</Group>
		</div>
	);
};

export function ArchbaseSecurityView({
	height = '400px',
	width = '100%',
	createEntitiesWithId = true,
	userModalOptions,
	profileModalOptions,
	groupModalOptions,
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

	// 🔄 MIGRAÇÃO V1/V2: Compatibilidade para DataSources principais
	const usersV1V2 = useArchbaseV1V2Compatibility<UserDto>(
		'ArchbaseSecurityView-Users',
		undefined, // Will be set when dsUsers is available
		undefined,
		undefined
	);

	const groupsV1V2 = useArchbaseV1V2Compatibility<GroupDto>(
		'ArchbaseSecurityView-Groups',
		undefined, // Will be set when dsGroups is available
		undefined,
		undefined
	);

	const profilesV1V2 = useArchbaseV1V2Compatibility<ProfileDto>(
		'ArchbaseSecurityView-Profiles',
		undefined, // Will be set when dsProfiles is available
		undefined,
		undefined
	);

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

	const { dataSource: dsAccessTokens, isLoading: isLoadingAccessTokens } = useArchbaseRemoteDataSource<
		AccessTokenDto,
		string
	>({
		name: 'accessTokenApi',
		service: accessTokenApi,
		store: templateStore,
		validator,
		pageSize: 25,
		loadOnStart: true,
		filter: emit(builder.or(builder.eq('revoked', `false`))),
		sort: ['user.email', 'expirationTime:desc'],
		onLoadComplete: (dataSource) => {
			//
		},
		onDestroy: (dataSource) => {
			//
		},
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin);
		},
	});

	const { dataSource: dsUsers, isLoading: isLoadingUsers } = useArchbaseRemoteDataSource<UserDto, string>({
		name: 'dsUsers',
		service: userApi,
		store: templateStore,
		validator,
		pageSize: 25,
		loadOnStart: true,
		onLoadComplete: (dataSource) => {
			//
		},
		onDestroy: (dataSource) => {
			//
		},
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin);
		},
	});

	const { dataSource: dsGroups, isLoading: isLoadingGroups } = useArchbaseRemoteDataSource<GroupDto, string>({
		name: 'dsGroups',
		service: groupApi,
		store: templateStore,
		validator,
		pageSize: 25,
		loadOnStart: true,
		onLoadComplete: (dataSource) => {
			//
		},
		onDestroy: (dataSource) => {
			//
		},
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin);
		},
	});

	const { dataSource: dsProfiles, isLoading: isLoadingProfiles } = useArchbaseRemoteDataSource<ProfileDto, string>({
		name: 'dsProfile',
		service: profileApi,
		store: templateStore,
		validator,
		pageSize: 25,
		loadOnStart: true,
		onLoadComplete: (dataSource) => {
			//
		},
		onDestroy: (dataSource) => {
			//
		},
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin);
		},
	});

	const { dataSource: dsResources, isLoading: isLoadingResources } = useArchbaseRemoteDataSource<ResourceDto, string>({
		name: 'dsResources',
		service: resourceApi,
		store: templateStore,
		validator,
		pageSize: 25,
		loadOnStart: true,
		onLoadComplete: (dataSource) => {
			//
		},
		onDestroy: (dataSource) => {
			//
		},
		onError: (error, origin) => {
			setError(error);
			ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin);
		},
	});

	const heightTab = `calc(${height} - 40px)`;

	const accessTokenColumns = (
		<GridColumns>
			<ArchbaseDataGridColumn<AccessTokenDto>
				dataField="user.avatar"
				dataType="image"
				size={80}
				header={t('archbase:Foto')}
				render={(data) => (
					<img
						style={{ borderRadius: 50, height: '32px', maxHeight: '32px' }}
						src={data.row.user && data.row.user.avatar ? atob(data.row.user.avatar) : NO_USER}
					/>
				)}
				inputFilterType="text"
				align="center"
			/>
			<ArchbaseDataGridColumn<AccessTokenDto>
				dataField="user.userName"
				dataType="text"
				size={300}
				header={t('archbase:Nome de Usuário')}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<AccessTokenDto>
				dataField="user.email"
				dataType="text"
				header={t('archbase:Email')}
				size={300}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<AccessTokenDto>
				dataField="expirationDate"
				dataType="text"
				size={300}
				header={t('archbase:Expira em')}
				render={(data) => <ArchbaseCountdownProgress color="orange" targetDate={data.row.expirationDate} />}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<AccessTokenDto>
				dataField="revoked"
				dataType="boolean"
				header={t('archbase:Revogado ?')}
				inputFilterType="checkbox"
			/>
			<ArchbaseDataGridColumn<AccessTokenDto>
				dataField="expired"
				dataType="boolean"
				header={t('archbase:Expirado ?')}
				inputFilterType="checkbox"
			/>
			<ArchbaseDataGridColumn<AccessTokenDto>
				dataField="token"
				dataType="text"
				header={t('archbase:Token Acesso')}
				size={300}
				inputFilterType="text"
			/>
		</GridColumns>
	);

	const userColumns = (
		<GridColumns>
			<ArchbaseDataGridColumn<UserDto>
				dataField="avatar"
				dataType="image"
				size={80}
				header={t('archbase:Foto')}
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
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="name"
				dataType="text"
				size={300}
				header={t('archbase:Nome')}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="nickname"
				dataType="text"
				size={120}
				header={t('archbase:Apelido')}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="email"
				dataType="text"
				header={t('archbase:Email')}
				size={300}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="profile.name"
				dataType="text"
				header={t('archbase:Perfil')}
				size={200}
				render={(data) => renderProfile(data.row)}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="groups"
				dataType="text"
				size={300}
				header={t('archbase:Grupos')}
				render={(data) => renderGroups(data.row)}
				enableSorting={false}
				enableColumnFilter={false}
				enableGlobalFilter={false}
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="isAdministrator"
				dataType="boolean"
				header={t('archbase:Admin ?')}
				inputFilterType="checkbox"
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="changePasswordOnNextLogin"
				dataType="boolean"
				header={t('archbase:Alt.senha próximo login?')}
				inputFilterType="checkbox"
				size={120}
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="allowPasswordChange"
				dataType="boolean"
				header={t('archbase:Pode alterar senha?')}
				inputFilterType="checkbox"
				size={120}
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="allowMultipleLogins"
				dataType="boolean"
				header={t('archbase:Permite multiplos logins?')}
				inputFilterType="checkbox"
				size={120}
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="passwordNeverExpires"
				dataType="boolean"
				header={t('archbase:Senha nunca expira?')}
				inputFilterType="checkbox"
				size={120}
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="accountDeactivated"
				dataType="boolean"
				header={t('archbase:Desativado?')}
				inputFilterType="checkbox"
				size={120}
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="accountLocked"
				dataType="boolean"
				header={t('archbase:Bloqueado?')}
				inputFilterType="checkbox"
				size={120}
			/>
			<ArchbaseDataGridColumn<UserDto>
				dataField="unlimitedAccessHours"
				dataType="boolean"
				header={t('archbase:Horário acesso ilimitado?')}
				inputFilterType="checkbox"
				size={140}
			/>
		</GridColumns>
	);

	const groupColumns = (
		<GridColumns>
			<ArchbaseDataGridColumn<GroupDto>
				dataField="name"
				dataType="text"
				size={300}
				header={t('archbase:Nome do grupo')}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<GroupDto>
				dataField="description"
				dataType="text"
				header={t('archbase:Descrição')}
				size={800}
				inputFilterType="text"
			/>
		</GridColumns>
	);

	const profileColumns = (
		<GridColumns>
			<ArchbaseDataGridColumn<ProfileDto>
				dataField="name"
				dataType="text"
				size={300}
				header={t('archbase:Nome do perfil')}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<ProfileDto>
				dataField="description"
				dataType="text"
				header={t('archbase:Descrição')}
				size={800}
				inputFilterType="text"
			/>
		</GridColumns>
	);

	const resourceColumns = (
		<GridColumns>
			<ArchbaseDataGridColumn<ResourceDto>
				dataField="name"
				dataType="text"
				size={300}
				header={t('archbase:Nome do recurso')}
				inputFilterType="text"
			/>
			<ArchbaseDataGridColumn<ResourceDto>
				dataField="description"
				dataType="text"
				header={t('archbase:Descrição')}
				size={800}
				inputFilterType="text"
			/>
		</GridColumns>
	);

	const handleAddUserExecute = () => {
		const user = UserDto.newInstance();
		if (!createEntitiesWithId) {
			user.id = undefined;
		}
		
		// 🔄 MIGRAÇÃO V1/V2: Inserção com compatibilidade
		dsUsers.insert(user);
		
		// Se for V1, forçar atualização
		if (dsUsers && !usersV1V2.isDataSourceV2) {
			usersV1V2.v1State.forceUpdate();
		}
		
		setOpenedModal(SecurityType.USER);
	};

	const handleUserEditRow = (row: any) => {
		if (!dsUsers.isEmpty()) {
			const currentUser = dsUsers.gotoRecordByData(row);
			if (currentUser) {
				dsUsers.edit();
				
				// 🔄 MIGRAÇÃO V1/V2: Edição com compatibilidade V1
				if (!usersV1V2.isDataSourceV2) {
					usersV1V2.v1State.forceUpdate();
				}
				
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
						
						// 🔄 MIGRAÇÃO V1/V2: Remoção com compatibilidade V1
						if (!usersV1V2.isDataSourceV2) {
							usersV1V2.v1State.forceUpdate();
						}
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
				<ActionIcon variant="transparent" onClick={() => handleUserViewRow(row)}>
					<IconEye size={20} color={theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleUserEditRow(row)}>
					<IconEdit size={20} color={theme.colorScheme === 'dark' ? theme.colors.yellow[8] : theme.colors.yellow[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleUserRemoveRow(row)}>
					<IconTrashX size={20} color={theme.colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} />
				</ActionIcon>
				<Tooltip withinPortal withArrow position="left" label={t('archbase:Edit permissions')}>
					<ActionIcon variant="transparent" onClick={handleOpenUserPermissionsModal}>
						<IconShieldCheckered size={20} color={theme.colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[4]} />
					</ActionIcon>
				</Tooltip>
			</Group>
		);
	};

	const handleAddGroupExecute = () => {
		const group = GroupDto.newInstance();
		if (!createEntitiesWithId) {
			group.id = undefined;
		}
		
		// 🔄 MIGRAÇÃO V1/V2: Inserção com compatibilidade
		dsGroups.insert(group);
		
		// Se for V1, forçar atualização
		if (dsGroups && !groupsV1V2.isDataSourceV2) {
			groupsV1V2.v1State.forceUpdate();
		}
		
		setOpenedModal(SecurityType.GROUP);
	};

	const handleGroupEditRow = (row: any) => {
		if (!dsGroups.isEmpty()) {
			const currentGroup = dsGroups.gotoRecordByData(row);
			if (currentGroup) {
				dsGroups.edit();
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
				<ActionIcon variant="transparent" onClick={() => handleGroupViewRow(row)}>
					<IconEye size={20} color={theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleGroupEditRow(row)}>
					<IconEdit size={20} color={theme.colorScheme === 'dark' ? theme.colors.yellow[8] : theme.colors.yellow[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleGroupRemoveRow(row)}>
					<IconTrashX size={20} color={theme.colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} />
				</ActionIcon>
				<Tooltip withinPortal withArrow position="left" label={t('archbase:Edit permissions')}>
					<ActionIcon variant="transparent" onClick={handleOpenGroupPermissionsModal}>
						<IconShieldCheckered size={20} color={theme.colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[4]} />
					</ActionIcon>
				</Tooltip>
			</Group>
		);
	};

	const handleCloseUserModal = () => {
		setOpenedModal('');
	};

	const handleCloseGroupModal = () => {
		setOpenedModal('');
	};

	const handleCloseProfileModal = () => {
		setOpenedModal('');
	};

	const handleAddProfileExecute = () => {
		const profile = ProfileDto.newInstance();
		if (!createEntitiesWithId) {
			profile.id = undefined;
		}
		
		// 🔄 MIGRAÇÃO V1/V2: Inserção com compatibilidade
		dsProfiles.insert(profile);
		
		// Se for V1, forçar atualização
		if (dsProfiles && !profilesV1V2.isDataSourceV2) {
			profilesV1V2.v1State.forceUpdate();
		}
		
		setOpenedModal(SecurityType.PROFILE);
	};

	const handleProfileEditRow = (row: any) => {
		if (!dsProfiles.isEmpty()) {
			const currentProfile = dsProfiles.gotoRecordByData(row);
			if (currentProfile) {
				dsProfiles.edit();
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
				<ActionIcon variant="transparent" onClick={() => handleProfileViewRow(row)}>
					<IconEye size={20} color={theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleProfileEditRow(row)}>
					<IconEdit size={20} color={theme.colorScheme === 'dark' ? theme.colors.yellow[8] : theme.colors.yellow[4]} />
				</ActionIcon>
				<ActionIcon variant="transparent" onClick={() => handleProfileRemoveRow(row)}>
					<IconTrashX size={20} color={theme.colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} />
				</ActionIcon>
				<Tooltip withinPortal withArrow position="left" label={t('archbase:Edit permissions')}>
					<ActionIcon variant="transparent" onClick={handleOpenProfilePermissionsModal}>
						<IconShieldCheckered size={20} color={theme.colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[4]} />
					</ActionIcon>
				</Tooltip>
			</Group>
		);
	};

	const handleAccessTokenRevokeRow = () => {
		if (dsAccessTokens.getCurrentRecord()) {
			ArchbaseDialog.showConfirmDialogYesNo(
				`${t('archbase:Confirme')}`,
				`${t('archbase:Deseja revogar o token de Acesso do usuário ')}${dsAccessTokens.getCurrentRecord().user.name} ?`,
				async () => {
					await accessTokenApi
						.revoke(dsAccessTokens.getCurrentRecord().token)
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
						{t('archbase:New')}
					</Button>
					<Button color={'blue'} leftSection={<IconEdit />} onClick={handleOpenUserPermissionsModal}>
						{t('archbase:Edit permissions')}
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
						{t('archbase:New')}
					</Button>
					<Button color={'blue'} leftSection={<IconEdit />} onClick={handleOpenGroupPermissionsModal}>
						{t('archbase:Edit permissions')}
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
						{t('archbase:New')}
					</Button>
					<Button color={'blue'} leftSection={<IconEdit />} onClick={handleOpenProfilePermissionsModal}>
						{t('archbase:Edit permissions')}
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
						{t('archbase:Revoke')}
					</Button>
				</Group>
			</Flex>
		);
	};

	return (
		<Paper style={{ height: height }}>
			<Tabs variant='pills' value={activeTab} onChange={setActiveTab}>
				<Tabs.List>
					<Tabs.Tab value="users">{t('Usuários')}</Tabs.Tab>
					<Tabs.Tab value="groups">{t('Grupos')}</Tabs.Tab>
					<Tabs.Tab value="profiles">{t('Perfis')}</Tabs.Tab>
					<Tabs.Tab value="resources">{t('Recursos')}</Tabs.Tab>
					<Tabs.Tab value="accessTokens">{t('Tokens Acesso')}</Tabs.Tab>
				</Tabs.List>
			</Tabs>
			<Box
				style={{
					height: heightTab,
					display: activeTab === 'users' ? 'flex' : 'none',
					width: '100%',
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
					children={userColumns}
				/>
			</Box>
			<Box
				style={{
					height: heightTab,
					display: activeTab === 'groups' ? 'flex' : 'none',
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
					children={groupColumns}
					toolbarLeftContent={renderGroupsToolbarActions()}
				/>
			</Box>
			<Box
				style={{
					height: heightTab,
					display: activeTab === 'profiles' ? 'flex' : 'none',
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
					children={profileColumns}
				/>
			</Box>
			<Box
				style={{
					height: heightTab,
					display: activeTab === 'resources' ? 'flex' : 'none',
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
			</Box>
			<Box
				style={{
					height: heightTab,
					display: activeTab === 'accessTokens' ? 'flex' : 'none',
					width: '100%',
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
			</Box>
			{openedModal === SecurityType.USER ? (
				<UserModal
					onClickOk={handleCloseUserModal}
					opened={true}
					dataSource={dsUsers}
					onClickCancel={handleCloseUserModal}
					options={userModalOptions}
				/>
			) : null}
			{openedModal === SecurityType.GROUP ? (
				<GroupModal
					onClickOk={handleCloseGroupModal}
					opened={true}
					dataSource={dsGroups}
					onClickCancel={handleCloseGroupModal}
					options={groupModalOptions}
				/>
			) : null}
			{openedModal === SecurityType.PROFILE ? (
				<ProfileModal
					onClickOk={handleCloseProfileModal}
					opened={true}
					dataSource={dsProfiles}
					onClickCancel={handleCloseProfileModal}
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
