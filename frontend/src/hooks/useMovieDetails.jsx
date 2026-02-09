import { useEffect, useState } from "react";
import { moviesApi } from "../api/movies.api";

export function useMovieDetails(imdbId, open) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open || !imdbId) return;

        let alive = true;

        (async () => {
            setLoading(true);
            setError(null);
            setData(null);

            try {
                const res = await moviesApi.details(imdbId);
                if (alive) setData(res);
            } catch (e) {
                if (alive) setError(e);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [imdbId, open]);

    return { data, loading, error };
}
