import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import HeaderHome from "./components/HeaderHome.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import VibesPage from "./pages/VibesPage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import CreateTripPage from "./pages/CreateTripPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signin";
  const CurrentHeader = (isHomePage || isAuthPage) ? HeaderHome : Header;

  return (
    <>
      <CurrentHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/vibes" element={<VibesPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
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
