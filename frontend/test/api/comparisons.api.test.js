import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/api/client.js", () => ({
    apiFetch: vi.fn(),
}));

import { apiFetch } from "../../src/api/client.js";
import { comparisonsApi } from "../../src/api/comparisons.api.js";

describe("comparisonsApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        apiFetch.mockResolvedValue({ ok: true });
    });

    it("Should call recent()", async () => {
        await comparisonsApi.recent();
        expect(apiFetch).toHaveBeenCalledWith("/comparisons/recent");
    });

    it("Should call create(payload) with POST and JSON body", async () => {
        const payload = { imdbIds: ["tt1", "tt2"] };
        await comparisonsApi.create(payload);

        expect(apiFetch).toHaveBeenCalledWith("/compare", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    });
});
