/**
 * UserModal — modal de cadastro/edição de usuários com roles e ações.
 * @status stable
 */
import { ARCHBASE_IOC_API_TYPE, getI18nextInstance, builder, emit } from '@archbase/core'
import { IArchbaseDataSourceBase, ArchbaseDataSource } from '@archbase/data'
import { ArchbaseCheckbox, ArchbaseEdit, ArchbaseSelect, ArchbasePasswordEdit, ArchbaseAvatarEdit } from '@archbase/components'
import { useArchbaseRemoteDataSource, useArchbaseRemoteServiceApi } from '@archbase/data'
import { ArchbaseNotifications } from '@archbase/components'
import { Grid, Group, Input, ScrollArea, Space, Stack, Text, Modal, Button } from '@mantine/core'
import { useFocusTrap } from '@mantine/hooks'
import { useArchbaseTranslation } from '@archbase/core';
import React, { useEffect, useState } from 'react'
import { ArchbaseDualListSelector } from './ArchbaseDualListSelector'
import { ArchbaseGroupService } from '@archbase/security'
import { ArchbaseProfileService } from '@archbase/security'
import { RenderProfileUserItem } from './RenderProfileUserItem'
import { GroupDto, ProfileDto, UserDto, UserGroupDto } from '@archbase/security'

export interface UserModalOptions {
  // Campos de identificação
  showNickname?: boolean; // nickname - Apelido

  // Campos de perfil e grupos
  showProfile?: boolean; // profile - Perfil do usuário
  showGroups?: boolean; // groups - Grupos (DualListSelector)

  // Campos de configuração de senha
  showChangePasswordOnNextLogin?: boolean; // changePasswordOnNextLogin
  showAllowPasswordChange?: boolean; // allowPasswordChange
  showPasswordNeverExpires?: boolean; // passwordNeverExpires

  // Campos de status da conta
  showAccountConfigLabel?: boolean;
  showAccountDeactivated?: boolean; // accountDeactivated
  showAccountLocked?: boolean; // accountLocked
  showIsAdministrator?: boolean;

  // Configurações de campos obrigatórios
  requiredNickname?: boolean;

  /** Tamanho máximo da imagem do avatar em kilobytes */
  avatarMaxSizeKB?: number;
  /** Qualidade da compressão da imagem do avatar (0 a 1), sendo 1 melhor qualidade */
  avatarImageQuality?: number;

  /** Configuração de permissão de edição de campos */
  allowEditEmail?: boolean;

  customContentBefore?: (user: UserDto) => React.ReactNode;

  customContentAfter?: (user: UserDto) => React.ReactNode;

  /** Nome do perfil padrão que um novo usuário já virá pré-preenchido */
  userDefaultProfile?: string;
  /** Nome dos grupos padrões que um novo usuário já virá pré-preenchido */
  userDefaultGroups?: string[];
}

export const defaultUserModalOptions: UserModalOptions = {
  // Campos de identificação
  showNickname: true,

  // Campos de perfil e grupos
  showProfile: true,
  showGroups: true,

  // Campos de configuração de senha
  showChangePasswordOnNextLogin: true,
  showAllowPasswordChange: true,
  showPasswordNeverExpires: true,

  // Campos de status da conta
  showAccountConfigLabel: true,
  showAccountDeactivated: true,
  showAccountLocked: true,
  showIsAdministrator: true,

  // Configurações de campos obrigatórios
  requiredNickname: true,

  avatarMaxSizeKB: 2000,
  avatarImageQuality: 1,

  allowEditEmail: true,
}

export interface UserModalProps {
  dataSource: IArchbaseDataSourceBase<UserDto>
  opened: boolean
  onClickOk: (record?: UserDto, result?: any) => void
  onClickCancel: (record?: UserDto) => void
  onCustomSave?: (record?: UserDto, callback?: Function) => void
  onAfterSave?: (record?: UserDto) => void
  options?: UserModalOptions
}

export const UserModal = (props: UserModalProps) => {
  const [passwordError, setPasswordError] = useState("")
  const options = { ...defaultUserModalOptions, ...(props.options ?? {}) }

  const groupApi = useArchbaseRemoteServiceApi<ArchbaseGroupService>(ARCHBASE_IOC_API_TYPE.Group)
  const { dataSource: dsGroups } = useArchbaseRemoteDataSource<GroupDto, string>({
    name: `dsGroups`,
    service: groupApi,
    pageSize: 9999,
    loadOnStart: true,
    sort: ['name:asc'],
    onError: (error, origin) => {
      ArchbaseNotifications.showError(getI18nextInstance().t('archbase:WARNING'), error, origin)
    }
  })
  console.log("versão 12/05/2026")

  const profileApi = useArchbaseRemoteServiceApi<ArchbaseProfileService>(ARCHBASE_IOC_API_TYPE.Profile)
  const { dataSource: dsProfiles } = useArchbaseRemoteDataSource<ProfileDto, string>({
    name: `dsProfiles`,
    service: profileApi,
    pageSize: 9999,
    loadOnStart: true,
    sort: ['name:asc'],
    onError: (error, origin) => {
      ArchbaseNotifications.showError(getI18nextInstance().t('archbase:WARNING'), error, origin)
    }
  })

  useEffect(() => {
    setPasswordError("")
  }, [props.dataSource.getFieldValue("password")])

  const setDefaultValues = async () => {
    if (!props.dataSource.isInserting()) return;

    if (options.userDefaultProfile) {
      const filter = emit(builder.eq("name", options.userDefaultProfile))
      const result = await profileApi.findAllWithFilter(filter, 0, 1)
      if (result && result.content.length > 0) {
        props.dataSource.setFieldValue("profile", result.content[0])
      }
    }
    if (options.userDefaultGroups) {
      const filter = emit(builder.in("name", options.userDefaultGroups))
      const result = await groupApi.findAllWithFilter(filter, 0, 500)
      if (result && result.content.length > 0) {
        props.dataSource.setFieldValue("groups", result.content.map(group => UserGroupDto.newInstance(group)))
      }
    }
  }

  useEffect(() => {
    if (props.opened) {
      setDefaultValues()
    }
  }, [props.opened])

  const handleSave = () => {
    const currentRecord = props.dataSource.getCurrentRecord()!;
    if (!currentRecord.password && props.dataSource.isInserting()) {
      setPasswordError(getI18nextInstance().t('archbase:Informe a senha'))
      return;
    }
    
    if (props.onCustomSave) {
      props.onCustomSave(currentRecord, (success: boolean) => {
        if (success && props.onAfterSave) {
          props.onAfterSave(currentRecord);
        }
        props.onClickOk(currentRecord, success);
      });
    } else {
      props.onClickOk(currentRecord, true);
    }
  };

  const handleCancel = () => {
    props.onClickCancel(props.dataSource.getCurrentRecord()!);
  };

  return (
    <Modal
      opened={props.opened}
      onClose={handleCancel}
      title={getI18nextInstance().t('archbase:Usuário')}
      size="80%"
      styles={{ content: { maxWidth: 1000 } }}
    >
      <ScrollArea style={{ height: '500px' }}>
        <Stack w={"98%"}>
          {options?.customContentBefore && (
            <>
              {options.customContentBefore(props.dataSource.getCurrentRecord()!)}
            </>
          )}
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Group>
                <ArchbaseEdit
                  label={`${getI18nextInstance().t('archbase:Nome completo')}`}
                  placeholder={`${getI18nextInstance().t('archbase:Informe o nome completo do usuário')}`}
                  dataSource={props.dataSource}
                  dataField="name"
                  required
                  width={'calc(100% - 208px)'}
                />
                {options.showNickname && (
                  <ArchbaseEdit
                    label={`${getI18nextInstance().t('archbase:Apelido')}`}
                    placeholder={`${getI18nextInstance().t('archbase:Apelido')}`}
                    dataSource={props.dataSource}
                    dataField="nickname"
                    required={options.requiredNickname}
                  />
                )}
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <ArchbaseEdit
                label={`${getI18nextInstance().t('archbase:Descrição do usuário')}`}
                placeholder={`${getI18nextInstance().t('archbase:Informe a descrição do usuário')}`}
                dataSource={props.dataSource}
                dataField="description"
                required
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <ArchbaseEdit
                label={`${getI18nextInstance().t('archbase:E-mail')}`}
                placeholder={`${getI18nextInstance().t('archbase:Informe o e-mail do usuário')}`}
                dataSource={props.dataSource}
                onChangeValue={(value) => props.dataSource.setFieldValue("userName", value)}
                dataField="email"
                readOnly={props.dataSource.isEditing() ? !options.allowEditEmail : false}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <ArchbasePasswordEdit
                label={`${getI18nextInstance().t('archbase:Senha usuário')}`}
                dataSource={props.dataSource}
                dataField="password"
                error={passwordError}
                required={props.dataSource.getFieldValue("isNewUser")}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            {options.showProfile && (
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <ArchbaseSelect<UserDto, string, ProfileDto>
                  label={`${getI18nextInstance().t('archbase:Perfil do usuário')}`}
                  dataSource={props.dataSource}
                  dataField="profile"
                  options={dsProfiles}
                  allowDeselect={true}
                  optionsLabelField="nome"
                  itemComponent={RenderProfileUserItem}
                  getOptionLabel={(option: ProfileDto) => option.name}
                  getOptionValue={(option: ProfileDto) => option.id}
                />
              </Grid.Col>
            )}
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12 }}>
              {options.showAccountConfigLabel && (<Text fz={14} fw={500}>Informe</Text>)}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Stack gap={'lg'}>
                {options.showChangePasswordOnNextLogin && (
                  <Input.Wrapper label="">
                    <ArchbaseCheckbox
                      dataSource={props.dataSource}
                      dataField="changePasswordOnNextLogin"
                      label={`${getI18nextInstance().t('archbase:Deve alterar senha próximo login ?')}`}
                    />
                  </Input.Wrapper>
                )}
                {options.showAllowPasswordChange && (
                  <Input.Wrapper label="">
                    <ArchbaseCheckbox
                      dataSource={props.dataSource}
                      dataField="allowPasswordChange"
                      label={`${getI18nextInstance().t('archbase:Pode alterar a senha ?')}`}
                    />
                  </Input.Wrapper>
                )}
                {options.showPasswordNeverExpires && (
                  <Input.Wrapper label="">
                    <ArchbaseCheckbox
                      dataSource={props.dataSource}
                      dataField="passwordNeverExpires"
                      label={`${getI18nextInstance().t('archbase:Senha nunca expira ?')}`}
                    />
                  </Input.Wrapper>
                )}
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Stack gap="lg">
                {options.showAccountDeactivated && (
                  <Input.Wrapper label="">
                    <ArchbaseCheckbox
                      dataSource={props.dataSource}
                      dataField="accountDeactivated"
                      label={`${getI18nextInstance().t('archbase:Conta desativada ?')}`}
                    />
                  </Input.Wrapper>
                )}
                {options.showAccountLocked && (
                  <Input.Wrapper label="">
                    <ArchbaseCheckbox
                      dataSource={props.dataSource}
                      dataField="accountLocked"
                      label={`${getI18nextInstance().t('archbase:Conta bloqueada ?')}`}
                    />
                  </Input.Wrapper>
                )}
                {options.showIsAdministrator && (
                  <Input.Wrapper label="">
                    <ArchbaseCheckbox
                      dataSource={props.dataSource}
                      dataField="isAdministrator"
                      label={`${getI18nextInstance().t('archbase:Administrador ?')}`}
                    />
                  </Input.Wrapper>
                )}
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <Stack gap="lg">
                <ArchbaseAvatarEdit
                  label={getI18nextInstance().t('archbase:Foto do usuário')}
                  dataSource={props.dataSource}
                  dataField="avatar"
                  width={120}
                  height={120}
                  maxSizeKB={options.avatarMaxSizeKB}
                  imageQuality={options.avatarImageQuality}
                />
              </Stack>
            </Grid.Col>
          </Grid>

          {options.showGroups && (
            <Grid>
              <Grid.Col span={{ base: 12 }}>
                <Text fz={14} fw={500}>Grupos</Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12 }}>
                <ArchbaseDualListSelector<GroupDto, UserGroupDto>
                  titleAvailable={getI18nextInstance().t('archbase:Disponíveis')}
                  titleAssigned={getI18nextInstance().t('archbase:Selecionados')}
                  assignedItemsDS={
                    new ArchbaseDataSource('dsDualList', {
                      records: props.dataSource.getFieldValue('groups'),
                      grandTotalRecords: props.dataSource.getFieldValue('groups').length,
                      currentPage: 0,
                      totalPages: 0,
                      pageSize: 999999
                    })
                  }
                  width="100%"
                  height="200px"
                  availableItemsDS={dsGroups}
                  handleCreateAssociationObject={(group: GroupDto) => {
                    return UserGroupDto.newInstance(group)
                  }}
                  idFieldAssigned={(item: UserGroupDto) => (item && item.group ? item.group.id : '')}
                  idFieldAvailable={'id'}
                  labelFieldAssigned={(item: UserGroupDto) => (item && item.group ? item.group.name : '')}
                  labelFieldAvailable={'name'}
                />
              </Grid.Col>
            </Grid>
          )}
          {options?.customContentAfter && (
            <>
              {options.customContentAfter(props.dataSource.getCurrentRecord()!)}
            </>
          )}
          <Space h={'12px'} />
        </Stack>
      </ScrollArea>
      
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={handleCancel}>
          {getI18nextInstance().t('archbase:Cancelar')}
        </Button>
        <Button onClick={handleSave}>
          {getI18nextInstance().t('archbase:Salvar')}
        </Button>
      </Group>
    </Modal>
  )
}
