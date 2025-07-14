export interface StyleProps {
    container: string;
    basicChildStyle: string;
    expander: string;
    label: string;
    nullValue: string;
    undefinedValue: string;
    numberValue: string;
    stringValue: string;
    booleanValue: string;
    otherValue: string;
    punctuation: string;
    pointer: string;
}
export interface JsonRenderProps<T> {
    field?: string;
    value: T;
    lastElement: boolean;
    level: number;
    style: StyleProps;
    shouldInitiallyExpand: (level: number, value: any, field?: string) => boolean;
}
export interface ExpandableRenderProps {
    field?: string;
    value: Array<any> | object;
    data: Array<[string | undefined, any]>;
    openBracket: string;
    closeBracket: string;
    lastElement: boolean;
    level: number;
    style: StyleProps;
    shouldInitiallyExpand: (level: number, value: any, field?: string) => boolean;
}
export default function ArchbaseJsonViewDataRender(props: JsonRenderProps<any>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseJsonViewDataRenderer.d.ts.map