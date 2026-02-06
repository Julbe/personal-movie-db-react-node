
const parseNumber = (value) => {
    if (!value || value === "N/A") return null;
    return Number(value.replace(/[^0-9.]/g, ""));
};

const parseMoney = (value) => {
    if (!value || value === "N/A") return null;
    return Number(value.replace(/[$,]/g, ""));
};

const average = (nums) =>
    nums.reduce((a, b) => a + b, 0) / nums.length;

const parseArrayInString = (_str) =>
    _str
        ? _str.split(",").map(a => a.trim())
        : [];

export const buildRatingsComparison = (movies) => {
    const ratings = movies
        .map((m) => ({
            imdbId: m.imdbID,
            title: m.Title,
            rating: parseNumber(m.imdbRating),
        }))
        .filter((r) => r.rating !== null);

    const sorted = [...ratings].sort((a, b) => b.rating - a.rating);

    const values = ratings.map((r) => r.rating);

    return {
        highest: sorted[0],
        lowest: sorted[sorted.length - 1],
        average: average(values).toFixed(2),
        range: (sorted[0].rating - sorted[sorted.length - 1].rating).toFixed(1),
        distribution: sorted.map((m) => ({
            imdbId: m.imdbId,
            rating: m.rating
        })),
    };
};

export const buildBoxOfficeComparison = (movies) => {
    const amounts = movies
        .map((m) => ({
            imdbId: m.imdbID,
            title: m.Title,
            amount: parseMoney(m.BoxOffice),
            raw: m.BoxOffice,
        }))
        .filter((b) => b.amount !== null);

    if (!amounts.length) {
        return {
            available: 0,
            distribution: [],
        };
    }

    const sorted = [...amounts].sort((a, b) => b.amount - a.amount);
    const values = amounts.map((a) => a.amount);

    return {
        highest: { ...sorted[0], amount: sorted[0].raw, raw: undefined },
        lowest: { ...sorted[sorted.length - 1], amount: sorted[sorted.length - 1].raw, raw: undefined },
        total: `$${values.reduce((a, b) => a + b, 0).toLocaleString()}`,
        average: `$${Math.round(average(values)).toLocaleString()}`,
        available: amounts.length,
        distribution: sorted.map((a) => ({
            imdbId: a.imdbId,
            amount: a.raw,
        })),
    };
};


export const buildReleaseYearsComparison = (movies) => {
    const years = movies.map((m) => ({
        imdbId: m.imdbID,
        title: m.Title,
        year: Number(m.Year),
    }));

    const sorted = [...years].sort((a, b) => a.year - b.year);

    return {
        oldest: sorted[0],
        newest: sorted[sorted.length - 1],
        span: `${sorted[sorted.length - 1].year - sorted[0].year} years`,
        timeline: sorted.map(({ imdbId, year }) => ({ imdbId, year: String(year) })),
    };
};


export const buildRuntimeComparison = (movies) => {
    const runtimes = movies
        .map((m) => ({
            imdbId: m.imdbID,
            title: m.Title,
            runtime: parseNumber(m.Runtime),
            raw: m.Runtime,
        }))
        .filter((r) => r.runtime !== null);

    const sorted = [...runtimes].sort((a, b) => b.runtime - a.runtime);
    const values = runtimes.map((r) => r.runtime);

    return {
        longest: { ...sorted[0], runtime: sorted[0].raw, raw: undefined },
        shortest: { ...sorted[sorted.length - 1], runtime: sorted[sorted.length - 1].raw, raw: undefined },
        average: `${Math.round(average(values))} min`,
        distribution: sorted.map((r) => ({
            imdbId: r.imdbId,
            runtime: r.raw,
        })),
    };
};


export const buildMetascoreComparison = (movies) => {
    const scores = movies
        .map((m) => ({
            imdbId: m.imdbID,
            title: m.Title,
            score: parseNumber(m.Metascore),
        }))
        .filter((s) => s.score !== null);

    const sorted = [...scores].sort((a, b) => b.score - a.score);
    const values = scores.map((s) => s.score);

    return {
        highest: sorted[0],
        lowest: sorted[sorted.length - 1],
        average: Math.round(average(values)).toString(),
        range: (sorted[0].score - sorted[sorted.length - 1].score).toString(),
    };
};

export const buildCommonActors = (movies) => {
    const actorMap = {};

    movies.forEach(m => {
        parseArrayInString(m.Actors).forEach(actor => {
            if (!actorMap[actor]) actorMap[actor] = [];
            actorMap[actor].push(m.imdbID);
        });
    });

    return Object.entries(actorMap)
        .filter(([_, ids]) => ids.length > 1)
        .map(([actor, ids]) => ({
            actor,
            appearsIn: ids,
            count: ids.length
        }));
};

export const buildCommonGenres = (movies) => {
    const genreMap = {};

    movies.forEach((m) => {
        parseArrayInString(m.Genre).forEach((genre) => {
            if (!genreMap[genre]) {
                genreMap[genre] = [];
            }
            genreMap[genre].push(m.imdbID);
        });
    });

    return Object.entries(genreMap)
        .filter(([_, ids]) => ids.length > 1)
        .map(([genre, ids]) => ({
            genre,
            appearsIn: ids,
            count: ids.length,
        }));
};

