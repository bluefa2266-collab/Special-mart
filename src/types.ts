export interface Store {
  id: string;
  name: string;
  location: string;
  phone: string;
  hours: string;
  manager: string;
  themeColor: string; // Tailwind color class or hex (e.g., 'emerald', 'sky', 'indigo', 'rose', 'amber')
  themeHex: string;   // Exact hex color for custom styling (e.g., '#10b981')
  bannerUrl: string;  // Image URL for the store banner
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  storeId: string;    // "all" or specific Store ID
}

export interface CartItem {
  product: Product;
  quantity: number;
}
