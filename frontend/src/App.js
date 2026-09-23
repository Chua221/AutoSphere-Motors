import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CarListing from "./pages/CarListing";
import CarDetails from "./pages/CarDetails";
import AddCarListing from "./pages/AddCarListing";
import EditCarListing from "./pages/EditCarListing";
import Profile from "./pages/Profile";
import OAuthCallback from "./pages/OAuthCallback";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cars" element={<CarListing />} />
          <Route path="/cars/new" element={<ProtectedRoute><AddCarListing /></ProtectedRoute>} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/cars/:id/edit" element={<ProtectedRoute><EditCarListing /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
