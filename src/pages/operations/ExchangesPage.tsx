import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Barcode, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { ExchangeScannerModal } from '../../components/operations/ExchangeScannerModal';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem, buttonTapVariants } from '../../utils/animations';

export const ExchangesPage: React.FC = () => {
  const { exchanges, updateExchangeStatus } = useData();
  const { success } = useToast();
  const [isExchangeScannerOpen, setIsExchangeScannerOpen] = useState(false);

  const handleApprove = (id: string) => {
    updateExchangeStatus(id, 'APPROVED');
    success('Exchange Approved', 'Size exchange dispatched for packing.');
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Apparel Size & Fit Exchanges"
          subtitle="Process doorstep trial size swaps with automated real-time shelf inventory verification."
          breadcrumbs={[{ label: 'Operations' }, { label: 'Exchanges' }]}
          actions={
            <motion.button
              variants={buttonTapVariants}
              whileTap="tap"
              onClick={() => setIsExchangeScannerOpen(true)}
              className="wn-btn-primary text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#172B82]/20"
            >
              <Barcode className="w-4 h-4" />
              <span>Scan Barcode to Exchange</span>
            </motion.button>
          }
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
        >
          {exchanges.map((exc) => (
            <motion.div
              key={exc.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              className="bg-white rounded-3xl border border-[#DDD7CA] p-4 sm:p-5 shadow-xs space-y-3.5 flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD7CA]">
                  <span className="font-mono font-bold text-xs text-[#172B82]">
                    Order {exc.orderNumber}
                  </span>
                  <StatusBadge status={exc.status} size="sm" />
                </div>

                <div className="mt-2.5 space-y-2.5 text-xs">
                  <p className="font-semibold text-[#172033]">
                    Customer: {exc.customerName}
                  </p>
                  <p className="text-[#687085]">
                    Garment: <strong className="text-[#172033]">{exc.originalProduct}</strong>
                  </p>

                  {/* Size Swap Card */}
                  <div className="p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA] flex items-center justify-around text-center">
                    <div>
                      <span className="text-[10px] text-[#687085] uppercase block font-medium">Current Size</span>
                      <span className="text-sm sm:text-base font-bold text-[#172033]">{exc.currentSize}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#172B82]" />
                    <div>
                      <span className="text-[10px] text-[#687085] uppercase block font-medium">Requested Size</span>
                      <span className="text-sm sm:text-base font-extrabold text-[#172B82]">{exc.requestedSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#687085]">Shelf Inventory Status:</span>
                    <span
                      className={`text-xs font-bold ${
                        exc.stockAvailable ? 'text-[#16A34A]' : 'text-[#DC2626]'
                      }`}
                    >
                      {exc.stockAvailable ? '✓ In Stock' : '✕ Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {exc.status === 'PENDING' && (
                <div className="pt-3 border-t border-[#DDD7CA]">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={!exc.stockAvailable}
                    onClick={() => handleApprove(exc.id)}
                    className="w-full wn-btn-primary py-2.5 text-xs min-h-[42px] flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Exchange & Pack Replacement</span>
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Exchange Scanner Modal */}
      {isExchangeScannerOpen && (
        <ExchangeScannerModal
          isOpen={true}
          onClose={() => setIsExchangeScannerOpen(false)}
        />
      )}
    </AnimatedPage>
  );
};
