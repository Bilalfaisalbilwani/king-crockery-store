import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

interface FooterProps {
  onNavigate: (page: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, categories } = useStore();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setSubscribing(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#171513] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-stone-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-stone-800/60 flex items-center justify-center shrink-0 border border-stone-700/50">
              <ShieldCheck className="w-6 h-6 text-[#C8A261]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100 tracking-wide">100% Genuine Crockery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Pure food-grade double glazed melamine &amp; 18/10 steel.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-stone-800/60 flex items-center justify-center shrink-0 border border-stone-700/50">
              <Truck className="w-6 h-6 text-[#C8A261]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100 tracking-wide">Nationwide Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Reliable dispatch to Karachi, Lahore, Islamabad &amp; all cities.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-stone-800/60 flex items-center justify-center shrink-0 border border-stone-700/50">
              <RefreshCw className="w-6 h-6 text-[#C8A261]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100 tracking-wide">Safe Packaging</h4>
              <p className="text-xs text-stone-400 mt-0.5">Multi-layer bubble wrap &amp; rigid transit boxing guaranteed.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-stone-800/80">
          {/* Col 1 & 2: Brand & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-serif text-2xl font-bold tracking-widest uppercase text-white block">
                King Crockery Store
              </span>
              <span className="text-xs tracking-[0.2em] uppercase text-[#C8A261] font-medium block mt-1">
                Wholesale &amp; Retail Dining Essentials
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Serving households and banquets across Pakistan with dinner sets, hot pots, cake stands, and cutlery from Karachi's renowned Gul Plaza trade center.
            </p>

            <div className="space-y-2 pt-2 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8A261] shrink-0 mt-0.5" />
                <span>{settings?.contact.address || 'Shop No B27 & B28, Basement Floor, City Shopping Center, Behind Gul Plaza, Karachi'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8A261] shrink-0" />
                <span>{settings?.contact.phone1 || '+92-21-32710174'} · {settings?.contact.phone2 || '+92-21-32710492'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8A261] shrink-0" />
                <span>{settings?.contact.email || 'kingcrockery@hotmail.com'}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Shop Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onNavigate('category', c.slug)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors cursor-pointer text-[#C8A261]"
                >
                  View All Collections &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('account')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faqs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shipping-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shipping &amp; Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('return-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Return &amp; Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms-conditions')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Subscribe to receive new dinnerware arrivals, seasonal banquet collections, and special offers.
            </p>

            {subscribed ? (
              <div className="p-3 bg-stone-900 border border-[#C8A261]/40 rounded-none text-xs text-[#C8A261] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-stone-900 border border-stone-700 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-[#C8A261] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#C8A261] text-stone-950 hover:bg-[#d8b577] transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {errorMsg && <p className="text-[11px] text-red-400">{errorMsg}</p>}
                <p className="text-[10px] text-stone-500">We respect your privacy. No spam ever.</p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} King Crockery Store. All rights reserved. Registered at City Shopping Center, Karachi.</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400 font-medium">Payment Methods:</span>
            <span>Cash on Delivery (COD)</span>
            <span>·</span>
            <span>Advance Bank Transfer (4% Off)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
