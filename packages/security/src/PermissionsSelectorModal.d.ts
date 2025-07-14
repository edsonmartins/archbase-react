import { ArchbaseRemoteDataSource } from "@archbase/data";
export interface PermissionsSelectorProps {
    dataSource: ArchbaseRemoteDataSource<any, any> | null;
    opened: boolean;
    close: () => void;
}
export declare function PermissionsSelectorModal({ dataSource, opened, close }: PermissionsSelectorProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PermissionsSelectorModal.d.ts.map