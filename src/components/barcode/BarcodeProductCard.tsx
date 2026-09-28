import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Plus,
  ShoppingCart,
  Printer,
  ExternalLink,
  Layers,
  Tag
} from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { ProductBarcode } from './ProductBarcode';
import { slideUp, buttonTapVariants } from '../../utils/animations';

interface BarcodeProductCardProps {
  product: Product;
  variant?: ProductVariant;
  barcode: string;
  onAddToBill?: () => void;
  onPrintLabel?: () => void;
  onAdjustStock?: () => void;
  className?: string;
}

export const BarcodeProductCard: React.FC<BarcodeProductCardProps> = ({
  product,
  variant,
  barcode,
  onAddToBill,
  onPrintLabel,
  onAdjustStock,
  className = ''
}) => {
  const effectivePrice = variant?.price ?? product.sellingPrice;
  const effectiveMrp = product.mrp;
  const effectiveStock = variant ? (variant.availableStock ?? variant.stock) : product.stock;
  const isOutOfStock = effectiveStock <= 0;
  const isLowStock = !isOutOfStock && effectiveStock <= product.lowStockThreshold;

  const size = variant?.size || product.sizes?.[0] || 'Standard';
  const color = variant?.color || product.colors?.[0]?.name || 'Standard';
  const colorHex = variant?.colorHex || product.colors?.[0]?.hex;
  const sku = variant?.sku || product.sku;

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`bg-white rounded-3xl border border-[#DDD7CA] p-4 sm:p-6 shadow-md space-y-4 ${className}`}
    >
      {/* Top Success / Status Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDD7CA]">
        <div className="flex items-center gap-2">
          {isOutOfStock ? (
            <div className="w-6 h-6 rounded-full bg-rose-100 text-[#DC2626] flex items-center justify-center">
              <AlertOctagon className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
          <span className={`text-xs font-bold ${isOutOfStock ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
            {isOutOfStock ? 'Product Out of Stock' : '✓ Product Found'}
          </span>
        </div>

        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            isOutOfStock
              ? 'bg-rose-100 text-[#DC2626]'
              : isLowStock
              ? 'bg-amber-100 text-[#F59E0B]'
              : 'bg-emerald-100 text-[#16A34A]'
          }`}
        >
          {isOutOfStock ? '0 Available' : `${effectiveStock} in Shelf Stock`}
        </span>
      </div>

      {/* Main Product Info Grid */}
      <div className="flex gap-4">
        {/* Product Thumbnail */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#DDD7CA] bg-[#FFFCF5] shrink-0">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=200'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Column */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#687085] block truncate">
            {product.brand} • {product.category}
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-[#172033] leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Variant Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFFCF5] border border-[#DDD7CA] rounded-lg text-xs font-bold text-[#172033]">
              {colorHex && (
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: colorHex }}
                />
              )}
              <span>{color}</span>
            </span>

            <span className="px-2 py-0.5 bg-[#172B82]/10 border border-[#172B82]/20 rounded-lg text-xs font-bold text-[#172B82]">
              Size {size}
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base sm:text-xl font-extrabold text-[#172033]">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {effectiveMrp > effectivePrice && (
              <span className="text-xs text-[#687085] line-through">
                ₹{effectiveMrp.toLocaleString('en-IN')}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SKU & Barcode Vector Preview */}
      <div className="p-3 bg-[#FFFCF5] rounded-2xl border border-[#DDD7CA] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div>
          <span className="text-[10px] text-[#687085] block font-medium">SKU</span>
          <span className="font-mono font-bold text-[#172033] text-xs">{sku}</span>
        </div>

        <div className="flex flex-col items-center">
          <ProductBarcode barcode={barcode} height={36} width={1.4} fontSize={11} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {onAddToBill && (
          <motion.button
            variants={buttonTapVariants}
            whileTap="tap"
            disabled={isOutOfStock}
            onClick={onAddToBill}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              isOutOfStock
                ? 'bg-[#DDD7CA] text-[#687085] cursor-not-allowed'
                : 'bg-[#172B82] hover:bg-[#243FBA] text-white shadow-md shadow-[#172B82]/20'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Current Bill'}</span>
          </motion.button>
        )}

        {onPrintLabel && (
          <motion.button
            variants={buttonTapVariants}
            whileTap="tap"
            onClick={onPrintLabel}
            type="button"
            className="wn-btn-secondary text-xs py-3 px-3.5 flex items-center gap-1.5"
            title="Print Barcode Tag"
          >
            <Printer className="w-4 h-4 text-[#172B82]" />
            <span className="hidden sm:inline">Print Tag</span>
          </motion.button>
        )}

        {onAdjustStock && (
          <motion.button
            variants={buttonTapVariants}
            whileTap="tap"
            onClick={onAdjustStock}
            type="button"
            className="wn-btn-secondary text-xs py-3 px-3.5 flex items-center gap-1.5"
            title="Adjust Stock"
          >
            <Layers className="w-4 h-4 text-[#172B82]" />
            <span className="hidden sm:inline">Stock</span>
          </motion.button>
        )}

        <Link
          to={`/vendor/products/${product.id}`}
          className="p-3 rounded-xl border border-[#DDD7CA] text-[#687085] hover:text-[#172B82] hover:bg-[#F5F0E6] transition-colors"
          title="Open Product Details"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};
