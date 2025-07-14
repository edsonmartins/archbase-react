import { ComparisonOperator } from './ComparisonOperator';
import { LogicOperator } from './LogicOperator';
declare const NodeType: {
    readonly SELECTOR: "SELECTOR";
    readonly VALUE: "VALUE";
    readonly COMPARISON: "COMPARISON";
    readonly LOGIC: "LOGIC";
};
interface Node<TType = string> {
    readonly type: TType;
}
interface SelectorNode extends Node<typeof NodeType.SELECTOR> {
    readonly selector: string;
}
interface ValueNode extends Node<typeof NodeType.VALUE> {
    readonly value: string | string[];
}
interface BinaryNode<TType extends string = string, TLeft extends Node = Node, TOperator extends string = string, TRight extends Node = Node> extends Node<TType> {
    readonly left: TLeft;
    readonly operator: TOperator;
    readonly right: TRight;
}
type ComparisonNode = BinaryNode<typeof NodeType.COMPARISON, SelectorNode, ComparisonOperator, ValueNode>;
type LogicNode = BinaryNode<typeof NodeType.LOGIC, ExpressionNode, LogicOperator, ExpressionNode>;
type ExpressionNode = ComparisonNode | LogicNode;
declare function isNode(candidate: unknown): candidate is Node;
declare function isSelectorNode(candidate: unknown): candidate is SelectorNode;
declare function isValueNode(candidate: unknown): candidate is ValueNode;
declare function isComparisonNode(candidate: unknown, operator?: ComparisonOperator): candidate is ComparisonNode;
declare function isLogicNode(candidate: unknown, operator?: LogicOperator): candidate is LogicNode;
declare function isExpressionNode(candidate: unknown): candidate is ExpressionNode;
declare function getSelector(comparison: ComparisonNode): string;
declare function getValue(comparison: ComparisonNode): string | string[];
declare function getSingleValue(comparison: ComparisonNode): string;
declare function getMultiValue(comparison: ComparisonNode): string[];
declare function createSelectorNode(selector: string, skipChecks?: boolean): SelectorNode;
declare function createValueNode(value: string | string[], skipChecks?: boolean): ValueNode;
declare function createComparisonNode(selector: SelectorNode, operator: ComparisonOperator, value: ValueNode, skipChecks?: boolean): ComparisonNode;
declare function createLogicNode(left: ExpressionNode, operator: LogicOperator, right: ExpressionNode, skipChecks?: boolean): LogicNode;
export { createSelectorNode, createValueNode, createComparisonNode, createLogicNode, isNode, isSelectorNode, isValueNode, isComparisonNode, isLogicNode, isExpressionNode, getSelector, getValue, getSingleValue, getMultiValue, };
export type { Node, SelectorNode, ValueNode, BinaryNode, ComparisonNode, LogicNode, ExpressionNode };
//# sourceMappingURL=Node.d.ts.map