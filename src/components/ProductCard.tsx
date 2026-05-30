import React from "react";
import { Plus, HelpCircle, PackageX, AlertTriangle, Check, Layers } from "lucide-react";
import { Product, Store } from "../types";
import { formatCurrency, getStoreColorClasses } from "../utils";
import { motion } from "motion/react";

interface ProductCardProps {
  key?: string;
  product: Product;
  activeStore: Store;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  activeStore,
  onAddToCart,
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  
  // Calculate visual percentage representation for stock meter (max 150 for relative display)
  const stockPercentage = Math.min(100, Math.max(0, (product.stock / 150) * 100));
  const meterColor = isOutOfStock 
    ? "bg-rose-500" 
    : isLowStock 
      ? "bg-amber-500" 
      : "bg-emerald-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col h-full group"
    >
      {/* Product Image & Badges */}
      <div className="relative pt-[70%] bg-slate-50 border-b border-slate-100 overflow-hidden">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600";
          }}
        />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-800 uppercase tracking-widest shadow-2xs border border-slate-200/50">
          {product.category}
        </span>

        {/* Store Assignment Customizer Badge */}
        {product.storeId !== "all" && (
          <span 
            className="absolute top-3 right-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md shadow-xs text-white flex items-center gap-1.5"
            style={{ backgroundColor: activeStore.themeHex }}
          >
            <Layers className="h-2.5 w-2.5" />
            Branch exclusive
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug truncate group-hover:text-slate-950 transition-colors">
              {product.title}
            </h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
              Ref: SK-{product.id?.slice(-5).toUpperCase() || "SUPER"}
            </span>
          </div>
          
          {/* Price displayed side-by-side matching Geometric Balance values */}
          <div className="text-right shrink-0">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
              {formatCurrency(product.price)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 block -mt-0.5">/unit</span>
          </div>
        </div>

        {/* Product description paragraph content */}
        <p className="text-xs text-slate-550 line-clamp-2 leading-relaxed flex-grow mt-1 mb-4">
          {product.description || "Selected fresh premium quality goods, carefully verified for exceptional local standards."}
        </p>

        {/* Geometric Balance stock indicator graph line */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${meterColor}`}
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider shrink-0 whitespace-nowrap ${
            isOutOfStock ? "text-rose-650" : isLowStock ? "text-amber-550" : "text-slate-600"
          }`}>
            {isOutOfStock ? "Out of Stock" : `${product.stock} units`}
          </span>
        </div>

        {/* Action button */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-2.5 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-98 ${
            isOutOfStock
              ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
              : "border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100/70"
          }`}
          style={!isOutOfStock ? { borderLeftColor: activeStore.themeHex, borderLeftWidth: "3px" } : undefined}
        >
          <Plus className="h-3.5 w-3.5" style={!isOutOfStock ? { color: activeStore.themeHex } : undefined} />
          <span>{isOutOfStock ? "Unavailable" : "Add to Cart"}</span>
        </button>
      </div>
    </motion.div>
  );
}

