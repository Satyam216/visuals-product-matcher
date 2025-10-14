import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg bg-white p-10 rounded-3xl shadow-2xl"
      >
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">
          🧠 Visual Product Matcher
        </h1>
        <p className="text-gray-600 mb-8">
          Upload or paste an image URL to find visually similar products using AI.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            Login <ArrowRight size={18} />
          </a>
          <a
            href="/signup"
            className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300"
          >
            Sign Up
          </a>
        </div>
      </motion.div>

      <footer className="mt-12 text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} Visual Product Matcher. Built with ❤️ using
          FastAPI, React, and TailwindCSS.
        </p>
      </footer>
    </div>
  );
}

export default Landing;
