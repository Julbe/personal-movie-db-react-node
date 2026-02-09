import { Box, Typography } from "@mui/material";

export default function WatchlistPage() {
    return (
        <Box mt={4}>
            <Typography variant="h4" fontWeight={800}>
                Watchlist
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
                Coming soon: filters, grid/list, stats.
            </Typography>
        </Box>
    );
}
