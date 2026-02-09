import React, { useMemo } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Stack,
    Divider,
    Chip,
} from "@mui/material";
import { computeWatchlistStats } from "../compute.helper";

export default function StatisticsDashboard({ watchlist }) {
    const stats = useMemo(() => computeWatchlistStats(watchlist), [watchlist]);

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Statistics Dashboard
            </Typography>

            <Stack spacing={2}>
                {/* Top row */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <StatCard title="Total" value={stats.total} sub="Items in watchlist" />
                    <StatCard title="Watched" value={stats.watchedCount} sub="Completed" />
                    <StatCard title="Unwatched" value={stats.unwatchedCount} sub="Pending" />
                </Stack>

                {/* Progress + avg rating + runtime */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Card sx={{ flex: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Progress
                            </Typography>

                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="body2">
                                    {stats.watchedCount}/{stats.total} watched
                                </Typography>
                                <Typography variant="body2">{stats.progress}%</Typography>
                            </Stack>

                            <LinearProgress
                                variant="determinate"
                                value={stats.progress}
                                sx={{ height: 10, borderRadius: 999 }}
                            />
                        </CardContent>
                    </Card>

                    <StatCard
                        title="Average rating"
                        value={stats.avgRating ?? "—"}
                        sub={stats.avgRating == null ? "No ratings yet" : "Based on rated items"}
                        sx={{ flex: 1 }}
                    />

                    <StatCard
                        title="Runtime (hours)"
                        value={stats.totalRuntimeHours}
                        sub="Sum of known runtimes"
                        sx={{ flex: 1 }}
                    />
                </Stack>

                {/* Quick stats by type */}
                <Card>
                    <CardContent>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Quick stats by type
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip label={`Movies: ${stats.byType.movies}`} />
                            <Chip label={`Series: ${stats.byType.series}`} />
                            {stats.byType.other > 0 && <Chip label={`Other: ${stats.byType.other}`} />}
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
}

function StatCard({ title, value, sub, sx }) {
    return (
        <Card sx={{ flex: 1, ...sx }}>
            <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {value}
                </Typography>
                {sub && (
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                        {sub}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
