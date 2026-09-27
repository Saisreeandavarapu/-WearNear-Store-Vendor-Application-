import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, CheckCircle2, Clock, Download } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BottomSheet } from '../../components/common/BottomSheet';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { CountUp } from '../../components/common/CountUp';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Settlement } from '../../types';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const SettlementsPage: React.FC = () => {
  const { settlements } = useData();
  const { store } = useAuth();
  const { success } = useToast();

  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

  const processedTotal = settlements
    .filter((s) => s.status === 'PROCESSED')
    .reduce((sum, s) => sum + s.netPayout, 0);

  const pendingTotal = settlements
    .filter((s) => s.status === 'PENDING')
    .reduce((sum, s) => sum + s.netPayout, 0);

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Settlement Cycles & Bank Transfers"
          subtitle="Weekly bank deposits directly into your verified business bank account."
          breadcrumbs={[{ label: 'Finance' }, { label: 'Settlements' }]}
          actions={
            <button
              onClick={() => success('Export Complete', 'Settlement reconciliation statement generated.')}
              className="wn-btn-secondary text-xs sm:text-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Tax Reconciliation (.xlsx)</span>
              <span className="sm:hidden">Statement</span>
            </button>
          }
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            label="Total Processed Payouts"
            value={`₹${processedTotal.toLocaleString('en-IN')}`}
            numericEnd={processedTotal}
            prefix="₹"
            icon={CheckCircle2}
            subValue="Credited via NEFT / RTGS"
          />
          <StatCard
            label="Pending Next Cycle Payout"
            value={`₹${pendingTotal.toLocaleString('en-IN')}`}
            numericEnd={pendingTotal}
            prefix="₹"
            icon={Clock}
            badge="Scheduled Oct 04"
            subValue="14 orders in current batch"
          />
          <StatCard
            label="Platform Commission Rate"
            value="12.5%"
            icon={Landmark}
            subValue="Covers logistics & 30-min dispatch"
          />
        </div>

        {/* Bank Account Verification Callout */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#DDD7CA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#172B82]/10 flex items-center justify-center text-[#172B82] shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#172033]">
                Active Bank Account: {store.bankDetails.bankName} (•••• {store.bankDetails.accountNumber.slice(-4)})
              </h4>
              <p className="text-[#687085]">
                IFSC: {store.bankDetails.ifscCode} • Branch: {store.bankDetails.branch}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mandate Active
          </span>
        </div>

        {/* Settlements Table (Desktop) / Cards (Mobile) */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-5 border-b border-[#DDD7CA] flex items-center justify-between bg-[#FFFCF5]">
            <div>
              <h3 className="text-xs sm:text-base font-bold text-[#172033]">
                Settlement Disbursement History
              </h3>
              <p className="text-[10px] sm:text-xs text-[#687085]">Weekly cycle batches and bank transfer UTR references</p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
                <tr>
                  <th className="py-3 px-4">Settlement Batch</th>
                  <th className="py-3 px-4">Cycle Period</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Gross Sales</th>
                  <th className="py-3 px-4">Commission (12.5%)</th>
                  <th className="py-3 px-4 font-bold">Net Bank Payout</th>
                  <th className="py-3 px-4">Status & UTR</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD7CA]/60">
                {settlements.map((stl) => (
                  <tr key={stl.id} className="hover:bg-[#FFFCF5]">
                    <td className="py-3 px-4 font-bold text-[#172B82] font-mono">
                      {stl.settlementId}
                    </td>
                    <td className="py-3 px-4 text-[#172033]">{stl.cyclePeriod}</td>
                    <td className="py-3 px-4 font-semibold text-[#172033]">{stl.ordersCount} orders</td>
                    <td className="py-3 px-4 text-[#687085]">₹{stl.grossAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-rose-600">-₹{stl.commissionAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 font-extrabold text-[#172B82] text-sm">
                      ₹{stl.netPayout.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={stl.status} size="sm" />
                      {stl.utrNumber && (
                        <span className="block text-[10px] text-[#687085] font-mono mt-0.5">
                          UTR: {stl.utrNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedSettlement(stl)}
                        className="wn-btn-secondary text-[11px] py-1 px-2.5"
                      >
                        Breakdown
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:hidden divide-y divide-[#DDD7CA]/60"
          >
            {settlements.map((stl) => (
              <motion.div
                key={stl.id}
                variants={staggerItem}
                whileTap={{ scale: 0.99 }}
                className="p-3.5 space-y-2 text-xs select-none"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#172B82]">{stl.settlementId}</span>
                  <StatusBadge status={stl.status} size="sm" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[#687085]">{stl.cyclePeriod}</span>
                  <span className="font-extrabold text-sm text-[#172033]">
                    ₹{stl.netPayout.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-[#687085]">
                  <span>{stl.ordersCount} Orders (Gross: ₹{stl.grossAmount.toLocaleString('en-IN')})</span>
                  <button
                    onClick={() => setSelectedSettlement(stl)}
                    className="font-bold text-[#172B82] hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Settlement Breakdown BottomSheet */}
        <BottomSheet
          isOpen={!!selectedSettlement}
          onClose={() => setSelectedSettlement(null)}
          title="Settlement Breakdown"
          subtitle={selectedSettlement?.settlementId}
        >
          {selectedSettlement && (
            <div className="space-y-4 text-xs py-2">
              <div className="flex items-center justify-between border-b border-[#DDD7CA] pb-2.5">
                <span className="text-[#687085]">Status</span>
                <StatusBadge status={selectedSettlement.status} size="sm" />
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-[#687085]">
                  <span>Orders Fulfilled</span>
                  <span className="font-semibold text-[#172033]">{selectedSettlement.ordersCount} orders</span>
                </div>
                <div className="flex justify-between text-[#687085]">
                  <span>Gross Merchandising Value</span>
                  <span className="font-semibold text-[#172033]">₹{selectedSettlement.grossAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#687085]">
                  <span>Platform Commission (12.5%)</span>
                  <span className="font-semibold text-rose-600">-₹{selectedSettlement.commissionAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#687085]">
                  <span>Adjustments / Returns</span>
                  <span className="font-semibold text-[#172033]">₹{selectedSettlement.adjustments}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#DDD7CA] text-sm font-bold text-[#172033]">
                  <span>Net Bank Payout</span>
                  <span className="text-[#172B82] text-base">₹{selectedSettlement.netPayout.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {selectedSettlement.utrNumber && (
                <div className="p-3 rounded-xl bg-[#FFFCF5] border border-[#DDD7CA] font-mono text-[11px] text-[#687085]">
                  Bank UTR: {selectedSettlement.utrNumber}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setSelectedSettlement(null)}
                  className="wn-btn-primary text-xs w-full py-2.5"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </BottomSheet>
      </div>
    </AnimatedPage>
  );
};
