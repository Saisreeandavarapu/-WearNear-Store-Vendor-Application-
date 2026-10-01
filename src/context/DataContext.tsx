import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductVariant,
  Category,
  Brand,
  Order,
  OrderStatus,
  InventoryItem,
  InventoryTransaction,
  InventoryTransactionType,
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
  KycDocument,
  POSSaleData,
  ScannedBarcodeRecord,
  CatalogueExecutive,
  ExecutivePermissions,
  ExecutiveRequest,
  ExecutiveActivityItem,
  ExecutiveLoginHistory,
  ExecutiveProductActivity,
  BusinessProfile,
  PermissionPreset
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
  recentScans: ScannedBarcodeRecord[];

  // Catalogue Executives & Business
  catalogueExecutives: CatalogueExecutive[];
  executiveRequests: ExecutiveRequest[];
  executiveActivities: ExecutiveActivityItem[];
  executiveLoginHistories: ExecutiveLoginHistory[];
  executiveProductActivities: ExecutiveProductActivity[];
  businessProfile: BusinessProfile;
  maxActiveExecutivesLimit: number;

  // Action methods
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'salesCount' | 'rating'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string, reason?: string) => void;
  updateStock: (productId: string, newStock: number, reason: string, variantId?: string) => void;
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

  // Catalogue Executive Actions
  addCatalogueExecutive: (exec: { name: string; phone: string; email: string; preset: PermissionPreset; role?: CatalogueExecutive['role'] }) => CatalogueExecutive;
  updateCatalogueExecutive: (id: string, updates: Partial<CatalogueExecutive>) => void;
  updateExecutivePermissions: (id: string, permissions: ExecutivePermissions, preset?: PermissionPreset) => void;
  toggleExecutiveStatus: (id: string) => void;
  requestAdditionalExecutives: (requestedAdditionalCount: number, reason: string) => ExecutiveRequest;
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => void;

  // Product Approval & Publishing Workflow Actions
  submitProductForApproval: (productId: string, submitterName?: string) => void;
  approveProductByStore: (productId: string, approverName?: string) => { success: boolean; isLive: boolean; error?: string };
  requestProductChangesByStore: (productId: string, requestedChanges: string[], comment: string, reviewerName?: string) => void;
  rejectProductByStore: (productId: string, reason: string, reviewerName?: string) => void;
  pauseProductByStore: (productId: string, reason?: string) => void;
  unpauseProductByStore: (productId: string) => void;
  resubmitProductForApproval: (productId: string) => void;

  // Barcode & POS Actions
  processPOSSale: (bill: POSSaleData) => { success: boolean; invoice?: Invoice; order?: Order; error?: string };
  processBarcodeReturn: (returnData: {
    orderNumber: string;
    customerName: string;
    productName: string;
    sku: string;
    barcode: string;
    productId: string;
    variantId?: string;
    quantity: number;
    reason: ReturnRequest['reason'];
    reasonText: string;
    amount: number;
    operatorName?: string;
  }) => boolean;
  processBarcodeExchange: (exchangeData: {
    orderNumber: string;
    customerName: string;
    returnedBarcode: string;
    replacementBarcode: string;
    operatorName?: string;
  }) => { success: boolean; error?: string };
  performManualStockAdjustment: (params: {
    productId: string;
    variantId?: string;
    change: number;
    type: InventoryTransactionType;
    reason: string;
    operatorName?: string;
  }) => { success: boolean; error?: string };
  addRecentScan: (scan: ScannedBarcodeRecord) => void;
  clearRecentScans: () => void;
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
    barcode: '8901234567012',
    barcodeFormat: 'EAN-13',
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
      { id: 'v1', sku: 'VL-MSK-01-BLU-S', barcode: '8901234567012', barcodeFormat: 'EAN-13', size: 'S', color: 'Navy Imperial', colorHex: '#1E3A8A', price: 3299, stock: 6, availableStock: 6, reservedStock: 0 },
      { id: 'v2', sku: 'VL-MSK-01-BLU-M', barcode: '8901234567029', barcodeFormat: 'EAN-13', size: 'M', color: 'Navy Imperial', colorHex: '#1E3A8A', price: 3299, stock: 8, availableStock: 7, reservedStock: 1 },
      { id: 'v3', sku: 'VL-MSK-01-BLU-L', barcode: '8901234567036', barcodeFormat: 'EAN-13', size: 'L', color: 'Navy Imperial', colorHex: '#1E3A8A', price: 3299, stock: 5, availableStock: 5, reservedStock: 0 },
      { id: 'v4', sku: 'VL-MSK-01-BLU-XL', barcode: '8901234567043', barcodeFormat: 'EAN-13', size: 'XL', color: 'Navy Imperial', colorHex: '#1E3A8A', price: 3299, stock: 5, availableStock: 5, reservedStock: 0 }
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
    barcode: '8901234567050',
    barcodeFormat: 'EAN-13',
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
      { id: 'v5', sku: 'RS-DNM-08-30', barcode: '8901234567050', barcodeFormat: 'EAN-13', size: '30', color: 'Indigo Deep', colorHex: '#1e3a8a', price: 2899, stock: 2, availableStock: 2, reservedStock: 0 },
      { id: 'v6', sku: 'RS-DNM-08-32', barcode: '8901234567067', barcodeFormat: 'EAN-13', size: '32', color: 'Indigo Deep', colorHex: '#1e3a8a', price: 2899, stock: 3, availableStock: 1, reservedStock: 2 },
      { id: 'v7', sku: 'RS-DNM-08-34', barcode: '8901234567074', barcodeFormat: 'EAN-13', size: '34', color: 'Indigo Deep', colorHex: '#1e3a8a', price: 2899, stock: 2, availableStock: 2, reservedStock: 0 },
      { id: 'v8', sku: 'RS-DNM-08-36', barcode: '8901234567081', barcodeFormat: 'EAN-13', size: '36', color: 'Indigo Deep', colorHex: '#1e3a8a', price: 2899, stock: 1, availableStock: 1, reservedStock: 0 }
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
    barcode: '8901234567098',
    barcodeFormat: 'EAN-13',
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
    variants: [
      { id: 'v9', sku: 'US-LNN-22-M', barcode: '8901234567104', barcodeFormat: 'EAN-13', size: 'M', color: 'Sage Olive', colorHex: '#3F6212', price: 1799, stock: 12, availableStock: 11, reservedStock: 1 },
      { id: 'v10', sku: 'US-LNN-22-L', barcode: '8901234567111', barcodeFormat: 'EAN-13', size: 'L', color: 'Sage Olive', colorHex: '#3F6212', price: 1799, stock: 15, availableStock: 13, reservedStock: 2 },
      { id: 'v11', sku: 'US-LNN-22-XL', barcode: '8901234567128', barcodeFormat: 'EAN-13', size: 'XL', color: 'Sage Olive', colorHex: '#3F6212', price: 1799, stock: 8, availableStock: 8, reservedStock: 0 }
    ],
    createdAt: '2026-09-15',
    updatedAt: '2026-09-24',
    salesCount: 165,
    rating: 4.7
  },
  {
    id: 'prod_104',
    name: 'Handcrafted Heritage Kolhapuri Mules',
    sku: 'AK-KHL-04',
    barcode: '8901234567135',
    barcodeFormat: 'EAN-13',
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
    variants: [
      { id: 'v12', sku: 'AK-KHL-04-7', barcode: '8901234567142', barcodeFormat: 'EAN-13', size: '7', color: 'Warm Ochre', colorHex: '#D97706', price: 2199, stock: 1, availableStock: 1, reservedStock: 0 },
      { id: 'v13', sku: 'AK-KHL-04-8', barcode: '8901234567159', barcodeFormat: 'EAN-13', size: '8', color: 'Warm Ochre', colorHex: '#D97706', price: 2199, stock: 1, availableStock: 1, reservedStock: 0 },
      { id: 'v14', sku: 'AK-KHL-04-9', barcode: '8901234567166', barcodeFormat: 'EAN-13', size: '9', color: 'Warm Ochre', colorHex: '#D97706', price: 2199, stock: 1, availableStock: 1, reservedStock: 0 },
      { id: 'v14b', sku: 'AK-KHL-04-10', barcode: '8901234567173', barcodeFormat: 'EAN-13', size: '10', color: 'Warm Ochre', colorHex: '#D97706', price: 2199, stock: 0, availableStock: 0, reservedStock: 0 }
    ],
    createdAt: '2026-09-18',
    updatedAt: '2026-09-27',
    salesCount: 64,
    rating: 4.95
  },
  {
    id: 'prod_105',
    name: 'Chanderi Zari Embroidered Anarkali Set',
    sku: 'IW-CHN-90',
    barcode: '8901234567180',
    barcodeFormat: 'EAN-13',
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
    variants: [
      { id: 'v15', sku: 'IW-CHN-90-S', barcode: '8901234567197', barcodeFormat: 'EAN-13', size: 'S', color: 'Crimson Rust', colorHex: '#991B1B', price: 5499, stock: 0, availableStock: 0, reservedStock: 0 },
      { id: 'v16', sku: 'IW-CHN-90-M', barcode: '8901234567203', barcodeFormat: 'EAN-13', size: 'M', color: 'Crimson Rust', colorHex: '#991B1B', price: 5499, stock: 0, availableStock: 0, reservedStock: 0 }
    ],
    createdAt: '2026-09-05',
    updatedAt: '2026-09-27',
    salesCount: 92,
    rating: 4.88
  },
  {
    id: 'prod_106',
    name: 'Nike Oversized Heavyweight Cotton T-Shirt',
    sku: 'NK-OVS-TS-BLK',
    barcode: '8901234567990',
    barcodeFormat: 'EAN-13',
    category: "Men's Shirts & Kurtas",
    categoryId: 'cat_1',
    brand: 'Urban Stitch Co',
    brandId: 'br_3',
    description: 'Heavyweight 240 GSM combed cotton oversized drop-shoulder graphic t-shirt. Breathable finish.',
    mrp: 2199,
    sellingPrice: 1599,
    discountPercent: 27,
    stock: 53,
    lowStockThreshold: 10,
    status: 'UNDER_REVIEW',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Black', hex: '#111827' },
      { name: 'Pearl Ivory', hex: '#F9FAFB' }
    ],
    variants: [
      { id: 'v20', sku: 'NK-OVS-TS-BLK-S', barcode: '8901234567990', barcodeFormat: 'EAN-13', size: 'S', color: 'Midnight Black', colorHex: '#111827', price: 1599, stock: 10, availableStock: 10, reservedStock: 0 },
      { id: 'v21', sku: 'NK-OVS-TS-BLK-M', barcode: '8901234567991', barcodeFormat: 'EAN-13', size: 'M', color: 'Midnight Black', colorHex: '#111827', price: 1599, stock: 15, availableStock: 15, reservedStock: 0 },
      { id: 'v22', sku: 'NK-OVS-TS-BLK-L', barcode: '8901234567992', barcodeFormat: 'EAN-13', size: 'L', color: 'Midnight Black', colorHex: '#111827', price: 1599, stock: 20, availableStock: 20, reservedStock: 0 },
      { id: 'v23', sku: 'NK-OVS-TS-BLK-XL', barcode: '8901234567993', barcodeFormat: 'EAN-13', size: 'XL', color: 'Midnight Black', colorHex: '#111827', price: 1599, stock: 8, availableStock: 8, reservedStock: 0 }
    ],
    createdAt: 'Today, 02:15 PM',
    updatedAt: 'Today, 03:20 PM',
    salesCount: 0,
    rating: 0,
    submittedBy: {
      id: 'ce_2',
      name: 'Neha Gupta',
      role: 'Catalogue Executive',
      timestamp: 'Today, 03:20 PM'
    },
    auditTrail: [
      { id: 'aud_1', action: 'PRODUCT_CREATED', performedBy: 'Neha Gupta', role: 'Catalogue Executive', timestamp: 'Today, 02:15 PM' },
      { id: 'aud_2', action: 'VARIANT_CREATED', performedBy: 'Neha Gupta', role: 'Catalogue Executive', timestamp: 'Today, 02:25 PM', notes: '4 SKU variants created' },
      { id: 'aud_3', action: 'BARCODE_ASSIGNED', performedBy: 'Neha Gupta', role: 'Catalogue Executive', timestamp: 'Today, 02:40 PM', notes: 'Mapped EAN-13 barcodes' },
      { id: 'aud_4', action: 'STOCK_ADDED', performedBy: 'Neha Gupta', role: 'Catalogue Executive', timestamp: 'Today, 03:00 PM', notes: '+53 units in-warded' },
      { id: 'aud_5', action: 'SUBMITTED_FOR_APPROVAL', performedBy: 'Neha Gupta', role: 'Catalogue Executive', timestamp: 'Today, 03:20 PM', notes: 'Awaiting Store Owner review' }
    ]
  },
  {
    id: 'prod_107',
    name: 'Handwoven Banarasi Brocade Zari Dupatta',
    sku: 'IW-BND-12',
    barcode: '8901234568010',
    barcodeFormat: 'EAN-13',
    category: "Women's Ethnic & Sarees",
    categoryId: 'cat_2',
    brand: 'IndiWeave Crafts',
    brandId: 'br_2',
    description: 'Pure Katan silk dupatta featuring traditional kadwa weave gold Zari motifs.',
    mrp: 3499,
    sellingPrice: 2499,
    discountPercent: 28,
    stock: 12,
    lowStockThreshold: 4,
    status: 'CHANGES_REQUESTED',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['Free Size'],
    colors: [{ name: 'Crimson Rust', hex: '#991B1B' }],
    variants: [
      { id: 'v24', sku: 'IW-BND-12-FS', barcode: '8901234568010', barcodeFormat: 'EAN-13', size: 'Free Size', color: 'Crimson Rust', colorHex: '#991B1B', price: 2499, stock: 12, availableStock: 12, reservedStock: 0 }
    ],
    createdAt: 'Yesterday, 10:00 AM',
    updatedAt: 'Today, 11:00 AM',
    salesCount: 0,
    rating: 0,
    submittedBy: { id: 'ce_3', name: 'Siddharth Rao', role: 'Catalogue Executive', timestamp: 'Yesterday, 11:30 AM' },
    reviewedBy: { id: 'usr_owner_01', name: 'Vikramaditya (Store Owner)', role: 'STORE_OWNER', timestamp: 'Today, 11:00 AM' },
    reviewComment: 'Please replace main product image with high-definition lighting photo showing border details.',
    requestedChanges: ['Product Image', 'Product Description'],
    auditTrail: [
      { id: 'aud_10', action: 'PRODUCT_CREATED', performedBy: 'Siddharth Rao', role: 'Catalogue Executive', timestamp: 'Yesterday, 10:00 AM' },
      { id: 'aud_11', action: 'SUBMITTED_FOR_APPROVAL', performedBy: 'Siddharth Rao', role: 'Catalogue Executive', timestamp: 'Yesterday, 11:30 AM' },
      { id: 'aud_12', action: 'CHANGES_REQUESTED', performedBy: 'Vikramaditya', role: 'STORE_OWNER', timestamp: 'Today, 11:00 AM', notes: 'Replace image & update description' }
    ]
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
  { id: 'tx_1', date: 'Today, 04:30 PM', time: '04:30 PM', productName: 'Pure Mulberry Silk Festive Kurta Set', sku: 'VL-MSK-01-BLU-M', variantInfo: 'Navy Imperial · Size M', barcode: '8901234567028', type: 'RESERVED', quantityChange: -1, previousStock: 25, newStock: 24, reason: 'Online Order #WN-8821 allocated', reference: '#WN-8821', performedBy: 'System Auto' },
  { id: 'tx_2', date: 'Today, 02:15 PM', time: '02:15 PM', productName: 'French Linen Button-Down Resort Shirt', sku: 'US-LNN-22-L', variantInfo: 'Sage Olive · Size L', barcode: '8901234567110', type: 'STOCK_ADDED', quantityChange: 20, previousStock: 15, newStock: 35, reason: 'Vendor Shipment Inward Batch #441', reference: 'BATCH-441', performedBy: 'Vikramaditya (Owner)' },
  { id: 'tx_3', date: 'Yesterday, 06:40 PM', time: '06:40 PM', productName: 'Relaxed Fit 14oz Japanese Selvedge Denim', sku: 'RS-DNM-08-32', variantInfo: 'Indigo Deep · Size 32', barcode: '8901234567066', type: 'SOLD', quantityChange: -2, previousStock: 10, newStock: 8, reason: 'Store Counter Sale POS', reference: 'INV-WN-2026-0410', performedBy: 'Pooja (Manager)' },
  { id: 'tx_4', date: '25 Sep 2026', time: '11:15 AM', productName: 'Chanderi Zari Embroidered Anarkali Set', sku: 'IW-CHN-90-M', variantInfo: 'Crimson Rust · Size M', barcode: '8901234567202', type: 'STOCK_DEDUCTED', quantityChange: -4, previousStock: 4, newStock: 0, reason: 'Flash Festival Sale Deliveries', reference: '#WN-8760', performedBy: 'System Auto' }
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
    permissions: ['PRODUCT_READ', 'PRODUCT_CREATE', 'PRODUCT_UPDATE', 'INVENTORY_READ', 'INVENTORY_UPDATE', 'ORDER_READ', 'ORDER_UPDATE', 'BILL_CREATE', 'FINANCE_VIEW', 'SETTINGS_MANAGE'],
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
    customerPhone: '+91 98201 33412',
    productName: 'French Linen Button-Down Resort Shirt',
    size: 'M',
    color: 'Sage Olive',
    reason: 'SIZE_FIT',
    reasonText: 'Sleeves are slightly tight across forearm; need size L.',
    status: 'NEW',
    requestDate: 'Today, 11:20 AM',
    amount: 1799
  }
];

const INITIAL_EXCHANGES: ExchangeRequest[] = [
  {
    id: 'exc_1',
    orderNumber: '#WN-8790',
    customerName: 'Kunal Kapoor',
    originalProduct: 'Pure Mulberry Silk Festive Kurta Set',
    currentSize: 'M',
    requestedSize: 'L',
    stockAvailable: true,
    status: 'PENDING',
    date: 'Today, 01:10 PM'
  }
];

const INITIAL_REFUNDS: RefundItem[] = [
  {
    id: 'ref_1',
    orderNumber: '#WN-8761',
    customerName: 'Sneha Patel',
    amount: 2899,
    method: 'UPI Refund',
    reason: 'Customer cancelled prior to dispatch',
    status: 'REFUNDED',
    date: '26 Sep 2026'
  }
];

const INITIAL_OFFERS: StoreOffer[] = [
  {
    id: 'off_1',
    title: 'Festive Preview 15% OFF',
    type: 'STORE_OFFER',
    discountType: 'PERCENT',
    discountValue: 15,
    minOrderAmount: 2999,
    startDate: '20 Sep 2026',
    endDate: '05 Oct 2026',
    status: 'ACTIVE',
    usageCount: 42
  }
];

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev_1',
    customerName: 'Aditya Deshmukh',
    rating: 5,
    title: 'Superb Silk Kurta & Rapid Delivery',
    comment: 'The Mulberry silk fabric is pristine. Arrived packaged impeccably in under 30 minutes!',
    date: 'Today',
    productName: 'Pure Mulberry Silk Festive Kurta Set',
    type: 'PRODUCT',
    verifiedPurchase: true
  }
];

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_1',
    ticketNumber: 'TKT-WN-8812',
    category: 'Inventory',
    subject: 'Requesting SKU barcode batch sync with POS',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: 'Yesterday, 04:15 PM',
    updatedAt: 'Today, 10:00 AM',
    messages: [
      {
        id: 'msg_1',
        sender: 'VENDOR',
        senderName: 'Vikramaditya (Store Owner)',
        text: 'Hello team, we are tagging our autumn collection with EAN-13 barcodes. How do we ensure immediate POS recognition?',
        timestamp: 'Yesterday, 04:15 PM'
      },
      {
        id: 'msg_2',
        sender: 'SUPPORT_AGENT',
        senderName: 'Sanjay (WearNear Retail Support)',
        text: 'Hi Vikramaditya! You can now use the WearNear Barcode Scanner and POS Terminal directly. All variant barcodes map in real-time!',
        timestamp: 'Today, 10:00 AM'
      }
    ]
  }
];

const INITIAL_KYC: KycDocument[] = [
  { id: 'kyc_1', type: 'IDENTITY', title: 'Aadhaar Card / Passport', description: 'Government issued photo ID of store proprietor', requiredFileTypes: 'PDF, JPG, PNG', status: 'APPROVED', fileName: 'vikramaditya_aadhaar_front_back.pdf', uploadedAt: '12 Jan 2025' },
  { id: 'kyc_2', type: 'BUSINESS', title: 'GST Registration Certificate', description: 'Form GST REG-06 showing registered business address', requiredFileTypes: 'PDF', status: 'APPROVED', fileName: 'gst_certificate_27AABCV1294K1Z8.pdf', uploadedAt: '12 Jan 2025' },
  { id: 'kyc_3', type: 'STORE', title: 'Store Front Photo & Signage', description: 'Clear photograph displaying storefront board and interior shelves', requiredFileTypes: 'JPG, PNG', status: 'APPROVED', fileName: 'vogue_loom_linking_road_facade.jpg', uploadedAt: '14 Jan 2025' },
  { id: 'kyc_4', type: 'BANK', title: 'Cancelled Cheque / Bank Statement', description: 'Bank proof showing account number, IFSC code, and account holder name', requiredFileTypes: 'PDF, JPG', status: 'APPROVED', fileName: 'hdfc_bank_cancelled_cheque_9824.pdf', uploadedAt: '15 Jan 2025' }
];

const STANDARD_PERMISSIONS: ExecutivePermissions = {
  product: { view: true, create: true, update: true, delete: false, variants: true, images: true },
  bulk: { bulkImport: true, bulkUpdate: true, bulkExport: true, bulkPriceUpdate: false, bulkStockUpdate: true, bulkBarcodeAssignment: true },
  inventory: { view: true, add: true, update: true, adjust: false, transactions: true, bulkInventory: false },
  orders: { view: true, process: true, picking: true, productVerification: true, quantityVerification: true, packing: true, evidence: true, package: true, handover: true },
  barcode: { view: true, generate: true, assign: true, scan: true, print: true, bulkBarcode: true }
};

const SENIOR_PERMISSIONS: ExecutivePermissions = {
  product: { view: true, create: true, update: true, delete: true, variants: true, images: true },
  bulk: { bulkImport: true, bulkUpdate: true, bulkExport: true, bulkPriceUpdate: true, bulkStockUpdate: true, bulkBarcodeAssignment: true },
  inventory: { view: true, add: true, update: true, adjust: true, transactions: true, bulkInventory: true },
  orders: { view: true, process: true, picking: true, productVerification: true, quantityVerification: true, packing: true, evidence: true, package: true, handover: true },
  barcode: { view: true, generate: true, assign: true, scan: true, print: true, bulkBarcode: true }
};

const INITIAL_CATALOGUE_EXECUTIVES: CatalogueExecutive[] = [
  {
    id: 'ce_1',
    employeeId: 'CE-2026-001',
    name: 'Arjun Verma',
    phone: '+91 98201 44512',
    email: 'arjun.v@vogueloom.com',
    storeId: 'store_01',
    role: 'Fulfilment Lead',
    status: 'ACTIVE',
    joinedDate: '10 Jan 2026',
    lastLogin: 'Today, 09:15 AM',
    currentSession: { device: 'MacBook Pro 16', ip: '103.21.124.8', loginTime: '09:15 AM' },
    preset: 'SENIOR',
    permissions: SENIOR_PERMISSIONS,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'ce_2',
    employeeId: 'CE-2026-002',
    name: 'Neha Gupta',
    phone: '+91 98192 88301',
    email: 'neha.g@vogueloom.com',
    storeId: 'store_01',
    role: 'Catalogue Executive',
    status: 'ACTIVE',
    joinedDate: '18 Feb 2026',
    lastLogin: 'Today, 11:30 AM',
    currentSession: { device: 'iPad Pro 11', ip: '103.21.124.9', loginTime: '11:30 AM' },
    preset: 'STANDARD',
    permissions: STANDARD_PERMISSIONS,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'ce_3',
    employeeId: 'CE-2026-003',
    name: 'Siddharth Rao',
    phone: '+91 98331 55204',
    email: 'siddharth.r@vogueloom.com',
    storeId: 'store_01',
    role: 'Catalogue Executive',
    status: 'ACTIVE',
    joinedDate: '05 Mar 2026',
    lastLogin: 'Yesterday, 06:45 PM',
    preset: 'STANDARD',
    permissions: STANDARD_PERMISSIONS,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
  }
];

const INITIAL_EXECUTIVE_REQUESTS: ExecutiveRequest[] = [
  {
    id: 'req_1',
    currentCount: 3,
    requestedAdditionalCount: 2,
    reason: 'Expanding store catalogue with Autumn/Winter festive line. Need 2 additional executives for rapid inventory tagging.',
    requestedBy: 'Vikramaditya (Store Owner)',
    date: 'Today, 10:00 AM',
    status: 'PENDING'
  }
];

const INITIAL_EXECUTIVE_ACTIVITIES: ExecutiveActivityItem[] = [
  { id: 'act_1', executiveId: 'ce_1', executiveName: 'Arjun Verma', action: 'ORDER_PICKING', details: 'Picked 1 unit Pure Mulberry Silk Festive Kurta Set for Order #WN-8821', timestamp: '15 mins ago', referenceId: 'ord_9901' },
  { id: 'act_2', executiveId: 'ce_2', executiveName: 'Neha Gupta', action: 'BARCODE_ASSIGNED', details: 'Generated & assigned EAN-13 barcode 8901234567029 to VL-MSK-01-BLU-M', timestamp: '1 hour ago', referenceId: 'prod_101' },
  { id: 'act_3', executiveId: 'ce_2', executiveName: 'Neha Gupta', action: 'INVENTORY_UPDATED', details: 'Updated stock for French Linen Resort Shirt from 15 to 35', timestamp: '2 hours ago', referenceId: 'prod_103' },
  { id: 'act_4', executiveId: 'ce_3', executiveName: 'Siddharth Rao', action: 'PACKING', details: 'Completed verification & evidence photo for Order #WN-8802', timestamp: '3 hours ago', referenceId: 'ord_9904' },
  { id: 'act_5', executiveId: 'ce_1', executiveName: 'Arjun Verma', action: 'LOGIN', details: 'Authenticated session from MacBook Pro (IP: 103.21.124.8)', timestamp: 'Today, 09:15 AM' }
];

const INITIAL_EXECUTIVE_LOGIN_HISTORIES: ExecutiveLoginHistory[] = [
  { id: 'lh_1', executiveId: 'ce_1', date: 'Today', time: '09:15 AM', device: 'MacBook Pro 16', browser: 'Chrome 128', ip: '103.21.124.8', status: 'SUCCESS', sessionDuration: '5h 30m active' },
  { id: 'lh_2', executiveId: 'ce_2', date: 'Today', time: '11:30 AM', device: 'iPad Pro 11', browser: 'Safari Mobile', ip: '103.21.124.9', status: 'SUCCESS', sessionDuration: '3h 15m active' },
  { id: 'lh_3', executiveId: 'ce_3', date: 'Yesterday', time: '06:45 PM', device: 'Windows PC', browser: 'Edge 126', ip: '103.21.124.12', status: 'SUCCESS', sessionDuration: '4h 10m' }
];

const INITIAL_EXECUTIVE_PRODUCT_ACTIVITIES: ExecutiveProductActivity[] = [
  { id: 'pa_1', executiveId: 'ce_1', date: 'Today', productsViewed: 42, productsCreated: 3, productsUpdated: 8, variantsUpdated: 14, barcodesGenerated: 18, bulkOperations: 2 },
  { id: 'pa_2', executiveId: 'ce_2', date: 'Today', productsViewed: 35, productsCreated: 2, productsUpdated: 12, variantsUpdated: 20, barcodesGenerated: 25, bulkOperations: 1 },
  { id: 'pa_3', executiveId: 'ce_3', date: 'Yesterday', productsViewed: 28, productsCreated: 0, productsUpdated: 5, variantsUpdated: 9, barcodesGenerated: 12, bulkOperations: 0 }
];

const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  id: 'biz_01',
  legalName: 'Vogue Loom Retail Private Limited',
  tradeName: 'Vogue Loom Studio',
  businessType: 'Pvt Ltd',
  gstin: '27AABCV1294K1Z8',
  panNumber: 'AABCV1294K',
  registeredAddress: {
    street: '14-B Linking Road, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050'
  },
  bankDetails: {
    accountNumber: '50200049281924',
    ifscCode: 'HDFC0000084',
    bankName: 'HDFC Bank',
    branch: 'Bandra West Main Branch',
    accountHolder: 'Vogue Loom Retail Pvt Ltd'
  },
  kycStatus: 'APPROVED',
  taxRegistrationDate: '12 Jan 2024',
  authorizedSignatory: 'Vikramaditya Sharma',
  contactEmail: 'vikram@vogueloom.com',
  contactPhone: '+91 98200 12345'
};

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
    const saved = localStorage.getItem('wn_inventory_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('wn_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [settlements] = useState<Settlement[]>(INITIAL_SETTLEMENTS);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [customers, setCustomers] = useState<CustomerSummary[]>(INITIAL_CUSTOMERS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [returns, setReturns] = useState<ReturnRequest[]>(INITIAL_RETURNS);
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>(INITIAL_EXCHANGES);
  const [refunds, setRefunds] = useState<RefundItem[]>(INITIAL_REFUNDS);
  const [offers, setOffers] = useState<StoreOffer[]>(INITIAL_OFFERS);
  const [reviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [kycDocuments, setKycDocuments] = useState<KycDocument[]>(INITIAL_KYC);

  // Catalogue Executives state & Business Profile
  const [catalogueExecutives, setCatalogueExecutives] = useState<CatalogueExecutive[]>(() => {
    const saved = localStorage.getItem('wn_catalogue_executives');
    return saved ? JSON.parse(saved) : INITIAL_CATALOGUE_EXECUTIVES;
  });

  const [executiveRequests, setExecutiveRequests] = useState<ExecutiveRequest[]>(() => {
    const saved = localStorage.getItem('wn_executive_requests');
    return saved ? JSON.parse(saved) : INITIAL_EXECUTIVE_REQUESTS;
  });

  const [executiveActivities, setExecutiveActivities] = useState<ExecutiveActivityItem[]>(() => {
    const saved = localStorage.getItem('wn_executive_activities');
    return saved ? JSON.parse(saved) : INITIAL_EXECUTIVE_ACTIVITIES;
  });

  const [executiveLoginHistories] = useState<ExecutiveLoginHistory[]>(INITIAL_EXECUTIVE_LOGIN_HISTORIES);
  const [executiveProductActivities] = useState<ExecutiveProductActivity[]>(INITIAL_EXECUTIVE_PRODUCT_ACTIVITIES);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(INITIAL_BUSINESS_PROFILE);
  const [maxActiveExecutivesLimit] = useState<number>(3);

  // Recent scanned barcodes in current session
  const [recentScans, setRecentScans] = useState<ScannedBarcodeRecord[]>(() => {
    const saved = sessionStorage.getItem('wn_recent_scans');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wn_catalogue_executives', JSON.stringify(catalogueExecutives));
  }, [catalogueExecutives]);

  useEffect(() => {
    localStorage.setItem('wn_executive_requests', JSON.stringify(executiveRequests));
  }, [executiveRequests]);

  useEffect(() => {
    localStorage.setItem('wn_executive_activities', JSON.stringify(executiveActivities));
  }, [executiveActivities]);

  // Sync state to storage
  useEffect(() => {
    localStorage.setItem('wn_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wn_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('wn_inventory_transactions', JSON.stringify(inventoryTransactions));
  }, [inventoryTransactions]);

  useEffect(() => {
    localStorage.setItem('wn_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('wn_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    sessionStorage.setItem('wn_recent_scans', JSON.stringify(recentScans));
  }, [recentScans]);

  const addRecentScan = (scan: ScannedBarcodeRecord) => {
    setRecentScans((prev) => [scan, ...prev.filter((s) => s.barcode !== scan.barcode)].slice(0, 20));
  };

  const clearRecentScans = () => {
    setRecentScans([]);
    sessionStorage.removeItem('wn_recent_scans');
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'salesCount' | 'rating'>): Product => {
    const now = new Date().toISOString().split('T')[0];
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      salesCount: 0,
      rating: 5.0
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Also add an inventory item record
    const newInv: InventoryItem = {
      id: `inv_${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      sku: newProduct.sku,
      category: newProduct.category,
      brand: newProduct.brand,
      availableStock: newProduct.stock,
      reservedStock: 0,
      lowStockThreshold: newProduct.lowStockThreshold || 5,
      status: newProduct.stock === 0 ? 'OUT_OF_STOCK' : newProduct.stock <= (newProduct.lowStockThreshold || 5) ? 'LOW_STOCK' : 'HEALTHY',
      lastUpdated: 'Just now'
    };
    setInventory((prev) => [newInv, ...prev]);

    // Transaction for initial stock creation
    if (newProduct.stock > 0) {
      const tx: InventoryTransaction = {
        id: `tx_${Date.now()}`,
        date: 'Today, Just now',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        productName: newProduct.name,
        productId: newProduct.id,
        sku: newProduct.sku,
        barcode: newProduct.barcode,
        type: 'STOCK_ADDED',
        quantityChange: newProduct.stock,
        previousStock: 0,
        newStock: newProduct.stock,
        reason: 'Initial Product Stock Inward',
        reference: `PROD-${newProduct.id.slice(-6)}`,
        performedBy: 'Store Staff'
      };
      setInventoryTransactions((prev) => [tx, ...prev]);
    }

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
          // If total stock changed, also update inventory item
          if (updates.stock !== undefined) {
            setInventory((invList) =>
              invList.map((item) =>
                item.productId === id
                  ? {
                      ...item,
                      availableStock: updates.stock!,
                      status: updates.stock === 0 ? 'OUT_OF_STOCK' : updates.stock! <= item.lowStockThreshold ? 'LOW_STOCK' : 'HEALTHY',
                      lastUpdated: 'Just now'
                    }
                  : item
              )
            );
          }
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setInventory((prev) => prev.filter((i) => i.productId !== id));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = [
            ...ord.timeline.map((t) => ({ ...t, current: false })),
            {
              title: `Status: ${status.replace(/_/g, ' ')}`,
              description: notes || `Order progressed to ${status.replace(/_/g, ' ')}`,
              timestamp: 'Just now',
              completed: true,
              current: true
            }
          ];
          return { ...ord, status, timeline: updatedTimeline };
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
            captain: {
              id: 'capt_auto',
              name: 'Sameer Sheikh',
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

  const updateStock = (productId: string, newStock: number, reason: string, variantId?: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const prevStock = targetProduct.stock;
    const diff = newStock - prevStock;

    // Update variant if specified
    if (variantId && targetProduct.variants) {
      const updatedVariants = targetProduct.variants.map((v) =>
        v.id === variantId ? { ...v, stock: Math.max(0, newStock), availableStock: Math.max(0, newStock) } : v
      );
      const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
      updateProduct(productId, { stock: totalStock, variants: updatedVariants });
    } else {
      updateProduct(productId, { stock: Math.max(0, newStock) });
    }

    const newTx: InventoryTransaction = {
      id: `tx_${Date.now()}`,
      date: 'Today, Just now',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      productName: targetProduct.name,
      productId: targetProduct.id,
      variantId: variantId,
      sku: targetProduct.sku,
      barcode: targetProduct.barcode,
      type: diff >= 0 ? 'STOCK_ADDED' : 'STOCK_DEDUCTED',
      quantityChange: diff,
      previousStock: prevStock,
      newStock: newStock,
      reason: reason || 'Manual stock update',
      reference: 'MANUAL-ADJ',
      performedBy: 'Store Staff'
    };
    setInventoryTransactions((prev) => [newTx, ...prev]);
  };

  const performManualStockAdjustment = (params: {
    productId: string;
    variantId?: string;
    change: number;
    type: InventoryTransactionType;
    reason: string;
    operatorName?: string;
  }): { success: boolean; error?: string } => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) return { success: false, error: 'Product not found.' };

    let prevStock = product.stock;
    let newStock = prevStock + params.change;

    if (newStock < 0) {
      return { success: false, error: `Stock cannot become negative. Maximum deduction possible is ${prevStock}.` };
    }

    let variantInfo = '';
    let variantSku = product.sku;
    let barcode = product.barcode;

    if (params.variantId && product.variants) {
      const v = product.variants.find((item) => item.id === params.variantId);
      if (v) {
        const vPrev = v.stock;
        const vNew = Math.max(0, vPrev + params.change);
        if (vNew < 0) {
          return { success: false, error: `Variant stock cannot become negative. Available: ${vPrev}.` };
        }
        variantInfo = `${v.color} · Size ${v.size}`;
        variantSku = v.sku;
        barcode = v.barcode || product.barcode;

        const updatedVariants = product.variants.map((item) =>
          item.id === params.variantId ? { ...item, stock: vNew, availableStock: vNew } : item
        );
        const total = updatedVariants.reduce((s, item) => s + item.stock, 0);
        updateProduct(product.id, { stock: total, variants: updatedVariants });
        prevStock = vPrev;
        newStock = vNew;
      }
    } else {
      updateProduct(product.id, { stock: newStock });
    }

    const tx: InventoryTransaction = {
      id: `tx_${Date.now()}`,
      date: 'Today, Just now',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      productName: product.name,
      productId: product.id,
      variantId: params.variantId,
      variantInfo: variantInfo || undefined,
      sku: variantSku,
      barcode: barcode,
      type: params.type,
      quantityChange: params.change,
      previousStock: prevStock,
      newStock: newStock,
      reason: params.reason,
      reference: `ADJ-${Date.now().toString().slice(-6)}`,
      performedBy: params.operatorName || 'Store Staff'
    };

    setInventoryTransactions((prev) => [tx, ...prev]);

    // Check low stock
    if (newStock <= product.lowStockThreshold && newStock > 0) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          type: 'LOW_STOCK',
          title: `Low Stock Alert: ${product.name}`,
          message: `Stock level dipped to ${newStock} units. Restock suggested soon.`,
          timestamp: 'Just now',
          isRead: false,
          actionUrl: '/vendor/inventory',
          referenceId: product.id
        },
        ...prev
      ]);
    } else if (newStock === 0) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          type: 'OUT_OF_STOCK',
          title: `Out of Stock: ${product.name}`,
          message: `Product is completely out of stock and marked unavailable for sale.`,
          timestamp: 'Just now',
          isRead: false,
          actionUrl: '/vendor/inventory',
          referenceId: product.id
        },
        ...prev
      ]);
    }

    return { success: true };
  };

  /**
   * ATOMIC POS SALE COMPLETION:
   * 1. Validates available stock for every line item (prevents negative stock).
   * 2. Deducts variant stock and product stock.
   * 3. Creates auditable SOLD inventory transactions.
   * 4. Updates inventory status (Healthy / Low / Out of stock).
   * 5. Creates GST invoice.
   * 6. Creates completed Order record.
   * 7. Creates wallet credit record.
   */
  const processPOSSale = (bill: POSSaleData): { success: boolean; invoice?: Invoice; order?: Order; error?: string } => {
    if (!bill.items || bill.items.length === 0) {
      return { success: false, error: 'Cart is empty. Please scan or add at least one product.' };
    }

    // Step 1: Strict Stock Validation
    for (const item of bill.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        return { success: false, error: `Product "${item.productName}" no longer exists in store catalog.` };
      }

      if (item.variantId && prod.variants) {
        const variant = prod.variants.find((v) => v.id === item.variantId);
        const avail = variant ? (variant.availableStock !== undefined ? variant.availableStock : variant.stock) : 0;
        if (item.quantity > avail) {
          return {
            success: false,
            error: `Insufficient Stock for ${item.productName} (${item.color} / ${item.size}). Only ${avail} units currently available.`
          };
        }
      } else {
        if (item.quantity > prod.stock) {
          return {
            success: false,
            error: `Insufficient Stock for ${item.productName}. Only ${prod.stock} units currently available.`
          };
        }
      }
    }

    // Step 2: Generate Invoice Number and Order ID
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `WN-INV-${randomDigits}`;
    const orderNumber = `#WN-POS-${randomDigits}`;
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const nowDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // Step 3: Atomic Stock Deduction & Inventory Transactions
    const newTxList: InventoryTransaction[] = [];
    const updatedProducts = [...products];

    bill.items.forEach((item, idx) => {
      const pIdx = updatedProducts.findIndex((p) => p.id === item.productId);
      if (pIdx !== -1) {
        const prod = { ...updatedProducts[pIdx] };
        let prevStock = prod.stock;
        let newStock = Math.max(0, prevStock - item.quantity);

        if (item.variantId && prod.variants) {
          const vIdx = prod.variants.findIndex((v) => v.id === item.variantId);
          if (vIdx !== -1) {
            const v = { ...prod.variants[vIdx] };
            const vPrev = v.stock;
            const vNew = Math.max(0, vPrev - item.quantity);
            v.stock = vNew;
            v.availableStock = Math.max(0, (v.availableStock ?? vPrev) - item.quantity);

            const newVariants = [...prod.variants];
            newVariants[vIdx] = v;
            prod.variants = newVariants;
            prod.stock = newVariants.reduce((sum, vr) => sum + vr.stock, 0);

            prevStock = vPrev;
            newStock = vNew;
          }
        } else {
          prod.stock = newStock;
        }

        prod.salesCount = (prod.salesCount || 0) + item.quantity;
        prod.status = prod.stock === 0 ? 'OUT_OF_STOCK' : prod.status;
        updatedProducts[pIdx] = prod;

        // Record auditable SOLD transaction
        const tx: InventoryTransaction = {
          id: `tx_${Date.now()}_${idx}`,
          date: `Today, ${nowTime}`,
          time: nowTime,
          productName: item.productName,
          productId: item.productId,
          variantId: item.variantId,
          variantInfo: `${item.color} · Size ${item.size}`,
          sku: item.sku,
          barcode: item.barcode,
          type: 'SOLD',
          quantityChange: -item.quantity,
          previousStock: prevStock,
          newStock: newStock,
          reason: 'Retail Sale POS Checkout',
          reference: invoiceNumber,
          performedBy: bill.operatorName || 'Store Cashier'
        };
        newTxList.push(tx);

        // Low stock / out of stock alerts
        if (newStock <= prod.lowStockThreshold && newStock > 0) {
          setNotifications((prev) => [
            {
              id: `notif_low_${Date.now()}_${idx}`,
              type: 'LOW_STOCK',
              title: `Low Stock: ${item.productName} (${item.size})`,
              message: `Only ${newStock} units left after retail sale. Reorder recommended.`,
              timestamp: 'Just now',
              isRead: false,
              actionUrl: '/vendor/inventory',
              referenceId: item.productId
            },
            ...prev
          ]);
        } else if (newStock === 0) {
          setNotifications((prev) => [
            {
              id: `notif_oos_${Date.now()}_${idx}`,
              type: 'OUT_OF_STOCK',
              title: `Out of Stock: ${item.productName}`,
              message: `Variant (${item.color} / ${item.size}) is now sold out.`,
              timestamp: 'Just now',
              isRead: false,
              actionUrl: '/vendor/inventory',
              referenceId: item.productId
            },
            ...prev
          ]);
        }
      }
    });

    setProducts(updatedProducts);
    setInventoryTransactions((prev) => [...newTxList, ...prev]);

    // Update Inventory items table
    setInventory((prevInv) =>
      prevInv.map((invItem) => {
        const matchingProd = updatedProducts.find((p) => p.id === invItem.productId);
        if (matchingProd) {
          return {
            ...invItem,
            availableStock: matchingProd.stock,
            status: matchingProd.stock === 0 ? 'OUT_OF_STOCK' : matchingProd.stock <= invItem.lowStockThreshold ? 'LOW_STOCK' : 'HEALTHY',
            lastUpdated: 'Just now'
          };
        }
        return invItem;
      })
    );

    // Step 4: Create Compliant Tax Invoice
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: invoiceNumber,
      orderId: `ord_pos_${Date.now()}`,
      orderNumber: orderNumber,
      date: nowDate,
      customerName: bill.customerName || 'Walk-in Retail Customer',
      customerPhone: bill.customerPhone || '+91 98200 00000',
      customerAddress: bill.customerAddress || 'In-Store Counter Purchase, Bandra West',
      storeName: 'Vogue Loom Studio',
      storeGst: '27AABCV1294K1Z8',
      items: bill.items.map((i) => ({
        name: i.productName,
        sku: i.sku,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discount: i.discountPercent ? Math.round((i.unitPrice * i.discountPercent) / 100) : 0,
        taxRate: i.taxRate || 5,
        amount: i.unitPrice * i.quantity
      })),
      subtotal: bill.subtotal,
      discount: bill.discountTotal,
      taxAmount: bill.taxAmount,
      deliveryFee: bill.deliveryFee || 0,
      finalAmount: bill.finalAmount,
      paymentMethod: bill.paymentMethod === 'UPI' ? 'UPI (Verified)' : bill.paymentMethod === 'CARD' ? 'Credit/Debit Card' : bill.paymentMethod === 'CASH' ? 'Cash at Counter' : 'Digital Payment',
      paymentStatus: 'PAID'
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Step 5: Create Completed POS Order
    const newOrder: Order = {
      id: newInvoice.orderId,
      orderNumber: orderNumber,
      customer: {
        id: `cust_pos_${Date.now()}`,
        name: bill.customerName || 'Walk-in Customer',
        phone: bill.customerPhone || '+91 98200 00000',
        address: bill.customerAddress || 'In-store retail counter',
        distanceKm: 0
      },
      items: bill.items.map((i, idx) => ({
        id: `ord_item_${idx}`,
        productId: i.productId,
        productName: i.productName,
        sku: i.sku,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.unitPrice,
        discount: i.discountPercent ? Math.round((i.unitPrice * i.discountPercent) / 100) : 0,
        total: i.unitPrice * i.quantity,
        image: i.image
      })),
      itemCount: bill.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: bill.subtotal,
      discountTotal: bill.discountTotal,
      deliveryCharge: bill.deliveryFee || 0,
      taxes: bill.taxAmount,
      totalAmount: bill.finalAmount,
      paymentMethod: bill.paymentMethod === 'UPI' ? 'ONLINE_UPI' : bill.paymentMethod === 'CARD' ? 'ONLINE_CARD' : 'CASH_ON_DELIVERY',
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      createdAt: 'Just now',
      timeline: [
        { title: 'Barcode Scanned & Added to POS', timestamp: 'Just now', completed: true, current: false },
        { title: `Payment Verified (${bill.paymentMethod})`, timestamp: 'Just now', completed: true, current: false },
        { title: `Invoice ${invoiceNumber} Generated`, timestamp: 'Just now', completed: true, current: true }
      ],
      notes: bill.notes || 'In-store barcode counter checkout'
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Step 6: Credit Wallet Balance
    setWalletTransactions((prev) => [
      {
        id: `wt_pos_${Date.now()}`,
        date: `Today, ${nowTime}`,
        type: 'ORDER_PAYOUT',
        amount: bill.finalAmount,
        isCredit: true,
        orderNumber: orderNumber,
        description: `POS Retail Sale: Invoice ${invoiceNumber}`,
        balanceAfter: 48250 + bill.finalAmount
      },
      ...prev
    ]);

    // Step 7: Update Customer Summary if phone exists
    if (bill.customerPhone && bill.customerName) {
      setCustomers((prevCust) => {
        const existingIdx = prevCust.findIndex((c) => c.phone === bill.customerPhone);
        if (existingIdx !== -1) {
          const updated = [...prevCust];
          updated[existingIdx] = {
            ...updated[existingIdx],
            ordersCount: updated[existingIdx].ordersCount + 1,
            totalSpent: updated[existingIdx].totalSpent + bill.finalAmount,
            lastOrderDate: 'Today'
          };
          return updated;
        } else {
          return [
            {
              id: `cust_${Date.now()}`,
              name: bill.customerName,
              phone: bill.customerPhone,
              email: `${bill.customerName.toLowerCase().replace(/\s+/g, '.')}@client.in`,
              locality: 'Bandra West, Mumbai',
              ordersCount: 1,
              totalSpent: bill.finalAmount,
              lastOrderDate: 'Today',
              status: 'ACTIVE'
            },
            ...prevCust
          ];
        }
      });
    }

    return { success: true, invoice: newInvoice, order: newOrder };
  };

  /**
   * BARCODE RETURNS PROCESSOR:
   * Restores inventory, generates RETURNED transaction, updates return request.
   */
  const processBarcodeReturn = (returnData: {
    orderNumber: string;
    customerName: string;
    productName: string;
    sku: string;
    barcode: string;
    productId: string;
    variantId?: string;
    quantity: number;
    reason: ReturnRequest['reason'];
    reasonText: string;
    amount: number;
    operatorName?: string;
  }): boolean => {
    const product = products.find((p) => p.id === returnData.productId);
    if (!product) return false;

    let prevStock = product.stock;
    let newStock = prevStock + returnData.quantity;

    if (returnData.variantId && product.variants) {
      const updatedVariants = product.variants.map((v) => {
        if (v.id === returnData.variantId) {
          const vPrev = v.stock;
          const vNew = vPrev + returnData.quantity;
          prevStock = vPrev;
          newStock = vNew;
          return { ...v, stock: vNew, availableStock: (v.availableStock || vPrev) + returnData.quantity };
        }
        return v;
      });
      const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
      updateProduct(product.id, { stock: totalStock, variants: updatedVariants });
    } else {
      updateProduct(product.id, { stock: newStock });
    }

    // Create RETURNED transaction
    const tx: InventoryTransaction = {
      id: `tx_${Date.now()}`,
      date: 'Today, Just now',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      productName: product.name,
      productId: product.id,
      variantId: returnData.variantId,
      sku: returnData.sku,
      barcode: returnData.barcode,
      type: 'RETURNED',
      quantityChange: returnData.quantity,
      previousStock: prevStock,
      newStock: newStock,
      reason: `Return accepted: ${returnData.reasonText || returnData.reason}`,
      reference: returnData.orderNumber,
      performedBy: returnData.operatorName || 'Store Staff'
    };
    setInventoryTransactions((prev) => [tx, ...prev]);

    // Create return record or update existing
    setReturns((prev) => [
      {
        id: `ret_${Date.now()}`,
        orderNumber: returnData.orderNumber,
        customerName: returnData.customerName,
        customerPhone: '+91 98200 00000',
        productName: returnData.productName,
        size: 'Standard',
        color: 'Standard',
        reason: returnData.reason,
        reasonText: returnData.reasonText,
        status: 'COMPLETED',
        requestDate: 'Today, Just now',
        amount: returnData.amount
      },
      ...prev
    ]);

    setNotifications((prev) => [
      {
        id: `notif_ret_${Date.now()}`,
        type: 'RETURN_REQUEST',
        title: `Return Restored: ${returnData.productName}`,
        message: `${returnData.quantity} unit(s) inspected and restored to shelf stock.`,
        timestamp: 'Just now',
        isRead: false,
        actionUrl: '/vendor/inventory'
      },
      ...prev
    ]);

    return true;
  };

  /**
   * BARCODE EXCHANGES PROCESSOR:
   * Returns old variant (+1) and deducts replacement variant (-1) with linked transactions.
   */
  const processBarcodeExchange = (exchangeData: {
    orderNumber: string;
    customerName: string;
    returnedBarcode: string;
    replacementBarcode: string;
    operatorName?: string;
  }): { success: boolean; error?: string } => {
    // 1. Find returned product/variant
    let returnedProd: Product | undefined;
    let returnedVariant: ProductVariant | undefined;
    let replacementProd: Product | undefined;
    let replacementVariant: ProductVariant | undefined;

    for (const p of products) {
      if (p.barcode === exchangeData.returnedBarcode) returnedProd = p;
      if (p.variants) {
        for (const v of p.variants) {
          if (v.barcode === exchangeData.returnedBarcode) {
            returnedProd = p;
            returnedVariant = v;
          }
        }
      }
      if (p.barcode === exchangeData.replacementBarcode) replacementProd = p;
      if (p.variants) {
        for (const v of p.variants) {
          if (v.barcode === exchangeData.replacementBarcode) {
            replacementProd = p;
            replacementVariant = v;
          }
        }
      }
    }

    if (!returnedProd) {
      return { success: false, error: 'Returned item barcode not found in catalog.' };
    }
    if (!replacementProd) {
      return { success: false, error: 'Replacement item barcode not found in catalog.' };
    }

    // Validate replacement stock
    const replStock = replacementVariant ? replacementVariant.stock : replacementProd.stock;
    if (replStock <= 0) {
      return {
        success: false,
        error: `Replacement item "${replacementProd.name}" (${replacementVariant ? replacementVariant.size : ''}) is out of stock.`
      };
    }

    // Restore old item (+1)
    performManualStockAdjustment({
      productId: returnedProd.id,
      variantId: returnedVariant?.id,
      change: 1,
      type: 'RETURNED',
      reason: `Exchange return from ${exchangeData.orderNumber}`,
      operatorName: exchangeData.operatorName
    });

    // Deduct replacement item (-1)
    performManualStockAdjustment({
      productId: replacementProd.id,
      variantId: replacementVariant?.id,
      change: -1,
      type: 'SOLD',
      reason: `Exchange replacement issued for ${exchangeData.orderNumber}`,
      operatorName: exchangeData.operatorName
    });

    // Add exchange log
    setExchanges((prev) => [
      {
        id: `exc_${Date.now()}`,
        orderNumber: exchangeData.orderNumber,
        customerName: exchangeData.customerName,
        originalProduct: `${returnedProd?.name} (${returnedVariant?.size || 'Standard'})`,
        currentSize: returnedVariant?.size || 'Current',
        requestedSize: replacementVariant?.size || 'Replacement',
        stockAvailable: true,
        status: 'COMPLETED',
        date: 'Today, Just now'
      },
      ...prev
    ]);

    return { success: true };
  };

  const createInvoice = (orderId: string): Invoice => {
    const order = orders.find((o) => o.id === orderId);
    const invoiceNum = `WN-INV-${Math.floor(1000 + Math.random() * 9000)}`;
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

  const addCatalogueExecutive = (execData: {
    name: string;
    phone: string;
    email: string;
    preset: PermissionPreset;
    role?: CatalogueExecutive['role'];
  }): CatalogueExecutive => {
    const activeCount = catalogueExecutives.filter((e) => e.status === 'ACTIVE').length;
    if (activeCount >= maxActiveExecutivesLimit) {
      throw new Error('Catalogue Executive Limit Reached. Request additional limit from Super Admin.');
    }

    const nextNumber = catalogueExecutives.length + 1;
    const employeeId = `CE-2026-00${nextNumber}`;
    const newExec: CatalogueExecutive = {
      id: `ce_${Date.now()}`,
      employeeId,
      name: execData.name,
      phone: execData.phone,
      email: execData.email,
      storeId: 'store_01',
      role: execData.role || 'Catalogue Executive',
      status: 'ACTIVE',
      joinedDate: 'Today',
      lastLogin: 'Never logged in',
      preset: execData.preset,
      permissions: execData.preset === 'SENIOR' ? SENIOR_PERMISSIONS : STANDARD_PERMISSIONS
    };

    setCatalogueExecutives((prev) => [newExec, ...prev]);

    // Record activity
    setExecutiveActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        executiveId: newExec.id,
        executiveName: newExec.name,
        action: 'PRODUCT_CREATE',
        details: `Created new Catalogue Executive profile (${employeeId})`,
        timestamp: 'Just now'
      },
      ...prev
    ]);

    return newExec;
  };

  const updateCatalogueExecutive = (id: string, updates: Partial<CatalogueExecutive>) => {
    setCatalogueExecutives((prev) =>
      prev.map((exec) => (exec.id === id ? { ...exec, ...updates } : exec))
    );
  };

  const updateExecutivePermissions = (
    id: string,
    permissions: ExecutivePermissions,
    preset: PermissionPreset = 'CUSTOM'
  ) => {
    setCatalogueExecutives((prev) =>
      prev.map((exec) =>
        exec.id === id
          ? {
              ...exec,
              permissions,
              preset
            }
          : exec
      )
    );
  };

  const toggleExecutiveStatus = (id: string) => {
    setCatalogueExecutives((prev) =>
      prev.map((exec) => {
        if (exec.id === id) {
          const newStatus = exec.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...exec, status: newStatus };
        }
        return exec;
      })
    );
  };

  const requestAdditionalExecutives = (
    requestedAdditionalCount: number,
    reason: string
  ): ExecutiveRequest => {
    const activeCount = catalogueExecutives.filter((e) => e.status === 'ACTIVE').length;
    const newRequest: ExecutiveRequest = {
      id: `req_${Date.now()}`,
      currentCount: activeCount,
      requestedAdditionalCount,
      reason,
      requestedBy: 'Vikramaditya (Store Owner)',
      date: 'Today',
      status: 'PENDING'
    };

    setExecutiveRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const updateBusinessProfile = (updates: Partial<BusinessProfile>) => {
    setBusinessProfile((prev) => ({ ...prev, ...updates }));
  };

  // Product Approval & Publishing Workflow Action Handlers
  const submitProductForApproval = (productId: string, submitterName: string = 'Neha Gupta (Catalogue Executive)') => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newAudit: ProductAuditEvent = {
            id: `aud_${Date.now()}`,
            action: 'SUBMITTED_FOR_APPROVAL',
            performedBy: submitterName,
            role: 'Catalogue Executive',
            timestamp: 'Just now',
            notes: 'Submitted for Store Owner review'
          };
          return {
            ...p,
            status: 'UNDER_REVIEW',
            updatedAt: 'Just now',
            submittedBy: {
              id: 'ce_2',
              name: submitterName,
              role: 'Catalogue Executive',
              timestamp: 'Just now'
            },
            auditTrail: [newAudit, ...(p.auditTrail || [])]
          };
        }
        return p;
      })
    );
  };

  const approveProductByStore = (
    productId: string,
    approverName: string = 'Vikramaditya (Store Owner)'
  ): { success: boolean; isLive: boolean; error?: string } => {
    const target = products.find((p) => p.id === productId);
    if (!target) return { success: false, isLive: false, error: 'Product not found' };

    // Validation checks for LIVE status
    const missing: string[] = [];
    if (!target.name) missing.push('Product name');
    if (!target.images || target.images.length === 0) missing.push('Product image');
    if (!target.category) missing.push('Category assignment');
    if (!target.sellingPrice || target.sellingPrice <= 0) missing.push('Selling price');
    if (!target.variants || target.variants.length === 0) missing.push('Product variants');
    if (!target.sku) missing.push('SKU code');

    const canBeLive = missing.length === 0;
    const finalStatus: ProductLifecycleStatus = canBeLive ? 'LIVE' : 'APPROVED';

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const auditApprove: ProductAuditEvent = {
            id: `aud_${Date.now()}_1`,
            action: 'APPROVED_BY_STORE',
            performedBy: approverName,
            role: 'Store Owner',
            timestamp: 'Just now',
            notes: 'Store Manager approval granted'
          };
          const auditLive: ProductAuditEvent = {
            id: `aud_${Date.now()}_2`,
            action: 'PRODUCT_LIVE',
            performedBy: 'System Auto',
            role: 'System',
            timestamp: 'Just now',
            notes: 'Product transition to LIVE'
          };

          const newAuditTrail = canBeLive
            ? [auditLive, auditApprove, ...(p.auditTrail || [])]
            : [auditApprove, ...(p.auditTrail || [])];

          return {
            ...p,
            status: finalStatus,
            updatedAt: 'Just now',
            reviewedBy: {
              id: 'usr_owner_01',
              name: approverName,
              role: 'Store Owner',
              timestamp: 'Just now'
            },
            auditTrail: newAuditTrail
          };
        }
        return p;
      })
    );

    return {
      success: true,
      isLive: canBeLive,
      error: missing.length > 0 ? `Approved but missing live conditions: ${missing.join(', ')}` : undefined
    };
  };

  const requestProductChangesByStore = (
    productId: string,
    requestedChangesList: string[],
    comment: string,
    reviewerName: string = 'Vikramaditya (Store Owner)'
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newAudit: ProductAuditEvent = {
            id: `aud_${Date.now()}`,
            action: 'CHANGES_REQUESTED',
            performedBy: reviewerName,
            role: 'Store Owner',
            timestamp: 'Just now',
            notes: `Requested changes: ${requestedChangesList.join(', ')}. Comment: ${comment}`
          };
          return {
            ...p,
            status: 'CHANGES_REQUESTED',
            updatedAt: 'Just now',
            reviewedBy: {
              id: 'usr_owner_01',
              name: reviewerName,
              role: 'Store Owner',
              timestamp: 'Just now'
            },
            reviewComment: comment,
            requestedChanges: requestedChangesList,
            auditTrail: [newAudit, ...(p.auditTrail || [])]
          };
        }
        return p;
      })
    );
  };

  const rejectProductByStore = (
    productId: string,
    reason: string,
    reviewerName: string = 'Vikramaditya (Store Owner)'
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newAudit: ProductAuditEvent = {
            id: `aud_${Date.now()}`,
            action: 'REJECTED',
            performedBy: reviewerName,
            role: 'Store Owner',
            timestamp: 'Just now',
            notes: `Rejection reason: ${reason}`
          };
          return {
            ...p,
            status: 'REJECTED',
            updatedAt: 'Just now',
            reviewedBy: {
              id: 'usr_owner_01',
              name: reviewerName,
              role: 'Store Owner',
              timestamp: 'Just now'
            },
            reviewComment: reason,
            auditTrail: [newAudit, ...(p.auditTrail || [])]
          };
        }
        return p;
      })
    );
  };

  const pauseProductByStore = (productId: string, reason: string = 'Paused by Store Owner') => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newAudit: ProductAuditEvent = {
            id: `aud_${Date.now()}`,
            action: 'PAUSED',
            performedBy: 'Vikramaditya (Store Owner)',
            role: 'Store Owner',
            timestamp: 'Just now',
            notes: reason
          };
          return {
            ...p,
            status: 'PAUSED',
            updatedAt: 'Just now',
            auditTrail: [newAudit, ...(p.auditTrail || [])]
          };
        }
        return p;
      })
    );
  };

  const unpauseProductByStore = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newAudit: ProductAuditEvent = {
            id: `aud_${Date.now()}`,
            action: 'PRODUCT_LIVE',
            performedBy: 'Vikramaditya (Store Owner)',
            role: 'Store Owner',
            timestamp: 'Just now',
            notes: 'Product unpaused and made LIVE'
          };
          return {
            ...p,
            status: 'LIVE',
            updatedAt: 'Just now',
            auditTrail: [newAudit, ...(p.auditTrail || [])]
          };
        }
        return p;
      })
    );
  };

  const resubmitProductForApproval = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newAudit: ProductAuditEvent = {
            id: `aud_${Date.now()}`,
            action: 'RESUBMITTED',
            performedBy: 'Neha Gupta (Catalogue Executive)',
            role: 'Catalogue Executive',
            timestamp: 'Just now',
            notes: 'Resubmitted after addressing requested changes'
          };
          return {
            ...p,
            status: 'UNDER_REVIEW',
            updatedAt: 'Just now',
            reviewComment: undefined,
            requestedChanges: undefined,
            auditTrail: [newAudit, ...(p.auditTrail || [])]
          };
        }
        return p;
      })
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
        recentScans,
        catalogueExecutives,
        executiveRequests,
        executiveActivities,
        executiveLoginHistories,
        executiveProductActivities,
        businessProfile,
        maxActiveExecutivesLimit,
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
        uploadKycDoc,
        addCatalogueExecutive,
        updateCatalogueExecutive,
        updateExecutivePermissions,
        toggleExecutiveStatus,
        requestAdditionalExecutives,
        updateBusinessProfile,
        submitProductForApproval,
        approveProductByStore,
        requestProductChangesByStore,
        rejectProductByStore,
        pauseProductByStore,
        unpauseProductByStore,
        resubmitProductForApproval,
        processPOSSale,
        processBarcodeReturn,
        processBarcodeExchange,
        performManualStockAdjustment,
        addRecentScan,
        clearRecentScans
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
