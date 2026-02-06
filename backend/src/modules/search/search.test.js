import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

import searchRoutes from "./search.router.js";
import { errorHandler } from "../../middleware/errorHandler.js";
import { wrapResponse } from "../../middleware/wrapResponse.js";

const app = express();

app.use(express.json());
app.use(wrapResponse);
app.use("/api/search", searchRoutes.router);
app.use(errorHandler);

describe("Search module", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return search results", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                Search: [
                    { Title: "Batman Begins", imdbID: "tt0372784" },
                ],
                totalResults: "1",
                Response: "True",
            }),
        });

        const res = await request(app).get(
            "/api/search?s=batman&page=1"
        );

        expect(res.status).toBe(200);
        expect(res.body.Response).toBe("True");
        expect(res.body.Search.length).toBe(1);
    });

    it("should return 400 for invalid search term", async () => {
        const res = await request(app).get("/api/search");

        expect(res.status).toBe(400);
        expect(res.body.Response).toBe("False");
    });

    it("should return 404 if no results found", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                Response: "False",
                Error: "Movie not found!",
            }),
        });

        const res = await request(app).get(
            "/api/search?s=asdasdasd"
        );

        expect(res.status).toBe(404);
    });
});
