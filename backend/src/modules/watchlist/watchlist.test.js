import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

describe("Watchlist Management", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    async function makeApp() {
        const watchlistModule = await import("./watchlist.router.js");
        const { errorHandler } = await import("../../middleware/errorHandler.js");

        const app = express();
        app.use(express.json());

        const router = watchlistModule.router ?? watchlistModule.default?.router ?? watchlistModule.default;
        const PATH = watchlistModule.path ?? "/watchlist";

        app.use(`/api${PATH}`, router);

        app.use(errorHandler);
        return app;
    }

    it("Should fail when body is not array", async () => {
        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: jest.fn(),
            listWatchlist: jest.fn(),
            getOneWatchlist: jest.fn(),
            updateWatchlist: jest.fn(),
            deleteWatchlist: jest.fn(),
        }));

        const app = await makeApp();

        const res = await request(app)
            .post("/api/watchlist/")
            .send({ imdbId: "tt0372784" });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Request body must be an array" });
    });

    it("POST - Should fail when imdbId is missing", async () => {
        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: jest.fn(),
            listWatchlist: jest.fn(),
            getOneWatchlist: jest.fn(),
            updateWatchlist: jest.fn(),
            deleteWatchlist: jest.fn(),
        }));

        const app = await makeApp();

        const res = await request(app)
            .post("/api/watchlist")
            .send([{ myRating: 7 }]);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Validation failed");
        expect(res.body.details[0]).toMatchObject({
            field: "imdbId",
            message: "imdbId is required",
            index: 0,
        });
    });

    it("POST- Should fail when item already exists", async () => {
        const addToWatchlistMock = jest.fn().mockResolvedValue({
            created: [],
            conflicts: [{ imdbId: "tt0372784", message: "Movie already in watchlist" }],
        });

        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: addToWatchlistMock,
            listWatchlist: jest.fn(),
            getOneWatchlist: jest.fn(),
            updateWatchlist: jest.fn(),
            deleteWatchlist: jest.fn(),
        }));

        const app = await makeApp();

        const res = await request(app)
            .post("/api/watchlist")
            .send([{ imdbId: "tt0372784" }]);

        expect(res.status).toBe(409);
        expect(res.body.error).toBe("Conflict");
        expect(res.body.details[0]).toMatchObject({
            imdbId: "tt0372784",
            message: "Movie already in watchlist",
        });

        expect(addToWatchlistMock).toHaveBeenCalledTimes(1);
    });

    it("POST - Should pass when add new imdbId in wathclist", async () => {
        const addToWatchlistMock = jest.fn().mockResolvedValue({
            created: [
                {
                    id: 1,
                    imdbId: "tt0372784",
                    myRating: null,
                    watched: false,
                    dateAdded: new Date().toISOString(),
                },
            ],
            conflicts: [],
        });

        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: addToWatchlistMock,
            listWatchlist: jest.fn(),
            getOneWatchlist: jest.fn(),
            updateWatchlist: jest.fn(),
            deleteWatchlist: jest.fn(),
        }));

        const app = await makeApp();

        const res = await request(app)
            .post("/api/watchlist")
            .send([{ imdbId: "tt0372784" }]);

        expect(res.status).toBe(201);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toMatchObject({
            imdbId: "tt0372784",
            myRating: null,
            watched: false,
        });

        expect(addToWatchlistMock).toHaveBeenCalledTimes(1);
    });

    it("GET - Should pass when get list of watchlist", async () => {
        const listWatchlistMock = jest.fn().mockResolvedValue([
            {
                imdbId: "tt0372784",
                myRating: 8,
                watched: true,
                title: "Batman Begins",
                year: "2005",
                type: "movie",
            },
        ]);

        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: jest.fn(),
            listWatchlist: listWatchlistMock,
            getOneWatchlist: jest.fn(),
            updateWatchlist: jest.fn(),
            deleteWatchlist: jest.fn(),
        }));

        const app = await makeApp();

        const res = await request(app).get("/api/watchlist?sort=dateAdded&order=desc");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toMatchObject({
            imdbId: "tt0372784",
            title: "Batman Begins",
        });

        expect(listWatchlistMock).toHaveBeenCalledTimes(1);
    });

    it("GET - Should fail when is invalid imdbId format", async () => {
        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: jest.fn(),
            listWatchlist: jest.fn(),
            getOneWatchlist: jest.fn(),
            updateWatchlist: jest.fn(),
            deleteWatchlist: jest.fn(),
        }));

        const app = await makeApp();

        const res = await request(app).get("/api/watchlist/invalid");

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Invalid IMDb ID format" });
    });

    it("GET - Should fail when imdbId is not found in wathclist", async () => {
        const getOneMock = jest.fn().mockResolvedValue(null);

        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: jest.fn(),
            listWatchlist: jest.fn(),
            getOneWatchlist: getOneMock,
            updateWatchlist: jest.fn(),
            deleteWatchlist: jest.fn(),
        }));

        const app = await makeApp();

        const res = await request(app).get("/api/watchlist/tt0372784");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Movie not found in watchlist" });
        expect(getOneMock).toHaveBeenCalledTimes(1);
    });

    it("PATCH - Should fail when trying to modify imdbId", async () => {
        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: jest.fn(),
            listWatchlist: jest.fn(),
            getOneWatchlist: jest.fn(),
            updateWatchlist: jest.fn(),
            deleteWatchlist: jest.fn(),
        }));

        const app = await makeApp();

        const res = await request(app)
            .patch("/api/watchlist/tt0372784")
            .send({ imdbId: "tt0111161" });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "imdbId cannot be modified" });
    });

    it("PATCH - Should fail when imdbId is not found in wathclist", async () => {
        const updateMock = jest.fn().mockResolvedValue(null);

        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: jest.fn(),
            listWatchlist: jest.fn(),
            getOneWatchlist: jest.fn(),
            updateWatchlist: updateMock,
            deleteWatchlist: jest.fn(),
        }));

        const app = await makeApp();

        const res = await request(app)
            .patch("/api/watchlist/tt0372784")
            .send({ watched: true });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Movie not found in watchlist" });
        expect(updateMock).toHaveBeenCalledTimes(1);
    });

    it("PATCH - Should pass when updates successfully", async () => {
        const updateMock = jest.fn().mockResolvedValue({
            id: 1,
            imdbId: "tt0372784",
            myRating: 7,
            watched: true,
            dateAdded: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
        });

        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: jest.fn(),
            listWatchlist: jest.fn(),
            getOneWatchlist: jest.fn(),
            updateWatchlist: updateMock,
            deleteWatchlist: jest.fn(),
        }));

        const app = await makeApp();

        const res = await request(app)
            .patch("/api/watchlist/tt0372784")
            .send({ watched: true, myRating: 7 });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            imdbId: "tt0372784",
            watched: true,
            myRating: 7,
        });
        expect(res.body.lastUpdated).toBeTruthy();
    });

    it("DELETE - Should pass when delete was successfully", async () => {
        const deleteMock = jest.fn().mockResolvedValue(true);

        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: jest.fn(),
            listWatchlist: jest.fn(),
            getOneWatchlist: jest.fn(),
            updateWatchlist: jest.fn(),
            deleteWatchlist: deleteMock,
        }));

        const app = await makeApp();

        const res = await request(app).delete("/api/watchlist/tt0372784");

        expect(res.status).toBe(204);
        expect(deleteMock).toHaveBeenCalledTimes(1);
    });

    it("DELETE - Should fail when imdbId is not found", async () => {
        const deleteMock = jest.fn().mockResolvedValue(false);

        jest.unstable_mockModule("./watchlist.service.js", () => ({
            addToWatchlist: jest.fn(),
            listWatchlist: jest.fn(),
            getOneWatchlist: jest.fn(),
            updateWatchlist: jest.fn(),
            deleteWatchlist: deleteMock,
        }));

        const app = await makeApp();
        const res = await request(app).delete("/api/watchlist/tt0372784");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Movie not found in watchlist" });
        expect(deleteMock).toHaveBeenCalledTimes(1);
    });
});
