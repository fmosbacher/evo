const { seq, skip, many, map, many1, choice } = require('../lib/combinator');
const { whitespace, integer } = require('../lib/parser');
const { char, literal, notChar } = require('../lib/builder');

const anythingExceptDQuotes = map(
  (r) => r.reduce((acc, r) => acc + r),
  many1(notChar('"'))
);

const dQuotedString = map(
  (r) => r[0],
  seq(skip(char('"')), anythingExceptDQuotes, skip(char('"')))
);

const jsonKey = dQuotedString;

const jsonStringValue = dQuotedString;

const jsonNumberValue = integer;

const jsonNullValeu = map((_) => null, literal('null'));

const jsonValue = choice(jsonStringValue, jsonNumberValue, jsonNullValeu);

const jsonPair = map(
  (r) => ({ [r[0]]: r[1] }),
  seq(jsonKey, skip(char(':')), skip(many(whitespace)), jsonValue)
);

const json = map(
  (r) => [...r[0], r[1]].reduce((acc, r) => ({ ...acc, ...r }), {}),
  seq(
    skip(many(whitespace)),
    skip(char('{')),
    skip(many(whitespace)),
    many(
      map((r) => r[0], seq(jsonPair, skip(char(',')), skip(many(whitespace))))
    ),
    jsonPair,
    skip(many(whitespace)),
    skip(char('}')),
    skip(many(whitespace))
  )
);

module.exports = { json };
