import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";

import AddMovieModal from "../components/Comparsions/AddMovieModal";
import ComparisonCharts from "../components/Watchlist/Statistics/ComparisonsCharts";

import { useWatchlist } from "../context/WatchlistContext";
import { comparisonsApi } from "../api/comparisons.api";
import { colorFromId } from "../components/Watchlist/compute.helper";


const toMinutes = (s) => {
    if (!s) return null;
    const m = String(s).match(/(\d+)/);
    return m ? Number(m[1]) : null;
};

const moneyToNumber = (s) => {
    if (!s || s === "N/A") return null;
    // "$534,987,076" -> 534987076
    const n = Number(String(s).replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : null;
};

export default function ComparePage() {
    const { addToCompare, compareList, removeFromCompare, clearCompare } = useWatchlist();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [addOpen, setAddOpen] = useState(false);
    const handleAddMovie = (movie) => {
        addToCompare({
            Poster: movie.Poster,
            Title: movie.Title,
            imdbID: movie.imdbID
        });
    }

    async function getCompare() {
        setError(null);
        setData(null);
        const ids = compareList.map((movie) => movie.imdbID);
        if (ids.length === 0) return;

        setLoading(true);
        try {
            const resp = await comparisonsApi.create({ imdbIds: ids });
            setData(resp);
        } catch (e) {
            setError(e?.message || "Failed to compare");
        } finally {
            setLoading(false);
        }
    }

    const movies = data?.movies || [];
    const comparison = data?.comparison;

    const chartRows = useMemo(() => {
        return movies.map((m) => ({
            id: m.imdbID,
            title: m.Title,
            rating: Number(m.imdbRating),
            year: Number(String(m.Year).slice(0, 4)),
            runtime: toMinutes(m.Runtime),
            metascore: Number(m.Metascore),
            boxOffice: moneyToNumber(m.BoxOffice),
            fill: colorFromId(m.imdbID)
        }));
    }, [movies]);

    return (
        <Box mt={4}>
            <Box display="flex" justifyContent="space-between" alignItems="end" flexWrap="wrap" gap={2}>
                <Typography variant="h4" fontWeight={900}>
                    Compare Movies
                </Typography>
            </Box>

            {/* Graph Area */}
            <Card sx={{ mt: 2 }} variant="outlined">
                <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                        Graph Area
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}

                    {compareList.length === 0 && (
                        <Box sx={{ py: 6, textAlign: "center", opacity: 0.8 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                No movies selected yet.
                            </Typography>
                            <Typography variant="body2">
                                Click <b>Add Movie</b> to start comparing.
                            </Typography>
                        </Box>
                    )}

                    {loading && (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && !!comparison && (
                        <>
                            <Box display="flex" flexWrap="wrap" gap={2}>
                                <StatBlock
                                    title="Ratings"
                                    lines={[
                                        `Highest: ${comparison.ratings.highest.title} (${comparison.ratings.highest.rating})`,
                                        `Lowest: ${comparison.ratings.lowest.title} (${comparison.ratings.lowest.rating})`,
                                        `Average: ${comparison.ratings.average}`,
                                        `Range: ${comparison.ratings.range}`,
                                    ]}
                                />
                                <StatBlock
                                    title="Runtime"
                                    lines={[
                                        `Longest: ${comparison.runtime.longest.title} (${comparison.runtime.longest.runtime})`,
                                        `Shortest: ${comparison.runtime.shortest.title} (${comparison.runtime.shortest.runtime})`,
                                        `Average: ${comparison.runtime.average}`,
                                    ]}
                                />
                                <StatBlock
                                    title="Box Office"
                                    lines={[
                                        `Highest: ${comparison.boxOffice.highest.title} (${comparison.boxOffice.highest.amount})`,
                                        `Lowest: ${comparison.boxOffice.lowest.title} (${comparison.boxOffice.lowest.amount})`,
                                        `Total: ${comparison.boxOffice.total}`,
                                        `Average: ${comparison.boxOffice.average}`,
                                    ]}
                                />
                                <StatBlock
                                    title="Release Years"
                                    lines={[
                                        `Oldest: ${comparison.releaseYears.oldest.title} (${comparison.releaseYears.oldest.year})`,
                                        `Newest: ${comparison.releaseYears.newest.title} (${comparison.releaseYears.newest.year})`,
                                        `Span: ${comparison.releaseYears.span}`,
                                    ]}
                                />
                                <StatBlock
                                    title="Metascore"
                                    lines={[
                                        `Highest: ${comparison.metascore.highest.title} (${comparison.metascore.highest.score})`,
                                        `Lowest: ${comparison.metascore.lowest.title} (${comparison.metascore.lowest.score})`,
                                        `Average: ${comparison.metascore.average}`,
                                        `Range: ${comparison.metascore.range}`,
                                    ]}
                                />
                            </Box>

                            <ComparisonCharts chartRows={chartRows} />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Poster strip / carousel */}
            <Card sx={{ mt: 2 }} variant="outlined">
                <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                        Selected Movies ({compareList.length})
                    </Typography>

                    <Box display="flex" gap={2} sx={{ overflowX: "auto", pb: 1 }}>
                        {compareList.map(m => (
                            <PosterCard key={m.imdbID} movie={m} onRemove={() => removeFromCompare(m.imdbID)} />
                        ))}

                        {/* Add Movie */}
                        {compareList.length < 4 && (
                            <Box
                                onClick={() => setAddOpen(true)}
                                sx={{
                                    minWidth: 180,
                                    height: 240,
                                    border: "1px dashed rgba(0,0,0,0.25)",
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    opacity: 0.85,
                                }}
                            >
                                <Box textAlign="center">
                                    <AddIcon />
                                    <Typography variant="body2">Add Movie</Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>

            <Box display="flex" justifyContent="end" alignItems="end" flexWrap="wrap" gap={2} mt={2}>
                <Button
                    onClick={getCompare}
                    variant="contained"
                    startIcon={< SendIcon />}
                    disabled={compareList.length < 2}
                >
                    Compare
                </Button>
            </Box>
            <AddMovieModal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onSelect={handleAddMovie}
            />
        </Box>

    );
}

function StatBlock({ title, lines }) {
    return (
        <Box sx={{ minWidth: 260, flex: "1 1 260px", p: 2, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                {title}
            </Typography>
            {lines.map((t, idx) => (
                <Typography key={idx} variant="body2" sx={{ opacity: 0.9 }}>
                    {t}
                </Typography>
            ))}
        </Box>
    );
}

function PosterCard({ movie, onRemove }) {

    const poster = movie.Poster || "";

    return (
        <Box
            sx={{
                minWidth: 180,
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
            }}
        >
            <IconButton
                onClick={onRemove}
                size="small"
                sx={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    bgcolor: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                    "&:hover": {
                        bgcolor: "rgba(0,0,0,0.85)",
                    },
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            <Box
                sx={{
                    height: 200,
                    bgcolor: "rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {poster ? (
                    <img alt={movie.Title} src={poster} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        No poster
                    </Typography>
                )}
            </Box>
            <Box sx={{ p: 1.2 }}>
                <Typography variant="body2" fontWeight={700} noWrap title={movie.Title}>
                    {movie.Title}
                </Typography>
            </Box>
        </Box>
    );
}
