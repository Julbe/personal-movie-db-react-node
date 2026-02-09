import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useWatchlist } from "../context/WatchlistContext";
import MovieDetailsModal from "../components/Movie/MovieDetailsModal";
import WatchlistList from "../components/Watchlist/WatchlistList";
import WatchlistGrid from "../components/Watchlist/WatchlistGrid";
import StatisticsDashboard from "../components/Watchlist/StatisticsDashboard";
import { useNavigate } from "react-router-dom";


export default function WatchlistPage() {
    const { items, allItems, loading, refresh, toggle, update, refreshAll } = useWatchlist();

    const [view, setView] = useState("grid");

    const [query, setQuery] = useState("");
    const [watched, setWatched] = useState("all");
    const [sort, setSort] = useState("dateAdded");
    const [order, setOrder] = useState("desc");

    const [error, setError] = useState(null);

    const [selectedImdbId, setSelectedImdbId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setError(null);
        const params = {
            sort,
            order,
            filter: query || undefined,
            watched: watched === "all" ? undefined : watched,
        };

        refresh(params).catch((e) => setError(e.message || "Failed to load watchlist"));
    }, [sort, order, watched, query]);

    const handleSearch = async () => {
        setError(null);
        try {
            await refresh({
                sort,
                order,
                filter: query || undefined,
                watched: watched === "all" ? undefined : watched,
            });
        } catch (e) {
            setError(e.message || "Failed to search watchlist");
        }
    };

    const count = items.length;

    const handleDelete = async (imdbId) => {
        setError(null);
        try {
            await toggle(imdbId);
            await refreshAll();
        } catch (e) {
            setError(e.message || "Failed to remove item");
        }
    };

    const handleToggleWatched = async (imdbId, next) => {
        setError(null);
        try {
            await update(imdbId, { watched: next });
            await refreshAll();
        } catch (e) {
            setError(e.message || "Failed to update watched");
        }
    };

    const handleRate = async (imdbId, nextRating) => {
        setError(null);
        try {
            await update(imdbId, { myRating: nextRating });
            await refreshAll();
        } catch (e) {
            setError(e.message || "Failed to update rating");
        }
    };

    const handleCompare = async (id) => navigate(`/compare?id=${encodeURIComponent(id)}`);


    return (
        <Box mt={4}>
            <Box display="flex" justifyContent="space-between" alignItems="end" gap={2} flexWrap="wrap">
                <Box>
                    <Typography variant="h4" fontWeight={900}>
                        My Watchlist ({count})
                    </Typography>
                </Box>

                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={(_, v) => v && setView(v)}
                    size="small"
                >
                    <ToggleButton value="grid">Grid</ToggleButton>
                    <ToggleButton value="list">List</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box mt={2}>
                <StatisticsDashboard watchlist={allItems} />
            </Box>

            <Card sx={{ mt: 2 }} variant="outlined">
                <CardContent>
                    <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">

                        <FormControl sx={{ minWidth: 160 }}>
                            <InputLabel>Watched</InputLabel>
                            <Select
                                label="Watched"
                                value={watched}
                                onChange={(e) => setWatched(e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value={true}>Watched</MenuItem>
                                <MenuItem value={false}>Unwatched</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 160 }}>
                            <InputLabel>Filter</InputLabel>
                            <Select label="Filter" value={query} onChange={(e) => setQuery(e.target.value)}>
                                <MenuItem value="movie">Movie</MenuItem>
                                <MenuItem value="series">Series</MenuItem>
                                <MenuItem value="episode">Episode</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 160 }}>
                            <InputLabel>Sort</InputLabel>
                            <Select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                                <MenuItem value="dateAdded">Date added</MenuItem>
                                <MenuItem value="title">Title</MenuItem>
                                <MenuItem value="year">Year</MenuItem>
                                <MenuItem value="rating">Rating</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 140 }}>
                            <InputLabel>Order</InputLabel>
                            <Select label="Order" value={order} onChange={(e) => setOrder(e.target.value)}>
                                <MenuItem value="desc">Desc</MenuItem>
                                <MenuItem value="asc">Asc</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {error && (
                        <Alert sx={{ mt: 2 }} severity="error">
                            {error}
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <Box mt={3}>
                {view === "grid" ? (
                    <WatchlistGrid
                        items={items}
                        loading={loading}
                        onOpen={(imdbId) => setSelectedImdbId(imdbId)}
                        onDelete={handleDelete}
                        onRate={handleRate}
                        onCompare={handleCompare}
                        onToggleWatched={handleToggleWatched}
                    />
                ) : (
                    <WatchlistList
                        items={items}
                        loading={loading}
                        onOpen={(imdbId) => setSelectedImdbId(imdbId)}
                        onDelete={handleDelete}
                        onToggleWatched={handleToggleWatched}
                    />
                )}
            </Box>

            <MovieDetailsModal
                open={Boolean(selectedImdbId)}
                imdbId={selectedImdbId}
                onClose={() => setSelectedImdbId(null)}
                onCompare={(id) => handleCompare(id)}
            />
        </Box>
    );
}
