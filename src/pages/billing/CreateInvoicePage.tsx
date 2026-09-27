import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plus, FileText, Sparkles, Printer } from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { buttonTapVariants, cardInteractiveVariants } from '../../utils/animations';

export const CreateInvoicePage: React.FC = () => {
  const { createInvoice, orders } = useData();
  const { success } = useToast();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('Ananya Sen');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 55901');
  const [customerAddress, setCustomerAddress] = useState('Hill Road, Bandra West, Mumbai 400050');
  const [garmentName, setGarmentName] = useState('Pure Mulberry Silk Festive Kurta');
  const [sku, setSku] = useState('VL-MSK-01-BLU-M');
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Navy Imperial');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(3299);
  const [discount, setDiscount] = useState(300);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = quantity * unitPrice;
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.05); // 5% apparel GST
  const finalAmount = taxable + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const inv = createInvoice(orders[0]?.id || 'ord_manual');
      success('Invoice Generated', `${inv.invoiceNumber} created successfully.`);
      navigate(`/vendor/billing/${inv.id}`);
    }, 350);
  };

  return (
    <AnimatedPage className="space-y-6 max-w-3xl mx-auto pb-24 md:pb-6">
      <PageHeader
        title="Generate Retail Invoice"
        subtitle="Create a compliant tax invoice for in-store checkout or direct WearNear order fulfillment."
        breadcrumbs={[
          { label: 'Finance', path: '/vendor/billing' },
          { label: 'Billing', path: '/vendor/billing' },
          { label: 'Create Invoice' }
        ]}
      />

      <motion.form
        variants={cardInteractiveVariants}
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-[#DDD7CA] p-5 sm:p-8 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between border-b border-[#DDD7CA] pb-3">
          <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#172B82]" />
            Customer & Tax Details
          </h3>
          <span className="text-[11px] text-[#687085]">GSTIN 27AAACV4912K1Z9</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="wn-label">Customer Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="wn-input"
            />
          </div>
          <div>
            <label className="wn-label">Phone Number</label>
            <input
              type="text"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="wn-input"
            />
          </div>
        </div>

        <div>
          <label className="wn-label">Billing Address</label>
          <input
            type="text"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="wn-input"
          />
        </div>

        <h3 className="text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-3 pt-2">
          Line Item Particulars
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="wn-label">Garment Description</label>
            <input
              type="text"
              value={garmentName}
              onChange={(e) => setGarmentName(e.target.value)}
              className="wn-input"
            />
          </div>
          <div>
            <label className="wn-label">SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="wn-input font-mono uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="wn-label">Size</label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="wn-input"
            />
          </div>
          <div>
            <label className="wn-label">Color</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="wn-input"
            />
          </div>
          <div>
            <label className="wn-label">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="wn-input"
            />
          </div>
          <div>
            <label className="wn-label">Unit Price (₹)</label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="wn-input"
            />
          </div>
        </div>

        {/* Calculation Box */}
        <div className="p-4 bg-[#FFFCF5] rounded-2xl border border-[#DDD7CA] space-y-2 text-xs">
          <div className="flex justify-between text-[#687085]">
            <span>Subtotal</span>
            <span className="font-semibold text-[#172033]">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-[#687085]">
            <span>Store Promo Discount</span>
            <span className="font-semibold text-emerald-600">-₹{discount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-[#687085]">
            <span>Apparel GST (5%)</span>
            <span className="font-semibold text-[#172033]">₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#DDD7CA] text-sm font-bold text-[#172033]">
            <span>Final Billable Amount</span>
            <span className="text-[#172B82] text-base font-extrabold">₹{finalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Desktop Action Row */}
        <div className="hidden md:flex pt-4 border-t border-[#DDD7CA] justify-between items-center">
          <Link to="/vendor/billing" className="wn-btn-secondary text-xs">
            Cancel
          </Link>
          <motion.button
            variants={buttonTapVariants}
            whileTap="tap"
            disabled={isSubmitting}
            type="submit"
            className="wn-btn-primary text-xs sm:text-sm flex items-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Generate & Print Invoice</span>
          </motion.button>
        </div>
      </motion.form>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-[#DDD7CA] z-20 flex gap-2.5 shadow-lg">
        <Link
          to="/vendor/billing"
          className="flex-1 py-3 text-center text-xs font-bold text-[#687085] bg-[#F5F0E6] rounded-xl"
        >
          Cancel
        </Link>
        <motion.button
          variants={buttonTapVariants}
          whileTap="tap"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-2 py-3 bg-[#172B82] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#172B82]/20"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Printer className="w-4 h-4" />
          )}
          <span>Generate Invoice</span>
        </motion.button>
      </div>
    </AnimatedPage>
  );
};

