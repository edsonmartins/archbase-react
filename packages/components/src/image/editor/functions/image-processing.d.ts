import { IState } from '../models/index.models';
export declare const MAX_BUFFER_UNDO_MEMORY = 25;
export declare const convertImageUsingCanvas: (dataSrc: string, changeHeight: boolean, state: IState, options?: {
    getDimFromImage?: boolean;
    rotate?: number;
}) => Promise<{
    imageUri: string;
    state: any;
}>;
export declare const dragElement: (element: any) => void;
export declare const saveState: (state: IState, lastImage?: string) => IState;
//# sourceMappingURL=image-processing.d.ts.map