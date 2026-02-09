import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Typography } from "@mui/material";

export default function MovieItemCard({ item, onClick }) {
    const title = item.title ?? item.Title ?? item.imdbId;
    const year = item.year ?? item.Year ?? "";
    const type = item.type ?? item.Type ?? "movie";
    const poster = item.poster ?? item.Poster ?? "";

    return (
        <Card sx={{ width: 240, flex: "0 0 auto" }} variant="outlined">
            <CardActionArea onClick={onClick}>
                {poster ? (
                    <CardMedia component="img" height="320" image={poster} alt={title} />
                ) : (
                    <Box
                        height={320}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ bgcolor: "grey.900", color: "grey.100" }}
                    >
                        <Typography variant="body2">No poster</Typography>
                    </Box>
                )}

                <CardContent>
                    <Typography fontWeight={800} noWrap title={title}>
                        {title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {year}
                    </Typography>

                    <Chip
                        label={type === "movie" ? "Movie" : "Series"}
                        size="small"
                        sx={{ mt: 1 }}
                    />
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
