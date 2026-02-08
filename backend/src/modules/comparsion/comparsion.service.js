
import { Comparison } from "../../db/models/comparsion.model.js";

export async function saveComparison(data) {
    return Comparison.create({
        imdbIds: data.imdbIds,
        titles: data.titles,
        movieCount: data.movieCount,
        comparedAt: new Date(),
    });
}

export async function getRecentComparisons() {
    return Comparison.findAll({
        order: [["comparedAt", "DESC"]],
        limit: 10,
    });
}


// const recentComparisons = [];

// export const saveComparison = (data) => {
//     recentComparisons.unshift(data);

//     if (recentComparisons.length > 10) {
//         recentComparisons.pop();
//     }
// };

// export const getRecentComparisons = () => recentComparisons;
