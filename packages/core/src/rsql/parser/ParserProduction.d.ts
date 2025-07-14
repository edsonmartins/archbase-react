import { Node } from '../ast';
import { AnyToken } from './lexer/Token';
type ParserProduction = (stack: (AnyToken | Node)[]) => {
    consumed: number;
    produced: Node;
};
declare const comparisonExpressionProduction: ParserProduction;
declare const logicalExpressionProduction: ParserProduction;
declare const groupExpressionProduction: ParserProduction;
declare const selectorProduction: ParserProduction;
declare const singleValueProduction: ParserProduction;
declare const multiValueProduction: ParserProduction;
export { selectorProduction, singleValueProduction, multiValueProduction, comparisonExpressionProduction, logicalExpressionProduction, groupExpressionProduction, };
export type { ParserProduction };
//# sourceMappingURL=ParserProduction.d.ts.map