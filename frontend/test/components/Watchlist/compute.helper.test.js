import { describe, it, expect } from "vitest";
import { colorFromId, computeWatchlistStats } from "../../../src/components/Watchlist/compute.helper";

describe("computeWatchlistStats", () => {
    it("Should returns zeros/nulls for empty list", () => {
        const s = computeWatchlistStats([]);
        expect(s.total).toBe(0);
        expect(s.watchedCount).toBe(0);
        expect(s.unwatchedCount).toBe(0);
        expect(s.progress).toBe(0);
        expect(s.avgRating).toBe(null);
        expect(s.totalRuntimeHours).toBe(0.0);
        expect(s.byType).toEqual({ movies: 0, series: 0, other: 0 });
    });

    it("Should compute watched/unwatched and progress", () => {
        const s = computeWatchlistStats([
            { watched: true },
            { watched: false },
            { watched: true },
        ]);

        expect(s.total).toBe(3);
        expect(s.watchedCount).toBe(2);
        expect(s.unwatchedCount).toBe(1);
        expect(s.progress).toBe(67); // round(2/3*100)=66.6 -> 67
    });

    it("Should compute avg rating with 1 decimal and ignores non-numbers", () => {
        const s = computeWatchlistStats([
            { myRating: 10 },
            { myRating: "8" },
            { myRating: null },
            { myRating: undefined },
            { myRating: "bad" },
        ]);
        expect(s.avgRating).toBe(6.0);
    });

    it("Should compute total runtime hours from 'min' strings and numbers", () => {
        const s = computeWatchlistStats([
            { runtime: "60 min" },
            { runtime: "120 min" },
            { runtime: 30 },
            { runtime: "N/A" },
        ]);
        expect(s.totalRuntimeHours).toBe(3.5);
    });

    it("Should count byType movies/series/other case-insensitively", () => {
        const s = computeWatchlistStats([
            { type: "movie" },
            { type: "Movie" },
            { type: "series" },
            { type: "episode" },
            { type: "" },
            {},
        ]);

        expect(s.byType).toEqual({ movies: 2, series: 1, other: 3 });
    });
});

describe("colorFromId", () => {
    it("Should return stable hsl color for same id", () => {
        expect(colorFromId("tt0111161")).toBe(colorFromId("tt0111161"));
    });

    it("Should return hsl() string", () => {
        const c = colorFromId("tt0468569");
        expect(c.startsWith("hsl(")).toBe(true);
        expect(c.includes("%")).toBe(true);
    });
});
