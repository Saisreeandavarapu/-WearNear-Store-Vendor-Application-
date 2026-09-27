import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const SizesPage: React.FC = () => {
  const { sizes } = useData();
  const { success } = useToast();

  const [sizeList, setSizeList] = useState(sizes);
  const [newSize, setNewSize] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSize.trim()) return;
    if (sizeList.includes(newSize.trim().toUpperCase())) return;
    setSizeList([...sizeList, newSize.trim().toUpperCase()]);
    setNewSize('');
    success('Size added', `Size "${newSize.toUpperCase()}" added to store size master.`);
  };

  const handleDelete = (s: string) => {
    setSizeList(sizeList.filter((item) => item !== s));
    success('Size removed', `Size ${s} removed from size master.`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Standard Size Master"
          subtitle="Define apparel & footwear sizing scales applicable across your catalog."
          breadcrumbs={[{ label: 'Catalog' }, { label: 'Sizes' }]}
        />

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs">
          <h3 className="text-xs sm:text-sm font-bold text-[#172033] mb-3 sm:mb-4">
            Active Size Tags ({sizeList.length})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3 mb-6">
            {sizeList.map((s) => (
              <motion.div
                key={s}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] flex items-center justify-between shadow-xs hover:border-[#172B82]/40 transition-colors select-none"
              >
                <span className="font-extrabold text-sm text-[#172033]">{s}</span>
                <button
                  onClick={() => handleDelete(s)}
                  className="text-[#687085] hover:text-[#DC2626] p-1 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Add Size Input */}
          <form onSubmit={handleAdd} className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="e.g. XXL or 34R"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="wn-input text-xs"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="wn-btn-primary text-xs shrink-0 px-4 min-h-[44px]"
            >
              <Plus className="w-4 h-4" /> Add
            </motion.button>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
};
