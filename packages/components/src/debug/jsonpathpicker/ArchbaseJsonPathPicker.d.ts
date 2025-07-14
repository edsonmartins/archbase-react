import { Component } from 'react';
import './ArchbaseJsonPathPicker.css';
export interface ArchbaseJsonPathPickerOptions {
    outputCollapsed: boolean;
    outputWithQuotes: boolean;
    pathNotation: string;
    pathQuotesType: string;
    processKeys: boolean;
    keyReplaceRegexPattern: string | undefined;
    keyReplaceRegexFlags: string | undefined;
    keyReplacementText: string;
    pickerIcon: string;
    withoutPicker: boolean;
}
export interface ArchbaseJsonPathPickerProps {
    data: any;
    onSelect: (path: string) => void;
    options?: ArchbaseJsonPathPickerOptions;
}
export declare class ArchbaseJsonPathPicker extends Component<ArchbaseJsonPathPickerProps> {
    static defaultProps: {
        options: ArchbaseJsonPathPickerOptions;
    };
    private pickerRef;
    private destRef;
    private jsonPathPickerInstance;
    constructor(props: ArchbaseJsonPathPickerProps);
    json2jsx: (json: any, options: any) => import("react/jsx-runtime").JSX.Element | "{}" | "[]";
    handlerEventToggle: (elm: any, event: any) => void;
    toggleEventListener: (event: any) => void;
    simulateClickHandler: (elm: any, event: any) => void;
    simulateClickEventListener: (event: any) => void;
    pickPathHandler: (elm: any) => void;
    pickEventListener: (event: any) => void;
    componentDidMount(): void;
    render(): import("react/jsx-runtime").JSX.Element;
}
//# sourceMappingURL=ArchbaseJsonPathPicker.d.ts.map