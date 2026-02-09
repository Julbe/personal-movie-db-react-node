import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ComparePage from "../../src/pages/ComparePage";

vi.mock("../../src/context/WatchlistContext", () => ({
    useWatchlist: vi.fn(),
}));
import { useWatchlist } from "../../src/context/WatchlistContext";

vi.mock("../../src/api/comparisons.api", () => ({
    comparisonsApi: {
        create: vi.fn(),
    },
}));
import { comparisonsApi } from "../../src/api/comparisons.api";

vi.mock("../../src/components/Watchlist/Statistics/ComparisonsCharts", () => ({
    default: ({ chartRows }) => <div data-testid="charts">charts:{chartRows?.length ?? 0}</div>,
}));

vi.mock("../../src/components/Comparsions/AddMovieModal", () => ({
    default: ({ open, onSelect, onClose }) => (
        <div data-testid="add-modal">
            open:{String(open)}
            <button
                onClick={() =>
                    onSelect({
                        Title: "New Movie",
                        imdbID: "ttNEW",
                        Poster: "new.jpg",
                    })
                }
            >
                pick-movie
            </button>
            <button onClick={onClose}>close-add</button>
        </div>
    ),
}));

describe("ComparePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        comparisonsApi.create.mockResolvedValue({
            movies: [
                {
                    Title: "Movie A",
                    imdbID: "tt1",
                    imdbRating: "9.0",
                    Year: "2000",
                    Runtime: "120 min",
                    Metascore: "80",
                    BoxOffice: "$100,000,000",
                },
                {
                    Title: "Movie B",
                    imdbID: "tt2",
                    imdbRating: "8.0",
                    Year: "2002",
                    Runtime: "90 min",
                    Metascore: "70",
                    BoxOffice: "$50,000,000",
                },
            ],
            comparison: {
                ratings: {
                    highest: { title: "Movie A", rating: 9.0 },
                    lowest: { title: "Movie B", rating: 8.0 },
                    average: "8.5",
                    range: "1.0",
                },
                runtime: {
                    longest: { title: "Movie A", runtime: "120 min" },
                    shortest: { title: "Movie B", runtime: "90 min" },
                    average: "105 min",
                },
                boxOffice: {
                    highest: { title: "Movie A", amount: "$100,000,000" },
                    lowest: { title: "Movie B", amount: "$50,000,000" },
                    total: "$150,000,000",
                    average: "$75,000,000",
                },
                releaseYears: {
                    oldest: { title: "Movie A", year: 2000 },
                    newest: { title: "Movie B", year: 2002 },
                    span: "2 years",
                },
                metascore: {
                    highest: { title: "Movie A", score: 80 },
                    lowest: { title: "Movie B", score: 70 },
                    average: "75",
                    range: "10",
                },
            },
        });
    });

    it("Should show empty state when compareList is empty", () => {
        useWatchlist.mockReturnValue({
            compareList: [],
            addToCompare: vi.fn(),
            removeFromCompare: vi.fn(),
            clearCompare: vi.fn(),
        });

        render(<ComparePage />);

        expect(screen.getByText(/No movies selected yet/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /compare/i })).toBeDisabled();
        expect(screen.getByText(/Selected Movies \(0\)/i)).toBeInTheDocument();
    });

    it("Should disable Compare button when compareList has less than 2 movies", () => {
        useWatchlist.mockReturnValue({
            compareList: [{ imdbID: "tt1", Title: "A", Poster: "a.jpg" }],
            addToCompare: vi.fn(),
            removeFromCompare: vi.fn(),
            clearCompare: vi.fn(),
        });

        render(<ComparePage />);
        expect(screen.getByRole("button", { name: /compare/i })).toBeDisabled();
    });

    it("Should call comparisonsApi.create with imdbIds when clicking Compare", async () => {
        useWatchlist.mockReturnValue({
            compareList: [
                { imdbID: "tt1", Title: "A", Poster: "a.jpg" },
                { imdbID: "tt2", Title: "B", Poster: "b.jpg" },
            ],
            addToCompare: vi.fn(),
            removeFromCompare: vi.fn(),
            clearCompare: vi.fn(),
        });

        render(<ComparePage />);

        fireEvent.click(screen.getByRole("button", { name: /^compare$/i }));

        await waitFor(() => {
            expect(comparisonsApi.create).toHaveBeenCalledWith({ imdbIds: ["tt1", "tt2"] });
        });

        expect(screen.getByText(/Ratings/i)).toBeInTheDocument();
        expect(screen.getByTestId("charts")).toHaveTextContent("charts:2");
    });

    it("Should call handleRemove when clicking remove button on a selected movie", () => {
        const removeFromCompare = vi.fn();
        const movie = { imdbID: "tt1", Title: "A", Poster: "a.jpg" };

        useWatchlist.mockReturnValue({
            compareList: [movie],
            addToCompare: vi.fn(),
            removeFromCompare,
            clearCompare: vi.fn(),
        });

        render(<ComparePage />);

        fireEvent.click(screen.getByRole("button", { name: "remove-tt1" }));
        expect(removeFromCompare).toHaveBeenCalledWith("tt1");
    });

    it("Should open AddMovieModal when clicking Add Movie slot and addToCompare when selecting", () => {
        const addToCompare = vi.fn();

        useWatchlist.mockReturnValue({
            compareList: [
                { imdbID: "tt1", Title: "A", Poster: "a.jpg" },
                { imdbID: "tt2", Title: "B", Poster: "b.jpg" },
            ],
            addToCompare,
            removeFromCompare: vi.fn(),
            clearCompare: vi.fn(),
        });

        render(<ComparePage />);
        fireEvent.click(screen.getByText(/Add Movie/i));
        expect(screen.getByTestId("add-modal")).toHaveTextContent("open:true");

        fireEvent.click(screen.getByText("pick-movie"));
        expect(addToCompare).toHaveBeenCalledWith({
            Poster: "new.jpg",
            Title: "New Movie",
            imdbID: "ttNEW",
        });
    });
});
