export const Operator = {
  IS: "IS",
  BETWEEN: "BETWEEN",
  LIKE: "LIKE",
  EQ: "EQ",
  NEQ: "NEQ",
  GEQ: "GEQ",
  LEQ: "LEQ",
  GT: "GT",
  LT: "LT",
  NOT: "NOT",
  IN: "IN",
  IS_NOT: "IS_NOT",
  AND: "AND",
  OR: "OR",
};

function is(type, obj) {
  const clas = Object.prototype.toString.call(obj).slice(8, -1);
  return obj !== undefined && obj !== null && clas === type;
}

function isOperator(operator) {
  return (
    operator === Operator.IS ||
    operator === Operator.BETWEEN ||
    operator === Operator.LIKE ||
    operator === Operator.EQ ||
    operator === Operator.NEQ ||
    operator === Operator.GEQ ||
    operator === Operator.LEQ ||
    operator === Operator.GT ||
    operator === Operator.LT ||
    operator === Operator.NOT ||
    operator === Operator.IN ||
    operator === Operator.IS_NOT ||
    operator === Operator.AND ||
    operator === Operator.OR
  );
}

export const ExpressionType = {
  FIELD: "FIELD",
  FILTER: "FILTER",
  GROUP: "GROUP",
  OPERATION: "OPERATION",
  AND: "AND",
  OR: "OR",
  IN: "IN",
  BETWEEN: "BETWEEN",
};

export class FilterException {
  constructor(message) {
    this.message = message;
    this.name = "FilterException";
  }
}

/**
 *
 *  Field Expression
 */
class FieldExpression {
  constructor(fieldName, fieldSql) {
    this.fieldName = fieldName;
    this.fieldSql = fieldSql;
    this.expressionType = ExpressionType.FIELD;
  }

  getFieldName() {
    return this.fieldName();
  }

  setFieldName(fieldName) {
    this.fieldName = fieldName;
  }

  toJSON(sb) {
    sb.append('"type" : "FIELD",');
    sb.append('"name" : "' + this.fieldName + '"');
    if (this.fieldSql) {
      sb.append(', "nameSql" : "' + this.fieldSql + '"');
    }
  }
}

/**
 *
 *  Filter Expression
 */

class FilterExpression {
  constructor() {
    this.expressionType = ExpressionType.FILTER;
  }

  applyOperation(operator, value) {
    throw new FilterException(
      "applyOperation só pode ser usado nas classes concretas."
    );
  }
  applyInOperation() {
    throw new FilterException(
      "applyInOperation só pode ser usado nas classes concretas."
    );
  }
  applyNotInOperation() {
    throw new FilterException(
      "applyNotInOperation só pode ser usado nas classes concretas."
    );
  }
  applyBetweenOperation() {
    throw new FilterException(
      "applyBetweenOperation só pode ser usado nas classes concretas."
    );
  }
  EQ(value) {
    return this.applyOperation(Operator.EQ, value);
  }

  NEQ(value) {
    return this.applyOperation(Operator.NEQ, value);
  }

  GEQ(value) {
    return this.applyOperation(Operator.GEQ, value);
  }

  GT(value) {
    return this.applyOperation(Operator.GT, value);
  }

  LT(value) {
    return this.applyOperation(Operator.LT, value);
  }

  AND() {
    if (arguments.length === 3) {
      return new AndExpression(
        this,
        new OperationExpression(arguments[0], arguments[1], arguments[2])
      );
    } else if (arguments.length === 1) {
      if (typeof arguments[0] === "object") {
        if (arguments[0].expressionType === undefined) {
          throw new FilterException(
            "Tipo de parâmetro incorreto para uso de AND. Parâmetro " +
              arguments[0]
          );
        } else {
          if (arguments[0].expressionType === ExpressionType.FIELD) {
            return new AndExpression(
              this,
              new OperationExpression(arguments[0])
            );
          } else {
            return new AndExpression(this, arguments[0]);
          }
        }
      } else {
        throw new FilterException("Parâmetro deve ser do tipo Object.");
      }
    } else {
      throw new FilterException(
        "Número de parâmetros incorretos para a chamade de AND"
      );
    }
  }

  OR() {
    if (arguments.length === 4) {
      return new OrExpression(
        this,
        new OrExpression(arguments[0], arguments[1], arguments[2])
      );
    } else if (arguments.length === 1) {
      if (typeof arguments[0] === "object") {
        if (arguments[0].expressionType === undefined) {
          throw new FilterException(
            "Tipo de parâmetro incorreto para uso de OR. Parâmetro " +
              arguments[0]
          );
        } else {
          if (arguments[0].expressionType === ExpressionType.FIELD) {
            return new OrExpression(
              this,
              new OperationExpression(arguments[0])
            );
          } else {
            return new OrExpression(this, arguments[0]);
          }
        }
      } else {
        throw new FilterException("Parâmetro deve ser do tipo Object.");
      }
    } else {
      throw new FilterException(
        "Número de parâmetros incorretos para a chamade de OR"
      );
    }
  }

  LEQ(value) {
    return this.applyOperation(Operator.LEQ, value);
  }

  LIKE(value) {
    return this.applyOperation(Operator.LIKE, value);
  }

  BETWEEN(valueStart, valueEnd) {
    return this.applyBetweenOperation(valueStart, valueEnd);
  }

  STARTSWITH(value) {
    if (ArchbaseStringUtils.isEmpty(value)) {
      throw new FilterException("Para usar STARTSWITH informe um valor.");
    }
    value = value.concat("%");
    return this.applyOperation(Operator.LIKE, value);
  }

  ENDSWITH(value) {
    if (ArchbaseStringUtils.isEmpty(value)) {
      throw new FilterException("Para usar ENDSWITH informe um valor.");
    }
    value = "%".concat(value);
    return this.applyOperation(Operator.LIKE, value);
  }

  CONTAINS(value) {
    if (ArchbaseStringUtils.isEmpty(value)) {
      throw new FilterException("Para usar v informe um valor.");
    }
    value = "%".concat(value.concat("%"));
    return this.applyOperation(Operator.LIKE, value);
  }

  IN() {
    return this.applyInOperation(arguments[0]);
  }

  NOTIN() {
    return this.applyNotInOperation(arguments[0]);
  }

  ISNULL() {
    return this.applyOperation(Operator.IS, "NULL");
  }

  ISNOTNULL() {
    return this.applyOperation(Operator.IS_NOT, "NULL");
  }
  toJSON(sb) {
    throw new FilterException(
      "toJSON deve ser implementado nas classes concretas herdadas de FilterExpression."
    );
  }
}

/**
 *
 *  Operation Expression
 */

class OperationExpression extends FilterExpression {
  constructor(lhsValue, operator, rhsValue) {
    super();
    this.lhsValue = lhsValue;
    this.rhsValue = rhsValue;
    this.operator = operator;
    this.expressionType = ExpressionType.OPERATION;
  }

  applyOperation(newOperator, newRhsValue) {
    if (!isOperator(newOperator)) {
      throw new FilterException(newOperator + " não é um operador válido.");
    }

    if (this.operator !== undefined) {
      throw new FilterException(
        "Não é possível aplicar " +
          newOperator +
          " operation on an " +
          this.operator +
          " expression."
      );
    }

    return new OperationExpression(this.lhsValue, newOperator, newRhsValue);
  }

  applyInOperation() {
    if (arguments[0].length === 0) {
      throw new FilterException(
        "Para usar operação IN é necessário informar os valores."
      );
    }

    if (!(this.lhsValue instanceof FieldExpression)) {
      throw new FilterException(
        "Somente é possível aplicar a operação 'IN' em uma coluna."
      );
    }
    return new InExpression(this.lhsValue, false, arguments[0]);
  }

  applyNotInOperation() {
    if (arguments[0].length === 0) {
      throw new FilterException(
        "Para usar operação NOT IN é necessário informar os valores."
      );
    }

    if (!(this.lhsValue instanceof FieldExpression)) {
      throw new FilterException(
        "Somente é possível aplicar a operação 'NOT IN' em uma coluna."
      );
    }
    return new InExpression(this.lhsValue, true, arguments[0]);
  }

  applyBetweenOperation(valueStart, valueEnd) {
    if (valueStart === undefined) {
      throw new FilterException(
        "Para usar operação BETWEEN é necessário informar o valor inicial."
      );
    }

    if (valueEnd === undefined) {
      throw new FilterException(
        "Para usar operação BETWEEN é necessário informar o valor final."
      );
    }

    if (!(this.lhsValue instanceof FieldExpression)) {
      throw new FilterException(
        "Somente é possível aplicar a operação 'BETWEEN' em uma coluna."
      );
    }
    return new BetweenExpression(this.lhsValue, valueStart, valueEnd);
  }
  toJSON(sb) {
    sb.append('"type" : "OP",');
    sb.append('"lhsValue" : {');
    this.lhsValue.toJSON(sb);
    sb.append("},");
    if (is("Number", this.rhsValue)) {
      sb.append('"rhsValue" : ' + this.rhsValue + ",");
    } else {
      sb.append('"rhsValue" : "' + this.rhsValue + '",');
    }

    sb.append('"operator" : "' + this.operator + '"');
  }
}

/**
 *
 *  Group Expression
 */

class GroupExpression extends FilterExpression {
  constructor(expressions) {
    super();
    this.expressions = expressions;
    this.expressionType = ExpressionType.GROUP;
  }

  getExpressions() {
    return this.expressions;
  }

  getOperator() {
    throw new FilterException(
      "Uso incorreto do método. Este método deve ser implementado por classes concretas que herdam de GroupExpression."
    );
  }
  applyOperation(operator, value) {
    const lastIndex = this.expressions.length - 1;
    const lastClause = this.expressions[lastIndex];
    this.expressions[lastIndex] = lastClause.applyOperation(operator, value);
    return this;
  }
  applyInOperation() {
    const lastIndex = this.expressions.length - 1;
    const lastClause = this.expressions[lastIndex];
    this.expressions[lastIndex] = lastClause.applyInOperation(arguments[0]);
    return this;
  }
  applyNotInOperation() {
    const lastIndex = this.expressions.length - 1;
    const lastClause = this.expressions[lastIndex];
    this.expressions[lastIndex] = lastClause.applyNotInOperation(arguments[0]);
    return this;
  }
  applyBetweenOperation(valueStart, valueEnd) {
    const lastIndex = this.expressions.length - 1;
    const lastClause = this.expressions[lastIndex];
    this.expressions[lastIndex] = lastClause.applyBetweenOperation(
      valueStart,
      valueEnd
    );
    return this;
  }
  toJSON(sb) {
    sb.append('"type" : "' + this.getOperator() + '",');
    sb.append('"expressions" : [');
    let appendDelimiter = false;
    for (let i = 0; i < this.expressions.length; i++) {
      if (appendDelimiter) {
        sb.append(",");
      }
      sb.append("{");
      this.expressions[i].toJSON(sb);
      sb.append("}");

      appendDelimiter = true;
    }
    sb.append("]");
  }
}

/**
 *
 *  IN Expression
 */
class InExpression extends FilterExpression {
  constructor() {
    super();
    if (arguments.length < 3) {
      throw new FilterException(
        "Para usar a expressão IN informe os parâmetros corretamente."
      );
    }

    this.field = arguments[0];
    this.negative = arguments[1];
    this.values = arguments[2];
    this.expressionType = ExpressionType.IN;
  }

  isNegative() {
    return this.negative;
  }

  applyOperation(operator, value) {
    throw new FilterException(
      "Não é possível aplicar a operação " + operator + " na expressão IN."
    );
  }
  applyInOperation() {
    throw new FilterException(
      "Não é possível aplicar a operação IN na expressão IN."
    );
  }
  applyNotInOperation() {
    throw new FilterException(
      "Não é possível aplicar a operação NOT IN na expressão IN."
    );
  }
  applyBetweenOperation(valueStart, valueEnd) {
    throw new FilterException(
      "Não é possível aplicar a operação BETWEEEN na expressão IN."
    );
  }
  toJSON(sb) {
    sb.append('"type" : "IN",');
    sb.append('"field" : {');
    this.field.toJSON(sb);
    sb.append("},");
    sb.append('"values" : [');
    let appendDelimiter = false;

    for (let i = 0; i < this.values.length; i++) {
      if (appendDelimiter) sb.append(",");

      if (is("Number", this.values[i])) {
        sb.append(this.values[i]);
      } else {
        sb.append('"' + this.values[i] + '"');
      }
      appendDelimiter = true;
    }
    sb.append("],");
    sb.append('"negative" : ' + this.negative);
  }
}

/**
 *
 *  BETWEEN Expression
 */
class BetweenExpression extends FilterExpression {
  constructor(field, valueStart, valueEnd) {
    super();
    if (field === undefined) {
      throw new FilterException("Informe o valor do field para usar BETWEEN.");
    }
    if (valueStart === undefined) {
      throw new FilterException("Informe o valor inicial para usar BETWEEN.");
    }
    if (valueEnd === undefined) {
      throw new FilterException("Informe o valor final para usar BETWEEN.");
    }

    this.field = field;
    this.valueStart = valueStart;
    this.valueEnd = valueEnd;
    this.expressionType = ExpressionType.BETWEEN;
  }

  applyOperation(operator, value) {
    throw new FilterException(
      "Não é possível aplicar a operação " + operator + " na expressão BETWEEN."
    );
  }
  applyInOperation() {
    throw new FilterException(
      "Não é possível aplicar a operação IN na expressão BETWEEN."
    );
  }
  applyNotInOperation() {
    throw new FilterException(
      "Não é possível aplicar a operação NOT IN na expressão BETWEEN."
    );
  }
  applyBetweenOperation(valueStart, valueEnd) {
    throw new FilterException(
      "Não é possível aplicar a operação BETWEEEN na expressão BETWEEN."
    );
  }
  toJSON(sb) {
    sb.append('"type" : "BETWEEN",');
    sb.append('"field" : {');
    this.field.toJSON(sb);
    sb.append("},");
    if (is("Number", this.valueStart)) {
      sb.append('"valueStart" : ' + this.valueStart + ",");
    } else {
      sb.append('"valueStart" : "' + this.valueStart + '",');
    }
    if (is("Number", this.valueEnd)) {
      sb.append('"valueEnd" : ' + this.valueEnd);
    } else {
      sb.append('"valueEnd" : "' + this.valueEnd + '"');
    }
  }
}

/**
 *
 *  AND Expression
 */
class AndExpression extends GroupExpression {
  constructor() {
    const expressions = [];
    for (let i = 0; i < arguments.length; i++) {
      expressions.push(arguments[i]);
    }
    super(expressions);
    this.expressionType = ExpressionType.AND;
  }

  getOperator() {
    return Operator.AND;
  }
}

/**
 *
 *  OR Expression
 */
class OrExpression extends GroupExpression {
  constructor() {
    const expressions = [];
    for (let i = 0; i < arguments.length; i++) {
      expressions.push(arguments[i]);
    }

    super(expressions);
    this.expressionType = ExpressionType.OR;
  }

  getOperator() {
    return Operator.OR;
  }
}

/**
 *
 * ArchbaseFilterDSL
 */
export class ArchbaseFilterDSL {
  constructor() {
    this.filterExpression = null;
    this.fieldsToSort = [];
    this.processRules = this.processRules.bind(this);
    this.WHERE = this.WHERE.bind(this);
    this.EQ = this.EQ.bind(this);
    this.NEQ = this.NEQ.bind(this);
    this.GEQ = this.GEQ.bind(this);
    this.LEQ = this.LEQ.bind(this);
    this.GT = this.GT.bind(this);
    this.LT = this.LT.bind(this);
    this.LIKE = this.LIKE.bind(this);
    this.IN = this.IN.bind(this);
    this.NOTIN = this.NOTIN.bind(this);
    this.AND = this.AND.bind(this);
    this.OR = this.OR.bind(this);
    this.ISNULL = this.ISNULL.bind(this);
    this.ISNOTNULL = this.ISNOTNULL.bind(this);
    this.betweenOrOp = this.betweenOrOp.bind(this);
    this.BETWEEN = this.BETWEEN.bind(this);
    this.OP = this.OP.bind(this);
    this.STARTSWITH = this.STARTSWITH.bind(this);
    this.CONTAINS = this.CONTAINS.bind(this);
    this.toJSON = this.toJSON.bind(this);
  }
  assertWhereClauseIsInitialized(operation) {
    if (this.filterExpression === null || this.filterExpression === undefined)
      throw new FilterException(
        "Não é possível aplicar '" +
          operation +
          "' operador se o cláusula WHERE não existir."
      );
  }

  buildFrom(query, sort) {
    if (query.rules) {
      this.processRules(query.condition, query.rules, true);
      if (sort && sort.sortFields) {
        sort.sortFields.forEach((field) =>{
          if (field.selected) {
            this.fieldsToSort.push(field.name + " " + field.asc_desc);
          }
        });
      }
    }
  }

  processRules(condition, rules, addWhere) {
    rules.forEach((rule) => {
      if (rule.field && !rule.disabled) {
        let CONDITION = _this.AND;
        if (condition === "or") {
          CONDITION = _this.OR;
        }
        if (addWhere) {
          CONDITION = _this.WHERE;
        }
        let newValue = rule.value;
        let newValue2 = rule.value2;
        if (newValue && newValue !== "") {
          if (rule.dataType === "date") {
            newValue = ArchbaseDateUtils.formatDate(
              ArchbaseDateUtils.parseDateWithFormat(newValue, "DD/MM/YYYY"),
              Archbase.dataSourceDatetimeFormat
            );
          } else if (rule.dataType === "date_time") {
            newValue = ArchbaseDateUtils.formatDate(
              ArchbaseDateUtils.parseDateWithFormat(
                newValue,
                "DD/MM/YYYY hh:mm:ss"
              ),
              Archbase.dataSourceDatetimeFormat
            );
          }
        }

        if (newValue2 && newValue2 !== "") {
          if (rule.dataType === "date") {
            newValue2 = ArchbaseDateUtils.formatDate(
              ArchbaseDateUtils.parseDateWithFormat(newValue2, "DD/MM/YYYY"),
              Archbase.dataSourceDatetimeFormat
            );
          } else if (rule.dataType === "date_time") {
            newValue2 = ArchbaseDateUtils.formatDate(
              ArchbaseDateUtils.parseDateWithFormat(
                newValue2,
                "DD/MM/YYYY hh:mm:ss"
              ),
              Archbase.dataSourceDatetimeFormat
            );
          }
        }

        if (rule.operator === "null") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).ISNULL();
          addWhere = false;
        } else if (rule.operator === "notNull") {
          CONDITION(
            _this.EXP(_this.FIELD(rule.field, rule.fieldSql))
          ).ISNOTNULL();
          addWhere = false;
        } else if (rule.operator === "contains" && newValue && newValue !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).CONTAINS(
            newValue
          );
          addWhere = false;
        } else if (rule.operator === "startsWith" && newValue && newValue !== "") {
          CONDITION(
            _this.EXP(_this.FIELD(rule.field, rule.fieldSql))
          ).STARTSWITH(newValue);
          addWhere = false;
        } else if (rule.operator === "endsWith" && newValue && newValue !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).ENDSWITH(
            newValue
          );
          addWhere = false;
        } else if (rule.operator === "=" && newValue && newValue !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).EQ(
            newValue
          );
          addWhere = false;
        } else if (rule.operator === "!=" && newValue && newValue !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).NEQ(
            newValue
          );
          addWhere = false;
        } else if (rule.operator === "<" && newValue && newValue !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).LT(
            newValue
          );
          addWhere = false;
        } else if (rule.operator === ">" && newValue && newValue !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).GT(
            newValue
          );
          addWhere = false;
        } else if (rule.operator === "<=" && newValue && newValue !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).LEQ(
            newValue
          );
          addWhere = false;
        } else if (rule.operator === ">=" && newValue && newValue !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).GEQ(
            newValue
          );
          addWhere = false;
        } else if (rule.operator === "between" && newValue && newValue !== "" && newValue2 && newValue2 !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).BETWEEN(
            newValue,
            newValue2
          );
          addWhere = false;
        } else if (rule.operator === "inList" && newValue && newValue !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).IN(
            newValue
          );
          addWhere = false;
        } else if (rule.operator === "notInList" && newValue && newValue !== "") {
          CONDITION(_this.EXP(_this.FIELD(rule.field, rule.fieldSql))).NOTIN(
            newValue
          );
          addWhere = false;
        }
      }
    });

    rules.forEach((rule) => {
      if (rule.rules) {
        this.processRules(rule.condition, rule.rules, addWhere);
      }
    });
  }

  FIELD(name, nameSql) {
    return new FieldExpression(name, nameSql);
  }
  EXP(field) {
    return new OperationExpression(field);
  }
  WHERE() {
    if (arguments.length < 1) {
      throw new FilterException(
        "Para criar uma condição WHERE informe ao menos um parâmetro."
      );
    }
    if (arguments.length === 3) {
      if (arguments[2] !== undefined) {
        this.filterExpression = new OperationExpression(
          arguments[0],
          arguments[1],
          arguments[2]
        );
      }
    } else {
      this.filterExpression = arguments[0];
      if (
        arguments[0].expressionType !== undefined &&
        arguments[0].expressionType === ExpressionType.FIELD
      ) {
        this.filterExpression = new OperationExpression(arguments[0]);
      }
    }
    return this;
  }
  EQ(value) {
    this.assertWhereClauseIsInitialized("eq");
    this.filterExpression = this.filterExpression.EQ(value);
    return this;
  }
  NEQ(value) {
    this.assertWhereClauseIsInitialized("neq");
    this.filterExpression = this.filterExpression.NEQ(value);
    return this;
  }
  GEQ(value) {
    this.assertWhereClauseIsInitialized("geq");
    this.filterExpression = this.filterExpression.GEQ(value);
    return this;
  }
  LEQ(value) {
    this.assertWhereClauseIsInitialized("leq");
    this.filterExpression = this.filterExpression.LEQ(value);
    return this;
  }
  GT(value) {
    this.assertWhereClauseIsInitialized("gt");
    this.filterExpression = this.filterExpression.GT(value);
    return this;
  }
  LT(value) {
    this.assertWhereClauseIsInitialized("lt");
    this.filterExpression = this.filterExpression.LT(value);
    return this;
  }
  LIKE(value) {
    this.assertWhereClauseIsInitialized("like");
    this.filterExpression = this.filterExpression.LIKE(value);
    return this;
  }
  IN() {
    const values = [];
    for (let i = 0; i < arguments.length; i++) {
      values.push(arguments[i]);
    }
    this.assertWhereClauseIsInitialized("in");
    this.filterExpression = this.filterExpression.IN(values);
    return this;
  }
  NOTIN() {
    const values = [];
    for (let i = 0; i < arguments.length; i++) {
      values.push(arguments[i]);
    }
    this.assertWhereClauseIsInitialized("not in");
    this.filterExpression = this.filterExpression.NOTIN(values);
    return this;
  }
  AND(columnOrExpression) {
    this.assertWhereClauseIsInitialized("and");
    this.filterExpression = this.filterExpression.AND(columnOrExpression);
    return this;
  }
  OR(columnOrExpression) {
    this.assertWhereClauseIsInitialized("or");
    this.filterExpression = this.filterExpression.OR(columnOrExpression);
    return this;
  }
  ISNULL() {
    this.assertWhereClauseIsInitialized("isNull");
    this.filterExpression = this.filterExpression.ISNULL();
    return this;
  }
  ISNOTNULL() {
    this.assertWhereClauseIsInitialized("isNotNull");
    this.filterExpression = this.filterExpression.ISNOTNULL();
    return this;
  }
  betweenOrOp(operator, valueStart, valueEnd) {
    this.assertWhereClauseIsInitialized(operator);
    this.filterExpression = this.filterExpression.betweenOrOp(
      operator,
      valueStart,
      valueEnd
    );
    return this;
  }
  BETWEEN(valueStart, valueEnd) {
    this.assertWhereClauseIsInitialized("between");
    this.filterExpression = this.filterExpression.BETWEEN(valueStart, valueEnd);
    return this;
  }
  OP(operator, value) {
    this.assertWhereClauseIsInitialized(operator);
    this.filterExpression = this.filterExpression.applyOperation(
      operator,
      value
    );
    return this;
  }
  STARTSWITH(value) {
    this.assertWhereClauseIsInitialized("startsWith");
    this.filterExpression = this.filterExpression.STARTSWITH(value);
    return this;
  }
  CONTAINS(value) {
    this.assertWhereClauseIsInitialized("contains");
    this.filterExpression = this.filterExpression.CONTAINS(value);
    return this;
  }

  SORTBY(field, desc) {
    if (field instanceof FieldExpression) {
      this.fieldsToSort.push(
        field.getFieldName + (desc === true ? " DESC" : " ASC")
      );
    } else {
      this.fieldsToSort.push(field + (desc === true ? " DESC" : " ASC"));
    }
  }

  toJSON() {
    if (this.filterExpression !== undefined && this.filterExpression != null) {
      const sb = ArchbaseStringUtils.createStringBuilder();
      sb.append("{");
      sb.append('   "filterExpression" : {');
      this.filterExpression.toJSON(sb);
      sb.append("}, ");
      sb.append('    "fieldsToSort" : [');
      let appendDelimiter = false;
      this.fieldsToSort.forEach(function(field) {
        if (appendDelimiter === true) {
          sb.append(", ");
        }
        sb.append('{ "field" : "' + field + '" }');
        appendDelimiter = true;
      });
      sb.append("]");
      sb.append("}");
      return sb.toString();
    }
  }
}
