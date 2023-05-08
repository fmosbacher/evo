# Evo - JS parser combinators

Parser combinator from scratch. It does not depends on any external library.

## Examples

See the implementation of the examples to see the parsers being used.

### Addition

```javascript
const { eval } = require('./examples/math-expr');

let res = eval('-((2+8)^3-250)/3');

console.log(res === -250);
```

### JSON (It does not support whitespaces between keys and values)

```javascript
const { parseJson } = require('./examples/json');

const res = parseJson(`{"string":"lettersss","number":10,"null":null}`);

const expected = {
  string: 'lettersss',
  number: 10,
  null: null,
};

console.log(
  res.string === expected.string &&
    res.number === expected.number &&
    res.null === expected.null
);
```

## Quick start

You can just run the project with Node to see the examples results.

```
node src/index.js
```
