import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Printer,
  Tag,
  Download,
  Layers,
  Sparkles,
  CheckCircle2,
  Copy,
  ChevronRight,
  Sliders,
  Grid
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { BarcodeLabel } from '../../components/barcode/BarcodeLabel';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Product, ProductVariant } from '../../types';
import { buttonTapVariants } from '../../utils/animations';

export const BarcodeLabelsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { products } = useData();
  const { success } = useToast();

  const preselectedSku = searchParams.get('sku');
  const preselectedProductId = searchParams.get('productId');

  // Selected product & variant state
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    if (preselectedProductId) return preselectedProductId;
    if (preselectedSku) {
      const found = products.find(
        (p) => p.sku === preselectedSku || p.variants?.some((v) => v.sku === preselectedSku)
      );
      if (found) return found.id;
    }
    return products[0]?.id || '';
  });

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    if (preselectedSku && selectedProduct?.variants) {
      const matchV = selectedProduct.variants.find((v) => v.sku === preselectedSku);
      if (matchV) return matchV.id;
    }
    return selectedProduct?.variants?.[0]?.id || '';
  });

  // Whenever product changes, update variant selection
  useEffect(() => {
    if (selectedProduct?.variants && selectedProduct.variants.length > 0) {
      const exists = selectedProduct.variants.some((v) => v.id === selectedVariantId);
      if (!exists) {
        setSelectedVariantId(selectedProduct.variants[0].id);
      }
    } else {
      setSelectedVariantId('');
    }
  }, [selectedProduct, selectedVariantId]);

  const selectedVariant = useMemo(() => {
    if (!selectedProduct?.variants) return undefined;
    return selectedProduct.variants.find((v) => v.id === selectedVariantId);
  }, [selectedProduct, selectedVariantId]);

  const [quantity, setQuantity] = useState<number>(12);
  const [labelFormat, setLabelFormat] = useState<'standard' | 'compact'>('standard');
  const [isGenerating, setIsGenerating] = useState(false);

  const effectiveBarcode =
    selectedVariant?.barcode || selectedProduct?.barcode || '8901234567011';
  const effectiveSku = selectedVariant?.sku || selectedProduct?.sku || 'WN-SKU';
  const effectiveSize = selectedVariant?.size || selectedProduct?.sizes?.[0] || 'Standard';
  const effectiveColor = selectedVariant?.color || selectedProduct?.colors?.[0]?.name || 'Standard';
  const effectivePrice = selectedVariant?.price || selectedProduct?.sellingPrice || 1499;
  const effectiveMrp = selectedProduct?.mrp || effectivePrice * 1.3;

  const handlePrint = () => {
    window.print();
    success('Print Dialog Opened', `Sending ${quantity} labels to printer.`);
  };

  return (
    <AnimatedPage className="space-y-6 pb-24 md:pb-8">
      {/* Top Header */}
      <div className="print:hidden">
        <PageHeader
          title="Print Retail Barcode Labels"
          subtitle="Generate high-resolution printable garment tags with WearNear branding and EAN-13 / Code 128 barcodes."
          breadcrumbs={[
            { label: 'Products', path: '/vendor/products' },
            { label: 'Barcode Labels' }
          ]}
          actions={
            <div className="flex items-center gap-2">
              <motion.button
                variants={buttonTapVariants}
                whileTap="tap"
                onClick={handlePrint}
                className="wn-btn-primary text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#172B82]/20"
              >
                <Printer className="w-4 h-4" />
                <span>Print {quantity} Labels</span>
              </motion.button>
            </div>
          }
        />
      </div>

      {/* Configuration Controls Bar */}
      <div className="print:hidden bg-white rounded-3xl border border-[#DDD7CA] p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDD7CA]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#172B82]" />
            <h3 className="text-sm font-bold text-[#172033]">
              Label Configuration & Garment Selection
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#172B82] bg-[#172B82]/10 px-2.5 py-1 rounded-lg">
            Barcode: {effectiveBarcode}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Product Selector */}
          <div>
            <label className="wn-label">Select Garment</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="wn-input"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Variant Selector */}
          <div>
            <label className="wn-label">Variant (Size / Color)</label>
            {selectedProduct?.variants && selectedProduct.variants.length > 0 ? (
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="wn-input"
              >
                {selectedProduct.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.color} · Size {v.size} (Stock: {v.stock})
                  </option>
                ))}
              </select>
            ) : (
              <div className="wn-input bg-[#FFFCF5] text-[#687085] flex items-center">
                Standard Catalog Item (No Variants)
              </div>
            )}
          </div>

          {/* Number of Labels */}
          <div>
            <label className="wn-label">Number of Labels to Print</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value))))}
                className="wn-input font-bold"
              />
              <div className="flex gap-1">
                {[1, 10, 20, 50].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`px-2 py-2 rounded-lg text-[10px] font-bold border transition-colors ${
                      quantity === q
                        ? 'bg-[#172B82] text-white border-[#172B82]'
                        : 'bg-[#FFFCF5] text-[#687085] border-[#DDD7CA] hover:bg-[#F5F0E6]'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Label Dimensions */}
          <div>
            <label className="wn-label">Label Layout Type</label>
            <select
              value={labelFormat}
              onChange={(e) => setLabelFormat(e.target.value as any)}
              className="wn-input"
            >
              <option value="standard">Standard Hangtag (2.5" × 3.5")</option>
              <option value="compact">Compact Shelf Sticker (2" × 2.8")</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Printable Preview Grid */}
      <div className="space-y-3">
        <div className="print:hidden flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#172B82]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#172033]">
              Print Sheet Layout Preview ({quantity} Tags Generated)
            </h3>
          </div>
          <span className="text-xs text-[#687085]">
            Optimized for 24-up A4 sticker sheets and thermal printers
          </span>
        </div>

        {/* The Printable Container */}
        <div className="bg-[#FFFCF5] p-6 sm:p-8 rounded-3xl border border-[#DDD7CA] print:p-0 print:border-none print:bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3 print:gap-2 justify-items-center">
            {Array.from({ length: quantity }).map((_, index) => (
              <BarcodeLabel
                key={index}
                productName={selectedProduct?.name || 'Garment'}
                brand={selectedProduct?.brand}
                sku={effectiveSku}
                size={effectiveSize}
                color={effectiveColor}
                mrp={effectiveMrp}
                sellingPrice={effectivePrice}
                barcode={effectiveBarcode}
                compact={labelFormat === 'compact'}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
