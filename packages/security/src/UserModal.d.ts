import { ArchbaseDataSource } from '@archbase/data';
import React from 'react';
import { UserDto } from './SecurityDomain';
export interface UserModalOptions {
    showNickname?: boolean;
    showProfile?: boolean;
    showGroups?: boolean;
    showChangePasswordOnNextLogin?: boolean;
    showAllowPasswordChange?: boolean;
    showPasswordNeverExpires?: boolean;
    showAccountConfigLabel?: boolean;
    showAccountDeactivated?: boolean;
    showAccountLocked?: boolean;
    showIsAdministrator?: boolean;
    requiredNickname?: boolean;
    /** Tamanho máximo da imagem do avatar em kilobytes */
    avatarMaxSizeKB?: number;
    /** Qualidade da compressão da imagem do avatar (0 a 1), sendo 1 melhor qualidade */
    avatarImageQuality?: number;
    /** Configuração de permissão de edição de campos */
    allowEditEmail?: boolean;
    customContentBefore?: React.ReactNode;
    customContentAfter?: React.ReactNode;
}
export declare const defaultUserModalOptions: UserModalOptions;
export interface UserModalProps {
    dataSource: ArchbaseDataSource<UserDto, string>;
    opened: boolean;
    onClickOk: (record?: UserDto, result?: any) => void;
    onClickCancel: (record?: UserDto) => void;
    onCustomSave?: (record?: UserDto, callback?: Function) => void;
    onAfterSave?: (record?: UserDto) => void;
    options?: UserModalOptions;
}
export declare const UserModal: (props: UserModalProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=UserModal.d.ts.map