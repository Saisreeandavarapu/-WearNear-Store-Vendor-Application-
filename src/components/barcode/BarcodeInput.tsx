import React, { useState } from 'react';
import { Search, X, Barcode, ArrowRight } from 'lucide-react';
import { validateBarcodeFormat } from '../../utils/barcodeUtils';

interface BarcodeInputProps {
  onSearch: (barcode: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export const BarcodeInput: React.FC<BarcodeInputProps> = ({
  onSearch,
  placeholder = 'Enter or scan barcode (e.g. 8901234567028)...',
  autoFocus = false,
  className = ''
}) => {
  const [value, setValue] = useState('');
  const formatInfo = value.trim() ? validateBarcodeFormat(value.trim()) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Barcode className="w-4 h-4 text-[#687085] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="wn-input pl-10 pr-24 font-mono text-xs sm:text-sm tracking-wide"
        />

        {value && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {formatInfo && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  formatInfo.valid
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {formatInfo.format}
              </span>
            )}
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-[#687085] hover:text-[#172033] hover:bg-[#DDD7CA]/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!value.trim()}
        className="wn-btn-primary text-xs sm:text-sm px-4 py-2.5 flex items-center gap-1.5 shrink-0"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search Product</span>
      </button>
    </form>
  );
};
