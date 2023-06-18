import fs from "fs";
import path from "path";
import url from "url";

import { ptauName } from "./circuits.mjs";

const deleteFilesExceptOne = (directoryPath, fileNameToKeep) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      if (file !== fileNameToKeep) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', filePath, err);
          } else {
            console.log('Deleted file:', filePath);
          }
        });
      }
    });
  });
};

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../build");

deleteFilesExceptOne(outDir, ptauName);