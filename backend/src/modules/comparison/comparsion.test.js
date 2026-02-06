import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

import comparisonRoutes from "./comparsion.router.js";
import { errorHandler } from "../../middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/compare", comparisonRoutes.router);
app.use(errorHandler);

describe("Movie Comparison", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should compare movies successfully", async () => {
        global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    Title: "The Shawshank Redemption",
                    imdbID: "tt0111161",
                    imdbRating: "9.3",
                    Year: "1994",
                    Runtime: "142 min",
                    Genre: "Drama",
                    Metascore: "82",
                    BoxOffice: "$28,767,189",
                    Director: "Frank Darabont",
                    Actors: "Tim Robbins, Morgan Freeman",
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    Title: "The Dark Knight",
                    imdbID: "tt0468569",
                    imdbRating: "9.0",
                    Year: "2008",
                    Runtime: "152 min",
                    Genre: "Action, Crime, Drama",
                    Metascore: "84",
                    BoxOffice: "$534,987,076",
                    Director: "Christopher Nolan",
                    Actors: "Christian Bale, Heath Ledger",
                }),
            });


        const res = await request(app)
            .post("/api/compare")
            .send({
                imdbIds: ["tt0111161", "tt0468569"],
            });

        expect(res.status).toBe(200);
        expect(res.body.movieCount).toBe(2);
        expect(res.body).toHaveProperty("comparison");
    });

    it("should fail with duplicate IDs", async () => {
        const res = await request(app)
            .post("/api/compare")
            .send({
                imdbIds: ["tt0111161", "tt0111161"],
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Duplicate IMDb IDs");
    });

    it("should fail when movie not found", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                error: "One or more movies not found",
                missing: [
                    "tt3322999"
                ]
            }),
        });

        global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    Title: "The Shawshank Redemption",
                    imdbID: "tt0111161",
                    imdbRating: "9.3",
                    Year: "1994",
                    Runtime: "142 min",
                    Genre: "Drama",
                    Metascore: "82",
                    BoxOffice: "$28,767,189",
                    Director: "Frank Darabont",
                    Actors: "Tim Robbins, Morgan Freeman",
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    Response: "False",
                    Error: "Error getting data."
                }),
            });


        const res = await request(app)
            .post("/api/compare")
            .send({
                imdbIds: ["tt0111161", "tt3322999"],
            });
        expect(res.status).toBe(404);
        expect(res.body.missing).toContain("tt3322999");
    });
});
