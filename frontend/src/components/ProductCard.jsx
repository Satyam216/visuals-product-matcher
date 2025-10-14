import { motion } from "framer-motion";
import { Image } from "lucide-react";

function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-gradient-to-br from-[#111111]/90 via-[#1b1b1b]/80 to-[#0c0c0c]/90 
                 backdrop-blur-md border border-gray-800 rounded-2xl 
                 shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] 
                 overflow-hidden text-gray-100 transition-all duration-300"
    >
      <div className="relative w-full h-56 bg-[#181818] flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <Image className="w-12 h-12 mb-2" />
            <p className="text-sm">No Image</p>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold truncate text-gray-100">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 italic">{product.category}</p>

        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">
            Similarity:
          </span>
          <span
            className={`text-sm font-semibold ${
              product.similarity >= 80
                ? "text-green-400"
                : product.similarity >= 50
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {product.similarity}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
