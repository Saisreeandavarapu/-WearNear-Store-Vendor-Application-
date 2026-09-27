import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Eye,
  Search,
  Bike
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const OrderListPage: React.FC = () => {
  const { orders, acceptOrder } = useData();
  const { success } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { val: string; label: string }[] = [
    { val: 'ALL', label: 'All Orders' },
    { val: 'NEW', label: 'New' },
    { val: 'ACCEPTED', label: 'Accepted' },
    { val: 'READY_FOR_PICKUP', label: 'Ready' },
    { val: 'COMPLETED', label: 'Completed' },
    { val: 'CANCELLED', label: 'Cancelled' }
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'ALL' || order.status === activeTab;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="Live Store Orders"
          subtitle="Process instant boutique orders, assign to store packing, and hand over to WearNear Captains."
          breadcrumbs={[{ label: 'Orders' }]}
          actions={
            <Link to="/vendor/orders/new" className="wn-btn-primary text-xs sm:text-sm">
              <ShoppingBag className="w-3.5 h-3.5" /> Incoming Orders
            </Link>
          }
        />

        {/* Tabs and Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#DDD7CA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#687085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order number or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wn-input pl-9 py-2 text-xs"
            />
          </div>

          {/* Status Tabs with Horizontal Scroll on Mobile */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs scrollbar-none">
            {tabs.map((t) => {
              const count =
                t.val === 'ALL'
                  ? orders.length
                  : orders.filter((o) => o.status === t.val).length;

              return (
                <button
                  key={t.val}
                  onClick={() => setActiveTab(t.val)}
                  className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors flex items-center gap-1.5 min-h-[36px] ${
                    activeTab === t.val
                      ? 'bg-[#172B82] text-white shadow-xs'
                      : 'bg-[#FFFCF5] text-[#687085] hover:text-[#172033] border border-[#DDD7CA]'
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === t.val
                        ? 'bg-white/20 text-white'
                        : 'bg-[#172B82]/10 text-[#172B82]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Content */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No Orders In This View"
            description="There are currently no orders matching your selected status filter."
            actionLabel="View All Orders"
            onAction={() => setActiveTab('ALL')}
          />
        ) : (
          <>
            {/* DESKTOP ORDERS TABLE */}
            <div className="hidden lg:block bg-white rounded-2xl border border-[#DDD7CA] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
                  <tr>
                    <th className="py-3 px-4">Order ID & Time</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items Ordered</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Delivery Partner</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD7CA]/60">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FFFCF5] transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          to={`/vendor/orders/${order.id}`}
                          className="font-bold text-[#172B82] hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                        <p className="text-[11px] text-[#687085]">{order.createdAt}</p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#172033]">{order.customer.name}</p>
                        <p className="text-[11px] text-[#687085]">{order.customer.phone}</p>
                      </td>

                      <td className="py-3 px-4 text-[#172033]">
                        <p className="font-semibold">{order.itemCount} Garment(s)</p>
                        <p className="text-[11px] text-[#687085] truncate max-w-xs">
                          {order.items.map((i) => `${i.productName} (${i.size})`).join(', ')}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-bold text-[#172033]">₹{order.totalAmount}</p>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {order.paymentMethod.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {order.captain ? (
                          <div className="flex items-center gap-1.5 text-xs text-[#172033]">
                            <Bike className="w-3.5 h-3.5 text-[#172B82]" />
                            <span className="font-semibold">{order.captain.name}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#687085]">Awaiting Assignment</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={order.status} size="sm" />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'NEW' && (
                            <button
                              onClick={() => {
                                acceptOrder(order.id);
                                success('Order Accepted', `Order ${order.orderNumber} confirmed.`);
                              }}
                              className="wn-btn-primary text-[11px] py-1 px-2.5"
                            >
                              Accept
                            </button>
                          )}
                          <Link
                            to={`/vendor/orders/${order.id}`}
                            className="wn-btn-secondary text-[11px] py-1 px-2.5 inline-flex"
                          >
                            <Eye className="w-3 h-3 text-[#172B82]" /> Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE COMPACT ORDER CARDS */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:hidden space-y-2.5"
            >
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={staggerItem}
                  whileTap={{ scale: 0.99 }}
                  className="bg-white p-3.5 rounded-xl border border-[#DDD7CA] shadow-xs space-y-2 select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#172B82]">{order.orderNumber}</span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#172033]">{order.customer.name}</p>
                      <p className="text-[11px] text-[#687085]">
                        {order.itemCount} item(s) • {order.items[0]?.size}, {order.items[0]?.color}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#172033]">₹{order.totalAmount}</span>
                  </div>

                  <div className="pt-2 border-t border-[#DDD7CA]/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#687085]">{order.createdAt}</span>
                    <div className="flex items-center gap-1.5">
                      {order.status === 'NEW' && (
                        <button
                          onClick={() => {
                            acceptOrder(order.id);
                            success('Order Accepted', `${order.orderNumber} accepted.`);
                          }}
                          className="px-3 py-1.5 bg-[#16A34A] text-white font-bold rounded-lg text-xs"
                        >
                          Accept
                        </button>
                      )}
                      <Link
                        to={`/vendor/orders/${order.id}`}
                        className="px-3 py-1.5 bg-[#172B82] text-white font-semibold rounded-lg text-xs"
                      >
                        View Order
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </AnimatedPage>
  );
};
