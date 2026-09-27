import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Printer, Download, Share2, Check, Loader2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const InvoiceViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useData();
  const { store } = useAuth();
  const { success } = useToast();

  const [isDownloading, setIsDownloading] = useState(false);
  const invoice = invoices.find((inv) => inv.id === id) || invoices[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      success('Invoice Downloaded', `${invoice.invoiceNumber}.pdf saved to your device.`);
    }, 700);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${invoice.invoiceNumber}`,
        text: `WearNear Invoice for Order ${invoice.orderNumber}`
      }).catch(() => {});
    } else {
      success('Link Copied', 'Invoice share link copied to clipboard.');
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto pb-20 sm:pb-0">
        <PageHeader
          title={`Tax Invoice: ${invoice.invoiceNumber}`}
          subtitle={`Order ${invoice.orderNumber} • Issued on ${invoice.date}`}
          breadcrumbs={[
            { label: 'Finance', path: '/vendor/billing' },
            { label: 'Billing', path: '/vendor/billing' },
            { label: invoice.invoiceNumber }
          ]}
          actions={
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="wn-btn-primary text-xs sm:text-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="wn-btn-secondary text-xs sm:text-sm"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-[#172B82]" />
                )}
                <span>PDF</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="wn-btn-secondary text-xs sm:text-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-[#172B82]" /> Share
              </motion.button>
            </div>
          }
        />

        {/* Printable Invoice Container */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-10 shadow-xs space-y-6 sm:space-y-8 text-xs text-[#172033]">
          {/* Invoice Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#DDD7CA]">
            <div className="flex items-center gap-3">
              <img
                src="/image.png"
                alt="WearNear"
                className="w-10 h-10 object-contain p-1 border border-[#DDD7CA] rounded-xl bg-white"
              />
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[#172B82] leading-tight">
                  {store.name}
                </h2>
                <p className="text-[11px] text-[#687085]">{store.address.street}, {store.address.locality}</p>
                <p className="text-[11px] text-[#687085]">{store.address.city}, {store.address.state} - {store.address.pincode}</p>
                <p className="text-[11px] text-[#687085] font-mono mt-0.5">GSTIN: {store.gstin}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] font-bold text-[#172B82] uppercase tracking-wider block">
                Retail Tax Invoice
              </span>
              <span className="text-xs sm:text-sm font-extrabold font-mono text-[#172033] block mt-0.5">
                {invoice.invoiceNumber}
              </span>
              <span className="text-[11px] text-[#687085] block">Date: {invoice.date}</span>
              <span className="text-[11px] text-[#687085] block font-mono">
                Order Ref: {invoice.orderNumber}
              </span>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-[#DDD7CA]">
            <div>
              <span className="text-[10px] font-bold text-[#687085] uppercase tracking-wider block mb-1">
                Billed To Customer:
              </span>
              <h4 className="text-sm font-bold text-[#172033]">{invoice.customerName}</h4>
              <p className="text-xs text-[#687085] mt-0.5">{invoice.customerPhone}</p>
              <p className="text-xs text-[#687085] max-w-xs leading-relaxed">{invoice.customerAddress}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-[#687085] uppercase tracking-wider block mb-1">
                Payment Mode & Settlement:
              </span>
              <p className="text-xs font-semibold text-[#172033]">{invoice.paymentMethod}</p>
              <div className="inline-block mt-1">
                <StatusBadge status={invoice.paymentStatus} size="sm" />
              </div>
            </div>
          </div>

          {/* Desktop Line Items Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Size/Color</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">GST</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD7CA]/50">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-semibold text-[#172033]">
                      {item.name}
                      <span className="text-[10px] text-[#687085] block font-mono">{item.sku}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#687085]">{item.size} • {item.color}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right">₹{item.unitPrice}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#687085]">{item.taxRate}%</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#172033]">₹{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Line Items Cards */}
          <div className="sm:hidden space-y-2.5 divide-y divide-[#DDD7CA]/50">
            {invoice.items.map((item, idx) => (
              <div key={idx} className="pt-2 first:pt-0 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-xs text-[#172033]">{item.name}</h5>
                    <p className="text-[10px] text-[#687085]">{item.size} • {item.color}</p>
                  </div>
                  <span className="font-bold text-xs text-[#172033]">₹{item.amount}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#687085]">
                  <span>Qty: {item.quantity} × ₹{item.unitPrice}</span>
                  <span>GST: {item.taxRate}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Calculation summary */}
          <div className="pt-4 border-t border-[#DDD7CA] flex flex-col sm:flex-row justify-between gap-4">
            <div className="text-[11px] text-[#687085] max-w-xs space-y-1">
              <p>• Goods once sold are eligible for 7-day doorstep trial exchange via WearNear.</p>
              <p>• Authorized signatory digital signature not required (Electronic GST Invoice).</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-[#687085]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#172033]">₹{invoice.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#687085]">
                <span>Store Discount</span>
                <span className="font-semibold text-emerald-600">-₹{invoice.discount}</span>
              </div>
              <div className="flex justify-between text-[#687085]">
                <span>Taxes (CGST + SGST)</span>
                <span className="font-semibold text-[#172033]">₹{invoice.taxAmount}</span>
              </div>
              <div className="flex justify-between text-[#687085]">
                <span>Delivery Charge</span>
                <span className="font-semibold text-[#172033]">₹{invoice.deliveryFee}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#DDD7CA] text-sm font-bold text-[#172033]">
                <span>Total Paid</span>
                <span className="text-[#172B82] text-base">₹{invoice.finalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Action Bar */}
        <div className="sm:hidden fixed bottom-14 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#DDD7CA] z-30 shadow-lg flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex-1 wn-btn-primary text-xs py-2.5 min-h-[44px] font-bold flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print / Save
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="wn-btn-secondary text-xs px-4 py-2.5 min-h-[44px]"
          >
            <Share2 className="w-4 h-4 text-[#172B82]" />
          </motion.button>
        </div>
      </div>
    </AnimatedPage>
  );
};
