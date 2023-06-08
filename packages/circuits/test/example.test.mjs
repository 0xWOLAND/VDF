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
});
