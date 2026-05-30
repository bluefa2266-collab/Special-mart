import React, { useState, useEffect } from "react";
import { Store, Product, CartItem } from "./types";
import { initialStores, initialProducts, productCategories } from "./data/initialData";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import CartSidebar from "./components/CartSidebar";
import StoreSwitcher from "./components/StoreSwitcher";
import AdminPanel from "./components/AdminPanel";
import { formatCurrency, getStoreColorClasses } from "./utils";
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  Sparkles, 
  Layers, 
  Store as StoreIcon, 
  Heart,
  ChevronRight,
  UserCheck2,
  CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Load initial stores
  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem("super_mart_stores");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Error parsing stored stores", err);
      }
    }
    return initialStores;
  });

  // Load active store selected
  const [activeStoreId, setActiveStoreId] = useState<string>(() => {
    const saved = localStorage.getItem("super_mart_active_store_id");
    if (saved) return saved;
    return initialStores[0].id;
  });

  // Load product listings
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("super_mart_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Error parsing stored products", err);
      }
    }
    return initialProducts;
  });

  // Load shopping cart items
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("super_mart_cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Error parsing stored cart", err);
      }
    }
    return [];
  });

  // UI Navigation states
  const [activeTab, setActiveTab] = useState<"shop" | "admin">("shop");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Drawers / Modal triggers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  // Success Notification state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Find active store profile
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0] || initialStores[0];

  // Helper to trigger custom persistent alerts
  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("super_mart_stores", JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem("super_mart_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("super_mart_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("super_mart_active_store_id", activeStoreId);
  }, [activeStoreId]);

  // Handle product actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showAlert(`Successfully added "${newProduct.title}" to catalog.`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    // Also update instances in Cart
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === updatedProduct.id
          ? { ...item, product: updatedProduct }
          : item
      )
    );
    showAlert(`Successfully updated "${updatedProduct.title}".`);
  };

  const handleDeleteProduct = (id: string) => {
    const itemToDelete = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Remove from cart if deleted
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    if (itemToDelete) {
      showAlert(`Removed "${itemToDelete.title}" from store inventory.`);
    }
  };

  // Handle store actions
  const handleUpdateStore = (updatedStore: Store) => {
    setStores((prev) =>
      prev.map((s) => (s.id === updatedStore.id ? updatedStore : s))
    );
    showAlert(`Store preferences for "${updatedStore.name}" revised successfully!`);
  };

  const handleAddStore = (newStore: Store) => {
    setStores((prev) => [...prev, newStore]);
    showAlert(`Franchise branch "${newStore.name}" registered live!`);
  };

  // Handle Cart actions
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showAlert(`Cannot add more. Limit of ${product.stock} units reached.`);
          return prevCart;
        }
        showAlert(`Increased quantity for "${product.title}" in cart.`);
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        showAlert(`Added "${product.title}" to shopping cart.`);
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            // Guard max stock bounds
            if (newQty > item.product.stock) {
              showAlert(`Only ${item.product.stock} units available in branch.`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    if (item) {
      showAlert(`Removed "${item.product.title}" from cart.`);
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Filter storefront items:
  // Active store items + All storewide products
  const storefrontProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    // Show products allocated to 'all' stores OR only products designated to this specific active store
    const matchesStore = p.storeId === "all" || p.storeId === activeStore.id;

    return matchesSearch && matchesCategory && matchesStore;
  });

  const activeColorClasses = getStoreColorClasses(activeStore.themeColor);

  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col transition-colors duration-500 font-sans"
      style={{ "--store-theme": activeStore.themeHex } as React.CSSProperties}
    >
      {/* Top Navbar */}
      <Navbar
        stores={stores}
        activeStore={activeStore}
        onSelectStore={setActiveStoreId}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenStoreModal={() => setIsStoreModalOpen(true)}
      />

      {/* Interactive Alerts Popups */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-slate-950 text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-lg flex items-center space-x-2 border border-slate-800"
          >
            <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
            <span>{alertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {activeTab === "shop" ? (
            <motion.div
              key="shop-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Dynamic Theme Banner */}
              <div 
                className="relative rounded-3xl overflow-hidden shadow-md text-white transition-all duration-500"
                style={{ 
                  backgroundColor: activeStore.themeHex,
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.15)), url(${activeStore.bannerUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="px-6 py-12 sm:px-10 sm:py-16 flex flex-col justify-between min-h-[220px] max-w-2xl relative z-10">
                  <div className="space-y-2">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md text-white shadow-3xs">
                      <Sparkles className="h-3 w-3 text-amber-300 animate-spin" />
                      <span>Active Location Portal</span>
                    </span>

                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-xs">
                      Welcome to <span className="underline decoration-wavy decoration-amber-300">{activeStore.name}</span>
                    </h1>
                    <p className="text-sm text-gray-150 drop-shadow-2xs font-medium max-w-lg leading-relaxed">
                      We offer handpicked healthy organic greens, fresh bread baked daily from natural wild sourdough yeast, dairy & premium grade-A eggs.
                    </p>
                  </div>

                  {/* Location & phone footer summary */}
                  <div className="mt-8 flex flex-wrap gap-4 text-xs font-semibold backdrop-blur-xs bg-black/20 p-3 rounded-2xl max-w-lg border border-white/5 shadow-2xs">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="h-4 w-4 text-amber-300 shrink-0" />
                      <span>{activeStore.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="h-4 w-4 text-amber-300 shrink-0" />
                      <span>{activeStore.hours}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Phone className="h-4 w-4 text-amber-300 shrink-0" />
                      <span>{activeStore.phone}</span>
                    </div>
                  </div>
                </div>
                
                {/* Store manager indicator banner corner */}
                <div className="absolute top-5 right-5 hidden lg:flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs">
                  <UserCheck2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-gray-200">Manager: <strong className="text-white">{activeStore.manager}</strong></span>
                </div>
              </div>

              {/* Filtering, Category Search Controls */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Category Filter Pills scroll bar */}
                  <div className="flex items-center overflow-x-auto pb-2 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 gap-1.5">
                    {productCategories.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                            isSelected
                              ? "text-white shadow-xs hover:brightness-105"
                              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                          style={isSelected ? { backgroundColor: activeStore.themeHex } : undefined}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search query box */}
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search produce, baked goods, dairy..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-slate-400 font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Sub-header counter */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium font-sans">
                  <p>
                    Showing <strong className="text-slate-900">{storefrontProducts.length}</strong> catalog items matching criteria
                  </p>
                  <p className="hidden sm:block">
                    Switch stores in navigation to browse other franchise assets!
                  </p>
                </div>
              </div>

              {/* Grid Layout of products */}
              {storefrontProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs">
                  <ShoppingBag className="h-10 w-10 text-slate-350 mx-auto mb-3" />
                  <h3 className="font-sans font-bold text-slate-800 text-sm">No products available</h3>
                  <p className="text-slate-500 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
                    We couldn't locate grocery items matching your query. Switch branch location or add custom products using the **Catalog Admin** panel!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {storefrontProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        activeStore={activeStore}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AdminPanel
                products={products}
                stores={stores}
                activeStore={activeStore}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding design */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-12 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center space-x-1.5 text-gray-550 font-bold mb-3">
            <StoreIcon className="h-4 w-4" style={{ color: activeStore.themeHex }} />
            <span>Super Mart Corporate Networks Inc.</span>
          </div>
          <p className="max-w-md mx-auto leading-normal">
            A state-of-the-art interactive retail system utilizing persistent Local Storage catalogs. Real-time store customization and inventory administration.
          </p>
          <p className="text-[10px] font-mono mt-4">
            Portal operational under current date: 2026-05-30 UTC • Local branch: {activeStore.name}
          </p>
        </div>
      </footer>

      {/* Cart Sidebar Drawer Drawer slider */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        activeStore={activeStore}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Store Location switching modal switcher */}
      <StoreSwitcher
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        stores={stores}
        activeStore={activeStore}
        onSelectStore={setActiveStoreId}
        onUpdateStore={handleUpdateStore}
        onAddStore={handleAddStore}
      />
    </div>
  );
}
