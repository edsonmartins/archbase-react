import { ArchbaseQueryFilter, Field, Rule } from './ArchbaseFilterCommons';

class GraphQLQueryBuilder {
  private query: string;
  constructor() {
    this.query = '';
  }

  buildFrom(filter: ArchbaseQueryFilter) {
    this.query = '';

    if (filter.filter.rules) {
      this.buildGraphQLQuery(filter.filter.condition, filter.filter.rules);
    }

    return this.query;
  }

  buildGraphQLQuery(condition, rules) {
    if (condition === 'or') {
      this.query += '(';
    }

    rules.forEach((rule, index) => {
      if (index > 0) {
        if (condition === 'or') {
          this.query += ', ';
        } else {
          this.query += ' E ';
        }
      }

      if (rule.field && !rule.disabled) {
        const fieldName = this.getFieldName(rule.field);
        const operator = this.getOperator(rule.operator);
        const value = this.formatValue(rule.value, rule.dataType);

        this.query += `${fieldName}: { ${operator}: ${value} }`;
      }

      if (rule.rules && !rule.disabled) {
        this.buildGraphQLQuery(rule.condition, rule.rules);
      }
    });

    if (condition === 'or') {
      this.query += ')';
    }
  }

  getFieldName(fieldName) {
    // Você pode precisar mapear nomes de campos para seus equivalentes no GraphQL
    // Por exemplo: 'fieldName' -> 'fieldNameGraphQL'
    return fieldName;
  }

  getOperator(operator) {
    // Você pode precisar mapear operadores para seus equivalentes no GraphQL
    // Por exemplo: 'equals' -> 'eq'
    return operator;
  }

  formatValue(value, dataType) {
    // Formate o valor com base no tipo de dados (por exemplo, datas, números)
    if (dataType === 'date' || dataType === 'date_time') {
      // Formate valores de data conforme necessário
      return `"${value}"`;
    } else if (dataType === 'number') {
      // Lide com valores numéricos
      return value;
    } else {
      // Lide com outros tipos de dados (string, booleano, etc.)
      return `"${value}"`;
    }
  }
}

export default GraphQLQueryBuilder;
