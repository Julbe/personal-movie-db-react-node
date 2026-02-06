import { Alert, Box, CircularProgress, Typography } from "@mui/material";

import logo from "../../assets/film.svg";
import { useState } from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

export default function HeroSection() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <Box textAlign="center" mt={8}>
            <Typography variant="h3" gutterBottom>
                <img
                    src={logo}
                    alt="Personal Movie DB"
                    style={{ height: 48, verticalAlign: "middle", marginRight: 8 }}
                />
                Personal Movie DB
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
                Search movies using IMDb data
            </Typography>
            <SearchBar
                onResults={setResults}
                onLoading={setLoading}
                onError={setError}
            />
            {loading && <CircularProgress />}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
            <SearchResults results={results} />
        </Box>
    );
}