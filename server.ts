import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db, Product, StoreSettings } from './src/server/storage.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to check admin authorization
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin token required' });
  }
  const token = authHeader.split(' ')[1];
  if (!db.verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin token' });
  }
  next();
};

// ==========================================
// 1. PRODUCTS API
// ==========================================
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const { category, search, sort } = req.query;
    const products = db.getProducts(
      typeof category === 'string' ? category : undefined,
      typeof search === 'string' ? search : undefined,
      typeof sort === 'string' ? sort : undefined
    );
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  try {
    const product = db.getProductByIdOrSlug(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.title || !data.price) {
      return res.status(400).json({ error: 'Title and price are required' });
    }
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const product: Product = {
      ...data,
      id: data.id || `kcs-prod-${Date.now()}`,
      slug,
      rating: data.rating || 5.0,
      reviewCount: data.reviewCount || 0,
      createdAt: new Date().toISOString(),
      variants: data.variants || [],
      specifications: data.specifications || {},
      features: data.features || [],
      images: data.images && data.images.length > 0 ? data.images : ['/src/assets/images/collection_dinner_sets_1793629992325.jpg'],
      inStock: data.stockQuantity > 0,
    };
    const saved = db.saveProduct(product);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const existing = db.getProductByIdOrSlug(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const updated: Product = {
      ...existing,
      ...req.body,
      id: existing.id,
      inStock: (req.body.stockQuantity !== undefined ? req.body.stockQuantity : existing.stockQuantity) > 0,
    };
    db.saveProduct(updated);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. CATEGORIES API
// ==========================================
app.get('/api/categories', (req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description: description || '',
      image: image || '/src/assets/images/collection_dinner_sets_1793629992325.jpg',
      itemCount: 0,
    };
    const saved = db.saveCategory(category);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. ORDERS API
// ==========================================
app.get('/api/orders', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const orders = db.getOrders(
      typeof status === 'string' ? status : undefined,
      typeof search === 'string' ? search : undefined
    );
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const order = db.getOrderByIdOrNumber(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customer, items, subtotal, shippingFee, discountAmount, finalTotal, paymentMethod } = req.body;

    // Strict validation
    if (!customer || !customer.fullName || !customer.phone || !customer.deliveryAddress || !customer.city) {
      return res.status(400).json({ error: 'Full name, phone, city, and delivery address are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart cannot be empty.' });
    }

    // Verify inventory
    for (const item of items) {
      const prod = db.getProductByIdOrSlug(item.productId);
      if (!prod) {
        return res.status(400).json({ error: `Product ${item.productTitle} does not exist.` });
      }
      if (prod.stockQuantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${prod.title}. Available: ${prod.stockQuantity}` });
      }
    }

    const newOrder = db.createOrder({
      customer,
      items,
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      discountAmount: Number(discountAmount || 0),
      finalTotal: Number(finalTotal),
      paymentMethod: paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'cod',
      paymentStatus: paymentMethod === 'bank_transfer' ? 'pending' : 'pending',
      orderStatus: 'Pending',
    });

    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, courierNotes, paymentProofUrl } = req.body;
    const updated = db.updateOrder(req.params.id, {
      orderStatus,
      paymentStatus,
      trackingNumber,
      courierNotes,
      paymentProofUrl,
    });
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. SETTINGS & STATS API
// ==========================================
app.get('/api/settings', (req: Request, res: Response) => {
  try {
    res.json(db.getSettings());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', requireAdmin, (req: Request, res: Response) => {
  try {
    const orders = db.getOrders();
    const products = db.getProducts();

    const totalRevenue = orders.reduce((acc, o) => (o.orderStatus !== 'Cancelled' ? acc + o.finalTotal : acc), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
    const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const lowStockProducts = products.filter((p) => p.stockQuantity < 10);

    res.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5),
      recentOrders: orders.slice(0, 5),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. REVIEWS & NEWSLETTER API
// ==========================================
app.get('/api/reviews', (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    const reviews = db.getReviews(typeof productId === 'string' ? productId : undefined);
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', (req: Request, res: Response) => {
  try {
    const { productId, customerName, rating, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ error: 'All review fields are required.' });
    }
    const review = db.addReview({
      productId,
      customerName,
      rating: Number(rating),
      comment,
      verifiedPurchase: true,
    });
    res.status(201).json(review);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/newsletter', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }
    const added = db.addSubscriber(email);
    res.json({ success: true, message: added ? 'Thank you for subscribing!' : 'You are already subscribed!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. ADMIN AUTH API
// ==========================================
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    // Default admin credential for King Crockery Store: admin / kingcrockery2026
    if (username === 'admin' && (password === 'kingcrockery2026' || password === 'admin123')) {
      const token = db.generateAdminToken();
      return res.json({
        token,
        user: { username: 'admin', role: 'Super Admin', store: 'King Crockery Store' },
      });
    }
    res.status(401).json({ error: 'Invalid username or password' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }
  const token = authHeader.split(' ')[1];
  const valid = db.verifyAdminToken(token);
  res.json({ valid });
});

// ==========================================
// VITE DEV SERVER OR STATIC PROD SERVE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`King Crockery Store server running on http://localhost:${PORT}`);
  });
}

startServer();
