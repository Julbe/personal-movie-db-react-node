import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import WatchlistSection from "../../../src/components/Watchlist/WatchlistSection";


vi.mock("../../../src/context/WatchlistContext", () => ({
    useWatchlist: vi.fn(),
}));

vi.mock("../../../src/components/Movie/MovieItemCard", () => ({
    default: ({ item, onClick }) => (
        <button data-testid={`movie-card-${item.imdbId}`} onClick={onClick}>
            {item.title ?? item.imdbId}
        </button>
    ),
}));

import { useWatchlist } from "../../../src/context/WatchlistContext";

describe("WatchlistSection", () => {
    it("Should render loading skeletons when loading", () => {
        useWatchlist.mockReturnValue({
            items: [{ imdbId: "a" }, { imdbId: "b" }],
            loading: true,
            toggle: vi.fn(),
        });

        const { container } = render(<WatchlistSection />);

        expect(container.querySelectorAll(".MuiSkeleton-root").length).toBeGreaterThan(0);
    });

    it("Should show empty message when no items", () => {
        useWatchlist.mockReturnValue({
            items: [],
            loading: false,
            toggle: vi.fn(),
        });

        render(<WatchlistSection />);
        expect(
            screen.getByText(/Your watchlist is empty/i)
        ).toBeInTheDocument();
    });

    it("Should renders up to 3 preview items and calls onSelectMovie", () => {
        useWatchlist.mockReturnValue({
            items: [
                { imdbId: "tt1", title: "A" },
                { imdbId: "tt2", title: "B" },
                { imdbId: "tt3", title: "C" },
                { imdbId: "tt4", title: "D" },
            ],
            loading: false,
            toggle: vi.fn(),
        });

        const onSelectMovie = vi.fn();

        render(<WatchlistSection onSelectMovie={onSelectMovie} />);


        expect(screen.getByTestId("movie-card-tt1")).toBeInTheDocument();
        expect(screen.getByTestId("movie-card-tt2")).toBeInTheDocument();
        expect(screen.getByTestId("movie-card-tt3")).toBeInTheDocument();
        expect(screen.queryByTestId("movie-card-tt4")).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId("movie-card-tt2"));
        expect(onSelectMovie).toHaveBeenCalledWith("tt2");
    });

    it("Should call onViewAll when clicking View all", () => {
        useWatchlist.mockReturnValue({
            items: [],
            loading: false,
            toggle: vi.fn(),
        });

        const onViewAll = vi.fn();
        render(<WatchlistSection onViewAll={onViewAll} />);

        fireEvent.click(screen.getByRole("button", { name: /view all/i }));
        expect(onViewAll).toHaveBeenCalledTimes(1);
    });
});
