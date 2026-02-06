export const fetchMovieById = async (imdbId) => {
    const url = `${process.env.OMDB_BASE_URL}?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}&plot=full`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch movie from OMDb");
    }

    return response.json();
};
