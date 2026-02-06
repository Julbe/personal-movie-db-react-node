import { Box, Button, TextField } from "@mui/material";
import { searchMovies } from "../../api/movieApi";
import { useState } from "react";



export default function SearchBar({ onResults, onLoading, onError }) {
    const [query, setQuery] = useState("");

    const handleSearch = async () => {
        // onResults([
        //     {
        //         imdbID: "tt0111161",
        //         Title: "The Shawshank Redemption",
        //         Year: "1994",
        //         Type: "movie",
        //         inWatchlist: false,
        //         Poster: "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg"
        //     },
        //     {
        //         imdbID: "tt3322940",
        //         Title: "Annabelle",
        //         Year: "2014",
        //         Type: "movie",
        //         inWatchlist: false,
        //         Poster: "https://m.media-amazon.com/images/M/MV5BNjkyMDU5ZWQtZDhkOC00ZWFjLWIyM2MtZWFhMDUzNjdlNzU2XkEyXkFqcGc@._V1_SX300.jpg"
        //     }
        // ]);
        onLoading(true);
        onError(null);
        try {
            const results = await searchMovies(query);
            onResults(results);
        } catch (err) {
            console.error(err);
            onResults([]);
            onError(err.message || "Failed to search movies");
        } finally {
            onLoading(false);
        }
    };
    return (
        <Box display="flex" justifyContent="center" gap={2} mb={4}>
            <TextField
                label="Search movies"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ width: 400 }}
            />
            <Button variant="contained" onClick={handleSearch}>
                Search
            </Button>
        </Box>
    );

}