import express from "express";
import { Manager } from "../manager.js";

const router = express.Router();

router.get("/:imdbId", (req, res, next) =>
    Manager.Movie.getByImdbId(req, res, next)
);

export default {
    path: "/movie",
    router,
};
