import { copyFile, mkdir } from "node:fs/promises";

await mkdir(new URL("../dist/.openai/", import.meta.url), { recursive: true });
await copyFile(
  new URL("../.openai/hosting.json", import.meta.url),
  new URL("../dist/.openai/hosting.json", import.meta.url),
);
