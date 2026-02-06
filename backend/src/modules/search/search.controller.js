import { searchMovies } from "./search.service.js";

export default class SearchController {
    async search(req, res, next) {
        try {
            const { s, type, y, page = 1 } = req.query;

            if (!s) {
                return res.status(400).json({
                    Response: "False",
                    Error: "Search parameter 's' is required",
                })
            }

            const result = await searchMovies({
                query: s,
                type: type ?? undefined,
                y: y ?? undefined,
                page,
            });

            if (result.Response === "False") {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
