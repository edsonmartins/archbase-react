import React from 'react';
import { GroupDto } from './SecurityDomain';
import { ArchbaseDataSource } from '@archbase/data';
export interface GroupModalOptions {
    customContentBefore?: React.ReactNode;
    customContentAfter?: React.ReactNode;
}
export interface GroupModalProps {
    dataSource: ArchbaseDataSource<GroupDto, string>;
    opened: boolean;
    onClickOk: (record?: GroupDto, result?: any) => void;
    onClickCancel: (record?: GroupDto) => void;
    onCustomSave?: (record?: GroupDto, callback?: Function) => void;
    onAfterSave?: (record?: GroupDto) => void;
    customContentBefore?: React.ReactNode;
    customContentAfter?: React.ReactNode;
    options?: GroupModalOptions;
}
export declare const GroupModal: (props: GroupModalProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GroupModal.d.ts.map