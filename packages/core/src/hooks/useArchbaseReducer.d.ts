export interface ArchbaseStore {
    setValue: (key: string, value: any) => void;
    getValue: (key: string) => any;
    existsValue: (key: string) => boolean;
    clearValue: (key: string) => void;
    clearAllValues: () => void;
    reset: () => void;
    values: Map<string, any>;
}
export interface ArchbaseState {
}
export type ArchbaseReducerAction<ArchbaseState> = {
    type: string;
    payload: Partial<ArchbaseState>;
    info?: string;
};
export type ArchbaseReducer<S extends ArchbaseState, A extends ArchbaseReducerAction<S>> = (state: S, action: A) => S;
export declare function useArchbaseReducer<S extends ArchbaseState, A extends ArchbaseReducerAction<S>>(key: string, store: ArchbaseStore, initialState: S, customReducer: ArchbaseReducer<S, A>): {
    dispatch: (action: A) => void;
    state: S;
};
//# sourceMappingURL=useArchbaseReducer.d.ts.map