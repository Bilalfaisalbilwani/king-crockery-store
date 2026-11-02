import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  MessageCircle,
  Star,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { Product, ProductVariant, Review } from '../types/index.ts';
import { formatPKR, calculateDiscountPct, generateWhatsAppLink } from '../utils/formatters.ts';
import { ProductCard } from '../components/product/ProductCard.tsx';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (page: string, param?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { products, settings } = useStore();
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === slug || p.id === slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'reviews'>('specs');

  // Review form state
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
      setSelectedImageIndex(0);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariantId(product.variants[0].id);
      }
      setQuantity(1);

      // Fetch reviews
      fetch(`/api/reviews?productId=${product.id}`)
        .then((res) => res.json())
        .then((data) => setReviews(data))
        .catch((err) => console.error('Error fetching reviews:', err));
    }
  }, [product, slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-stone-600 mb-6">The requested product could not be found in our catalog.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const variants = product.variants || [];
  const activeVariant: ProductVariant | undefined =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentOriginalPrice = activeVariant ? activeVariant.originalPrice : product.originalPrice;
  const maxStock = activeVariant ? activeVariant.stockQuantity : product.stockQuantity;
  const discountPct = calculateDiscountPct(currentPrice, currentOriginalPrice);

  const handleAddToCart = () => {
    addToCart(product, activeVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, activeVariant, quantity);
    onNavigate('checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: newReviewName,
          rating: newReviewRating,
          comment: newReviewComment,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setReviews([saved, ...reviews]);
        setReviewSubmitted(true);
        setNewReviewName('');
        setNewReviewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // WhatsApp enquiry link
  const whatsappNumber = settings?.contact.whatsappNumber || '923002710174';
  const whatsappMsg = `Hello King Crockery Store! I want to inquire about *${product.title}*${
    activeVariant ? ` (${activeVariant.name})` : ''
  } priced at ${formatPKR(currentPrice)}. Is this in stock for delivery?`;
  const whatsappUrl = generateWhatsAppLink(whatsappNumber, whatsappMsg);

  const relatedProducts = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <button onClick={() => onNavigate('home')} className="hover:text-stone-900 cursor-pointer">
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => onNavigate('category', product.categoryId.replace('cat-', ''))}
          className="hover:text-stone-900 cursor-pointer"
        >
          {product.categoryName}
        </button>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left: Sticky Media Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-4/3 sm:aspect-square w-full bg-[#F4EFEB] border border-stone-200 overflow-hidden relative">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {discountPct && (
              <div className="absolute top-4 left-4 bg-stone-900 text-white text-xs font-semibold px-2.5 py-1 tracking-wider uppercase">
                Save {discountPct}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 shrink-0 border-2 overflow-hidden bg-stone-100 cursor-pointer transition-all ${
                    selectedImageIndex === idx ? 'border-stone-900 shadow-xs' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-wider mb-2">
              <span className="font-semibold text-[#8C6D37]">{product.categoryName}</span>
              <span className="font-mono tabular-nums">SKU: {activeVariant?.sku || 'KCS-STD'}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 leading-tight mb-3">
              {product.title}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#8C6D37] text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-700">{product.rating}</span>
              <span className="text-xs text-stone-400">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-white border border-stone-200 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-stone-950 tabular-nums">
                  {formatPKR(currentPrice)}
                </span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-base text-stone-400 line-through tabular-nums">
                    {formatPKR(currentOriginalPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Prices in Pakistani Rupees (PKR). <strong>4% instant discount</strong> when paying via Bank Transfer.
              </p>
            </div>

            {/* Variants Selector */}
            {variants.length > 0 && (
              <div className="mb-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Select Specification: <strong className="text-[#8C6D37]">{activeVariant?.name}</strong>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        activeVariant?.id === v.id
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400'
                      }`}
                    >
                      <span className="text-xs font-semibold leading-tight">{v.name}</span>
                      <span
                        className={`text-xs mt-1 tabular-nums ${
                          activeVariant?.id === v.id ? 'text-[#EAD09C]' : 'text-stone-500 font-medium'
                        }`}
                      >
                        {formatPKR(v.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Availability */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-stone-800">Quantity</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  In Stock ({maxStock} available)
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-semibold tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                    className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Purchase CTA Buttons */}
            <div className="space-y-2.5 mb-6">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added || maxStock === 0}
                className={`w-full py-3.5 px-6 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  added ? 'bg-emerald-700 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Your Shopping Bag!</span>
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
                onClick={handleBuyNow}
                disabled={maxStock === 0}
                className="w-full py-3.5 px-6 bg-[#C8A261] text-stone-950 text-xs font-semibold uppercase tracking-widest hover:bg-[#d6b477] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Zap className="w-4 h-4" />
                <span>Buy It Now (Direct Checkout)</span>
              </button>

              {/* WhatsApp direct order inquiry */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Order via WhatsApp Direct</span>
              </a>
            </div>

            {/* Quick Benefits Guarantee */}
            <div className="p-4 bg-[#F4EFEB] border border-stone-200/80 space-y-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8C6D37] shrink-0" />
                <span>Free delivery across Pakistan on orders above PKR 5,000</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8C6D37] shrink-0" />
                <span>Guaranteed genuine product dispatched from City Shopping Center, Karachi</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8C6D37] shrink-0" />
                <span>Standard courier transit: 2–4 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications / Description / Reviews */}
      <div className="mb-16 border-t border-stone-200 pt-8">
        <div className="flex border-b border-stone-200 gap-8 mb-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
              activeTab === 'specs'
                ? 'border-b-2 border-stone-950 text-stone-950'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Product Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
              activeTab === 'shipping'
                ? 'border-b-2 border-stone-950 text-stone-950'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Delivery &amp; Packaging
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
              activeTab === 'reviews'
                ? 'border-b-2 border-stone-950 text-stone-950'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 sm:p-8 border border-stone-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-3">About This Item</h3>
              <p className="text-sm text-stone-700 leading-relaxed mb-6">{product.description}</p>

              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-3">
                Key Highlights
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#8C6D37] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-3">Technical Details</h3>
              <div className="divide-y divide-stone-200 border border-stone-200">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex py-2.5 px-3 text-xs sm:text-sm">
                    <span className="w-1/2 font-semibold text-stone-800">{key}</span>
                    <span className="w-1/2 text-stone-600">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="bg-white p-6 sm:p-8 border border-stone-200 max-w-3xl space-y-4 text-sm text-stone-700">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Safe Transit &amp; Packaging</h3>
            <p className="leading-relaxed">
              Every order from King Crockery Store is individually protected using 3-ply air bubble cushioning, reinforced edge guards, and heavy corrugated outer cartons to safeguard delicate crockery in transit.
            </p>
            <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm">
              <li><strong>Karachi:</strong> 1 to 2 working days.</li>
              <li><strong>Punjab (Lahore, Islamabad, Rawalpindi, Faisalabad):</strong> 2 to 3 working days.</li>
              <li><strong>KPK, Balochistan &amp; Interior Sindh:</strong> 3 to 4 working days.</li>
              <li><strong>Cash on Delivery:</strong> Available nationwide with verified delivery partners (TCS, Leopard, Trax).</li>
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white p-6 sm:p-8 border border-stone-200 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Customer Feedback ({reviews.length})
              </h3>

              {reviews.length === 0 ? (
                <p className="text-sm text-stone-500 italic">No reviews yet for this product. Be the first to share your thoughts!</p>
              ) : (
                <div className="divide-y divide-stone-200">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-sm text-stone-900">{rev.customerName}</span>
                        <span className="text-xs text-stone-400">{rev.date}</span>
                      </div>
                      <div className="flex text-[#8C6D37] text-xs mb-2">
                        {[...Array(rev.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <p className="text-sm text-stone-700 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a review form */}
            <div className="p-5 bg-[#FAF8F5] border border-stone-200 h-fit">
              <h4 className="font-serif text-base font-bold text-stone-900 mb-3">Write a Review</h4>
              {reviewSubmitted ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                  Thank you! Your verified review has been submitted.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      required
                      placeholder="e.g. Fatima Ali"
                      className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Rating
                    </label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900 cursor-pointer"
                    >
                      <option value={5}>5 Stars - Exceptional</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Below Average</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Review Comment
                    </label>
                    <textarea
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      required
                      rows={3}
                      placeholder="Share your dining experience with this set..."
                      className="w-full bg-white border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6D37]">Pairing Suggestions</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                You May Also Like
              </h3>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-stone-200 p-3 z-30 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-stone-950 tabular-nums block">
            {formatPKR(currentPrice)}
          </span>
          <span className="text-[10px] text-stone-500 truncate max-w-[150px] block">
            {activeVariant?.name || product.title}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
};
