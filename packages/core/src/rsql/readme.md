## Gramática

Com base na seguinte especificação: https://github.com/jirutka/rsql-parser#grammar-and-semantic

## Operadores personalizados

Por padrão, o RSQL define 8 operadores de comparação integrados: `==`, `!=`, `<`, `>`, `<=`, `>=`, `=in=` e `=out= `.
Você pode definir seus operadores personalizados - o único requisito é que eles satisfaçam
seguinte expressão regular: `/=[a-z]+=/` (operador FIQL). O analisador aceitará qualquer comparação que contenha
um operador válido. Por isso, você não precisa registrá-lo. Em vez disso, sugerimos definir sua gramática
como um módulo. Aqui está um exemplo de como você pode definir o operador `=all=` e `=empty=`:

```typescript
// src/components/core/rsql/ast.ts
const ALL = '=all='
const EMPTY = '=empty='

export * from '@rsql/ast'
export { ALL, EMPTY }

// src/components/core/rsql/builder.ts
import builder from '@archbase-react/core/rsql/builder'
import { ALL, EMPTY } from './ast'

export default {
  ...builder,
  all(selector: string, values: string[]) {
    return builder.comparison(selector, ALL, values)
  },
  empty(selector: string, empty: boolean) {
    return builder.comparison(selector, EMPTY, empty ? 'yes' : 'no')
  }
}
```

## Exemplo

```typescript
// parsing
import { parse } from '@/components/core/rsql/parser'
const expression = parse('year>=2003')

// exploring
import { isComparisonNode, getSelector, getValue } from '@/components/core/rsql/ast'
if (isComparisonNode(expression)) {
  console.log(`Selector: ${getSelector(expression)}`)
  // > Selector: year
  console.log(`Operator: ${expression.operator}`)
  // > Operator: >=
  console.log(`Value: ${getValue(expression)}`)
  // > Value: 2003
}

// building
import builder from '@/components/core/rsql/builder'
const newExpression = builder.and(expression, builder.le('year', '2020'))

// emitting
import { emit } from '@/components/core/rsql/emitter'
const rsql = emit(newExpression)
console.log(`Emitted: ${rsql}`)
// > Emitted: year>=2003;year<=2020
```
