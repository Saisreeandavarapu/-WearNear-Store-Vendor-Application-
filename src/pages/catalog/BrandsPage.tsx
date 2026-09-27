import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, Edit } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BottomSheet } from '../../components/common/BottomSheet';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const BrandsPage: React.FC = () => {
  const { brands } = useData();
  const { success } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName) return;
    setIsModalOpen(false);
    setNewBrandName('');
    success('Brand Added', `Brand "${newBrandName}" authorized for vendor inventory.`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Partner Brands"
          subtitle="Manage brand labels, manufacturer authorizations and tier classification."
          breadcrumbs={[{ label: 'Catalog' }, { label: 'Brands' }]}
          actions={
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="wn-btn-primary text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" /> Add Brand Label
            </motion.button>
          }
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              className="bg-white p-4 rounded-2xl border border-[#DDD7CA] shadow-xs flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#172B82] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                    {brand.logo}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#172B82]/10 text-[#172B82]">
                    {brand.tier}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#172033]">{brand.name}</h4>
                <p className="text-xs text-[#687085] mt-1">
                  {brand.productCount} styles listed in current boutique collection
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DDD7CA] flex items-center justify-between text-xs">
                <StatusBadge status={brand.status} size="sm" />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => success('Brand configurations updated', `${brand.name} catalog visibility verified.`)}
                  className="wn-btn-secondary text-[11px] py-1 px-2.5 min-h-[34px]"
                >
                  <Edit className="w-3 h-3 text-[#172B82]" /> Edit
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <BottomSheet
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Partner Brand"
          subtitle="Authorize a designer brand or boutique private label for retail sales."
        >
          <form onSubmit={handleAdd} className="space-y-4 py-2">
            <div>
              <label className="wn-label">Brand Display Name</label>
              <input
                type="text"
                required
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="e.g. Sabyasachi Heritage"
                className="wn-input"
              />
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
                Save Brand
              </button>
            </div>
          </form>
        </BottomSheet>
      </div>
    </AnimatedPage>
  );
};
