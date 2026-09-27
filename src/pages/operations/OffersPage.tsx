import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, Plus, Tag } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BottomSheet } from '../../components/common/BottomSheet';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const OffersPage: React.FC = () => {
  const { offers, addStoreOffer, toggleOfferStatus } = useData();
  const { success } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [discountValue, setDiscountValue] = useState(15);
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FLAT'>('PERCENT');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addStoreOffer({
      title,
      type: 'STORE_OFFER',
      discountType,
      discountValue: Number(discountValue),
      startDate: 'Today',
      endDate: '31 Oct 2026',
      status: 'ACTIVE'
    });

    setIsModalOpen(false);
    setTitle('');
    success('Promotion Published', `${title} is now active on store page.`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Promotions & Store Offers"
          subtitle="Create seasonal clearance campaigns, festival discounts, and category promos."
          breadcrumbs={[{ label: 'Operations' }, { label: 'Offers' }]}
          actions={
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="wn-btn-primary text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" /> Create Offer Campaign
            </motion.button>
          }
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
        >
          {offers.map((off) => (
            <motion.div
              key={off.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-5 shadow-xs space-y-3.5 flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#172B82]/5 border border-[#172B82]/15 flex items-center justify-center text-[#172B82]">
                    <Percent className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => toggleOfferStatus(off.id)}
                    className="cursor-pointer"
                  >
                    <StatusBadge status={off.status} size="sm" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-[#172033]">{off.title}</h4>
                <div className="mt-2 text-xl font-extrabold text-[#172B82]">
                  {off.discountType === 'PERCENT' ? `${off.discountValue}% OFF` : `₹${off.discountValue} OFF`}
                </div>
                <p className="text-[11px] text-[#687085] mt-1">
                  Valid: {off.startDate} – {off.endDate}
                </p>
              </div>

              <div className="pt-3 border-t border-[#DDD7CA] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#687085]">
                  {off.status === 'ACTIVE' ? 'Live on boutique page' : 'Paused campaign'}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleOfferStatus(off.id)}
                  className="wn-btn-secondary text-[11px] py-1 px-3 min-h-[34px]"
                >
                  {off.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Offer BottomSheet */}
        <BottomSheet
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Promotional Offer"
          subtitle="Define discount mechanics and active campaign timing"
        >
          <form onSubmit={handleCreate} className="space-y-4 py-1">
            <div>
              <label className="wn-label">Offer Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Festive Diwali Gala Flat 20% Off"
                className="wn-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="wn-label">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="wn-input text-xs"
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FLAT">Flat Rupee (₹)</option>
                </select>
              </div>

              <div>
                <label className="wn-label">Discount Value</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="wn-input font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="wn-btn-secondary text-xs flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="wn-btn-primary text-xs flex-1">
                Publish Campaign
              </button>
            </div>
          </form>
        </BottomSheet>
      </div>
    </AnimatedPage>
  );
};
