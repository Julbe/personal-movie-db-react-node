import { Box, Typography } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

function ChartCard({ title, data, dataKey, valueFormatter }) {
    return (
        <Box
            sx={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 2,
                p: 2,
                minHeight: 320,
                flex: "1 1 420px",
            }}
        >
            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                {title}
            </Typography>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" tick={{ fontSize: 11 }} interval={0} />
                    <YAxis />
                    <Tooltip formatter={(v) => (valueFormatter ? valueFormatter(v) : v)} />

                    <Bar dataKey={dataKey} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default function ComparisonCharts({ chartRows = [] }) {
    const ratings = chartRows.filter((r) => Number.isFinite(r.rating));
    const runtime = chartRows.filter((r) => Number.isFinite(r.runtime));
    const metascore = chartRows.filter((r) => Number.isFinite(r.metascore));
    const boxOffice = chartRows.filter((r) => Number.isFinite(r.boxOffice));

    return (
        <Box display="flex" flexWrap="wrap" gap={2} sx={{ mt: 2 }}>
            <ChartCard title="IMDb Rating" data={ratings} dataKey="rating" />

            <ChartCard
                title="Runtime (minutes)"
                data={runtime}
                dataKey="runtime"
                valueFormatter={(v) => `${v} min`}
            />

            <ChartCard title="Metascore" data={metascore} dataKey="metascore" />

            {boxOffice.length > 0 && (
                <ChartCard
                    title="Box Office (USD)"
                    data={boxOffice}
                    dataKey="boxOffice"
                    valueFormatter={(v) => `$${Number(v).toLocaleString()}`}
                />
            )}
        </Box>
    );
}
