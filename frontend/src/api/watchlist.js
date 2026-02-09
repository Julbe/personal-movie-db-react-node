const API_URL = import.meta.env.VITE_API_URL;

export async function getWatchlist({ sort, order, filter, watched }) {
    const params = new URLSearchParams();

    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);
    if (filter) params.append('filter', filter);
    if (watched !== undefined) params.append('watched', watched);

    const res = await fetch(`${API_URL}/watchlist?${params.toString()}`);
    const json = await res.json();

    if (json.Response === "False") {
        throw new Error(json.Error ?? "Failed to fetch movies");
    }

    return json.Search ?? [];
}
