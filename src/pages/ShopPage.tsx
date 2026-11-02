import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ChevronDown, X, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/product/ProductCard.tsx';
import { formatPKR } from '../utils/formatters.ts';

interface ShopPageProps {
  initialCategory?: string;
  onNavigate: (page: string, param?: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory, onNavigate }) => {
  const { products, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync category if navigated from header
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      const cat = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
      if (cat) {
        list = list.filter((p) => p.categoryId === cat.id || p.categoryName.toLowerCase().includes(cat.name.toLowerCase()));
      }
    }

    // Price filter
    list = list.filter((p) => p.price <= maxPrice);

    // In stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Sort
    switch (selectedSort) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // featured default
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [products, categories, selectedCategory, maxPrice, inStockOnly, selectedSort]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(15000);
    setInStockOnly(false);
    setSelectedSort('featured');
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Breadcrumb */}
      <div className="mb-8 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <button onClick={() => onNavigate('home')} className="hover:text-stone-900 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-stone-900 font-medium">Catalog</span>
          {activeCategoryObj && (
            <>
              <span>/</span>
              <span className="text-[#8C6D37] font-semibold">{activeCategoryObj.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
              {activeCategoryObj ? activeCategoryObj.name : 'All Crockery & Tableware'}
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              {activeCategoryObj
                ? activeCategoryObj.description
                : 'Browse our complete catalog of dinner sets, insulated hot pots, cake stands, and stainless steel cutlery.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-white border border-stone-300 text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter ({filteredProducts.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 hidden sm:inline">Sort by:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-white border border-stone-300 px-3 py-2 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-stone-900 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8 pr-4 border-r border-stone-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-stone-900">Categories</h3>
              {(selectedCategory !== 'all' || inStockOnly || maxPrice < 15000) && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#8C6D37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-2 px-3 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'text-stone-700 hover:bg-[#F4EFEB]'
                }`}
              >
                <span>All Collections</span>
                <span className="tabular-nums">({products.length})</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left py-2 px-3 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'text-stone-700 hover:bg-[#F4EFEB]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="tabular-nums">({cat.itemCount})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-6 border-t border-stone-200">
            <h3 className="font-serif text-base font-bold text-stone-900 mb-3">Max Price</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="500"
                max="15000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs text-stone-600 font-semibold tabular-nums">
                <span>₨ 500</span>
                <span className="text-stone-950 font-bold">{formatPKR(maxPrice)}</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="pt-6 border-t border-stone-200">
            <h3 className="font-serif text-base font-bold text-stone-900 mb-3">Availability</h3>
            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded-none border-stone-300 text-stone-900 focus:ring-0 w-4 h-4"
              />
              <span>In Stock Only ({products.filter((p) => p.inStock).length})</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between text-xs text-stone-500">
            <span>
              Showing <strong className="text-stone-900">{filteredProducts.length}</strong> items
            </span>
            {selectedCategory !== 'all' && (
              <span className="font-medium text-stone-700">
                Filtering by: {categories.find((c) => c.slug === selectedCategory)?.name}
              </span>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 text-center border border-stone-200">
              <p className="font-serif text-lg font-semibold text-stone-900 mb-2">No products matched your criteria</p>
              <p className="text-xs text-stone-500 mb-6">
                Try widening your price range or clearing selected category filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-base font-bold text-stone-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6 flex-1">
              {/* Categories */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Categories
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 text-xs ${
                      selectedCategory === 'all' ? 'bg-stone-900 text-white font-bold' : 'text-stone-700'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 text-xs ${
                        selectedCategory === c.slug ? 'bg-stone-900 text-white font-bold' : 'text-stone-700'
                      }`}
                    >
                      {c.name} ({c.itemCount})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Max Price: {formatPKR(maxPrice)}
                </h4>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-stone-900"
                />
              </div>

              {/* In stock */}
              <div>
                <label className="flex items-center gap-2 text-xs text-stone-800">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-stone-900"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
