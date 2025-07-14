import { ExpressionNode } from '../ast';
type Quote = '"' | "'";
interface EmitOptions {
    /**
     * The preferred quote character to use when `emit` encounters a comparison value that needs to be escaped by wrapping
     * in quotes. Either `"` (the ASCII double quote character) or `'` (the ASCII single quote character). Defaults to `"`
     * (the ASCII double quote character).
     */
    preferredQuote?: Quote;
    /**
     * If `true`, `emit` will override the `preferredQuote` setting on a comparison value-by-comparison value basis if
     * doing so would shorten the emitted RSQL. If `false`, `emit` will use the `preferredQuote` as the quote character
     * for all comparison values encountered. Defaults to `true`.
     */
    optimizeQuotes?: boolean;
}
declare function emit(expression: ExpressionNode, options?: EmitOptions): string;
export { emit };
export type { EmitOptions, Quote };
//# sourceMappingURL=index.d.ts.map