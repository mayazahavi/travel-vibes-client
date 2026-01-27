import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {
  fetchUserTrips,
  selectTrips,
  setCurrentTrip,
  setTrips,
} from "./store/slices/tripsSlice";
import { selectIsAuthenticated } from "./store/slices/authSlice";

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const CurrentHeader = isHomePage || isAuthPage ? HeaderHome : Header;

  const dispatch = useDispatch();
  const trips = useSelector(selectTrips);
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [savedTrips, setSavedTrips] = useLocalStorage("travel_vibes_trips", []);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const savedTripsRef = useRef(savedTrips);

  useEffect(() => {
    savedTripsRef.current = savedTrips;
  }, [savedTrips]);

  // Fetch trips from server when user logs in
  useEffect(() => {
    if (!isAuthenticated) return;

    dispatch(fetchUserTrips()).catch((err) => {
      console.error("Failed to fetch trips:", err);
      // Fallback to localStorage on error
      const cachedTrips = savedTripsRef.current;
      if (cachedTrips && cachedTrips.length > 0) {
        dispatch(setTrips(cachedTrips));
        const lastTrip = cachedTrips[cachedTrips.length - 1];
        if (lastTrip) {
          dispatch(setCurrentTrip(lastTrip._id || lastTrip.id));
        }
      }
    });
  }, [dispatch, isAuthenticated]);
  useEffect(() => {
    if (trips.length > 0) {
      setSavedTrips(trips);
    }
  }, [trips, setSavedTrips]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/create-trip"
          element={
            <ProtectedRoute>
              <CreateTripPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-trips"
          element={
            <ProtectedRoute>
              <MyTripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itinerary"
          element={
            <ProtectedRoute>
              <ItineraryPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="appRoot">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </div>
  );
}

export default App;
