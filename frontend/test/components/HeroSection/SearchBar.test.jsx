import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import SearchBar from "../../../src/components/HeroSection/SearchBar.jsx";
import * as movieApi from "../../../src/api/search.api.js";

vi.mock("../../../src/api/search.api.js", () => ({
    searchMovies: vi.fn(),
}));


describe("SearchBar", () => {
    it("calls searchMovies and returns results on success", async () => {
        const mockResults = [
            {
                Title: "Batman Begins",
                Year: "2005",
                imdbID: "tt0372784",
                Type: "movie",
            },
        ];

        movieApi.searchMovies.mockResolvedValue(mockResults);

        const onResults = vi.fn();
        const onLoading = vi.fn();
        const onError = vi.fn();

        render(
            <SearchBar
                onResults={onResults}
                onLoading={onLoading}
                onError={onError}
            />
        );

        fireEvent.change(
            screen.getByLabelText(/Search movies/i),
            { target: { value: "batman" } }
        );

        const searchButton = screen.getByRole("button", { name: /search/i });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(movieApi.searchMovies).toHaveBeenCalledWith("batman");
        });

        expect(onLoading).toHaveBeenCalledWith(true);
        expect(onResults).toHaveBeenCalledWith(mockResults);
        expect(onError).toHaveBeenCalledWith(null);
    });

    it("shows error message when search fails", async () => {
        movieApi.searchMovies.mockRejectedValue(
            new Error("Movie not found!")
        );

        const onResults = vi.fn();
        const onLoading = vi.fn();
        const onError = vi.fn();

        render(
            <SearchBar
                onResults={onResults}
                onLoading={onLoading}
                onError={onError}
            />
        );
        const searchButton = screen.getByRole("button", { name: /search/i });


        fireEvent.change(
            screen.getByLabelText(/Search movies/i),
            { target: { value: "xxxx" } }
        );

        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith("Movie not found!");
        });
    });

});
