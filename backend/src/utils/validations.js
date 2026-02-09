export const imdbIdRegex = /^tt\d{7,8}$/;

export function validateImdbId(imdbId) {
    return typeof imdbId === "string" && imdbIdRegex.test(imdbId);
}
export function validateRating(value) {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value >= 1 && value <= 10;
}

export function parseBooleanQuery(v) {
    if (v === undefined) return undefined;
    if (v === "true") return true;
    if (v === "false") return false;
    if (typeof v === "boolean") return v;
    return "invalid";
}