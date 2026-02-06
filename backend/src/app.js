import express from "express";
import cors from "cors";

import { setupRoutes } from "./modules/registerRoutes.js";
import { wrapResponse } from "./middleware/wrapResponse.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(wrapResponse);

app.get("/healthz", (req, res) => {
    res.json({
        status: "OK",
        service: "Personal Movie DB API.",
        time: new Date(),
    });
});

await setupRoutes(app);

app.use(errorHandler);

export default app;
