const recentComparisons = [];

export const saveComparison = (data) => {
    recentComparisons.unshift(data);

    if (recentComparisons.length > 10) {
        recentComparisons.pop();
    }
};

export const getRecentComparisons = () => recentComparisons;
