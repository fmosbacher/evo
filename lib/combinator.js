const success = (r) => typeof r !== 'string';

const choice = (...ps) =>
  ps.length === 0
    ? 'choice requires at least one argument'
    : (s) => {
        for (let i = 0; i < ps.length; i++) {
          const r = ps[i](s);
          if (success(r)) return r;
        }
        return `choice cannot find successfull parser for input ${s}`;
      };

const seq = (...ps) =>
  ps.length === 0
    ? 'seq requires at least one argument'
    : (s) => {
        const acc = [];
        let remaining = s;
        for (let i = 0; i < ps.length; i++) {
          const r = ps[i](remaining);
          if (success(r)) {
            acc.push(r[0]);
            remaining = r[1];
          } else return `seq failed with remaining: '${remaining}'`;
        }
        return [acc.filter((r) => r !== undefined), remaining];
      };

const map = (f, p) => (s) => {
  const r = p(s);
  if (success(r)) return r[0] !== undefined ? [f(r[0]), r[1]] : r;
  return `unable to map failed parser with input: ${s}`;
};

const many = (p) => (s) => {
  const acc = [];
  let remaining = s;
  while (true) {
    const r = p(remaining);
    if (success(r)) {
      acc.push(r[0]);
      remaining = r[1];
    } else break;
  }
  return [acc.filter((r) => r !== undefined), remaining];
};

const many1 = (p) => map((r) => [r[0], ...r[1]], seq(p, many(p)));

const skip = (p) => map((r) => undefined, p);

module.exports = {
  choice,
  seq,
  map,
  many,
  many1,
  skip,
};
