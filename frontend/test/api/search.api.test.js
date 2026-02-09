import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchMovies } from "../../src/api/search.api.js";

describe("searchMovies (search.api.js)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("Should return [] when query is empty", async () => {
        const res = await searchMovies("");
        expect(res).toEqual([]);
    });

    it("Should call fetch with encoded query", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue({ Response: "True", Search: [{ imdbID: "tt1" }] }),
        });

        const res = await searchMovies("bat man");
        expect(global.fetch).toHaveBeenCalledTimes(1);

        const [url] = global.fetch.mock.calls[0];
        expect(String(url)).toContain("/search?s=bat%20man");

        expect(res).toEqual([{ imdbID: "tt1" }]);
    });

    it("Should throw when OMDb returns Response False", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue({ Response: "False", Error: "Movie not found!" }),
        });

        await expect(searchMovies("xxxx")).rejects.toThrow("Movie not found!");
    });

    it("Should return [] when Search is missing", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue({ Response: "True" }),
        });

        const res = await searchMovies("batman");
        expect(res).toEqual([]);
    });
});
