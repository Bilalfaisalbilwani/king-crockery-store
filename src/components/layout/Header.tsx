import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: string, param?: string) => {
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
    onNavigate(page, param);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-xs border-b border-stone-200/80 py-3.5'
            : 'bg-[#FAF8F5] border-b border-stone-200 py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-stone-700 hover:text-stone-950 focus:outline-hidden"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleNavClick('home')}
                className="text-left cursor-pointer group"
              >
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-widest uppercase text-stone-950 block leading-tight">
                  King Crockery
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C6D37] block font-medium -mt-0.5">
                  Store · Gul Plaza Karachi
                </span>
              </button>
            </div>

            {/* Zone 2: Dawn-style Clean Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
              <button
                onClick={() => handleNavClick('home')}
                className={`transition-colors hover:text-stone-950 cursor-pointer ${
                  currentPage === 'home' ? 'text-stone-950 font-semibold border-b-2 border-stone-950 pb-0.5' : ''
                }`}
              >
                Home
              </button>

              {/* Shop with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNavClick('shop')}
                  className={`inline-flex items-center gap-1 transition-colors hover:text-stone-950 cursor-pointer ${
                    currentPage === 'shop' || currentPage === 'category' ? 'text-stone-950 font-semibold' : ''
                  }`}
                >
                  <span>Catalog</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {shopDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white border border-stone-200 shadow-lg rounded-none py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => handleNavClick('shop')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:bg-[#FAF8F5] hover:text-stone-950 cursor-pointer border-b border-stone-100"
                    >
                      All Crockery Collections
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleNavClick('category', cat.slug)}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-[#FAF8F5] hover:text-stone-950 cursor-pointer flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-stone-400 tabular-nums">({cat.itemCount})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavClick('category', 'dinner-sets')}
                className={`transition-colors hover:text-stone-950 cursor-pointer ${
                  currentPage === 'category' ? 'text-stone-950' : ''
                }`}
              >
                Dinner Sets
              </button>

              <button
                onClick={() => handleNavClick('category', 'hot-pots')}
                className="transition-colors hover:text-stone-950 cursor-pointer"
              >
                Hot Pots
              </button>

              <button
                onClick={() => handleNavClick('category', 'serving-platters')}
                className="transition-colors hover:text-stone-950 cursor-pointer"
              >
                Serving &amp; Trays
              </button>

              <button
                onClick={() => handleNavClick('about')}
                className={`transition-colors hover:text-stone-950 cursor-pointer ${
                  currentPage === 'about' ? 'text-stone-950 font-semibold border-b-2 border-stone-950 pb-0.5' : ''
                }`}
              >
                About Us
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className={`transition-colors hover:text-stone-950 cursor-pointer ${
                  currentPage === 'contact' ? 'text-stone-950 font-semibold border-b-2 border-stone-950 pb-0.5' : ''
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Zone 3: Actions (Search, Account, Cart) */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onOpenSearch}
                className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
                title="Search crockery"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleNavClick('account')}
                className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
                title="My Account & Track Order"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
                title="View Shopping Bag"
                aria-label={`Cart with ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-stone-950 text-white text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Admin Portal Quick Link */}
              <button
                onClick={() => handleNavClick('admin')}
                className="hidden xl:inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-950 transition-colors cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF8F5] shadow-xl flex flex-col z-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-serif text-lg font-bold tracking-wider uppercase text-stone-950 block">
                  King Crockery
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#8C6D37]">
                  Gul Plaza Karachi
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              <button
                onClick={() => handleNavClick('home')}
                className="w-full text-left py-2.5 text-base font-medium text-stone-900 hover:text-[#8C6D37]"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop')}
                className="w-full text-left py-2.5 text-base font-semibold text-stone-900 hover:text-[#8C6D37]"
              >
                All Crockery (Shop All)
              </button>

              <div className="pt-2 pb-1 text-xs font-semibold tracking-wider uppercase text-stone-400">
                Collections
              </div>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleNavClick('category', c.slug)}
                  className="w-full text-left py-2 pl-3 text-sm text-stone-700 hover:text-stone-950 flex items-center justify-between"
                >
                  <span>{c.name}</span>
                  <span className="text-xs text-stone-400 tabular-nums">{c.itemCount}</span>
                </button>
              ))}

              <div className="pt-4 pb-1 text-xs font-semibold tracking-wider uppercase text-stone-400">
                Information &amp; Orders
              </div>
              <button
                onClick={() => handleNavClick('about')}
                className="w-full text-left py-2 text-sm text-stone-700"
              >
                About Our Heritage
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full text-left py-2 text-sm text-stone-700"
              >
                Contact &amp; Gul Plaza Store
              </button>
              <button
                onClick={() => handleNavClick('account')}
                className="w-full text-left py-2 text-sm text-stone-700"
              >
                Track Your Order
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left py-2 text-sm text-stone-500 font-semibold"
              >
                Store Admin Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
