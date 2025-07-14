import { AnyToken } from './lexer/Token';
declare function createErrorForUnexpectedCharacter(position: number, source: string): SyntaxError;
declare function createErrorForUnclosedQuote(position: number, source: string): SyntaxError;
declare function createErrorForUnexpectedToken(token: AnyToken, source: string): SyntaxError;
declare function createErrorForUnclosedParenthesis(_token: AnyToken, source: string, parentPosition: number): SyntaxError;
declare function createErrorForEmptyInput(_token: AnyToken, source: string): SyntaxError;
export { createErrorForUnexpectedCharacter, createErrorForUnclosedQuote, createErrorForUnexpectedToken, createErrorForUnclosedParenthesis, createErrorForEmptyInput, };
//# sourceMappingURL=Error.d.ts.map