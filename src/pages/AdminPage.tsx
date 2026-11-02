import React, { useState, useEffect } from 'react';
import {
  Lock,
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  DollarSign,
  Truck,
  AlertTriangle,
  LogOut,
  Save,
} from 'lucide-react';
import { Product, Order, Category, StoreSettings } from '../types/index.ts';
import { formatPKR } from '../utils/formatters.ts';

interface AdminPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [adminToken, setAdminToken] = useState<string>(() => localStorage.getItem('kcs_admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Login form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories' | 'settings'>('dashboard');

  // Dashboard Stats
  const [stats, setStats] = useState<any>(null);

  // Orders list & filter
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Selected Order modal/edit
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Products list
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');

  // Store Settings
  const [settingsForm, setSettingsForm] = useState<StoreSettings | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Check initial token
  useEffect(() => {
    if (adminToken) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('kcs_admin_token');
            setAdminToken('');
          }
        })
        .catch(() => setIsAuthenticated(false));
    }
  }, [adminToken]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated, activeTab]);

  const loadAdminData = async () => {
    const headers = { Authorization: `Bearer ${adminToken}` };
    try {
      if (activeTab === 'dashboard') {
        const res = await fetch('/api/stats', { headers });
        if (res.ok) setStats(await res.json());
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/orders', { headers });
        if (res.ok) setOrders(await res.json());
      } else if (activeTab === 'products') {
        const res = await fetch('/api/products');
        if (res.ok) setProducts(await res.json());
      } else if (activeTab === 'categories') {
        const res = await fetch('/api/categories');
        if (res.ok) setCategories(await res.json());
      } else if (activeTab === 'settings') {
        const res = await fetch('/api/settings');
        if (res.ok) setSettingsForm(await res.json());
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('kcs_admin_token', data.token);
        setAdminToken(data.token);
        setIsAuthenticated(true);
      } else {
        const errData = await res.json();
        setLoginError(errData.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kcs_admin_token');
    setAdminToken('');
    setIsAuthenticated(false);
  };

  // Order status update
  const handleUpdateOrderStatus = async (
    orderId: string,
    orderStatus: Order['orderStatus'],
    paymentStatus?: Order['paymentStatus'],
    trackingNumber?: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ orderStatus, paymentStatus, trackingNumber }),
      });
      if (res.ok) {
        loadAdminData();
        setEditingOrder(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Product Save/Update
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) return;
    try {
      const isEdit = !!editingProduct.id;
      const url = isEdit ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Store Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white border border-stone-200 p-8 shadow-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-950">
              Admin Portal Login
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              King Crockery Store Management Console
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 text-red-800 text-xs font-medium border border-red-200 mb-4">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full bg-[#FAF8F5] border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#FAF8F5] border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 cursor-pointer shadow-xs"
            >
              Authenticate &amp; Access Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-200 text-center text-[11px] text-stone-400">
            Default credentials: <strong className="text-stone-700">admin / kingcrockery2026</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6D37] block">
            Store Administration Console
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
            King Crockery Store
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 border border-stone-300 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            View Live Store
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto gap-2 sm:gap-6 mb-8">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-3 px-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'dashboard' ? 'border-b-2 border-stone-950 text-stone-950' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'orders' ? 'border-b-2 border-stone-950 text-stone-950' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Management</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'products' ? 'border-b-2 border-stone-950 text-stone-950' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'categories' ? 'border-b-2 border-stone-950 text-stone-950' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'settings' ? 'border-b-2 border-stone-950 text-stone-950' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 border border-stone-200">
              <span className="text-xs uppercase font-semibold text-stone-500 block mb-1">Total Sales Revenue</span>
              <span className="text-2xl font-bold text-stone-950 tabular-nums">{formatPKR(stats.totalRevenue)}</span>
            </div>

            <div className="bg-white p-5 border border-stone-200">
              <span className="text-xs uppercase font-semibold text-stone-500 block mb-1">Total Orders</span>
              <span className="text-2xl font-bold text-stone-950 tabular-nums">{stats.totalOrders}</span>
            </div>

            <div className="bg-white p-5 border border-stone-200">
              <span className="text-xs uppercase font-semibold text-stone-500 block mb-1">Pending Orders</span>
              <span className="text-2xl font-bold text-amber-700 tabular-nums">{stats.pendingOrders}</span>
            </div>

            <div className="bg-white p-5 border border-stone-200">
              <span className="text-xs uppercase font-semibold text-stone-500 block mb-1">Low Stock Warning</span>
              <span className="text-2xl font-bold text-red-700 tabular-nums">{stats.lowStockCount} Items</span>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 border border-stone-200">
            <h3 className="font-serif text-base font-bold text-stone-900 mb-4 border-b border-stone-200 pb-2">
              Recent Orders
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-stone-600 uppercase">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {stats.recentOrders.map((ord: Order) => (
                    <tr key={ord.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                      <td className="p-3">{ord.customer.fullName}</td>
                      <td className="p-3">{ord.customer.city}</td>
                      <td className="p-3 font-bold tabular-nums">{formatPKR(ord.finalTotal)}</td>
                      <td className="p-3 capitalize">{ord.paymentMethod.replace('_', ' ')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 font-semibold bg-amber-50 text-amber-800">
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">Manage Orders ({orders.length})</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order #, customer name, phone..."
                className="bg-[#FAF8F5] border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-stone-600 uppercase border-b border-stone-200">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer &amp; Phone</th>
                  <th className="p-3">City &amp; Address</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                    <td className="p-3">{new Date(ord.createdAt).toLocaleDateString('en-PK')}</td>
                    <td className="p-3">
                      <strong className="block text-stone-900">{ord.customer.fullName}</strong>
                      <span className="text-stone-500">{ord.customer.phone}</span>
                    </td>
                    <td className="p-3 max-w-xs truncate">
                      {ord.customer.city}, {ord.customer.deliveryAddress}
                    </td>
                    <td className="p-3 font-bold tabular-nums">{formatPKR(ord.finalTotal)}</td>
                    <td className="p-3">
                      <span className="block uppercase font-semibold text-[10px]">
                        {ord.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'COD'}
                      </span>
                      <span className="text-[10px] text-stone-500 capitalize">{ord.paymentStatus}</span>
                      {ord.paymentProofUrl && (
                        <a
                          href={ord.paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#8C6D37] underline block text-[10px]"
                        >
                          View Proof
                        </a>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleUpdateOrderStatus(ord.id, e.target.value as any)
                        }
                        className="bg-white border border-stone-300 text-xs p-1 font-semibold cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setEditingOrder(ord)}
                        className="text-[#8C6D37] hover:underline font-semibold cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Order Modal */}
          {editingOrder && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white max-w-lg w-full p-6 border border-stone-200 space-y-4 shadow-xl">
                <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-2">
                  Update Order {editingOrder.orderNumber}
                </h3>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Courier Tracking Number
                  </label>
                  <input
                    type="text"
                    defaultValue={editingOrder.trackingNumber || ''}
                    id="trackingInput"
                    placeholder="e.g. TCS-98217402"
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Payment Verification Status
                  </label>
                  <select
                    defaultValue={editingOrder.paymentStatus}
                    id="paymentStatusInput"
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2 text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="proof_submitted">Proof Submitted</option>
                    <option value="verified">Verified</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                  <button
                    onClick={() => setEditingOrder(null)}
                    className="px-4 py-2 border border-stone-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const trackInput = (document.getElementById('trackingInput') as HTMLInputElement)?.value;
                      const payInput = (document.getElementById('paymentStatusInput') as HTMLSelectElement)?.value;
                      handleUpdateOrderStatus(
                        editingOrder.id,
                        editingOrder.orderStatus,
                        payInput as any,
                        trackInput
                      );
                    }}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRODUCTS CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 border border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Products Catalogue ({products.length})
            </h3>
            <button
              onClick={() => {
                setEditingProduct({
                  title: '',
                  price: 5000,
                  stockQuantity: 10,
                  categoryId: 'cat-dinner-sets',
                  categoryName: 'Dinner Sets',
                  images: ['/src/assets/images/collection_dinner_sets_1793629992325.jpg'],
                  description: '',
                  variants: [],
                  specifications: {},
                  features: [],
                  isFeatured: true,
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-4 border border-stone-200 flex gap-3 bg-[#FAF8F5]">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover bg-stone-100 shrink-0 border border-stone-200"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 truncate">{p.title}</h4>
                    <span className="text-[10px] text-[#8C6D37] uppercase font-semibold block">{p.categoryName}</span>
                    <span className="text-xs font-bold text-stone-950 tabular-nums block mt-1">{formatPKR(p.price)}</span>
                    <span className="text-[10px] text-stone-500 block">Stock: {p.stockQuantity} units</span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-stone-200 text-xs">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setIsProductModalOpen(true);
                      }}
                      className="text-stone-700 hover:text-stone-950 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Modal */}
          {isProductModalOpen && editingProduct && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white max-w-xl w-full p-6 border border-stone-200 space-y-4 shadow-xl my-8">
                <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-2">
                  {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                </h3>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">Product Title *</label>
                    <input
                      type="text"
                      value={editingProduct.title || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      required
                      className="w-full bg-[#FAF8F5] border border-stone-300 p-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase text-stone-700 mb-1">Price (PKR) *</label>
                      <input
                        type="number"
                        value={editingProduct.price || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        required
                        className="w-full bg-[#FAF8F5] border border-stone-300 p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase text-stone-700 mb-1">Original Price (PKR)</label>
                      <input
                        type="number"
                        value={editingProduct.originalPrice || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                        className="w-full bg-[#FAF8F5] border border-stone-300 p-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase text-stone-700 mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        value={editingProduct.stockQuantity || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                        required
                        className="w-full bg-[#FAF8F5] border border-stone-300 p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase text-stone-700 mb-1">Category *</label>
                      <select
                        value={editingProduct.categoryId || 'cat-dinner-sets'}
                        onChange={(e) => {
                          const cat = categories.find((c) => c.id === e.target.value);
                          setEditingProduct({
                            ...editingProduct,
                            categoryId: e.target.value,
                            categoryName: cat?.name || 'Dinner Sets',
                          });
                        }}
                        className="w-full bg-[#FAF8F5] border border-stone-300 p-2"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">Description</label>
                    <textarea
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      rows={3}
                      className="w-full bg-[#FAF8F5] border border-stone-300 p-2"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editingProduct.images?.[0] || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                      className="w-full bg-[#FAF8F5] border border-stone-300 p-2"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-4 py-2 border border-stone-300 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white font-semibold cursor-pointer"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STORE SETTINGS */}
      {activeTab === 'settings' && settingsForm && (
        <div className="bg-white p-6 border border-stone-200 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">Store Settings &amp; Offers</h3>
            {settingsSaved && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            {/* Announcement Bar Settings */}
            <div className="p-4 bg-[#FAF8F5] border border-stone-200 space-y-3">
              <h4 className="font-bold text-stone-900 uppercase">Announcement Bar &amp; Advance Offer</h4>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settingsForm.announcementBar.enabled}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcementBar: { ...settingsForm.announcementBar, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-stone-900"
                />
                <span>Enable Announcement Bar</span>
              </label>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Announcement Text</label>
                <input
                  type="text"
                  value={settingsForm.announcementBar.text}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcementBar: { ...settingsForm.announcementBar, text: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-stone-300 p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Advance Payment Discount %</label>
                <input
                  type="number"
                  value={settingsForm.advancePaymentDiscountPercent}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      advancePaymentDiscountPercent: Number(e.target.value),
                    })
                  }
                  className="w-24 bg-white border border-stone-300 p-2"
                />
              </div>
            </div>

            {/* Bank Details */}
            <div className="p-4 bg-[#FAF8F5] border border-stone-200 space-y-3">
              <h4 className="font-bold text-stone-900 uppercase">Bank Transfer Account Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={settingsForm.bankDetails.bankName}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        bankDetails: { ...settingsForm.bankDetails, bankName: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-stone-300 p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Account Title</label>
                  <input
                    type="text"
                    value={settingsForm.bankDetails.accountTitle}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        bankDetails: { ...settingsForm.bankDetails, accountTitle: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-stone-300 p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={settingsForm.bankDetails.accountNumber}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        bankDetails: { ...settingsForm.bankDetails, accountNumber: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-stone-300 p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">IBAN</label>
                  <input
                    type="text"
                    value={settingsForm.bankDetails.iban}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        bankDetails: { ...settingsForm.bankDetails, iban: e.target.value },
                      })
                    }
                    className="w-full bg-white border border-stone-300 p-2 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Admin Settings</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
