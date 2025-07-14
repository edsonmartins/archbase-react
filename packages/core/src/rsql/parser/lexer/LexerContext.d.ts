interface LexerContext {
    position: number;
    readonly buffer: string;
    readonly length: number;
}
declare function createLexerContext(input: string): LexerContext;
export default LexerContext;
export { createLexerContext };
//# sourceMappingURL=LexerContext.d.ts.map