import "./App.css";
import Navbar from "./components/Navbar";
import SEOFooter from "./components/AppFooter";
import SEODashboard from "./pages/DisplayVisual";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import BlogAnalysis from "./pages/BlogAnalysis";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/compare" element={<SEODashboard />} />
        <Route path="/content-optimizer" element={<BlogAnalysis />} />
      </Routes>
      <SEOFooter />
    </>
  );
}

export default App;
