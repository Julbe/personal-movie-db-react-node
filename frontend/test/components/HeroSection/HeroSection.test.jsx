import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HeroSection from "../../../src/components/HeroSection/HeroSection";

const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => navigateMock,
}));

vi.mock("../../../src/context/WatchlistContext.jsx", () => ({
    useWatchlist: vi.fn(),
}));

import { useWatchlist } from "../../../src/context/WatchlistContext.jsx";


vi.mock("../../../src/components/HeroSection/SearchBar", () => ({
    default: ({ onResults, onLoading, onError }) => (
        <div>
            <button onClick={() => onLoading(true)}>set-loading-true</button>
            <button onClick={() => onLoading(false)}>set-loading-false</button>
            <button onClick={() => onError("Boom!")}>set-error</button>
            <button
                onClick={() =>
                    onResults([
                        { imdbID: "tt1", Title: "A" },
                        { imdbID: "tt2", Title: "B" },
                    ])
                }
            >
                set-results
            </button>
        </div>
    ),
}));

vi.mock("../../../src/components/HeroSection/SearchResults", () => ({
    default: ({ results, onSelectMovie }) => (
        <div>
            <div data-testid="results-count">{results?.length ?? 0}</div>
            <button onClick={() => onSelectMovie({ imdbID: "tt2", Title: "B", Poster: "p.jpg" })}>
                select-tt2
            </button>
        </div>
    ),
}));


vi.mock("../../../src/components/Movie/MovieDetailsModal.jsx", () => ({
    default: ({ open, imdbId, onClose, onCompare }) => (
        <div>
            <div data-testid="modal-open">{String(open)}</div>
            <div data-testid="modal-imdbId">{imdbId ?? ""}</div>
            <button onClick={onClose}>close-modal</button>
            <button onClick={() => onCompare({ imdbID: imdbId, Title: "B", Poster: "p.jpg" })}>
                compare-from-modal
            </button>
        </div>
    ),
}));

describe("HeroSection", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useWatchlist.mockReturnValue({
            addToCompare: vi.fn(),
        });
    });

    it("Should render header texts", () => {
        render(<HeroSection />);
        expect(screen.getByText(/Personal Movie DB/i)).toBeInTheDocument();
        expect(screen.getByText(/Search movies using IMDb data/i)).toBeInTheDocument();
    });

    it("Should show loading spinner when SearchBar sets loading true", () => {
        const { container } = render(<HeroSection />);

        fireEvent.click(screen.getByText("set-loading-true"));

        expect(screen.getByRole("progressbar")).toBeInTheDocument();

        fireEvent.click(screen.getByText("set-loading-false"));
        expect(container.querySelector('[role="progressbar"]')).toBeNull();
    });

    it("Should show error alert when SearchBar sets error", () => {
        render(<HeroSection />);
        fireEvent.click(screen.getByText("set-error"));
        expect(screen.getByText("Boom!")).toBeInTheDocument();
    });

    it("Should forward results into SearchResults", () => {
        render(<HeroSection />);
        fireEvent.click(screen.getByText("set-results"));
        expect(screen.getByTestId("results-count")).toHaveTextContent("2");
    });

    it("Should open MovieDetailsModal when selecting a movie from results", () => {
        render(<HeroSection />);

        fireEvent.click(screen.getByText("select-tt2"));

        expect(screen.getByTestId("modal-open")).toHaveTextContent("true");
        expect(screen.getByTestId("modal-imdbId")).toHaveTextContent("tt2");
    });

    it("Should addToCompare and navigate to /compare when compare is triggered from modal", () => {
        const addToCompare = vi.fn();
        useWatchlist.mockReturnValue({ addToCompare });

        render(<HeroSection />);

        fireEvent.click(screen.getByText("select-tt2"));
        fireEvent.click(screen.getByText("compare-from-modal"));

        expect(addToCompare).toHaveBeenCalledWith({
            Poster: "p.jpg",
            Title: "B",
            imdbID: "tt2",
        });
        expect(navigateMock).toHaveBeenCalledWith("/compare");
    });

    it("Should close modal when onClose is triggered", () => {
        render(<HeroSection />);

        fireEvent.click(screen.getByText("select-tt2"));
        expect(screen.getByTestId("modal-open")).toHaveTextContent("true");

        fireEvent.click(screen.getByText("close-modal"));
        expect(screen.getByTestId("modal-open")).toHaveTextContent("false");
    });
});
