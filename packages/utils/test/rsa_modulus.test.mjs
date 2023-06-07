import assert from "assert";
import { prime } from "../src/rsa_modulus.mjs";

describe("test", () => {
  it("test", () => {
    Array.from(Array(100).key()).forEach((x) => {
      const isPrime = prime(x);
      // sieve
      const isPrimeFromSieve = false;
      assert.equal(isPrime, isPrimeFromSieve);
    });
  });
});
