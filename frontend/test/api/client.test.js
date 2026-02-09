import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch } from "../../src/api/client.js";

function mockFetchResponse({ ok = true, status = 200, jsonData = { ok: true }, jsonThrows = false } = {}) {
    global.fetch = vi.fn().mockResolvedValue({
        ok,
        status,
        json: jsonThrows ? vi.fn().mockRejectedValue(new Error("bad json")) : vi.fn().mockResolvedValue(jsonData),
    });
}

describe("apiFetch (client.js)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("Should call fetch with base url + path and default JSON headers", async () => {
        mockFetchResponse({ ok: true, status: 200, jsonData: { hello: "world" } });

        const data = await apiFetch("/watchlist");

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const [url, options] = global.fetch.mock.calls[0];
        const headerContentType = options.headers["Content-Type"];
        expect(String(url)).toContain("/watchlist");
        expect(headerContentType).toBe("application/json");
        expect(data).toEqual({ hello: "world" });
    });

    it("Should merge custom headers", async () => {
        mockFetchResponse({ ok: true, status: 200, jsonData: { ok: 1 } });

        await apiFetch("/x", { headers: { Authorization: "Bearer 123" } });

        const [, options] = global.fetch.mock.calls[0];

        expect(options.headers.Authorization).toBe("Bearer 123");
    });

    it("Should return null when response is not JSON", async () => {
        // json() falla -> catch => null, y si ok=true, regresa null
        mockFetchResponse({ ok: true, status: 200, jsonThrows: true });

        const data = await apiFetch("/no-json");
        expect(data).toBe(null);
    });

    it("Should throw error with message from data.error when response not ok", async () => {
        mockFetchResponse({ ok: false, status: 400, jsonData: { error: "Bad request" } });

        await expect(apiFetch("/bad")).rejects.toMatchObject({
            message: "Bad request",
            status: 400,
            data: { error: "Bad request" },
        });
    });

    it("Should throw error with message from data.Error when response not ok", async () => {
        mockFetchResponse({ ok: false, status: 404, jsonData: { Error: "Not found" } });

        await expect(apiFetch("/missing")).rejects.toMatchObject({
            message: "Not found",
            status: 404,
        });
    });

    it("Should throw error with fallback message when response not ok and no json body", async () => {
        mockFetchResponse({ ok: false, status: 500, jsonThrows: true });

        await expect(apiFetch("/oops")).rejects.toMatchObject({
            message: "Request failed (500)",
            status: 500,
            data: null,
        });
    });
});
