import { ArchbaseDataSource } from '@archbase/data';
import { ApiTokenDto } from './SecurityDomain';
export declare const UserSelectItem: ({ image, label, description, ...others }: {
    [x: string]: any;
    image: any;
    label: any;
    description: any;
}) => import("react/jsx-runtime").JSX.Element;
export interface ApiTokenModalProps {
    dataSource: ArchbaseDataSource<ApiTokenDto, string>;
    opened: boolean;
    onClickOk: (record?: ApiTokenDto, result?: any) => void;
    onClickCancel: (record?: ApiTokenDto) => void;
    onCustomSave?: (record?: ApiTokenDto, callback?: Function) => void;
    onAfterSave?: (record?: ApiTokenDto) => void;
}
export declare const ApiTokenModal: (props: ApiTokenModalProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ApiTokenModal.d.ts.map