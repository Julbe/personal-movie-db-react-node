import app from "./app.js";
import { env } from "./config/env.js";
import { connectSequelize, sequelize } from "./db/sequelize.js";
import "./db/index.js";

await connectSequelize();
await sequelize.sync();

app.listen(env.port, () => {
    console.log(`Personal Movie backend running on http://localhost:${env.port}`);
});