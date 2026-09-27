import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const RefundsPage: React.FC = () => {
  const { refunds } = useData();

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Refunds & Customer Disbursements"
          subtitle="Track payment reversals credited back to customer UPI or WearNear store credits."
          breadcrumbs={[{ label: 'Operations' }, { label: 'Refunds' }]}
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        >
          {refunds.map((ref) => (
            <motion.div
              key={ref.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-5 shadow-xs space-y-3 select-none"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD7CA]">
                <span className="font-mono font-bold text-xs text-[#172B82]">
                  Order {ref.orderNumber}
                </span>
                <StatusBadge status={ref.status} size="sm" />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#687085]">Customer</span>
                  <span className="font-semibold text-[#172033]">{ref.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#687085]">Disbursement Mode</span>
                  <span className="font-semibold text-[#172033]">{ref.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#687085]">Reason</span>
                  <span className="text-[#172033] max-w-xs text-right">{ref.reason}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#DDD7CA] text-sm font-bold text-[#172033]">
                  <span>Refund Amount</span>
                  <span className="text-[#172B82]">₹{ref.amount}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#687085] pt-1">
                Disbursed on {ref.date}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  );
};
