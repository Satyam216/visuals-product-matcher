import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Router>
        <Routes>
          {/* ✅ If logged in, go to Home; otherwise show Landing */}
          <Route path="/" element={token ? <Home /> : <Landing />} />

          {/* ✅ Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Redirect all unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>

      {/* ✅ Toast notifications — available globally */}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
  