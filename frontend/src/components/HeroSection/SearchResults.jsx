import { Box } from "@mui/material";
import MovieItem from "../Movie/MovieItem";


export default function SearchResults({ results }) {
    return (
        <Box maxWidth={800} mx="auto">
            {results.slice(0, 10).map((movie) => (
                <MovieItem key={movie.imdbID} movie={movie} />
            ))}
        </Box>
    )
}