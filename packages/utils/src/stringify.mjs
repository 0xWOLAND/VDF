const fromLE = (arr) => {
  let val = BigInt(0);
  let base = BigInt(1);
  for (const byte of arr) {
    val = val + base * BigInt(byte);
    base = base * BigInt(256);
  }
  return val;
};

export const stringifyBigInts = (o) => {
  if (typeof o == "bigint" || o.eq !== undefined) {
    return o.toString(10);
  } else if (o instanceof Uint8Array) {
    return fromLE(o);
  } else if (Array.isArray(o)) {
    return o.map(stringifyBigInts);
  } else if (typeof o == "object") {
    const res = {};
    const keys = Object.keys(o);
    keys.forEach((k) => {
      res[k] = stringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
};
