import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import WatchlistGrid from "../../../src/components/Watchlist/WatchlistGrid";

vi.mock("../../../src/components/Watchlist/WatchlistGridCard", () => ({
    default: ({ item }) => <div data-testid="grid-card">{item.imdbId}</div>,
}));

describe("WatchlistGrid", () => {
    it("Should show skeletons when loading", () => {
        const { container } = render(<WatchlistGrid items={[]} loading={true} />);
        expect(container.querySelectorAll(".MuiSkeleton-root").length).toBe(6);
    });

    it("Should show empty message when no items", () => {
        render(<WatchlistGrid items={[]} loading={false} />);
        expect(screen.getByText(/No items\. Add movies/i)).toBeInTheDocument();
    });

    it("Should render grid cards for items", () => {
        render(
            <WatchlistGrid
                loading={false}
                items={[{ imdbId: "tt1" }, { imdbId: "tt2" }]}
            />
        );

        expect(screen.getAllByTestId("grid-card")).toHaveLength(2);
        expect(screen.getByText("tt1")).toBeInTheDocument();
        expect(screen.getByText("tt2")).toBeInTheDocument();
    });
});
