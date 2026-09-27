import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const ColorsPage: React.FC = () => {
  const { colors } = useData();
  const { success } = useToast();

  const [colorList, setColorList] = useState(colors);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2563EB');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim()) return;
    setColorList([
      ...colorList,
      { name: newColorName.trim(), hex: newColorHex, count: 0 }
    ]);
    setNewColorName('');
    success('Color Added', `${newColorName} added to fabric color palette.`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Color Swatches & Palette"
          subtitle="Manage master color shades for variants and instant visual filters."
          breadcrumbs={[{ label: 'Catalog' }, { label: 'Colors' }]}
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {colorList.map((col) => (
            <motion.div
              key={col.name}
              variants={staggerItem}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-4 rounded-2xl border border-[#DDD7CA] shadow-xs flex items-center justify-between select-none"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full border border-black/15 shadow-inner shrink-0"
                  style={{ backgroundColor: col.hex }}
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#172033]">{col.name}</h4>
                  <p className="text-[11px] text-[#687085] font-mono">{col.hex} • {col.count} Garments</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setColorList(colorList.filter((c) => c.name !== col.name));
                  success('Color deleted', `${col.name} swatch removed.`);
                }}
                className="text-[#687085] hover:text-[#DC2626] p-2 rounded-lg transition-colors"
                aria-label={`Delete ${col.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Color Form */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs max-w-md">
          <h3 className="text-xs sm:text-sm font-bold text-[#172033] mb-3">
            Add Master Swatch Color
          </h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="wn-label">Color Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sage Green or Royal Maroon"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="wn-input text-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-11 h-11 rounded-xl cursor-pointer border border-[#DDD7CA] p-1 bg-white"
              />
              <span className="font-mono text-xs text-[#687085] font-bold">{newColorHex}</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="wn-btn-primary text-xs ml-auto min-h-[44px] px-4"
              >
                <Plus className="w-4 h-4" /> Register Shade
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
};
