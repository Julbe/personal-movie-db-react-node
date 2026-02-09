import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/api/client.js", () => ({
    apiFetch: vi.fn(),
}));

import { apiFetch } from "../../src/api/client.js";
import { moviesApi } from "../../src/api/movies.api.js";

describe("moviesApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        apiFetch.mockResolvedValue({ Title: "X" });
    });

    it("Should call details with imdbId", async () => {
        await moviesApi.details("tt123");
        expect(apiFetch).toHaveBeenCalledWith("/movie/tt123");
    });
});
