import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "../../src/pages/Home";

const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => navigateMock,
}));

vi.mock("../../src/components/HeroSection/HeroSection", () => ({
    default: () => <div data-testid="hero">HeroSection</div>,
}));

vi.mock("../../src/components/Watchlist/WatchlistSection", () => ({
    default: ({ onViewAll }) => (
        <div data-testid="watchlist-section">
            <button onClick={onViewAll}>view-all</button>
        </div>
    ),
}));

vi.mock("../../src/components/Comparsions/RecentComparisonsSection", () => ({
    default: ({ onNewComparison }) => (
        <div data-testid="recent-comparisons">
            <button onClick={onNewComparison}>new-comparison</button>
        </div>
    ),
}));

describe("Home", () => {
    beforeEach(() => vi.clearAllMocks());

    it("Should render all sections", () => {
        render(<Home />);
        expect(screen.getByTestId("hero")).toBeInTheDocument();
        expect(screen.getByTestId("watchlist-section")).toBeInTheDocument();
        expect(screen.getByTestId("recent-comparisons")).toBeInTheDocument();
    });

    it("Should navigate to /watchlist when clicking View All", () => {
        render(<Home />);
        fireEvent.click(screen.getByText("view-all"));
        expect(navigateMock).toHaveBeenCalledWith("/watchlist");
    });

    it("Should navigate to /compare when clicking New Comparison", () => {
        render(<Home />);
        fireEvent.click(screen.getByText("new-comparison"));
        expect(navigateMock).toHaveBeenCalledWith("/compare");
    });
});
