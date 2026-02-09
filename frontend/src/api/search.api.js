const API_URL = import.meta.env.VITE_API_URL;

export async function searchMovies(query) {
    if (!query) return [];

    const res = await fetch(
        `${API_URL}/search?s=${encodeURIComponent(query)}`
    );

    const json = await res.json();

    if (json.Response === "False") {
        throw new Error(json.Error ?? "Failed to fetch movies");
    }

    return json.Search ?? [];
}
