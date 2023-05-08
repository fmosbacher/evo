const { Parser: P } = require('../src/parser');

const expr = P.lazy(() =>
  P.sequence(
    term,
    P.sequence(P.choice(P.char('+'), P.char('-')), term)
      .many()
      .map((results) =>
        results.map(([op, term]) => (op === '-' ? -term : term))
      )
  ).map(([first, rest]) => rest.reduce((acc, cur) => acc + cur, first))
);

const power = P.lazy(() =>
  P.choice(
    P.right(P.char('-'), factor).map((result) => -result),
    P.right(P.char('('), P.left(expr, P.char(')'))),
    P.number()
  )
);

const factor = P.sequence(power, P.right(P.char('^'), power).many()).map(
  ([first, rest]) => [first, ...rest].reduceRight((acc, cur) => cur ** acc, 1)
);

const term = P.sequence(
  factor,
  P.sequence(P.choice(P.char('*'), P.char('/')), factor).many()
).map(([first, rest]) =>
  rest.reduce(
    (acc, [op, factor]) => (op === '/' ? acc / factor : acc * factor),
    first
  )
);

function eval(input) {
  const result = expr.run(input);
  if (!result) return `could not parse input: '${input}'`;
  if (result[1].length > 0)
    return `could not parse remaining text: '${remaining}'`;
  return result[0];
}

module.exports = { eval };
