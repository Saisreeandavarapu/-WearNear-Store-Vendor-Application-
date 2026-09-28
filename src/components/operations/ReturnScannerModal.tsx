import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, AlertCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import { BarcodeScanner } from '../barcode/BarcodeScanner';
import { BarcodeInput } from '../barcode/BarcodeInput';
import { findProductByBarcode } from '../../utils/barcodeUtils';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { modalVariants, backdropVariants } from '../../utils/animations';
import { Product, ProductVariant } from '../../types';

interface ReturnScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReturnScannerModal: React.FC<ReturnScannerModalProps> = ({ isOpen, onClose }) => {
  const { products, invoices, processBarcodeReturn } = useData();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [scannedBarcode, setScannedBarcode] = useState<string>('');
  const [identifiedProduct, setIdentifiedProduct] = useState<Product | null>(null);
  const [identifiedVariant, setIdentifiedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('SIZE_FIT');
  const [reasonText, setReasonText] = useState<string>('Garment size fit issue, returned in unused condition');
  const [orderNumber, setOrderNumber] = useState<string>('#WN-POS-RET');
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');
  const [manualInputOpen, setManualInputOpen] = useState(false);

  const handleBarcodeIdentified = (code: string) => {
    setScannedBarcode(code);
    const match = findProductByBarcode(code, products);
    if (match) {
      setIdentifiedProduct(match.product);
      setIdentifiedVariant(match.variant || null);

      // Check if there is an invoice with this product
      const matchingInv = invoices.find((inv) =>
        inv.items.some((item) => item.sku === (match.variant?.sku || match.product.sku))
      );
      if (matchingInv) {
        setOrderNumber(matchingInv.orderNumber);
        setCustomerName(matchingInv.customerName);
      }
    } else {
      error('Barcode Not Found', `No garment found with barcode ${code}.`);
    }
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifiedProduct) return;

    const unitPrice = identifiedVariant?.price || identifiedProduct.sellingPrice;
    const ok = processBarcodeReturn({
      orderNumber: orderNumber || '#WN-RET-MANUAL',
      customerName: customerName || 'Retail Customer',
      productName: identifiedProduct.name,
      sku: identifiedVariant?.sku || identifiedProduct.sku,
      barcode: scannedBarcode || identifiedVariant?.barcode || identifiedProduct.barcode || 'NO_BARCODE',
      productId: identifiedProduct.id,
      variantId: identifiedVariant?.id,
      quantity,
      reason: reason as any,
      reasonText,
      amount: unitPrice * quantity,
      operatorName: user?.name || 'Store Cashier'
    });

    if (ok) {
      success('Return Processed & Restored', `${quantity} unit(s) restored to shelf inventory.`);
      onClose();
    } else {
      error('Return Failed', 'Unable to process reverse logistics.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-[#172033]/65 backdrop-blur-sm"
        />

        <motion.div
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full max-w-xl bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl p-5 sm:p-7 z-10 space-y-4 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD7CA]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                  Scan Barcode to Process Return
                </h3>
                <p className="text-[11px] text-[#687085]">
                  Identify garment, validate invoice, and restore shelf inventory
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl text-[#687085] hover:text-[#172033] hover:bg-[#F5F0E6]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!identifiedProduct ? (
            <div className="space-y-4">
              <BarcodeScanner onScan={handleBarcodeIdentified} showSimulatedBarcodes={true} />

              <div className="pt-2">
                <BarcodeInput onSearch={handleBarcodeIdentified} placeholder="Or enter returned barcode..." />
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs">
              {/* Identified Product Card */}
              <div className="p-3.5 bg-[#FFFCF5] rounded-2xl border border-[#DDD7CA] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#16A34A] flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Garment Identified
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifiedProduct(null);
                      setIdentifiedVariant(null);
                    }}
                    className="text-[11px] font-bold text-[#172B82] hover:underline"
                  >
                    Rescan
                  </button>
                </div>

                <div className="flex gap-3 pt-1">
                  <img
                    src={identifiedProduct.images[0]}
                    alt={identifiedProduct.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#DDD7CA]"
                  />
                  <div>
                    <h4 className="font-bold text-[#172033]">{identifiedProduct.name}</h4>
                    <p className="text-[#687085] text-[11px]">
                      {identifiedVariant ? `${identifiedVariant.color} · Size ${identifiedVariant.size}` : 'Standard'} • SKU: {identifiedVariant?.sku || identifiedProduct.sku}
                    </p>
                    <p className="text-xs font-extrabold text-[#172033] mt-1">
                      Refund Unit Value: ₹{(identifiedVariant?.price || identifiedProduct.sellingPrice).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="wn-label">Original Order / Invoice #</label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="wn-input font-mono"
                    placeholder="e.g. #WN-8802 or WN-INV-0412"
                  />
                </div>
                <div>
                  <label className="wn-label">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="wn-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="wn-label">Units to Return</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="wn-input font-bold"
                  />
                </div>
                <div>
                  <label className="wn-label">Reason</label>
                  <select value={reason} onChange={(e) => setReason(e.target.value)} className="wn-input">
                    <option value="SIZE_FIT">Size / Fit Issue</option>
                    <option value="DEFECTIVE">Defective / Stitch Issue</option>
                    <option value="COLOR_MISMATCH">Color Shade Mismatch</option>
                    <option value="FABRIC_QUALITY">Fabric Quality Expectation</option>
                    <option value="CHANGED_MIND">Customer Changed Mind</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="wn-label">Inspection & Condition Notes</label>
                <input
                  type="text"
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                  className="wn-input"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between text-xs">
                <span>Total Refund Credit:</span>
                <span className="font-extrabold text-sm">
                  ₹{(((identifiedVariant?.price || identifiedProduct.sellingPrice) * quantity)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#DDD7CA]">
                <button type="button" onClick={onClose} className="wn-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="wn-btn-primary text-xs flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Confirm Return & Restore Stock (+{quantity})</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
