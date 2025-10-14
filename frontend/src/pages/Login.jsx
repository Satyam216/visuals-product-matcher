import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  // ---- LOGIN FUNCTION ----
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => (window.location.href = "/"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // ---- VERIFY EMAIL EXISTS ----
  const handleEmailVerification = async (e) => {
    e.preventDefault();
    if (!resetEmail) return toast.error("Please enter your email");

    setResetLoading(true);
    try {
      const res = await API.post("/auth/verify-email", { email: resetEmail });
      if (res.data.exists) {
        toast.success("User verified! You can set a new password now.");
        setVerified(true);
      } else {
        toast.error("User not available");
      }
    } catch (err) {
      toast.error("Error verifying email");
    } finally {
      setResetLoading(false);
    }
  };

  // ---- UPDATE PASSWORD ----
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword)
      return toast.error("Please fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setResetLoading(true);
    try {
      const res = await API.post("/auth/reset-password", {
        email: resetEmail,
        newPassword,
      });

      toast.success(res.data.message || "Password updated successfully!");
      setForgotMode(false);
      setVerified(false);
      setResetEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error updating password");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0e0e0e] text-gray-100 px-6 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#121212]/80 backdrop-blur-md border border-gray-700 rounded-3xl shadow-lg p-8 sm:p-10 w-full max-w-sm sm:max-w-md"
      >
        <h2 className="text-center text-2xl sm:text-3xl font-light mb-10 tracking-wide text-gray-300">
          Member Login
        </h2>

        {/* --- FORGOT PASSWORD SECTION --- */}
        {forgotMode ? (
          <>
            {!verified ? (
              // STEP 1: VERIFY EMAIL
              <form onSubmit={handleEmailVerification} className="space-y-5">
                <div className="flex items-center border-b border-gray-600 pb-2">
                  <Mail className="text-gray-400 w-5 h-5 mr-3" />
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-transparent text-gray-200 placeholder-gray-500 border-none focus:ring-0 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full border border-gray-600 text-gray-200 py-2 rounded-lg hover:bg-gray-800 transition-all"
                >
                  {resetLoading ? "Verifying..." : "Verify Email"}
                </button>
              </form>
            ) : (
              // STEP 2: UPDATE PASSWORD
              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div className="flex items-center border-b border-gray-600 pb-2">
                  <Lock className="text-gray-400 w-5 h-5 mr-3" />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent text-gray-200 placeholder-gray-500 border-none focus:ring-0 outline-none"
                  />
                </div>

                <div className="flex items-center border-b border-gray-600 pb-2">
                  <Lock className="text-gray-400 w-5 h-5 mr-3" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent text-gray-200 placeholder-gray-500 border-none focus:ring-0 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full border border-gray-600 text-gray-200 py-2 rounded-lg hover:bg-gray-800 transition-all"
                >
                  {resetLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}

            <p
              className="text-sm text-gray-400 text-center mt-5 cursor-pointer hover:underline"
              onClick={() => {
                setForgotMode(false);
                setVerified(false);
                setResetEmail("");
              }}
            >
              Back to Login
            </p>
          </>
        ) : (
          // --- LOGIN FORM ---
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex items-center border-b border-gray-600 pb-2">
              <Mail className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-gray-200 placeholder-gray-500 border-none focus:ring-0 outline-none"
                required
              />
            </div>

            <div className="flex items-center border-b border-gray-600 pb-2">
              <Lock className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-gray-200 placeholder-gray-500 border-none focus:ring-0 outline-none"
                required
              />
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-gray-400 scale-90 sm:scale-100"
                />{" "}
                Remember me
              </label>
              <span
                onClick={() => setForgotMode(true)}
                className="hover:underline cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-gray-600 text-gray-200 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Logging in..." : <>LOGIN <LogIn size={18} /></>}
            </button>
          </form>
        )}

        {!forgotMode && (
          <p className="text-xs sm:text-sm text-center mt-8 text-gray-400">
            Don’t have an account?{" "}
            <a href="/signup" className="text-gray-200 underline hover:text-white">
              Create one
            </a>
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default Login;
