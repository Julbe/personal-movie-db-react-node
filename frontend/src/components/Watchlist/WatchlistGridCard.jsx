import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Checkbox,
    IconButton,
    Rating,
    Tooltip,
    Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CompareIcon from "@mui/icons-material/CompareArrows";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";

import { useState } from "react";

export default function WatchlistGridCard({
    item,
    onDelete,
    onToggleWatched,
    onRate,
    onCompare,
}) {
    const [showInfo, setShowInfo] = useState(false);

    const title = item.title ?? item.Title ?? item.imdbId;
    const year = item.year ?? item.Year ?? "";
    const type = item.type ?? item.Type ?? "movie";
    const poster = item.poster ?? item.Poster ?? "";
    const watched = Boolean(item.watched);
    const imdbRating = item.imdbRating;

    return (
        <Card variant="outlined">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: 310,
                }}
            >
                {/* BODY */}
                {!showInfo ? (
                    <>
                        {poster ? (
                            <CardMedia component="img" height="260" image={poster} alt={title} />
                        ) : (
                            <Box height={260} display="flex" alignItems="center" justifyContent="center">
                                <Typography color="text.secondary">No poster</Typography>
                            </Box>
                        )}
                    </>
                ) : (
                    <CardContent>
                        <Typography fontWeight={800}>{title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {year} • {type}
                        </Typography>

                        {imdbRating && (
                            <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                                <StarIcon fontSize="small" />
                                <Typography>{imdbRating} (IMDb)</Typography>
                            </Box>
                        )}

                        <Box display="flex" alignItems="center" gap={1} mt={1} flexWrap="wrap">
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 20 }}>
                                Your Rating
                            </Typography>

                            <Rating
                                max={10}
                                value={item.myRating ?? 0}
                                size="small"
                                onChange={(_, newValue) => {
                                    const next = newValue ?? null;
                                    onRate?.(item.imdbId, next);
                                }}
                            />

                            <Typography variant="body2" color="text.secondary">
                                {item.myRating ? `${item.myRating}/10` : "—"}
                            </Typography>
                        </Box>



                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <Checkbox
                                checked={watched}
                                onChange={(e) => onToggleWatched?.(item.imdbId, e.target.checked)}
                            />
                            <Typography>Watched</Typography>
                        </Box>
                    </CardContent>
                )}

                {/* ACTION BAR */}
                <Box display="flex" borderTop="0.5px solid" borderColor="divider" justifyContent="space-between" mt="auto" px={1} pt={1}>
                    {!showInfo ? (
                        <Tooltip title="View info">
                            <IconButton size="small" onClick={() => setShowInfo(true)}>
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Back">
                            <IconButton size="small" onClick={() => setShowInfo(false)}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip title="Compare">
                        <IconButton size="small" onClick={() => onCompare?.(item.imdbId)}>
                            <CompareIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => onDelete?.(item.imdbId)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

        </Card>
    );
}
