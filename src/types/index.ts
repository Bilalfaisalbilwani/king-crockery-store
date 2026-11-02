export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice: number | null;
  inStock: boolean;
  stockQuantity: number;
  images: string[];
  variants: ProductVariant[];
  specifications: Record<string, string>;
  features: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  id: string; // unique item id (productId + variantId)
  productId: string;
  productTitle: string;
  productSlug: string;
  variantId?: string;
  variantName?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  maxStock: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  deliveryAddress: string;
  postalCode?: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: Array<{
    productId: string;
    productTitle: string;
    variantId?: string;
    variantName?: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  discountCode?: string;
  finalTotal: number;
  paymentMethod: 'cod' | 'bank_transfer';
  paymentStatus: 'pending' | 'proof_submitted' | 'verified' | 'paid';
  paymentProofUrl?: string;
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  courierNotes?: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  announcementBar: {
    enabled: boolean;
    text: string;
    link: string;
  };
  hero: {
    headline: string;
    supportingText: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    imageUrl: string;
  };
  advancePaymentDiscountPercent: number;
  shippingCharges: number;
  freeShippingThreshold: number;
  contact: {
    phone1: string;
    phone2: string;
    email: string;
    address: string;
    whatsappNumber: string;
    city: string;
  };
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    instructions: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
  };
}
