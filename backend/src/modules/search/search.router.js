import express from "express";
import { Manager } from "../manager.js";

const router = express.Router();

router.get("/", (req, res, next) =>
    Manager.Search.search(req, res, next)
);

export default {
    path: "/search",
    router,
};
