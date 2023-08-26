import {
  AND,
  ComparisonOperator,
  EQ,
  GE,
  GT,
  IN,
  LE,
  LogicOperator,
  LT,
  NEQ,
  OR,
  OUT,
  BT,
  NB,
  createSelectorNode,
  createValueNode,
  createComparisonNode,
  createLogicNode,
  ComparisonNode,
  ExpressionNode,
} from '../ast';

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

const builder: Builder = {
  comparison(selector, operator, value) {
    return createComparisonNode(
      createSelectorNode(selector),
      operator,
      createValueNode(Array.isArray(value) ? value.map((singleValue) => String(singleValue)) : String(value)),
    );
  },
  eq(selector, value) {
    return builder.comparison(selector, EQ, value);
  },
  bt(selector, value1, value2) {
    return builder.comparison(selector, BT, [value1, value2]);
  },
  nb(selector, value1, value2) {
    return builder.comparison(selector, NB, [value1, value2]);
  },
  neq(selector, value) {
    return builder.comparison(selector, NEQ, value);
  },
  le(selector, value) {
    return builder.comparison(selector, LE, value);
  },
  lt(selector, value) {
    return builder.comparison(selector, LT, value);
  },
  ge(selector, value) {
    return builder.comparison(selector, GE, value);
  },
  gt(selector, value) {
    return builder.comparison(selector, GT, value);
  },
  in(selector, values) {
    return builder.comparison(selector, IN, values);
  },
  out(selector, values) {
    return builder.comparison(selector, OUT, values);
  },
  logic(expressions, operator) {
    if (!expressions.length) {
      throw new Error(`The logic expression builder requires at least one expression but none passed.`);
    }

    return expressions
      .slice(1)
      .reduce((leftExpression, rightExpression) => createLogicNode(leftExpression, operator, rightExpression), expressions[0]);
  },
  and(...expressions) {
    return builder.logic(expressions, AND);
  },
  or(...expressions) {
    return builder.logic(expressions, OR);
  },
};

export default builder;
export type { Builder };
