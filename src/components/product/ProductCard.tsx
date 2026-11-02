import React from 'react';
import { Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types/index.ts';
import { formatPKR, calculateDiscountPct } from '../../utils/formatters.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, param?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const { setQuickViewProduct } = useStore();
  const discountPct = calculateDiscountPct(product.price, product.originalPrice);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants && product.variants.length > 1) {
      setQuickViewProduct(product);
    } else {
      addToCart(product, product.variants[0] || undefined, 1);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      onClick={() => onNavigate('product', product.slug)}
      className="group flex flex-col bg-white border border-stone-200/80 hover:border-stone-400 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      {/* Media Slot with 4:3 Aspect Ratio */}
      <div className="relative aspect-4/3 w-full bg-[#F4EFEB] overflow-hidden">
        <img
          src={product.images[0] || '/src/assets/images/collection_dinner_sets_1793629992325.jpg'}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Genuine Discount Tag */}
        {discountPct && discountPct > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-stone-900 text-white text-[11px] font-semibold px-2 py-0.5 tracking-wider uppercase">
            Save {discountPct}%
          </div>
        )}

        {/* Out of stock label */}
        {!product.inStock && (
          <div className="absolute top-2.5 right-2.5 bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
            Sold Out
          </div>
        )}

        {/* Quick View Button Hover Layer */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleQuickView}
            className="flex-1 py-2 px-3 bg-white/95 text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-[#8C6D37] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed clean metadata kicker (anti-slop) */}
          <div className="text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
            {product.categoryName}
            {product.variants.length > 1 && (
              <>
                <span className="mx-1 text-stone-300">·</span>
                <span className="text-[#8C6D37] font-semibold">{product.variants.length} Options</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-sm sm:text-base font-semibold text-stone-900 group-hover:text-[#8C6D37] transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </div>

        {/* Price & Primary Action */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-stone-950 tabular-nums">
                {formatPKR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-500 block">PKR Incl. taxes</span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
              product.inStock
                ? 'bg-stone-900 text-white hover:bg-stone-800'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title={product.variants.length > 1 ? 'Select Option' : 'Add to Bag'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {product.variants.length > 1 ? 'Options' : 'Add'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
