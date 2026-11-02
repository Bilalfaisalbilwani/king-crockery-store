import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { AnnouncementBar } from './components/layout/AnnouncementBar.tsx';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { CartDrawer } from './components/cart/CartDrawer.tsx';
import { QuickViewModal } from './components/product/QuickViewModal.tsx';
import { SearchModal } from './components/search/SearchModal.tsx';
import { WhatsAppFloatingButton } from './components/whatsapp/WhatsAppFloatingButton.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.tsx';
import { AccountPage } from './pages/AccountPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { AboutPage, ContactPage, FaqsPage, PolicyPage } from './pages/InfoPages.tsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParam, setPageParam] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, pageParam]);

  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page);
    setPageParam(param || '');
  };

  return (
    <StoreProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans antialiased">
          {/* Top Announcement Bar */}
          <AnnouncementBar onNavigate={handleNavigate} />

          {/* Primary Header */}
          <Header
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          {/* Main Content Router */}
          <main className="flex-1">
            {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}

            {currentPage === 'shop' && (
              <ShopPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'category' && (
              <ShopPage initialCategory={pageParam} onNavigate={handleNavigate} />
            )}

            {currentPage === 'product' && (
              <ProductDetailPage slug={pageParam} onNavigate={handleNavigate} />
            )}

            {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}

            {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}

            {currentPage === 'order-confirmation' && (
              <OrderConfirmationPage orderNumber={pageParam} onNavigate={handleNavigate} />
            )}

            {currentPage === 'account' && (
              <AccountPage initialSearch={pageParam} onNavigate={handleNavigate} />
            )}

            {currentPage === 'admin' && <AdminPage onNavigate={handleNavigate} />}

            {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}

            {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}

            {currentPage === 'faqs' && <FaqsPage />}

            {currentPage === 'shipping-policy' && (
              <PolicyPage
                title="Shipping & Delivery Policy"
                content={[
                  'King Crockery Store delivers to all cities and towns across Pakistan via established courier partners including TCS, Leopard Courier, Trax, and M&P.',
                  'Orders placed before 2:00 PM PST are packed and dispatched on the same business day from our Gul Plaza Karachi warehouse.',
                  'Standard transit duration is 1-2 business days for Karachi and 2-4 business days for major cities in Punjab, KPK, and Balochistan.',
                  'A standard shipping charge of PKR 250 applies to small orders. All orders above PKR 5,000 qualify for FREE nationwide shipping.',
                ]}
              />
            )}

            {currentPage === 'return-policy' && (
              <PolicyPage
                title="Return & Refund Policy"
                content={[
                  'We take immense pride in the quality of our double glazed melamine and stainless steel cookware. Every item undergoes rigorous inspection prior to dispatch.',
                  'In the unlikely event that your package sustains transit damage, please notify our customer support on WhatsApp within 24 hours of receiving the parcel along with an unboxing video.',
                  'Damaged or defective items will be replaced free of charge without hassle.',
                ]}
              />
            )}

            {currentPage === 'privacy-policy' && (
              <PolicyPage
                title="Privacy Policy"
                content={[
                  'King Crockery Store respects your personal privacy. We collect customer names, phone numbers, and delivery addresses strictly for order fulfillment and courier dispatch.',
                  'We do not sell, share, or disclose customer personal information to third parties.',
                  'All bank payment screenshots and receipts uploaded through our portal are stored securely and accessed exclusively by authorized finance managers.',
                ]}
              />
            )}

            {currentPage === 'terms-conditions' && (
              <PolicyPage
                title="Terms & Conditions"
                content={[
                  'By accessing and placing an order on King Crockery Store, you agree to comply with our purchasing terms.',
                  'All prices are listed in Pakistani Rupees (PKR) and include applicable local taxes.',
                  'King Crockery Store reserves the right to verify customer phone numbers prior to dispatching Cash on Delivery (COD) orders.',
                ]}
              />
            )}
          </main>

          {/* Footer */}
          <Footer onNavigate={handleNavigate} />

          {/* Drawers & Modals */}
          <CartDrawer onNavigate={handleNavigate} />
          <QuickViewModal onNavigate={handleNavigate} />
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={handleNavigate}
          />
          <WhatsAppFloatingButton />
        </div>
      </CartProvider>
    </StoreProvider>
  );
}
