import { Box, Button, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { useWatchlist } from "../../context/WatchlistContext";
import MovieItemCard from "../Movie/MovieItemCard";

export default function WatchlistSection({ onViewAll, onSelectMovie }) {
    const { items, loading, toggle } = useWatchlist();

    const preview = items.slice(0, 3);

    return (
        <Card sx={{ mt: 4 }} variant="outlined">
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                    <Typography variant="h6">
                        Watchlist {items?.length ? `(${items.length})` : ""}
                    </Typography>

                    <Button variant="outlined" onClick={onViewAll ?? (() => { })}>
                        View all
                    </Button>
                </Box>

                <Box mt={2}>
                    {loading && (
                        <Box display="flex" gap={2} sx={{ overflowX: "auto", pb: 1 }}>
                            <Skeleton variant="rounded" width={240} height={420} />
                            <Skeleton variant="rounded" width={240} height={420} />
                            <Skeleton variant="rounded" width={240} height={420} />
                        </Box>
                    )}

                    {!loading && items.length === 0 && (
                        <Typography color="text.secondary">
                            Your watchlist is empty. Add movies from search above.
                        </Typography>
                    )}

                    {!loading && items.length > 0 && (
                        <Box display="flex" gap={2} sx={{ overflowX: "auto", pb: 1 }}>
                            {preview.map((it) => (
                                <MovieItemCard
                                    key={it.imdbId}
                                    item={it}
                                    onClick={() => onSelectMovie?.(it.imdbId)}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
