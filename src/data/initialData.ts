import { Store, Product } from "../types";

export const initialStores: Store[] = [
  {
    id: "store-metro",
    name: "Metro Prime Market",
    location: "450 Grand Avenue, Downtown",
    phone: "+1 (555) 123-4567",
    hours: "7:00 AM - 11:00 PM",
    manager: "Sarah Jenkins",
    themeColor: "emerald",
    themeHex: "#10b981",
    bannerUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "store-coastal",
    name: "Coastal Express Mart",
    location: "88 Ocean Parkway, Marina District",
    phone: "+1 (555) 987-6543",
    hours: "6:00 AM - Midnight",
    manager: "Marcus Vance",
    themeColor: "sky",
    themeHex: "#0ea5e9",
    bannerUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "store-wellness",
    name: "Sunset Wellness Greens",
    location: "1024 Organic Boulevard, Westside",
    phone: "+1 (555) 456-7890",
    hours: "8:00 AM - 9:00 PM",
    manager: "Elena Rostova",
    themeColor: "amber",
    themeHex: "#f59e0b",
    bannerUrl: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=800"
  }
];

export const initialProducts: Product[] = [
  // Fresh Produce
  {
    id: "prod-1",
    title: "Organic Red Gala Apples",
    category: "Fresh Produce",
    price: 4.99,
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=300",
    description: "Crisp, sweet, and locally harvested hand-picked organic apples.",
    storeId: "all"
  },
  {
    id: "prod-2",
    title: "Fresh English Avocados (Pack of 3)",
    category: "Fresh Produce",
    price: 5.49,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=300",
    description: "Creamy Hass avocados, perfect for freshly-baked toast or guacamole.",
    storeId: "all"
  },
  {
    id: "prod-3",
    title: "Organic Baby Spinach (250g)",
    category: "Fresh Produce",
    price: 3.29,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=300",
    description: "Pre-washed tender baby spinach leaves, packed with nutrients.",
    storeId: "store-wellness"
  },

  // Bakery
  {
    id: "prod-4",
    title: "Artisanal Sourdough Bread Loaf",
    category: "Bakery",
    price: 6.50,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300",
    description: "Freshly baked sourdough from natural wild yeast, crisp crust.",
    storeId: "all"
  },
  {
    id: "prod-5",
    title: "Gourmet Butter Croissants (4-Pack)",
    category: "Bakery",
    price: 7.99,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300",
    description: "Flaky, rich french butter croissants baked gold every morning.",
    storeId: "store-metro"
  },

  // Dairy & Eggs
  {
    id: "prod-6",
    title: "Pasture-Raised Grade A Large Eggs",
    category: "Dairy & Eggs",
    price: 6.99,
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&q=80&w=300",
    description: "Farm-fresh rich golden yolk pasture-fed whole chicken eggs.",
    storeId: "all"
  },
  {
    id: "prod-7",
    title: "Organic Whole Milk (1 Gallon)",
    category: "Dairy & Eggs",
    price: 5.19,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=300",
    description: "Premium pasteurized grass-fed organic vitamin D whole milk.",
    storeId: "all"
  },

  // Beverages
  {
    id: "prod-8",
    title: "Sparkling Alkaline Water (6-Pack)",
    category: "Beverages",
    price: 8.49,
    stock: 110,
    imageUrl: "https://images.unsplash.com/photo-1608885898858-da014f346e9f?auto=format&fit=crop&q=80&w=300",
    description: "Effervescent refreshing carbonated water with electrolyte infusion.",
    storeId: "store-coastal"
  },
  {
    id: "prod-9",
    title: "Rich Cold Brew Coffee Concentrate",
    category: "Beverages",
    price: 9.99,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=300",
    description: "Slow-steeped bold barista-quality premium arabica beans brew.",
    storeId: "all"
  },

  // Pantry
  {
    id: "prod-10",
    title: "Premium Extra Virgin Olive Oil",
    category: "Pantry",
    price: 15.99,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300",
    description: "Cold-pressed single origin estate grown rich aromatic olive oil.",
    storeId: "all"
  },
  {
    id: "prod-11",
    title: "Organic Quinoa (1kg)",
    category: "Pantry",
    price: 7.49,
    stock: 95,
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300",
    description: "Non-GMO triple-washed whole grain white quinoa organic superfood.",
    storeId: "store-wellness"
  }
];

export const productCategories = [
  "All",
  "Fresh Produce",
  "Bakery",
  "Dairy & Eggs",
  "Beverages",
  "Pantry",
  "Snacks & Sweets"
];

// Aesthetic gradients/presets for custom store colors
export const storeColorPresets = [
  { name: "Emerald Green", class: "emerald", hex: "#10b981" },
  { name: "Ocean Breeze Blue", class: "sky", hex: "#0ea5e9" },
  { name: "Sunset Gold", class: "amber", hex: "#f59e0b" },
  { name: "Royal Purple", class: "purple", hex: "#a855f7" },
  { name: "Crimson Rose", class: "rose", hex: "#f43f5e" },
  { name: "Classic Indigo", class: "indigo", hex: "#6366f1" }
];
