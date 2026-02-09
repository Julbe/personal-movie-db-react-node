import { apiFetch } from "./client.js";

export const watchlistApi = {
    list: ({ sort, order, filter, watched } = {}) => {
        const params = new URLSearchParams();

        if (sort) params.append("sort", sort);
        if (order) params.append("order", order);
        if (filter) params.append("filter", filter);
        if (watched !== undefined) params.append("watched", watched);

        const query = params.toString();
        return apiFetch(`/watchlist${query ? `?${query}` : ""}`);
    },
    getOne: (imdbId) => apiFetch(`/watchlist/${imdbId}`),
    add: (items) => apiFetch(`/watchlist`, { method: "POST", body: JSON.stringify(items) }),
    patch: (imdbId, payload) => apiFetch(`/watchlist/${imdbId}`, { method: "PATCH", body: JSON.stringify(payload) }),
    remove: (imdbId) => apiFetch(`/watchlist/${imdbId}`, { method: "DELETE" }),
};