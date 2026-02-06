import express from "express";
import { Manager } from "../manager.js";

const router = express.Router();

router.get("/recent", (req, res, next) =>
    Manager.Comparsion.recent(req, res, next)
);

export default {
    path: "/comparisons",
    router,
};