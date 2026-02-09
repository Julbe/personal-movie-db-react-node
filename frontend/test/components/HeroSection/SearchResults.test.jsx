import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchResults from "../../../src/components/HeroSection/SearchResults";


vi.mock("../../../src/context/WatchlistContext", () => ({
    useWatchlist: vi.fn(),
}));

vi.mock("../../../src/components/Movie/MovieItem", () => ({
    default: ({ movie, isInWatchlist, onQuickAdd, onSelect, saving, selectMode }) => (
        <div data-testid={`movie-${movie.imdbID}`}>
            <div>id:{movie.imdbID}</div>
            <div>inWatchlist:{String(isInWatchlist)}</div>
            <div>saving:{String(saving)}</div>
            <div>selectMode:{String(selectMode)}</div>

            <button onClick={() => onSelect(movie)}>select</button>
            <button onClick={() => onQuickAdd(movie)}>quick-add</button>
        </div>
    ),
}));

import { useWatchlist } from "../../../src/context/WatchlistContext";

describe("SearchResults", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Should render at most 10 results", () => {
        useWatchlist.mockReturnValue({
            isInWatchlist: vi.fn(() => false),
            toggle: vi.fn(),
        });

        const results = Array.from({ length: 12 }).map((_, i) => ({
            imdbID: `tt${i}`,
            Title: `M${i}`,
        }));

        render(<SearchResults results={results} onSelectMovie={() => { }} />);

        // Solo 10
        expect(screen.getAllByTestId(/movie-tt/)).toHaveLength(10);
        expect(screen.queryByTestId("movie-tt10")).not.toBeInTheDocument();
        expect(screen.queryByTestId("movie-tt11")).not.toBeInTheDocument();
    });

    it("Should pass isInWatchlist(imdbID) result into MovieItem", () => {
        const isInWatchlist = vi.fn((id) => id === "tt1");
        useWatchlist.mockReturnValue({
            isInWatchlist,
            toggle: vi.fn(),
        });

        const results = [
            { imdbID: "tt1", Title: "A" },
            { imdbID: "tt2", Title: "B" },
        ];

        render(<SearchResults results={results} onSelectMovie={() => { }} />);

        expect(isInWatchlist).toHaveBeenCalledWith("tt1");
        expect(isInWatchlist).toHaveBeenCalledWith("tt2");

        expect(screen.getByText("inWatchlist:true")).toBeInTheDocument();
        expect(screen.getByText("inWatchlist:false")).toBeInTheDocument();
    });

    it("Should call toggle(imdbID) when quick add is clicked", async () => {
        const toggle = vi.fn().mockResolvedValue(undefined);

        useWatchlist.mockReturnValue({
            isInWatchlist: vi.fn(() => false),
            toggle,
        });

        const results = [{ imdbID: "ttX", Title: "X" }];

        render(<SearchResults results={results} onSelectMovie={() => { }} />);

        fireEvent.click(screen.getByText("quick-add"));

        await waitFor(() => {
            expect(toggle).toHaveBeenCalledWith("ttX");
        });
    });

    it("Should forward selectMode to MovieItem", () => {
        useWatchlist.mockReturnValue({
            isInWatchlist: vi.fn(() => false),
            toggle: vi.fn(),
        });

        render(<SearchResults results={[{ imdbID: "tt1", Title: "A" }]} selectMode={true} />);
        expect(screen.getByText("selectMode:true")).toBeInTheDocument();
    });
});
