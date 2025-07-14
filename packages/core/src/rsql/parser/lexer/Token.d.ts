import { ComparisonOperator, LogicOperator } from '../../ast';
declare const TokenType: {
    readonly UNQUOTED: "UNQUOTED";
    readonly QUOTED: "QUOTED";
    readonly PARENTHESIS: "PARENTHESIS";
    readonly OPERATOR: "OPERATOR";
    readonly END: "END";
};
interface Token<TType extends string = string, TValue = any> {
    readonly type: TType;
    readonly value: TValue;
    readonly position: number;
}
type UnquotedToken = Token<typeof TokenType.UNQUOTED, string>;
type QuotedToken = Token<typeof TokenType.QUOTED, string>;
type ParenthesisToken = Token<typeof TokenType.PARENTHESIS, '(' | ')'>;
type OperatorToken = Token<typeof TokenType.OPERATOR, ComparisonOperator | LogicOperator>;
type EndToken = Token<typeof TokenType.END, 'END'>;
declare function createUnquotedToken(value: string, position: number): UnquotedToken;
declare function createQuotedToken(value: string, position: number): QuotedToken;
declare function createParenthesisToken(value: '(' | ')', position: number): ParenthesisToken;
declare function createOperatorToken(value: ComparisonOperator | LogicOperator, position: number): OperatorToken;
declare function createEndToken(position: number): EndToken;
type AnyToken = UnquotedToken | QuotedToken | ParenthesisToken | OperatorToken | EndToken;
declare function isToken(candidate: object): candidate is Token;
declare function isUnquotedToken(candidate: object): candidate is UnquotedToken;
declare function isQuotedToken(candidate: object): candidate is QuotedToken;
declare function isParenthesisToken(candidate: object): candidate is ParenthesisToken;
declare function isOpenParenthesisToken(candidate: object): candidate is ParenthesisToken;
declare function isCloseParenthesisToken(candidate: object): candidate is ParenthesisToken;
declare function isOperatorToken(candidate: object): candidate is OperatorToken;
declare function isComparisonOperatorToken(candidate: object): candidate is OperatorToken;
declare function isOrOperatorToken(candidate: object): candidate is OperatorToken;
declare function isAndOperatorToken(candidate: object): candidate is OperatorToken;
declare function isEndToken(candidate: object): candidate is EndToken;
export default Token;
export { createUnquotedToken, createQuotedToken, createParenthesisToken, createOperatorToken, createEndToken, isToken, isUnquotedToken, isQuotedToken, isParenthesisToken, isOpenParenthesisToken, isCloseParenthesisToken, isOperatorToken, isComparisonOperatorToken, isOrOperatorToken, isAndOperatorToken, isEndToken, };
export type { AnyToken, UnquotedToken, QuotedToken, ParenthesisToken, OperatorToken, EndToken };
//# sourceMappingURL=Token.d.ts.map