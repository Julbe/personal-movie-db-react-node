import { expect, jest } from "@jest/globals";
import request from "supertest";
import express from "express";

describe("Recent Comparisons", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it("should compare movies successfully", async () => {
        const ComparisonMock = {
            create: jest.fn().mockResolvedValue({}),
            findAll: jest.fn().mockResolvedValue([
                {
                    imdbIds: ["tt0111161", "tt0468569"],
                    movieCount: 2,
                    comparedAt: new Date().toISOString(),
                },
            ]),
        };

        jest.unstable_mockModule("./comparsion.model.js", () => ({
            Comparison: ComparisonMock,
        }));

        const compareRoutes = await import("../compare/compare.router.js");
        const comparisonRoutes = await import("./comparsions.router.js");
        const { errorHandler } = await import("../../middleware/errorHandler.js");

        const app = express();
        app.use(express.json());
        app.use("/api/compare", compareRoutes.default.router ?? compareRoutes.router);
        app.use("/api/comparisons", comparisonRoutes.default.router ?? comparisonRoutes.router);
        app.use(errorHandler);

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
            .send({ imdbIds: ["tt0111161", "tt0468569"] });

        const comparisons = await request(app).get("/api/comparisons/recent");

        expect(res.status).toBe(200);
        expect(res.body.movieCount).toBe(2);
        expect(res.body).toHaveProperty("comparison");

        expect(comparisons.status).toBe(200);
        expect(comparisons.body[0]).toEqual(
            expect.objectContaining({
                imdbIds: expect.any(Array),
                movieCount: expect.any(Number),
                comparedAt: expect.any(String),
            })
        );
        expect(ComparisonMock.create).toHaveBeenCalled();
        expect(ComparisonMock.findAll).toHaveBeenCalled();
    });
});
