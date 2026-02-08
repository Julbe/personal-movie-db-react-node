import { getRecentComparisons } from "./comparsion.service.js";

export default class ComparisonController {
    async recent(req, res) {
        res.json(await getRecentComparisons());
    }
}
