import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import movieRoutes from "./movie.router.js";
import { wrapResponse } from "../../middleware/wrapResponse.js";
import { errorHandler } from "../../middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(wrapResponse);
app.use("/api/movie", movieRoutes.router);
app.use(errorHandler
);

describe("Movie module", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return movie data for a valid imdbId", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                Title: "Inception",
                Year: "2010",
                imdbID: "tt1375666",
                Response: "True",
            }),
        });

        const res = await request(app).get("/api/movie/tt1375666");

        expect(res.status).toBe(200);
        expect(res.body.Title).toBe("Inception");
        expect(res.body.imdbID).toBe("tt1375666");
    });

    it("should return 400 for invalid imdbId format", async () => {
        const res = await request(app).get("/api/movie/123");

        expect(res.status).toBe(400);
        expect(res.body.Response).toBe("False");
    });

    it("should return 404 if movie is not found", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                Response: "False",
                Error: "Movie not found!",
            }),
        });

        const res = await request(app).get("/api/movie/tt0000000");

        expect(res.status).toBe(404);
        expect(res.body.Response).toBe("False");
    });
});
