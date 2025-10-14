import { useState } from "react";
import API from "../api";
import ProductCard from "../components/ProductCard";
import { Upload, Image as ImageIcon, LogOut, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

function Home() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(0);

  const handleUpload = async () => {
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

      if (matches.length === 0) {
        toast.error("No similar products found.");
      } else {
        toast.success(`Found ${matches.length} similar product(s)!`);
      }

      setResults(matches);
    } catch (err) {
      console.error(err);
      toast.dismiss(); // removes loading spinner
      toast.error(err.response?.data?.detail || "Error uploading image.");
    } finally {
      setLoading(false);
      toast.dismiss(); // clear any active loading toast
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => (window.location.href = "/login"), 1000);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-4 sm:p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-5xl mb-6">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-3 sm:mb-0">
          🧠 Visual Product Matcher
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Upload Card */}
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-6 space-y-5">
        <div
          className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setFile(e.dataTransfer.files[0]);
            setPreview(URL.createObjectURL(e.dataTransfer.files[0]));
            toast("Image selected for upload.", { icon: "📥" });
          }}
        >
          <Upload className="w-10 h-10 text-slate-500 mb-3" />
          <p className="text-slate-600 mb-2">Drag & drop an image here</p>
          <p className="text-sm text-slate-400 mb-2">or</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer text-blue-600 font-semibold hover:underline"
          >
            Browse files
          </label>
        </div>

        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Or paste an image URL"
            value={imageUrl}
            onChange={handleUrlChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {preview && (
          <div className="w-full mt-3">
            <img
              src={preview}
              alt="preview"
              className="rounded-lg w-full h-64 object-cover shadow-md"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2"
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

      {/* Results */}
      {results.length > 0 && (
        <div className="w-full max-w-5xl mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800 mb-2 sm:mb-0">
              Top Matches
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <label className="text-slate-600">
                Min Similarity: {filter}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={filter}
                onChange={(e) => setFilter(Number(e.target.value))}
                className="w-40 accent-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
