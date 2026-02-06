import { compareMovies } from "./comparsion.service.js";

const IMDB_REGEX = /^tt\d{7,8}$/;

export default class ComparisonController {
    async compare(req, res, next) {
        try {
            const { imdbIds } = req.body;

            // 400: Missing/empty array
            if (!imdbIds) {
                return res.status(400).json({
                    error: "imdbIds array is required",
                });
            }

            // 400: Not an array →
            if (!Array.isArray(imdbIds)) {
                return res.status(400).json({
                    error: "imdbIds must be an array",
                });
            }
            // 400: Too few movies →
            if (imdbIds.length < 2) {
                return res.status(400).json({
                    error: "At least 2 movies required for comparison",
                });
            }
            // 400: Too many movies
            if (imdbIds.length > 5) {
                return res.status(400).json({
                    error: "Maximum 5 movies can be compared at once",
                });
            }

            const invalidIds = imdbIds.filter(
                (id) => !IMDB_REGEX.test(id)
            );
            // 400: Invalid format 
            if (invalidIds.length) {
                return res.status(400).json({
                    error: "All IMDb IDs must be valid format",
                });
            }

            // 400: Duplicate IDs
            const uniqueIds = new Set(imdbIds);
            if (uniqueIds.size !== imdbIds.length) {
                return res.status(400).json({
                    error:
                        "Duplicate IMDb IDs found. All movies must be unique",
                });
            }

            // 404: Movie(s) not found
            let result;
            try {
                result = await compareMovies(imdbIds);
            } catch (error) {
                console.error(error);
                // 500: OMDb failure
                return res.status(500).json({
                    error: "Failed to fetch movie data",
                });
            }

            if (result.missing.length) {
                return res.status(404).json({
                    error: "One or more movies not found",
                    missing: result.missing,
                });
            }

            return res.status(200).json({
                movies: result.movies,
                comparison: result.comparison,
                comparedAt: new Date().toISOString(),
                movieCount: result.movies.length,
            });
        } catch (error) {
            next(error);
        }
    }
}
