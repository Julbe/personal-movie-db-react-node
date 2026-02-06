import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const setupRoutes = async (app) => {
    const API_ROUTE = "/api";
    const modulesPath = __dirname;

    const moduleDirs = fs
        .readdirSync(modulesPath)
        .filter((dir) =>
            fs.statSync(path.join(modulesPath, dir)).isDirectory()
        );
    for (const dir of moduleDirs) {
        const routerFile = fs
            .readdirSync(path.join(modulesPath, dir))
            .find((file) => file.endsWith(".router.js"));

        if (!routerFile) continue;

        const modulePath = path.join(modulesPath, dir, routerFile);
        const { default: routeConfig } = await import(modulePath);

        if (routeConfig?.router && routeConfig?.path) {
            app.use(API_ROUTE + routeConfig.path, routeConfig.router);
            console.log(`Route => ${API_ROUTE}${routeConfig.path}`);
        }
    }
};
