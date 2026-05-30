// Helper helper utilities for color translation and calculations

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Generate store badge styles based on pre-defined theme class name
export function getStoreColorClasses(themeColor: string) {
  switch (themeColor) {
    case "emerald":
      return {
        bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
        badge: "bg-emerald-500 text-white",
        darkText: "text-emerald-700",
        border: "border-emerald-500",
        ring: "focus:ring-emerald-500",
        accent: "emerald-500"
      };
    case "sky":
      return {
        bg: "bg-sky-50 border-sky-200 text-sky-800",
        badge: "bg-sky-500 text-white",
        darkText: "text-sky-700",
        border: "border-sky-500",
        ring: "focus:ring-sky-500",
        accent: "sky-500"
      };
    case "amber":
      return {
        bg: "bg-amber-50 border-amber-200 text-amber-800",
        badge: "bg-amber-500 text-white",
        darkText: "text-amber-700",
        border: "border-amber-500",
        ring: "focus:ring-amber-500",
        accent: "amber-500"
      };
    case "purple":
      return {
        bg: "bg-purple-50 border-purple-200 text-purple-800",
        badge: "bg-purple-500 text-white",
        darkText: "text-purple-700",
        border: "border-purple-500",
        ring: "focus:ring-purple-500",
        accent: "purple-500"
      };
    case "rose":
      return {
        bg: "bg-rose-50 border-rose-200 text-rose-800",
        badge: "bg-rose-500 text-white",
        darkText: "text-rose-700",
        border: "border-rose-500",
        ring: "focus:ring-rose-500",
        accent: "rose-500"
      };
    case "indigo":
    default:
      return {
        bg: "bg-indigo-50 border-indigo-200 text-indigo-800",
        badge: "bg-indigo-500 text-white",
        darkText: "text-indigo-700",
        border: "border-indigo-500",
        ring: "focus:ring-indigo-500",
        accent: "indigo-500"
      };
  }
}
