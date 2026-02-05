import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
    console.log(`Personal Movie backend running on http://localhost:${env.port}`);
});