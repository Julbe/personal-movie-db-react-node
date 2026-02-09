import { Box, Typography } from "@mui/material";

export default function ComparePage() {
    return (
        <Box mt={4}>
            <Typography variant="h4" fontWeight={800}>
                Compare
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
                Coming soon: carousel, add movie modal, graph.
            </Typography>
        </Box>
    );
}
