import assert from "assert";
import { prime } from "../src/rsa_modulus.mjs";

describe("test", () => {
  it("test", () => {
    Array.from(Array(100).keys()).forEach((x) => {
      const isPrime = prime(x);
      // sieve
      let isPrimeFromSieve = false;

      let primeTest = new Array(x + 1).fill(true);
      primeTest[0] = primeTest[1] = false;

      for (let p = 2; p * p <= x; p++) {
        // If primeTest[p] is not changed, then it is a prime
        if (primeTest[p]) {
          // Update all multiples of p
          for (let i = p * p; i <= x; i += p) {
            primeTest[i] = false;
          }
        }
      }
      isPrimeFromSieve = primeTest[x];
      assert.equal(isPrime, isPrimeFromSieve);
    });
  });

  // it("better", () => {
  //   assert.equal(1,1);
  // });
});
