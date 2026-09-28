import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  ArrowLeft,
  PlusCircle,
  MinusCircle,
  Clock,
  ShieldAlert,
  FileSpreadsheet,
  Search,
  Barcode,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Printer,
  Sliders,
  X
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { StockAdjustmentModal } from '../../components/inventory/StockAdjustmentModal';
import { useData } from '../../context/DataContext';
import { InventoryTransactionType } from '../../types';
import { staggerContainer, cardInteractiveVariants, buttonTapVariants } from '../../utils/animations';

export const InventoryTransactionsPage: React.FC = () => {
  const { inventoryTransactions, products } = useData();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [selectedProductForAdj, setSelectedProductForAdj] = useState(products[0]);

  const filtered = inventoryTransactions.filter((tx) => {
    const matchesFilter = filterType === 'ALL' || tx.type === filterType;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;

    const matchesSearch =
      tx.productName.toLowerCase().includes(q) ||
      tx.sku.toLowerCase().includes(q) ||
      (tx.barcode && tx.barcode.toLowerCase().includes(q)) ||
      (tx.reference && tx.reference.toLowerCase().includes(q)) ||
      tx.reason.toLowerCase().includes(q) ||
      tx.performedBy.toLowerCase().includes(q) ||
      tx.id.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const getBadgeStyle = (type: InventoryTransactionType) => {
    switch (type) {
      case 'SOLD':
        return 'bg-[#172B82]/10 text-[#172B82] border-[#172B82]/20';
      case 'STOCK_ADDED':
      case 'RESTORED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'RETURNED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESERVED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'STOCK_DEDUCTED':
      case 'DAMAGED':
      case 'EXPIRED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'MANUAL_ADJUSTMENT':
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  return (
    <AnimatedPage className="space-y-6 pb-24 md:pb-8">
      <PageHeader
        title="Inventory Audit Ledger"
        subtitle="Complete chronological audit trail of barcode retail sales, stock adjustments, returns, and shipments."
        breadcrumbs={[
          { label: 'Inventory', path: '/vendor/inventory' },
          { label: 'Audit Ledger' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <motion.button
              variants={buttonTapVariants}
              whileTap="tap"
              onClick={() => setIsAdjustmentOpen(true)}
              className="wn-btn-primary text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#172B82]/20"
            >
              <Layers className="w-4 h-4" />
              <span>Manual Stock Adjustment</span>
            </motion.button>
          </div>
        }
      />

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#687085] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by barcode, SKU, invoice #, reason..."
              className="wn-input pl-10 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#687085] hover:text-[#172033]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-xs font-semibold text-[#687085]">
            Showing <strong>{filtered.length}</strong> of {inventoryTransactions.length} logs
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar pt-1">
          {[
            { val: 'ALL', label: 'All Operations' },
            { val: 'SOLD', label: 'Retail Sales (POS)' },
            { val: 'STOCK_ADDED', label: 'Shipments Added' },
            { val: 'STOCK_DEDUCTED', label: 'Deductions' },
            { val: 'RETURNED', label: 'Returns Restored' },
            { val: 'RESERVED', label: 'Order Reserved' },
            { val: 'MANUAL_ADJUSTMENT', label: 'Manual Adjustment' },
            { val: 'DAMAGED', label: 'Damaged' }
          ].map((t) => (
            <button
              key={t.val}
              type="button"
              onClick={() => setFilterType(t.val)}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                filterType === t.val
                  ? 'bg-[#172B82] text-white shadow-xs'
                  : 'bg-[#FFFCF5] text-[#687085] hover:text-[#172033] border border-[#DDD7CA]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP AUDIT TABLE */}
      <div className="hidden lg:block bg-white rounded-3xl border border-[#DDD7CA] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
            <tr>
              <th className="py-3 px-4">Tx ID & Timestamp</th>
              <th className="py-3 px-4">Garment & Variant</th>
              <th className="py-3 px-4">SKU / Barcode</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-center">Change</th>
              <th className="py-3 px-4 text-center">Stock Progression</th>
              <th className="py-3 px-4">Reference</th>
              <th className="py-3 px-4">Reason / Notes</th>
              <th className="py-3 px-4">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD7CA]/60">
            {filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#FFFCF5] transition-colors">
                <td className="py-3 px-4 text-[#687085]">
                  <span className="font-mono text-[10px] font-bold text-[#172B82] block">
                    {tx.id.replace('tx_', 'TX-')}
                  </span>
                  <span className="text-[11px]">{tx.date}</span>
                  {tx.time && <span className="text-[10px] text-[#687085] block font-mono">{tx.time}</span>}
                </td>

                <td className="py-3 px-4">
                  <span className="font-bold text-[#172033] block max-w-xs truncate">
                    {tx.productName}
                  </span>
                  {tx.variantInfo && (
                    <span className="text-[10px] text-[#687085] block">{tx.variantInfo}</span>
                  )}
                </td>

                <td className="py-3 px-4 font-mono">
                  <span className="text-xs font-semibold text-[#172033] block">{tx.sku}</span>
                  {tx.barcode && (
                    <span className="text-[10px] text-[#687085] flex items-center gap-1">
                      <Barcode className="w-3 h-3 text-[#172B82]" />
                      {tx.barcode}
                    </span>
                  )}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getBadgeStyle(
                      tx.type
                    )}`}
                  >
                    {tx.type.replace(/_/g, ' ')}
                  </span>
                </td>

                <td className="py-3 px-4 text-center font-extrabold text-sm font-mono">
                  <span className={tx.quantityChange > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                    {tx.quantityChange > 0 ? `+${tx.quantityChange}` : tx.quantityChange}
                  </span>
                </td>

                <td className="py-3 px-4 text-center font-mono text-[#172033]">
                  <span className="text-[#687085]">{tx.previousStock}</span> →{' '}
                  <strong className={tx.newStock === 0 ? 'text-[#DC2626]' : 'text-[#172033]'}>
                    {tx.newStock}
                  </strong>
                </td>

                <td className="py-3 px-4 font-mono font-semibold text-[#172B82]">
                  {tx.reference || '—'}
                </td>

                <td className="py-3 px-4 text-[#687085] max-w-xs truncate" title={tx.reason}>
                  {tx.reason}
                </td>

                <td className="py-3 px-4 font-medium text-[#172033] whitespace-nowrap">
                  {tx.performedBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE AUDIT CARDS */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="lg:hidden space-y-3"
      >
        {filtered.map((tx) => (
          <motion.div
            key={tx.id}
            variants={cardInteractiveVariants}
            className="bg-white p-4 rounded-3xl border border-[#DDD7CA] shadow-2xs space-y-2.5 text-xs"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-[#172B82]">
                {tx.id.replace('tx_', 'TX-')}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getBadgeStyle(
                  tx.type
                )}`}
              >
                {tx.type.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Product & Change */}
            <div className="flex items-baseline justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold text-[#172033] truncate">{tx.productName}</p>
                <p className="text-[11px] text-[#687085]">
                  {tx.variantInfo ? `${tx.variantInfo} • ` : ''}
                  SKU: {tx.sku}
                </p>
                {tx.barcode && (
                  <p className="text-[10px] font-mono text-[#687085] flex items-center gap-1 mt-0.5">
                    <Barcode className="w-3 h-3 text-[#172B82]" />
                    {tx.barcode}
                  </p>
                )}
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-base font-black font-mono ${
                    tx.quantityChange > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                  }`}
                >
                  {tx.quantityChange > 0 ? `+${tx.quantityChange}` : tx.quantityChange}
                </span>
                <span className="block text-[10px] text-[#687085] font-mono">
                  {tx.previousStock} → <strong>{tx.newStock}</strong>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#687085] bg-[#FFFCF5] p-2 rounded-xl border border-[#DDD7CA]">
              {tx.reason} {tx.reference ? `(Ref: ${tx.reference})` : ''}
            </p>

            {/* Footer row */}
            <div className="pt-2 border-t border-[#DDD7CA]/70 flex items-center justify-between text-[10px] text-[#687085]">
              <span>By: <strong className="text-[#172033]">{tx.performedBy}</strong></span>
              <span>{tx.date}</span>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="p-10 text-center bg-white rounded-3xl border border-[#DDD7CA] space-y-1">
            <History className="w-8 h-8 text-[#687085] mx-auto opacity-50" />
            <p className="text-xs font-bold text-[#172033]">No audit transactions found</p>
            <p className="text-[11px] text-[#687085]">
              No entries match the current search query or filter.
            </p>
          </div>
        )}
      </motion.div>

      {/* Manual Stock Adjustment Modal */}
      {isAdjustmentOpen && (
        <StockAdjustmentModal
          isOpen={true}
          onClose={() => setIsAdjustmentOpen(false)}
          product={selectedProductForAdj || products[0]}
        />
      )}
    </AnimatedPage>
  );
};
