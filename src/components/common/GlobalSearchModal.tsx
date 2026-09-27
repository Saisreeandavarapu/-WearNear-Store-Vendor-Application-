import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, ShoppingBag, Users, FileText, ArrowRight, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { products, orders, customers, invoices } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const trimmed = query.trim().toLowerCase();

  const filteredProducts = trimmed
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.sku.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const filteredOrders = trimmed
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(trimmed) ||
          o.customer.name.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const filteredCustomers = trimmed
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.phone.includes(trimmed) ||
          c.locality.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const filteredInvoices = trimmed
    ? invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(trimmed) ||
          inv.orderNumber.toLowerCase().includes(trimmed) ||
          inv.customerName.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const hasResults =
    filteredProducts.length > 0 ||
    filteredOrders.length > 0 ||
    filteredCustomers.length > 0 ||
    filteredInvoices.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#172033]/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#DDD7CA] overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[#DDD7CA] bg-[#FFFCF5]">
              <Search className="w-5 h-5 text-[#172B82] mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search products, orders, customers, invoices..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#172033] placeholder:text-[#687085] focus:outline-none"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-[#687085] hover:text-[#172033]"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-[11px] text-[#687085] bg-[#DDD7CA]/40 px-2 py-0.5 rounded border border-[#DDD7CA]">
                  ESC
                </span>
              )}
            </div>

            {/* Results container */}
            <div className="max-h-[60vh] overflow-y-auto p-3">
              {!trimmed && (
                <div className="p-4 text-center text-xs text-[#687085]">
                  Type to search instantly across WearNear Store catalog, live orders, customers, and GST billing.
                </div>
              )}

              {trimmed && !hasResults && (
                <div className="p-6 text-center text-sm text-[#687085]">
                  No matching items found for <span className="font-semibold text-[#172033]">"{query}"</span>
                </div>
              )}

              {/* Products */}
              {filteredProducts.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-bold text-[#687085] uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#172B82]" />
                    Products
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect(`/vendor/products/${p.id}`)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F0E6] cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-9 h-9 rounded object-cover border border-[#DDD7CA]"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#172033] truncate group-hover:text-[#172B82]">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[#687085] truncate">
                              SKU: {p.sku} • ₹{p.sellingPrice} • Stock: {p.stock}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#687085] group-hover:text-[#172B82] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders */}
              {filteredOrders.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-bold text-[#687085] uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#172B82]" />
                    Orders
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredOrders.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => handleSelect(`/vendor/orders/${o.id}`)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F0E6] cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-[#172033] group-hover:text-[#172B82]">
                            {o.orderNumber} — {o.customer.name}
                          </p>
                          <p className="text-[11px] text-[#687085]">
                            ₹{o.totalAmount} • {o.status.replace(/_/g, ' ')} • {o.createdAt}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#687085] group-hover:text-[#172B82] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {filteredCustomers.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-bold text-[#687085] uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#172B82]" />
                    Customers
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelect('/vendor/customers')}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F0E6] cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-[#172033] group-hover:text-[#172B82]">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-[#687085]">
                            {c.phone} • {c.locality} • {c.ordersCount} Orders
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#687085] group-hover:text-[#172B82] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {filteredInvoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-[#687085] uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#172B82]" />
                    Invoices
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => handleSelect(`/vendor/billing/${inv.id}`)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F0E6] cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-[#172033] group-hover:text-[#172B82]">
                            {inv.invoiceNumber} (Order {inv.orderNumber})
                          </p>
                          <p className="text-[11px] text-[#687085]">
                            ₹{inv.finalAmount} • {inv.customerName} • {inv.date}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#687085] group-hover:text-[#172B82] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
