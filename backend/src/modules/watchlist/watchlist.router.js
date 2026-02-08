import express from "express";
import { Manager } from "../manager.js";

const router = express.Router();

router.post("/", (req, res, next) =>
    Manager.Watchlist.add(req, res, next)
);
router.get("/", (req, res, next) =>
    Manager.Watchlist.list(req, res, next)
);
router.get("/:imdbId", (req, res, next) =>
    Manager.Watchlist.getOne(req, res, next)
);
router.patch("/:imdbId", (req, res, next) =>
    Manager.Watchlist.patch(req, res, next)
);
router.delete("/:imdbId", (req, res, next) =>
    Manager.Watchlist.remove(req, res, next)
);


export default {
    path: "/watchlist",
    router,
};
