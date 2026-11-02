import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { formatPKR } from '../../utils/formatters.ts';

interface CartDrawerProps {
  onNavigate: (page: string, param?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingThreshold,
    progressToFreeShipping,
  } = useCart();

  if (!isCartOpen) return null;

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  const handleViewCartClick = () => {
    setIsCartOpen(false);
    onNavigate('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="font-serif text-lg font-bold text-stone-900 tracking-wide uppercase">
                Your Shopping Bag
              </h2>
              <span className="text-xs text-stone-500 tabular-nums">({items.length} items)</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F4EFEB] p-3.5 border-b border-stone-200">
            <div className="flex items-center gap-2 text-xs text-stone-700 font-medium mb-1.5">
              <Truck className="w-4 h-4 text-[#C8A261]" />
              {amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-stone-950 font-bold">{formatPKR(amountNeededForFreeShipping)}</strong> more for <strong className="text-[#8C6D37]">Free Nationwide Delivery</strong>
                </span>
              ) : (
                <span className="text-[#8C6D37] font-semibold">
                  Congratulations! You unlocked Free Delivery across Pakistan.
                </span>
              )}
            </div>
            <div className="w-full bg-stone-300 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C8A261] h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-200">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-stone-300 stroke-1 mb-3" />
                <p className="font-serif text-lg text-stone-800 font-medium">Your bag is empty</p>
                <p className="text-xs text-stone-500 mt-1 mb-6 max-w-xs">
                  Discover exquisite dinner sets, thermal hot pots, and fine cutlery for your home.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('shop');
                  }}
                  className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.productTitle}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover bg-stone-100 border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900 line-clamp-1 hover:text-[#8C6D37] cursor-pointer"
                        onClick={() => {
                          setIsCartOpen(false);
                          onNavigate('product', item.productSlug);
                        }}
                      >
                        {item.productTitle}
                      </h4>
                      {item.variantName && (
                        <p className="text-xs text-stone-500 mt-0.5 truncate">
                          Option: <span className="font-medium text-stone-700">{item.variantName}</span>
                        </p>
                      )}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-bold text-stone-900 tabular-nums">
                          {formatPKR(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-stone-400 line-through tabular-nums">
                            {formatPKR(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-300 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-stone-500 hover:text-stone-950 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-stone-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 text-stone-500 hover:text-stone-950 transition-colors cursor-pointer disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {formatPKR(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Estimated Shipping</span>
                  <span>{amountNeededForFreeShipping === 0 ? 'FREE' : 'Calculated at checkout'}</span>
                </div>
                <div className="p-2 bg-[#FBF7EE] border border-[#E9D9B9] text-[11px] text-[#7A5B20]">
                  💡 <strong>4% instant discount</strong> applied automatically when choosing Bank Transfer at checkout.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleViewCartClick}
                  className="w-full py-2.5 px-3 border border-stone-300 text-stone-800 text-xs font-semibold tracking-wider uppercase hover:bg-stone-50 transition-colors text-center cursor-pointer"
                >
                  View Bag
                </button>
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full py-2.5 px-3 bg-stone-900 text-white text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
