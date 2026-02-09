
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { watchlistApi } from "../api/watchlist.api.js";

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);

    async function refresh(params = { sort: "dateAdded", order: "desc" }) {
        setLoading(true);
        try {
            const data = await watchlistApi.list(params);
            setItems(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    }

    async function refreshAll() {
        try {
            const data = await watchlistApi.list();
            setAllItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.warn(error);
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
        const prev = items;

        if (exists) {
            setItems((cur) => cur.filter((x) => x.imdbId !== imdbId));
            try {
                await watchlistApi.remove(imdbId);
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
        } catch (e) {
            setItems(prev);
            throw e;
        }
    }

    // Compare
    const MAX_COMPARE = 5;

    const [compareList, setCompareList] = useState([]);

    const addToCompare = (movie) => {
        setCompareList(prev => {
            if (!movie?.imdbID) return prev;
            if (prev.some(m => m.imdbID === movie.imdbID)) return prev;
            if (prev.length >= MAX_COMPARE) return prev;
            return [...prev, movie];
        });
    };

    const removeFromCompare = (imdbID) => {
        setCompareList(prev => prev.filter(m => m.imdbID !== imdbID));
    };

    const clearCompare = () => setCompareList([]);

    return (
        <WatchlistContext.Provider value={{
            items,
            allItems,
            loading,
            refresh,
            isInWatchlist,
            toggle,
            getItem,
            update,
            refreshAll,
            compareList,
            addToCompare,
            removeFromCompare,
            clearCompare,
        }}>
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const ctx = useContext(WatchlistContext);
    if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
    return ctx;
}
