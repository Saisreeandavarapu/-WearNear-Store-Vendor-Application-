import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const CustomersPage: React.FC = () => {
  const { customers } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.locality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Store Customers Directory"
          subtitle="Repeat shoppers in Bandra & nearby suburbs ordering directly from your boutique."
          breadcrumbs={[{ label: 'Store' }, { label: 'Customers' }]}
        />

        {/* Search Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#DDD7CA] shadow-xs flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#687085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer name, phone, or neighborhood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wn-input pl-9 py-2 text-xs"
            />
          </div>
          <span className="text-xs text-[#687085] font-semibold hidden sm:inline">
            {filtered.length} Registered Shoppers
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl border border-[#DDD7CA] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Neighborhood</th>
                <th className="py-3 px-4 text-center">Orders Placed</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD7CA]/60">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FFFCF5]">
                  <td className="py-3 px-4 font-bold text-[#172033]">{cust.name}</td>
                  <td className="py-3 px-4 text-[#687085]">
                    <span className="font-mono">{cust.phone}</span>
                    <span className="block text-[11px]">{cust.email}</span>
                  </td>
                  <td className="py-3 px-4 text-[#172033] font-medium">{cust.locality}</td>
                  <td className="py-3 px-4 text-center font-bold text-[#172B82]">
                    {cust.ordersCount}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#172033]">
                    ₹{cust.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-[#687085] text-[11px]">{cust.lastOrderDate}</td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={cust.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="md:hidden space-y-2.5"
        >
          {filtered.map((cust) => (
            <motion.div
              key={cust.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              className="bg-white p-3.5 rounded-xl border border-[#DDD7CA] shadow-xs space-y-2 select-none"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#172033]">{cust.name}</span>
                <StatusBadge status={cust.status} size="sm" />
              </div>

              <div className="flex items-center justify-between text-xs text-[#687085]">
                <span>{cust.locality}</span>
                <span className="font-mono text-[#172033]">{cust.phone}</span>
              </div>

              <div className="pt-2 border-t border-[#DDD7CA]/60 flex items-center justify-between text-[11px]">
                <span>{cust.ordersCount} Orders • Last {cust.lastOrderDate}</span>
                <span className="font-bold text-xs text-[#172B82]">
                  ₹{cust.totalSpent.toLocaleString('en-IN')}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  );
};
