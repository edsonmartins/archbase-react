import { ScrollArea, Stack } from "@mantine/core";
import { useFocusTrap, useForceUpdate } from "@mantine/hooks";
import { ARCHBASE_IOC_API_TYPE, getI18nextInstance } from "@archbase/core";
import { useArchbaseRemoteDataSource, useArchbaseRemoteServiceApi, useArchbaseStore } from "@archbase/data";
import { useArchbaseValidator } from "@archbase/core";
import { ArchbaseNotifications } from "@archbase/components";
import { ArchbaseUserService, UserDto } from "@archbase/security";
import { ArchbaseFormModalTemplate } from "@archbase/template";
import { useArchbaseTranslation } from '@archbase/core';
import React, { useEffect } from "react";
import { ArchbaseEdit, ArchbaseAvatarEdit } from "@archbase/components";

export interface MyProfileModalOptions {
    // Campos de identificação
    showNickname?: boolean; // nickname - Apelido

    // Configurações de campos obrigatórios
    requiredNickname?: boolean;
    /** Tamanho máximo da imagem do avatar em kilobytes */
    avatarMaxSizeKB?: number;
    /** Qualidade da compressão da imagem do avatar (0 a 1), sendo 1 melhor qualidade */
    avatarImageQuality?: number;
}

export const defaultMyProfileModalOptions: MyProfileModalOptions = {
    // Campos de identificação
    showNickname: true,

    // Configurações de campos obrigatórios
    requiredNickname: true,
    avatarMaxSizeKB: 2000,
    avatarImageQuality: 1
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
        label: `${getI18nextInstance().t('archbase:My Profile')}`,
        service: serviceApi,
        store: templateStore,
        pageSize: 50,
        loadOnStart: true,
        validator,
        id: userId,
        onLoadComplete: (dataSource) => {
            if (dataSource.isBrowsing()) {
                dataSource.edit()
            }
            forceUpdate()
        },
        onDestroy: (_dataSource) => {
            //
        },
        onError: (error, origin) => {
            ArchbaseNotifications.showError(getI18nextInstance().t('archbase:WARNING'), error, origin)
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
            title={getI18nextInstance().t('archbase:My Profile')}
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
                            maxSizeKB={options.avatarMaxSizeKB}
                            imageQuality={options.avatarImageQuality}
                        />
                    </Stack>
                    <ArchbaseEdit
                        label={`${getI18nextInstance().t('archbase:Nome completo')}`}
                        placeholder={`${getI18nextInstance().t('archbase:Informe o nome completo do usuário')}`}
                        dataSource={dataSource}
                        dataField="name"
                        required
                    />
                    {options.showNickname && (
                        <ArchbaseEdit
                            label={`${getI18nextInstance().t('archbase:Apelido')}`}
                            placeholder={`${getI18nextInstance().t('archbase:Apelido')}`}
                            dataSource={dataSource}
                            dataField="nickname"
                            required={options.requiredNickname}
                        />
                    )}
                    <ArchbaseEdit
                        label={`${getI18nextInstance().t('archbase:Descrição do usuário')}`}
                        placeholder={`${getI18nextInstance().t('archbase:Informe a descrição do usuário')}`}
                        dataSource={dataSource}
                        dataField="description"
                        required
                    />
                </Stack>
            </ScrollArea>
        </ArchbaseFormModalTemplate>
    )
}
