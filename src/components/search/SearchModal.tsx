import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Product } from '../../types/index.ts';
import { formatPKR } from '../../utils/formatters.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, param?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { products } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectProduct = (product: Product) => {
    onClose();
    onNavigate('product', product.slug);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-start justify-center p-4 sm:p-6 md:p-12">
        <div className="relative w-full max-w-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden animate-in slide-in-from-top-4 duration-200">
          {/* Search bar input */}
          <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center gap-3 bg-[#FAF8F5]">
            <Search className="w-5 h-5 text-stone-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dinner sets, hot pots, cake stands, cutlery..."
              className="flex-1 bg-transparent text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-hidden"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer text-xs uppercase font-semibold tracking-wider ml-2"
            >
              Close
            </button>
          </div>

          {/* Results List */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {query.trim() === '' ? (
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-stone-400 mb-3">
                  Popular Crockery Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Melamine Dinner Set',
                    '4 Liter Hot Pot',
                    '3 Tier Cake Stand',
                    'AYD Gold Cutlery',
                    'Acrylic Drinkware',
                    'Serving Tray',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 bg-[#F4EFEB] hover:bg-[#EAE2DA] text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-stone-600 font-medium">No products found matching "{query}".</p>
                <p className="text-xs text-stone-400 mt-1">
                  Try searching for "Dinner Set", "Hot Pot", "Platter", or "Cutlery".
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-stone-500 mb-2 font-medium">
                  Found <strong className="text-stone-900">{filtered.length}</strong> matching products:
                </p>
                {filtered.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className="flex items-center gap-4 p-2.5 hover:bg-[#FAF8F5] border border-transparent hover:border-stone-200 transition-all cursor-pointer"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-semibold text-[#8C6D37] tracking-wider block">
                        {prod.categoryName}
                      </span>
                      <h4 className="text-sm font-semibold text-stone-900 truncate">
                        {prod.title}
                      </h4>
                      <span className="text-xs font-bold text-stone-900 tabular-nums">
                        {formatPKR(prod.price)}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
