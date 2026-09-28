export type StoreStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BLOCKED' | 'REJECTED';

export interface VendorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'STORE_OWNER' | 'STORE_MANAGER' | 'STORE_STAFF';
  storeId: string;
  storeName: string;
  storeStatus: StoreStatus;
  avatar?: string;
  permissions?: StaffPermission[];
}

export interface StoreProfile {
  id: string;
  name: string;
  tagline: string;
  ownerName: string;
  phone: string;
  email: string;
  address: {
    street: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: { lat: number; lng: number };
  };
  gstin: string;
  panNumber: string;
  businessType: 'Proprietorship' | 'Partnership' | 'Pvt Ltd' | 'LLP';
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branch: string;
    accountHolder: string;
  };
  status: StoreStatus;
  rating: number;
  totalReviews: number;
  images: string[];
  logo: string;
  commissionRate: number;
  operatingHours: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  price: number;
  discountPrice?: number;
  stock: number;
  barcode?: string;
  barcodeFormat?: 'EAN-13' | 'EAN-8' | 'UPC-A' | 'UPC-E' | 'CODE128' | 'CODE39' | 'QR';
  availableStock?: number;
  reservedStock?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  barcodeFormat?: 'EAN-13' | 'EAN-8' | 'UPC-A' | 'UPC-E' | 'CODE128' | 'CODE39' | 'QR';
  category: string;
  categoryId: string;
  brand: string;
  brandId: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  stock: number;
  lowStockThreshold: number;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DRAFT';
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  salesCount: number;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  productCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  image?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  tier?: 'Premium' | 'Regular' | 'Fast Fashion';
}

export type OrderStatus =
  | 'NEW'
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RETURNED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  image: string;
}

export interface Captain {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  avatar: string;
  rating: number;
  etaMinutes?: number;
}

export interface OrderTimelineStep {
  title: string;
  description?: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    address: string;
    distanceKm: number;
  };
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  deliveryCharge: number;
  taxes: number;
  totalAmount: number;
  paymentMethod: 'ONLINE_UPI' | 'ONLINE_CARD' | 'CASH_ON_DELIVERY';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  status: OrderStatus;
  createdAt: string;
  pickupTimeWindow?: string;
  captain?: Captain;
  timeline: OrderTimelineStep[];
  notes?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  brand: string;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  status: 'HEALTHY' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastUpdated: string;
}

export type InventoryTransactionType =
  | 'STOCK_ADDED'
  | 'STOCK_DEDUCTED'
  | 'SOLD'
  | 'RESERVED'
  | 'RELEASED'
  | 'RETURNED'
  | 'RESTORED'
  | 'MANUAL_ADJUSTMENT'
  | 'DAMAGED'
  | 'EXPIRED';

export interface InventoryTransaction {
  id: string;
  date: string;
  time?: string;
  productName: string;
  productId?: string;
  variantId?: string;
  variantInfo?: string;
  sku: string;
  barcode?: string;
  type: InventoryTransactionType;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  performedBy: string;
}

export interface POSCartItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  brand: string;
  category: string;
  sku: string;
  barcode: string;
  size: string;
  color: string;
  colorHex?: string;
  image: string;
  unitPrice: number;
  mrp: number;
  quantity: number;
  availableStock: number;
  discountPercent?: number;
  taxRate: number; // Apparel GST rate (typically 5% in India)
}

export interface POSSaleData {
  customerName: string;
  customerPhone: string;
  customerGst?: string;
  customerAddress?: string;
  items: POSCartItem[];
  subtotal: number;
  discountTotal: number;
  taxAmount: number;
  deliveryFee: number;
  finalAmount: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'ONLINE';
  paymentReference?: string;
  notes?: string;
  operatorName?: string;
}

export interface ScannedBarcodeRecord {
  id: string;
  barcode: string;
  format?: string;
  timestamp: string;
  product: Product;
  variant?: ProductVariant;
  actionTaken?: 'ADDED_TO_BILL' | 'INSPECTED' | 'RESTOCKED' | 'RETURNED' | 'EXCHANGED';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  storeName: string;
  storeGst: string;
  items: {
    name: string;
    sku: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
    amount: number;
  }[];
  subtotal: number;
  discount: number;
  taxAmount: number;
  deliveryFee: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'CANCELLED';
}

export interface Settlement {
  id: string;
  settlementId: string;
  cyclePeriod: string;
  settlementDate: string;
  ordersCount: number;
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  adjustments: number;
  netPayout: number;
  bankAccountLast4: string;
  status: 'PROCESSED' | 'PENDING' | 'HOLD';
  utrNumber?: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  type: 'ORDER_PAYOUT' | 'COMMISSION_DEDUCTION' | 'SETTLEMENT_WITHDRAWAL' | 'REFUND_ADJUSTMENT' | 'OFFER_CREDIT';
  amount: number;
  isCredit: boolean;
  orderNumber?: string;
  description: string;
  balanceAfter: number;
}

export interface CustomerSummary {
  id: string;
  name: string;
  phone: string;
  email: string;
  locality: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'ACTIVE' | 'VIP' | 'INACTIVE';
}

export type StaffPermission =
  | 'PRODUCT_READ'
  | 'PRODUCT_CREATE'
  | 'PRODUCT_UPDATE'
  | 'INVENTORY_READ'
  | 'INVENTORY_UPDATE'
  | 'ORDER_READ'
  | 'ORDER_UPDATE'
  | 'BILL_CREATE'
  | 'FINANCE_VIEW'
  | 'SETTINGS_MANAGE';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'Store Manager' | 'Inventory Lead' | 'Sales Executive' | 'Billing Operator';
  status: 'ACTIVE' | 'INACTIVE';
  permissions: StaffPermission[];
  joinedDate: string;
  avatar?: string;
}

export interface NotificationItem {
  id: string;
  type: 'NEW_ORDER' | 'ORDER_REMINDER' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'PAYMENT' | 'SETTLEMENT' | 'RETURN_REQUEST';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  referenceId?: string;
}

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  size: string;
  color: string;
  reason: 'SIZE_FIT' | 'DEFECTIVE' | 'COLOR_MISMATCH' | 'FABRIC_QUALITY' | 'CHANGED_MIND';
  reasonText: string;
  status: 'NEW' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  requestDate: string;
  amount: number;
}

export interface ExchangeRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  originalProduct: string;
  currentSize: string;
  requestedSize: string;
  stockAvailable: boolean;
  status: 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'REJECTED';
  date: string;
}

export interface RefundItem {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  method: string;
  reason: string;
  status: 'REQUESTED' | 'APPROVED' | 'PROCESSING' | 'REFUNDED' | 'FAILED';
  date: string;
}

export interface StoreOffer {
  id: string;
  title: string;
  type: 'PRODUCT_DISCOUNT' | 'CATEGORY_DISCOUNT' | 'STORE_OFFER';
  discountType: 'PERCENT' | 'FLAT';
  discountValue: number;
  targetCategory?: string;
  minOrderAmount?: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED';
  usageCount: number;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  productName?: string;
  type: 'PRODUCT' | 'STORE';
  verifiedPurchase: boolean;
  storeReply?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  category: 'Order' | 'Inventory' | 'Billing' | 'Payment' | 'Settlement' | 'Technical Issue';
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'VENDOR' | 'SUPPORT_AGENT';
    senderName: string;
    text: string;
    timestamp: string;
    attachments?: string[];
  }[];
}

export interface KycDocument {
  id: string;
  type: 'IDENTITY' | 'BUSINESS' | 'STORE' | 'BANK';
  title: string;
  description: string;
  requiredFileTypes: string;
  status: 'NOT_UPLOADED' | 'UPLOADED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  fileName?: string;
  uploadedAt?: string;
  rejectionReason?: string;
}
