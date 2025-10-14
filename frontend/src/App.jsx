import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Router>
        <Routes>
          {/* ✅ If logged in, go to Home; otherwise show Landing */}
          <Route path="/" element={<Home/>}/>

          {/* ✅ Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Redirect all unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>

      {/* ✅ Toast notifications — available globally */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #2e2e2e",
            borderRadius: "12px",
            fontSize: "15px",
            padding: "12px 18px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e", // green
              secondary: "#111",
            },
            style: {
              background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
              border: "1px solid #22c55e40",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // red
              secondary: "#111",
            },
            style: {
              background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
              border: "1px solid #ef444440",
            },
          },
          loading: {
            iconTheme: {
              primary: "#3b82f6", // blue
              secondary: "#111",
            },
            style: {
              background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
              border: "1px solid #3b82f640",
            },
          },
        }}
      />
    </>
  );
}

export default App;
  