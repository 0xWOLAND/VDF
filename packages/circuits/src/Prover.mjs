import * as snarkjs from "snarkjs";
import path from "path";
import url from "url";
import fs from "fs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const buildPath = path.join(__dirname, "../build");

export const Prover = {
  genProofAndPublicSignals: async (circuitName, inputs) => {
    const circuitWasmPath = path.join(buildPath, `${circuitName}.wasm`);
    const zkeyPath = path.join(buildPath, `${circuitName}.zkey`);
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      circuitWasmPath,
      zkeyPath
    );

    return { proof, publicSignals };
  },

  verifyProof: async (circuitName, publicSignals, proof) => {
    const vkey = JSON.parse(
      fs.readFileSync(path.join(buildPath, `${circuitName}.vkey.json`))
    );
    return snarkjs.groth16.verify(vkey, publicSignals, proof);
  },
};
