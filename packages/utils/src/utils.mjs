export const mulmod = (a, b, m) => {
  return ((a % m) * (b % m)) % m;
};

export const powmod = (a, b, m) => {
  return Array(b)
    .fill(1)
    .reduce((acc, _) => mulmod(acc, a, m));
};
