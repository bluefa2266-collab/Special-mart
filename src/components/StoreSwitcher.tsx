import React, { useState } from "react";
import { X, MapPin, Store as StoreIcon, Clock, Phone, User, Plus, Edit3, Check, Palette } from "lucide-react";
import { Store } from "../types";
import { storeColorPresets } from "../data/initialData";
import { motion, AnimatePresence } from "motion/react";

interface StoreSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  stores: Store[];
  activeStore: Store;
  onSelectStore: (storeId: string) => void;
  onUpdateStore: (updatedStore: Store) => void;
  onAddStore: (newStore: Store) => void;
}

export default function StoreSwitcher({
  isOpen,
  onClose,
  stores,
  activeStore,
  onSelectStore,
  onUpdateStore,
  onAddStore,
}: StoreSwitcherProps) {
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [isAddingStore, setIsAddingStore] = useState(false);

  // Form states for edit/add
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState("");
  const [manager, setManager] = useState("");
  const [themeColor, setThemeColor] = useState("emerald");
  const [themeHex, setThemeHex] = useState("#10b981");
  const [bannerUrl, setBannerUrl] = useState("");

  const startEdit = (store: Store) => {
    setEditingStoreId(store.id);
    setIsAddingStore(false);
    setName(store.name);
    setLocation(store.location);
    setPhone(store.phone);
    setHours(store.hours);
    setManager(store.manager);
    setThemeColor(store.themeColor);
    setThemeHex(store.themeHex);
    setBannerUrl(store.bannerUrl);
  };

  const startAdd = () => {
    setIsAddingStore(true);
    setEditingStoreId(null);
    setName("");
    setLocation("");
    setPhone("");
    setHours("8:00 AM - 10:00 PM");
    setManager("");
    setThemeColor("purple");
    setThemeHex("#a855f7");
    setBannerUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=850");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingStoreId) {
      onUpdateStore({
        id: editingStoreId,
        name,
        location,
        phone,
        hours,
        manager,
        themeColor,
        themeHex,
        bannerUrl,
      });
      setEditingStoreId(null);
    }
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newId = `store-${Date.now()}`;
    onAddStore({
      id: newId,
      name,
      location,
      phone,
      hours,
      manager,
      themeColor,
      themeHex,
      bannerUrl,
    });
    // Auto-select newly created store
    onSelectStore(newId);
    setIsAddingStore(false);
  };

  const handleSelectPreset = (preset: typeof storeColorPresets[0]) => {
    setThemeColor(preset.class);
    setThemeHex(preset.hex);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Left Rail / Store List Selection */}
            <div className="w-full md:w-1/2 border-r border-slate-200 flex flex-col h-full bg-slate-50 p-5 md:p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <StoreIcon className="h-5 w-5 text-slate-700" />
                  <h3 className="text-base font-sans font-bold text-slate-900 tracking-tight">
                    Select & Manage Stores
                  </h3>
                </div>
                <button
                  onClick={startAdd}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-3xs cursor-pointer transition-all"
                >
                  <Plus className="h-3 w-3" />
                  <span>New Store</span>
                </button>
              </div>

              {/* Stores Grid list */}
              <div className="space-y-3 flex-1">
                {stores.map((store) => {
                  const isActive = store.id === activeStore.id;
                  const isEditingThis = store.id === editingStoreId;
                  return (
                    <div
                      key={store.id}
                      className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-white border-slate-400 shadow-sm ring-1 ring-offset-0 ring-slate-900/5"
                          : "bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-3xs"
                      }`}
                      onClick={() => {
                        if (!isEditingThis) {
                          onSelectStore(store.id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-white shrink-0"
                            style={{ backgroundColor: store.themeHex }}
                          />
                          <h4 className="font-extrabold text-sm text-slate-900 truncate max-w-[180px]">
                            {store.name}
                          </h4>
                        </div>
                        
                        {/* Edit Buttons */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(store);
                          }}
                          className="p-1.5 bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Edit location details & color palette"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs text-slate-500 font-medium">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1.5 shrink-0 text-slate-400" />
                          <span className="truncate">{store.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1.5 shrink-0 text-slate-400" />
                          <span>{store.hours}</span>
                        </div>
                        <div className="flex items-center text-[10px] text-slate-400">
                          <User className="h-3 w-3 mr-1.5 shrink-0 text-slate-400" />
                          <span>Mgr: {store.manager}</span>
                        </div>
                      </div>

                      {isActive && (
                        <div className="absolute right-3 top-3.5 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: store.themeHex }} />
                          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: store.themeHex }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Edit Theme/Colors and store options */}
            <div className="w-full md:w-1/2 p-5 md:p-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
              {/* Close Top Header */}
              <div className="absolute right-4 top-4 z-10">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {editingStoreId || isAddingStore ? (
                <form
                  onSubmit={editingStoreId ? handleSaveEdit : handleSaveAdd}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Header edit form */}
                    <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-200">
                      <Palette className="h-5 w-5 text-slate-600" />
                      <h4 className="font-bold text-slate-950 text-sm tracking-tight">
                        {editingStoreId ? `Edit Branch Identity` : "Add New Franchise Unit"}
                      </h4>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Store Branch Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. West Coast Premium Mart"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-slate-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Address & Location Info
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 502 Ocean Dr, Beachside"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-slate-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Manager-in-Charge
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Raymond Cook"
                            value={manager}
                            onChange={(e) => setManager(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-slate-404"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Operating Hours
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 8:00 AM - 10:00 PM"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-slate-404"
                          />
                        </div>
                      </div>

                      {/* Store customized colors */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-405 uppercase tracking-wider mb-1">
                          Branch Signature Colors
                        </label>
                        <div className="flex flex-wrap gap-2.5 mt-1.5">
                          {storeColorPresets.map((preset) => {
                            const isSelected = themeHex.toLowerCase() === preset.hex.toLowerCase();
                            return (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => handleSelectPreset(preset)}
                                className={`w-8 h-8 rounded-full cursor-pointer transition-transform duration-200 relative shrink-0 ${
                                  isSelected ? "scale-110 shadow-md ring-2 ring-slate-900" : "hover:scale-105"
                                }`}
                                style={{ backgroundColor: preset.hex }}
                                title={preset.name}
                              >
                                {isSelected && (
                                  <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom color picker */}
                      <div className="flex items-center space-x-3.5 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
                        <input
                          type="color"
                          id="hexPicker"
                          value={themeHex}
                          onChange={(e) => {
                            setThemeHex(e.target.value);
                            setThemeColor("custom");
                          }}
                          className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent"
                        />
                        <div className="flex-1">
                          <label htmlFor="hexPicker" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Store Color Picker
                          </label>
                          <input
                            type="text"
                            value={themeHex}
                            onChange={(e) => {
                              setThemeHex(e.target.value);
                              setThemeColor("custom");
                            }}
                            className="text-xs font-mono font-bold text-slate-700 bg-transparent border-0 p-0 outline-none w-20"
                          />
                        </div>
                      </div>

                      {/* Banner Customizer url */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Store Cover Image URL
                        </label>
                        <input
                          type="url"
                          placeholder="Image URL link (Optional)"
                          value={bannerUrl}
                          onChange={(e) => setBannerUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex space-x-2 pt-4 border-t border-slate-200 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStoreId(null);
                        setIsAddingStore(false);
                      }}
                      className="flex-1 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-50 rounded-xl transition-all cursor-pointer border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs hover:brightness-105 active:scale-99 transition-all cursor-pointer"
                      style={{ backgroundColor: themeHex }}
                    >
                      {editingStoreId ? "Save Identity" : "Add Branch"}
                    </button>
                  </div>
                </form>
              ) : (
                /* Select instruction placeholder */
                <div className="flex flex-col items-center justify-center text-center h-full py-12 md:py-20 space-y-4">
                  <div 
                    className="p-4 rounded-3xl text-white shadow-md animate-bounce"
                    style={{ backgroundColor: activeStore.themeHex }}
                  >
                    <StoreIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Franchise Live Status</h4>
                    <p className="text-slate-500 text-xs mt-1.5 max-w-xs leading-relaxed">
                      Select any branch on the left directory sidebar, or click <strong>New Store</strong> or the pencil edit button to personalize their brand palettes and hours details dynamically.
                    </p>
                  </div>
                  
                  {/* Quick Active Store Specs Card */}
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 mt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                      Active: {activeStore.name}
                    </p>
                    <p className="text-slate-650"><strong>Address:</strong> {activeStore.location}</p>
                    <p className="text-slate-650"><strong>Manager:</strong> {activeStore.manager}</p>
                    <p className="text-slate-650"><strong>Phone support:</strong> {activeStore.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
