import os from "os";
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const outDir = path.join(__dirname, "../build");
await fs.promises.mkdir(outDir, { recursive: true });

const 
