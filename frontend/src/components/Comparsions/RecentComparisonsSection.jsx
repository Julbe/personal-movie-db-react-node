import { Box, Button, Card, CardContent, Chip, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { comparisonsApi } from "../../api/comparisons.api.js";

export default function RecentComparisonsSection({ onNewComparison }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const data = await comparisonsApi.recent();
                if (alive) setItems(Array.isArray(data) ? data : []);
            } catch {
                if (alive) setItems([]);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    if (loading) {
        return (
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Recent Comparisons</Typography>
                    <Skeleton height={70} />
                </CardContent>
            </Card>
        );
    }

    if (!items.length) return null;

    return (
        <Card sx={{ mt: 4 }} variant="outlined">
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                    <Typography variant="h6">
                        Recent Comparisons
                    </Typography>

                    <Button variant="outlined" onClick={onNewComparison ?? (() => { })}>
                        NEW
                    </Button>
                </Box>

                <Box display="flex" mt={2} gap={2} sx={{ overflowX: "auto", pb: 1 }}>
                    {items.map((c, idx) => (
                        <Card
                            key={idx}
                            variant="outlined"
                            sx={{
                                minWidth: 280,
                                flex: "0 0 auto",
                                borderRadius: 2,
                            }}
                        >
                            <CardContent>
                                <Typography fontWeight={800}>
                                    {c.movieCount} movies
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {new Date(c.comparedAt).toLocaleString()}
                                </Typography>

                                <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                                    {(c.titles ?? []).map((t) => (
                                        <Chip key={t} label={t} size="small" title={t} />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}
