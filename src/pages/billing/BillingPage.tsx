import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Barcode,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  QrCode,
  Globe,
  Printer,
  FileText,
  RotateCcw,
  Sparkles,
  Camera,
  X,
  Keyboard,
  Receipt,
  Eye,
  ArrowRight
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { BarcodeScanner } from '../../components/barcode/BarcodeScanner';
import { BarcodeInput } from '../../components/barcode/BarcodeInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { findProductByBarcode } from '../../utils/barcodeUtils';
import { POSCartItem, Invoice, Order } from '../../types';
import {
  staggerContainer,
  staggerItem,
  cardInteractiveVariants,
  buttonTapVariants,
  paymentSuccess,
  slideUp,
  modalVariants,
  backdropVariants
} from '../../utils/animations';

export const BillingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, invoices, processPOSSale } = useData();
  const { user, store } = useAuth();
  const { success, error, info } = useToast();

  // Mode: POS Terminal vs Invoices Ledger Archive
  const [activeTab, setActiveTab] = useState<'POS' | 'INVOICES'>('POS');

  // Scanner Modal / Drawer state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Cart state
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'ONLINE'>('UPI');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Success Confirmation Screen state
  const [completedSale, setCompletedSale] = useState<{
    invoice: Invoice;
    order: Order;
  } | null>(null);

  // Auto-add item from BarcodeScanner navigation
  useEffect(() => {
    const navState = location.state as { autoAddItem?: { productId: string; variantId?: string; barcode?: string } } | undefined;
    if (navState?.autoAddItem) {
      const { productId, variantId, barcode } = navState.autoAddItem;
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        const v = variantId ? prod.variants?.find((vr) => vr.id === variantId) : undefined;
        handleAddToCart(prod, v, barcode);
      }
      // clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, products]);

  // Keyboard Shortcuts (F2: focus input, F4: toggle scanner, Cmd+Enter: complete bill, Esc: close scanner)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        setIsScannerOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (cart.length > 0 && !completedSale) {
          handleConfirmPayment();
        }
      } else if (e.key === 'Escape') {
        setIsScannerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, completedSale]);

  // Add product to cart with strict stock validation
  const handleAddToCart = (product: any, variant?: any, explicitBarcode?: string) => {
    const variantId = variant?.id;
    const barcode = explicitBarcode || variant?.barcode || product.barcode || 'WN-ITEM';
    const sku = variant?.sku || product.sku;
    const size = variant?.size || product.sizes?.[0] || 'Standard';
    const color = variant?.color || product.colors?.[0]?.name || 'Standard';
    const unitPrice = variant?.price ?? product.sellingPrice;
    const mrp = product.mrp;
    const availableStock = variant ? (variant.availableStock ?? variant.stock) : product.stock;

    if (availableStock <= 0) {
      error('Out of Stock', `${product.name} (${size}) has 0 units available.`);
      return;
    }

    setCart((prevCart) => {
      // Check if product variant is already in cart
      const existingIdx = prevCart.findIndex(
        (item) => item.productId === product.id && item.variantId === variantId
      );

      if (existingIdx !== -1) {
        const currentQty = prevCart[existingIdx].quantity;
        if (currentQty + 1 > availableStock) {
          error(
            'Insufficient Stock',
            `Only ${availableStock} units of ${product.name} (${size}) are currently available.`
          );
          return prevCart;
        }

        const updated = [...prevCart];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: currentQty + 1
        };
        success('Quantity Updated', `${product.name} quantity increased to ${currentQty + 1}.`);
        return updated;
      } else {
        const newItem: POSCartItem = {
          id: `cart_${Date.now()}_${Math.random()}`,
          productId: product.id,
          variantId,
          productName: product.name,
          brand: product.brand,
          category: product.category,
          sku,
          barcode,
          size,
          color,
          colorHex: variant?.colorHex,
          image: product.images[0] || '',
          unitPrice,
          mrp,
          quantity: 1,
          availableStock,
          discountPercent: product.discountPercent,
          taxRate: 5
        };
        success('Item Added to Bill', `${product.name} (${size}) added.`);
        return [newItem, ...prevCart];
      }
    });
  };

  // High-speed barcode scan handler: Automatically adds to cart and stays ready for next!
  const handleRapidScan = (barcode: string) => {
    const match = findProductByBarcode(barcode, products);
    if (match) {
      handleAddToCart(match.product, match.variant, barcode);
    } else {
      error('Barcode Not Found', `Barcode ${barcode} does not match any WearNear garment.`);
    }
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          if (newQty > item.availableStock) {
            error(
              'Insufficient Stock',
              `Only ${item.availableStock} units of ${item.productName} (${item.size}) are in stock.`
            );
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    if (window.confirm('Clear all items from current retail bill?')) {
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setDiscountPercent(0);
    }
  };

  // Real-time Bill Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const promoDiscount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = subtotal - promoDiscount;
  const taxAmount = Math.round(taxableAmount * 0.05); // 5% apparel GST
  const finalAmount = taxableAmount + taxAmount;

  // Confirm Sale & Process Payment
  const handleConfirmPayment = () => {
    if (cart.length === 0) {
      error('Cart is Empty', 'Please scan or add garments before completing sale.');
      return;
    }

    // Check staff permissions
    if (user?.role === 'STORE_STAFF' && user.permissions && !user.permissions.includes('BILL_CREATE')) {
      error('Permission Denied', 'Your staff account does not have permission to generate bills.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const result = processPOSSale({
        customerName: customerName.trim() || 'Walk-in Retail Customer',
        customerPhone: customerPhone.trim() || '+91 98200 00000',
        items: cart,
        subtotal,
        discountTotal: promoDiscount,
        taxAmount,
        deliveryFee: 0,
        finalAmount,
        paymentMethod,
        operatorName: user?.name || 'Store Cashier'
      });

      setIsProcessing(false);

      if (result.success && result.invoice && result.order) {
        setCompletedSale({
          invoice: result.invoice,
          order: result.order
        });
        setCart([]);
        success('Payment Successful', `Bill ${result.invoice.invoiceNumber} confirmed & stock deducted.`);
      } else {
        error('Billing Blocked', result.error || 'Failed to complete sale. Stock was not modified.');
      }
    }, 450);
  };

  // Filter products for catalog search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variants?.some((v) => v.barcode?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AnimatedPage className="space-y-4 sm:space-y-6 pb-24 md:pb-8">
      {/* Top Bar with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#172033] tracking-tight">
              WearNear Retail POS & Billing
            </h1>
            <span className="text-[10px] font-bold bg-[#172B82] text-white px-2 py-0.5 rounded-full">
              LIVE TERMINAL
            </span>
          </div>
          <p className="text-xs text-[#687085]">
            High-speed barcode checkout with real-time stock deduction and GST invoices.
          </p>
        </div>

        {/* View Switcher: POS Terminal vs Invoice History */}
        <div className="flex items-center gap-1.5 bg-[#FFFCF5] p-1 rounded-2xl border border-[#DDD7CA] self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('POS');
              setCompletedSale(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'POS'
                ? 'bg-[#172B82] text-white shadow-xs'
                : 'text-[#687085] hover:text-[#172033]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>POS Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('INVOICES')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'INVOICES'
                ? 'bg-[#172B82] text-white shadow-xs'
                : 'text-[#687085] hover:text-[#172033]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoices Ledger ({invoices.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW A: COMPLETED SALE CONFIRMATION SCREEN
         ========================================================================= */}
      {completedSale && activeTab === 'POS' && (
        <motion.div
          variants={modalVariants}
          initial="initial"
          animate="animate"
          className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-10 shadow-lg space-y-6 max-w-2xl mx-auto text-center"
        >
          {/* Animated Success Checkmark */}
          <motion.div
            variants={paymentSuccess}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto shadow-inner"
          >
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </motion.div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033]">
              Payment Successful!
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#172B82]">
              Bill #{completedSale.invoice.invoiceNumber}
            </p>
            <p className="text-xs text-[#687085]">
              Inventory successfully reduced & auditable transaction recorded in ledger.
            </p>
          </div>

          {/* Receipt Breakdown Box */}
          <div className="bg-[#FFFCF5] p-5 rounded-2xl border border-[#DDD7CA] text-xs space-y-3 text-left">
            <div className="flex justify-between border-b border-[#DDD7CA] pb-2 text-[11px] text-[#687085]">
              <span>Customer: <strong className="text-[#172033]">{completedSale.invoice.customerName}</strong></span>
              <span>{completedSale.invoice.date}</span>
            </div>

            <div className="space-y-1.5 divide-y divide-[#DDD7CA]/50">
              {completedSale.invoice.items.map((item, idx) => (
                <div key={idx} className="pt-1.5 flex justify-between">
                  <div>
                    <span className="font-bold text-[#172033]">{item.name}</span>
                    <span className="text-[10px] text-[#687085] block font-mono">
                      {item.color} · Size {item.size} • Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-[#172033]">₹{item.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#DDD7CA] space-y-1">
              <div className="flex justify-between text-[#687085]">
                <span>Apparel GST (5% Included)</span>
                <span>₹{completedSale.invoice.taxAmount}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#172033]">
                <span>Total Amount Paid</span>
                <span className="text-[#172B82]">₹{completedSale.invoice.finalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#687085] pt-1">
                <span>Payment Method</span>
                <span className="font-bold text-emerald-700">{completedSale.invoice.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={`/vendor/billing/${completedSale.invoice.id}`}
              className="wn-btn-secondary text-xs sm:text-sm py-2.5 px-4 flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-[#172B82]" />
              <span>View Full Tax Invoice</span>
            </Link>

            <button
              onClick={() => window.print()}
              className="wn-btn-secondary text-xs sm:text-sm py-2.5 px-4 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={() => {
                setCompletedSale(null);
                setCart([]);
              }}
              className="wn-btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Start Next Bill</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          VIEW B: POS TERMINAL INTERFACE
         ========================================================================= */}
      {!completedSale && activeTab === 'POS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT COLUMN (7 COLS): Product Search, Barcode Scanning, and Cart Items */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Quick Scan Bar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-[#DDD7CA] shadow-xs flex flex-wrap items-center justify-between gap-3">
              {/* Prominent SCAN PRODUCT Button */}
              <motion.button
                variants={buttonTapVariants}
                whileTap="tap"
                onClick={() => setIsScannerOpen(!isScannerOpen)}
                className={`py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md ${
                  isScannerOpen
                    ? 'bg-[#172033] text-white shadow-black/20'
                    : 'bg-[#172B82] hover:bg-[#243FBA] text-white shadow-[#172B82]/20'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{isScannerOpen ? 'Close Camera Scanner' : 'SCAN PRODUCT (F4)'}</span>
              </motion.button>

              <span className="text-[11px] text-[#687085] hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 bg-[#F5F0E6] rounded border border-[#DDD7CA] font-mono text-[10px]">F2</kbd> to type barcode • <kbd className="px-1.5 py-0.5 bg-[#F5F0E6] rounded border border-[#DDD7CA] font-mono text-[10px]">Cmd+Enter</kbd> to bill
              </span>
            </div>

            {/* In-Line Camera Scanner (when toggled open) */}
            <AnimatePresence>
              {isScannerOpen && (
                <motion.div
                  variants={slideUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-white p-4 rounded-3xl border border-[#DDD7CA] shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD7CA]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
                      <span className="text-xs font-bold text-[#172033]">
                        High-Speed Continuous Scanner Active
                      </span>
                    </div>
                    <button
                      onClick={() => setIsScannerOpen(false)}
                      className="text-xs text-[#687085] hover:text-[#172033]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <BarcodeScanner
                    onScan={handleRapidScan}
                    continuous={true}
                    pauseDurationMs={1100}
                    showSimulatedBarcodes={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Manual Barcode & Product Search Bar */}
            <div className="bg-white p-3.5 rounded-3xl border border-[#DDD7CA] shadow-xs flex items-center gap-2">
              <div className="relative flex-1">
                <Barcode className="w-4 h-4 text-[#687085] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={barcodeInputRef}
                  type="text"
                  placeholder="Scan or type barcode / SKU / product name... (F2)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      e.preventDefault();
                      handleRapidScan(searchQuery.trim());
                      setSearchQuery('');
                    }
                  }}
                  className="wn-input pl-9 text-xs"
                />
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 text-[#687085] hover:text-[#172033]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown (if user is typing query) */}
            {searchQuery.trim().length > 1 && (
              <motion.div
                variants={slideUp}
                initial="initial"
                animate="animate"
                className="bg-white rounded-3xl border border-[#DDD7CA] p-3 shadow-lg space-y-2 max-h-64 overflow-y-auto"
              >
                <div className="text-[11px] font-bold text-[#687085] px-2 flex justify-between">
                  <span>Matching Store Garments ({filteredProducts.length})</span>
                  <span>Click to add to bill</span>
                </div>

                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 rounded-xl hover:bg-[#FFFCF5] border border-transparent hover:border-[#DDD7CA] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover border" />
                      <div className="min-w-0">
                        <p className="font-bold text-[#172033] truncate">{p.name}</p>
                        <p className="text-[10px] text-[#687085]">SKU: {p.sku} • Stock: {p.stock}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {p.variants && p.variants.length > 0 ? (
                        <div className="flex gap-1">
                          {p.variants.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => {
                                handleAddToCart(p, v);
                                setSearchQuery('');
                              }}
                              disabled={v.stock <= 0}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                v.stock <= 0
                                  ? 'bg-[#DDD7CA]/30 text-[#687085] cursor-not-allowed'
                                  : 'bg-[#172B82]/10 text-[#172B82] border-[#172B82]/20 hover:bg-[#172B82] hover:text-white'
                              }`}
                            >
                              {v.size} (₹{v.price})
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            handleAddToCart(p);
                            setSearchQuery('');
                          }}
                          className="wn-btn-primary text-[11px] py-1 px-2.5"
                        >
                          + Add (₹{p.sellingPrice})
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* CART ITEMS CONTAINER */}
            <div className="bg-white rounded-3xl border border-[#DDD7CA] shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#DDD7CA] flex items-center justify-between bg-[#FFFCF5]">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#172B82]" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#172033]">
                    Current Bill Items ({cart.reduce((sum, i) => sum + i.quantity, 0)} Units)
                  </h3>
                </div>

                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-[11px] font-semibold text-[#DC2626] hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Bill
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA] text-[#687085] flex items-center justify-center mx-auto opacity-70">
                    <Barcode className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#172033]">
                    Bill is empty
                  </h4>
                  <p className="text-[11px] text-[#687085] max-w-xs mx-auto">
                    Tap <strong className="text-[#172B82]">SCAN PRODUCT</strong> or type barcode to add garments to this customer's bill.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#DDD7CA]/60 max-h-[500px] overflow-y-auto">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={cardInteractiveVariants}
                      className="p-3.5 sm:p-4 hover:bg-[#FFFCF5] transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-12 rounded-xl object-cover border border-[#DDD7CA] shrink-0"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <p className="font-bold text-[#172033] truncate">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#687085]">
                            <span className="font-semibold text-[#172033]">
                              {item.color} · Size {item.size}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[10px]">{item.barcode}</span>
                          </div>
                          <p className="text-[10px] text-emerald-700 font-medium">
                            Shelf Stock Available: {item.availableStock}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Quantity Controller */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-[#FFFCF5] border border-[#DDD7CA] p-1 rounded-xl">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#DDD7CA] hover:bg-[#F5F0E6] text-[#172033] flex items-center justify-center"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </motion.button>

                        <span className="w-7 text-center font-bold text-xs text-[#172033]">
                          {item.quantity}
                        </span>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          disabled={item.quantity >= item.availableStock}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                            item.quantity >= item.availableStock
                              ? 'bg-[#DDD7CA]/30 text-[#687085] cursor-not-allowed'
                              : 'bg-white border-[#DDD7CA] hover:bg-[#F5F0E6] text-[#172033]'
                          }`}
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>

                      {/* Right: Price & Remove */}
                      <div className="text-right shrink-0 min-w-[70px]">
                        <span className="font-extrabold text-sm text-[#172033] block">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#687085] block">
                          @ ₹{item.unitPrice}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-[#687085] hover:text-[#DC2626] rounded-lg transition-colors shrink-0"
                        title="Remove garment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (5 COLS): Customer Details, Bill Calculation & Payment */}
          <div className="lg:col-span-5 space-y-4">
            {/* Customer Information Card */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-[#172033] flex items-center justify-between border-b border-[#DDD7CA] pb-2">
                <span>Customer Particulars (Optional)</span>
                <span className="text-[10px] text-[#687085] font-normal">For digital receipt</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="wn-label">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Walk-in Customer"
                    className="wn-input text-xs"
                  />
                </div>
                <div>
                  <label className="wn-label">Phone Number</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="wn-input text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bill Summary & Breakdown */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-[#172033] border-b border-[#DDD7CA] pb-2">
                Bill Summary & Calculations
              </h3>

              {/* Promo Discount Selector */}
              <div className="flex items-center justify-between">
                <span className="text-[#687085]">Store Promo Discount</span>
                <div className="flex items-center gap-1">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDiscountPercent(pct)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        discountPercent === pct
                          ? 'bg-[#172B82] text-white border-[#172B82]'
                          : 'bg-[#FFFCF5] text-[#687085] border-[#DDD7CA]'
                      }`}
                    >
                      {pct === 0 ? 'None' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculations List */}
              <div className="space-y-1.5 pt-2 border-t border-[#DDD7CA]/70 text-[#687085]">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-[#172033]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-₹{promoDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Apparel GST (5% Included)</span>
                  <span className="font-semibold text-[#172033]">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-[#DDD7CA] flex justify-between items-baseline text-sm font-extrabold text-[#172033]">
                  <span>Total Amount Due</span>
                  <span className="text-[#172B82] text-xl sm:text-2xl font-black">
                    ₹{finalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Mode Selector & Confirm Action */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-[#172033]">Select Payment Method</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'CASH', label: 'Cash', icon: Banknote },
                  { id: 'CARD', label: 'Card Swipe', icon: CreditCard },
                  { id: 'ONLINE', label: 'Digital', icon: Globe }
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-[#172B82] text-white border-[#172B82] shadow-sm'
                          : 'bg-[#FFFCF5] text-[#172033] border-[#DDD7CA] hover:bg-[#F5F0E6]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] font-bold">{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Complete Bill Confirmation Button */}
              <motion.button
                variants={buttonTapVariants}
                whileTap="tap"
                disabled={cart.length === 0 || isProcessing}
                onClick={handleConfirmPayment}
                className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  cart.length === 0
                    ? 'bg-[#DDD7CA] text-[#687085] cursor-not-allowed shadow-none'
                    : 'bg-[#16A34A] hover:bg-emerald-700 text-white shadow-emerald-600/30'
                }`}
              >
                {isProcessing ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                <span>
                  {isProcessing
                    ? 'Deducting Stock & Confirming Sale...'
                    : `Confirm Payment & Generate Bill (₹${finalAmount.toLocaleString('en-IN')})`}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW C: INVOICES AUDIT ARCHIVE
         ========================================================================= */}
      {activeTab === 'INVOICES' && (
        <div className="space-y-4">
          <div className="hidden md:block bg-white rounded-3xl border border-[#DDD7CA] shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Tax (GST)</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD7CA]/60">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FFFCF5] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#172B82]">
                      <Link to={`/vendor/billing/${inv.id}`} className="hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#172033]">
                      {inv.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-[#687085]">{inv.date}</td>
                    <td className="py-3 px-4 font-semibold text-[#172033]">{inv.customerName}</td>
                    <td className="py-3 px-4 text-[#687085]">₹{inv.taxAmount}</td>
                    <td className="py-3 px-4 font-bold text-[#172033]">₹{inv.finalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inv.paymentStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/vendor/billing/${inv.id}`}
                        className="wn-btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-[#172B82]" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Invoices Cards */}
          <div className="md:hidden space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white p-4 rounded-2xl border border-[#DDD7CA] shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172B82]">{inv.invoiceNumber}</span>
                  <StatusBadge status={inv.paymentStatus} size="sm" />
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="font-bold text-[#172033]">{inv.customerName}</p>
                    <p className="text-[11px] text-[#687085]">{inv.orderNumber} • {inv.date}</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#172033]">
                    ₹{inv.finalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#DDD7CA] flex justify-end">
                  <Link to={`/vendor/billing/${inv.id}`} className="wn-btn-secondary text-xs py-1 px-3">
                    View Receipt
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};
