import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import ProductCard from "../components/ProductCard";
import {
  Upload,
  Image as ImageIcon,
  LogOut,
  Loader2,
  LogIn,
  UserPlus,
  Github,
  Linkedin,
} from "lucide-react";
import { toast } from "react-hot-toast";

function Home() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(0);
  const [token] = useState(localStorage.getItem("token"));

  const handleUpload = async () => {
    if (!token) {
      toast.error("Please login first to use this feature!");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    if (!file && !imageUrl) {
      toast.error("Please upload a file or enter an image URL.");
      return;
    }

    setLoading(true);
    toast.loading("Analyzing image...");

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (imageUrl) formData.append("image_url", imageUrl);

    try {
      const res = await API.post("/upload", formData);
      const matches = res.data.matches || [];

      if (matches.length === 0) toast.error("No similar products found.");
      else toast.success(`Found ${matches.length} similar product(s)!`);

      setResults(matches);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Error uploading image.");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  //Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => window.location.reload(), 800);
  };

  //File/URL Input
  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setImageUrl("");
    setPreview(URL.createObjectURL(selected));
    toast("Image selected for upload.", { icon: "🖼️" });
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setFile(null);
    setPreview(url);
  };

  const filteredResults = results.filter((p) => p.similarity >= filter);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-black via-[#0d0d0d] to-[#1c1c1c] text-gray-100 p-6 sm:p-10 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-12">
        <h1 className="text-5xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-300 via-white to-gray-5 00 bg-clip-text text-transparent tracking-wide drop-shadow-[0_0_25px_rgba(255,255,255,0.25)] text-center sm:text-left select-none">
          <span className="bg-gradient-to-r from-gray-80 via-white to-gray-200 bg-clip-text text-transparent animate-pulse">
            Visual Product Matcher
          </span>
        </h1>

        {!token ? (
          <div className="flex items-center gap-4 mt-6 sm:mt-0">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white px-5 py-2.5 rounded-xl font-medium hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all"
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-300 to-gray-200 text-black px-5 py-2.5 rounded-xl font-medium hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
            >
              <UserPlus className="w-4 h-4" /> Sign Up
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-black px-5 py-2.5 rounded-xl font-semibold text-gray-100 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        )}
      </div>

      
      <div className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-gray-700 shadow-[0_0_25px_rgba(255,255,255,0.08)] rounded-3xl w-full max-w-2xl p-10 space-y-6 hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-all">
        <div
          className="border-2 border-dashed border-gray-600 rounded-2xl p-12 flex flex-col items-center justify-center hover:bg-gray-800/40 transition-all cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setFile(e.dataTransfer.files[0]);
            setPreview(URL.createObjectURL(e.dataTransfer.files[0]));
            toast("Image selected for upload.", { icon: "📥" });
          }}
        >
          <Upload className="w-16 h-16 text-gray-300 mb-4 animate-pulse" />
          <p className="text-gray-200 mb-2 text-lg font-medium">
            Drag & drop an image here
          </p>
          <p className="text-sm text-gray-500 mb-2">or</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer text-gray-100 font-semibold hover:underline"
          >
            Browse files
          </label>
        </div>

        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Or paste an image URL"
            value={imageUrl}
            onChange={handleUrlChange}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-500 outline-none"
          />
        </div>

        {preview && (
          <div className="w-full mt-4">
            <img
              src={preview}
              alt="preview"
              className="rounded-2xl w-full h-[380px] object-cover shadow-lg border border-gray-700"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-gray-200 to-gray-400 text-black py-3 rounded-xl font-semibold flex justify-center items-center gap-2 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Processing...
            </>
          ) : (
            "Find Similar Products"
          )}
        </button>
      </div>

      
      {token && results.length > 0 && (
        <div className="w-full max-w-6xl mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-100 mb-2 sm:mb-0">
              Top Matches
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-400">
              <label className="text-gray-300 font-medium">
                Similarity Filter
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={filter}
                  onChange={(e) => setFilter(Number(e.target.value))}
                  className="w-20 bg-transparent border border-gray-600 rounded-lg px-2 py-1 text-center text-gray-100 focus:ring-1 focus:ring-gray-400 outline-none"
                />
                <span className="text-gray-400 text-xs italic">
                  (Insert similarity value)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResults.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        </div>
      )}

      {!token && (
        <div className="text-center text-gray-400 mt-16">
          <p className="text-lg font-medium">
          Please login or sign up to explore Visual Product Matcher.
          </p>
        </div>
      )}

      
      <footer className="mt-20  text-center text-gray-400 text-sm">
        <div className="flex justify-center gap-6 mb-2">
          <a
            href="https://github.com/Satyam216"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com/in/satyamjain216"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Linkedin size={24} />
          </a>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm">
          Made with ❤️ by <span className="text-gray-300 font-semibold">Satyam Jain</span>  
          <br />from VIT Bhopal University
        </p>
      </footer>
    </div>
  );
}

export default Home;
