import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check,
  ChevronDown
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const AddProductPage: React.FC = () => {
  const { categories, brands, sizes, addProduct } = useData();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [brandId, setBrandId] = useState(brands[0]?.id || '');
  const [description, setDescription] = useState('');
  const [mrp, setMrp] = useState<number>(2499);
  const [sellingPrice, setSellingPrice] = useState<number>(1899);
  const [stock, setStock] = useState<number>(15);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=600'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) {
      error('Missing fields', 'Product name and SKU are required.');
      return;
    }

    const cat = categories.find((c) => c.id === categoryId) || categories[0];
    const br = brands.find((b) => b.id === brandId) || brands[0];
    const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);

    const newProd = addProduct({
      name,
      sku: sku.toUpperCase(),
      category: cat.name,
      categoryId: cat.id,
      brand: br.name,
      brandId: br.id,
      description: description || 'Premium fashion merchandise for instant local delivery.',
      mrp: Number(mrp),
      sellingPrice: Number(sellingPrice),
      discountPercent: discount > 0 ? discount : 0,
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      status: Number(stock) > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
      images: [imageUrl],
      sizes: selectedSizes,
      colors: [{ name: 'Navy Imperial', hex: '#1E3A8A' }],
      variants: selectedSizes.map((s, idx) => ({
        id: `v_${Date.now()}_${idx}`,
        sku: `${sku.toUpperCase()}-${s}`,
        size: s,
        color: 'Navy Imperial',
        colorHex: '#1E3A8A',
        price: Number(sellingPrice),
        stock: Math.floor(Number(stock) / selectedSizes.length)
      }))
    });

    success('Product Created', `${newProd.name} added to catalog.`);
    navigate(`/vendor/products/${newProd.id}/variants`);
  };

  const toggleSize = (s: string) => {
    if (selectedSizes.includes(s)) {
      setSelectedSizes(selectedSizes.filter((item) => item !== s));
    } else {
      setSelectedSizes([...selectedSizes, s]);
    }
  };

  return (
    <AnimatedPage>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pb-24 lg:pb-6">
        <PageHeader
          title="Add New Garment / Product"
          subtitle="Create an SKU with sizes, colors, retail pricing and inventory thresholds."
          breadcrumbs={[
            { label: 'Products', path: '/vendor/products' },
            { label: 'Add Product' }
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Link to="/vendor/products" className="wn-btn-secondary text-xs">
                Cancel
              </Link>
              <button type="submit" className="wn-btn-primary text-xs">
                <Check className="w-4 h-4" /> Save & Setup Variants
              </button>
            </div>
          }
        />

        {/* Responsive Grid: Single column on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column (8 cols): Information & Pricing */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Section 1: Basic Information */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CA] shadow-xs space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5">
                Basic Product Information
              </h3>

              <div>
                <label className="wn-label">Garment / Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fine Tailored Italian Linen Shirt"
                  className="wn-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="wn-label">SKU (Stock Keeping Unit) *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. VL-SHIRT-09"
                    className="wn-input uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="wn-label">Brand</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="wn-input"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="wn-label">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="wn-input"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="wn-label">Description & Fabric Composition</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify pure cotton, linen, silk weight, weave type, washcare instructions..."
                  className="wn-input resize-none"
                />
              </div>
            </div>

            {/* Section 2: Pricing & Commercials */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CA] shadow-xs space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5">
                Pricing & Discounts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="wn-label">MRP (Max Retail Price)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#687085]">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={mrp}
                      onChange={(e) => setMrp(Number(e.target.value))}
                      className="wn-input pl-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="wn-label">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#687085]">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="wn-input pl-8 font-bold text-[#172B82]"
                    />
                  </div>
                </div>

                <div>
                  <label className="wn-label">Calculated Discount</label>
                  <div className="wn-input bg-[#FFFCF5] font-semibold text-emerald-600 flex items-center">
                    {Math.round(((mrp - sellingPrice) / mrp) * 100)}% OFF
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Available Sizes */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CA] shadow-xs space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5">
                Size Offerings
              </h3>
              <p className="text-xs text-[#687085]">Select all sizes available in store stock:</p>

              <div className="flex flex-wrap gap-2 pt-1">
                {sizes.map((s) => {
                  const isSelected = selectedSizes.includes(s);
                  return (
                    <motion.button
                      key={s}
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => toggleSize(s)}
                      className={`min-w-[46px] h-11 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-[#172B82] text-white border-[#172B82] shadow-xs'
                          : 'bg-white text-[#172033] border-[#DDD7CA] hover:bg-[#F5F0E6]'
                      }`}
                    >
                      {s}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Product Images & Stock Control */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Section 4: Image Upload / Preview */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CA] shadow-xs space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5">
                Product Image Preview
              </h3>

              <div className="aspect-square rounded-xl overflow-hidden border border-[#DDD7CA] relative group bg-[#FFFCF5]">
                <img
                  src={imageUrl}
                  alt="Product Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <label className="wn-label">Image Source URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="wn-input text-xs"
                />
                <p className="text-[10px] text-[#687085] mt-1">
                  High-res 1:1 image recommended for marketplace cards.
                </p>
              </div>
            </div>

            {/* Section 5: Initial Inventory Stock */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#DDD7CA] shadow-xs space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5">
                Stock & Inventory Control
              </h3>

              <div>
                <label className="wn-label">Total Units on Hand</label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="wn-input font-bold"
                />
              </div>

              <div>
                <label className="wn-label">Low Stock Safety Threshold</label>
                <input
                  type="number"
                  min={1}
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="wn-input"
                />
                <p className="text-[10px] text-[#687085] mt-1">
                  Triggers an urgent restock alert when stock dips below this value.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Actions Bar */}
        <div className="lg:hidden fixed bottom-14 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#DDD7CA] p-3 shadow-lg flex items-center justify-between gap-3 z-30">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#172033]">₹{sellingPrice}</span>
            <span className="text-[10px] text-[#687085]">{selectedSizes.length} sizes selected</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="flex-1 wn-btn-primary text-xs py-2.5 min-h-[44px] font-bold"
          >
            Save & Setup Variants
          </motion.button>
        </div>
      </form>
    </AnimatedPage>
  );
};
