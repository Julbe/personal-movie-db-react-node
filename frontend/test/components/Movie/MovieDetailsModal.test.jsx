import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MovieDetailsModal from "../../../src/components/Movie/MovieDetailsModal";

vi.mock("../../../src/hooks/useMovieDetails.jsx", () => ({
    useMovieDetails: vi.fn(),
}));

vi.mock("../../../src/context/WatchlistContext.jsx", () => ({
    useWatchlist: vi.fn(),
}));

import { useMovieDetails } from "../../../src/hooks/useMovieDetails.jsx";
import { useWatchlist } from "../../../src/context/WatchlistContext.jsx";

describe("MovieDetailsModal", () => {
    const imdbId = "tt0372784";

    const details = {
        Title: "Batman Begins",
        Year: "2005",
        Poster: "https://img.jpg",
        Genre: "Action",
        Runtime: "140 min",
        Rated: "PG-13",
        imdbRating: "8.2",
        Plot: "Plot here",
        Director: "Christopher Nolan",
        Writer: "Nolan",
        Actors: "Christian Bale, Michael Caine",
        Language: "English",
        Country: "USA",
        BoxOffice: "$206,863,479",
        Awards: "Some awards",
        Released: "2005-06-15",
        Ratings: [{ Source: "Rotten Tomatoes", Value: "84%" }],
    };

    const setupMocks = ({
        movieDetails = { data: details, loading: false, error: null },
        watchlist = {
            isInWatchlist: vi.fn(() => false),
            getItem: vi.fn(() => null),
            toggle: vi.fn(),
            update: vi.fn(),
        },
    } = {}) => {
        useMovieDetails.mockReturnValue(movieDetails);
        useWatchlist.mockReturnValue(watchlist);
        return watchlist;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Should show loading state when loading is true", () => {
        setupMocks({
            movieDetails: { data: null, loading: true, error: null },
        });

        render(<MovieDetailsModal open={true} imdbId={imdbId} onClose={() => { }} />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("Should show error alert when hook returns error", () => {
        setupMocks({
            movieDetails: { data: null, loading: false, error: new Error("boom") },
        });

        render(<MovieDetailsModal open={true} imdbId={imdbId} onClose={() => { }} />);
        expect(screen.getByText(/boom/i)).toBeInTheDocument();
    });

    it("Should render movie details when data is loaded", () => {
        setupMocks();

        render(<MovieDetailsModal open={true} imdbId={imdbId} onClose={() => { }} />);

        expect(screen.getByText(/Movie Details/i)).toBeInTheDocument();
        expect(screen.getByText(/Batman Begins/i)).toBeInTheDocument();
        expect(screen.getByText(/\(2005\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Plot here/i)).toBeInTheDocument();
        expect(screen.getByText(/Rotten Tomatoes/i)).toBeInTheDocument();
        expect(screen.getByText(/84%/i)).toBeInTheDocument();
    });

    it("Should call onClose when clicking the close icon", () => {
        setupMocks();
        const onClose = vi.fn();

        render(<MovieDetailsModal open={true} imdbId={imdbId} onClose={onClose} />);
        fireEvent.click(screen.getByLabelText(/close/i));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("Should call toggle when clicking Add button if not in watchlist", async () => {
        const wl = setupMocks({
            watchlist: {
                isInWatchlist: vi.fn(() => false),
                getItem: vi.fn(() => null),
                toggle: vi.fn().mockResolvedValue(undefined),
                update: vi.fn(),
            },
        });

        render(<MovieDetailsModal open={true} imdbId={imdbId} onClose={() => { }} />);

        fireEvent.click(screen.getByRole("button", { name: /^Add$/i }));
        await waitFor(() => expect(wl.toggle).toHaveBeenCalledWith(imdbId));
    });

    it("Should show watched checkbox when movie is in watchlist", () => {
        setupMocks({
            watchlist: {
                isInWatchlist: vi.fn(() => true),
                getItem: vi.fn(() => ({ watched: true })),
                toggle: vi.fn(),
                update: vi.fn(),
            },
        });

        render(<MovieDetailsModal open={true} imdbId={imdbId} onClose={() => { }} />);

        expect(screen.getByText(/Watched/i)).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("Should call update when toggling watched checkbox", async () => {
        const wl = setupMocks({
            watchlist: {
                isInWatchlist: vi.fn(() => true),
                getItem: vi.fn(() => ({ watched: false })),
                toggle: vi.fn(),
                update: vi.fn().mockResolvedValue(undefined),
            },
        });

        render(<MovieDetailsModal open={true} imdbId={imdbId} onClose={() => { }} />);

        const cb = screen.getByRole("checkbox");
        fireEvent.click(cb);

        await waitFor(() => {
            expect(wl.update).toHaveBeenCalledWith(imdbId, { watched: true });
        });
    });

    it("Should call onCompare with loaded data and close modal when clicking Compare", () => {
        setupMocks();
        const onCompare = vi.fn();
        const onClose = vi.fn();

        render(
            <MovieDetailsModal
                open={true}
                imdbId={imdbId}
                onClose={onClose}
                onCompare={onCompare}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /^Compare$/i }));

        expect(onCompare).toHaveBeenCalledWith(details);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
