import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { formatPKR } from '../utils/formatters.ts';

interface CartPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    progressToFreeShipping,
  } = useCart();

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#F4EFEB] flex items-center justify-center rounded-full">
          <ShoppingBag className="w-8 h-8 text-stone-400 stroke-1" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
          Explore our signature melamine dinner sets, insulated hot pots, and luxury golden cutlery collections.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
        >
          Browse Crockery Collections
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-950">
            Your Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review your selected crockery items before proceeding to checkout.
          </p>
        </div>
        <button
          onClick={() => onNavigate('shop')}
          className="text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-950 underline cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free shipping banner */}
          <div className="bg-[#F4EFEB] p-4 border border-stone-200 text-xs text-stone-700 font-medium">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-[#8C6D37]" />
              {amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-stone-950 font-bold">{formatPKR(amountNeededForFreeShipping)}</strong> more to unlock <strong className="text-[#8C6D37]">Free Nationwide Delivery</strong>!
                </span>
              ) : (
                <span className="text-[#8C6D37] font-semibold">
                  You qualify for Free Nationwide Shipping across Pakistan.
                </span>
              )}
            </div>
            <div className="w-full bg-stone-300 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C8A261] h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          <div className="bg-white border border-stone-200 divide-y divide-stone-200">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-4 min-w-0">
                  <img
                    src={item.image}
                    alt={item.productTitle}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-stone-100 border border-stone-200 shrink-0"
                  />
                  <div>
                    <h3
                      onClick={() => onNavigate('product', item.productSlug)}
                      className="font-serif text-base font-bold text-stone-900 hover:text-[#8C6D37] cursor-pointer line-clamp-2"
                    >
                      {item.productTitle}
                    </h3>
                    {item.variantName && (
                      <span className="text-xs text-stone-500 block mt-1">
                        Specification: <strong className="text-stone-700">{item.variantName}</strong>
                      </span>
                    )}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm font-bold text-stone-950 tabular-nums">
                        {formatPKR(item.price)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-stone-400 line-through tabular-nums">
                          {formatPKR(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stepper + Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                  <div className="flex items-center border border-stone-300 bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-stone-600 hover:text-stone-950 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold tabular-nums">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-1.5 text-stone-600 hover:text-stone-950 cursor-pointer disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-stone-950 tabular-nums block">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-600 text-xs inline-flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-stone-200 p-6 space-y-6 sticky top-24 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-stone-950 border-b border-stone-200 pb-3 uppercase tracking-wider">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {formatPKR(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Estimated Shipping</span>
                <span className="font-medium text-stone-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-xs">Free</span>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>

              <div className="p-3 bg-[#FBF7EE] border border-[#E9D9B9] text-xs text-[#7A5B20]">
                💡 Select <strong>Bank Transfer</strong> at checkout to receive an extra <strong>4% discount</strong> on your order total!
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-base font-bold text-stone-950">Estimated Total</span>
                <span className="text-2xl font-bold text-stone-950 tabular-nums">
                  {formatPKR(subtotal + shippingFee)}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-4 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8C6D37] shrink-0" />
                <span>Cash on Delivery or Bank Transfer available.</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8C6D37] shrink-0" />
                <span>Dispatched directly from Gul Plaza Karachi warehouse.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
