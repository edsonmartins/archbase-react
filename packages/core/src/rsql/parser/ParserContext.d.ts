import { Node } from '../ast';
import { AnyToken } from './lexer/Token';
interface ParserContext {
    position: number;
    readonly tokens: AnyToken[];
    readonly stack: (AnyToken | Node)[];
    readonly state: number[];
    readonly parent: ParserContext | null;
}
declare function getParserContextState(context: ParserContext): number;
declare function getParserContextToken(context: ParserContext): AnyToken;
declare function getParserContextHead(context: ParserContext): AnyToken | Node;
declare function createParserContext(tokens: AnyToken[]): ParserContext;
export default ParserContext;
export { getParserContextState, getParserContextToken, getParserContextHead, createParserContext };
//# sourceMappingURL=ParserContext.d.ts.map