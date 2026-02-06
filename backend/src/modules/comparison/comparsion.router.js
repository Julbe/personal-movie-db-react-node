import express from "express";
import { Manager } from "../manager.js";

const router = express.Router();

router.post("/", (req, res, next) =>
    Manager.Comparison.compare(req, res, next)
);

export default {
    path: "/compare",
    router,
};