export const searchMovies = async ({ query, type = undefined, y = undefined, page = 1 }) => {
    const url = `${process.env.OMDB_BASE_URL}?s=${encodeURIComponent(
        query
    )}${type ? '&type=' + type : ''}${y ? '&y=' + y : ''}&page=${page}&apikey=${process.env.OMDB_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to search movies");
    }

    return response.json();
};
