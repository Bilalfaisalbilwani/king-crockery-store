import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Package,
  Building2,
  Upload,
  MessageCircle,
  Truck,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { Order } from '../types/index.ts';
import { useStore } from '../context/StoreContext.tsx';
import { formatPKR, generateWhatsAppLink } from '../utils/formatters.ts';

interface OrderConfirmationPageProps {
  orderNumber: string;
  onNavigate: (page: string, param?: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderNumber, onNavigate }) => {
  const { settings } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [proofUrlInput, setProofUrlInput] = useState('');
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-stone-900 border-t-transparent mx-auto mb-4"></div>
        <p className="text-sm font-medium text-stone-600">Retrieving order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Order Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">Could not locate order ID: {orderNumber}</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrlInput.trim()) return;
    setUploadingProof(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: 'proof_submitted',
          paymentProofUrl: proofUrlInput,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
        setProofSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingProof(false);
    }
  };

  const copyOrderNo = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  // WhatsApp receipt submission
  const whatsappNum = settings?.contact.whatsappNumber || '923002710174';
  const whatsappReceiptMsg = `Assalam-o-Alaikum! I have placed Order *${order.orderNumber}* for ${formatPKR(
    order.finalTotal
  )}. Attaching payment receipt transfer screenshot.`;
  const whatsappReceiptUrl = generateWhatsAppLink(whatsappNum, whatsappReceiptMsg);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 p-6 sm:p-8 text-center mb-8 shadow-xs">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6D37] block mb-1">
          Thank You For Your Order
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-950 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Your order has been safely logged in our database and dispatched team at Gul Plaza Karachi has been notified.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 bg-[#FAF8F5] border border-stone-300 px-4 py-2 text-xs">
          <span className="text-stone-500 font-medium">Order Number:</span>
          <strong className="text-stone-950 font-mono text-sm">{order.orderNumber}</strong>
          <button
            onClick={copyOrderNo}
            className="text-[#8C6D37] hover:underline p-1 cursor-pointer"
            title="Copy Order Number"
          >
            {copiedOrder ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bank Transfer Receipt Upload Card (if Bank Transfer method) */}
      {order.paymentMethod === 'bank_transfer' && (
        <div className="bg-[#FDF9F0] border border-[#E5D7BE] p-6 mb-8 space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="w-6 h-6 text-[#8C6D37] shrink-0 mt-1" />
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Advance Bank Transfer — Payment Verification
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Your 4% advance payment discount has been applied to this order. Please send your payment screenshot to process shipment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-white p-4 border border-[#E0D0B6]">
            <div>
              <span className="text-stone-500 block mb-0.5">Bank Name:</span>
              <strong className="text-stone-900 text-sm block">{settings?.bankDetails.bankName}</strong>
              <span className="text-stone-500 block mt-2 mb-0.5">Account Title:</span>
              <strong className="text-stone-900 text-sm block">{settings?.bankDetails.accountTitle}</strong>
            </div>
            <div>
              <span className="text-stone-500 block mb-0.5">IBAN:</span>
              <strong className="text-stone-900 font-mono text-xs block">{settings?.bankDetails.iban}</strong>
              <span className="text-stone-500 block mt-2 mb-0.5">Payable Amount:</span>
              <strong className="text-stone-950 font-bold text-base block">{formatPKR(order.finalTotal)}</strong>
            </div>
          </div>

          {proofSubmitted || order.paymentStatus === 'proof_submitted' || order.paymentStatus === 'verified' ? (
            <div className="p-3 bg-emerald-100 text-emerald-900 text-xs font-semibold border border-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Payment proof recorded! Our accounts manager will verify your transaction shortly.</span>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-stone-900 block">
                Submit Payment Proof:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={whatsappReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Screenshot via WhatsApp</span>
                </a>

                <form onSubmit={handleUploadProof} className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={proofUrlInput}
                    onChange={(e) => setProofUrlInput(e.target.value)}
                    placeholder="Paste receipt image URL or transaction Ref #"
                    className="flex-1 bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={uploadingProof || !proofUrlInput.trim()}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 cursor-pointer disabled:opacity-50"
                  >
                    {uploadingProof ? 'Saving...' : 'Submit Ref'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Summary Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Customer & Shipping Box */}
        <div className="bg-white p-6 border border-stone-200 space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Shipping Information
          </h3>
          <div className="text-xs space-y-1.5 text-stone-700">
            <p><strong>Name:</strong> {order.customer.fullName}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
            <p><strong>Email:</strong> {order.customer.email}</p>
            <p><strong>Delivery Address:</strong> {order.customer.deliveryAddress}, {order.customer.city}, {order.customer.province}</p>
            {order.customer.orderNotes && <p><strong>Order Notes:</strong> {order.customer.orderNotes}</p>}
          </div>
        </div>

        {/* Payment & Status Box */}
        <div className="bg-white p-6 border border-stone-200 space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Payment &amp; Status
          </h3>
          <div className="text-xs space-y-2 text-stone-700">
            <p className="flex justify-between">
              <span>Payment Method:</span>
              <strong className="uppercase font-semibold text-stone-900">
                {order.paymentMethod === 'bank_transfer' ? 'Advance Bank Transfer' : 'Cash on Delivery'}
              </strong>
            </p>
            <p className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-semibold text-stone-900 capitalize px-2 py-0.5 bg-stone-100">
                {order.paymentStatus}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Order Status:</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5">
                {order.orderStatus}
              </span>
            </p>
            {order.trackingNumber && (
              <p className="flex justify-between border-t border-stone-100 pt-2">
                <span>Courier Tracking:</span>
                <strong className="font-mono text-stone-950">{order.trackingNumber}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Itemized Order Table */}
      <div className="bg-white border border-stone-200 p-6 mb-8">
        <h3 className="font-serif text-base font-bold text-stone-900 mb-4 border-b border-stone-200 pb-2">
          Purchased Crockery Items
        </h3>

        <div className="divide-y divide-stone-200">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.productTitle}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-cover bg-stone-100 shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-stone-900">{item.productTitle}</h4>
                  {item.variantName && <span className="text-stone-500 block">{item.variantName}</span>}
                  <span className="text-stone-500">Qty: {item.quantity} x {formatPKR(item.price)}</span>
                </div>
              </div>
              <span className="font-bold text-stone-950 tabular-nums">
                {formatPKR(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-stone-200 space-y-1.5 text-xs text-right">
          <p className="text-stone-600">Subtotal: <strong className="text-stone-900 tabular-nums">{formatPKR(order.subtotal)}</strong></p>
          <p className="text-stone-600">Shipping: <strong className="text-stone-900">{order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}</strong></p>
          {order.discountAmount > 0 && (
            <p className="text-[#8C6D37]">4% Advance Discount: <strong className="tabular-nums">- {formatPKR(order.discountAmount)}</strong></p>
          )}
          <p className="text-base font-bold text-stone-950 pt-2 border-t border-stone-100">
            Total Payable: <span className="tabular-nums">{formatPKR(order.finalTotal)}</span>
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-2.5 border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider hover:bg-stone-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('account', order.orderNumber)}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-stone-200 text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-stone-300 cursor-pointer"
          >
            Track Order
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
