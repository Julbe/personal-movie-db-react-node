import React from "react";
import { WatchlistProvider } from "./WatchlistContext";

export default function AppProviders({ children }) {
    return (
        <WatchlistProvider>{children}</WatchlistProvider>
    );
}