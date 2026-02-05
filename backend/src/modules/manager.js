import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const Manager = {};

const modulesPath = __dirname;

console.log("=> Loading controllers...");

const moduleDirs = fs
    .readdirSync(modulesPath)
    .filter((dir) =>
        fs.statSync(path.join(modulesPath, dir)).isDirectory()
    );

for (const dir of moduleDirs) {
    const controllerFile = fs
        .readdirSync(path.join(modulesPath, dir))
        .find((file) => file.endsWith(".controller.js"));

    if (!controllerFile) continue;

    const modulePath = path.join(modulesPath, dir, controllerFile);
    const { default: ControllerClass } = await import(modulePath);

    const key =
        dir.charAt(0).toUpperCase() + dir.slice(1).replace(/s$/, "");

    Manager[key] = new ControllerClass();
    console.log(`- ${key}`);
}
