import {
    Alert,
    Box,
    Button,
    Card,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { useEffect, useMemo, useState } from "react";
import { useMovieDetails } from "../../hooks/useMovieDetails.jsx";
import { useWatchlist } from "../../context/WatchlistContext.jsx";

function getRottenTomatoes(ratings = []) {
    const rt = ratings.find((r) => r.Source === "Rotten Tomatoes");
    return rt?.Value ?? null;
}

export default function MovieDetailsModal({ open, imdbId, onClose, onCompare }) {
    const { data, loading, error } = useMovieDetails(imdbId, open);

    const { isInWatchlist, getItem, toggle, update } = useWatchlist?.() ?? {};

    const inWL = imdbId && isInWatchlist ? isInWatchlist(imdbId) : false;
    const wlItem = imdbId && getItem ? getItem(imdbId) : null;
    const [watched, setWatched] = useState(false);
    const [saving, setSaving] = useState(false);
    const [localError, setLocalError] = useState(null);


    useEffect(() => {
        setLocalError(null);
        setWatched(Boolean(wlItem?.watched));
    }, [imdbId, wlItem?.watched, open]);

    const rt = useMemo(() => getRottenTomatoes(data?.Ratings), [data]);

    const handleToggleWatchlist = async () => {
        setLocalError(null);
        setSaving(true);
        try {
            await toggle(imdbId);
        } catch (e) {
            setLocalError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCheck = async (nextWatched) => {
        setLocalError(null);
        setSaving(true);
        try {
            await update(imdbId, { watched: nextWatched });
        } catch (e) {
            setLocalError(e.message);
            setWatched((prev) => !prev);
        } finally {
            setSaving(false);
        }
    };

    const handleCompare = () => {
        onCompare?.(imdbId);
        onClose?.();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight={800}>Movie Details</Typography>
                <IconButton onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {loading && (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && (error || localError) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {localError || error?.message || "Failed to load movie details"}
                    </Alert>
                )}

                {!loading && data && (
                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "320px 1fr" }} gap={3}>
                        {/* Left Column */}
                        <Box>

                            <Box
                                component="img"
                                src={data.Poster}
                                alt={data.Title}
                                sx={{
                                    width: "100%",
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            />
                            <Card sx={{ p: 2 }} variant="outlined">
                                <Button
                                    fullWidth
                                    variant={inWL ? "contained" : "outlined"}
                                    startIcon={inWL ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                    onClick={handleToggleWatchlist}
                                >
                                    {inWL ? "Remove" : "Add"}
                                </Button>

                                {inWL && <FormControlLabel
                                    sx={{ mt: 1 }}
                                    control={<Checkbox
                                        checked={watched}
                                        onChange={(e) => {
                                            const next = e.target.checked;
                                            setWatched(next);
                                            handleCheck(next);
                                        }}
                                        disabled={saving}
                                    />}
                                    label="Watched"
                                />}
                            </Card>


                            {/* <Button
                                fullWidth
                                sx={{ mt: 1 }}
                                variant="contained"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save"}
                            </Button> */}

                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 1 }}
                                onClick={handleCompare}
                            >
                                Compare
                            </Button>

                        </Box>

                        {/* Right Column */}
                        <Box>
                            <Typography variant="h5" fontWeight={900}>
                                {data.Title}{" "}
                                <Typography component="span" color="text.secondary">
                                    ({data.Year})
                                </Typography>
                            </Typography>

                            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                {data.Genre} • {data.Runtime} • {data.Rated}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Box display="grid" gap={1}>
                                <Typography><b>IMDb:</b> {data.imdbRating}</Typography>
                                {rt && <Typography><b>Rotten Tomatoes:</b> {rt}</Typography>}
                                <Typography><b>Plot:</b> {data.Plot}</Typography>
                                <Typography><b>Director:</b> {data.Director}</Typography>
                                <Typography><b>Writers:</b> {data.Writer}</Typography>
                                <Typography>
                                    <b>Main cast:</b>{" "}
                                    {String(data.Actors || "").split(",").slice(0, 8).join(", ")}
                                </Typography>
                                <Typography><b>Language:</b> {data.Language}</Typography>
                                <Typography><b>Country:</b> {data.Country}</Typography>
                                <Typography><b>Box Office:</b> {data.BoxOffice}</Typography>
                                <Typography><b>Awards:</b> {data.Awards}</Typography>
                                <Typography><b>Release Date:</b> {data.Released}</Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
