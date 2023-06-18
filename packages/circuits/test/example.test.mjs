import { stringifyBigInts } from "../../utils/src/stringify.mjs";
import { Prover } from "../src/Prover.mjs";

describe("Example Proof", () => {
  it("test", async () => {
    const circuit = "multiplier2";
    const r = await Prover.genProofAndPublicSignals(
      circuit,
      stringifyBigInts({ a: 3, b: 4 })
    );
    console.log(r);
    console.log(await Prover.verifyProof(circuit, r.publicSignals, r.proof));
  });
  it("Pietrzack", async () => {
    const circuit = "pietrzak";
    const y = 0;
    const g = 0;
    const pi = 0;
    const L = 0;
    const T = 0;
    const r = await Prover.genProofAndPublicSignals(
      circuit,
      stringifyBigInts({y, g, pi, L, T})
    );
    const x = r.publicSignals;
    console.log(
      parseInt(
        x.reduce((acc, cur) => (acc += cur), ""),
        2
      )
        .toString(16)
        .toUpperCase()
    );
    console.log(await Prover.verifyProof(circuit, r.publicSignals, r.proof));
  });
});
