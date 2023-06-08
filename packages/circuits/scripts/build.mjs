import os from "os";
import fs from "fs";
import path from "path";
import url from "url";
import { ptauName } from "./circuits.mjs";
import child_process from "child_process";
import { isTypedArray } from "util/types";
import * as snarkjs from "snarkjs";
import { stringifyBigInts } from "../../utils/src/stringify.mjs";
import { copyAndDelete } from "./copyAndDelete.mjs";

await import("./downloadPtau.mjs");

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const circuitName = "multiplier2";

const outDir = path.join(__dirname, "../build");
const circuitsDir = path.join(__dirname, "../circuits");

console.log(outDir);
await fs.promises.mkdir(outDir, { recursive: true });
const inputFileOut = path.join(outDir, `${circuitName}_main.circom`);
const inputFileIn = path.join(circuitsDir, circuitName);
const circuitOut = path.join(outDir, `${circuitName}_main.r1cs`);
const wasmOut = path.join(
  outDir,
  `${circuitName}_main_js/${circuitName}_main.wasm`
);
const wasmOutFinal = path.join(outDir, `${circuitName}.wasm`);
const zkey = path.join(outDir, `${circuitName}.zkey`);
const vkey = path.join(outDir, `${circuitName}.vkey.json`);
const ptau = path.join(outDir, ptauName);

const circuitContents = await fs.promises.readFile(
  `${inputFileIn}.circom`,
  "utf8"
);

await fs.promises.writeFile(inputFileOut, circuitContents);

const circuitOutFileExists = await fs.promises
  .stat(circuitOut)
  .catch(() => false);
const wasmOutFileExists = await fs.promises
  .stat(wasmOutFinal)
  .catch(() => false);
const zkeyFileExists = await fs.promises.stat(zkey).catch(() => false);
const vkeyFileExists = await fs.promises.stat(vkey).catch(() => false);

if (circuitOutFileExists && wasmOutFileExists) {
  console.log(circuitOut.split("/").pop(), "exists - skipping compilation");
} else {
  console.log(`Compiling ${inputFileOut.split("/").pop()}`);
  await new Promise((rs, rj) => {
    child_process.exec(
      `circom --r1cs --wasm -o ${outDir} ${inputFileOut}`,
      (err, _, __) => {
        if (err) rj(err);
        else rs();
      }
    );
  });
  console.log(
    `Generated ${circuitOut.split("/").pop()} and ${wasmOut.split("/").pop()}`
  );
  await copyAndDelete(wasmOut, wasmOutFinal);
  fs.rmSync(path.join(outDir, `${circuitName}_main_js/`), {
    recursive: true,
    force: true,
  });
}

if (zkeyFileExists && vkeyFileExists) {
  console.log(zkey.split("/").pop(), "exists - skipping compilation");
} else {
  console.log("Exporting verification key...");
  await snarkjs.zKey.newZKey(circuitOut, ptau, zkey);
  const vkeyJson = await snarkjs.zKey.exportVerificationKey(zkey);
  const s = JSON.stringify(stringifyBigInts(vkeyJson), null, 1);
  await fs.promises.writeFile(vkey, s);
}
process.exit(0);
