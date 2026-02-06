import { fetchMovieById } from "../movie/movie.service.js";
import { buildBoxOfficeComparison, buildCommonActors, buildCommonGenres, buildMetascoreComparison, buildRatingsComparison, buildReleaseYearsComparison, buildRuntimeComparison } from "./compare.helper.js";

const movieAdapter = ({ Title, imdbID, imdbRating, Year, Runtime, Genre, Metascore, BoxOffice }) => ({
    Title, imdbID, imdbRating, Year, Runtime, Genre, Metascore, BoxOffice
});

export const compareMovies = async (imdbIds = []) => {
    try {
        const results = await Promise.all(
            imdbIds.map((id) => fetchMovieById(id))
        );

        const movies = [];
        const missing = [];

        results.forEach((movie, index) => {
            if (movie?.Response === "False") {
                missing.push(imdbIds[index]);
            } else {
                movies.push(movie);
            }
        });

        return {
            movies: movies.map((movie) => movieAdapter(movie)),
            missing,
            comparison: {
                ratings: buildRatingsComparison(movies),
                boxOffice: buildBoxOfficeComparison(movies),
                releaseYears: buildReleaseYearsComparison(movies),
                runtime: buildRuntimeComparison(movies),
                metascore: buildMetascoreComparison(movies),
                commonActors: buildCommonActors(movies),
                commonGenres: buildCommonGenres(movies),
                uniqueDirectors: [...new Set(movies.map((m) => m.Director))],
            },
        };
    } catch (error) {
        console.warn(error)
        throw new Error("OMDB_FAILURE");
    }
};
