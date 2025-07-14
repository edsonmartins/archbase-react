declare const OperationType: {
    readonly SHIFT: 0;
    readonly PUSH: 1;
    readonly REDUCE: 2;
    readonly POP: 3;
    readonly GOTO: 4;
    readonly ACCEPT: 5;
};
interface ShiftOperation {
    type: typeof OperationType.SHIFT;
    state: number;
}
interface PushOperation {
    type: typeof OperationType.PUSH;
    state: number;
}
interface ReduceOperation {
    type: typeof OperationType.REDUCE;
    production: number;
}
interface PopOperation {
    type: typeof OperationType.POP;
    production: number;
}
interface GoToOperation {
    type: typeof OperationType.GOTO;
    state: number;
}
interface AcceptOperation {
    type: typeof OperationType.ACCEPT;
}
type NoOperation = undefined;
type TokenOperation = ShiftOperation | ReduceOperation | PushOperation | PopOperation | AcceptOperation | NoOperation;
type NodeOperation = GoToOperation | NoOperation;
declare function shift(state: number): ShiftOperation;
declare function reduce(production: number): ReduceOperation;
declare function push(state: number): PushOperation;
declare function pop(production: number): PopOperation;
declare function goto(state: number): GoToOperation;
declare function accept(): AcceptOperation;
declare const noop: NoOperation;
export { OperationType, shift, reduce, push, pop, accept, goto, noop };
export type { ShiftOperation, ReduceOperation, PushOperation, PopOperation, AcceptOperation, GoToOperation, NoOperation, TokenOperation, NodeOperation, };
//# sourceMappingURL=ParserOperation.d.ts.map