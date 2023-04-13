const { map, seq } = require('./combinator.js');

const char = (c) => (s) =>
  s[0] == c
    ? [c, s.slice(1)]
    : `char failed to parse char '${c}' with input '${s}'`;

const notChar = (c) => (s) =>
  s[0] != c ? [s[0], s.slice(1)] : `notChar found '${c}' in input '${s}'`;

const literal = (u) => (s) =>
  map(
    (r) => r.reduce((acc, r) => acc + r, ''),
    seq(...u.split('').map(char))
  )(s);

module.exports = { char, notChar, literal };
