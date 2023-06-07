import { RandomNumber } from "./utils/src/beacon.mjs";
import { mod } from "./utils/src/rsa_modulus.mjs";

const r = new RandomNumber();
await r.setup(2);

Array(20)
  .fill(null)
  .map(async () => {
    console.log(`--- rand`);
    console.log(r.rand());
  });

console.log("--- biprime");
console.log(await mod(20));
