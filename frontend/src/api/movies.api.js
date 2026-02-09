import { apiFetch } from "./client";

export const moviesApi = {
    details: (imdbId) => apiFetch(`/movie/${imdbId}`)
};