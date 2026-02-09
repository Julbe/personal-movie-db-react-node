export function computeWatchlistStats(items = []) {
    const total = items.length;

    const watchedCount = items.reduce((acc, it) => acc + (it?.watched ? 1 : 0), 0);
    const unwatchedCount = total - watchedCount;

    const progress = total === 0 ? 0 : Math.round((watchedCount / total) * 100);

    const ratings = items
        .map(it => Number(it?.myRating))
        .filter(n => Number.isFinite(n));

    const avgRating = ratings.length
        ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : null;

    const totalRuntimeMinutes = items
        .map(it => parseRuntimeMinutes(it?.runtime))
        .filter(n => Number.isFinite(n))
        .reduce((a, b) => a + b, 0);

    const totalRuntimeHours = +(totalRuntimeMinutes / 60).toFixed(1);

    const byType = items.reduce(
        (acc, it) => {
            const t = (it?.type || "").toLowerCase();
            if (t === "movie") acc.movies += 1;
            else if (t === "series") acc.series += 1;
            else acc.other += 1;
            return acc;
        },
        { movies: 0, series: 0, other: 0 }
    );

    return {
        total,
        watchedCount,
        unwatchedCount,
        progress,
        avgRating,
        totalRuntimeHours,
        byType,
    };
}

function parseRuntimeMinutes(runtime) {

    if (runtime == null) return null;
    if (typeof runtime === "number") return runtime;

    const s = String(runtime).trim().toLowerCase();
    const match = s.match(/(\d+)\s*min/);
    if (match) return Number(match[1]);

    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : null;
}


export function colorFromId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 55%)`;
}