import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import StatisticsDashboard from "../../../src/components/Watchlist/Statistics/StatisticsDashboard";

vi.mock("../../../src/components/Watchlist/compute.helper", () => ({
    computeWatchlistStats: vi.fn(() => ({
        total: 10,
        watchedCount: 4,
        unwatchedCount: 6,
        progress: 40,
        avgRating: 7.5,
        totalRuntimeHours: 25,
        byType: { movies: 8, series: 2, other: 0 },
    })),
}));

describe("StatisticsDashboard", () => {
    it("Should render stats and chips", () => {
        render(<StatisticsDashboard watchlist={[]} />);

        expect(screen.getByText(/Statistics Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText("Total")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();

        expect(screen.getByText(/4\/10 watched/i)).toBeInTheDocument();
        expect(screen.getByText(/40%/i)).toBeInTheDocument();

        expect(screen.getByText(/Movies: 8/i)).toBeInTheDocument();
        expect(screen.getByText(/Series: 2/i)).toBeInTheDocument();
    });
});
