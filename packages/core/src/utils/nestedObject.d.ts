declare const SetNestedObjectValueOperations: ("ASSIGN_VALUE" | "PUSH_ITEM_TO_ARRAY" | "REMOVE_ITEM_FROM_ARRAY" | "REMOVE")[];
type SetNestedObjectValueOperation = (typeof SetNestedObjectValueOperations)[number];
declare const setNestedObjectValue: (object: any, path: string, value: any, operation?: SetNestedObjectValueOperation) => void;
declare const getNestedObjectValue: (object: any, path: string) => any;
declare const getPathDepthLevel: (path: string) => number;
export { setNestedObjectValue, getNestedObjectValue, getPathDepthLevel };
export type { SetNestedObjectValueOperation };
//# sourceMappingURL=nestedObject.d.ts.map