import {
    Box,
    Skeleton,
    Typography,
} from "@mui/material";
import WatchlistGridCard from "./WatchlistGridCard";

export default function WatchlistGrid({ items, loading, onOpen, onDelete, onToggleWatched, onRate, onCompare }) {
    if (loading) {
        return (
            <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={340} />
                ))}
            </Box>
        );
    }

    if (!items.length) {
        return (
            <Typography color="text.secondary">
                No items. Add movies from the search on Home.
            </Typography>
        );
    }

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(205px, 1fr))"
            gap={1}
        >
            {items.map((it) => (
                <WatchlistGridCard
                    key={it.imdbId}
                    item={it}
                    onDelete={onDelete}
                    onRate={onRate}
                    onToggleWatched={onToggleWatched}
                    onCompare={onCompare}
                />
            ))}
        </Box>
    );
}
