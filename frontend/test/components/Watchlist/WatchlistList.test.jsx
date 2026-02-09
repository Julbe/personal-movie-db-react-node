import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import WatchlistList from "../../../src/components/Watchlist/WatchlistList";

describe("WatchlistList", () => {
    it("Should show skeletons when loading", () => {
        const { container } = render(<WatchlistList items={[]} loading={true} />);
        expect(container.querySelectorAll(".MuiSkeleton-root").length).toBe(6);
    });

    it("Should show empty message when no items", () => {
        render(<WatchlistList items={[]} loading={false} />);
        expect(screen.getByText(/No items\. Add movies/i)).toBeInTheDocument();
    });

    it("Should render items and calls onOpen when row is clicked", () => {
        const onOpen = vi.fn();
        render(
            <WatchlistList
                loading={false}
                items={[{ imdbId: "tt1", title: "Movie 1", year: "2000", watched: false }]}
                onOpen={onOpen}
            />
        );

        fireEvent.click(screen.getByText("Movie 1"));
        expect(onOpen).toHaveBeenCalledWith("tt1");
    });

    it("Should call onToggleWatched and does NOT call onOpen (stopPropagation)", () => {
        const onOpen = vi.fn();
        const onToggleWatched = vi.fn();

        render(
            <WatchlistList
                loading={false}
                items={[{ imdbId: "tt1", title: "Movie 1", watched: false }]}
                onOpen={onOpen}
                onToggleWatched={onToggleWatched}
            />
        );

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        expect(onToggleWatched).toHaveBeenCalledWith("tt1", true);
        expect(onOpen).not.toHaveBeenCalled();
    });

    it("Should call onDelete and does NOT call onOpen (stopPropagation)", () => {
        const onOpen = vi.fn();
        const onDelete = vi.fn();

        render(
            <WatchlistList
                loading={false}
                items={[{ imdbId: "tt1", title: "Movie 1", watched: false }]}
                onOpen={onOpen}
                onDelete={onDelete}
            />
        );

        const removeBtn = screen.getByRole("button", { name: /remove/i });
        fireEvent.click(removeBtn);

        expect(onDelete).toHaveBeenCalledWith("tt1");
        expect(onOpen).not.toHaveBeenCalled();
    });
});
