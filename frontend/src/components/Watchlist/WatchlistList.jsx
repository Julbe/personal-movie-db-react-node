import {
    Avatar,
    Box,
    Checkbox,
    IconButton,
    Skeleton,
    Tooltip,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function WatchlistList({ items, loading, onOpen, onDelete, onToggleWatched }) {
    if (loading) {
        return (
            <Box>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} height={72} />
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
        <Box>
            {items.map((it) => {
                const title = it.title ?? it.Title ?? it.imdbId;
                const year = it.year ?? it.Year ?? "";
                const poster = it.poster ?? it.Poster ?? "";
                const watched = Boolean(it.watched);

                return (
                    <Box
                        key={it.imdbId}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        borderBottom="1px solid"
                        borderColor="divider"
                        py={1.5}
                        onClick={() => onOpen?.(it.imdbId)}
                        sx={{ cursor: "pointer" }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar variant="rounded" src={poster} alt={title} sx={{ width: 44, height: 60 }} />
                            <Box>
                                <Typography fontWeight={800}>{title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {year}
                                </Typography>
                            </Box>
                        </Box>

                        <Box onClick={(e) => e.stopPropagation()} display="flex" alignItems="center" gap={1}>
                            <Tooltip title="Watched">
                                <Checkbox
                                    checked={watched}
                                    onChange={(e) => onToggleWatched?.(it.imdbId, e.target.checked)}
                                />
                            </Tooltip>

                            <Tooltip title="Remove">
                                <IconButton onClick={() => onDelete?.(it.imdbId)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}
