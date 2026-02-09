import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MovieItemCard from "../../../src/components/Movie/MovieItemCard";

describe("MovieItemCard", () => {
    it("Should render poster image when poster exists", () => {
        render(
            <MovieItemCard
                item={{ title: "Dark", year: "2017", type: "series", poster: "https://img.jpg" }}
                onClick={() => { }}
            />
        );

        expect(screen.getByAltText("Dark")).toBeInTheDocument();
    });

    it("Should render 'No poster' fallback when poster is missing", () => {
        render(
            <MovieItemCard
                item={{ title: "Dark", year: "2017", type: "series", poster: "" }}
                onClick={() => { }}
            />
        );

        expect(screen.getByText(/No poster/i)).toBeInTheDocument();
    });

    it("Should call onClick when clicking the card", () => {
        const onClick = vi.fn();

        render(
            <MovieItemCard
                item={{ title: "Dark", year: "2017", type: "series", poster: "" }}
                onClick={onClick}
            />
        );

        fireEvent.click(screen.getByText("Dark"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("Should map Type/movie to chip label", () => {
        render(
            <MovieItemCard
                item={{ Title: "Batman Begins", Year: "2005", Type: "movie", Poster: "" }}
                onClick={() => { }}
            />
        );

        expect(screen.getByText("Movie")).toBeInTheDocument();
    });
});
