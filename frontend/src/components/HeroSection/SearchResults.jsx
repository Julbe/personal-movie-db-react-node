import { Box } from "@mui/material";
import MovieItem from "../Movie/MovieItem";
import { useWatchlist } from "../../context/WatchlistContext";
import { useState } from "react";


export default function SearchResults({ results, onSelectMovie, selectMode = false }) {

    const { isInWatchlist, toggle } = useWatchlist();
    const [saving, setSaving] = useState(false);

    const handleQuickAdd = async (movie) => {
        setSaving(true);
        await toggle(movie.imdbID);
        setSaving(false);
    };


    return (
        <Box maxWidth={800} mx="auto">
            {results.slice(0, 10).map((movie) => (
                <MovieItem
                    key={movie.imdbID}
                    movie={movie}
                    isInWatchlist={isInWatchlist(movie.imdbID)}
                    onQuickAdd={handleQuickAdd}
                    saving={saving}
                    selectMode={selectMode}
                    onSelect={onSelectMovie ?? (() => { })}
                />
            ))}
        </Box>
    )
}