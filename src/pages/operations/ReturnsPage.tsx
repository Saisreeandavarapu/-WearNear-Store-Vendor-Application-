import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ReturnRequest } from '../../types';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const ReturnsPage: React.FC = () => {
  const { returns, updateReturnStatus } = useData();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState<string>('ALL');

  const filtered = returns.filter((r) => activeTab === 'ALL' || r.status === activeTab);

  const handleAction = (id: string, status: ReturnRequest['status']) => {
    updateReturnStatus(id, status);
    success('Return Updated', `Request marked as ${status}.`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Returns & Reverse Logistics"
          subtitle="Manage 7-day trial return requests and physical garment quality inspection."
          breadcrumbs={[{ label: 'Operations' }, { label: 'Returns' }]}
        />

        {/* Tabs */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#DDD7CA] shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          {['ALL', 'NEW', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors min-h-[34px] ${
                activeTab === tab
                  ? 'bg-[#172B82] text-white shadow-xs'
                  : 'bg-[#FFFCF5] text-[#687085] hover:text-[#172033] border border-[#DDD7CA]'
              }`}
            >
              {tab.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Returns List */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
        >
          {filtered.map((ret) => (
            <motion.div
              key={ret.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-5 shadow-xs space-y-3.5 flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD7CA]">
                  <div>
                    <span className="font-mono font-bold text-xs text-[#172B82]">
                      Order {ret.orderNumber}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-[#172033] mt-0.5">
                      {ret.customerName}
                    </h4>
                  </div>
                  <StatusBadge status={ret.status} size="sm" />
                </div>

                <div className="space-y-1.5 text-xs text-[#172033] pt-1">
                  <p className="font-semibold">{ret.productName}</p>
                  <p className="text-[#687085] text-[11px] bg-[#FFFCF5] p-2.5 rounded-lg border border-[#DDD7CA]">
                    Reason: <strong>{ret.reason}</strong>
                  </p>
                  <p className="text-[10px] text-[#687085]">Requested: {ret.requestDate}</p>
                </div>
              </div>

              {ret.status === 'NEW' && (
                <div className="flex items-center gap-2 pt-3 border-t border-[#DDD7CA]">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction(ret.id, 'APPROVED')}
                    className="flex-1 wn-btn-primary py-2 text-xs flex items-center justify-center gap-1.5 min-h-[38px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Pickup
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction(ret.id, 'REJECTED')}
                    className="flex-1 wn-btn-secondary py-2 text-xs text-[#DC2626] border-[#DC2626]/30 hover:bg-rose-50 flex items-center justify-center gap-1.5 min-h-[38px]"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Decline
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  );
};
