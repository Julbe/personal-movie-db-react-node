import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MovieItem from "../../../src/components/Movie/MovieItem";

describe("MovieItem", () => {
    const movie = {
        Title: "Batman Begins",
        Year: "2005",
        imdbID: "tt0372784",
        Poster: "https://example.com/poster.jpg",
        Type: "movie",
    };

    it("Should render title, year and type chip", () => {
        render(<MovieItem movie={movie} onSelect={() => { }} onQuickAdd={() => { }} />);
        expect(screen.getByText(/Batman Begins/i)).toBeInTheDocument();
        expect(screen.getByText(/\(2005\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Movie/i)).toBeInTheDocument();
    });

    it("Should call onSelect when clicking the row", () => {
        const onSelect = vi.fn();
        render(<MovieItem movie={movie} onSelect={onSelect} onQuickAdd={() => { }} />);
        fireEvent.click(screen.getByText(/Batman Begins/i));
        expect(onSelect).toHaveBeenCalledWith(movie);
    });

    it("Should call onQuickAdd when clicking quick add button and not trigger onSelect", () => {
        const onSelect = vi.fn();
        const onQuickAdd = vi.fn();

        render(
            <MovieItem
                movie={movie}
                onSelect={onSelect}
                onQuickAdd={onQuickAdd}
                isInWatchlist={false}
                saving={false}
                selectMode={false}
            />
        );

        const btn = screen.getByRole("button", { name: /quick add to watchlist/i });
        fireEvent.click(btn);

        expect(onQuickAdd).toHaveBeenCalledWith(movie);
        expect(onSelect).not.toHaveBeenCalled();
    });

    it("Should disable quick add button when saving is true", () => {
        render(
            <MovieItem
                movie={movie}
                onSelect={() => { }}
                onQuickAdd={() => { }}
                isInWatchlist={false}
                saving={true}
            />
        );

        const btn = screen.getByRole("button", { name: /quick add to watchlist/i });
        expect(btn).toBeDisabled();
    });

    it("Should show watchlist icon when isInWatchlist is true", () => {
        render(
            <MovieItem
                movie={movie}
                onSelect={() => { }}
                onQuickAdd={() => { }}
                isInWatchlist={true}
            />
        );

        expect(screen.getByRole("button", { name: /is in watchlist/i })).toBeInTheDocument();
    });

    it("Should render selectMode button and call onSelect when adding to compare", () => {
        const onSelect = vi.fn();

        render(
            <MovieItem
                movie={movie}
                onSelect={onSelect}
                onQuickAdd={() => { }}
                selectMode={true}
            />
        );

        // Tooltip title = "Add to compare"
        fireEvent.click(screen.getByRole("button", { name: /add to compare/i }));
        expect(onSelect).toHaveBeenCalledWith(movie);
    });
});
