import React, { useState } from "react";
import { Plus, Search, Trash2, Edit3, Image as ImageIcon, CheckCircle, Package, Layers, Info, Filter, ArrowUpRight, DollarSign, RefreshCw, Layers2 } from "lucide-react";
import { Product, Store } from "../types";
import { productCategories } from "../data/initialData";
import { formatCurrency, getStoreColorClasses } from "../utils";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  products: Product[];
  stores: Store[];
  activeStore: Store;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function AdminPanel({
  products,
  stores,
  activeStore,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: AdminPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search/Filters inside admin panel
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [storeFilter, setStoreFilter] = useState("all_inclusive"); // Show products of all stores or only active

  // Form Field States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Fresh Produce");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [storeId, setStoreId] = useState("all");

  const colorClasses = getStoreColorClasses(activeStore.themeColor);

  // Calculate stats
  const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  const startAddProduct = () => {
    setIsAdding(true);
    setEditingId(null);
    setTitle("");
    setCategory("Fresh Produce");
    setPrice("");
    setStock("");
    setImageUrl("");
    setDescription("");
    setStoreId("all");
  };

  const startEditProduct = (prod: Product) => {
    setEditingId(prod.id);
    setIsAdding(true);
    setTitle(prod.title);
    setCategory(prod.category);
    setPrice(prod.price.toString());
    setStock(prod.stock.toString());
    setImageUrl(prod.imageUrl);
    setDescription(prod.description);
    setStoreId(prod.storeId);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !stock) return;

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);
    if (isNaN(priceNum) || isNaN(stockNum)) return;

    // Premium random images based on category if imageUrl is blank
    let finalImageUrl = imageUrl;
    if (!finalImageUrl.trim()) {
      switch (category) {
        case "Fresh Produce":
          finalImageUrl = "https://images.unsplash.com/photo-1610348725531-843dff163e2c?auto=format&fit=crop&q=80&w=300";
          break;
        case "Bakery":
          finalImageUrl = "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=300";
          break;
        case "Dairy & Eggs":
          finalImageUrl = "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=300";
          break;
        case "Beverages":
          finalImageUrl = "https://images.unsplash.com/photo-1527960650-066a9c97022e?auto=format&fit=crop&q=80&w=300";
          break;
        case "Pantry":
          finalImageUrl = "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300";
          break;
        case "Snacks & Sweets":
          finalImageUrl = "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?auto=format&fit=crop&q=80&w=300";
          break;
        default:
          finalImageUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300";
      }
    }

    if (editingId) {
      onUpdateProduct({
        id: editingId,
        title,
        category,
        price: priceNum,
        stock: stockNum,
        imageUrl: finalImageUrl,
        description,
        storeId,
      });
      setEditingId(null);
    } else {
      onAddProduct({
        id: `prod-${Date.now()}`,
        title,
        category,
        price: priceNum,
        stock: stockNum,
        imageUrl: finalImageUrl,
        description,
        storeId,
      });
    }

    setIsAdding(false);
  };

  // Filter lists based on inputs
  const filteredProducts = products.filter((p) => {
    // Search filter
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;

    // Store filter context
    let matchesStore = true;
    if (storeFilter === "active_only") {
      matchesStore = p.storeId === "all" || p.storeId === activeStore.id;
    } else if (storeFilter !== "all_inclusive" && storeFilter !== "active_only") {
      matchesStore = p.storeId === storeFilter;
    }

    return matchesSearch && matchesCategory && matchesStore;
  });

  return (
    <div className="space-y-6">
      {/* Analytics stat cards dashboard banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Value</span>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight block mt-1.5">
              {formatCurrency(totalValue)}
            </span>
          </div>
          <div className="p-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Cataloged Units</span>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight block mt-1.5">
              {totalStockCount} units
            </span>
          </div>
          <div className="p-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl">
            <Package className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Restock Alerts</span>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight block mt-1.5">
              {lowStockCount} items
            </span>
          </div>
          <div className={`p-3 border border-slate-200 rounded-xl ${lowStockCount > 0 ? "bg-rose-50 text-rose-600 animate-pulse" : "bg-slate-50 text-slate-500"}`}>
            <Info className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Panel Header */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-sans font-bold text-slate-950 tracking-tight">Super Mart Catalog Manager</h2>
            <p className="text-xs text-slate-500 mt-1">Insert new stock items, edit variables, and manage multi-franchise coverage.</p>
          </div>

          <button
            onClick={startAddProduct}
            className="flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-99 transition-all cursor-pointer"
            style={{ backgroundColor: activeStore.themeHex }}
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Dynamic ADD / EDIT Modal/Panel Drawer Inline */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-50 border-b border-slate-200 overflow-hidden"
            >
              <form onSubmit={handleSaveProduct} className="p-5 md:p-6 space-y-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
                  <h3 className="font-bold text-sm text-slate-900">
                    {editingId ? "Update Product Details" : "Launch New Brand Stock"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="text-slate-400 hover:text-slate-650 text-xs font-semibold cursor-pointer"
                  >
                    Discard Form
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Form: Basic Info */}
                  <div className="md:col-span-2 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Premium Organic Red Strawberries"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-slate-400 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          min="0.10"
                          placeholder="e.g. 5.99"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-slate-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Starting Stock</label>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="e.g. 40"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-slate-400 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-slate-400 outline-none"
                        >
                          {productCategories.filter(c => c !== "All").map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Store Allocation</label>
                        <select
                          value={storeId}
                          onChange={(e) => setStoreId(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-slate-400 outline-none font-sans font-semibold text-slate-700"
                        >
                          <option value="all">Publish to All Store Locations</option>
                          {stores.map((s) => (
                            <option key={s.id} value={s.id}>
                              Only {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Form: Image & Description */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Image URL</label>
                      <input
                        type="url"
                        placeholder="Leave blank for smart preset image"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-slate-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Product Description</label>
                      <textarea
                        rows={3}
                        placeholder="Brief overview of features, source or dimensions..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-slate-404 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 mt-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-white text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-white rounded-xl text-xs font-bold shadow-xs hover:brightness-105 active:scale-99 transition-all cursor-pointer flex items-center space-x-1"
                    style={{ backgroundColor: activeStore.themeHex }}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>{editingId ? "Save Stock Specifications" : "Register Stock Item"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Catalog Table Controls & Filtering search */}
        <div className="p-4 bg-slate-55 border-b border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search catalog items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:border-slate-400 text-slate-800 font-medium"
            />
          </div>

          {/* Category Filter dropdown */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 sm:flex-none border border-slate-200 bg-white px-3 py-2 rounded-xl text-xs text-slate-700 font-semibold outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="All">All Categories ({productCategories.length - 1} options)</option>
              {productCategories.filter(c => c !== "All").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Store select Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="w-full sm:w-auto border border-slate-200 bg-white px-3 py-2 rounded-xl text-xs text-slate-700 font-semibold outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="all_inclusive">All Corporate Stock</option>
              <option value="active_only">Current Branch items ({activeStore.name})</option>
              <option value="all">Direct Storewide items only</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>Unique: {s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 p-5 bg-white">
              <Package className="h-8 w-8 text-slate-350 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">No items found</p>
              <p className="text-xs text-slate-500 mt-1">Try loosening search filters or register a custom catalog item!</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs text-slate-605">
              <thead className="bg-slate-50/50 uppercase font-black text-[10px] tracking-widest text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Product Info</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Assigned Location</th>
                  <th className="px-5 py-3.5">Stock Status</th>
                  <th className="px-5 py-3.5 text-right">Price</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-medium">
                {filteredProducts.map((prod) => {
                  const outOfStock = prod.stock === 0;
                  const lowStock = prod.stock > 0 && prod.stock <= 10;
                  const storeAssigned = stores.find((s) => s.id === prod.storeId);
                  
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 flex items-center space-x-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded-lg bg-slate-50 border border-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150";
                          }}
                        />
                        <div className="min-w-0">
                          <span className="block font-bold text-slate-900 truncate max-w-[180px]">{prod.title}</span>
                          <span className="block text-[10px] text-slate-400 font-normal line-clamp-1 max-w-[200px]">{prod.description || "Fresh selection."}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-205">
                          {prod.category}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        {prod.storeId === "all" ? (
                          <span className="text-[10px] text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">Storewide</span>
                        ) : (
                          <span 
                            className="text-[10px] text-white font-bold px-2 py-0.5 rounded-md shadow-3xs"
                            style={{ backgroundColor: storeAssigned?.themeHex || activeStore.themeHex }}
                          >
                            {storeAssigned?.name || "Exclusive Branch"}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center space-x-1.5">
                          {outOfStock ? (
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                          ) : lowStock ? (
                            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                          )}
                          <span className={`text-[11px] font-bold ${outOfStock ? "text-rose-600" : lowStock ? "text-amber-600" : "text-emerald-700"}`}>
                            {prod.stock} units
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-right font-bold text-slate-900 font-mono">
                        {formatCurrency(prod.price)}
                      </td>

                      <td className="px-5 py-3 text-center">
                        <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 space-x-0.5">
                          <button
                            onClick={() => startEditProduct(prod)}
                            className="p-1 px-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all cursor-pointer"
                            title="Edit metrics"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            className="p-1 px-2 text-slate-400 hover:text-rose-650 hover:bg-white rounded-md transition-all cursor-pointer"
                            title="Delete barcode item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
