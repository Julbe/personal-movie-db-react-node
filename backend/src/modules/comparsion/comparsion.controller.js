import { getRecentComparisons } from "./comparsion.model.js";

export default class ComparisonController {
    recent(req, res) {
        res.json(getRecentComparisons());
    }
}
