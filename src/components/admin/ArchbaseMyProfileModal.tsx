import { ScrollArea, Stack } from "@mantine/core";
import { useFocusTrap, useForceUpdate } from "@mantine/hooks";
import { ARCHBASE_IOC_API_TYPE } from "../../components/core";
import { useArchbaseRemoteDataSource, useArchbaseRemoteServiceApi, useArchbaseStore, useArchbaseValidator } from "../../components/hooks";
import { ArchbaseNotifications } from "../../components/notification";
import { ArchbaseUserService, UserDto } from "../../components/security";
import { ArchbaseFormModalTemplate } from "../../components/template";
import { t } from "i18next";
import React, { useEffect } from "react";
import { ArchbaseEdit, ArchbaseAvatarEdit } from "../../components/editors";

export interface MyProfileModalOptions {
    // Campos de identificação
    showNickname?: boolean; // nickname - Apelido

    // Configurações de campos obrigatórios
    requiredNickname?: boolean;
}

export const defaultMyProfileModalOptions: MyProfileModalOptions = {
    // Campos de identificação
    showNickname: true,

    // Configurações de campos obrigatórios
    requiredNickname: true,
}

export interface ArchbaseMyProfileModalProps {
    opened: boolean
    handleClose: () => void
    userId: string
    updateUser: (newName: string, newAvatar?: string) => void
    options?: MyProfileModalOptions
}

export function ArchbaseMyProfileModal({ opened, handleClose, userId, updateUser, options: internalOptions }: ArchbaseMyProfileModalProps) {
    const focusTrapRef = useFocusTrap()
    const forceUpdate = useForceUpdate()
    const validator = useArchbaseValidator()
    const templateStore = useArchbaseStore(`myProfile${userId}Store`)
    const serviceApi = useArchbaseRemoteServiceApi<ArchbaseUserService>(ARCHBASE_IOC_API_TYPE.User)
    const options = { ...defaultMyProfileModalOptions, ...(internalOptions ?? {}) }

    const { dataSource, isLoading, error, isError, clearError } = useArchbaseRemoteDataSource<
        UserDto,
        string
    >({
        name: `dsUser${userId}`,
        label: `${t('archbase:My Profile')}`,
        service: serviceApi,
        store: templateStore,
        pageSize: 50,
        loadOnStart: true,
        validator,
        id: userId,
        onLoadComplete: (dataSource) => {
            dataSource.edit()
            forceUpdate()
        },
        onDestroy: (_dataSource) => {
            //
        },
        onError: (error, origin) => {
            ArchbaseNotifications.showError(t('mentors:WARNING'), error, origin)
        }
    })

    useEffect(() => {
        if (opened && dataSource && dataSource.isBrowsing()) {
            dataSource.edit()
        }
    }, [dataSource, opened])

    const handleUpdateUser = (record?: UserDto | undefined) => {
        if (!record) {
            return
        }
        console.log(record)
        updateUser(record.name, record.avatar)
    }

    return (
        <ArchbaseFormModalTemplate
            title={t('mentors:Meu Perfil')}
            size={800}
            height={'500px'}
            opened={opened}
            dataSource={dataSource}
            onClickOk={handleClose}
            onClickCancel={handleClose}
            onAfterSave={handleUpdateUser}
        >
            <ScrollArea style={{ height: '440px' }} ref={focusTrapRef}>
                <Stack>
                    <Stack align="center">
                        <ArchbaseAvatarEdit
                            dataSource={dataSource}
                            dataField="avatar"
                            width={200}
                            height={200}
                            required
                        />
                    </Stack>
                    <ArchbaseEdit
                        label={`${t('archbase:Nome completo')}`}
                        placeholder={`${t('archbase:Informe o nome completo do usuário')}`}
                        dataSource={dataSource}
                        dataField="name"
                        required
                    />
                    {options.showNickname && (
                        <ArchbaseEdit
                            label={`${t('archbase:Apelido')}`}
                            placeholder={`${t('archbase:Apelido')}`}
                            dataSource={dataSource}
                            dataField="nickname"
                            required={options.requiredNickname}
                        />
                    )}
                    <ArchbaseEdit
                        label={`${t('archbase:Descrição do usuário')}`}
                        placeholder={`${t('archbase:Informe a descrição do usuário')}`}
                        dataSource={dataSource}
                        dataField="description"
                        required
                    />
                </Stack>
            </ScrollArea>
        </ArchbaseFormModalTemplate>
    )
}