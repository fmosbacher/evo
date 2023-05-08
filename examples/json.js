const { Parser: P } = require('../src/parser');

const json = P.lazy(() =>
  P.choice(jsonNull, jsonNumber, jsonBool, jsonString, jsonArray, jsonObject)
);

const jsonNull = P.literal('null').map(() => null);

const jsonNumber = P.number();

const jsonBool = P.choice(P.literal('false'), P.literal('true')).map(
  (result) => result === 'true'
);

const jsonString = P.right(
  P.char('"'),
  P.left(
    P.notChar('"')
      .many()
      .map((results) => results.join('')),
    P.char('"')
  )
);

const emptyArray = P.literal('[]').map(() => []);

const commaSepValues = P.sequence(json, P.right(P.char(','), json).many()).map(
  ([first, rest]) => [first].concat(rest)
);

const filledArray = P.right(P.char('['), P.left(commaSepValues, P.char(']')));

const jsonArray = P.choice(emptyArray, filledArray);

const emptyObject = P.literal('{}').map(() => ({}));

const keyValuePair = P.sequence(P.left(jsonString, P.char(':')), json).map(
  ([key, value]) => ({ [key]: value })
);

const keyValuePairs = P.sequence(
  keyValuePair,
  P.right(P.char(','), keyValuePair).many()
).map(([first, rest]) =>
  rest.reduce((acc, cur) => ({ ...acc, ...cur }), first)
);

const filledObject = P.right(P.char('{'), P.left(keyValuePairs, P.char('}')));

const jsonObject = P.choice(emptyObject, filledObject);

function parseJson(input) {
  const result = json.run(input);
  if (result) {
    const [parsed, remaining] = result;
    if (remaining.length > 0)
      return `could not parse remaining text: '${remaining}'`;
    return parsed;
  }
  return `could not parse input: '${input}'`;
}

module.exports = { parseJson };
