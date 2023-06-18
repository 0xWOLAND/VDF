import fs from "fs";

export const copyAndDelete = async (inp, out) => {
  await fs.copyFile(inp, out, (err) => {
    if (err) console.error(err);
  });
  await fs.unlink(inp, (err) => {
    if (err) console.error(err);
  });
};
