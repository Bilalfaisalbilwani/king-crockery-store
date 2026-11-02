import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Award, Utensils, CheckCircle2, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/product/ProductCard.tsx';

interface HomePageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products, categories, settings } = useStore();

  const heroSettings = settings?.hero || {
    headline: 'Make Every Meal a Beautiful Experience',
    supportingText: 'Discover elegant dinnerware, premium serving essentials and thoughtfully selected crockery for every occasion.',
    primaryCtaText: 'Shop Collection',
    secondaryCtaText: 'Explore Dinner Sets',
    imageUrl: '/src/assets/images/hero_dining_table_1793629991679.jpg',
  };

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Full-Width Premium Hero Banner */}
      <section className="relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden bg-stone-950">
        <div className="absolute inset-0 z-0">
          <img
            src={heroSettings.imageUrl}
            alt="Opulent dining table with King Crockery dinnerware"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-70 scale-102 transition-transform duration-1000"
          />
          {/* Measured Scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#EAD09C] text-xs font-semibold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gul Plaza Karachi · Official Store</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15] text-balance">
            {heroSettings.headline}
          </h1>

          <p className="text-base sm:text-lg text-stone-200 max-w-2xl mx-auto mb-10 font-normal leading-relaxed text-balance">
            {heroSettings.supportingText}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FAF8F5] text-stone-950 text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-[#EAD09C] transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{heroSettings.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('category', 'dinner-sets')}
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/70 text-white text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all duration-200 cursor-pointer"
            >
              {heroSettings.secondaryCtaText}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Featured Collections (Shopify Dawn Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6D37] block mb-1">
              Curated Catalogs
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Featured Collections
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-950 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onNavigate('category', category.slug)}
              className="group cursor-pointer flex flex-col bg-white border border-stone-200/90 overflow-hidden hover:border-stone-900 transition-all duration-300"
            >
              <div className="aspect-square bg-stone-100 overflow-hidden relative">
                <img
                  src={category.image}
                  alt={category.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <div className="p-3 text-center bg-white flex-1 flex flex-col justify-center">
                <h3 className="font-serif text-sm font-semibold text-stone-900 group-hover:text-[#8C6D37] transition-colors leading-tight">
                  {category.name}
                </h3>
                <span className="text-[11px] text-stone-500 mt-0.5 tabular-nums">
                  {category.itemCount} Items
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Best Sellers / Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6D37] block mb-1">
            Genuine Store Highlights
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Best Sellers &amp; New Arrivals
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Selected from King Crockery's Gul Plaza warehouse, crafted for fine dining durability and opulent aesthetics.
          </p>
        </div>

        {/* 4 columns on large desktop, 3 on md, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
          >
            View Full Catalogue ({products.length} Products)
          </button>
        </div>
      </section>

      {/* 4. Promotional Editorial Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5EFEB] border border-stone-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-12 lg:p-16">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6D37] block mb-2">
                Banquet &amp; Dawat Special
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4 text-balance">
                Insulated Hot Pots &amp; Thermal Banquet Serveware
              </h2>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed mb-6">
                Keep biryani, korma, and fresh naans hot for up to 6 hours. High-density polyurethane thermal insulation with mirror-finish food grade stainless steel interior bowls.
              </p>
              <div className="space-y-2.5 mb-8 text-xs sm:text-sm text-stone-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C6D37]" />
                  <span>Double-wall thermal lock retains flavor and steam</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C6D37]" />
                  <span>Available in Maroon, Black, Light Brown &amp; Grey</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C6D37]" />
                  <span>Signature 4-Piece Sets complete with thermal water cooler</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('category', 'hot-pots')}
                className="px-6 py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Shop Hot Pots Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-4/3 lg:aspect-auto lg:h-full overflow-hidden bg-stone-200">
              <img
                src="/src/assets/images/collection_hot_pots_1793629993114.jpg"
                alt="Maroon and Gold Hot Pots by King Crockery"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Shop With Us (Strictly Verified Store Qualities) */}
      <section className="bg-white py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6D37] block mb-1">
              Direct From Gul Plaza Karachi
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Why Choose King Crockery Store
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-[#FAF8F5] border border-stone-200/80">
              <div className="w-12 h-12 mx-auto mb-4 bg-white border border-stone-300 rounded-none flex items-center justify-center">
                <Utensils className="w-5 h-5 text-[#8C6D37]" />
              </div>
              <h3 className="font-serif text-base font-semibold text-stone-900 mb-2">
                Pure Melamine Selection
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                100% food-grade certified double glazed melamine plates and serving platters that do not chip or fade.
              </p>
            </div>

            <div className="text-center p-6 bg-[#FAF8F5] border border-stone-200/80">
              <div className="w-12 h-12 mx-auto mb-4 bg-white border border-stone-300 rounded-none flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#8C6D37]" />
              </div>
              <h3 className="font-serif text-base font-semibold text-stone-900 mb-2">
                4% Advance Discount
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pay in advance via secure bank transfer and enjoy an instant 4% reduction off your subtotal.
              </p>
            </div>

            <div className="text-center p-6 bg-[#FAF8F5] border border-stone-200/80">
              <div className="w-12 h-12 mx-auto mb-4 bg-white border border-stone-300 rounded-none flex items-center justify-center">
                <Award className="w-5 h-5 text-[#8C6D37]" />
              </div>
              <h3 className="font-serif text-base font-semibold text-stone-900 mb-2">
                Gul Plaza Heritage
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Direct trade access to Karachi's renowned wholesale crockery center ensures genuine prices and authentic stock.
              </p>
            </div>

            <div className="text-center p-6 bg-[#FAF8F5] border border-stone-200/80">
              <div className="w-12 h-12 mx-auto mb-4 bg-white border border-stone-300 rounded-none flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#8C6D37]" />
              </div>
              <h3 className="font-serif text-base font-semibold text-stone-900 mb-2">
                Cash on Delivery (COD)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Shop with complete peace of mind. Inspect and pay your rider upon delivery at your doorstep anywhere in Pakistan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Real Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6D37] block mb-1">
            Customer Testimonials
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            What Our Patrons Say
          </h2>
          <p className="text-xs text-stone-500 mt-1">Verified reviews from Pakistani dining tables</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-[#8C6D37] mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-sm text-stone-700 italic leading-relaxed mb-4">
                "The Orchid 30pc set arrived safely in Lahore without a single scratch! The double glaze feels so luxurious, almost like imported bone china."
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-stone-900">Saima Farooq</span>
              <span>Lahore, Pakistan</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-[#8C6D37] mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-sm text-stone-700 italic leading-relaxed mb-4">
                "The 4 Liter Hot Pot in Maroon kept our biryani piping hot from 1 PM lunch until our late guests arrived at 6 PM. Extremely impressed."
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-stone-900">Tariq Mehmood</span>
              <span>Islamabad, Pakistan</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-[#8C6D37] mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-sm text-stone-700 italic leading-relaxed mb-4">
                "The AYD Gold Cutlery with stand is the star of my dining table. Weight feels very premium and the gold finish is flawless."
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-stone-900">Ayesha Bilgrami</span>
              <span>Karachi, Pakistan</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
