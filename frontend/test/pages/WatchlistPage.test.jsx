import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WatchlistPage from "../../src/pages/WatchlistPage";
import userEvent from "@testing-library/user-event";


const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => navigateMock,
}));

vi.mock("../../src/context/WatchlistContext", () => ({
    useWatchlist: vi.fn(),
}));
import { useWatchlist } from "../../src/context/WatchlistContext";

vi.mock("../../src/components/Watchlist/Statistics/StatisticsDashboard", () => ({
    default: () => <div data-testid="stats" />,
}));

vi.mock("../../src/components/Watchlist/WatchlistGrid", () => ({
    default: ({ items, onOpen, onDelete, onRate, onToggleWatched, onCompare }) => (
        <div data-testid="grid">
            <div>count:{items?.length ?? 0}</div>
            <button onClick={() => onOpen?.("tt1")}>open-tt1</button>
            <button onClick={() => onDelete?.("tt1")}>delete-tt1</button>
            <button onClick={() => onToggleWatched?.("tt1", true)}>togglewatched-tt1</button>
            <button onClick={() => onRate?.("tt1", 7)}>rate-tt1</button>
            <button onClick={() => onCompare?.({ imdbId: "tt1", title: "A", poster: "p.jpg" })}>
                compare-tt1
            </button>
        </div>
    ),
}));

vi.mock("../../src/components/Watchlist/WatchlistList", () => ({
    default: ({ items, onOpen, onDelete, onToggleWatched }) => (
        <div data-testid="list">
            <div>count:{items?.length ?? 0}</div>
            <button onClick={() => onOpen?.("tt2")}>open-tt2</button>
            <button onClick={() => onDelete?.("tt2")}>delete-tt2</button>
            <button onClick={() => onToggleWatched?.("tt2", false)}>togglewatched-tt2</button>
        </div>
    ),
}));

vi.mock("../../src/components/Movie/MovieDetailsModal", () => ({
    default: ({ open, imdbId, onClose }) => (
        <div data-testid="modal">
            open:{String(open)} id:{imdbId ?? ""}
            <button onClick={onClose}>close-modal</button>
        </div>
    ),
}));

describe("WatchlistPage (more coverage)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useWatchlist.mockReturnValue({
            items: [{ imdbId: "tt1", title: "A" }, { imdbId: "tt2", title: "B" }],
            allItems: [{ imdbId: "tt1" }],
            loading: false,
            refresh: vi.fn().mockResolvedValue(undefined),
            refreshAll: vi.fn().mockResolvedValue(undefined),
            toggle: vi.fn().mockResolvedValue(undefined),
            update: vi.fn().mockResolvedValue(undefined),
            addToCompare: vi.fn(),
        });
    });
    it("Should call refresh again when changing sort", async () => {
        const ctx = useWatchlist();
        render(<WatchlistPage />);

        // 0: Watched, 1: Filter, 2: Sort, 3: Order
        const combos = screen.getAllByRole("combobox");
        fireEvent.mouseDown(combos[2]); // abre Sort

        const listbox = await screen.findByRole("listbox");
        fireEvent.click(within(listbox).getByRole("option", { name: /title/i }));

        await waitFor(() => expect(ctx.refresh).toHaveBeenCalledTimes(2));
    });

    it("Should show error alert when refresh fails (useEffect path)", async () => {
        useWatchlist.mockReturnValueOnce({
            ...useWatchlist(),
            refresh: vi.fn().mockRejectedValue(new Error("Failed refresh")),
        });

        render(<WatchlistPage />);
        expect(await screen.findByText(/Failed refresh/i)).toBeInTheDocument();
    });

    it("Should open and close MovieDetailsModal when onOpen is called", async () => {
        render(<WatchlistPage />);

        fireEvent.click(screen.getByText("open-tt1"));
        expect(screen.getByTestId("modal")).toHaveTextContent("open:true");
        expect(screen.getByTestId("modal")).toHaveTextContent("id:tt1");

        fireEvent.click(screen.getByText("close-modal"));
        expect(screen.getByTestId("modal")).toHaveTextContent("open:false");
    });

    it("Should call toggle and refreshAll when deleting an item", async () => {
        const ctx = useWatchlist();
        render(<WatchlistPage />);

        fireEvent.click(screen.getByText("delete-tt1"));

        await waitFor(() => expect(ctx.toggle).toHaveBeenCalledWith("tt1"));
        expect(ctx.refreshAll).toHaveBeenCalled();
    });

    it("Should set error when delete fails", async () => {
        useWatchlist.mockReturnValueOnce({
            ...useWatchlist(),
            toggle: vi.fn().mockRejectedValue(new Error("Delete failed")),
        });

        render(<WatchlistPage />);
        fireEvent.click(screen.getByText("delete-tt1"));

        expect(await screen.findByText(/Delete failed/i)).toBeInTheDocument();
    });

    it("Should call update(watched) and refreshAll on watched toggle", async () => {
        const ctx = useWatchlist();
        render(<WatchlistPage />);

        fireEvent.click(screen.getByText("togglewatched-tt1"));

        await waitFor(() => expect(ctx.update).toHaveBeenCalledWith("tt1", { watched: true }));
        expect(ctx.refreshAll).toHaveBeenCalled();
    });

    it("Should call update(myRating) and refreshAll on rating change", async () => {
        const ctx = useWatchlist();
        render(<WatchlistPage />);

        fireEvent.click(screen.getByText("rate-tt1"));

        await waitFor(() => expect(ctx.update).toHaveBeenCalledWith("tt1", { myRating: 7 }));
        expect(ctx.refreshAll).toHaveBeenCalled();
    });

    it("Should navigate to /compare and call addToCompare when compare is triggered", () => {
        const ctx = useWatchlist();
        render(<WatchlistPage />);

        fireEvent.click(screen.getByText("compare-tt1"));

        expect(ctx.addToCompare).toHaveBeenCalledWith({
            Poster: "p.jpg",
            Title: "A",
            imdbID: "tt1",
        });
        expect(navigateMock).toHaveBeenCalledWith("/compare");
    });

    it("Should render WatchlistList when switching to list view", () => {
        render(<WatchlistPage />);

        fireEvent.click(screen.getByRole("button", { name: /list/i }));
        expect(screen.getByTestId("list")).toBeInTheDocument();
    });
});
