import { rand } from "./beacon.mjs";
import { powmod } from "./utils.mjs";

// Computes an RSA Modulus (bi-prime)
export const biprime = async (n, rounds = 10) => {
  // Check if `n` is prime
  const prime = async (_n) => {
    if (_n % 2n == 0 || _n <= 1n) return false;
    let d = n - 1;
    while (d % 2 == 0) d /= 2;

    return (
      (
        await Promise.all(
          Array(rounds)
            .fill(null)
            .map(async () => {
              const r = await rand();
              const a = (r % BigInt(_n - 2)) + BigInt(1);
              let x = powmod(a, d, _n);

              if (x == 1 || x == n - 1) return 1;

              while (d != n - 1) {
                x = powmod(x, 2, _n);
                d *= 2;

                if (x == 1) return 0;
                if (x == n - 1) return 1;
              }
            })
        )
      ).reduce((acc, cur) => acc + cur, 0) *
        4 >=
      3 * rounds // Miller - Rabin passes with probability >= 3/4
    );
  };

  return (
    await Promise.all(
      Array(2)
        .fill(null)
        .map(async () => {
          for (;;) {
            const r = await rand();
            if (prime(r)) {
              return r;
            }
          }
        })
    )
  ).reduce((acc, cur) => acc * cur, 1n);
};
