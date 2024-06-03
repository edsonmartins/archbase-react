import React from 'react'
import { Grid, Input, ScrollArea, Space, Stack } from '@mantine/core'
import { t } from 'i18next'
import { useFocusTrap } from '@mantine/hooks'
import { GroupDto, ProfileDto, UserDto, UserGroupDto } from './SecurityDomain'
import { RenderProfileUserItem } from './RenderProfileUserItem'
import { ArchbaseDataSource } from '@components/datasource'
import { useArchbaseRemoteDataSource, useArchbaseRemoteServiceApi } from '@components/hooks'
import { ARCHBASE_IOC_API_TYPE } from '@components/core'
import { ArchbaseNotifications } from '@components/notification'
import { ArchbaseFormModalTemplate } from '@components/template'
import { ArchbaseCheckbox, ArchbaseEdit, ArchbaseImageEdit, ArchbasePasswordEdit, ArchbaseSelect } from '@components/editors'
import { ArchbaseDualListSelector } from './ArchbaseDualListSelector'
import { ArchbaseGroupService } from './ArchbaseGroupService'
import { ArchbaseProfileService } from './ArchbaseProfileService'

export interface UserModalProps {
  dataSource: ArchbaseDataSource<UserDto, string>
  opened: boolean
  onClickOk: (record?: UserDto, result?: any) => void
  onClickCancel: (record?: UserDto) => void
  onCustomSave?: (record?: UserDto, callback?: Function) => void
  onAfterSave?: (record?: UserDto) => void
}

export const UserModal = (props: UserModalProps) => {
  const focusTrapRef = useFocusTrap()

  const groupApi = useArchbaseRemoteServiceApi<ArchbaseGroupService>(ARCHBASE_IOC_API_TYPE.Group)
  const { dataSource: dsGroups } = useArchbaseRemoteDataSource<GroupDto, string>({
    name: `dsGroups`,
    service: groupApi,
    pageSize: 9999,
    loadOnStart: true,
    sort: ['name:asc'],
    onError: (error, origin) => {
      ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin)
    }
  })

  const profileApi = useArchbaseRemoteServiceApi<ArchbaseProfileService>(ARCHBASE_IOC_API_TYPE.Profile)
  const { dataSource: dsProfiles } = useArchbaseRemoteDataSource<ProfileDto, string>({
    name: `dsProfiles`,
    service: profileApi,
    pageSize: 9999,
    loadOnStart: true,
    sort: ['name:asc'],
    onError: (error, origin) => {
      ArchbaseNotifications.showError(t('archbase:WARNING'), error, origin)
    }
  })

  return (
    <ArchbaseFormModalTemplate
      title={t('archbase:Usuário')}
      size="60%"
      height={'660px'}
      dataSource={props.dataSource}
      opened={props.opened}
      onClickOk={props.onClickOk}
      onClickCancel={props.onClickCancel}
      onCustomSave={props.onCustomSave}
      onAfterSave={props.onAfterSave}
    >
      <ScrollArea ref={focusTrapRef} style={{ height: '600px' }}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <ArchbaseEdit
              label={`${t('archbase:Nome completo')}`}
              placeholder={`${t('archbase:Informe o nome completo do usuário')}`}
              dataSource={props.dataSource}
              dataField="name"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <ArchbaseEdit
              label={`${t('archbase:Descrição do usuário')}`}
              placeholder={`${t('archbase:Informe a descrição do usuário')}`}
              dataSource={props.dataSource}
              dataField="description"
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <ArchbaseEdit
              label={`${t('archbase:Apelido (username)')}`}
              placeholder={`${t('archbase:Informe o apelido(username) do usuário')}`}
              dataSource={props.dataSource}
              dataField="userName"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <ArchbasePasswordEdit
              label={`${t('archbase:Senha usuário')}`}
              dataSource={props.dataSource}
              dataField="password"
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <ArchbaseEdit
              label={`${t('archbase:E-mail')}`}
              placeholder={`${t('archbase:Informe o e-mail do usuário')}`}
              dataSource={props.dataSource}
              dataField="email"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <ArchbaseSelect<UserDto, string, ProfileDto>
              label={`${t('archbase:Perfil do usuário')}`}
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
        </Grid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Stack gap={'lg'}>
              <Input.Wrapper label="Informe">
                <ArchbaseCheckbox
                  dataSource={props.dataSource}
                  dataField="changePasswordOnNextLogin"
                  label={`${t('archbase:Deve alterar senha próximo login ?')}`}
                />
              </Input.Wrapper>
              <Input.Wrapper label="">
                <ArchbaseCheckbox
                  dataSource={props.dataSource}
                  dataField="allowPasswordChange"
                  label={`${t('archbase:Pode alterar a senha ?')}`}
                />
              </Input.Wrapper>
              <Input.Wrapper label="">
                <ArchbaseCheckbox
                  dataSource={props.dataSource}
                  dataField="allowMultipleLogins"
                  label={`${t('archbase:Permite multiplos logins ?')}`}
                />
              </Input.Wrapper>
              <Input.Wrapper label="">
                <ArchbaseCheckbox
                  dataSource={props.dataSource}
                  dataField="passwordNeverExpires"
                  label={`${t('archbase:Senha nunca expira ?')}`}
                />
              </Input.Wrapper>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Stack gap="lg">
              <Input.Wrapper label="Informe">
                <ArchbaseCheckbox
                  dataSource={props.dataSource}
                  dataField="accountDeactivated"
                  label={`${t('archbase:Conta desativada ?')}`}
                />
              </Input.Wrapper>
              <Input.Wrapper label="">
                <ArchbaseCheckbox
                  dataSource={props.dataSource}
                  dataField="accountLocked"
                  label={`${t('archbase:Conta bloqueada ?')}`}
                />
              </Input.Wrapper>
              <Input.Wrapper label="">
                <ArchbaseCheckbox
                  dataSource={props.dataSource}
                  dataField="isAdministrator"
                  label={`${t('archbase:Administrador ?')}`}
                />
              </Input.Wrapper>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
            <Stack gap="lg">
              <ArchbaseImageEdit
                width={'120px'}
                height={'120px'}
                dataSource={props.dataSource}
                dataField={'avatar'}
                label={`${t('archbase:Foto do usuário')}`}
              />
            </Stack>
          </Grid.Col>
        </Grid>
        <Space h={'12px'} />
        <ArchbaseDualListSelector<GroupDto, UserGroupDto>
          assignedItemsDS={
            new ArchbaseDataSource('dsDualList', {
              records: props.dataSource.getFieldValue('groups'),
              grandTotalRecords: props.dataSource.getFieldValue('groups').length,
              currentPage: 0,
              totalPages: 0,
              pageSize: 999999
            })
          }
          width="600px"
          height="200px"
          availableItemsDS={dsGroups}
          handleCreateAssociationObject={(group: GroupDto) => {
            return UserGroupDto.newInstance(group)
          }}
          idFieldAssigned={(item: UserGroupDto) => (item && item.group ? item.group.id : '')}
          idFieldAvailable={'id'}
          labelFieldAssigned={(item: UserGroupDto) => (item && item.group ? item.group.name : '')}
          labelFieldAvailable={'name'}
        ></ArchbaseDualListSelector>
      </ScrollArea>
    </ArchbaseFormModalTemplate>
  )
}
