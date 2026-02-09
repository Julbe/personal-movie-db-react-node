import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import WatchlistGridCard from "../../../src/components/Watchlist/WatchlistGridCard";

describe("WatchlistGridCard", () => {
    const baseItem = {
        imdbId: "tt1",
        title: "Movie 1",
        year: "2000",
        type: "movie",
        poster: "https://example.com/poster.jpg",
        watched: false,
        myRating: 0,
        imdbRating: "8.0",
    };

    it("Should render poster when available", () => {
        render(<WatchlistGridCard item={baseItem} />);
        expect(screen.getByAltText("Movie 1")).toBeInTheDocument();
    });

    it("Should show info view and back button", () => {
        render(<WatchlistGridCard item={{ ...baseItem, poster: "" }} />);
        expect(screen.getByText(/No poster/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /view info/i }));
        expect(screen.getByText(/Your Rating/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /back/i }));
        expect(screen.getByText(/No poster/i)).toBeInTheDocument();
    });

    it("Should call onCompare with item", () => {
        const onCompare = vi.fn();
        render(<WatchlistGridCard item={baseItem} onCompare={onCompare} />);

        fireEvent.click(screen.getByRole("button", { name: /compare/i }));
        expect(onCompare).toHaveBeenCalledWith(baseItem);
    });

    it("Should call onDelete with imdbId", () => {
        const onDelete = vi.fn();
        render(<WatchlistGridCard item={baseItem} onDelete={onDelete} />);

        fireEvent.click(screen.getByRole("button", { name: /delete/i }));
        expect(onDelete).toHaveBeenCalledWith("tt1");
    });

    it("Should call onToggleWatched from info view", () => {
        const onToggleWatched = vi.fn();
        render(<WatchlistGridCard item={baseItem} onToggleWatched={onToggleWatched} />);

        fireEvent.click(screen.getByRole("button", { name: /view info/i }));

        const cb = screen.getByRole("checkbox");
        fireEvent.click(cb);

        expect(onToggleWatched).toHaveBeenCalledWith("tt1", true);
    });

    it("Should call onRate when changing rating", () => {
        const onRate = vi.fn();
        render(<WatchlistGridCard item={baseItem} onRate={onRate} />);

        fireEvent.click(screen.getByRole("button", { name: /view info/i }));
        const radios = screen.getAllByRole("radio");
        fireEvent.click(radios[4]);

        expect(onRate).toHaveBeenCalled();
        expect(onRate.mock.calls[0][0]).toBe("tt1");
    });
});
