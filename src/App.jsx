import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { FavoritesProvider } from "./context/FavoritesContext"; // Removing Context
import useLocalStorage from "./hooks/useLocalStorage";
import Header from "./components/Header.jsx";
import HeaderHome from "./components/HeaderHome.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import VibesPage from "./pages/VibesPage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import CreateTripPage from "./pages/CreateTripPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import MyTripsPage from "./pages/MyTripsPage.jsx";
import ItineraryPage from "./pages/ItineraryPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { selectTrips, setTrips, setCurrentTrip } from "./store/slices/tripsSlice";

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const CurrentHeader = isHomePage ? HeaderHome : Header;

  const dispatch = useDispatch();
  const trips = useSelector(selectTrips);

  // Use custom hook for theme persistence
  const [theme, setTheme] = useLocalStorage("theme", "light");
  
  // Use custom hook for trips persistence (includes favorites)
  const [savedTrips, setSavedTrips] = useLocalStorage("travel_vibes_trips", []);

  // Sync saved trips to Redux on mount (hydration)
  useEffect(() => {
    if (savedTrips && savedTrips.length > 0) {
      dispatch(setTrips(savedTrips));
      // Restore the most recent trip as active to ensure favorites are visible
      const lastTrip = savedTrips[savedTrips.length - 1];
      if (lastTrip) {
        dispatch(setCurrentTrip(lastTrip.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Sync Redux trips to local storage when they change
  useEffect(() => {
    setSavedTrips(trips);
  }, [trips, setSavedTrips]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <CurrentHeader theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vibes" element={<VibesPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/my-trips" element={<MyTripsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </div>
  );
}

export default App;
