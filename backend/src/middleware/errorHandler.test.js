import request from "supertest";
import express from "express";
import { errorHandler } from "./errorHandler.js";
import { wrapResponse } from "./wrapResponse.js";
import { jest } from "@jest/globals";

describe("errorHandler middleware", () => {
    it("should handle errors and return 500", async () => {
        const app = express();

        app.use(express.json());
        app.use(wrapResponse);

        app.get("/error", (req, res, next) => {
            const err = new Error("Test error");
            next(err);
        });

        app.use(errorHandler);

        const res = await request(app).get("/error");

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Test error");
    });
});
