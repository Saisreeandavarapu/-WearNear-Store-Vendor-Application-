import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Brand,
  Order,
  OrderStatus,
  InventoryItem,
  InventoryTransaction,
  Invoice,
  Settlement,
  WalletTransaction,
  CustomerSummary,
  StaffMember,
  NotificationItem,
  ReturnRequest,
  ExchangeRequest,
  RefundItem,
  StoreOffer,
  ReviewItem,
  SupportTicket,
  KycDocument
} from '../types';

interface DataContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  sizes: string[];
  colors: { name: string; hex: string; count: number }[];
  orders: Order[];
  inventory: InventoryItem[];
  inventoryTransactions: InventoryTransaction[];
  invoices: Invoice[];
  settlements: Settlement[];
  walletTransactions: WalletTransaction[];
  walletBalance: { available: number; pending: number; totalEarnings: number };
  customers: CustomerSummary[];
  staff: StaffMember[];
  notifications: NotificationItem[];
  returns: ReturnRequest[];
  exchanges: ExchangeRequest[];
  refunds: RefundItem[];
  offers: StoreOffer[];
  reviews: ReviewItem[];
  supportTickets: SupportTicket[];
  kycDocuments: KycDocument[];

  // Action methods
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'salesCount' | 'rating'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string, reason?: string) => void;
  updateStock: (productId: string, newStock: number, reason: string) => void;
  createInvoice: (orderId: string) => Invoice;
  addStaffMember: (member: Omit<StaffMember, 'id' | 'joinedDate'>) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateReturnStatus: (id: string, status: ReturnRequest['status']) => void;
  updateExchangeStatus: (id: string, status: ExchangeRequest['status']) => void;
  addStoreOffer: (offer: Omit<StoreOffer, 'id' | 'usageCount'>) => void;
  toggleOfferStatus: (id: string) => void;
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'> & { initialMessage: string }) => void;
  replyToSupportTicket: (ticketId: string, message: string) => void;
  uploadKycDoc: (id: string, fileName: string) => void;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', name: "Men's Shirts & Kurtas", slug: 'mens-ethnic', iconName: 'Shirt', productCount: 28, status: 'ACTIVE' },
  { id: 'cat_2', name: "Women's Ethnic & Sarees", slug: 'womens-ethnic', iconName: 'Sparkles', productCount: 42, status: 'ACTIVE' },
  { id: 'cat_3', name: 'Western Tops & Tees', slug: 'western-tops', iconName: 'Layers', productCount: 35, status: 'ACTIVE' },
  { id: 'cat_4', name: 'Trousers & Denim Jeans', slug: 'denim-trousers', iconName: 'Tag', productCount: 24, status: 'ACTIVE' },
  { id: 'cat_5', name: 'Handcrafted Footwear', slug: 'footwear', iconName: 'Footprints', productCount: 16, status: 'ACTIVE' },
  { id: 'cat_6', name: 'Accessories & Leather', slug: 'accessories', iconName: 'Gem', productCount: 12, status: 'ACTIVE' }
];

const INITIAL_BRANDS: Brand[] = [
  { id: 'br_1', name: 'Vogue Loom Signature', logo: 'VL', productCount: 45, status: 'ACTIVE', tier: 'Premium' },
  { id: 'br_2', name: 'IndiWeave Crafts', logo: 'IW', productCount: 38, status: 'ACTIVE', tier: 'Premium' },
  { id: 'br_3', name: 'Urban Stitch Co', logo: 'US', productCount: 29, status: 'ACTIVE', tier: 'Regular' },
  { id: 'br_4', name: 'Raw Soul Denim', logo: 'RS', productCount: 18, status: 'ACTIVE', tier: 'Regular' },
  { id: 'br_5', name: 'Artisan Kolhapuri', logo: 'AK', productCount: 12, status: 'ACTIVE', tier: 'Fast Fashion' }
];

const INITIAL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const INITIAL_COLORS = [
  { name: 'Midnight Black', hex: '#111827', count: 48 },
  { name: 'Pearl Ivory', hex: '#F9FAFB', count: 36 },
  { name: 'Navy Imperial', hex: '#1E3A8A', count: 32 },
  { name: 'Crimson Rust', hex: '#991B1B', count: 24 },
  { name: 'Sage Olive', hex: '#3F6212', count: 21 },
  { name: 'Warm Ochre', hex: '#D97706', count: 18 },
  { name: 'Dusty Rose', hex: '#BE185D', count: 14 }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_101',
    name: 'Pure Mulberry Silk Festive Kurta Set',
    sku: 'VL-MSK-01',
    category: "Men's Shirts & Kurtas",
    categoryId: 'cat_1',
    brand: 'Vogue Loom Signature',
    brandId: 'br_1',
    description: 'Woven from handspun mulberry silk with delicate tone-on-tone resham embroidery on collar and placket. Includes matching churidar pants.',
    mrp: 4499,
    sellingPrice: 3299,
    discountPercent: 27,
    stock: 24,
    lowStockThreshold: 5,
    status: 'ACTIVE',
    images: [
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy Imperial', hex: '#1E3A8A' },
      { name: 'Pearl Ivory', hex: '#F9FAFB' }
    ],
    variants: [
      { id: 'v1', sku: 'VL-MSK-01-BLU-S', size: 'S', color: 'Navy Imperial', colorHex: '#1E3A8A', price: 3299, stock: 6 },
      { id: 'v2', sku: 'VL-MSK-01-BLU-M', size: 'M', color: 'Navy Imperial', colorHex: '#1E3A8A', price: 3299, stock: 8 },
      { id: 'v3', sku: 'VL-MSK-01-BLU-L', size: 'L', color: 'Navy Imperial', colorHex: '#1E3A8A', price: 3299, stock: 5 },
      { id: 'v4', sku: 'VL-MSK-01-BLU-XL', size: 'XL', color: 'Navy Imperial', colorHex: '#1E3A8A', price: 3299, stock: 5 }
    ],
    createdAt: '2026-09-10',
    updatedAt: '2026-09-26',
    salesCount: 142,
    rating: 4.9
  },
  {
    id: 'prod_102',
    name: 'Relaxed Fit 14oz Japanese Selvedge Denim',
    sku: 'RS-DNM-08',
    category: 'Trousers & Denim Jeans',
    categoryId: 'cat_4',
    brand: 'Raw Soul Denim',
    brandId: 'br_4',
    description: 'Shuttle-loomed 14oz raw selvedge denim. Develops custom honeycombs and whiskers tailored uniquely to your movement.',
    mrp: 3899,
    sellingPrice: 2899,
    discountPercent: 25,
    stock: 8,
    lowStockThreshold: 10,
    status: 'ACTIVE',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Indigo Deep', hex: '#1e3a8a' },
      { name: 'Midnight Black', hex: '#111827' }
    ],
    variants: [
      { id: 'v5', sku: 'RS-DNM-08-30', size: '30', color: 'Indigo Deep', colorHex: '#1e3a8a', price: 2899, stock: 2 },
      { id: 'v6', sku: 'RS-DNM-08-32', size: '32', color: 'Indigo Deep', colorHex: '#1e3a8a', price: 2899, stock: 3 },
      { id: 'v7', sku: 'RS-DNM-08-34', size: '34', color: 'Indigo Deep', colorHex: '#1e3a8a', price: 2899, stock: 2 },
      { id: 'v8', sku: 'RS-DNM-08-36', size: '36', color: 'Indigo Deep', colorHex: '#1e3a8a', price: 2899, stock: 1 }
    ],
    createdAt: '2026-09-12',
    updatedAt: '2026-09-25',
    salesCount: 88,
    rating: 4.8
  },
  {
    id: 'prod_103',
    name: 'French Linen Button-Down Resort Shirt',
    sku: 'US-LNN-22',
    category: "Men's Shirts & Kurtas",
    categoryId: 'cat_1',
    brand: 'Urban Stitch Co',
    brandId: 'br_3',
    description: '100% Normandy flax linen. Breathable open-weave structure, garment washed for an ultra-soft lived-in handfeel.',
    mrp: 2499,
    sellingPrice: 1799,
    discountPercent: 28,
    stock: 35,
    lowStockThreshold: 8,
    status: 'ACTIVE',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Sage Olive', hex: '#3F6212' },
      { name: 'Pearl Ivory', hex: '#F9FAFB' }
    ],
    variants: [],
    createdAt: '2026-09-15',
    updatedAt: '2026-09-24',
    salesCount: 165,
    rating: 4.7
  },
  {
    id: 'prod_104',
    name: 'Handcrafted Heritage Kolhapuri Mules',
    sku: 'AK-KHL-04',
    category: 'Handcrafted Footwear',
    categoryId: 'cat_5',
    brand: 'Artisan Kolhapuri',
    brandId: 'br_5',
    description: 'Genuine vegetable-tanned leather handcrafted by third-generation artisans in Maharashtra with cushioned footbed.',
    mrp: 2999,
    sellingPrice: 2199,
    discountPercent: 27,
    stock: 3,
    lowStockThreshold: 5,
    status: 'ACTIVE',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['7', '8', '9', '10'],
    colors: [{ name: 'Warm Ochre', hex: '#D97706' }],
    variants: [],
    createdAt: '2026-09-18',
    updatedAt: '2026-09-27',
    salesCount: 64,
    rating: 4.95
  },
  {
    id: 'prod_105',
    name: 'Chanderi Zari Embroidered Anarkali Set',
    sku: 'IW-CHN-90',
    category: "Women's Ethnic & Sarees",
    categoryId: 'cat_2',
    brand: 'IndiWeave Crafts',
    brandId: 'br_2',
    description: 'Royal Chanderi silk gown with authentic gold Zari border weaving and organza scalloped dupatta.',
    mrp: 7999,
    sellingPrice: 5499,
    discountPercent: 31,
    stock: 0,
    lowStockThreshold: 4,
    status: 'OUT_OF_STOCK',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Crimson Rust', hex: '#991B1B' }],
    variants: [],
    createdAt: '2026-09-05',
    updatedAt: '2026-09-27',
    salesCount: 92,
    rating: 4.88
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_9901',
    orderNumber: '#WN-8821',
    customer: {
      id: 'cust_1',
      name: 'Aditya Deshmukh',
      phone: '+91 98205 11204',
      address: 'Flat 402, Sea Green Apts, Perry Cross Rd, Bandra West, Mumbai 400050',
      distanceKm: 1.2
    },
    items: [
      {
        id: 'item_1',
        productId: 'prod_101',
        productName: 'Pure Mulberry Silk Festive Kurta Set',
        sku: 'VL-MSK-01-BLU-M',
        size: 'M',
        color: 'Navy Imperial',
        quantity: 1,
        price: 3299,
        discount: 300,
        total: 2999,
        image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=200'
      }
    ],
    itemCount: 1,
    subtotal: 3299,
    discountTotal: 300,
    deliveryCharge: 0,
    taxes: 150,
    totalAmount: 3149,
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'PAID',
    status: 'NEW',
    createdAt: '10 mins ago',
    pickupTimeWindow: 'Within 25 mins',
    timeline: [
      { title: 'Order Placed by Customer', description: 'Payment confirmed via UPI', timestamp: '10 mins ago', completed: true, current: false },
      { title: 'Store Confirmation Pending', description: 'Review inventory and click Accept Order', timestamp: 'Now', completed: false, current: true }
    ],
    notes: 'Please pack in festive gift box if available.'
  },
  {
    id: 'ord_9902',
    orderNumber: '#WN-8819',
    customer: {
      id: 'cust_2',
      name: 'Tanvi Singhania',
      phone: '+91 98192 44320',
      address: 'Bungalow 7, Pali Hill, Bandra West, Mumbai 400050',
      distanceKm: 2.1
    },
    items: [
      {
        id: 'item_2',
        productId: 'prod_103',
        productName: 'French Linen Button-Down Resort Shirt',
        sku: 'US-LNN-22-L',
        size: 'L',
        color: 'Sage Olive',
        quantity: 2,
        price: 1799,
        discount: 200,
        total: 3398,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=200'
      }
    ],
    itemCount: 2,
    subtotal: 3598,
    discountTotal: 200,
    deliveryCharge: 40,
    taxes: 170,
    totalAmount: 3608,
    paymentMethod: 'ONLINE_CARD',
    paymentStatus: 'PAID',
    status: 'ACCEPTED',
    createdAt: '25 mins ago',
    pickupTimeWindow: 'By 08:45 PM',
    captain: {
      id: 'capt_11',
      name: 'Sameer Sheikh',
      phone: '+91 98334 12908',
      vehicleType: 'EV Scooter',
      vehicleNumber: 'MH 02 ER 8820',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      rating: 4.92,
      etaMinutes: 12
    },
    timeline: [
      { title: 'Order Received', timestamp: '25 mins ago', completed: true, current: false },
      { title: 'Order Accepted by Store', timestamp: '20 mins ago', completed: true, current: false },
      { title: 'Packing in Progress', timestamp: 'Current Step', completed: false, current: true },
      { title: 'Captain Arrival & Pickup', timestamp: 'ETA 12 mins', completed: false, current: false }
    ]
  },
  {
    id: 'ord_9903',
    orderNumber: '#WN-8815',
    customer: {
      id: 'cust_3',
      name: 'Rohan Mehra',
      phone: '+91 98200 99881',
      address: '12 Turner Road, Next to Cafe Basilico, Bandra West, Mumbai',
      distanceKm: 0.8
    },
    items: [
      {
        id: 'item_3',
        productId: 'prod_102',
        productName: 'Relaxed Fit 14oz Japanese Selvedge Denim',
        sku: 'RS-DNM-08-32',
        size: '32',
        color: 'Indigo Deep',
        quantity: 1,
        price: 2899,
        discount: 0,
        total: 2899,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200'
      }
    ],
    itemCount: 1,
    subtotal: 2899,
    discountTotal: 0,
    deliveryCharge: 0,
    taxes: 145,
    totalAmount: 3044,
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'PAID',
    status: 'READY_FOR_PICKUP',
    createdAt: '42 mins ago',
    captain: {
      id: 'capt_14',
      name: 'Karan Patil',
      phone: '+91 97690 44211',
      vehicleType: 'Hero Splendor',
      vehicleNumber: 'MH 01 BG 4490',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
      rating: 4.88,
      etaMinutes: 3
    },
    timeline: [
      { title: 'Order Received', timestamp: '42 mins ago', completed: true, current: false },
      { title: 'Accepted & Packed', timestamp: '30 mins ago', completed: true, current: false },
      { title: 'Marked Ready for Pickup', timestamp: '15 mins ago', completed: true, current: false },
      { title: 'Captain Arrived at Store', timestamp: 'Captain at counter', completed: false, current: true }
    ]
  },
  {
    id: 'ord_9904',
    orderNumber: '#WN-8802',
    customer: {
      id: 'cust_4',
      name: 'Kavita Chawla',
      phone: '+91 98211 55667',
      address: 'A-21, Oceanic Tower, Carter Road, Bandra West, Mumbai 400050',
      distanceKm: 2.8
    },
    items: [
      {
        id: 'item_4',
        productId: 'prod_104',
        productName: 'Handcrafted Heritage Kolhapuri Mules',
        sku: 'AK-KHL-04-8',
        size: '8',
        color: 'Warm Ochre',
        quantity: 1,
        price: 2199,
        discount: 100,
        total: 2099,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200'
      }
    ],
    itemCount: 1,
    subtotal: 2199,
    discountTotal: 100,
    deliveryCharge: 0,
    taxes: 105,
    totalAmount: 2204,
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'PAID',
    status: 'COMPLETED',
    createdAt: 'Today, 03:15 PM',
    timeline: [
      { title: 'Order Received', timestamp: '03:15 PM', completed: true, current: false },
      { title: 'Packed & Handed Over', timestamp: '03:32 PM', completed: true, current: false },
      { title: 'Delivered in 28 mins', timestamp: '03:43 PM', completed: true, current: false }
    ]
  }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv_1', productId: 'prod_101', productName: 'Pure Mulberry Silk Festive Kurta Set', sku: 'VL-MSK-01', category: "Men's Shirts & Kurtas", brand: 'Vogue Loom Signature', availableStock: 24, reservedStock: 1, lowStockThreshold: 5, status: 'HEALTHY', lastUpdated: '2 hours ago' },
  { id: 'inv_2', productId: 'prod_102', productName: 'Relaxed Fit 14oz Japanese Selvedge Denim', sku: 'RS-DNM-08', category: 'Trousers & Denim Jeans', brand: 'Raw Soul Denim', availableStock: 8, reservedStock: 2, lowStockThreshold: 10, status: 'LOW_STOCK', lastUpdated: 'Today, 11:30 AM' },
  { id: 'inv_3', productId: 'prod_103', productName: 'French Linen Button-Down Resort Shirt', sku: 'US-LNN-22', category: "Men's Shirts & Kurtas", brand: 'Urban Stitch Co', availableStock: 35, reservedStock: 3, lowStockThreshold: 8, status: 'HEALTHY', lastUpdated: 'Yesterday' },
  { id: 'inv_4', productId: 'prod_104', productName: 'Handcrafted Heritage Kolhapuri Mules', sku: 'AK-KHL-04', category: 'Handcrafted Footwear', brand: 'Artisan Kolhapuri', availableStock: 3, reservedStock: 0, lowStockThreshold: 5, status: 'LOW_STOCK', lastUpdated: '3 hours ago' },
  { id: 'inv_5', productId: 'prod_105', productName: 'Chanderi Zari Embroidered Anarkali Set', sku: 'IW-CHN-90', category: "Women's Ethnic & Sarees", brand: 'IndiWeave Crafts', availableStock: 0, reservedStock: 0, lowStockThreshold: 4, status: 'OUT_OF_STOCK', lastUpdated: '1 day ago' }
];

const INITIAL_TRANSACTIONS: InventoryTransaction[] = [
  { id: 'tx_1', date: 'Today, 04:30 PM', productName: 'Pure Mulberry Silk Festive Kurta Set', sku: 'VL-MSK-01-BLU-M', type: 'RESERVED', quantityChange: -1, previousStock: 25, newStock: 24, reason: 'Order #WN-8821 allocated', performedBy: 'System Auto' },
  { id: 'tx_2', date: 'Today, 02:15 PM', productName: 'French Linen Button-Down Resort Shirt', sku: 'US-LNN-22', type: 'STOCK_ADDED', quantityChange: 20, previousStock: 15, newStock: 35, reason: 'Vendor Shipment Inward Batch #441', performedBy: 'Vikramaditya (Owner)' },
  { id: 'tx_3', date: 'Yesterday, 06:40 PM', productName: 'Relaxed Fit 14oz Japanese Selvedge Denim', sku: 'RS-DNM-08', type: 'STOCK_DEDUCTED', quantityChange: -2, previousStock: 10, newStock: 8, reason: 'Store Counter Sale POS', performedBy: 'Pooja (Manager)' },
  { id: 'tx_4', date: '25 Sep 2026', productName: 'Chanderi Zari Embroidered Anarkali Set', sku: 'IW-CHN-90', type: 'STOCK_DEDUCTED', quantityChange: -4, previousStock: 4, newStock: 0, reason: 'Flash Festival Sale Deliveries', performedBy: 'System Auto' }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_doc_01',
    invoiceNumber: 'INV-WN-2026-0412',
    orderId: 'ord_9904',
    orderNumber: '#WN-8802',
    date: '27 Sep 2026',
    customerName: 'Kavita Chawla',
    customerPhone: '+91 98211 55667',
    customerAddress: 'A-21, Oceanic Tower, Carter Road, Bandra West, Mumbai 400050',
    storeName: 'Vogue Loom Studio',
    storeGst: '27AABCV1294K1Z8',
    items: [
      { name: 'Handcrafted Heritage Kolhapuri Mules', sku: 'AK-KHL-04-8', size: '8', color: 'Warm Ochre', quantity: 1, unitPrice: 2199, discount: 100, taxRate: 5, amount: 2099 }
    ],
    subtotal: 2199,
    discount: 100,
    taxAmount: 105,
    deliveryFee: 0,
    finalAmount: 2204,
    paymentMethod: 'UPI (Ref: 4291884021)',
    paymentStatus: 'PAID'
  }
];

const INITIAL_SETTLEMENTS: Settlement[] = [
  {
    id: 'stl_01',
    settlementId: 'STL-2026-SEP-W4',
    cyclePeriod: '20 Sep 2026 - 26 Sep 2026',
    settlementDate: '27 Sep 2026',
    ordersCount: 48,
    grossAmount: 184500,
    commissionRate: 12.5,
    commissionAmount: 23062.5,
    adjustments: 0,
    netPayout: 161437.5,
    bankAccountLast4: '9824',
    status: 'PROCESSED',
    utrNumber: 'HDFCR202609278891002'
  },
  {
    id: 'stl_02',
    settlementId: 'STL-2026-SEP-W3',
    cyclePeriod: '13 Sep 2026 - 19 Sep 2026',
    settlementDate: '20 Sep 2026',
    ordersCount: 52,
    grossAmount: 198200,
    commissionRate: 12.5,
    commissionAmount: 24775,
    adjustments: -500,
    netPayout: 172925,
    bankAccountLast4: '9824',
    status: 'PROCESSED',
    utrNumber: 'HDFCR202609201948211'
  },
  {
    id: 'stl_03',
    settlementId: 'STL-2026-OCT-W1 (Current)',
    cyclePeriod: '27 Sep 2026 - 03 Oct 2026',
    settlementDate: '04 Oct 2026 (Scheduled)',
    ordersCount: 14,
    grossAmount: 48250,
    commissionRate: 12.5,
    commissionAmount: 6031.25,
    adjustments: 0,
    netPayout: 42218.75,
    bankAccountLast4: '9824',
    status: 'PENDING'
  }
];

const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  { id: 'wt_1', date: 'Today, 03:45 PM', type: 'ORDER_PAYOUT', amount: 2099, isCredit: true, orderNumber: '#WN-8802', description: 'Order completed delivery credit', balanceAfter: 48250 },
  { id: 'wt_2', date: 'Today, 03:45 PM', type: 'COMMISSION_DEDUCTION', amount: 262.38, isCredit: false, orderNumber: '#WN-8802', description: 'WearNear platform commission 12.5%', balanceAfter: 46151 },
  { id: 'wt_3', date: '27 Sep 2026', type: 'SETTLEMENT_WITHDRAWAL', amount: 161437.5, isCredit: false, description: 'Bank Payout STL-2026-SEP-W4 to HDFC **9824', balanceAfter: 44314 },
  { id: 'wt_4', date: '26 Sep 2026', type: 'ORDER_PAYOUT', amount: 3299, isCredit: true, orderNumber: '#WN-8798', description: 'Order delivery payout', balanceAfter: 205751 }
];

const INITIAL_CUSTOMERS: CustomerSummary[] = [
  { id: 'c1', name: 'Aditya Deshmukh', phone: '+91 98205 11204', email: 'aditya.d@gmail.com', locality: 'Perry Cross Rd, Bandra', ordersCount: 7, totalSpent: 28400, lastOrderDate: 'Today', status: 'VIP' },
  { id: 'c2', name: 'Tanvi Singhania', phone: '+91 98192 44320', email: 'tanvi.s@singhania.in', locality: 'Pali Hill, Bandra', ordersCount: 5, totalSpent: 22150, lastOrderDate: 'Today', status: 'VIP' },
  { id: 'c3', name: 'Rohan Mehra', phone: '+91 98200 99881', email: 'rohan.mehra@outlook.com', locality: 'Turner Road, Bandra', ordersCount: 3, totalSpent: 9800, lastOrderDate: 'Today', status: 'ACTIVE' },
  { id: 'c4', name: 'Kavita Chawla', phone: '+91 98211 55667', email: 'kavita.c@gmail.com', locality: 'Carter Road, Bandra', ordersCount: 4, totalSpent: 16400, lastOrderDate: 'Today', status: 'ACTIVE' },
  { id: 'c5', name: 'Zeeshan Ali', phone: '+91 98203 77129', email: 'zeeshan.ali@yahoo.com', locality: 'Hill Road, Bandra', ordersCount: 2, totalSpent: 6200, lastOrderDate: '24 Sep 2026', status: 'ACTIVE' }
];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'st_1',
    name: 'Pooja Sharma',
    phone: '+91 98330 11928',
    email: 'pooja@vogueloom.com',
    role: 'Store Manager',
    status: 'ACTIVE',
    permissions: ['PRODUCT_READ', 'PRODUCT_CREATE', 'PRODUCT_UPDATE', 'INVENTORY_READ', 'INVENTORY_UPDATE', 'ORDER_READ', 'ORDER_UPDATE', 'BILL_CREATE', 'FINANCE_VIEW'],
    joinedDate: '15 Jan 2025',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'st_2',
    name: 'Rahul Kadam',
    phone: '+91 98204 88391',
    email: 'rahul@vogueloom.com',
    role: 'Inventory Lead',
    status: 'ACTIVE',
    permissions: ['PRODUCT_READ', 'INVENTORY_READ', 'INVENTORY_UPDATE', 'ORDER_READ'],
    joinedDate: '10 May 2025',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'st_3',
    name: 'Aisha Qureshi',
    phone: '+91 98219 44021',
    email: 'aisha@vogueloom.com',
    role: 'Billing Operator',
    status: 'ACTIVE',
    permissions: ['ORDER_READ', 'ORDER_UPDATE', 'BILL_CREATE'],
    joinedDate: '01 Aug 2025',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'NEW_ORDER',
    title: 'New Instant Order #WN-8821',
    message: 'Aditya Deshmukh ordered Pure Mulberry Silk Festive Kurta Set (₹3,149). Quick acceptance recommended within 15 mins.',
    timestamp: '10 mins ago',
    isRead: false,
    actionUrl: '/vendor/orders/ord_9901',
    referenceId: 'ord_9901'
  },
  {
    id: 'notif_2',
    type: 'LOW_STOCK',
    title: 'Low Stock Alert: Japanese Selvedge Denim',
    message: 'Only 8 units left in stock. Reorder soon to prevent automatic catalog deactivation.',
    timestamp: '2 hours ago',
    isRead: false,
    actionUrl: '/vendor/inventory',
    referenceId: 'prod_102'
  },
  {
    id: 'notif_3',
    type: 'SETTLEMENT',
    title: 'Settlement Payout Processed',
    message: '₹1,61,437.50 for cycle STL-2026-SEP-W4 has been credited to HDFC Bank A/c ending 9824.',
    timestamp: 'Today, 08:30 AM',
    isRead: true,
    actionUrl: '/vendor/settlements',
    referenceId: 'stl_01'
  }
];

const INITIAL_RETURNS: ReturnRequest[] = [
  {
    id: 'ret_1',
    orderNumber: '#WN-8772',
    customerName: 'Megha Singhi',
    customerPhone: '+91 98201 99201',
    productName: 'French Linen Button-Down Resort Shirt',
    size: 'XL',
    color: 'Sage Olive',
    reason: 'SIZE_FIT',
    reasonText: 'The chest fit is too loose for regular fit.',
    status: 'NEW',
    requestDate: 'Today, 11:20 AM',
    amount: 1799
  },
  {
    id: 'ret_2',
    orderNumber: '#WN-8710',
    customerName: 'Kunal Kapoor',
    customerPhone: '+91 98332 19028',
    productName: 'Handcrafted Heritage Kolhapuri Mules',
    size: '9',
    color: 'Warm Ochre',
    reason: 'DEFECTIVE',
    reasonText: 'Minor leather scuff mark near toe loop.',
    status: 'APPROVED',
    requestDate: 'Yesterday',
    amount: 2199
  }
];

const INITIAL_EXCHANGES: ExchangeRequest[] = [
  {
    id: 'exc_1',
    orderNumber: '#WN-8750',
    customerName: 'Neha Joshi',
    originalProduct: 'Pure Mulberry Silk Festive Kurta Set',
    currentSize: 'L',
    requestedSize: 'M',
    stockAvailable: true,
    status: 'PENDING',
    date: 'Today, 01:15 PM'
  }
];

const INITIAL_REFUNDS: RefundItem[] = [
  { id: 'ref_1', orderNumber: '#WN-8690', customerName: 'Arjun Rampal', amount: 2899, method: 'Original UPI', reason: 'Return inspection passed', status: 'REFUNDED', date: '26 Sep 2026' },
  { id: 'ref_2', orderNumber: '#WN-8772', customerName: 'Megha Singhi', amount: 1799, method: 'WearNear Store Wallet', reason: 'Size return request pending verification', status: 'REQUESTED', date: 'Today' }
];

const INITIAL_OFFERS: StoreOffer[] = [
  { id: 'off_1', title: 'Festive Season Kickoff: 20% Off All Kurtas', type: 'CATEGORY_DISCOUNT', discountType: 'PERCENT', discountValue: 20, targetCategory: "Men's Shirts & Kurtas", minOrderAmount: 2500, startDate: '20 Sep 2026', endDate: '15 Oct 2026', status: 'ACTIVE', usageCount: 68 },
  { id: 'off_2', title: 'Flat ₹300 Off First WearNear Order', type: 'STORE_OFFER', discountType: 'FLAT', discountValue: 300, minOrderAmount: 1999, startDate: '01 Sep 2026', endDate: '31 Oct 2026', status: 'ACTIVE', usageCount: 142 }
];

const INITIAL_REVIEWS: ReviewItem[] = [
  { id: 'rev_1', customerName: 'Varun Grover', rating: 5, title: 'Outstanding pure silk quality and instant delivery!', comment: 'Received within 35 minutes via WearNear Captain. The finish on the silk kurta placket is pure haute couture. Truly impressive Bandra boutique standard.', date: '26 Sep 2026', productName: 'Pure Mulberry Silk Festive Kurta Set', type: 'PRODUCT', verifiedPurchase: true, storeReply: 'Thank you Varun! We pride ourselves on handpicked pure fabrics.' },
  { id: 'rev_2', customerName: 'Simran Bajaj', rating: 5, title: 'Best packaging & authentic denim', comment: 'Authentic 14oz shuttle selvedge at this price with 30-min doorstep trial is unmatched in Mumbai.', date: '25 Sep 2026', productName: 'Relaxed Fit 14oz Japanese Selvedge Denim', type: 'PRODUCT', verifiedPurchase: true },
  { id: 'rev_3', customerName: 'Karan Johar', rating: 4, title: 'Store collection is sublime', comment: 'The staff coordinated sizing via phone promptly. Great in-store experience mirrored on app.', date: '22 Sep 2026', type: 'STORE', verifiedPurchase: true }
];

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_1',
    ticketNumber: 'TKT-WN-8921',
    category: 'Settlement',
    subject: 'Verification for TDS Certificate on Q2 Settlement',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: '25 Sep 2026',
    updatedAt: '26 Sep 2026',
    messages: [
      { id: 'm1', sender: 'VENDOR', senderName: 'Vikramaditya (Owner)', text: 'Hi WearNear Finance team, could you please share the Form 16A / TDS reconciliation for August settlements?', timestamp: '25 Sep 2026, 11:30 AM' },
      { id: 'm2', sender: 'SUPPORT_AGENT', senderName: 'Priyanka (WearNear Merchant Desk)', text: 'Hello Vikramaditya, your quarterly TDS certificate is generated by the 15th of the following month. We have forwarded your request to our compliance cell. You will receive it directly on partner@vogueloom.com.', timestamp: '26 Sep 2026, 10:15 AM' }
    ]
  }
];

const INITIAL_KYC_DOCUMENTS: KycDocument[] = [
  { id: 'kyc_1', type: 'IDENTITY', title: 'Owner Identity Proof', description: 'Aadhaar Card or Passport of the registered store proprietor / authorized director.', requiredFileTypes: 'PDF, JPG, PNG (Max 5MB)', status: 'APPROVED', fileName: 'Vikram_Oberoi_Aadhaar_Verified.pdf', uploadedAt: '12 Jan 2025' },
  { id: 'kyc_2', type: 'BUSINESS', title: 'GST Registration Certificate', description: 'Form GST REG-06 showing registered trade name and Bandra West principal place of business.', requiredFileTypes: 'PDF (Max 10MB)', status: 'APPROVED', fileName: 'VogueLoom_GST_REG06.pdf', uploadedAt: '12 Jan 2025' },
  { id: 'kyc_3', type: 'STORE', title: 'Storefront & Interior Proof', description: 'Clear geotagged photo of main shop board and counter area verifying physical retail presence.', requiredFileTypes: 'JPG, PNG (Min 1080p)', status: 'APPROVED', fileName: 'Store_Front_Bandra_LinkingRd.jpg', uploadedAt: '13 Jan 2025' },
  { id: 'kyc_4', type: 'BANK', title: 'Cancelled Cheque / Bank Statement', description: 'Original cancelled cheque showing Account Holder Name, Bank Account Number & IFSC Code.', requiredFileTypes: 'PDF, JPG (Max 5MB)', status: 'APPROVED', fileName: 'HDFC_Cancelled_Cheque_9824.pdf', uploadedAt: '14 Jan 2025' }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wn_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands] = useState<Brand[]>(INITIAL_BRANDS);
  const [sizes] = useState<string[]>(INITIAL_SIZES);
  const [colors] = useState(INITIAL_COLORS);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('wn_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('wn_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>(() => {
    const saved = localStorage.getItem('wn_inv_tx');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('wn_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [settlements] = useState<Settlement[]>(INITIAL_SETTLEMENTS);
  const [walletTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [customers] = useState<CustomerSummary[]>(INITIAL_CUSTOMERS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [returns, setReturns] = useState<ReturnRequest[]>(INITIAL_RETURNS);
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>(INITIAL_EXCHANGES);
  const [refunds] = useState<RefundItem[]>(INITIAL_REFUNDS);
  const [offers, setOffers] = useState<StoreOffer[]>(INITIAL_OFFERS);
  const [reviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [kycDocuments, setKycDocuments] = useState<KycDocument[]>(INITIAL_KYC_DOCUMENTS);

  useEffect(() => {
    localStorage.setItem('wn_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wn_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('wn_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'salesCount' | 'rating'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      salesCount: 0,
      rating: 5.0
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Add to inventory
    const newInv: InventoryItem = {
      id: `inv_${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      sku: newProduct.sku,
      category: newProduct.category,
      brand: newProduct.brand,
      availableStock: newProduct.stock,
      reservedStock: 0,
      lowStockThreshold: newProduct.lowStockThreshold,
      status: newProduct.stock > newProduct.lowStockThreshold ? 'HEALTHY' : newProduct.stock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
      lastUpdated: 'Just now'
    };
    setInventory((prev) => [newInv, ...prev]);

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
    if (updates.stock !== undefined) {
      setInventory((prev) =>
        prev.map((inv) =>
          inv.productId === id
            ? {
                ...inv,
                availableStock: updates.stock!,
                status: updates.stock! > inv.lowStockThreshold ? 'HEALTHY' : updates.stock! > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
                lastUpdated: 'Just now'
              }
            : inv
        )
      );
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setInventory((prev) => prev.filter((inv) => inv.productId !== id));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, _notes?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newTimeline = [...ord.timeline];
          newTimeline.push({
            title: `Order marked as ${status.replace(/_/g, ' ')}`,
            timestamp: 'Just now',
            completed: true,
            current: true
          });
          return { ...ord, status, timeline: newTimeline };
        }
        return ord;
      })
    );
  };

  const acceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'ACCEPTED',
            captain: ord.captain || {
              id: 'capt_auto',
              name: 'Suresh More',
              phone: '+91 98204 55192',
              vehicleType: 'EV Bike',
              vehicleNumber: 'MH 02 DB 7712',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              rating: 4.9,
              etaMinutes: 14
            },
            timeline: [
              ...ord.timeline.map((t) => ({ ...t, current: false })),
              { title: 'Order Accepted & Assigned to Captain', description: 'Packing started by store staff', timestamp: 'Just now', completed: true, current: true }
            ]
          };
        }
        return ord;
      })
    );
  };

  const rejectOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'CANCELLED',
              timeline: [
                ...ord.timeline.map((t) => ({ ...t, current: false })),
                { title: 'Order Declined by Store', description: reason || 'Inventory discrepancy or capacity limit', timestamp: 'Just now', completed: true, current: true }
              ]
            }
          : ord
      )
    );
  };

  const updateStock = (productId: string, newStock: number, reason: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    const prevStock = targetProduct ? targetProduct.stock : 0;
    const diff = newStock - prevStock;

    updateProduct(productId, { stock: newStock });

    const newTx: InventoryTransaction = {
      id: `tx_${Date.now()}`,
      date: 'Just now',
      productName: targetProduct?.name || 'Product',
      sku: targetProduct?.sku || 'SKU',
      type: diff >= 0 ? 'STOCK_ADDED' : 'STOCK_DEDUCTED',
      quantityChange: diff,
      previousStock: prevStock,
      newStock: newStock,
      reason: reason || 'Manual stock update',
      performedBy: 'Store Staff'
    };
    setInventoryTransactions((prev) => [newTx, ...prev]);
  };

  const createInvoice = (orderId: string): Invoice => {
    const order = orders.find((o) => o.id === orderId);
    const invoiceNum = `INV-WN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: invoiceNum,
      orderId: order?.id || orderId,
      orderNumber: order?.orderNumber || '#WN-NEW',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      customerName: order?.customer.name || 'Store Customer',
      customerPhone: order?.customer.phone || '+91 98200 00000',
      customerAddress: order?.customer.address || 'Local Customer Address',
      storeName: 'Vogue Loom Studio',
      storeGst: '27AABCV1294K1Z8',
      items: order?.items.map((i) => ({
        name: i.productName,
        sku: i.sku,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        unitPrice: i.price,
        discount: i.discount,
        taxRate: 5,
        amount: i.total
      })) || [],
      subtotal: order?.subtotal || 2499,
      discount: order?.discountTotal || 0,
      taxAmount: order?.taxes || 125,
      deliveryFee: order?.deliveryCharge || 0,
      finalAmount: order?.totalAmount || 2624,
      paymentMethod: order?.paymentMethod === 'ONLINE_UPI' ? 'UPI' : order?.paymentMethod === 'ONLINE_CARD' ? 'Card' : 'Cash',
      paymentStatus: 'PAID'
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const addStaffMember = (member: Omit<StaffMember, 'id' | 'joinedDate'>) => {
    const newMember: StaffMember = {
      ...member,
      id: `st_${Date.now()}`,
      joinedDate: 'Just now'
    };
    setStaff((prev) => [newMember, ...prev]);
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const updateReturnStatus = (id: string, status: ReturnRequest['status']) => {
    setReturns((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const updateExchangeStatus = (id: string, status: ExchangeRequest['status']) => {
    setExchanges((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const addStoreOffer = (offer: Omit<StoreOffer, 'id' | 'usageCount'>) => {
    const newOffer: StoreOffer = {
      ...offer,
      id: `off_${Date.now()}`,
      usageCount: 0
    };
    setOffers((prev) => [newOffer, ...prev]);
  };

  const toggleOfferStatus = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: o.status === 'ACTIVE' ? 'EXPIRED' : 'ACTIVE' } : o))
    );
  };

  const addSupportTicket = (
    ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'> & { initialMessage: string }
  ) => {
    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      ticketNumber: `TKT-WN-${Math.floor(1000 + Math.random() * 9000)}`,
      category: ticket.category,
      subject: ticket.subject,
      status: 'OPEN',
      priority: ticket.priority,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      messages: [
        {
          id: `m_${Date.now()}`,
          sender: 'VENDOR',
          senderName: 'Vikramaditya (Store Owner)',
          text: ticket.initialMessage,
          timestamp: 'Just now'
        }
      ]
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
  };

  const replyToSupportTicket = (ticketId: string, message: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: 'Just now',
            messages: [
              ...t.messages,
              {
                id: `m_${Date.now()}`,
                sender: 'VENDOR',
                senderName: 'Vikramaditya (Store Owner)',
                text: message,
                timestamp: 'Just now'
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const uploadKycDoc = (id: string, fileName: string) => {
    setKycDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: 'UNDER_REVIEW',
              fileName: fileName,
              uploadedAt: 'Just now'
            }
          : doc
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        brands,
        sizes,
        colors,
        orders,
        inventory,
        inventoryTransactions,
        invoices,
        settlements,
        walletTransactions,
        walletBalance: { available: 48250, pending: 14920, totalEarnings: 384200 },
        customers,
        staff,
        notifications,
        returns,
        exchanges,
        refunds,
        offers,
        reviews,
        supportTickets,
        kycDocuments,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        acceptOrder,
        rejectOrder,
        updateStock,
        createInvoice,
        addStaffMember,
        updateStaffMember,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateReturnStatus,
        updateExchangeStatus,
        addStoreOffer,
        toggleOfferStatus,
        addSupportTicket,
        replyToSupportTicket,
        uploadKycDoc
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
