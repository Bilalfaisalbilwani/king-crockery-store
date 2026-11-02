import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Truck,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useStore } from '../context/StoreContext.tsx';
import { CustomerDetails, Order } from '../types/index.ts';
import { formatPKR } from '../utils/formatters.ts';

interface CheckoutPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, subtotal, shippingFee, clearCart } = useCart();
  const { settings, refreshProducts } = useStore();

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    province: 'Sindh',
    city: 'Karachi',
    deliveryAddress: '',
    postalCode: '',
    orderNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">No Items to Checkout</h2>
        <p className="text-xs text-stone-500 mb-6">Please add crockery items to your shopping bag before checking out.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Calculate 4% discount for bank transfer
  const advanceDiscountPct = settings?.advancePaymentDiscountPercent || 4;
  const advanceDiscountAmount =
    paymentMethod === 'bank_transfer' ? Math.round((subtotal * advanceDiscountPct) / 100) : 0;

  const finalTotal = subtotal + shippingFee - advanceDiscountAmount;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const copyIban = () => {
    const iban = settings?.bankDetails.iban || 'PK45MEZN0001010102948291';
    navigator.clipboard.writeText(iban);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Field validations
    if (!customer.fullName.trim()) return setErrorMessage('Please enter your full name.');
    if (!customer.phone.trim() || customer.phone.length < 10)
      return setErrorMessage('Please enter a valid Pakistani contact phone number.');
    if (!customer.email.trim() || !customer.email.includes('@'))
      return setErrorMessage('Please enter a valid email address.');
    if (!customer.city.trim()) return setErrorMessage('Please enter your city.');
    if (!customer.deliveryAddress.trim() || customer.deliveryAddress.length < 10)
      return setErrorMessage('Please enter a complete delivery address.');

    setSubmitting(true);

    try {
      const orderPayload = {
        customer,
        items: items.map((i) => ({
          productId: i.productId,
          productTitle: i.productTitle,
          variantId: i.variantId,
          variantName: i.variantName,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        subtotal,
        shippingFee,
        discountAmount: advanceDiscountAmount,
        finalTotal,
        paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const orderData: Order = await res.json();
        clearCart();
        await refreshProducts();
        onNavigate('order-confirmation', orderData.orderNumber);
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Failed to place order. Please check inventory.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error while placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => onNavigate('cart')}
          className="text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bag</span>
        </button>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-950">
          Customer Checkout
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Complete your contact details and select payment method to finalize your order.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Customer Info & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white p-6 border border-stone-200 space-y-4">
              <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-3 flex items-center justify-between">
                <span>1. Contact Details</span>
                <span className="text-xs text-stone-400 font-sans font-normal">* All fields required</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={customer.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Tariq Mehmood"
                    required
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    placeholder="0300 1234567"
                    required
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white p-6 border border-stone-200 space-y-4">
              <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-3">
                2. Shipping &amp; Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Province *
                  </label>
                  <select
                    name="province"
                    value={customer.province}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900 cursor-pointer"
                  >
                    <option value="Sindh">Sindh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad Capital">Islamabad Capital Territory</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                    <option value="Gilgit Baltistan">Gilgit Baltistan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customer.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Karachi, Lahore, Islamabad"
                    required
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Complete Street Address *
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={customer.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="House/Apartment #, Street, Block, Area Landmark"
                    required
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={customer.postalCode}
                    onChange={handleInputChange}
                    placeholder="75600"
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Order Notes / Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="orderNotes"
                    value={customer.orderNotes}
                    onChange={handleInputChange}
                    placeholder="e.g. Call before delivery"
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 border border-stone-200 space-y-4">
              <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-3">
                3. Payment Selection
              </h2>

              <div className="space-y-3">
                {/* Payment Option 1: COD */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-stone-900 bg-[#FAF8F5]'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-stone-900 accent-stone-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-stone-900">Cash on Delivery (COD)</span>
                      <Truck className="w-4 h-4 text-stone-600" />
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Pay in cash directly to the courier rider upon inspecting your package at your doorstep anywhere in Pakistan.
                    </p>
                  </div>
                </label>

                {/* Payment Option 2: Bank Transfer (4% Off) */}
                <label
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 border transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-stone-900 bg-[#FDF9F0]'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1 text-stone-900 accent-stone-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <span>Advance Bank Transfer</span>
                        <span className="text-[10px] bg-[#8C6D37] text-white font-semibold px-2 py-0.5 uppercase tracking-wider">
                          Save 4% Instantly
                        </span>
                      </span>
                      <Building2 className="w-4 h-4 text-[#8C6D37]" />
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      Transfer directly via Meezan Bank mobile app / IBFT and upload your payment receipt after placing the order.
                    </p>

                    {paymentMethod === 'bank_transfer' && (
                      <div className="mt-4 p-4 bg-white border border-[#E5D7BE] text-xs space-y-2">
                        <div className="flex items-center justify-between font-semibold text-stone-900 border-b border-stone-200 pb-2">
                          <span>Bank Account Details</span>
                          <button
                            type="button"
                            onClick={copyIban}
                            className="text-[#8C6D37] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            {copiedAccount ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedAccount ? 'Copied IBAN!' : 'Copy IBAN'}</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-stone-700">
                          <span>Bank Name:</span>
                          <strong className="text-stone-900">{settings?.bankDetails.bankName}</strong>
                          <span>Account Title:</span>
                          <strong className="text-stone-900">{settings?.bankDetails.accountTitle}</strong>
                          <span>Account Number:</span>
                          <strong className="text-stone-900 font-mono">{settings?.bankDetails.accountNumber}</strong>
                          <span>IBAN:</span>
                          <strong className="text-stone-900 font-mono text-[11px] truncate">{settings?.bankDetails.iban}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 border border-stone-200 sticky top-24 space-y-6 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-stone-950 border-b border-stone-200 pb-3">
                Order Items ({items.length})
              </h2>

              <div className="max-h-60 overflow-y-auto divide-y divide-stone-200 pr-1">
                {items.map((i) => (
                  <div key={i.id} className="py-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={i.image}
                      alt={i.productTitle}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover bg-stone-100 border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">
                        {i.productTitle}
                      </h4>
                      {i.variantName && (
                        <p className="text-[11px] text-stone-500 truncate">{i.variantName}</p>
                      )}
                      <span className="text-[11px] text-stone-500">
                        {i.quantity} x {formatPKR(i.price)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-stone-950 tabular-nums">
                      {formatPKR(i.price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-stone-200 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">{formatPKR(subtotal)}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-stone-900">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-bold uppercase">Free</span> : formatPKR(shippingFee)}
                  </span>
                </div>

                {advanceDiscountAmount > 0 && (
                  <div className="flex justify-between text-[#8C6D37] font-semibold">
                    <span>4% Bank Advance Discount</span>
                    <span className="tabular-nums">- {formatPKR(advanceDiscountAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-stone-950">Final Payable</span>
                  <span className="text-2xl font-bold text-stone-950 tabular-nums">
                    {formatPKR(finalTotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <span>Processing Your Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Place Order ({formatPKR(finalTotal)})</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-stone-500 text-center space-y-1 pt-2">
                <p>By placing this order, you confirm your shipping details in Pakistan.</p>
                <div className="flex items-center justify-center gap-1 text-[#8C6D37] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Secure Server Processing &amp; Database Logging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
