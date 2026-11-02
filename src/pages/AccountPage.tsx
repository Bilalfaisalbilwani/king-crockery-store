import React, { useState, useEffect } from 'react';
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle, Phone, Mail } from 'lucide-react';
import { Order } from '../types/index.ts';
import { formatPKR } from '../utils/formatters.ts';

interface AccountPageProps {
  initialSearch?: string;
  onNavigate: (page: string, param?: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ initialSearch, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialSearch) {
      handleTrackOrder(initialSearch);
    }
  }, [initialSearch]);

  const handleTrackOrder = async (queryToUse?: string) => {
    const q = queryToUse || searchQuery;
    if (!q.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/${q.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setOrder(null);
        setErrorMsg(`No order found matching "${q}". Please check your order ID or contact details.`);
      }
    } catch (err) {
      setErrorMsg('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  const getStepIndex = (status: string) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6D37] block mb-1">
          Customer Portal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">
          Enter your King Crockery order number (e.g. KCS-10821) or phone number to check live shipment status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 border border-stone-200 shadow-xs mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrackOrder();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. KCS-10821 or 03001234567"
              className="w-full bg-[#FAF8F5] border border-stone-300 pl-10 pr-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
          >
            {loading ? 'Searching...' : 'Track Status'}
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2 mb-8">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-8 animate-in fade-in duration-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
            <div>
              <span className="text-[11px] font-semibold text-[#8C6D37] uppercase tracking-wider block">
                Order Tracking
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 font-mono">
                {order.orderNumber}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Placed on: {new Date(order.createdAt).toLocaleDateString('en-PK')}</span>
              <span className="text-sm font-bold text-stone-900 tabular-nums block">{formatPKR(order.finalTotal)}</span>
            </div>
          </div>

          {/* Stepper timeline */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
              Live Fulfillment Progress
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {statusSteps.map((step, idx) => {
                const currentIdx = getStepIndex(order.orderStatus);
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors mb-2 ${
                        isCompleted
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      } ${isCurrent ? 'ring-2 ring-[#C8A261] ring-offset-2' : ''}`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-medium leading-tight ${
                        isCompleted ? 'text-stone-900 font-bold' : 'text-stone-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier notes */}
          {order.trackingNumber && (
            <div className="p-4 bg-[#F4EFEB] border border-stone-200 text-xs space-y-1">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#8C6D37]" />
                Courier Tracking ID: <span className="font-mono text-stone-950">{order.trackingNumber}</span>
              </span>
              {order.courierNotes && <p className="text-stone-600">{order.courierNotes}</p>}
            </div>
          )}

          {/* Items overview */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Order Items ({order.items.length})
            </h3>
            <div className="divide-y divide-stone-200 border border-stone-200">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productTitle}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover bg-stone-100"
                    />
                    <div>
                      <h4 className="font-semibold text-stone-900">{item.productTitle}</h4>
                      {item.variantName && <span className="text-stone-500 block">{item.variantName}</span>}
                    </div>
                  </div>
                  <span className="font-bold tabular-nums text-stone-900">{formatPKR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('order-confirmation', order.orderNumber)}
              className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
            >
              View Full Receipt &amp; Bank Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
