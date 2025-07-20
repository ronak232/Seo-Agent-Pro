import "./App.css";
import Navbar from "./components/Navbar";
import SEOFooter from "./components/SEOFooter";
import SEODashboard from "./pages/DisplayVisual";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/home" element={<Home />} />
        <Route path="/seo-tool" element={<SEODashboard />} />
      </Routes>
      <SEOFooter/>
    </>
  );
}

export default App;
