const assert = require('assert');
const { json } = require('./examples/json.js');

const res = json(`
    {
        "string": "lettersss",
        "number": 10,
        "null": null
    }
`);

const expected = {
  string: 'lettersss',
  number: 10,
  null: null,
};

assert(
  res[0].string === expected.string &&
    res[0].number === expected.number &&
    res[0].null === expected.null
);
