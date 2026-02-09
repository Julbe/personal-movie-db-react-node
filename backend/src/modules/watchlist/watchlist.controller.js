import { parseBooleanQuery, validateImdbId, validateRating } from "../../utils/validations.js";
import { addToWatchlist, deleteWatchlist, getOneWatchlist, listWatchlist, updateWatchlist } from "./watchlist.service.js";

export default class WatchlistController {
    async add(req, res, next) {
        try {
            if (!Array.isArray(req.body)) {
                return res.status(400).json({ error: "Request body must be an array" });
            }

            const details = [];
            const normalized = req.body.map((movie, index) => {
                const imdbId = movie?.imdbId;
                if (!imdbId) details.push({ field: "imdbId", message: "imdbId is required", index });
                else if (!validateImdbId(imdbId)) details.push({ field: "imdbId", message: "Invalid IMDb ID format", index });

                if (movie?.myRating !== undefined && !validateRating(movie.myRating)) {
                    details.push({ field: "myRating", message: "myRating must be between 1 and 10", index });
                }

                if (movie?.watched !== undefined && typeof movie.watched !== "boolean") {
                    details.push({ field: "watched", message: "watched must be boolean", index });
                }

                return {
                    imdbId,
                    myRating: movie?.myRating ?? null,
                    watched: movie?.watched ?? false,
                };
            });

            if (details.length) {
                return res.status(400).json({ error: "Validation failed", details });
            }

            const { created, conflicts } = await addToWatchlist(normalized);

            if (conflicts.length) {
                return res.status(409).json({ error: "Conflict", details: conflicts });
            }

            return res.status(201).json(
                created.map((r) => ({
                    id: r.id,
                    imdbId: r.imdbId,
                    myRating: r.myRating,
                    watched: r.watched,
                    dateAdded: r.dateAdded,
                }))
            );
        } catch (err) {
            next(err);
        }
    }

    async list(req, res, next) {
        try {
            const sort = req.query.sort || "dateAdded";
            const order = req.query.order || "desc";
            const filter = req.query.filter;

            const watchedParsed = req.query.watched !== undefined ? parseBooleanQuery(req.query.watched) : undefined;
            if (watchedParsed === "invalid") {
                return res.status(400).json({ error: "watched must be true or false" });
            }

            const data = await listWatchlist(
                { sort, order, filter, watched: watchedParsed },
                fetch
            );

            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    async getOne(req, res, next) {
        try {
            const { imdbId } = req.params;
            if (!validateImdbId(imdbId)) {
                return res.status(400).json({ error: "Invalid IMDb ID format" });
            }

            const item = await getOneWatchlist(imdbId);
            if (!item) {
                return res.status(404).json({ error: "Movie not found in watchlist" });
            }

            return res.status(200).json(item);
        } catch (err) {
            next(err);
        }
    }


    async patch(req, res, next) {
        try {
            const { imdbId } = req.params;

            if (req.body?.imdbId !== undefined) {
                return res.status(400).json({ error: "imdbId cannot be modified" });
            }

            if (!validateImdbId(imdbId)) {
                return res.status(400).json({ error: "Invalid IMDb ID format" });
            }

            const hasMyRating = req.body?.myRating !== undefined;
            const hasWatched = req.body?.watched !== undefined;

            if (!hasMyRating && !hasWatched) {
                return res.status(400).json({ error: "Request must contain myRating or watched" });
            }
            if (hasMyRating && !validateRating(req.body.myRating)) {
                return res.status(400).json({ error: "myRating must be between 1 and 10" });
            }
            const watchedParsed = req.body?.watched !== undefined ? parseBooleanQuery(req.body.watched) : undefined;
            if (hasWatched && watchedParsed === "invalid") {
                return res.status(400).json({ error: "watched must be boolean" });
            }

            const updated = await updateWatchlist(imdbId, {
                myRating: hasMyRating ? (req.body.myRating ?? null) : undefined,
                watched: hasWatched ? req.body.watched : undefined,
            });

            if (!updated) {
                return res.status(404).json({ error: "Movie not found in watchlist" });
            }

            return res.status(200).json({
                id: updated.id,
                imdbId: updated.imdbId,
                myRating: updated.myRating,
                watched: updated.watched,
                dateAdded: updated.dateAdded,
                lastUpdated: updated.lastUpdated,
            });
        } catch (err) {
            next(err);
        }
    }

    async remove(req, res, next) {
        try {
            const { imdbId } = req.params;
            if (!validateImdbId(imdbId)) {
                return res.status(400).json({ error: "Invalid IMDb ID format" });
            }

            const ok = await deleteWatchlist(imdbId);
            if (!ok) {
                return res.status(404).json({ error: "Movie not found in watchlist" });
            }

            return res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

}