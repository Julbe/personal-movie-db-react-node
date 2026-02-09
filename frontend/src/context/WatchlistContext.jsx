
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { watchlistApi } from "../api/watchlist.api.js";

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    async function refresh() {
        setLoading(true);
        try {
            const data = await watchlistApi.list({ sort: "dateAdded", order: "desc" });
            setItems(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    const idSet = useMemo(() => new Set(items.map((x) => x.imdbId)), [items]);
    const isInWatchlist = (imdbId) => idSet.has(imdbId);

    const byId = useMemo(() => new Map(items.map((x) => [x.imdbId, x])), [items]);
    const getItem = (imdbId) => byId.get(imdbId);
    async function toggle(imdbId) {
        const exists = isInWatchlist(imdbId);

        if (exists) {
            const prev = items;
            setItems((cur) => cur.filter((x) => x.imdbId !== imdbId));
            try {
                await watchlistApi.remove(imdbId);
                await refresh();
            } catch (e) {
                setItems(prev);
                throw e;
            }
            return;
        }
        try {
            await watchlistApi.add([{ imdbId, watched: false, myRating: null }]);
            await refresh();
        } catch (e) {
            setItems(prev);
            throw e;
        }
    }

    async function update(imdbId, patch) {
        const prev = items;
        setItems((cur) => cur.map((x) => (x.imdbId === imdbId ? { ...x, ...patch } : x)));
        try {
            await watchlistApi.patch(imdbId, patch);
            await refresh();
        } catch (e) {
            setItems(prev);
            throw e;
        }
    }


    return (
        <WatchlistContext.Provider value={{ items, loading, refresh, isInWatchlist, toggle, getItem, update }}>
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const ctx = useContext(WatchlistContext);
    if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
    return ctx;
}
