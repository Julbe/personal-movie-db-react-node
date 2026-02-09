import { Avatar, Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";

// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';

export default function MovieItem({ movie,
    onSelect, onQuickAdd, isInWatchlist = false, saving = false }) {
    return (
        <Box
            onClick={() => onSelect(movie)}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid #eee"
            py={2}
        >
            <Avatar
                variant="rounded"
                src={movie.Poster}
                alt={movie.title}
                sx={{
                    width: 60,
                    height: 80,
                    backgroundColor: '#333',
                    fontSize: 12,
                }}
            />
            <Box>
                <Typography variant="subtitle1">
                    {movie.Title} ({movie.Year})
                </Typography>

                <Chip
                    label={movie.Type === "movie" ? "Movie" : "Series"}
                    size="small"
                    sx={{ mt: 1 }}
                />
            </Box>
            <Box
                onClick={(e) => e.stopPropagation()}
                display="flex"
                gap={1}
            >
                {isInWatchlist && (<Tooltip title="Is In watchlist">
                    <IconButton
                        color="primary"
                    >
                        <FavoriteIcon />
                    </IconButton>
                </Tooltip>)
                }
                {!isInWatchlist && (
                    <Tooltip title="Quick add to watchlist">
                        <IconButton
                            onClick={() => onQuickAdd(movie)}
                            color="primary"
                            disabled={saving}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
}