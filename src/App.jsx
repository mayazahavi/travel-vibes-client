import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header.jsx";
import HeaderHome from "./components/HeaderHome.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import VibesPage from "./pages/VibesPage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import CreateTripPage from "./pages/CreateTripPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import MyTripsPage from "./pages/MyTripsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const CurrentHeader = isHomePage ? HeaderHome : Header;

  return (
    <FavoritesProvider>
      <CurrentHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vibes" element={<VibesPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/my-trips" element={<MyTripsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </FavoritesProvider>
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
