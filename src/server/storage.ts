import fs from 'fs';
import path from 'path';

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

export interface OrderItem {
  productId: string;
  productTitle: string;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderCustomer {
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
  customer: OrderCustomer;
  items: OrderItem[];
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

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
}

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  newsletter: Array<{ email: string; subscribedAt: string }>;
  settings: StoreSettings;
  customers: CustomerUser[];
  adminTokens: string[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-dinner-sets',
    name: 'Dinner Sets',
    slug: 'dinner-sets',
    description: 'Complete double-glazed and melamine luxury dinnerware for everyday dining and hosting.',
    image: '/src/assets/images/collection_dinner_sets_1793629992325.jpg',
    itemCount: 3,
  },
  {
    id: 'cat-hot-pots',
    name: 'Hot Pots',
    slug: 'hot-pots',
    description: 'Thermal insulated polyurethane and stainless steel food warmers and gift sets.',
    image: '/src/assets/images/collection_hot_pots_1793629993114.jpg',
    itemCount: 2,
  },
  {
    id: 'cat-cake-stands',
    name: 'Cake Stands',
    slug: 'cake-stands',
    description: 'Tiered pastry display towers and melamine cake servers for exquisite dessert presentation.',
    image: '/src/assets/images/collection_cake_stands_1793629994740.jpg',
    itemCount: 2,
  },
  {
    id: 'cat-serving-platters',
    name: 'Serving & Platters',
    slug: 'serving-platters',
    description: 'Scalloped party trays, high-rim handled serving platters, and buffet essentials.',
    image: '/src/assets/images/product_serving_tray_1793630013545.jpg',
    itemCount: 2,
  },
  {
    id: 'cat-cutlery',
    name: 'Cutlery',
    slug: 'cutlery',
    description: 'Precision forged 18/10 stainless steel mirror gold and silver cutlery sets with carousel stands.',
    image: '/src/assets/images/collection_cutlery_gold_1793629993838.jpg',
    itemCount: 1,
  },
  {
    id: 'cat-drinkware',
    name: 'Drinkware',
    slug: 'drinkware',
    description: 'Shatterproof optical grade acrylic pitchers, diamond-cut water sets, and tumblers.',
    image: '/src/assets/images/product_drinkware_set_1793630012796.jpg',
    itemCount: 1,
  },
  {
    id: 'cat-melamine',
    name: 'Melamine Collection',
    slug: 'melamine-collection',
    description: 'Double glazed scratch-resistant melamine collections built for endurance and elegance.',
    image: '/src/assets/images/product_floral_dinnerset_1793630015093.jpg',
    itemCount: 4,
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kcs-prod-001',
    title: 'Orchid White Melamine Double Glazed Dinner Set',
    slug: 'orchid-white-melamine-double-glazed-dinner-set',
    description: 'The signature Orchid White Double Glazed Melamine Dinner Set brings effortless luxury to any dining gathering. Molded with 100% pure food-grade melamine and reinforced with high-density double glazing, each plate boasts a luminous porcelain-like sheen while remaining virtually shatter-resistant and lightweight.',
    categoryId: 'cat-dinner-sets',
    categoryName: 'Dinner Sets',
    price: 6800,
    originalPrice: 7500,
    inStock: true,
    stockQuantity: 18,
    images: [
      '/src/assets/images/collection_dinner_sets_1793629992325.jpg',
      '/src/assets/images/product_floral_dinnerset_1793630015093.jpg',
    ],
    variants: [
      {
        id: 'var-orchid-22',
        name: '22 Pieces (4 Persons)',
        price: 6800,
        originalPrice: 7500,
        inStock: true,
        stockQuantity: 8,
        sku: 'KCS-ORC-22P',
      },
      {
        id: 'var-orchid-30',
        name: '30 Pieces (6 Persons)',
        price: 9200,
        originalPrice: 10200,
        inStock: true,
        stockQuantity: 6,
        sku: 'KCS-ORC-30P',
      },
      {
        id: 'var-orchid-43',
        name: '43 Pieces (8 Persons)',
        price: 13500,
        originalPrice: 15000,
        inStock: true,
        stockQuantity: 4,
        sku: 'KCS-ORC-43P',
      },
    ],
    specifications: {
      'Material': '100% Pure Food Grade Melamine',
      'Finish': 'High Gloss Double Glazed Sheen',
      'Heat Resistance': 'Up to 120°C (Non-Microwave)',
      'Cleaning': 'Dishwasher Safe (Top Rack Recommended)',
      'Origin': 'City Shopping Center, Karachi Original Stock',
    },
    features: [
      'Chip & shatter resistant pure melamine construction',
      'Porcelain aesthetic with lightweight daily practicality',
      'Stain resistant non-porous glazed surface',
      'Complete table service with dinner, deep soup & quarter plates',
    ],
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isBestSeller: true,
    createdAt: '2026-02-15T10:00:00.000Z',
  },
  {
    id: 'kcs-prod-002',
    title: 'Golden Floral Leaf Printed Melamine Double Glaze Dinner Set',
    slug: 'golden-floral-leaf-printed-melamine-double-glaze-dinner-set',
    description: 'Adorned with opulent golden foliage along the contoured rims, this Golden Floral Leaf Printed Dinner Set transforms wedding feasts, Eid banquets, and family dinners into royal occasions. Baked under high thermal compression for everlasting design vibrancy.',
    categoryId: 'cat-dinner-sets',
    categoryName: 'Dinner Sets',
    price: 7200,
    originalPrice: 8000,
    inStock: true,
    stockQuantity: 12,
    images: [
      '/src/assets/images/product_floral_dinnerset_1793630015093.jpg',
      '/src/assets/images/collection_dinner_sets_1793629992325.jpg',
    ],
    variants: [
      {
        id: 'var-gfl-22',
        name: '22 Pieces (4 Persons)',
        price: 7200,
        originalPrice: 8000,
        inStock: true,
        stockQuantity: 5,
        sku: 'KCS-GFL-22P',
      },
      {
        id: 'var-gfl-30',
        name: '30 Pieces (6 Persons)',
        price: 9800,
        originalPrice: 10900,
        inStock: true,
        stockQuantity: 4,
        sku: 'KCS-GFL-30P',
      },
      {
        id: 'var-gfl-43',
        name: '43 Pieces (8 Persons)',
        price: 14200,
        originalPrice: 15800,
        inStock: true,
        stockQuantity: 3,
        sku: 'KCS-GFL-43P',
      },
    ],
    specifications: {
      'Print Technology': 'In-mold Thermal Transfer Floral Gilding',
      'Material': 'Double-Layered Glazed Melamine',
      'Odor Retention': 'Zero Non-Toxic Food Safe',
      'Weight': 'Approx. 4.8kg - 8.2kg by piece count',
    },
    features: [
      'Gilded floral artwork sealed under heavy protective glaze',
      'Smooth curved rim prevents liquid spills',
      'Stackable footprint for compact kitchen cabinet storage',
      'Resistant to curry and oil staining',
    ],
    rating: 4.8,
    reviewCount: 29,
    isFeatured: true,
    isBestSeller: true,
    createdAt: '2026-02-18T12:00:00.000Z',
  },
  {
    id: 'kcs-prod-003',
    title: 'Geo Pak Single Glazed Melamine Dinner Set (74 Pcs for 6 Persons)',
    slug: 'geo-pak-single-glazed-melamine-dinner-set-74-pcs',
    description: 'An all-inclusive 74-piece grand dining collection designed specifically for comprehensive Pakistani family dining. Provides every conceivable serving essential from large rice platters and covered curry serving bowls to individual soup bowls, spoons, and dessert plates.',
    categoryId: 'cat-dinner-sets',
    categoryName: 'Dinner Sets',
    price: 8500,
    originalPrice: 9800,
    inStock: true,
    stockQuantity: 8,
    images: [
      '/src/assets/images/collection_dinner_sets_1793629992325.jpg',
      '/src/assets/images/product_floral_dinnerset_1793630015093.jpg',
    ],
    variants: [
      {
        id: 'var-geopak-74',
        name: '74 Pieces Grand Feast Set',
        price: 8500,
        originalPrice: 9800,
        inStock: true,
        stockQuantity: 8,
        sku: 'KCS-GPK-74P',
      },
    ],
    specifications: {
      'Piece Count': '74 Comprehensive Pieces',
      'Serving Capacity': '6 to 8 Persons',
      'Includes': 'Rice Platters, Curry Bowls with Lids, Soup Bowls, Spoons, Dessert Bowls',
      'Certification': 'BPA Free Food Grade Safe',
    },
    features: [
      'Monumental 74-piece variety eliminates need for separate serving dishes',
      'Durable single glaze with scratch-resistant surface',
      'Includes matching melamine serving ladles and rice spoons',
      'Superb gift choice for weddings and new homes',
    ],
    rating: 4.7,
    reviewCount: 17,
    isFeatured: true,
    isBestSeller: false,
    createdAt: '2026-02-20T14:30:00.000Z',
  },
  {
    id: 'kcs-prod-004',
    title: 'Dinner Hot Pot (4 Liter - 1 Piece)',
    slug: 'dinner-hot-pot-4-liter',
    description: 'The genuine King Crockery Dinner Hot Pot maintains piping hot curries, biryanis, and rotis for up to 6 hours. Engineered with dual-wall polyurethane (PU) foam thermal insulation and an internal mirror-polished stainless steel basin that never alters food flavor or aroma.',
    categoryId: 'cat-hot-pots',
    categoryName: 'Hot Pots',
    price: 3250,
    originalPrice: 3800,
    inStock: true,
    stockQuantity: 24,
    images: [
      '/src/assets/images/collection_hot_pots_1793629993114.jpg',
      '/src/assets/images/product_hotpot_giftset_1793630015616.jpg',
    ],
    variants: [
      {
        id: 'var-hp4-maroon',
        name: 'Maroon with Gold Accent',
        price: 3250,
        originalPrice: 3800,
        inStock: true,
        stockQuantity: 8,
        sku: 'KCS-HP4-MRN',
      },
      {
        id: 'var-hp4-black',
        name: 'Black with Gold Accent',
        price: 3250,
        originalPrice: 3800,
        inStock: true,
        stockQuantity: 6,
        sku: 'KCS-HP4-BLK',
      },
      {
        id: 'var-hp4-brown',
        name: 'Light Brown with Gold Accent',
        price: 3250,
        originalPrice: 3800,
        inStock: true,
        stockQuantity: 5,
        sku: 'KCS-HP4-LBN',
      },
      {
        id: 'var-hp4-grey',
        name: 'Grey with Gold Accent',
        price: 3250,
        originalPrice: 3800,
        inStock: true,
        stockQuantity: 5,
        sku: 'KCS-HP4-GRY',
      },
    ],
    specifications: {
      'Capacity': '4.0 Liters',
      'Inner Liner': 'Mirror-Polished Food-Grade Stainless Steel',
      'Insulation': 'High-Density Polyurethane (PU) Foam',
      'Lid': 'Twist-Lock Airtight Seal with Top Handle',
      'Thermal Performance': 'Hot up to 6 hrs / Cold up to 8 hrs',
    },
    features: [
      'Maintains ideal serving temperatures without reheating on stove',
      'Airtight silicone-assisted twist locking lid seals aroma',
      'Solid side carry handles stay completely cool to touch',
      'Authentic King Crockery Gul Plaza stock',
    ],
    rating: 4.9,
    reviewCount: 52,
    isFeatured: true,
    isBestSeller: true,
    createdAt: '2026-02-10T09:15:00.000Z',
  },
  {
    id: 'kcs-prod-005',
    title: 'Signature Gold Color 4 Pcs Gift Set (3 Hot Pots + 1 Water Cooler)',
    slug: 'signature-gold-color-4-pcs-gift-set',
    description: 'The epitome of traditional Pakistani celebratory dining: 3 graduated thermal hot pots (1L, 2L, 3.5L) alongside a matching 8-liter insulated water cooler with dripless tap. Styled in royal brushed gold with embossed imperial filigree.',
    categoryId: 'cat-hot-pots',
    categoryName: 'Hot Pots',
    price: 8850,
    originalPrice: 10720,
    inStock: true,
    stockQuantity: 15,
    images: [
      '/src/assets/images/product_hotpot_giftset_1793630015616.jpg',
      '/src/assets/images/collection_hot_pots_1793629993114.jpg',
    ],
    variants: [
      {
        id: 'var-sig-gold-4',
        name: 'Royal Gold 4-Piece Complete Set',
        price: 8850,
        originalPrice: 10720,
        inStock: true,
        stockQuantity: 15,
        sku: 'KCS-GFT-GLD4',
      },
    ],
    specifications: {
      'Hot Pot Volumes': 'Small (1000ml), Medium (2000ml), Large (3500ml)',
      'Cooler Volume': '8.0 Liters with push-button tap',
      'Exterior Finish': 'Rich Metallic Gold with Vintage Filigree Band',
      'Interior': 'Seamless Food-Grade Stainless Steel',
    },
    features: [
      'Complete banquet and wedding dowry gift presentation',
      'Push-button smooth dispensing tap on water cooler',
      'Thermal retention preserves chilled sherbets or piping curries',
      'Packaged in heavy reinforced gift presentation box',
    ],
    rating: 5.0,
    reviewCount: 44,
    isFeatured: true,
    isBestSeller: true,
    createdAt: '2026-02-05T08:00:00.000Z',
  },
  {
    id: 'kcs-prod-006',
    title: 'Delizia Melamine 8-Piece Printed Cake Serving Set',
    slug: 'delizia-melamine-8-piece-printed-cake-serving-set',
    description: 'Elevate teatime hospitality with the Delizia 8-piece cake presentation set. Includes a majestic 11.5-inch round platter adorned with vintage floral illustrations, 6 companion pastry plates, and a matching scalloped cake spatula.',
    categoryId: 'cat-cake-stands',
    categoryName: 'Cake Stands',
    price: 2495,
    originalPrice: 3500,
    inStock: true,
    stockQuantity: 19,
    images: [
      '/src/assets/images/product_cake_serving_set_1793630015248.jpg',
      '/src/assets/images/collection_cake_stands_1793629994740.jpg',
    ],
    variants: [
      {
        id: 'var-delizia-a',
        name: 'Design A - Floral Romance',
        price: 2495,
        originalPrice: 3500,
        inStock: true,
        stockQuantity: 8,
        sku: 'KCS-DLZ-A',
      },
      {
        id: 'var-delizia-b',
        name: 'Design B - Royal Crest',
        price: 2495,
        originalPrice: 3500,
        inStock: true,
        stockQuantity: 6,
        sku: 'KCS-DLZ-B',
      },
      {
        id: 'var-delizia-c',
        name: 'Design C - Pastel Bloom',
        price: 2495,
        originalPrice: 3500,
        inStock: true,
        stockQuantity: 5,
        sku: 'KCS-DLZ-C',
      },
    ],
    specifications: {
      'Platter Diameter': '11.5 Inches (Round Scalloped)',
      'Plate Diameter': '7.0 Inches (6 Dessert Plates)',
      'Spatula': '10.5 Inch Melamine Cake Server Slice',
      'Material': '100% Pure Non-Toxic Melamine',
    },
    features: [
      'Scalloped perimeter catches pastry crumbs and fruit glazes',
      'Serrated server edge easily slices cheesecake, sponge, and pies',
      'Scratch-resistant surface preserves delicate botanical artwork',
      'Ideal gift for high-tea lovers and bakers',
    ],
    rating: 4.8,
    reviewCount: 22,
    isFeatured: true,
    isBestSeller: false,
    createdAt: '2026-02-12T11:20:00.000Z',
  },
  {
    id: 'kcs-prod-007',
    title: 'Orchid Medium 3-Tier Double Stand Platter for Cake and Pastry',
    slug: 'orchid-medium-3-tier-double-stand-platter-for-cake-and-pastry',
    description: 'A showstopping centerpiece for dessert tables, afternoon tea, and parties. Three graduated tiers of durable, food-grade melamine held firmly by a double-stand central chrome rod with an ornate crown lifting ring.',
    categoryId: 'cat-cake-stands',
    categoryName: 'Cake Stands',
    price: 3865,
    originalPrice: 4500,
    inStock: true,
    stockQuantity: 14,
    images: [
      '/src/assets/images/collection_cake_stands_1793629994740.jpg',
      '/src/assets/images/product_cake_serving_set_1793630015248.jpg',
    ],
    variants: [
      {
        id: 'var-orc-3t-std',
        name: 'Standard 3-Tier Stand',
        price: 3865,
        originalPrice: 4500,
        inStock: true,
        stockQuantity: 14,
        sku: 'KCS-ORC-3T',
      },
    ],
    specifications: {
      'Tiers': 'Top (8"), Middle (10"), Bottom (12")',
      'Height': '14.5 Inches Assembled',
      'Hardware': 'Heavy Chrome Plated Steel Rod with Rubber Washers',
      'Assembly': 'Tool-Free Quick Screw Assembly & Disassembly',
    },
    features: [
      'Stable heavy base prevents accidental dessert tipping',
      'Fluted plate edges prevent cupcakes and macarons from rolling',
      'Disassembles flat for easy storage in drawers',
      '100% Dishwasher safe melamine tiers',
    ],
    rating: 4.9,
    reviewCount: 31,
    isFeatured: true,
    isBestSeller: true,
    createdAt: '2026-02-08T15:45:00.000Z',
  },
  {
    id: 'kcs-prod-008',
    title: 'Orchid Melamine Printed Serving Tray',
    slug: 'orchid-melamine-printed-serving-tray',
    description: 'Serve tea, coffee, and savory appetizers with confidence. Built with thick-gauge pure melamine and deep contoured anti-spill borders, complete with integrated cutout comfort handles that provide a steady grip.',
    categoryId: 'cat-serving-platters',
    categoryName: 'Serving & Platters',
    price: 435,
    originalPrice: 550,
    inStock: true,
    stockQuantity: 35,
    images: [
      '/src/assets/images/product_serving_tray_1793630013545.jpg',
      '/src/assets/images/collection_dinner_sets_1793629992325.jpg',
    ],
    variants: [
      {
        id: 'var-tray-sm',
        name: 'Small (10" x 7")',
        price: 435,
        originalPrice: 550,
        inStock: true,
        stockQuantity: 15,
        sku: 'KCS-TRY-SM',
      },
      {
        id: 'var-tray-md',
        name: 'Medium (13" x 9")',
        price: 750,
        originalPrice: 900,
        inStock: true,
        stockQuantity: 12,
        sku: 'KCS-TRY-MD',
      },
      {
        id: 'var-tray-lg',
        name: 'Large (16" x 11")',
        price: 1080,
        originalPrice: 1300,
        inStock: true,
        stockQuantity: 8,
        sku: 'KCS-TRY-LG',
      },
    ],
    specifications: {
      'Rim Height': '1.5 Inches Spill-Proof Edge',
      'Grip': 'Dual Ergonomic Molded Side Handles',
      'Material': 'High-Impact Resistant Melamine',
      'Heat Tolerance': 'Direct Warm Dishes & Hot Teapots',
    },
    features: [
      'Subtle botanical print sealed beneath crystal clear hard glaze',
      'Raised lip prevents mugs and cups from sliding off',
      'Easy wipe-clean surface resistant to tea and coffee tannin stains',
      'Lightweight and comfortable for hospitality serving',
    ],
    rating: 4.6,
    reviewCount: 42,
    isFeatured: false,
    isBestSeller: true,
    createdAt: '2026-02-14T16:00:00.000Z',
  },
  {
    id: 'kcs-prod-009',
    title: 'AYD Stainless Steel Luxury Golden Cutlery Set (24 Pieces with Stand)',
    slug: 'ayd-stainless-steel-luxury-golden-cutlery-set',
    description: 'Crafted from premium 18/10 stainless steel with permanent physical vapor deposition (PVD) titanium gold finish. Mirror polished to a jewelry-grade sheen, balanced perfectly in hand, and displayed on a sleek countertop hanging carousel stand.',
    categoryId: 'cat-cutlery',
    categoryName: 'Cutlery',
    price: 4650,
    originalPrice: 5500,
    inStock: true,
    stockQuantity: 10,
    images: [
      '/src/assets/images/collection_cutlery_gold_1793629993838.jpg',
      '/src/assets/images/collection_dinner_sets_1793629992325.jpg',
    ],
    variants: [
      {
        id: 'var-ayd-gold',
        name: 'Mirror Gold Finish',
        price: 4650,
        originalPrice: 5500,
        inStock: true,
        stockQuantity: 4,
        sku: 'KCS-AYD-GLD',
      },
      {
        id: 'var-ayd-silver',
        name: 'Silver Classic Finish',
        price: 4200,
        originalPrice: 5000,
        inStock: true,
        stockQuantity: 4,
        sku: 'KCS-AYD-SLV',
      },
      {
        id: 'var-ayd-rose',
        name: 'Rose Gold Finish',
        price: 4800,
        originalPrice: 5700,
        inStock: true,
        stockQuantity: 2,
        sku: 'KCS-AYD-RSG',
      },
    ],
    specifications: {
      'Steel Grade': '18/10 Heavy Gauge Food Safe Stainless Steel',
      'Coating': 'PVD Titanium Vacuum Electroplated',
      'Contents': '6 Dinner Spoons, 6 Dinner Forks, 6 Tea Spoons, 6 Dinner Knives + Stand',
      'Stand': 'Anti-Rust Sculptural Hanging Countertop Stand',
    },
    features: [
      'PVD plating resists tarnishing, corrosion, and everyday flaking',
      'Smooth hand-polished tines and rounded spoon bowls',
      'Substantial ergonomic heft provides fine-dining tactile comfort',
      'Stunning tabletop presence on modern dining tables',
    ],
    rating: 4.9,
    reviewCount: 35,
    isFeatured: true,
    isBestSeller: true,
    createdAt: '2026-02-11T13:20:00.000Z',
  },
  {
    id: 'kcs-prod-010',
    title: 'Acrylic Diamond-Cut 7-Piece Water & Drinkware Set',
    slug: 'acrylic-diamond-cut-7-piece-water-drinkware-set',
    description: 'Enjoy the crystal clarity of fine glass without the anxiety of breakage. Molded from premium shatterproof acrylic with brilliant light-refracting diamond facets. Includes an ample 1.8-liter jug with pouring lid and 6 matching 350ml tumblers.',
    categoryId: 'cat-drinkware',
    categoryName: 'Drinkware',
    price: 3150,
    originalPrice: 3850,
    inStock: true,
    stockQuantity: 22,
    images: [
      '/src/assets/images/product_drinkware_set_1793630012796.jpg',
      '/src/assets/images/collection_dinner_sets_1793629992325.jpg',
    ],
    variants: [
      {
        id: 'var-acr-clear',
        name: 'Crystal Clear',
        price: 3150,
        originalPrice: 3850,
        inStock: true,
        stockQuantity: 10,
        sku: 'KCS-ACR-CLR',
      },
      {
        id: 'var-acr-amber',
        name: 'Amber Champagne',
        price: 3150,
        originalPrice: 3850,
        inStock: true,
        stockQuantity: 7,
        sku: 'KCS-ACR-AMB',
      },
      {
        id: 'var-acr-smoke',
        name: 'Smoke Gray',
        price: 3150,
        originalPrice: 3850,
        inStock: true,
        stockQuantity: 5,
        sku: 'KCS-ACR-SMK',
      },
    ],
    specifications: {
      'Jug Capacity': '1.8 Liters with Built-In Ice Strainer Spout',
      'Glass Capacity': '350ml Each (6 Tumblers Included)',
      'Material': 'BPA-Free Optical Clarity Polystyrene Acrylic',
      'Durability': '100% Shatterproof & Drop-Resistant',
    },
    features: [
      'Safe around kids, tiled floors, poolside, and outdoor verandas',
      'Faceted diamond pattern enhances grip even with condensation',
      'Resistant to clouding, odors, and beverage staining',
      'Smooth pour drip-free lid seals ice cubes inside while pouring',
    ],
    rating: 4.7,
    reviewCount: 26,
    isFeatured: true,
    isBestSeller: false,
    createdAt: '2026-02-16T17:10:00.000Z',
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'King Crockery Store',
  tagline: 'Make Every Meal a Beautiful Experience',
  announcementBar: {
    enabled: true,
    text: 'Pay in advance via Bank Transfer & receive an instant 4% discount! Cash on Delivery available across Pakistan.',
    link: '/shop',
  },
  hero: {
    headline: 'Make Every Meal a Beautiful Experience',
    supportingText: 'Discover elegant dinnerware, premium serving essentials and thoughtfully selected crockery for every occasion.',
    primaryCtaText: 'Shop Collection',
    secondaryCtaText: 'Explore Dinner Sets',
    imageUrl: '/src/assets/images/hero_dining_table_1793629991679.jpg',
  },
  advancePaymentDiscountPercent: 4,
  shippingCharges: 250,
  freeShippingThreshold: 5000,
  contact: {
    phone1: '+92-21-32710174',
    phone2: '+92-21-32710492',
    email: 'kingcrockery@hotmail.com',
    address: 'Shop No B27 & B28, Basement Floor, City Shopping Center, Marston Road, Behind Gul Plaza, Karachi, Pakistan',
    whatsappNumber: '923002710174',
    city: 'Karachi, Pakistan',
  },
  bankDetails: {
    bankName: 'Meezan Bank Limited',
    accountTitle: 'KING CROCKERY STORE',
    accountNumber: '01010102948291',
    iban: 'PK45MEZN0001010102948291',
    instructions: 'Please transfer your order total to the account above. After payment, WhatsApp your payment screenshot along with your Order ID to +92-300-2710174 or upload the receipt in the order confirmation screen.',
  },
  socialLinks: {
    facebook: 'https://facebook.com/kingcrockerystore',
    instagram: 'https://instagram.com/kingcrockerystore',
  },
};

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    productId: 'kcs-prod-001',
    customerName: 'Saima Farooq',
    rating: 5,
    date: '2026-02-18',
    comment: 'The Orchid 30pc set arrived safely in Lahore without a single scratch! The double glaze feels so luxurious, almost like imported bone china.',
    verifiedPurchase: true,
  },
  {
    id: 'rev-002',
    productId: 'kcs-prod-004',
    customerName: 'Tariq Mehmood',
    rating: 5,
    date: '2026-02-21',
    comment: 'The 4 Liter Hot Pot in Maroon kept our biryani piping hot from 1 PM lunch until our late guests arrived at 6 PM. Extremely impressed.',
    verifiedPurchase: true,
  },
  {
    id: 'rev-003',
    productId: 'kcs-prod-009',
    customerName: 'Ayesha Bilgrami',
    rating: 5,
    date: '2026-02-25',
    comment: 'The AYD Gold Cutlery with stand is the star of my dining table. Weight feels very premium and the gold finish is flawless.',
    verifiedPurchase: true,
  },
  {
    id: 'rev-004',
    productId: 'kcs-prod-007',
    customerName: 'Hina Zubair',
    rating: 5,
    date: '2026-02-28',
    comment: 'Used the 3-tier stand for my daughter’s birthday party. Everyone asked where I bought it from. Highly recommended!',
    verifiedPurchase: true,
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.error('Error loading database file, initializing defaults:', err);
    }

    const initialData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: [
        {
          id: 'kcs-ord-1001',
          orderNumber: 'KCS-10821',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          customer: {
            fullName: 'Zainab Qureshi',
            email: 'zainab.q@gmail.com',
            phone: '+92 321 4455667',
            province: 'Sindh',
            city: 'Karachi',
            deliveryAddress: 'House 42, Block 4, Clifton',
            postalCode: '75600',
            orderNotes: 'Please deliver after 2pm',
          },
          items: [
            {
              productId: 'kcs-prod-001',
              productTitle: 'Orchid White Melamine Double Glazed Dinner Set',
              variantId: 'var-orchid-30',
              variantName: '30 Pieces (6 Persons)',
              price: 9200,
              quantity: 1,
              image: '/src/assets/images/collection_dinner_sets_1793629992325.jpg',
            },
          ],
          subtotal: 9200,
          shippingFee: 0,
          discountAmount: 0,
          finalTotal: 9200,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          orderStatus: 'Confirmed',
          trackingNumber: 'TCS-92817402',
          courierNotes: 'Dispatched via TCS Express',
        },
      ],
      reviews: INITIAL_REVIEWS,
      newsletter: [
        { email: 'customer1@example.com', subscribedAt: new Date().toISOString() },
      ],
      settings: INITIAL_SETTINGS,
      customers: [],
      adminTokens: ['kcs_admin_token_default'],
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save data to disk:', err);
    }
  }

  public getProducts(categoryId?: string, search?: string, sort?: string): Product[] {
    let list = [...this.data.products];

    if (categoryId && categoryId !== 'all') {
      list = list.filter((p) => p.categoryId === categoryId || p.slug.includes(categoryId));
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    if (sort) {
      switch (sort) {
        case 'price-low':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          break;
      }
    }

    return list;
  }

  public getProductByIdOrSlug(idOrSlug: string): Product | undefined {
    return this.data.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  }

  public saveProduct(product: Product): Product {
    const index = this.data.products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      this.data.products[index] = product;
    } else {
      this.data.products.unshift(product);
    }
    this.saveData(this.data);
    return product;
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== prevLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getCategories(): Category[] {
    // Recount items dynamically
    return this.data.categories.map((c) => {
      const count = this.data.products.filter((p) => p.categoryId === c.id).length;
      return { ...c, itemCount: count };
    });
  }

  public saveCategory(category: Category): Category {
    const index = this.data.categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      this.data.categories[index] = category;
    } else {
      this.data.categories.push(category);
    }
    this.saveData(this.data);
    return category;
  }

  public getOrders(status?: string, search?: string): Order[] {
    let list = [...this.data.orders];
    if (status && status !== 'all') {
      list = list.filter((o) => o.orderStatus === status);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phone.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderByIdOrNumber(idOrNumber: string): Order | undefined {
    return this.data.orders.find((o) => o.id === idOrNumber || o.orderNumber === idOrNumber);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `KCS-${randomSuffix}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    // Deduct stock safely
    for (const item of newOrder.items) {
      const product = this.data.products.find((p) => p.id === item.productId);
      if (product) {
        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (variant) {
            variant.stockQuantity = Math.max(0, variant.stockQuantity - item.quantity);
            if (variant.stockQuantity === 0) variant.inStock = false;
          }
        }
        product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
        if (product.stockQuantity === 0) product.inStock = false;
      }
    }

    this.data.orders.unshift(newOrder);
    this.saveData(this.data);
    return newOrder;
  }

  public updateOrder(
    id: string,
    updates: Partial<Pick<Order, 'orderStatus' | 'paymentStatus' | 'trackingNumber' | 'courierNotes' | 'paymentProofUrl'>>
  ): Order | undefined {
    const order = this.data.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return undefined;
    Object.assign(order, updates);
    this.saveData(this.data);
    return order;
  }

  public getReviews(productId?: string): Review[] {
    if (productId) {
      return this.data.reviews.filter((r) => r.productId === productId);
    }
    return this.data.reviews;
  }

  public addReview(review: Omit<Review, 'id' | 'date'>): Review {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    this.data.reviews.unshift(newReview);

    // Update product rating
    const pReviews = this.data.reviews.filter((r) => r.productId === review.productId);
    const avg = pReviews.reduce((acc, r) => acc + r.rating, 0) / pReviews.length;
    const prod = this.data.products.find((p) => p.id === review.productId);
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(1));
      prod.reviewCount = pReviews.length;
    }

    this.saveData(this.data);
    return newReview;
  }

  public addSubscriber(email: string): boolean {
    const normalized = email.toLowerCase().trim();
    if (!this.data.newsletter.some((s) => s.email === normalized)) {
      this.data.newsletter.push({ email: normalized, subscribedAt: new Date().toISOString() });
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...settings,
    };
    this.saveData(this.data);
    return this.data.settings;
  }

  public verifyAdminToken(token: string): boolean {
    return token === 'kcs_admin_token_default' || this.data.adminTokens.includes(token);
  }

  public generateAdminToken(): string {
    const token = `kcs_adm_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    this.data.adminTokens.push(token);
    this.saveData(this.data);
    return token;
  }
}

export const db = new Database();
