import React from 'react';
import { ProductBarcode } from './ProductBarcode';

interface BarcodeLabelProps {
  storeName?: string;
  productName: string;
  brand?: string;
  sku: string;
  size: string;
  color: string;
  mrp: number;
  sellingPrice: number;
  barcode: string;
  compact?: boolean;
  className?: string;
}

export const BarcodeLabel: React.FC<BarcodeLabelProps> = ({
  storeName = 'Vogue Loom Studio',
  productName,
  brand,
  sku,
  size,
  color,
  mrp,
  sellingPrice,
  barcode,
  compact = false,
  className = ''
}) => {
  return (
    <div
      className={`bg-white border-2 border-dashed border-[#DDD7CA] rounded-2xl p-3.5 flex flex-col justify-between text-left select-none shadow-xs print:border-solid print:border-black print:shadow-none print:m-1 ${
        compact ? 'w-56 h-72' : 'w-64 h-80'
      } ${className}`}
      style={{ pageBreakInside: 'avoid' }}
    >
      {/* Header with WearNear Logo & Store Name */}
      <div className="border-b border-[#DDD7CA] pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-xs tracking-tight text-[#172B82] uppercase">
            WearNear
          </span>
          <span className="text-[9px] font-bold px-1 py-0.2 bg-[#172B82]/10 text-[#172B82] rounded">
            RETAIL
          </span>
        </div>
        <span className="text-[9px] font-medium text-[#687085] truncate max-w-[100px]">
          {storeName}
        </span>
      </div>

      {/* Product Details */}
      <div className="space-y-1 py-1">
        {brand && (
          <p className="text-[9px] font-bold text-[#687085] uppercase tracking-wider truncate">
            {brand}
          </p>
        )}
        <h4 className="text-xs font-bold text-[#172033] line-clamp-2 leading-tight">
          {productName}
        </h4>

        {/* Size / Color / SKU Grid */}
        <div className="pt-1.5 grid grid-cols-2 gap-1 text-[11px] font-semibold text-[#172033]">
          <div className="bg-[#FFFCF5] p-1 rounded border border-[#DDD7CA]">
            <span className="text-[9px] text-[#687085] block leading-none">SIZE</span>
            <span className="font-bold">{size}</span>
          </div>
          <div className="bg-[#FFFCF5] p-1 rounded border border-[#DDD7CA]">
            <span className="text-[9px] text-[#687085] block leading-none">COLOR</span>
            <span className="font-bold truncate block">{color}</span>
          </div>
        </div>

        <p className="text-[9px] text-[#687085] font-mono truncate pt-0.5">
          SKU: {sku}
        </p>
      </div>

      {/* Pricing Tag */}
      <div className="pt-1 border-t border-[#DDD7CA] flex items-baseline justify-between">
        <div>
          <span className="text-[9px] text-[#687085] block uppercase">MRP (Incl. Tax)</span>
          <span className="text-xs text-[#687085] line-through font-semibold">
            ₹{mrp.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-[#172B82] block uppercase font-bold">Special Price</span>
          <span className="text-base font-extrabold text-[#172033]">
            ₹{sellingPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Barcode Vector Graphic */}
      <div className="pt-1 border-t border-[#DDD7CA] flex flex-col items-center">
        <ProductBarcode
          barcode={barcode}
          width={compact ? 1.3 : 1.5}
          height={compact ? 36 : 42}
          fontSize={10}
          showActions={false}
        />
      </div>
    </div>
  );
};
