import { useNavigate } from "react-router-dom";
import RecentComparisonsSection from "../components/Comparsions/RecentComparisonsSection";
import HeroSection from "../components/HeroSection/HeroSection";
import WatchlistSection from "../components/Watchlist/WatchlistSection";


export default function Home() {
    const navigate = useNavigate()
    return (
        <>
            <HeroSection />
            <WatchlistSection
                onViewAll={() => navigate("/watchlist")}
                onSelectMovie={(movie) => console.log("Select", movie)}
            />
            <RecentComparisonsSection
                onNewComparison={() => navigate("/compare")}
            />
        </>

    );
}
