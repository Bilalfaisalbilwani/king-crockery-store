import React from 'react';
import { MapPin, Phone, Mail, Clock, Award, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface InfoPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AboutPage: React.FC<InfoPageProps> = ({ onNavigate }) => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6D37] block mb-1">
          Gul Plaza Karachi Heritage
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950">
          About King Crockery Store
        </h1>
        <p className="text-sm text-stone-600 mt-3 leading-relaxed">
          Crafting memorable dining experiences across Pakistan with genuine double glazed melamine, insulated banquet hot pots, and fine cutlery.
        </p>
      </div>

      <div className="aspect-16/9 bg-stone-200 overflow-hidden border border-stone-200">
        <img
          src="/src/assets/images/hero_dining_table_1793629991679.jpg"
          alt="King Crockery Store dining setup"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose prose-stone max-w-none text-sm leading-relaxed space-y-6 text-stone-700">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Our Origin &amp; Commitment</h2>
        <p>
          Located at the wholesale center of Karachi in City Shopping Center behind Gul Plaza, <strong>King Crockery Store</strong> has supplied households, wedding banquets, catering halls, and hospitality businesses with fine tableware for over a decade.
        </p>

        <p>
          We believe that every meal shared with family and friends deserves a beautiful table setting. From durable daily melamine dinner plates to showstopping 3-tier pastry stands and mirror gold cutlery, our catalog represents uncompromising quality, food safety, and enduring elegance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-200 not-prose">
          <div className="p-5 bg-white border border-stone-200 text-center">
            <Award className="w-6 h-6 text-[#8C6D37] mx-auto mb-2" />
            <h3 className="font-serif font-bold text-stone-900 text-base mb-1">Authentic Quality</h3>
            <p className="text-xs text-stone-600">100% food grade, non-toxic, double glazed melamine and 18/10 stainless steel.</p>
          </div>

          <div className="p-5 bg-white border border-stone-200 text-center">
            <ShieldCheck className="w-6 h-6 text-[#8C6D37] mx-auto mb-2" />
            <h3 className="font-serif font-bold text-stone-900 text-base mb-1">Direct Wholesale Rates</h3>
            <p className="text-xs text-stone-600">Genuine retail pricing straight from Gul Plaza's trade hub.</p>
          </div>

          <div className="p-5 bg-white border border-stone-200 text-center">
            <Truck className="w-6 h-6 text-[#8C6D37] mx-auto mb-2" />
            <h3 className="font-serif font-bold text-stone-900 text-base mb-1">Safe Packing Guarantee</h3>
            <p className="text-xs text-stone-600">Multi-layer bubble wrap ensures your tableware arrives intact.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<InfoPageProps> = () => {
  const { settings } = useStore();
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6D37] block mb-1">
          Visit Us in Karachi or Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
          Contact King Crockery Store
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">
          We welcome trade inquiries, wedding order consults, and individual customer questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact details */}
        <div className="bg-white p-6 sm:p-8 border border-stone-200 space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-950 border-b border-stone-200 pb-3">
            Physical Store Location
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-stone-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#8C6D37] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 text-sm">Main Outlet Address:</strong>
                <p className="mt-1 leading-relaxed">
                  {settings?.contact.address || 'Shop No B27 & B28, Basement Floor, City Shopping Center, Marston Road, Behind Gul Plaza, Karachi, Pakistan'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#8C6D37] shrink-0" />
              <div>
                <strong className="block text-stone-900 text-sm">Phone Numbers:</strong>
                <p>{settings?.contact.phone1 || '+92-21-32710174'} · {settings?.contact.phone2 || '+92-21-32710492'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#8C6D37] shrink-0" />
              <div>
                <strong className="block text-stone-900 text-sm">Email Inquiry:</strong>
                <p>{settings?.contact.email || 'kingcrockery@hotmail.com'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#8C6D37] shrink-0" />
              <div>
                <strong className="block text-stone-900 text-sm">Store Hours:</strong>
                <p>Monday – Saturday: 11:30 AM – 9:00 PM (Closed Sundays)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message form */}
        <div className="bg-white p-6 sm:p-8 border border-stone-200">
          <h2 className="font-serif text-xl font-bold text-stone-950 border-b border-stone-200 pb-3 mb-4">
            Send an Inquiry
          </h2>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              Thank you! Your message has been sent to King Crockery Store manager. We will contact you shortly.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold uppercase text-stone-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Raza"
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-700 mb-1">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="0300 1234567"
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-700 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Inquire about dinner sets, bulk catering prices, or custom requests..."
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
              >
                Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const FaqsPage: React.FC = () => {
  const faqs = [
    {
      q: 'Where is King Crockery Store located?',
      a: 'Our main trade showroom is located at Shop B27 & B28, Basement Floor, City Shopping Center, Marston Road, Behind Gul Plaza, Karachi.',
    },
    {
      q: 'What is the 4% advance payment discount?',
      a: 'When you choose Advance Bank Transfer at checkout instead of COD, our system automatically reduces your item subtotal by 4%.',
    },
    {
      q: 'Are melamine dinner sets microwave safe?',
      a: 'Melamine is heat resistant up to 120°C for serving piping hot food, but should NOT be placed inside microwave ovens or direct fires.',
    },
    {
      q: 'How long do hot pots keep food warm?',
      a: 'King Crockery Dinner Hot Pots feature dual PU insulation and mirror stainless steel liners that maintain hot serving temperatures for up to 6 hours.',
    },
    {
      q: 'What if an item arrives damaged during courier transport?',
      a: 'We pack all crockery using heavy bubble wrap. In the rare event of transit damage, notify us on WhatsApp with an unboxing video within 24 hours for instant replacement.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6D37] block mb-1">
          Help Center
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-950">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white p-6 border border-stone-200">
            <h3 className="font-serif text-base font-bold text-stone-900 mb-2">
              {faq.q}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PolicyPage: React.FC<{ title: string; content: string[] }> = ({ title, content }) => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
    <h1 className="font-serif text-3xl font-bold text-stone-950 pb-4 border-b border-stone-200">
      {title}
    </h1>
    <div className="bg-white p-6 sm:p-8 border border-stone-200 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
      {content.map((p, idx) => (
        <p key={idx}>{p}</p>
      ))}
    </div>
  </div>
);
