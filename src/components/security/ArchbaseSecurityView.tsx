import { ARCHBASE_IOC_API_TYPE, builder, emit, processDetailErrorMessage, processErrorMessage } from '@components/core'
import { ArchbaseDataSource } from '@components/datasource'
import { ArchbaseDataTable, ArchbaseDataTableColumn, ArchbaseTableRowActions, Columns, ToolBarActions } from '@components/datatable'
import { ArchbaseCountdownProgress } from '@components/editors'
import { useArchbaseListContext, useArchbaseRemoteDataSource, useArchbaseRemoteServiceApi, useArchbaseStore, useArchbaseTheme, useArchbaseValidator } from '@components/hooks'
import { ArchbaseListCustomItemProps } from '@components/list'
import { ArchbaseDialog, ArchbaseNotifications } from '@components/notification'
import { isBase64 } from '@components/validator'
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
  useMantineColorScheme
} from '@mantine/core'
import {
  IconEdit,
  IconPlus,
  IconShieldCheckered,
  IconTrashX
} from '@tabler/icons-react'
import { t } from 'i18next'
import React, { ReactNode, useRef, useState } from 'react'
import { ArchbaseAccessTokenService } from './ArchbaseAccessTokenService'
import { ArchbaseGroupService } from './ArchbaseGroupService'
import { ArchbaseProfileService } from './ArchbaseProfileService'
import { ArchbaseResourceService } from './ArchbaseResourceService'
import { ArchbaseUserService } from './ArchbaseUserService'
import { GroupModal } from './GroupModal'
import { PermissionsSelectorModal } from './PermissionsSelectorModal'
import { ProfileModal } from './ProfileModal'
import { AccessTokenDto, GroupDto, ProfileDto, ResourceDto, UserDto } from './SecurityDomain'
import { SecurityType } from './SecurityType'
import { UserModal } from './UserModal'

interface ArchbaseSecurityManagerProps {
  height?: any
  width?: any
  dataSourceUsers?: ArchbaseDataSource<UserDto, string>
  createEntitiesWithId?: boolean
}

export const NO_USER = 'data:image/png;base64,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'

const renderGroups = (user: UserDto) => {
  if (!user.groups) {
    return null;
  }
  return <div style={{ display: 'flex' }}>
    {user.groups ? user.groups.map((item) => {
      return <div style={{ paddingRight: '2px' }}><Badge color="blue">{item.group?.name}</Badge></div>
    }) : null}
  </div>
}

const renderProfile = (user: UserDto) => {
  if (!user.profile) {
    return null;
  }
  return <Badge color="green">{user.profile?.name}</Badge>
}

export interface UserItemProps extends ArchbaseListCustomItemProps<UserDto, string> { }

export const UserItem = (props: UserItemProps) => {
  const theme = useArchbaseTheme()
  const listContextValue = useArchbaseListContext<UserDto, string>()
  const itemRef = useRef<any>(null)

  const handleClick = (event) => {
    event.preventDefault()
    if (!props.disabled) {
      if (listContextValue.handleSelectItem) {
        listContextValue.handleSelectItem(props.index, props.recordData!)
      }
    }
  }

  const avatar =
    props.recordData && props.recordData.avatar && isBase64(props.recordData.avatar)
      ? atob(props.recordData.avatar)
      : NO_USER
  const backgroundColor = props.active ? listContextValue.activeBackgroundColor : ''
  const color = props.active ? listContextValue.activeColor : ''

  return (
    <div
      onClick={handleClick}
      style={{
        padding: '8px',
        backgroundColor,
        color,
        cursor: props.disabled ? 'not-allowed' : 'pointer'
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
  )
}



export function ArchbaseSecurityView({
  height = '400px',
  width = '100%',
  createEntitiesWithId = true
}: ArchbaseSecurityManagerProps) {
  const theme = useArchbaseTheme()
  const templateStore = useArchbaseStore('securityStore')
  const validator = useArchbaseValidator();
  const { colorScheme } = useMantineColorScheme()
  const [error, setError] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<string | null>('users')
  const userApi = useArchbaseRemoteServiceApi<ArchbaseUserService>(ARCHBASE_IOC_API_TYPE.User)
  const groupApi = useArchbaseRemoteServiceApi<ArchbaseGroupService>(ARCHBASE_IOC_API_TYPE.Group)
  const resourceApi = useArchbaseRemoteServiceApi<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource)
  const profileApi = useArchbaseRemoteServiceApi<ArchbaseProfileService>(ARCHBASE_IOC_API_TYPE.Profile)
  const [openedModal, setOpenedModal] = useState<string>('')
  const [openedPermissionsModal, setOpenedPermissionsModal] = useState<string>('')
  const accessTokenApi = useArchbaseRemoteServiceApi<ArchbaseAccessTokenService>(ARCHBASE_IOC_API_TYPE.AccessToken);

  const { dataSource: dsAccessTokens } = useArchbaseRemoteDataSource<AccessTokenDto, string>({
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

  const { dataSource: dsUsers } = useArchbaseRemoteDataSource<UserDto, string>({
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
      setError(error)
      ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin)
    }
  })

  const { dataSource: dsGroups } = useArchbaseRemoteDataSource<GroupDto, string>({
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
      setError(error)
      ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin)
    }
  })

  const { dataSource: dsProfiles } = useArchbaseRemoteDataSource<ProfileDto, string>({
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
      setError(error)
      ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin)
    }
  })

  const { dataSource: dsResources } = useArchbaseRemoteDataSource<ResourceDto, string>({
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
      setError(error)
      ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin)
    }
  })

  const heightTab = `calc(${height} - 40px)`

  const columns = (
    <Columns>
      <ArchbaseDataTableColumn<AccessTokenDto>
        dataField="user.avatar"
        dataType="image"
        size={50}
        header={t('archbase:Foto')}
        render={(cell) => (
          <img
            style={{ borderRadius: 50, height: '36px', maxHeight: '36px' }}
            src={
              cell.row.original.user && cell.row.original.user.avatar ? atob(cell.row.original.user.avatar) : NO_USER
            }
          />
        )}
        inputFilterType="text"
        align="center"
      />
      <ArchbaseDataTableColumn<AccessTokenDto>
        dataField="user.userName"
        dataType="text"
        size={300}
        header={t('archbase:Nome de Usuário')}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<AccessTokenDto>
        dataField="user.email"
        dataType="text"
        header={t('archbase:Email')}
        size={300}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<AccessTokenDto>
        dataField="expirationDate"
        dataType="text"
        size={300}
        header={t('archbase:Expira em')}
        render={(cell) => <ArchbaseCountdownProgress color="orange" targetDate={cell.row.original.expirationDate} />}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<AccessTokenDto>
        dataField="revoked"
        dataType="boolean"
        header={t('archbase:Revogado ?')}
        inputFilterType="checkbox"
      />
      <ArchbaseDataTableColumn<AccessTokenDto>
        dataField="expired"
        dataType="boolean"
        header={t('archbase:Expirado ?')}
        inputFilterType="checkbox"
      />
      <ArchbaseDataTableColumn<AccessTokenDto>
        dataField="token"
        dataType="text"
        header={t('archbase:Token Acesso')}
        size={200}
        inputFilterType="text"
      />
    </Columns>
  );

  const userColumns = (
    <Columns>
      <ArchbaseDataTableColumn<UserDto>
        dataField="avatar"
        dataType="image"
        size={50}
        header={t('archbase:Foto')}
        render={(cell) => (
          <img
            style={{ borderRadius: 50, height: '36px', maxHeight: '36px' }}
            src={cell.row.original.avatar ? atob(cell.row.original.avatar) : NO_USER}
          />
        )}
        inputFilterType="text"
        align='center'
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="name"
        dataType="text"
        size={300}
        header={t('archbase:Nome')}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="nickname"
        dataType="text"
        size={120}
        header={t('archbase:Apelido')}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="email"
        dataType="text"
        header={t('archbase:Email')}
        size={300}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="profile.name"
        dataType="text"
        header={t('archbase:Perfil')}
        size={200}
        render={(cell) => renderProfile(cell.row.original)}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="groups"
        dataType="text"
        size={300}
        header={t('archbase:Grupos')}
        render={(cell) => renderGroups(cell.row.original)}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="isAdministrator"
        dataType="boolean"
        header={t('archbase:Admin ?')}
        inputFilterType="checkbox"
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="changePasswordOnNextLogin"
        dataType="boolean"
        header={t('archbase:Alt.senha próximo login?')}
        inputFilterType="checkbox"
        size={80}
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="allowPasswordChange"
        dataType="boolean"
        header={t('archbase:Pode alterar senha?')}
        inputFilterType="checkbox"
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="allowMultipleLogins"
        dataType="boolean"
        header={t('archbase:Permite multiplos logins?')}
        inputFilterType="checkbox"
        size={80}
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="passwordNeverExpires"
        dataType="boolean"
        header={t('archbase:Senha nunca expira?')}
        inputFilterType="checkbox"
        size={80}
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="accountDeactivated"
        dataType="boolean"
        header={t('archbase:Desativado?')}
        inputFilterType="checkbox"
        size={80}
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="accountLocked"
        dataType="boolean"
        header={t('archbase:Bloqueado?')}
        inputFilterType="checkbox"
        size={80}
      />
      <ArchbaseDataTableColumn<UserDto>
        dataField="unlimitedAccessHours"
        dataType="boolean"
        header={t('archbase:Horário acesso ilimitado?')}
        inputFilterType="checkbox"
        size={80}
      />
    </Columns>
  )

  const groupColumns = (
    <Columns>
      <ArchbaseDataTableColumn<GroupDto>
        dataField="name"
        dataType="text"
        size={300}
        header={t('archbase:Nome do grupo')}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<GroupDto>
        dataField="description"
        dataType="text"
        header={t('archbase:Descrição')}
        size={800}
        inputFilterType="text"
      />
    </Columns>
  )

  const profileColumns = (
    <Columns>
      <ArchbaseDataTableColumn<ProfileDto>
        dataField="name"
        dataType="text"
        size={300}
        header={t('archbase:Nome do perfil')}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<ProfileDto>
        dataField="description"
        dataType="text"
        header={t('archbase:Descrição')}
        size={800}
        inputFilterType="text"
      />
    </Columns>
  )

  const resourceColumns = (
    <Columns>
      <ArchbaseDataTableColumn<ResourceDto>
        dataField="name"
        dataType="text"
        size={300}
        header={t('archbase:Nome do recurso')}
        inputFilterType="text"
      />
      <ArchbaseDataTableColumn<ResourceDto>
        dataField="description"
        dataType="text"
        header={t('archbase:Descrição')}
        size={800}
        inputFilterType="text"
      />
    </Columns>
  )

  const handleAddUserExecute = () => {
    const user = UserDto.newInstance()
    if (!createEntitiesWithId) {
      user.id = undefined
    }
    dsUsers.insert(user)
    setOpenedModal(SecurityType.USER)
  }

  const handleUserEditRow = (user: any) => {
    if (!dsUsers.isEmpty()) {
      const currentUser = dsUsers.gotoRecordByData(user.original)
      if (currentUser) {
        dsUsers.edit()
        setOpenedModal(SecurityType.USER)
      }
    }
  }

  const handleUserRemoveRow = (user: any) => {
    if (!dsUsers.isEmpty()) {
      const currentUser = dsUsers.gotoRecordByData(user.original)
      if (currentUser) {
        ArchbaseDialog.showConfirmDialogYesNo(
          `${t('archbase:Confirme')}`,
          `${t('archbase:Deseja remover o usuário ')}${user.original.name} ?`,
          () => {
            dsUsers.remove()
          },
          () => { }
        )
      }
    }
  }

  const handleUserViewRow = (user: any) => {
    if (!dsUsers.isEmpty()) {
      const currentUser = dsUsers.gotoRecordByData(user.original)
      if (currentUser) {
        setOpenedModal(SecurityType.USER)
      }
    }
  }

  const buildUserRowActions = ({ row }): ReactNode | undefined => {
    return (
      <Group gap={4} wrap='nowrap'>
        <ArchbaseTableRowActions<UserDto>
          onEditRow={handleUserEditRow}
          onRemoveRow={handleUserRemoveRow}
          onViewRow={handleUserViewRow}
          row={row}
        ></ArchbaseTableRowActions>
        <Tooltip withinPortal withArrow position="left" label={t('archbase:Edit permissions')}>
          <ActionIcon
            variant='transparent'
            onClick={handleOpenUserPermissionsModal}
          >
            <IconShieldCheckered color={theme.colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[4]} />
          </ActionIcon>
        </Tooltip>
      </Group>
    )
  }

  const handleAddGroupExecute = () => {
    const group = GroupDto.newInstance()
    if (!createEntitiesWithId) {
      group.id = undefined
    }
    dsGroups.insert(group)
    setOpenedModal(SecurityType.GROUP)
  }

  const handleGroupEditRow = (group: any) => {
    if (!dsGroups.isEmpty()) {
      const currentGroup = dsGroups.gotoRecordByData(group.original)
      if (currentGroup) {
        dsGroups.edit()
        setOpenedModal(SecurityType.GROUP)
      }
    }
  }

  const handleGroupRemoveRow = (group: any) => {
    if (!dsGroups.isEmpty()) {
      const currentGroup = dsGroups.gotoRecordByData(group.original)
      if (currentGroup) {
        ArchbaseDialog.showConfirmDialogYesNo(
          `${t('archbase:Confirme')}`,
          `${t('archbase:Deseja remover o grupo ')}${group.original.name} ?`,
          () => {
            dsGroups.remove()
          },
          () => { }
        )
      }
    }
  }

  const handleGroupViewRow = (group: any) => {
    if (!dsGroups.isEmpty()) {
      const currentGroup = dsGroups.gotoRecordByData(group.original)
      if (currentGroup) {
        setOpenedModal(SecurityType.GROUP)
      }
    }
  }

  const buildGroupRowActions = ({ row }): ReactNode | undefined => {
    return (
      <Group gap={4} wrap='nowrap'>
        <ArchbaseTableRowActions<GroupDto>
          onEditRow={handleGroupEditRow}
          onRemoveRow={handleGroupRemoveRow}
          onViewRow={handleGroupViewRow}
          row={row}
        ></ArchbaseTableRowActions>
        <Tooltip withinPortal withArrow position="left" label={t('archbase:Edit permissions')}>
          <ActionIcon
            variant='transparent'
            onClick={handleOpenGroupPermissionsModal}
          >
            <IconShieldCheckered color={theme.colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[4]} />
          </ActionIcon>
        </Tooltip>
      </Group>
    )
  }

  const handleCloseUserModal = () => {
    setOpenedModal('')
  }

  const handleCloseGroupModal = () => {
    setOpenedModal('')
  }

  const handleCloseProfileModal = () => {
    setOpenedModal('')
  }

  const handleAddProfileExecute = () => {
    const profile = ProfileDto.newInstance()
    if (!createEntitiesWithId) {
      profile.id = undefined
    }
    dsProfiles.insert(profile)
    setOpenedModal(SecurityType.PROFILE)
  }

  const handleProfileEditRow = (profile: any) => {
    if (!dsProfiles.isEmpty()) {
      const currentProfile = dsProfiles.gotoRecordByData(profile.original)
      if (currentProfile) {
        dsProfiles.edit()
        setOpenedModal(SecurityType.PROFILE)
      }
    }
  }

  const handleProfileRemoveRow = (profile: any) => {
    if (!dsProfiles.isEmpty()) {
      const currentProfile = dsProfiles.gotoRecordByData(profile.original)
      if (currentProfile) {
        ArchbaseDialog.showConfirmDialogYesNo(
          `${t('archbase:Confirme')}`,
          `${t('archbase:Deseja remover o perfil ')}${profile.original.name} ?`,
          () => {
            dsProfiles.remove()
          },
          () => { }
        )
      }
    }
  }

  const handleProfileViewRow = (profile: any) => {
    if (!dsProfiles.isEmpty()) {
      const currentProfile = dsProfiles.gotoRecordByData(profile.original)
      if (currentProfile) {
        setOpenedModal(SecurityType.PROFILE)
      }
    }
  }

  const buildProfileRowActions = ({ row }): ReactNode | undefined => {
    return (
      <Group gap={4} wrap='nowrap'>
        <ArchbaseTableRowActions<ProfileDto>
          onEditRow={handleProfileEditRow}
          onRemoveRow={handleProfileRemoveRow}
          onViewRow={handleProfileViewRow}
          row={row}
        ></ArchbaseTableRowActions>
        <Tooltip withinPortal withArrow position="left" label={t('archbase:Edit permissions')}>
          <ActionIcon
            variant='transparent'
            onClick={handleOpenProfilePermissionsModal}
          >
            <IconShieldCheckered color={theme.colorScheme === 'dark' ? theme.colors.green[8] : theme.colors.green[4]} />
          </ActionIcon>
        </Tooltip>
      </Group>
    )
  }

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
        () => { },
      );
    }
  };

  const handleOpenUserPermissionsModal = () => {
    setOpenedPermissionsModal(SecurityType.USER)
  }

  const handleOpenGroupPermissionsModal = () => {
    setOpenedPermissionsModal(SecurityType.GROUP)
  }

  const handleOpenProfilePermissionsModal = () => {
    setOpenedPermissionsModal(SecurityType.PROFILE)
  }

  const handleClosePermissionsModal = () => {
    setOpenedPermissionsModal("")
  }

  return (
    <Paper style={{ height: height }}>
      <Tabs value={activeTab} onChange={setActiveTab}>
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
          width: '100%'
        }}
      >
        <ArchbaseDataTable<UserDto, string>
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
          isError={false}
          enableGlobalFilter={true}
          renderToolbarInternalActions={undefined}
          renderRowActions={buildUserRowActions}
          error={<span></span>}
          enableRowSelection={false}
        >
          {userColumns}
          <ToolBarActions>
            <Flex justify={'space-between'} style={{ width: '50%' }}>
              <Group align="end" gap={'4px'}>
                <Button color={'green'} leftSection={<IconPlus />} onClick={handleAddUserExecute}>
                  {t('archbase:New')}
                </Button>
                <Button color={'blue'} leftSection={<IconEdit />} onClick={handleOpenUserPermissionsModal}>
                  {t('archbase:Edit permissions')}
                </Button>
                <PermissionsSelectorModal dataSource={dsUsers} opened={openedPermissionsModal === SecurityType.USER} close={handleClosePermissionsModal} />
              </Group>
              <Flex align={'flex-start'} justify={'flex-end'} style={{ width: '200px' }}></Flex>
            </Flex>
          </ToolBarActions>
        </ArchbaseDataTable>
      </Box>
      <Box
        style={{
          height: heightTab,
          display: activeTab === 'groups' ? 'flex' : 'none'
        }}
      >
        <ArchbaseDataTable<GroupDto, string>
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
          isError={false}
          error={<span>{error}</span>}
          enableGlobalFilter={true}
          renderToolbarInternalActions={undefined}
          renderRowActions={buildGroupRowActions}
          enableRowSelection={false}
        >
          {groupColumns}
          <ToolBarActions>
            <Flex justify={'space-between'} style={{ width: '50%' }}>
              <Group align="end" gap={'4px'}>
                <Button color={'green'} leftSection={<IconPlus />} onClick={handleAddGroupExecute}>
                  {t('archbase:New')}
                </Button>
                <Button color={'blue'} leftSection={<IconEdit />} onClick={handleOpenGroupPermissionsModal}>
                  {t('archbase:Edit permissions')}
                </Button>
                <PermissionsSelectorModal dataSource={dsGroups} opened={openedPermissionsModal === SecurityType.GROUP} close={handleClosePermissionsModal} />
              </Group>
              <Flex align={'flex-start'} justify={'flex-end'} style={{ width: '200px' }}></Flex>
            </Flex>
          </ToolBarActions>
        </ArchbaseDataTable>
      </Box>
      <Box
        style={{
          height: heightTab,
          display: activeTab === 'profiles' ? 'flex' : 'none',
        }}
      >
        <ArchbaseDataTable<ProfileDto, string>
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
          isError={false}
          error={<span>{error}</span>}
          enableGlobalFilter={true}
          renderToolbarInternalActions={undefined}
          renderRowActions={buildProfileRowActions}
          enableRowSelection={false}
        >
          {profileColumns}
          <ToolBarActions>
            <Flex justify={'space-between'} style={{ width: '50%' }}>
              <Group align="end" gap={'4px'}>
                <Button color={'green'} leftSection={<IconPlus />} onClick={handleAddProfileExecute}>
                  {t('archbase:New')}
                </Button>
                <Button color={'blue'} leftSection={<IconEdit />} onClick={handleOpenProfilePermissionsModal}>
                  {t('archbase:Edit permissions')}
                </Button>
                <PermissionsSelectorModal dataSource={dsProfiles} opened={openedPermissionsModal === SecurityType.PROFILE} close={handleClosePermissionsModal} />
              </Group>
              <Flex align={'flex-start'} justify={'flex-end'} style={{ width: '200px' }}></Flex>
            </Flex>
          </ToolBarActions>
        </ArchbaseDataTable>
      </Box>
      <Box
        style={{
          height: heightTab,
          display: activeTab === 'resources' ? 'flex' : 'none',
        }}
      >
        <ArchbaseDataTable<ResourceDto, string>
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
          isError={false}
          error={<span>{error}</span>}
          enableGlobalFilter={true}
          renderToolbarInternalActions={undefined}
        >
          {resourceColumns}
          <ToolBarActions>
            <Flex justify={'space-between'} style={{ width: '50%' }}>
              <Group align="end" gap={'4px'}>
              </Group>
              <Flex align={'flex-start'} justify={'flex-end'} style={{ width: '200px' }}></Flex>
            </Flex>
          </ToolBarActions>
        </ArchbaseDataTable>
      </Box>
      <Box
        style={{
          height: heightTab,
          display: activeTab === 'accessTokens' ? 'flex' : 'none',
          width: '100%'
        }}
      >
        <ArchbaseDataTable<AccessTokenDto, string>
          printTitle={'Tokens de API'}
          width={'100%'}
          height={'100%'}
          withBorder={false}
          dataSource={dsAccessTokens}
          withColumnBorders={true}
          striped={true}
          enableTopToolbar={true}
          enableRowActions={true}
          pageSize={50}
          isError={false}
          enableGlobalFilter={true}
          renderToolbarInternalActions={undefined}
          error={<span></span>}
        >
          {columns}
          <ToolBarActions>
            <Flex justify={'space-between'} style={{ width: '50%' }}>
              <Group align="start" gap={'4px'}>
                <Button disabled={!dsAccessTokens.getCurrentRecord()} color={'red'} leftSection={<IconTrashX />} onClick={handleAccessTokenRevokeRow}>
                  {t('archbase:Revoke')}
                </Button>
              </Group>
            </Flex>
          </ToolBarActions>
        </ArchbaseDataTable>
      </Box>
      {openedModal === SecurityType.USER ? (
        <UserModal
          onClickOk={handleCloseUserModal}
          opened={true}
          dataSource={dsUsers}
          onClickCancel={handleCloseUserModal} />
      ) : null}
      {openedModal === SecurityType.GROUP ? (
        <GroupModal
          onClickOk={handleCloseGroupModal}
          opened={true}
          dataSource={dsGroups}
          onClickCancel={handleCloseGroupModal} />
      ) : null}
      {openedModal === SecurityType.PROFILE ? (
        <ProfileModal
          onClickOk={handleCloseProfileModal}
          opened={true}
          dataSource={dsProfiles}
          onClickCancel={handleCloseProfileModal} />
      ) : null}
    </Paper>
  )
}
