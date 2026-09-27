import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Layers, Check, Plus, Trash2, Save, Sparkles } from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { buttonTapVariants, cardInteractiveVariants } from '../../utils/animations';

export const ProductVariantsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct } = useData();
  const { success } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const product = products.find((p) => p.id === id);

  // Variant matrix state
  const colorsList = ['Midnight Black', 'Pearl Ivory', 'Navy Imperial', 'Sage Olive'];
  const sizesList = ['S', 'M', 'L', 'XL'];

  const [matrixStock, setMatrixStock] = useState<Record<string, number>>({
    'Midnight Black-S': 4,
    'Midnight Black-M': 6,
    'Midnight Black-L': 5,
    'Midnight Black-XL': 2,
    'Pearl Ivory-S': 2,
    'Pearl Ivory-M': 4,
    'Pearl Ivory-L': 3,
    'Pearl Ivory-XL': 0,
    'Navy Imperial-S': 5,
    'Navy Imperial-M': 8,
    'Navy Imperial-L': 6,
    'Navy Imperial-XL': 3,
    'Sage Olive-S': 3,
    'Sage Olive-M': 5,
    'Sage Olive-L': 2,
    'Sage Olive-XL': 1
  });

  if (!product) {
    return (
      <AnimatedPage className="text-center py-12">
        <h2 className="text-lg font-bold text-[#172033]">Product Not Found</h2>
        <Link to="/vendor/products" className="wn-btn-primary text-xs mt-3 inline-flex">
          Back to Products
        </Link>
      </AnimatedPage>
    );
  }

  const handleStockChange = (key: string, val: number) => {
    setMatrixStock((prev) => ({ ...prev, [key]: Math.max(0, val) }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const total = Object.values(matrixStock).reduce((sum, n) => sum + n, 0);
      updateProduct(product.id, { stock: total });
      setIsSaving(false);
      success('Variant Matrix Updated', `Total available stock updated to ${total} units.`);
    }, 350);
  };

  const totalUnits = Object.values(matrixStock).reduce((sum, n) => sum + n, 0);

  return (
    <AnimatedPage className="space-y-6 pb-24 md:pb-6">
      <PageHeader
        title={`Variants Matrix: ${product.name}`}
        subtitle="Manage inventory by Size × Color combinations with live SKU allocation."
        breadcrumbs={[
          { label: 'Products', path: '/vendor/products' },
          { label: product.name, path: `/vendor/products/${product.id}` },
          { label: 'Variants Matrix' }
        ]}
        actions={
          <motion.button
            variants={buttonTapVariants}
            whileTap="tap"
            disabled={isSaving}
            onClick={handleSave}
            className="wn-btn-primary text-xs sm:text-sm flex items-center gap-1.5"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Matrix Inventory</span>
          </motion.button>
        }
      />

      {/* DESKTOP MATRIX TABLE */}
      <div className="hidden md:block bg-white rounded-3xl border border-[#DDD7CA] p-6 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD7CA] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Color / Size Stock Grid</h3>
            <p className="text-xs text-[#687085]">Enter physical quantity available in store shelves for each cell</p>
          </div>
          <span className="text-xs font-bold text-[#172B82] bg-[#172B82]/10 px-3.5 py-1.5 rounded-xl border border-[#172B82]/20">
            Total Shelf Stock: {totalUnits} Units
          </span>
        </div>

        <table className="w-full text-center text-xs">
          <thead>
            <tr className="border-b border-[#DDD7CA] text-[#687085]">
              <th className="py-2.5 px-3 text-left font-bold text-[#172033]">Color / Shade</th>
              {sizesList.map((s) => (
                <th key={s} className="py-2.5 px-3 font-bold text-[#172033]">
                  Size {s}
                </th>
              ))}
              <th className="py-2.5 px-3 text-right font-bold text-[#172033]">Row Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD7CA]/50">
            {colorsList.map((color) => {
              const rowTotal = sizesList.reduce(
                (sum, s) => sum + (matrixStock[`${color}-${s}`] || 0),
                0
              );

              return (
                <tr key={color} className="hover:bg-[#FFFCF5] transition-colors">
                  <td className="py-3 px-3 text-left font-bold text-[#172033]">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shadow-2xs"
                        style={{
                          backgroundColor:
                            color === 'Midnight Black'
                              ? '#111827'
                              : color === 'Pearl Ivory'
                              ? '#F9FAFB'
                              : color === 'Navy Imperial'
                              ? '#1E3A8A'
                              : '#3F6212'
                        }}
                      />
                      <span>{color}</span>
                    </div>
                  </td>

                  {sizesList.map((size) => {
                    const key = `${color}-${size}`;
                    const val = matrixStock[key] || 0;

                    return (
                      <td key={size} className="py-2 px-2">
                        <input
                          type="number"
                          min={0}
                          value={val}
                          onChange={(e) => handleStockChange(key, Number(e.target.value))}
                          className={`w-16 text-center py-2 px-2 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#172B82] transition-colors ${
                            val === 0
                              ? 'bg-rose-50 border-rose-200 text-[#DC2626]'
                              : val <= 2
                              ? 'bg-amber-50 border-amber-200 text-[#F59E0B]'
                              : 'bg-white border-[#DDD7CA] text-[#172033]'
                          }`}
                        />
                      </td>
                    );
                  })}

                  <td className="py-3 px-3 text-right font-extrabold text-[#172B82]">
                    {rowTotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE STACKED VARIANT CARDS */}
      <div className="md:hidden space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#172033]">Size × Color Breakdown</span>
          <span className="text-xs font-extrabold text-[#172B82] bg-[#172B82]/10 px-2.5 py-0.5 rounded-lg">
            {totalUnits} Units
          </span>
        </div>

        {colorsList.map((color) => (
          <motion.div
            key={color}
            variants={cardInteractiveVariants}
            className="bg-white p-4 rounded-2xl border border-[#DDD7CA] shadow-2xs space-y-3"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-[#DDD7CA]">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20"
                style={{
                  backgroundColor:
                    color === 'Midnight Black'
                      ? '#111827'
                      : color === 'Pearl Ivory'
                      ? '#F9FAFB'
                      : color === 'Navy Imperial'
                      ? '#1E3A8A'
                      : '#3F6212'
                }}
              />
              <span className="font-bold text-xs text-[#172033]">{color}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {sizesList.map((size) => {
                const key = `${color}-${size}`;
                const val = matrixStock[key] || 0;

                return (
                  <div
                    key={size}
                    className="p-2.5 rounded-xl bg-[#FFFCF5] border border-[#DDD7CA] flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-[#172033]">Size {size}</span>
                    <input
                      type="number"
                      min={0}
                      value={val}
                      onChange={(e) => handleStockChange(key, Number(e.target.value))}
                      className="w-12 text-center py-1.5 bg-white border border-[#DDD7CA] rounded-lg font-bold text-xs focus:border-[#172B82] outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-[#DDD7CA] z-20 flex gap-2.5 shadow-lg">
        <Link
          to={`/vendor/products/${product.id}`}
          className="flex-1 py-3 text-center text-xs font-bold text-[#687085] bg-[#F5F0E6] rounded-xl"
        >
          Cancel
        </Link>
        <motion.button
          variants={buttonTapVariants}
          whileTap="tap"
          onClick={handleSave}
          disabled={isSaving}
          className="flex-2 py-3 bg-[#172B82] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#172B82]/20"
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Matrix ({totalUnits})</span>
        </motion.button>
      </div>
    </AnimatedPage>
  );
};

