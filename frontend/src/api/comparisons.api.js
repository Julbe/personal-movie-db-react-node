import { apiFetch } from "./client.js";

export const comparisonsApi = {
    recent: () => apiFetch("/comparisons/recent"),
};