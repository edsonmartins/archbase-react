import React from 'react';
import { ArchbaseDataSource } from '@archbase/data';
import { ProfileDto } from './SecurityDomain';
export interface ProfileModalOptions {
    customContentBefore?: React.ReactNode;
    customContentAfter?: React.ReactNode;
}
export interface ProfileModalProps {
    dataSource: ArchbaseDataSource<ProfileDto, string>;
    opened: boolean;
    onClickOk: (record?: ProfileDto, result?: any) => void;
    onClickCancel: (record?: ProfileDto) => void;
    onCustomSave?: (record?: ProfileDto, callback?: Function) => void;
    onAfterSave?: (record?: ProfileDto) => void;
    customContentBefore?: React.ReactNode;
    customContentAfter?: React.ReactNode;
    options?: ProfileModalOptions;
}
export declare const ProfileModal: (props: ProfileModalProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ProfileModal.d.ts.map