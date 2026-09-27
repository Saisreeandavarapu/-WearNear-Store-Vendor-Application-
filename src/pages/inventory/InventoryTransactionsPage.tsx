import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, ArrowLeft, PlusCircle, MinusCircle, Clock, ShieldAlert, FileSpreadsheet } from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useData } from '../../context/DataContext';
import { staggerContainer, cardInteractiveVariants, buttonTapVariants } from '../../utils/animations';

export const InventoryTransactionsPage: React.FC = () => {
  const { inventoryTransactions } = useData();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = inventoryTransactions.filter(
    (tx) => filterType === 'ALL' || tx.type === filterType
  );

  return (
    <AnimatedPage className="space-y-6">
      <PageHeader
        title="Inventory Audit Ledger"
        subtitle="Complete chronological transaction log of inward batches, customer reservations, and deductions."
        breadcrumbs={[
          { label: 'Inventory', path: '/vendor/inventory' },
          { label: 'Transactions Ledger' }
        ]}
      />

      {/* Filter Tabs */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#DDD7CA] shadow-xs flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        {[
          { val: 'ALL', label: 'All Transactions' },
          { val: 'STOCK_ADDED', label: 'Added / Restocked' },
          { val: 'STOCK_DEDUCTED', label: 'Deducted / Sold' },
          { val: 'RESERVED', label: 'Reserved for Orders' }
        ].map((t) => (
          <motion.button
            key={t.val}
            variants={buttonTapVariants}
            whileTap="tap"
            onClick={() => setFilterType(t.val)}
            className={`px-3.5 py-2 rounded-xl font-bold shrink-0 transition-all ${
              filterType === t.val
                ? 'bg-[#172B82] text-white shadow-xs'
                : 'bg-[#FFFCF5] text-[#687085] hover:text-[#172033] border border-[#DDD7CA]'
            }`}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#DDD7CA] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Garment & SKU</th>
              <th className="py-3 px-4">Activity Type</th>
              <th className="py-3 px-4 text-center">Change</th>
              <th className="py-3 px-4 text-center">Shelf Stock</th>
              <th className="py-3 px-4">Reason / Notes</th>
              <th className="py-3 px-4">Operator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD7CA]/60">
            {filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#FFFCF5] transition-colors">
                <td className="py-3 px-4 text-[#687085] font-medium">{tx.date}</td>
                <td className="py-3 px-4 font-bold text-[#172033]">
                  {tx.productName}
                  <span className="text-[10px] text-[#687085] block font-mono">
                    {tx.sku}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      tx.quantityChange > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {tx.type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-extrabold">
                  <span className={tx.quantityChange > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                    {tx.quantityChange > 0 ? `+${tx.quantityChange}` : tx.quantityChange}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-mono text-[#172033]">
                  {tx.previousStock} → <strong>{tx.newStock}</strong>
                </td>
                <td className="py-3 px-4 text-[#687085] max-w-xs truncate">{tx.reason}</td>
                <td className="py-3 px-4 text-[#172033] font-medium">{tx.performedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="md:hidden space-y-3"
      >
        {filtered.map((tx) => (
          <motion.div
            key={tx.id}
            variants={cardInteractiveVariants}
            whileTap="tap"
            className="bg-white p-4 rounded-2xl border border-[#DDD7CA] shadow-2xs space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#172033] truncate max-w-[200px]">
                {tx.productName}
              </span>
              <span
                className={`font-extrabold text-xs px-2.5 py-0.5 rounded-full ${
                  tx.quantityChange > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {tx.quantityChange > 0 ? `+${tx.quantityChange}` : tx.quantityChange}
              </span>
            </div>

            <p className="text-[11px] text-[#687085]">{tx.reason}</p>

            <div className="pt-2 border-t border-[#DDD7CA]/70 flex items-center justify-between text-[11px] text-[#687085]">
              <span className="font-mono">Shelf: {tx.previousStock} → <strong className="text-[#172033]">{tx.newStock}</strong></span>
              <span>{tx.date}</span>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#DDD7CA]">
            <History className="w-8 h-8 text-[#687085] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-[#172033]">No audit logs found</p>
            <p className="text-[11px] text-[#687085] mt-0.5">No transactions match the selected activity filter.</p>
          </div>
        )}
      </motion.div>
    </AnimatedPage>
  );
};

