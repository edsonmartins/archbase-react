import { StyleProps } from './ArchbaseJsonViewDataRenderer';
export interface ArchbaseJsonViewProps {
    data: NonNullable<unknown> | Array<any>;
    style?: StyleProps;
    shouldInitiallyExpand?: (level: number, value: any, field?: string) => boolean;
}
export declare const defaultStyles: StyleProps;
export declare const darkStyles: StyleProps;
export declare const allExpanded: () => boolean;
export declare const collapseAllNested: (level: number) => boolean;
export declare const ArchbaseJsonView: ({ data, style, shouldInitiallyExpand, }: ArchbaseJsonViewProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map