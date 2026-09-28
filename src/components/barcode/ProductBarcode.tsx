import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { Copy, Check, Download, Printer } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ProductBarcodeProps {
  barcode: string;
  format?: 'EAN13' | 'CODE128' | 'UPC' | 'EAN8';
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  lineColor?: string;
  showActions?: boolean;
  className?: string;
}

export const ProductBarcode: React.FC<ProductBarcodeProps> = ({
  barcode,
  format = 'CODE128',
  width = 1.8,
  height = 54,
  displayValue = true,
  fontSize = 13,
  lineColor = '#172033',
  showActions = false,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    if (!svgRef.current || !barcode) return;
    try {
      setRenderError(false);

      // Determine best jsbarcode format
      let jsFormat: string = format;
      const clean = barcode.trim();

      if (clean.length === 13 && /^\d+$/.test(clean)) {
        jsFormat = 'EAN13';
      } else if (clean.length === 8 && /^\d+$/.test(clean)) {
        jsFormat = 'EAN8';
      } else if (clean.length === 12 && /^\d+$/.test(clean)) {
        jsFormat = 'UPC';
      } else {
        jsFormat = 'CODE128';
      }

      JsBarcode(svgRef.current, clean, {
        format: jsFormat,
        width,
        height,
        displayValue,
        font: 'Inter, monospace',
        fontSize,
        textMargin: 4,
        margin: 6,
        lineColor,
        background: 'transparent'
      });
    } catch {
      // Fallback to CODE128 if format mismatch occurs
      try {
        if (svgRef.current) {
          JsBarcode(svgRef.current, barcode.trim(), {
            format: 'CODE128',
            width,
            height,
            displayValue,
            font: 'Inter, monospace',
            fontSize,
            textMargin: 4,
            margin: 6,
            lineColor,
            background: 'transparent'
          });
        }
      } catch {
        setRenderError(true);
      }
    }
  }, [barcode, format, width, height, displayValue, fontSize, lineColor]);

  const handleCopy = () => {
    navigator.clipboard.writeText(barcode);
    setCopied(true);
    success('Barcode Copied', `${barcode} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `barcode_${barcode}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
    success('Barcode Downloaded', `SVG file saved for ${barcode}.`);
  };

  if (renderError) {
    return (
      <div className={`p-2 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-700 ${className}`}>
        <p className="font-mono font-bold">{barcode}</p>
        <p className="text-[10px] text-rose-500 mt-0.5">Render error: non-standard format</p>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg ref={svgRef} className="max-w-full overflow-visible" />

      {showActions && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <button
            onClick={handleCopy}
            type="button"
            title="Copy barcode number"
            className="p-1 px-2 text-[10px] font-semibold text-[#687085] hover:text-[#172B82] bg-[#FFFCF5] hover:bg-[#F5F0E6] rounded-md border border-[#DDD7CA] flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            type="button"
            title="Download barcode SVG"
            className="p-1 px-2 text-[10px] font-semibold text-[#687085] hover:text-[#172B82] bg-[#FFFCF5] hover:bg-[#F5F0E6] rounded-md border border-[#DDD7CA] flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>SVG</span>
          </button>
        </div>
      )}
    </div>
  );
};
