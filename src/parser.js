class Parser {
  constructor(parseFn) {
    this.parseFn = parseFn;
  }

  static item() {
    return new Parser((input) =>
      input.length > 0 ? [input[0], input.slice(1)] : null
    );
  }

  static satisfies(fn) {
    return new Parser((input) => {
      const result = Parser.item().run(input);
      if (result) return fn(result[0]) ? result : null;
      return null;
    });
  }

  static sequence(...parsers) {
    return new Parser((input) => {
      let remaining = input;
      const results = [];
      for (let i = 0; i < parsers.length; i++) {
        const result = parsers[i].run(remaining);
        if (!result) return null;
        results.push(result[0]);
        remaining = result[1];
      }
      return [results, remaining];
    });
  }

  static choice(...parsers) {
    return new Parser((input) => {
      for (let i = 0; i < parsers.length; i++) {
        const result = parsers[i].run(input);
        if (result) return result;
      }
      return null;
    });
  }

  static left(parser1, parser2) {
    return Parser.sequence(parser1, parser2).map(([left, _]) => left);
  }

  static right(parser1, parser2) {
    return Parser.sequence(parser1, parser2).map(([_, right]) => right);
  }

  static char(searchChar) {
    return Parser.satisfies((parsedChar) => parsedChar === searchChar);
  }

  static notChar(searchChar) {
    return Parser.satisfies((parsedChar) => parsedChar !== searchChar);
  }

  static literal(searchString) {
    if (searchString.length === 1) return Parser.char(searchString);
    const parsers = searchString.split('').map(Parser.char);
    return Parser.sequence(...parsers).map((chars) => chars.join(''));
  }

  static digit() {
    return Parser.satisfies(
      (parsedChar) => parsedChar >= '0' && parsedChar <= '9'
    );
  }

  static whitespace() {
    return Parser.choice(
      Parser.char(' '),
      Parser.char('\n'),
      Parser.char('\t')
    );
  }

  static number() {
    const digits = Parser.digit()
      .many1()
      .map((results) => results.join(''));
    const positiveInteger = digits.map((result) => parseInt(result, 10));
    const negativeInteger = Parser.right(Parser.char('-'), positiveInteger);
    const integer = Parser.choice(positiveInteger, negativeInteger);
    const positiveFloat = Parser.sequence(digits, Parser.char('.'), digits).map(
      (results) => parseFloat(results.join(''))
    );
    const negativeFloat = Parser.right(Parser.char('-'), positiveFloat);
    const float = Parser.choice(positiveFloat, negativeFloat);
    return Parser.choice(float, integer);
  }

  static lazy(builder) {
    return new Parser((input) => builder().run(input));
  }

  run(input) {
    return this.parseFn(input);
  }

  map(fn) {
    return new Parser((input) => {
      const result = this.run(input);
      return result ? [fn(result[0]), result[1]] : null;
    });
  }

  many() {
    return new Parser((input) => {
      let remaining = input;
      let results = [];
      while (true) {
        const result = this.run(remaining);
        if (!result) break;
        results.push(result[0]);
        remaining = result[1];
      }
      return [results, remaining];
    });
  }

  many1() {
    return Parser.sequence(this, this.many()).map(([first, rest]) => [
      first,
      ...rest,
    ]);
  }

  zeroOrOne() {
    return new Parser((input) => {
      const result = this.run(input);
      return result || [null, input];
    });
  }
}

module.exports = { Parser };
