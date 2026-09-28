import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronDown,
  Barcode,
  Sparkles,
  Camera,
  AlertTriangle,
  ExternalLink,
  Copy,
  Plus,
  Trash2,
  RefreshCw,
  Printer,
  X
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { BarcodeScanner } from '../../components/barcode/BarcodeScanner';
import { ProductBarcode } from '../../components/barcode/ProductBarcode';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  generateUniqueBarcode,
  checkDuplicateBarcode,
  getAllExistingBarcodes
} from '../../utils/barcodeUtils';
import { ProductVariant } from '../../types';
import { modalVariants, backdropVariants } from '../../utils/animations';

export const AddProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { categories, brands, sizes, colors, products, addProduct, updateProduct } = useData();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const isEditing = Boolean(id);
  const existingProduct = isEditing ? products.find((p) => p.id === id) : null;
  const barcodeFromUrl = searchParams.get('barcode') || '';

  const [name, setName] = useState(existingProduct?.name || '');
  const [sku, setSku] = useState(existingProduct?.sku || '');
  const [productBarcode, setProductBarcode] = useState(
    existingProduct?.barcode || barcodeFromUrl || ''
  );
  const [categoryId, setCategoryId] = useState(existingProduct?.categoryId || categories[0]?.id || '');
  const [brandId, setBrandId] = useState(existingProduct?.brandId || brands[0]?.id || '');
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [mrp, setMrp] = useState<number>(existingProduct?.mrp || 2499);
  const [sellingPrice, setSellingPrice] = useState<number>(existingProduct?.sellingPrice || 1899);
  const [stock, setStock] = useState<number>(existingProduct?.stock || 15);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(existingProduct?.lowStockThreshold || 5);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    existingProduct?.sizes || ['S', 'M', 'L']
  );
  const [imageUrl, setImageUrl] = useState(
    existingProduct?.images?.[0] ||
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=600'
  );

  // Variants list with barcodes
  const [variantsList, setVariantsList] = useState<ProductVariant[]>(() => {
    if (existingProduct?.variants && existingProduct.variants.length > 0) {
      return existingProduct.variants;
    }
    // Generate initial variants based on selected sizes
    const existingCodes = getAllExistingBarcodes(products);
    return ['S', 'M', 'L'].map((s, idx) => ({
      id: `v_${Date.now()}_${idx}`,
      sku: `WN-SKU-${s}`,
      size: s,
      color: 'Navy Imperial',
      colorHex: '#1E3A8A',
      price: 1899,
      stock: 5,
      barcode: generateUniqueBarcode([...existingCodes, `8901234567${idx}`])
    }));
  });

  // Modal camera scanner state for a specific variant
  const [scanningTargetVariantId, setScanningTargetVariantId] = useState<string | null>(null);
  const [scanningMainBarcode, setScanningMainBarcode] = useState<boolean>(false);

  // Duplicate conflict tracking
  const [duplicateConflict, setDuplicateConflict] = useState<{
    barcode: string;
    productName: string;
    variantInfo: string;
    sku: string;
    productId: string;
  } | null>(null);

  // Synchronize variants when sizes are toggled (for new product creation)
  const toggleSize = (s: string) => {
    let nextSizes: string[];
    if (selectedSizes.includes(s)) {
      nextSizes = selectedSizes.filter((item) => item !== s);
      setSelectedSizes(nextSizes);
      setVariantsList((prev) => prev.filter((v) => v.size !== s));
    } else {
      nextSizes = [...selectedSizes, s];
      setSelectedSizes(nextSizes);
      const existingCodes = [
        ...getAllExistingBarcodes(products),
        ...variantsList.map((v) => v.barcode || '')
      ];
      const newV: ProductVariant = {
        id: `v_${Date.now()}_${Math.random()}`,
        sku: `${(sku || 'WN-ITEM').toUpperCase()}-${s}`,
        size: s,
        color: variantsList[0]?.color || 'Navy Imperial',
        colorHex: variantsList[0]?.colorHex || '#1E3A8A',
        price: sellingPrice,
        stock: Math.max(1, Math.floor(stock / (nextSizes.length || 1))),
        barcode: generateUniqueBarcode(existingCodes)
      };
      setVariantsList((prev) => [...prev, newV]);
    }
  };

  const handleUpdateVariantField = (
    variantId: string,
    field: keyof ProductVariant,
    value: any
  ) => {
    setVariantsList((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );

    // Validate duplicate barcode in real-time
    if (field === 'barcode' && typeof value === 'string' && value.trim()) {
      const check = checkDuplicateBarcode(value.trim(), variantId, id || null, products);
      if (check.isDuplicate && check.conflictProduct) {
        setDuplicateConflict({
          barcode: value.trim(),
          productName: check.conflictProduct.name,
          variantInfo: check.conflictVariant
            ? `${check.conflictVariant.color} · Size ${check.conflictVariant.size}`
            : 'Base Product',
          sku: check.conflictVariant?.sku || check.conflictProduct.sku,
          productId: check.conflictProduct.id
        });
      } else {
        setDuplicateConflict(null);
      }
    }
  };

  const handleGenerateVariantBarcode = (variantId: string) => {
    const existingCodes = [
      ...getAllExistingBarcodes(products),
      ...variantsList.map((v) => v.barcode || '')
    ];
    const newBarcode = generateUniqueBarcode(existingCodes);
    handleUpdateVariantField(variantId, 'barcode', newBarcode);
    success('Barcode Generated', `Assigned unique EAN-13 barcode: ${newBarcode}`);
  };

  const handleGenerateMainBarcode = () => {
    const existingCodes = [
      ...getAllExistingBarcodes(products),
      ...variantsList.map((v) => v.barcode || '')
    ];
    const newBarcode = generateUniqueBarcode(existingCodes);
    setProductBarcode(newBarcode);
    success('Main Barcode Generated', `${newBarcode} assigned to product.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) {
      error('Missing fields', 'Product name and SKU are required.');
      return;
    }

    // Step 1: Check for duplicate barcodes among variants
    const usedInForm = new Set<string>();
    for (const v of variantsList) {
      if (v.barcode) {
        const clean = v.barcode.trim();
        if (usedInForm.has(clean)) {
          error(
            'Duplicate Barcode in Form',
            `Barcode ${clean} is assigned multiple times within this product's variants.`
          );
          return;
        }
        usedInForm.add(clean);

        // Check against existing catalog
        const check = checkDuplicateBarcode(clean, v.id, id || null, products);
        if (check.isDuplicate && check.conflictProduct) {
          setDuplicateConflict({
            barcode: clean,
            productName: check.conflictProduct.name,
            variantInfo: check.conflictVariant
              ? `${check.conflictVariant.color} · Size ${check.conflictVariant.size}`
              : 'Base Product',
            sku: check.conflictVariant?.sku || check.conflictProduct.sku,
            productId: check.conflictProduct.id
          });
          error(
            'Barcode Already Exists',
            `Barcode ${clean} is already assigned to ${check.conflictProduct.name}.`
          );
          return;
        }
      }
    }

    const cat = categories.find((c) => c.id === categoryId) || categories[0];
    const br = brands.find((b) => b.id === brandId) || brands[0];
    const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
    const totalVariantStock = variantsList.reduce((sum, v) => sum + Number(v.stock), 0);
    const effectiveStock = totalVariantStock > 0 ? totalVariantStock : Number(stock);

    if (isEditing && id) {
      updateProduct(id, {
        name,
        sku: sku.toUpperCase(),
        barcode: productBarcode || variantsList[0]?.barcode,
        category: cat.name,
        categoryId: cat.id,
        brand: br.name,
        brandId: br.id,
        description,
        mrp: Number(mrp),
        sellingPrice: Number(sellingPrice),
        discountPercent: discount > 0 ? discount : 0,
        stock: effectiveStock,
        lowStockThreshold: Number(lowStockThreshold),
        sizes: selectedSizes,
        images: [imageUrl],
        variants: variantsList
      });
      success('Product Updated', `${name} updated with ${variantsList.length} barcode variants.`);
      navigate(`/vendor/products/${id}`);
    } else {
      const newProd = addProduct({
        name,
        sku: sku.toUpperCase(),
        barcode: productBarcode || variantsList[0]?.barcode,
        category: cat.name,
        categoryId: cat.id,
        brand: br.name,
        brandId: br.id,
        description: description || 'Premium fashion merchandise for instant local delivery.',
        mrp: Number(mrp),
        sellingPrice: Number(sellingPrice),
        discountPercent: discount > 0 ? discount : 0,
        stock: effectiveStock,
        lowStockThreshold: Number(lowStockThreshold),
        status: effectiveStock > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
        images: [imageUrl],
        sizes: selectedSizes,
        colors: [{ name: 'Navy Imperial', hex: '#1E3A8A' }],
        variants: variantsList
      });

      success('Product Created', `${newProd.name} added to catalog with unique barcodes.`);
      navigate(`/vendor/products/${newProd.id}`);
    }
  };

  return (
    <AnimatedPage>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pb-24 lg:pb-6">
        <PageHeader
          title={isEditing ? `Edit Product: ${existingProduct?.name}` : 'Add New Retail Garment'}
          subtitle="Configure product taxonomy, pricing, SKU barcodes, and variant stock matrix."
          breadcrumbs={[
            { label: 'Products', path: '/vendor/products' },
            { label: isEditing ? 'Edit Product' : 'Add Product' }
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Link to="/vendor/products" className="wn-btn-secondary text-xs sm:text-sm">
                Cancel
              </Link>
              <button
                type="submit"
                className="wn-btn-primary text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#172B82]/20"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Create Product & Barcodes'}</span>
              </button>
            </div>
          }
        />

        {/* Duplicate Barcode Error Alert Banner */}
        {duplicateConflict && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-rose-50 border border-rose-200 rounded-3xl text-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#DC2626] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Barcode Already Exists
              </span>
              <button
                type="button"
                onClick={() => setDuplicateConflict(null)}
                className="text-[#687085] hover:text-[#172033]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[#172033]">
              Barcode <strong className="font-mono text-[#DC2626]">{duplicateConflict.barcode}</strong> is already assigned to active inventory in your store:
            </p>
            <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#172033]">{duplicateConflict.productName}</p>
                <p className="text-[11px] text-[#687085]">
                  Variant: {duplicateConflict.variantInfo} • SKU: {duplicateConflict.sku}
                </p>
              </div>
              <Link
                to={`/vendor/products/${duplicateConflict.productId}`}
                target="_blank"
                className="wn-btn-secondary text-[11px] py-1 px-3 flex items-center gap-1"
              >
                <span>View Product</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-[11px] text-[#DC2626] font-medium">
              Please generate a new barcode or assign an alternate barcode to prevent scanner collisions.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left Column (8 cols): Main details, Pricing, Variants & Barcodes */}
          <div className="lg:col-span-8 space-y-5">
            {/* Section 1: Basic Garment Identity */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5">
                Garment Identity & Classification
              </h3>

              <div>
                <label className="wn-label">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Pure Mulberry Silk Festive Kurta Set"
                  className="wn-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="wn-label">Master SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g., VL-MSK-01"
                    className="wn-input font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="wn-label">Master Barcode (EAN-13)</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={productBarcode}
                      onChange={(e) => setProductBarcode(e.target.value)}
                      placeholder="e.g. 8901234567011"
                      className="wn-input font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateMainBarcode}
                      title="Generate Unique Barcode"
                      className="wn-btn-secondary text-[11px] px-2.5 shrink-0 flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#172B82]" />
                      <span>Gen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setScanningMainBarcode(true)}
                      title="Scan Barcode via Camera"
                      className="wn-btn-secondary text-[11px] px-2.5 shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              </div>

              <div>
                <label className="wn-label">Description & Fabric Composition</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify fabric weave, silk weight, collar embroidery, care details..."
                  className="wn-input resize-none"
                />
              </div>
            </div>

            {/* Section 2: Pricing & Commercials */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-4">
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
                    {Math.round(((mrp - sellingPrice) / mrp) * 100)}% OFF MRP
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: PRODUCT VARIANTS & UNIQUE BARCODES MATRIX */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD7CA] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-[#172B82]" />
                    Product Variants & Barcode Matrix
                  </h3>
                  <p className="text-xs text-[#687085]">
                    Each variant holds its own unique SKU, barcode tag, and shelf inventory
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#172B82] bg-[#172B82]/10 px-2.5 py-1 rounded-xl">
                    {variantsList.length} Active Variants
                  </span>
                </div>
              </div>

              {/* Size offering pills */}
              <div className="space-y-1.5">
                <span className="text-xs text-[#687085]">Toggle sizes to generate variant rows:</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {sizes.map((s) => {
                    const isSelected = selectedSizes.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize(s)}
                        className={`min-w-[42px] h-9 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-[#172B82] text-white border-[#172B82] shadow-xs'
                            : 'bg-white text-[#172033] border-[#DDD7CA] hover:bg-[#F5F0E6]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Variants Table / Cards */}
              <div className="space-y-3 pt-2">
                {variantsList.map((v, idx) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA] space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#172B82] text-white font-bold flex items-center justify-center text-[11px]">
                          {v.size}
                        </span>
                        <span className="font-bold text-[#172033]">
                          Variant #{idx + 1} ({v.color} · Size {v.size})
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleGenerateVariantBarcode(v.id)}
                          className="wn-btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-[#172B82]" />
                          <span>Generate Barcode</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setScanningTargetVariantId(v.id)}
                          className="wn-btn-secondary text-[11px] py-1 px-2 flex items-center gap-1"
                          title="Scan Barcode via Camera"
                        >
                          <Camera className="w-3 h-3" />
                          <span className="hidden sm:inline">Scan</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="wn-label text-[10px]">Variant SKU</label>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => handleUpdateVariantField(v.id, 'sku', e.target.value)}
                          className="wn-input py-1.5 text-xs font-mono uppercase"
                        />
                      </div>

                      <div>
                        <label className="wn-label text-[10px]">Unique Barcode (EAN-13)</label>
                        <input
                          type="text"
                          value={v.barcode || ''}
                          onChange={(e) => handleUpdateVariantField(v.id, 'barcode', e.target.value)}
                          placeholder="890..."
                          className="wn-input py-1.5 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="wn-label text-[10px]">Selling Price (₹)</label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleUpdateVariantField(v.id, 'price', Number(e.target.value))}
                          className="wn-input py-1.5 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="wn-label text-[10px]">Shelf Stock Units</label>
                        <input
                          type="number"
                          min={0}
                          value={v.stock}
                          onChange={(e) => handleUpdateVariantField(v.id, 'stock', Number(e.target.value))}
                          className="wn-input py-1.5 text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Vector Barcode Preview inside Variant Row */}
                    {v.barcode && (
                      <div className="pt-2 border-t border-[#DDD7CA]/60 flex items-center justify-between text-[11px]">
                        <span className="text-[#687085]">Rendered Barcode Sticker Preview:</span>
                        <ProductBarcode barcode={v.barcode} height={28} width={1.2} fontSize={10} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Product Images & Stock Control */}
          <div className="lg:col-span-4 space-y-5">
            {/* Image Preview */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5">
                Garment Photograph Preview
              </h3>

              <div className="aspect-square rounded-2xl overflow-hidden border border-[#DDD7CA] bg-[#FFFCF5]">
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
              </div>
            </div>

            {/* Inventory Safety Control */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5">
                Catalog Inventory Controls
              </h3>

              <div>
                <label className="wn-label">Cumulative Total Units</label>
                <div className="wn-input bg-[#FFFCF5] font-extrabold text-sm text-[#172B82] flex items-center justify-between">
                  <span>{variantsList.reduce((s, v) => s + Number(v.stock), 0)} Units</span>
                  <span className="text-[10px] text-[#687085] font-normal">Sum of variants</span>
                </div>
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
                  Alerts cashier and triggers restock warning when variant shelf stock dips below this level.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Camera Scanner when scanning barcode for variant or master product */}
        {(scanningTargetVariantId || scanningMainBarcode) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => {
                setScanningTargetVariantId(null);
                setScanningMainBarcode(false);
              }}
              className="fixed inset-0 bg-[#172033]/60 backdrop-blur-sm"
            />
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative w-full max-w-lg bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl p-5 z-10 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#DDD7CA]">
                <h4 className="text-sm font-bold text-[#172033]">
                  Scan Barcode from Garment Tag
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setScanningTargetVariantId(null);
                    setScanningMainBarcode(false);
                  }}
                  className="p-1 rounded-lg text-[#687085]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <BarcodeScanner
                onScan={(code) => {
                  if (scanningTargetVariantId) {
                    handleUpdateVariantField(scanningTargetVariantId, 'barcode', code);
                    setScanningTargetVariantId(null);
                    success('Barcode Tag Assigned', `Barcode ${code} attached to variant.`);
                  } else if (scanningMainBarcode) {
                    setProductBarcode(code);
                    setScanningMainBarcode(false);
                    success('Master Barcode Assigned', `Barcode ${code} attached to product.`);
                  }
                }}
                showSimulatedBarcodes={true}
              />
            </motion.div>
          </div>
        )}
      </form>
    </AnimatedPage>
  );
};
