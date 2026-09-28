import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Barcode,
  Keyboard,
  History,
  ShoppingCart,
  PlusCircle,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Printer,
  Sparkles,
  Layers,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { BarcodeScanner } from '../../components/barcode/BarcodeScanner';
import { BarcodeInput } from '../../components/barcode/BarcodeInput';
import { BarcodeProductCard } from '../../components/barcode/BarcodeProductCard';
import { StockAdjustmentModal } from '../../components/inventory/StockAdjustmentModal';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { findProductByBarcode } from '../../utils/barcodeUtils';
import { Product, ProductVariant, ScannedBarcodeRecord } from '../../types';
import { slideUp, scannerError, buttonTapVariants } from '../../utils/animations';

export const BarcodeScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, recentScans, addRecentScan, clearRecentScans } = useData();
  const { success, error } = useToast();

  const [activeBarcode, setActiveBarcode] = useState<string>('');
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
  const [matchedVariant, setMatchedVariant] = useState<ProductVariant | null>(null);
  const [isUnknown, setIsUnknown] = useState<boolean>(false);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [stockAdjustmentItem, setStockAdjustmentItem] = useState<{ product: Product; variant?: ProductVariant } | null>(null);

  const handleBarcodeScanned = (barcode: string) => {
    setActiveBarcode(barcode);
    setIsUnknown(false);

    const match = findProductByBarcode(barcode, products);
    if (match) {
      setMatchedProduct(match.product);
      setMatchedVariant(match.variant || null);

      // Record in recent scans history
      const scanRecord: ScannedBarcodeRecord = {
        id: `scan_${Date.now()}`,
        barcode,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        product: match.product,
        variant: match.variant,
        actionTaken: 'INSPECTED'
      };
      addRecentScan(scanRecord);
    } else {
      setMatchedProduct(null);
      setMatchedVariant(null);
      setIsUnknown(true);
    }
  };

  const handleAddToBill = () => {
    if (!matchedProduct) return;
    const effectiveStock = matchedVariant ? (matchedVariant.availableStock ?? matchedVariant.stock) : matchedProduct.stock;
    if (effectiveStock <= 0) {
      error('Cannot Add to Bill', 'This product is out of stock.');
      return;
    }

    // Pass scanned product to billing POS via state
    navigate('/vendor/billing', {
      state: {
        autoAddItem: {
          productId: matchedProduct.id,
          variantId: matchedVariant?.id,
          barcode: activeBarcode || matchedVariant?.barcode || matchedProduct.barcode
        }
      }
    });
    success('Product Added to POS', `${matchedProduct.name} transferred to POS terminal.`);
  };

  const handleResetScan = () => {
    setActiveBarcode('');
    setMatchedProduct(null);
    setMatchedVariant(null);
    setIsUnknown(false);
  };

  return (
    <AnimatedPage className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-[#DDD7CA] bg-white hover:bg-[#F5F0E6] text-[#172033] transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#172033] tracking-tight">
              Scan Product Barcode
            </h1>
            <p className="text-xs text-[#687085]">
              Real-time inventory lookup & POS cart integration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/vendor/billing"
            className="wn-btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#172B82]" />
            <span className="hidden sm:inline">Go to POS</span>
          </Link>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Scanner (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          <BarcodeScanner
            onScan={handleBarcodeScanned}
            continuous={false}
            showSimulatedBarcodes={true}
          />

          {/* Quick Manual Entry Trigger Bar */}
          <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-[#DDD7CA] shadow-2xs">
            <span className="text-xs font-semibold text-[#687085] flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-[#172B82]" />
              Physical barcode tag unreadable?
            </span>
            <button
              onClick={() => setShowManualModal(!showManualModal)}
              className="text-xs font-bold text-[#172B82] hover:underline"
            >
              {showManualModal ? 'Hide Manual Input' : 'Enter Barcode Manually'}
            </button>
          </div>

          {/* Manual Input Expandable Drawer */}
          <AnimatePresence>
            {showManualModal && (
              <motion.div
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-4 bg-white rounded-2xl border border-[#DDD7CA] shadow-sm space-y-2"
              >
                <span className="text-xs font-bold text-[#172033] block">
                  Manual Barcode / SKU Lookup
                </span>
                <BarcodeInput
                  onSearch={handleBarcodeScanned}
                  autoFocus={true}
                  placeholder="Type 13-digit EAN, UPC, or SKU..."
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Scan Result / Unknown State / Recent Scans (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* STATE 1: Product Found */}
          {matchedProduct && (
            <BarcodeProductCard
              product={matchedProduct}
              variant={matchedVariant || undefined}
              barcode={activeBarcode}
              onAddToBill={handleAddToBill}
              onPrintLabel={() => navigate(`/vendor/products/barcode-labels?sku=${matchedVariant?.sku || matchedProduct.sku}`)}
              onAdjustStock={() => setStockAdjustmentItem({ product: matchedProduct, variant: matchedVariant || undefined })}
            />
          )}

          {/* STATE 2: Unknown Barcode */}
          {isUnknown && (
            <motion.div
              variants={scannerError}
              initial="initial"
              animate="animate"
              className="bg-white rounded-3xl border border-rose-200 p-5 sm:p-6 shadow-sm space-y-3.5 text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#DC2626] flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#172033]">
                  Barcode Not Found
                </h3>
                <p className="text-xs text-[#687085] mt-1 leading-relaxed">
                  Barcode <strong className="font-mono text-[#172033]">{activeBarcode}</strong> is not linked to any active WearNear garment or variant in this store.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link
                  to={`/vendor/products/add?barcode=${activeBarcode}`}
                  className="wn-btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5 flex-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Product with This Barcode</span>
                </Link>

                <button
                  type="button"
                  onClick={handleResetScan}
                  className="wn-btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 flex-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Enter Barcode Again</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 3: Idle / Recent Scans List */}
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD7CA]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#172B82]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#172033]">
                  Recent Session Scans ({recentScans.length})
                </h3>
              </div>

              {recentScans.length > 0 && (
                <button
                  onClick={clearRecentScans}
                  className="text-[11px] text-[#687085] hover:text-[#DC2626] flex items-center gap-1"
                  title="Clear scan history"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {recentScans.length === 0 ? (
              <div className="py-8 text-center text-[#687085] space-y-1">
                <Barcode className="w-8 h-8 mx-auto opacity-30 text-[#172B82]" />
                <p className="text-xs font-semibold">No products scanned yet</p>
                <p className="text-[11px] opacity-75">
                  Point camera at garment tag or use 1-click test buttons.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {recentScans.map((scan) => (
                  <motion.div
                    key={scan.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBarcodeScanned(scan.barcode)}
                    className="p-2.5 rounded-2xl border border-[#DDD7CA]/70 hover:border-[#172B82] bg-[#FFFCF5] hover:bg-[#F5F0E6] cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={scan.product.images[0]}
                        alt={scan.product.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[#DDD7CA] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#172033] truncate">{scan.product.name}</p>
                        <p className="text-[10px] text-[#687085] font-mono">
                          {scan.barcode} • {scan.variant ? `Size ${scan.variant.size}` : 'Standard'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-[#172033]">
                        ₹{(scan.variant?.price || scan.product.sellingPrice).toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[9px] text-[#687085]">{scan.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {stockAdjustmentItem && (
        <StockAdjustmentModal
          isOpen={true}
          onClose={() => setStockAdjustmentItem(null)}
          product={stockAdjustmentItem.product}
          variant={stockAdjustmentItem.variant}
        />
      )}
    </AnimatedPage>
  );
};
