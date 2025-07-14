import { ComparisonOperator, LogicOperator, ComparisonNode, ExpressionNode } from '../ast';
interface Builder {
    comparison(selector: string, operator: ComparisonOperator, value: string | number | (string | number)[]): ComparisonNode;
    eq(selector: string, value: string | number): ComparisonNode;
    bt(selector: string, value1: string | number, value2: string | number): ComparisonNode;
    nb(selector: string, value1: string | number, value2: string | number): ComparisonNode;
    neq(selector: string, value: string | number): ComparisonNode;
    le(selector: string, value: string | number): ComparisonNode;
    lt(selector: string, value: string | number): ComparisonNode;
    ge(selector: string, value: string | number): ComparisonNode;
    gt(selector: string, value: string | number): ComparisonNode;
    in(selector: string, values: (string | number)[]): ComparisonNode;
    out(selector: string, values: (string | number)[]): ComparisonNode;
    logic(expressions: ExpressionNode[], operator: LogicOperator): ExpressionNode;
    and(...expressions: ExpressionNode[]): ExpressionNode;
    or(...expressions: ExpressionNode[]): ExpressionNode;
}
declare const builder: Builder;
export { builder };
export type { Builder };
//# sourceMappingURL=index.d.ts.map