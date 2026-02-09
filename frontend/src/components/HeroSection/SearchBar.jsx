import { Box, Button, TextField } from "@mui/material";
import { searchMovies } from "../../api/search.api";
import { useState } from "react";



export default function SearchBar({ onResults, onLoading, onError }) {
    const [query, setQuery] = useState("");

    const handleSearch = async () => {
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