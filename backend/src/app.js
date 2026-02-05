import express from "express";
import cors from "cors";

import { setupRoutes } from "./modules/registerRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        status: "OK",
        service: "Personal Movie DB API.",
        time: new Date(),
    });
});

setupRoutes(app);


export default app;
