const { choice, map, many1 } = require('./combinator.js');
const { char } = require('./builder.js');

const digit = (s) => {
  const ps = [];
  for (let i = '0'.charCodeAt(0); i <= '9'.charCodeAt(0); i++) {
    ps.push(char(String.fromCharCode(i)));
  }
  return choice(...ps)(s);
};

const integer = map(
  (r) => parseInt(r.reduce((acc, r) => acc + r, '')),
  many1(digit)
);

const lowerLetter = (s) => {
  const ps = [];
  for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
    ps.push(char(String.fromCharCode(i)));
  }
  return choice(...ps)(s);
};

const upperLetter = (s) => {
  const ps = [];
  for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
    ps.push(char(String.fromCharCode(i)));
  }
  return choice(...ps)(s);
};

const letter = choice(lowerLetter, upperLetter);

const word = many1(letter);

const whitespace = choice(char(' '), char('\n'), char('\t'));

module.exports = {
  digit,
  integer,
  lowerLetter,
  upperLetter,
  letter,
  word,
  whitespace,
};
