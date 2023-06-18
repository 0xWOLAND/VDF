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
import { circuitContents } from "./circuits.mjs";

await import("./downloadPtau.mjs");

const circuits = Object.keys(circuitContents);
for (const circuit of circuits) {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

  const outDir = path.join(__dirname, "../build");
  const circuitsDir = path.join(__dirname, "../circuits");

  await fs.promises.mkdir(outDir, { recursive: true });
  const inputFileOut = path.join(outDir, `${circuit}_main.circom`);
  const inputFileIn = path.join(circuitsDir, circuit);
  const circuitOut = path.join(outDir, `${circuit}_main.r1cs`);
  const wasmOut = path.join(outDir, `${circuit}_main_js/${circuit}_main.wasm`);
  const wasmOutFinal = path.join(outDir, `${circuit}.wasm`);
  const zkey = path.join(outDir, `${circuit}.zkey`);
  const vkey = path.join(outDir, `${circuit}.vkey.json`);
  const ptau = path.join(outDir, ptauName);

  const inputFileOutExists = await fs.promises
    .stat(inputFileOut)
    .catch(() => false);

  if (!inputFileOutExists) {
    await fs.promises.writeFile(inputFileOut, circuitContents[circuit]);
  }

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
    fs.rmSync(path.join(outDir, `${circuit}_main_js/`), {
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
}
process.exit(0);
