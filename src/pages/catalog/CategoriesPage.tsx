import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Plus, Edit } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BottomSheet } from '../../components/common/BottomSheet';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const CategoriesPage: React.FC = () => {
  const { categories } = useData();
  const { success } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    setIsAddModalOpen(false);
    setNewCatName('');
    success('Category Added', `"${newCatName}" has been registered in the catalog.`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Store Fashion Categories"
          subtitle="Manage product classification, merchandising sections and visibility on WearNear."
          breadcrumbs={[{ label: 'Catalog' }, { label: 'Categories' }]}
          actions={
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="wn-btn-primary text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" /> Add Category
            </motion.button>
          }
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              className="bg-white p-4 rounded-2xl border border-[#DDD7CA] shadow-xs flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#172B82]/5 border border-[#172B82]/15 flex items-center justify-center text-[#172B82]">
                    <Grid className="w-5 h-5" />
                  </div>
                  <StatusBadge status={cat.status} size="sm" />
                </div>

                <h4 className="text-sm font-bold text-[#172033]">{cat.name}</h4>
                <p className="text-xs text-[#687085] mt-1">
                  {cat.productCount} active garments listed in store
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DDD7CA] flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#687085]">/{cat.slug}</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => success('Category updated', `${cat.name} configurations saved.`)}
                  className="wn-btn-secondary text-[11px] py-1 px-2.5 min-h-[34px]"
                >
                  <Edit className="w-3 h-3 text-[#172B82]" /> Edit
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <BottomSheet
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Fashion Category"
          subtitle="Create a new boutique department for sorting garments."
        >
          <form onSubmit={handleAddCategory} className="space-y-4 py-2">
            <div>
              <label className="wn-label">Category Name</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Cocktail & Evening Dresses"
                className="wn-input"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="wn-btn-secondary text-xs flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="wn-btn-primary text-xs flex-1">
                Save Category
              </button>
            </div>
          </form>
        </BottomSheet>
      </div>
    </AnimatedPage>
  );
};
