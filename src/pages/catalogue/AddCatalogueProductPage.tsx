import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Layers,
  Barcode,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Send,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  Upload,
  Check,
  X
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ProductVariant } from '../../types';

export const AddCatalogueProductPage: React.FC = () => {
  const { categories, brands, addProduct, submitProductForApproval } = useData();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Wizard Step State (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1: Basic Information
  const [name, setName] = useState('Nike Oversized Heavyweight Cotton T-Shirt');
  const [brand, setBrand] = useState('Urban Stitch Co');
  const [brandId, setBrandId] = useState('br_3');
  const [category, setCategory] = useState("Men's Shirts & Kurtas");
  const [categoryId, setCategoryId] = useState('cat_1');
  const [description, setDescription] = useState(
    'Premium 240 GSM combed cotton oversized drop-shoulder graphic t-shirt. Breathable open-weave structure with reinforced ribbed collar.'
  );
  const [mrp, setMrp] = useState(2199);
  const [sellingPrice, setSellingPrice] = useState(1599);

  // STEP 2: Images
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=600'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // STEP 3: Variants
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: 'v_1', sku: 'WN-TS-BLK-S', size: 'S', color: 'Midnight Black', colorHex: '#111827', price: 1599, stock: 10, availableStock: 10, reservedStock: 0, barcode: '8901234567990', barcodeFormat: 'EAN-13' },
    { id: 'v_2', sku: 'WN-TS-BLK-M', size: 'M', color: 'Midnight Black', colorHex: '#111827', price: 1599, stock: 15, availableStock: 15, reservedStock: 0, barcode: '8901234567991', barcodeFormat: 'EAN-13' },
    { id: 'v_3', sku: 'WN-TS-BLK-L', size: 'L', color: 'Midnight Black', colorHex: '#111827', price: 1599, stock: 20, availableStock: 20, reservedStock: 0, barcode: '8901234567992', barcodeFormat: 'EAN-13' },
    { id: 'v_4', sku: 'WN-TS-BLK-XL', size: 'XL', color: 'Midnight Black', colorHex: '#111827', price: 1599, stock: 8, availableStock: 8, reservedStock: 0, barcode: '8901234567993', barcodeFormat: 'EAN-13' }
  ]);

  // Modal Submit Confirmation
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper calculation
  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  const baseSku = variants[0]?.sku ? variants[0].sku.split('-').slice(0, 3).join('-') : 'WN-TS-BLK';

  // Mandatory Checks
  const isBasicInfoComplete = name.trim() !== '' && brand !== '' && category !== '' && sellingPrice > 0;
  const isImagesComplete = images.length > 0;
  const isVariantsComplete = variants.length > 0;
  const isSkuComplete = variants.every((v) => v.sku.trim() !== '');
  const isBarcodeComplete = variants.every((v) => v.barcode && v.barcode.trim() !== '');
  const isStockComplete = totalStock > 0;

  const isProductReady =
    isBasicInfoComplete &&
    isImagesComplete &&
    isVariantsComplete &&
    isSkuComplete &&
    isBarcodeComplete &&
    isStockComplete;

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleAddVariantRow = () => {
    const nextIdx = variants.length + 1;
    const newV: ProductVariant = {
      id: `v_${Date.now()}`,
      sku: `WN-TS-BLK-V${nextIdx}`,
      size: 'L',
      color: 'Midnight Black',
      colorHex: '#111827',
      price: sellingPrice,
      stock: 10,
      availableStock: 10,
      reservedStock: 0,
      barcode: `890123456${Math.floor(1000 + Math.random() * 9000)}`,
      barcodeFormat: 'EAN-13'
    };
    setVariants([...variants, newV]);
  };

  const handleUpdateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleGenerateBarcodeForVariant = (id: string) => {
    const generated = `890123456${Math.floor(1000 + Math.random() * 9000)}`;
    handleUpdateVariant(id, { barcode: generated, barcodeFormat: 'EAN-13' });
    success('Barcode Generated', `Assigned EAN-13 barcode ${generated}`);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    try {
      const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
      const newProd = addProduct({
        name,
        sku: baseSku,
        barcode: variants[0]?.barcode || '8901234567990',
        barcodeFormat: 'EAN-13',
        category,
        categoryId,
        brand,
        brandId,
        description,
        mrp,
        sellingPrice,
        discountPercent: discount,
        stock: totalStock,
        lowStockThreshold: 5,
        status: 'UNDER_REVIEW',
        images,
        sizes: Array.from(new Set(variants.map((v) => v.size))),
        colors: [{ name: 'Midnight Black', hex: '#111827' }],
        variants
      });

      submitProductForApproval(newProd.id, 'Neha Gupta (Catalogue Executive)');
      success(
        'Product Submitted for Approval',
        `Submitted ${newProd.name} to Store Owner for publication review.`
      );
      setIsSubmitModalOpen(false);
      navigate('/vendor/catalogue/products');
    } catch (err) {
      error('Submission Failed', 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 pb-20 max-w-4xl mx-auto">
        <PageHeader
          title="Create New Garment Product"
          subtitle="Prepare product details, variants, barcode labels, and initial stock inwarding."
          breadcrumbs={[
            { label: 'Catalogue Desk', path: '/vendor/catalogue/products' },
            { label: 'Add Product' }
          ]}
        />

        {/* Wizard Progress Bar */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#172033] mb-2">
            <span>STEP {currentStep} OF 6</span>
            <span className="text-[#172B82]">
              {currentStep === 1 && 'Basic Information'}
              {currentStep === 2 && 'Product Images'}
              {currentStep === 3 && 'Variants & Pricing'}
              {currentStep === 4 && 'Barcode Tags'}
              {currentStep === 5 && 'Initial Stock'}
              {currentStep === 6 && 'Readiness & Approval'}
            </span>
          </div>
          <div className="w-full bg-[#F5F0E6] h-2.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-[#172B82] h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="grid grid-cols-6 gap-1 mt-3 text-center text-[10px] font-semibold text-[#687085]">
            <span className={currentStep >= 1 ? 'text-[#172B82] font-bold' : ''}>1. Info</span>
            <span className={currentStep >= 2 ? 'text-[#172B82] font-bold' : ''}>2. Images</span>
            <span className={currentStep >= 3 ? 'text-[#172B82] font-bold' : ''}>3. Variants</span>
            <span className={currentStep >= 4 ? 'text-[#172B82] font-bold' : ''}>4. Barcode</span>
            <span className={currentStep >= 5 ? 'text-[#172B82] font-bold' : ''}>5. Stock</span>
            <span className={currentStep >= 6 ? 'text-[#172B82] font-bold' : ''}>6. Review</span>
          </div>
        </div>

        {/* STEP 1: BASIC INFORMATION */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[#172033] border-b border-[#DDD7CA] pb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#172B82]" /> Step 1: Basic Garment Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="wn-label">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nike Oversized Heavyweight T-Shirt"
                  className="wn-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="wn-label">Brand *</label>
                  <select
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                      const b = brands.find((br) => br.name === e.target.value);
                      if (b) setBrandId(b.id);
                    }}
                    className="wn-select"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="wn-label">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      const c = categories.find((cat) => cat.name === e.target.value);
                      if (c) setCategoryId(c.id);
                    }}
                    className="wn-select"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="wn-label">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="wn-input"
                  />
                </div>
                <div>
                  <label className="wn-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="wn-input font-bold text-[#172B82]"
                  />
                </div>
              </div>

              <div>
                <label className="wn-label">Description *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe fabric weave, fit, care instructions..."
                  className="wn-input text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: IMAGES */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[#172033] border-b border-[#DDD7CA] pb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#172B82]" /> Step 2: Product Photography
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Paste Image URL..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="wn-input flex-1 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="wn-btn-primary px-4 py-2.5 text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Image
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#DDD7CA] bg-[#F5F0E6]">
                    <img src={img} alt={`Product ${idx}`} className="w-full h-36 object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-[#172B82] text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow">
                        PRIMARY
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: VARIANTS */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#DDD7CA] pb-3">
              <h3 className="font-bold text-base text-[#172033] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#172B82]" /> Step 3: Size & Color Variants
              </h3>
              <button
                type="button"
                onClick={handleAddVariantRow}
                className="wn-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((v) => (
                <div key={v.id} className="bg-[#FFFCF5] p-3.5 rounded-2xl border border-[#DDD7CA] grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-xs">
                  <div>
                    <label className="wn-label mb-0 text-[10px]">SKU Code</label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => handleUpdateVariant(v.id, { sku: e.target.value })}
                      className="wn-input py-1.5 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="wn-label mb-0 text-[10px]">Size</label>
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => handleUpdateVariant(v.id, { size: e.target.value })}
                      className="wn-input py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="wn-label mb-0 text-[10px]">Color</label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => handleUpdateVariant(v.id, { color: e.target.value })}
                      className="wn-input py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="wn-label mb-0 text-[10px]">Price (₹)</label>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => handleUpdateVariant(v.id, { price: Number(e.target.value) })}
                      className="wn-input py-1.5 text-xs font-bold text-[#172B82]"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 sm:pt-0">
                    <button
                      onClick={() => handleRemoveVariant(v.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: BARCODE */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[#172033] border-b border-[#DDD7CA] pb-3 flex items-center gap-2">
              <Barcode className="w-5 h-5 text-[#172B82]" /> Step 4: EAN-13 Barcode Tagging
            </h3>

            <div className="space-y-3">
              {variants.map((v) => (
                <div key={v.id} className="bg-[#FFFCF5] p-3.5 rounded-2xl border border-[#DDD7CA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-[#172033]">{v.size} · {v.color}</p>
                    <p className="text-[11px] font-mono text-[#687085]">SKU: {v.sku}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={v.barcode || ''}
                      onChange={(e) => handleUpdateVariant(v.id, { barcode: e.target.value })}
                      placeholder="EAN-13 Barcode"
                      className="wn-input py-1.5 font-mono text-xs w-44"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateBarcodeForVariant(v.id)}
                      className="wn-btn-secondary py-1.5 px-3 text-xs font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Generate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: STOCK */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[#172033] border-b border-[#DDD7CA] pb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#172B82]" /> Step 5: Initial Stock Inwarding
            </h3>

            <div className="space-y-3">
              {variants.map((v) => (
                <div key={v.id} className="bg-[#FFFCF5] p-3.5 rounded-2xl border border-[#DDD7CA] flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-[#172033]">{v.size} · {v.color}</p>
                    <p className="text-[11px] font-mono text-[#687085]">SKU: {v.sku}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-[#687085]">Inward Units:</label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleUpdateVariant(v.id, { stock: Number(e.target.value), availableStock: Number(e.target.value) })}
                      className="wn-input py-1.5 w-24 text-center font-bold text-[#172B82]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: READINESS & APPROVAL SUBMISSION */}
        {currentStep === 6 && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-6 shadow-xs">
            <div className="border-b border-[#DDD7CA] pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#172033] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Step 6: Product Readiness Checklist
                </h3>
                <p className="text-xs text-[#687085]">Verify mandatory requirements prior to Store Owner review submission.</p>
              </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Product Name & Category', valid: isBasicInfoComplete },
                { label: 'Garment Photography (At least 1 image)', valid: isImagesComplete },
                { label: 'SKU Code Assignments', valid: isSkuComplete },
                { label: 'Size & Color Variants (At least 1)', valid: isVariantsComplete },
                { label: 'EAN-13 Barcode Tagging', valid: isBarcodeComplete },
                { label: 'Initial Inward Stock (> 0)', valid: isStockComplete }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    item.valid ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <span className="font-semibold">{item.label}</span>
                  {item.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Final Callout */}
            {isProductReady ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl text-emerald-900 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm">READY FOR STORE OWNER REVIEW</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Product details, image preview, SKU variants, barcodes, and stock are complete. Submitting will update status to <span className="font-bold">UNDER_REVIEW</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="wn-btn-primary px-6 py-3 text-xs font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit for Store Approval</span>
                </button>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl text-rose-950 space-y-2">
                <span className="font-bold text-sm flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" /> Product Not Ready for Review
                </span>
                <p className="text-xs text-rose-800">
                  Please complete all missing checklist items marked above before submitting to the Store Manager.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="wn-btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < 6 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
              className="wn-btn-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-1"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal: Submission Confirmation */}
        <AnimatePresence>
          {isSubmitModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className="px-6 py-4 bg-[#172B82] text-white flex items-center justify-between">
                  <h3 className="font-bold text-base">Submit Product for Approval?</h3>
                  <button onClick={() => setIsSubmitModalOpen(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4 text-xs">
                  <div className="space-y-1 bg-[#F5F0E6] p-4 rounded-xl border border-[#DDD7CA]">
                    <p className="font-bold text-sm text-[#172033]">{name}</p>
                    <p className="text-[#687085]">{variants.length} Variants · Total Stock: {totalStock} Units</p>
                    <p className="text-[11px] text-[#172B82] font-semibold mt-1">
                      Submitted by: Neha Gupta (Catalogue Executive)
                    </p>
                  </div>

                  <p className="text-[#687085]">
                    Once submitted, status will change to <span className="font-bold text-amber-700">UNDER_REVIEW</span>. The Store Owner will review and publish the product LIVE to customers.
                  </p>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="wn-btn-secondary px-4 py-2 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleFinalSubmit}
                      className="wn-btn-primary px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm & Submit</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
};

export default AddCatalogueProductPage;
