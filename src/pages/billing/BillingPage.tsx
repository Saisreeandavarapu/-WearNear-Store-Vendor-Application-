import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Eye, Download, Printer, CheckCircle2, Receipt, AlertCircle } from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useData } from '../../context/DataContext';
import { staggerContainer, staggerItem, cardInteractiveVariants, buttonTapVariants } from '../../utils/animations';

export const BillingPage: React.FC = () => {
  const { invoices } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.finalAmount, 0);
  const paidCount = invoices.filter((i) => i.paymentStatus === 'PAID').length;
  const pendingCount = invoices.filter((i) => i.paymentStatus === 'PENDING').length;

  const filteredInvoices = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatedPage className="space-y-6">
      <PageHeader
        title="Store Billing & GST Invoices"
        subtitle="Generate compliant retail invoices with automatic HSN and 5%/12% GST calculation."
        breadcrumbs={[{ label: 'Finance' }, { label: 'Billing & Invoices' }]}
        actions={
          <motion.div variants={buttonTapVariants} whileTap="tap">
            <Link to="/vendor/billing/create" className="wn-btn-primary text-xs sm:text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> <span>Create Retail Invoice</span>
            </Link>
          </motion.div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <StatCard
          label="Today's Billing"
          value={totalBilled}
          isCurrency={true}
          icon={FileText}
          highlight={true}
          subValue={`${invoices.length} invoices generated`}
        />
        <StatCard
          label="Total Paid Invoices"
          value={paidCount}
          icon={CheckCircle2}
          subValue="Settled via UPI / Gateway"
        />
        <StatCard
          label="Total Invoices"
          value={invoices.length}
          icon={Receipt}
          subValue="Cumulative count"
        />
        <StatCard
          label="Pending Invoices"
          value={pendingCount}
          icon={AlertCircle}
          subValue="Awaiting counter clearance"
        />
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DDD7CA] shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#687085] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice #, order, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="wn-input pl-9 py-2 text-xs"
          />
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#DDD7CA] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Order #</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Tax (GST)</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD7CA]/60">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#FFFCF5] transition-colors">
                <td className="py-3 px-4 font-bold text-[#172B82]">
                  <Link to={`/vendor/billing/${inv.id}`} className="hover:underline">
                    {inv.invoiceNumber}
                  </Link>
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-[#172033]">
                  {inv.orderNumber}
                </td>
                <td className="py-3 px-4 text-[#687085]">{inv.date}</td>
                <td className="py-3 px-4 font-semibold text-[#172033]">{inv.customerName}</td>
                <td className="py-3 px-4 text-[#687085]">₹{inv.taxAmount}</td>
                <td className="py-3 px-4 font-bold text-[#172033]">₹{inv.finalAmount}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={inv.paymentStatus} size="sm" />
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    to={`/vendor/billing/${inv.id}`}
                    className="wn-btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3 text-[#172B82]" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE INVOICE CARDS */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="md:hidden space-y-3"
      >
        {filteredInvoices.map((inv) => (
          <motion.div
            key={inv.id}
            variants={cardInteractiveVariants}
            whileTap="tap"
            className="bg-white p-4 rounded-2xl border border-[#DDD7CA] shadow-2xs space-y-2.5 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#172B82]">{inv.invoiceNumber}</span>
              <StatusBadge status={inv.paymentStatus} size="sm" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <p className="font-bold text-[#172033]">{inv.customerName}</p>
                <p className="text-[11px] text-[#687085]">Order {inv.orderNumber} • {inv.date}</p>
              </div>
              <span className="text-sm font-extrabold text-[#172033]">₹{inv.finalAmount}</span>
            </div>

            <div className="pt-2.5 border-t border-[#DDD7CA]/70 flex items-center justify-between">
              <span className="text-[11px] text-[#687085]">Tax included: ₹{inv.taxAmount}</span>
              <Link
                to={`/vendor/billing/${inv.id}`}
                className="wn-btn-secondary text-xs py-1.5 px-3.5 font-bold flex items-center gap-1"
              >
                <Eye className="w-3 h-3 text-[#172B82]" /> View Details
              </Link>
            </div>
          </motion.div>
        ))}

        {filteredInvoices.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#DDD7CA]">
            <Receipt className="w-8 h-8 text-[#687085] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-[#172033]">No invoices found</p>
            <p className="text-[11px] text-[#687085] mt-0.5">Try searching with a different invoice or order number.</p>
          </div>
        )}
      </motion.div>
    </AnimatedPage>
  );
};

