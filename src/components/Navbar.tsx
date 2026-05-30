import React from "react";
import { ShoppingBag, Store as StoreIcon, Settings, Layers, ChevronDown } from "lucide-react";
import { Store, CartItem } from "../types";
import { getStoreColorClasses } from "../utils";

interface NavbarProps {
  stores: Store[];
  activeStore: Store;
  onSelectStore: (storeId: string) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  activeTab: "shop" | "admin";
  onTabChange: (tab: "shop" | "admin") => void;
  onOpenStoreModal: () => void;
}

export default function Navbar({
  stores,
  activeStore,
  onSelectStore,
  cart,
  onOpenCart,
  activeTab,
  onTabChange,
  onOpenStoreModal
}: NavbarProps) {
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 shadow-sm/5">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        {/* Logo Brand / Alignment matching "Geometric Balance" layout */}
        <div className="flex items-center gap-3 sm:gap-8">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => onTabChange("shop")}>
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold text-xl transition-all duration-300 shadow-md shadow-indigo-100"
              style={{ backgroundColor: activeStore.themeHex }}
            >
              {activeStore.name?.charAt(0) || "S"}
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
              SUPERMART<span className="font-extrabold" style={{ color: activeStore.themeHex }}>OS</span>
            </span>
          </div>

          {/* Center Actions: Geometric inline tabs */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onTabChange("shop")}
              className={`px-4 py-2 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === "shop"
                  ? "text-slate-900"
                  : "text-slate-400 border-transparent hover:text-slate-650"
              }`}
              style={{ borderBottomColor: activeTab === "shop" ? activeStore.themeHex : "transparent" }}
            >
              Inventory Shop
            </button>
            <button
              onClick={() => onTabChange("admin")}
              className={`px-4 py-2 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "text-slate-900"
                  : "text-slate-400 border-transparent hover:text-slate-650"
              }`}
              style={{ borderBottomColor: activeTab === "admin" ? activeStore.themeHex : "transparent" }}
            >
              Catalog Admin
            </button>
          </div>
        </div>

        {/* Right Actions: Store Selector & Control elements */}
        <div className="flex items-center gap-3">
          {/* Active Store Indicator selectors */}
          <div className="flex flex-col items-end text-right hidden sm:flex">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Active Store Unit</span>
            <div className="relative mt-1 flex items-center">
              <select
                value={activeStore.id}
                onChange={(e) => onSelectStore(e.target.value)}
                className="bg-transparent font-bold text-sm text-slate-800 focus:outline-none cursor-pointer appearance-none pr-5 py-0 border-none outline-none leading-none select-none"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id} className="text-slate-800 text-xs font-semibold">
                    {store.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-0 pointer-events-none" />
            </div>
          </div>

          {/* Quick Select trigger btn (if mobile) */}
          <div className="sm:hidden">
            <select
              value={activeStore.id}
              onChange={(e) => onSelectStore(e.target.value)}
              className="bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 rounded-lg py-1.5 px-2.5 max-w-[130px]"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {/* Change Store Customizer theme button */}
          <button
            onClick={onOpenStoreModal}
            title="Configure Palette & Branches"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all shadow-2xs cursor-pointer"
          >
            <Layers className="h-5 w-5" />
          </button>

          {/* Shopping Cart Indicator */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center text-white cursor-pointer"
            style={{ backgroundColor: activeStore.themeHex }}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-mono font-extrabold text-white ring-2 ring-white animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

