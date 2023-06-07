export const powmod = (a, b, m) => {
  let ans = 1n;
  a %= m;

  while (b > 0) {
    if (b & 1n) {
      ans = (ans * a) % m;
    }
    b >>= 1n;
    a = (a * a) % m;
  }
  return ans;
};
