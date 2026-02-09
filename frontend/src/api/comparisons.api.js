import { apiFetch } from "./client.js";

export const comparisonsApi = {
    recent: () => apiFetch("/comparisons/recent"),
    create: (payload) => apiFetch(`/compare`, { method: "POST", body: JSON.stringify(payload) })
};