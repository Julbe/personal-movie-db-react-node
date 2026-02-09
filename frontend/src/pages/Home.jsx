import RecentComparisonsSection from "../components/Comparsions/RecentComparisonsSection";
import HeroSection from "../components/HeroSection/HeroSection";
import WatchlistSection from "../components/Watchlist/WatchlistSection";


export default function Home() {
    return (
        <>
            <HeroSection />
            <WatchlistSection
                onViewAll={() => console.log("Go to /watchlist")}
                onSelectMovie={(movie) => console.log("Select", movie)}
            />
            <RecentComparisonsSection
                onNewComparison={() => console.log("Go to /comparison page")}
            />
        </>

    );
}
