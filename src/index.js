const { eval } = require('../examples/math-expr');

let res = eval('-((2+8)^3-250)/3');

console.log(res === -250);

const { parseJson } = require('../examples/json');

res = parseJson(`{"string":"lettersss","number":10,"null":null}`);

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
