import { motion } from "framer-motion";

function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
    >
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-slate-500 text-sm mb-2">{product.category}</p>
        <span className="text-sm font-semibold text-blue-600">
          Similarity: {product.similarity}%
        </span>
      </div>
    </motion.div>
  );
}

export default ProductCard;
