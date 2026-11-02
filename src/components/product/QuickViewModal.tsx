import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { formatPKR, calculateDiscountPct } from '../../utils/formatters.ts';

interface QuickViewModalProps {
  onNavigate: (page: string, param?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigate }) => {
  const { quickViewProduct, setQuickViewProduct } = useStore();
  const { addToCart } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const variants = quickViewProduct.variants || [];
  const activeVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0] || undefined;

  const currentPrice = activeVariant ? activeVariant.price : quickViewProduct.price;
  const currentOriginalPrice = activeVariant ? activeVariant.originalPrice : quickViewProduct.originalPrice;
  const maxStock = activeVariant ? activeVariant.stockQuantity : quickViewProduct.stockQuantity;
  const discountPct = calculateDiscountPct(currentPrice, currentOriginalPrice);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, activeVariant, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
    }, 900);
  };

  const handleViewFullDetails = () => {
    setQuickViewProduct(null);
    onNavigate('product', quickViewProduct.slug);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 hover:bg-white text-stone-500 hover:text-stone-900 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="aspect-square bg-[#F4EFEB] relative overflow-hidden">
              <img
                src={quickViewProduct.images[0] || '/src/assets/images/collection_dinner_sets_1793629992325.jpg'}
                alt={quickViewProduct.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {discountPct && (
                <div className="absolute top-3 left-3 bg-stone-900 text-white text-[11px] font-semibold px-2 py-0.5 tracking-wider uppercase">
                  Save {discountPct}%
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37]">
                  {quickViewProduct.categoryName}
                </span>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 mt-1 mb-2 leading-snug">
                  {quickViewProduct.title}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-stone-950 tabular-nums">
                    {formatPKR(currentPrice)}
                  </span>
                  {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                    <span className="text-sm text-stone-400 line-through tabular-nums">
                      {formatPKR(currentOriginalPrice)}
                    </span>
                  )}
                </div>

                {/* Variants Selector */}
                {variants.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Select Option: <span className="text-stone-900 font-normal">{activeVariant?.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                            (activeVariant?.id === v.id)
                              ? 'border-stone-900 bg-stone-900 text-white'
                              : 'border-stone-300 bg-stone-50 text-stone-700 hover:border-stone-500'
                          }`}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock status */}
                <div className="text-xs text-emerald-800 font-medium mb-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>In Stock ({maxStock} units ready to dispatch)</span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">Quantity</span>
                  <div className="flex items-center border border-stone-300 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 text-stone-600 hover:text-stone-950 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold tabular-nums">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                      className="p-1.5 text-stone-600 hover:text-stone-950 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={added || maxStock === 0}
                  className={`w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleViewFullDetails}
                  className="w-full text-center py-2 text-xs font-medium text-stone-600 hover:text-[#8C6D37] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View Complete Details &amp; Specifications</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
