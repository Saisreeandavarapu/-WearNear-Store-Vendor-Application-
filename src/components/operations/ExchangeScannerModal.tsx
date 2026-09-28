import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Check, ArrowRight, AlertCircle, ShoppingCart } from 'lucide-react';
import { BarcodeScanner } from '../barcode/BarcodeScanner';
import { BarcodeInput } from '../barcode/BarcodeInput';
import { findProductByBarcode } from '../../utils/barcodeUtils';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { modalVariants, backdropVariants } from '../../utils/animations';
import { Product, ProductVariant } from '../../types';

interface ExchangeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExchangeScannerModal: React.FC<ExchangeScannerModalProps> = ({ isOpen, onClose }) => {
  const { products, processBarcodeExchange } = useData();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [step, setStep] = useState<'RETURN_ITEM' | 'REPLACEMENT_ITEM' | 'CONFIRM'>('RETURN_ITEM');
  const [returnedBarcode, setReturnedBarcode] = useState<string>('');
  const [returnedItem, setReturnedItem] = useState<{ product: Product; variant?: ProductVariant } | null>(null);

  const [replacementBarcode, setReplacementBarcode] = useState<string>('');
  const [replacementItem, setReplacementItem] = useState<{ product: Product; variant?: ProductVariant } | null>(null);

  const [orderNumber, setOrderNumber] = useState<string>('#WN-EXC-8890');
  const [customerName, setCustomerName] = useState<string>('Store Customer');

  const handleReturnScan = (code: string) => {
    const match = findProductByBarcode(code, products);
    if (match) {
      setReturnedBarcode(code);
      setReturnedItem(match);
      setStep('REPLACEMENT_ITEM');
      success('Returned Item Scanned', `${match.product.name} (${match.variant?.size || 'Standard'}) recorded.`);
    } else {
      error('Barcode Not Found', `No garment registered with barcode ${code}.`);
    }
  };

  const handleReplacementScan = (code: string) => {
    const match = findProductByBarcode(code, products);
    if (match) {
      const stock = match.variant ? (match.variant.availableStock ?? match.variant.stock) : match.product.stock;
      if (stock <= 0) {
        error('Replacement Out of Stock', `Item "${match.product.name}" is sold out. Please scan another size or garment.`);
        return;
      }
      setReplacementBarcode(code);
      setReplacementItem(match);
      setStep('CONFIRM');
      success('Replacement Scanned', `${match.product.name} (${match.variant?.size || 'Standard'}) in stock.`);
    } else {
      error('Barcode Not Found', `No garment registered with barcode ${code}.`);
    }
  };

  const handleExecuteExchange = () => {
    if (!returnedBarcode || !replacementBarcode) return;

    const res = processBarcodeExchange({
      orderNumber,
      customerName,
      returnedBarcode,
      replacementBarcode,
      operatorName: user?.name || 'Store Cashier'
    });

    if (res.success) {
      success('Exchange Completed', 'Old variant returned (+1) and replacement deducted (-1).');
      onClose();
    } else {
      error('Exchange Failed', res.error || 'Unable to complete exchange.');
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
          className="relative w-full max-w-xl bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl p-5 sm:p-7 z-10 space-y-4 max-h-[92vh] overflow-y-auto text-xs"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD7CA]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                  Barcode Size & Fit Exchange
                </h3>
                <p className="text-[11px] text-[#687085]">
                  Step {step === 'RETURN_ITEM' ? '1: Scan Returned Item' : step === 'REPLACEMENT_ITEM' ? '2: Scan Replacement Item' : '3: Confirm Swapped Stock'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl text-[#687085] hover:text-[#172033] hover:bg-[#F5F0E6]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-between p-2.5 bg-[#FFFCF5] rounded-xl border border-[#DDD7CA]">
            <div className={`flex items-center gap-1.5 ${step === 'RETURN_ITEM' ? 'text-[#172B82] font-bold' : 'text-emerald-700'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'RETURN_ITEM' ? 'bg-[#172B82] text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                1
              </span>
              <span>Scan Return</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#687085]" />
            <div className={`flex items-center gap-1.5 ${step === 'REPLACEMENT_ITEM' ? 'text-[#172B82] font-bold' : step === 'CONFIRM' ? 'text-emerald-700' : 'text-[#687085]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'REPLACEMENT_ITEM' ? 'bg-[#172B82] text-white' : step === 'CONFIRM' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#DDD7CA] text-[#687085]'}`}>
                2
              </span>
              <span>Scan Replacement</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#687085]" />
            <div className={`flex items-center gap-1.5 ${step === 'CONFIRM' ? 'text-[#172B82] font-bold' : 'text-[#687085]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'CONFIRM' ? 'bg-[#172B82] text-white' : 'bg-[#DDD7CA] text-[#687085]'}`}>
                3
              </span>
              <span>Confirm</span>
            </div>
          </div>

          {/* STEP 1: Scan Returned Item */}
          {step === 'RETURN_ITEM' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-800 text-[11px]">
                Point camera or scanner at the product barcode tag of the item customer is returning.
              </div>
              <BarcodeScanner onScan={handleReturnScan} showSimulatedBarcodes={true} />
              <BarcodeInput onSearch={handleReturnScan} placeholder="Or enter returned barcode..." />
            </div>
          )}

          {/* STEP 2: Scan Replacement Item */}
          {step === 'REPLACEMENT_ITEM' && (
            <div className="space-y-4">
              {returnedItem && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold block">Return Item:</span>
                    <strong className="text-xs">{returnedItem.product.name}</strong> ({returnedItem.variant?.size || 'Standard'})
                  </div>
                  <button onClick={() => setStep('RETURN_ITEM')} className="text-[11px] underline font-bold">
                    Change
                  </button>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl text-blue-800 text-[11px]">
                Now scan the new garment or size from the store shelf to issue to the customer.
              </div>
              <BarcodeScanner onScan={handleReplacementScan} showSimulatedBarcodes={true} />
              <BarcodeInput onSearch={handleReplacementScan} placeholder="Or enter replacement barcode..." />
            </div>
          )}

          {/* STEP 3: Confirm Swapped Stock */}
          {step === 'CONFIRM' && returnedItem && replacementItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FFFCF5] rounded-2xl border border-[#DDD7CA]">
                {/* Old Item */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-50 px-1.5 py-0.5 rounded">
                    Returning (+1 Stock)
                  </span>
                  <p className="font-bold text-[#172033] line-clamp-1">{returnedItem.product.name}</p>
                  <p className="text-[#687085] text-[11px]">Size {returnedItem.variant?.size || 'Standard'}</p>
                  <p className="font-mono text-[10px] text-[#687085]">{returnedBarcode}</p>
                </div>

                {/* New Item */}
                <div className="space-y-1 border-l border-[#DDD7CA] pl-3">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                    Replacement (-1 Stock)
                  </span>
                  <p className="font-bold text-[#172033] line-clamp-1">{replacementItem.product.name}</p>
                  <p className="text-[#687085] text-[11px]">Size {replacementItem.variant?.size || 'Standard'}</p>
                  <p className="font-mono text-[10px] text-[#687085]">{replacementBarcode}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="wn-label">Order # / Reference</label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="wn-input font-mono"
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

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#DDD7CA]">
                <button type="button" onClick={() => setStep('REPLACEMENT_ITEM')} className="wn-btn-secondary text-xs">
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleExecuteExchange}
                  className="wn-btn-primary text-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Exchange & Sync Ledger</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
