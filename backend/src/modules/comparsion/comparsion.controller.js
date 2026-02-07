import { getRecentComparisons } from "./comparsion.repository.js";

export default class ComparisonController {
    async recent(req, res) {
        res.json(await getRecentComparisons());
    }
}
