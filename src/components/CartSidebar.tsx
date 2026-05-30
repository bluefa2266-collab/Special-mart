import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Ticket, CheckCircle2 } from "lucide-react";
import { CartItem, Store } from "../types";
import { formatCurrency } from "../utils";
import { motion, AnimatePresence } from "motion/react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  activeStore: Store;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  activeStore,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartSidebarProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "receipt">("cart");

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const taxRate = 0.0825; // 8.25% localized tax
  const tax = subtotal * taxRate;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal + tax - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = promoCode.trim().toUpperCase();
    if (normalized === "SUPER10") {
      setDiscountPercent(10);
      setPromoMessage("10% Discount applied successfully!");
    } else if (normalized === "FRESH20") {
      setDiscountPercent(20);
      setPromoMessage("20% Fresh organic discount applied!");
    } else {
      setPromoMessage("Invalid promo code. Try SUPER10 or FRESH20");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep("receipt");
  };

  const handleFinishCheckout = () => {
    onClearCart();
    setCheckoutStep("cart");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 transition-opacity"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-sans font-bold text-slate-900 tracking-tight">
                  {checkoutStep === "receipt" ? "Purchase Receipt" : "Your Shopping Cart"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {checkoutStep === "cart" ? (
              <>
                {/* Cart list screen */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="p-4 bg-slate-50 rounded-full text-slate-400 mb-4 border border-slate-200/50">
                        <ShoppingBag className="h-10 w-10 text-slate-300" />
                      </div>
                      <h3 className="font-semibold text-slate-800 text-sm">Cart is empty</h3>
                      <p className="text-slate-500 text-xs mt-1 max-w-xs">
                        Browse the shelves & add premium supermarket items to get started!
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center space-x-3.5 bg-white p-3 rounded-xl border border-slate-200 shadow-sm/5"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover rounded-lg bg-slate-50 flex-shrink-0 border border-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {item.product.title}
                          </h4>
                          <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            {item.product.category}
                          </span>
                          <span className="block text-slate-850 text-xs font-bold mt-1">
                            {formatCurrency(item.product.price)} each
                          </span>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-end space-y-2">
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1 text-slate-350 hover:text-rose-500 cursor-pointer rounded-md transition-colors"
                            title="Remove unit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="p-1 text-slate-500 hover:text-slate-950 hover:bg-slate-200 cursor-pointer rounded-md transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-mono text-xs font-bold w-5 text-center text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="p-1 text-slate-500 hover:text-slate-950 hover:bg-slate-200 cursor-pointer rounded-md transition-colors"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Promo Code & Summary Footer */}
                {cart.length > 0 && (
                  <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-4">
                    {/* Promo forms */}
                    <form onSubmit={handleApplyPromo} className="flex space-x-2">
                      <div className="relative flex-1">
                        <Ticket className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Promo Code (SUPER10, FRESH20)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="w-full pl-8.5 pr-2 py-2 border border-slate-250 rounded-lg text-xs outline-none focus:border-slate-405 focus:ring-1 focus:ring-slate-100 bg-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-2 text-xs font-semibold text-white rounded-lg cursor-pointer transition-colors"
                        style={{ backgroundColor: activeStore.themeHex }}
                      >
                        Apply
                      </button>
                    </form>

                    {promoMessage && (
                      <p className={`text-[10px] font-bold ${discountPercent > 0 ? "text-emerald-650" : "text-amber-650"}`}>
                        {promoMessage}
                      </p>
                    )}

                    {/* Summary Lines */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Cart Subtotal</span>
                        <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Store Discount ({discountPercent}%)</span>
                          <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>GST / Sales Tax (8.25%)</span>
                        <span className="font-semibold text-slate-800">{formatCurrency(tax)}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                        <span>Grand Total</span>
                        <span style={{ color: activeStore.themeHex }}>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 text-white text-sm font-bold rounded-xl shadow-md transition-all duration-200 hover:brightness-105 active:scale-99 flex items-center justify-center space-x-2 cursor-pointer"
                      style={{ backgroundColor: activeStore.themeHex }}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Proceed to Checkout</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Receipt Screen */
              <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
                <div className="m-5 flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                  {/* Store Header in Receipt */}
                  <div className="text-center pb-5 border-b border-dashed border-slate-200">
                    <CheckCircle2 className="h-10 w-10 text-emerald-555 mx-auto mb-2" />
                    <h3 className="font-black text-slate-900 text-lg tracking-tight">Transaction Successful!</h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-wider">
                      THANK YOU FOR SHOPPING AT
                    </p>
                    <p className="font-bold text-sm text-slate-800" style={{ color: activeStore.themeHex }}>
                      {activeStore.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{activeStore.location}</p>
                    <p className="text-[9px] font-mono text-slate-450 mt-1">VAT/TAX ID: TX-8390123-B</p>
                  </div>

                  {/* Items List */}
                  <div className="my-5 flex-grow space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-start text-xs text-slate-650">
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="font-bold text-slate-900 truncate">{item.product.title}</span>
                          <span className="text-[10px] font-mono text-slate-450">
                            {item.quantity} x {formatCurrency(item.product.price)}
                          </span>
                        </div>
                        <span className="font-mono text-slate-900 font-extrabold shrink-0">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing breakdown block */}
                  <div className="border-t border-dashed border-slate-200 pt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-650 font-bold">
                        <span>Branch Promo ({discountPercent}%)</span>
                        <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span className="font-mono font-semibold text-slate-800">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-slate-950 font-black text-base pt-2 border-t border-slate-200">
                      <span>Total Paid</span>
                      <span className="font-mono" style={{ color: activeStore.themeHex }}>
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Barcode & Footer info */}
                  <div className="text-center pt-5 border-t border-dashed border-slate-200 mt-4">
                    {/* Simulated barcode */}
                    <div className="flex items-center justify-center space-x-0.5 bg-slate-50 py-3 rounded-lg overflow-hidden border border-slate-200 max-w-[200px] mx-auto opacity-80">
                      <div className="w-1 h-8 bg-slate-900" />
                      <div className="w-2 h-8 bg-slate-900" />
                      <div className="w-0.5 h-8 bg-slate-900" />
                      <div className="w-1.5 h-8 bg-slate-900" />
                      <div className="w-0.5 h-8 bg-slate-300" />
                      <div className="w-1 h-8 bg-slate-900" />
                      <div className="w-0.5 h-8 bg-slate-900" />
                      <div className="w-2 h-8 bg-slate-900" />
                      <div className="w-1 h-8 bg-slate-900" />
                      <div className="w-0.5 h-8 bg-slate-900" />
                      <div className="w-1.5 h-8 bg-slate-900" />
                    </div>
                    <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                      TRANS-ID: #{Math.floor(Math.random() * 900000) + 100000}
                    </p>
                    <p className="text-[10px] text-slate-450 mt-1 leading-tight">
                      Receipt parsed securely. Thank you daily checkouts!
                    </p>
                  </div>

                  <button
                    onClick={handleFinishCheckout}
                    className="w-full mt-5 py-3 text-white text-xs font-bold rounded-xl shadow-xs transition-colors hover:brightness-105 cursor-pointer"
                    style={{ backgroundColor: activeStore.themeHex }}
                  >
                    Finish and Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
