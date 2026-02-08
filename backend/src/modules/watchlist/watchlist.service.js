import { WatchlistItem } from "../../db/models/watchlistItem.model.js";
import { fetchMovieById } from "../movie/movie.service.js";


function adapterToOmdbLite(omdb) {
    return {
        title: omdb?.Title,
        year: omdb?.Year,
        poster: omdb?.Poster,
        type: omdb?.Type,
        plot: omdb?.Plot,
        director: omdb?.Director,
        imdbRating: omdb?.imdbRating,
        genre: omdb?.Genre,
        rated: omdb?.Rated,
        runtime: omdb?.Runtime,
        actors: omdb?.Actors,
    };
}

export async function addToWatchlist(movies) {
    const created = [];
    const conflicts = [];

    for (let index = 0; index < movies.length; index++) {
        const movie = movies[index];

        const exists = await WatchlistItem.findOne({ where: { imdbId: movie.imdbId } });
        if (exists) {
            conflicts.push({ imdbId: movie.imdbId, message: "Movie already in watchlist" });
            continue;
        }

        const row = await WatchlistItem.create({
            imdbId: movie.imdbId,
            myRating: movie.myRating ?? null,
            watched: movie.watched ?? false,
            dateAdded: new Date(),
            lastUpdated: null,
        });

        created.push(row);
    }
    return { created, conflicts };
}


export async function listWatchlist({ sort, order, filter, watched }) {
    const where = {};
    if (watched !== undefined) where.watched = watched;

    const dbRows = await WatchlistItem.findAll({ where });

    const enriched = await Promise.all(
        dbRows.map(async (row) => {
            const omdbRaw = await fetchMovieById(row.imdbId);
            const lite = omdbRaw ? adapterToOmdbLite(omdbRaw) : {};

            return {
                id: row.id,
                imdbId: row.imdbId,
                myRating: row.myRating,
                watched: row.watched,
                dateAdded: row.dateAdded,
                lastUpdated: row.lastUpdated,
                ...lite,
            };
        })
    );
    // filter by type with filter var
    const filtered = filter ? enriched.filter((x) => x.type === filter) : enriched;

    // sort config
    const dir = order === "asc" ? 1 : -1;
    const key = sort || "dateAdded";

    filtered.sort((a, b) => {
        const av =
            key === "dateAdded" ? new Date(a.dateAdded).getTime()
                : key === "title" ? (a.title || "")
                    : key === "year" ? (a.year || "")
                        : key === "rating" ? Number(a.imdbRating || 0)
                            : key === "myRating" ? Number(a.myRating || 0)
                                : new Date(a.dateAdded).getTime();

        const bv =
            key === "dateAdded" ? new Date(b.dateAdded).getTime()
                : key === "title" ? (b.title || "")
                    : key === "year" ? (b.year || "")
                        : key === "rating" ? Number(b.imdbRating || 0)
                            : key === "myRating" ? Number(b.myRating || 0)
                                : new Date(b.dateAdded).getTime();

        if (typeof av === "string") return av.localeCompare(bv) * dir;
        return (av - bv) * dir;
    });

    return filtered;
}


export async function getOneWatchlist(imdbId) {
    const row = await WatchlistItem.findOne({ where: { imdbId } });
    if (!row) return null;

    const omdbRaw = await fetchMovieById(imdbId);
    const lite = omdbRaw ? adapterToOmdbLite(omdbRaw) : {};

    return {
        id: row.id,
        imdbId: row.imdbId,
        myRating: row.myRating,
        watched: row.watched,
        dateAdded: row.dateAdded,
        lastUpdated: row.lastUpdated,
        ...lite,
    };
}

export async function updateWatchlist(imdbId, { myRating, watched }) {
    const row = await WatchlistItem.findOne({ where: { imdbId } });
    if (!row) return null;

    const update = {};
    if (myRating !== undefined) update.myRating = myRating;
    if (watched !== undefined) update.watched = watched;

    update.lastUpdated = new Date();

    await row.update(update);
    return row;
}

export async function deleteWatchlist(imdbId) {
    const row = await WatchlistItem.findOne({ where: { imdbId } });
    if (!row) return false;
    await row.destroy();
    return true;
}