import {
    Alert,
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import SearchBar from "../HeroSection/SearchBar";
import SearchResults from "../HeroSection/SearchResults";
import MovieDetailsModal from "../Movie/MovieDetailsModal";

export default function AddMovieModal({ open, onClose, onSelect }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const selectMode = true;

    const handleConfirm = (movie) => {
        onSelect(movie);
        handleResults([])
        onClose();
    };


    const handleResults = (arr) => {
        const map = new Map();
        arr.forEach(m => {
            if (m?.imdbID && !map.has(m.imdbID)) map.set(m.imdbID, m);
        });
        setResults([...map.values()]);
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Add movie to comparison</DialogTitle>

            <DialogContent sx={{
                minHeight: "70vh",
                maxHeight: "80vh",
                overflowY: "auto",
            }} >
                <SearchBar
                    onResults={handleResults}
                    onLoading={setLoading}
                    onError={setError}
                />

                {loading && <CircularProgress sx={{ mt: 2 }} />}

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box textAlign="center">
                    <SearchResults
                        results={results}
                        selectMode={selectMode}
                        onSelectMovie={(movie) => handleConfirm(movie)}
                    />
                </Box>

            </DialogContent>
        </Dialog>
    );
}
