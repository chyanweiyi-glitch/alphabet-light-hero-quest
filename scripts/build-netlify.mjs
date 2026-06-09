import { cp, mkdir, rm } from "node:fs/promises";

const files = ["index.html", "styles.css", "game.js", "manifest.webmanifest", "sw.js"];
const dirs = ["assets"];

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

for (const file of files) {
  await cp(file, `dist/${file}`);
}

for (const dir of dirs) {
  await cp(dir, `dist/${dir}`, {
    recursive: true,
    filter: (source) => !source.includes("/generated_images/") && !source.endsWith(".DS_Store"),
  });
}
