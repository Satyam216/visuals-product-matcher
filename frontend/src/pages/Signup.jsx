import { useState } from "react";
import { toast } from "react-hot-toast";
import API from "../api";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/signup", { name, email, password });
      toast.success("Account created successfully! Redirecting...");
      setTimeout(() => (window.location.href = "/login"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#161616] to-[#0d0d0d] text-gray-100 px-6 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#141414]/80 backdrop-blur-md border border-gray-700 rounded-3xl shadow-lg p-8 sm:p-10 w-full max-w-sm sm:max-w-md"
      >
        <h2 className="text-center text-2xl sm:text-3xl font-light mb-10 tracking-wide text-gray-300">
          Create Your Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-6">
          
          <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2.5 hover:border-gray-500 transition">
            <User className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-gray-200 placeholder-gray-500 border-none outline-none focus:ring-0"
              required
            />
          </div>

          
          <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2.5 hover:border-gray-500 transition">
            <Mail className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-gray-200 placeholder-gray-500 border-none outline-none focus:ring-0"
              required
            />
          </div>

          
          <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2.5 hover:border-gray-500 transition relative">
            <Lock className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-gray-200 placeholder-gray-500 border-none outline-none focus:ring-0"
              required
            />
            <div
              className="absolute right-3 cursor-pointer text-gray-400 hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          
          <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2.5 hover:border-gray-500 transition relative">
            <Lock className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent text-gray-200 placeholder-gray-500 border-none outline-none focus:ring-0"
              required
            />
            <div
              className="absolute right-3 cursor-pointer text-gray-400 hover:text-gray-200"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-gray-600 text-gray-200 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 font-medium"
          >
            {loading ? "Creating account..." : <>SIGN UP <UserPlus size={18} /></>}
          </button>

          
          <p className="text-xs sm:text-sm text-center mt-8 text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-gray-200 underline hover:text-white">
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup;
