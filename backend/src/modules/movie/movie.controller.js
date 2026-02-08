import { validateImdbId } from "../../utils/validations.js";
import { fetchMovieById } from "./movie.service.js";

export default class MovieController {
    async getByImdbId(req, res, next) {
        try {
            const { imdbId } = req.params;

            if (!validateImdbId(imdbId)) {
                return res.status(400).json({
                    Response: "False",
                    Error:
                        "Invalid IMDb ID format. Must be 'tt' followed by 7-8 digits",
                });
            }

            const movie = await fetchMovieById(imdbId);

            if (!movie || movie.Response === "False") {
                return res.status(404).json(movie);
            }

            return res.status(200).json(movie);
        } catch (error) {
            next(error);
        }
    }
}
