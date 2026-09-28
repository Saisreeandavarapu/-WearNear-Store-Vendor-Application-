import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, AlertCircle, Check, ArrowRight } from 'lucide-react';
import { Product, ProductVariant, InventoryTransactionType } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { modalVariants, backdropVariants } from '../../utils/animations';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  variant?: ProductVariant;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  product,
  variant
}) => {
  const { performManualStockAdjustment } = useData();
  const { user } = useAuth();
  const { success, error } = useToast();

  const currentStock = variant ? (variant.availableStock ?? variant.stock) : product.stock;
  const [adjustmentType, setAdjustmentType] = useState<InventoryTransactionType>('STOCK_ADDED');
  const [quantity, setQuantity] = useState<number>(5);
  const [reason, setReason] = useState<string>('Inward consignment verification');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const delta = adjustmentType === 'STOCK_ADDED' || adjustmentType === 'RESTORED' ? quantity : -quantity;
  const newStock = Math.max(0, currentStock + delta);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      error('Invalid Quantity', 'Adjustment quantity must be at least 1.');
      return;
    }

    if (currentStock + delta < 0) {
      error('Negative Stock Forbidden', `Cannot deduct ${quantity} units when only ${currentStock} are available.`);
      return;
    }

    setIsSubmitting(true);
    const res = performManualStockAdjustment({
      productId: product.id,
      variantId: variant?.id,
      change: delta,
      type: adjustmentType,
      reason: reason || 'Manual stock adjustment',
      operatorName: user?.name || 'Store Staff'
    });

    setIsSubmitting(false);

    if (res.success) {
      success('Stock Adjusted', `${product.name} stock updated to ${newStock} units.`);
      onClose();
    } else {
      error('Adjustment Failed', res.error || 'Unable to update stock.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-[#172033]/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full max-w-lg bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl p-5 sm:p-7 z-10 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD7CA]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                  Adjust Physical Inventory
                </h3>
                <p className="text-[11px] text-[#687085]">
                  Creates an auditable ledger entry for store stock
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#687085] hover:text-[#172033] hover:bg-[#F5F0E6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Banner */}
          <div className="p-3 bg-[#FFFCF5] rounded-2xl border border-[#DDD7CA] text-xs">
            <span className="font-bold text-[#172033] block truncate">{product.name}</span>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#687085]">
              {variant && (
                <span>
                  {variant.color} • Size {variant.size}
                </span>
              )}
              <span>• SKU: {variant?.sku || product.sku}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Adjustment Type Selector */}
            <div>
              <label className="wn-label">Adjustment Type</label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as InventoryTransactionType)}
                className="wn-input"
              >
                <option value="STOCK_ADDED">Stock Added / Shipment Inward (+)</option>
                <option value="STOCK_DEDUCTED">Stock Deducted / Manual Shrinkage (-)</option>
                <option value="MANUAL_ADJUSTMENT">Manual Cycle Count Adjustment</option>
                <option value="DAMAGED">Damaged / Quality Rejection (-)</option>
                <option value="EXPIRED">Defective / Unsellable (-)</option>
                <option value="RESTORED">Restored / Return Approval (+)</option>
              </select>
            </div>

            {/* Quantity Input */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="wn-label">Change Units</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="wn-input text-base font-bold"
                />
              </div>

              <div>
                <label className="wn-label">Resulting Stock</label>
                <div className="wn-input bg-[#FFFCF5] flex items-center justify-between font-mono font-bold text-sm">
                  <span className="text-[#687085]">{currentStock}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#687085]" />
                  <span className={newStock === 0 ? 'text-[#DC2626]' : 'text-[#172B82]'}>
                    {newStock} Units
                  </span>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="wn-label">Auditable Reason / Note</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Physical shelf count discrepancy, supplier batch correction..."
                className="wn-input"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DDD7CA]">
              <button
                type="button"
                onClick={onClose}
                className="wn-btn-secondary text-xs flex-1 sm:flex-initial"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="wn-btn-primary text-xs flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Confirm & Record Transaction</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
