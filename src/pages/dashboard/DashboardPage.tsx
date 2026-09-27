import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  AlertOctagon,
  Wallet,
  Landmark,
  Plus,
  RefreshCw,
  FileText,
  ArrowRight,
  ChevronRight,
  Eye,
  Store,
  Layers
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { BottomSheet } from '../../components/common/BottomSheet';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const DashboardPage: React.FC = () => {
  const { user, store } = useAuth();
  const { orders, inventory, walletBalance, updateStock } = useData();
  const navigate = useNavigate();

  const [salesTimeframe, setSalesTimeframe] = useState<'today' | 'week' | 'month'>('today');

  // Stats calculation
  const pendingOrders = orders.filter((o) => o.status === 'NEW' || o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const completedToday = orders.filter((o) => o.status === 'COMPLETED');
  const todaySalesTotal = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockItems = inventory.filter((i) => i.status === 'LOW_STOCK');
  const outOfStockItems = inventory.filter((i) => i.status === 'OUT_OF_STOCK');

  // Interactive quick stock modal
  const [selectedStockItem, setSelectedStockItem] = useState<(typeof inventory)[0] | null>(null);
  const [stockInput, setStockInput] = useState<number>(10);

  const handleQuickStockSave = () => {
    if (!selectedStockItem) return;
    updateStock(selectedStockItem.productId, Number(stockInput), 'Dashboard Quick Restock');
    setSelectedStockItem(null);
  };

  // Mock Sales chart data points for the responsive SVG chart
  const weeklyData = [
    { label: 'Mon', sales: 18200, orders: 8 },
    { label: 'Tue', sales: 24500, orders: 11 },
    { label: 'Wed', sales: 19800, orders: 9 },
    { label: 'Thu', sales: 31200, orders: 14 },
    { label: 'Fri', sales: 42800, orders: 19 },
    { label: 'Sat', sales: 58900, orders: 26 },
    { label: 'Sun', sales: 64200, orders: 29 }
  ];

  const maxSale = Math.max(...weeklyData.map((d) => d.sales));

  return (
    <AnimatedPage>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4 sm:space-y-6"
      >
        {/* Top Welcome & Store Status Header */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-bold text-[#172033]">
                Good Morning, {user?.name.split(' ')[0] || 'Store Owner'}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                Store Active
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#687085] mt-0.5">
              {store.name} • {store.address.locality}, {store.address.city} • Instant Delivery Active
            </p>
          </div>

          {/* Quick action buttons header */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
            <Link
              to="/vendor/orders/new"
              className="wn-btn-primary text-xs py-2 px-3 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Incoming Orders</span>
              {pendingOrders.length > 0 && (
                <span className="bg-white text-[#172B82] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {pendingOrders.length}
                </span>
              )}
            </Link>

            <Link
              to="/vendor/products/add"
              className="wn-btn-secondary text-xs py-2 px-3"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
          </div>
        </motion.div>

        {/* Row 1: Primary Order & Sales Statistics (Mobile: 2x2 compact grid) */}
        <motion.div variants={staggerItem}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <StatCard
              label="Today's Orders"
              value={orders.length}
              numericEnd={orders.length}
              icon={ShoppingBag}
              trend={{ value: '+18%', isPositive: true }}
              subValue="4 In Transit"
              onClick={() => navigate('/vendor/orders')}
            />
            <StatCard
              label="Pending Orders"
              value={pendingOrders.length}
              numericEnd={pendingOrders.length}
              icon={Clock}
              badge={pendingOrders.length > 0 ? 'Action' : undefined}
              subValue="Avg prep: 8m"
              onClick={() => navigate('/vendor/orders')}
            />
            <StatCard
              label="Completed Today"
              value={completedToday.length}
              numericEnd={completedToday.length}
              icon={CheckCircle2}
              trend={{ value: '100%', isPositive: true, label: 'on-time' }}
              onClick={() => navigate('/vendor/orders')}
            />
            <StatCard
              label="Today's Sales"
              value={`₹${todaySalesTotal.toLocaleString('en-IN')}`}
              numericEnd={todaySalesTotal}
              prefix="₹"
              icon={TrendingUp}
              highlight={true}
              trend={{ value: '+24.5%', isPositive: true }}
              subValue="Ready for settlement"
              onClick={() => navigate('/vendor/reports')}
            />
          </div>
        </motion.div>

        {/* Row 2: Secondary Inventory & Financial Stats (Mobile: 2x2 compact grid) */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            label="Low Stock Items"
            value={lowStockItems.length}
            numericEnd={lowStockItems.length}
            icon={AlertTriangle}
            subValue="Stock < 5 units"
            badge={lowStockItems.length > 0 ? 'Restock' : undefined}
            onClick={() => navigate('/vendor/inventory')}
          />
          <StatCard
            label="Out of Stock"
            value={outOfStockItems.length}
            numericEnd={outOfStockItems.length}
            icon={AlertOctagon}
            subValue="Auto-hidden"
            onClick={() => navigate('/vendor/inventory')}
          />
          <StatCard
            label="Wallet Balance"
            value={`₹${walletBalance.available.toLocaleString('en-IN')}`}
            numericEnd={walletBalance.available}
            prefix="₹"
            icon={Wallet}
            subValue="Ready to withdraw"
            onClick={() => navigate('/vendor/wallet')}
          />
          <StatCard
            label="Pending Settlement"
            value={`₹${walletBalance.pending.toLocaleString('en-IN')}`}
            numericEnd={walletBalance.pending}
            prefix="₹"
            icon={Landmark}
            subValue="Sun Payout"
            onClick={() => navigate('/vendor/settlements')}
          />
        </motion.div>

        {/* Quick Action Ribbon */}
        <motion.div variants={staggerItem} className="bg-white p-3 sm:p-4 rounded-xl border border-[#DDD7CA] shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-[#687085] uppercase tracking-wider mb-2">
            Quick Operational Shortcuts
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <Link
              to="/vendor/products/add"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FFFCF5] hover:bg-[#F5F0E6] active:scale-[0.98] border border-[#DDD7CA] text-xs font-semibold text-[#172033] transition-all"
            >
              <Plus className="w-4 h-4 text-[#172B82] shrink-0" />
              <span className="truncate">Add Product</span>
            </Link>
            <Link
              to="/vendor/inventory"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FFFCF5] hover:bg-[#F5F0E6] active:scale-[0.98] border border-[#DDD7CA] text-xs font-semibold text-[#172033] transition-all"
            >
              <RefreshCw className="w-4 h-4 text-[#172B82] shrink-0" />
              <span className="truncate">Update Stock</span>
            </Link>
            <Link
              to="/vendor/orders"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FFFCF5] hover:bg-[#F5F0E6] active:scale-[0.98] border border-[#DDD7CA] text-xs font-semibold text-[#172033] transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-[#172B82] shrink-0" />
              <span className="truncate">View Orders</span>
            </Link>
            <Link
              to="/vendor/billing/create"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FFFCF5] hover:bg-[#F5F0E6] active:scale-[0.98] border border-[#DDD7CA] text-xs font-semibold text-[#172033] transition-all"
            >
              <FileText className="w-4 h-4 text-[#172B82] shrink-0" />
              <span className="truncate">Generate Bill</span>
            </Link>
            <Link
              to="/vendor/settlements"
              className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2.5 rounded-lg bg-[#FFFCF5] hover:bg-[#F5F0E6] active:scale-[0.98] border border-[#DDD7CA] text-xs font-semibold text-[#172033] transition-all"
            >
              <Landmark className="w-4 h-4 text-[#172B82] shrink-0" />
              <span className="truncate">Settlements</span>
            </Link>
          </div>
        </motion.div>

        {/* Main Grid: Responsive Sales Chart + Inventory Alerts */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Sales Chart (8 cols) */}
          <div className="lg:col-span-8 bg-white p-3.5 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4 pb-2.5 border-b border-[#DDD7CA]">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                  Sales & Revenue Analytics
                </h3>
                <p className="text-[11px] sm:text-xs text-[#687085]">
                  Weekly store gross volume: ₹2,60,600 across 115 orders
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#FFFCF5] p-1 rounded-lg border border-[#DDD7CA] self-start sm:self-auto text-xs">
                {(['today', 'week', 'month'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSalesTimeframe(t)}
                    className={`px-2.5 py-1 rounded capitalize font-semibold transition-colors ${
                      salesTimeframe === t
                        ? 'bg-[#172B82] text-white shadow-xs'
                        : 'text-[#687085] hover:text-[#172033]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Bar Chart with Responsive Aspect */}
            <div className="w-full pt-3 pb-1">
              <div className="h-40 sm:h-52 flex items-end gap-1.5 sm:gap-4 justify-between px-1 sm:px-4">
                {weeklyData.map((d, i) => {
                  const heightPercent = Math.round((d.sales / maxSale) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 group h-full justify-end">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] sm:text-xs font-bold text-[#172033] bg-[#F5F0E6] px-1.5 py-0.5 rounded border border-[#DDD7CA] pointer-events-none mb-0.5 text-center whitespace-nowrap">
                        ₹{(d.sales / 1000).toFixed(1)}k
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-[#172B82]/10 rounded-t-lg relative overflow-hidden flex flex-col justify-end" style={{ height: `${heightPercent}%` }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="w-full bg-gradient-to-t from-[#172B82] to-[#3155D8] rounded-t-lg group-hover:from-[#243FBA] group-hover:to-[#3155D8] transition-all"
                        />
                      </div>

                      {/* Day label */}
                      <span className="text-[10px] sm:text-xs font-semibold text-[#687085] group-hover:text-[#172B82]">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#DDD7CA] flex items-center justify-between text-[11px] sm:text-xs text-[#687085]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#172B82]" />
                Gross Sales Volume
              </span>
              <Link
                to="/vendor/reports"
                className="font-semibold text-[#172B82] hover:underline flex items-center gap-1"
              >
                Detailed Breakdown <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Inventory Critical Alerts (4 cols) */}
          <div className="lg:col-span-4 bg-white p-3.5 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#DDD7CA]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <h3 className="text-sm font-bold text-[#172033]">Inventory Alerts</h3>
                </div>
                <span className="text-[11px] font-bold text-[#DC2626] bg-[#DC2626]/10 px-2 py-0.5 rounded-full">
                  {lowStockItems.length + outOfStockItems.length} Urgent
                </span>
              </div>

              <div className="space-y-2 mt-3">
                {[...outOfStockItems, ...lowStockItems].slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:border-[#172B82]/30 transition-all flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#172033] truncate">
                        {item.productName}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-[#687085]">
                        SKU: {item.sku} • Stock:{' '}
                        <strong className={item.availableStock === 0 ? 'text-[#DC2626]' : 'text-[#F59E0B]'}>
                          {item.availableStock}
                        </strong>
                      </p>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedStockItem(item);
                        setStockInput(item.availableStock + 10);
                      }}
                      className="wn-btn-secondary text-[11px] py-1 px-2.5 shrink-0 min-h-[36px]"
                    >
                      + Restock
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#DDD7CA]">
              <Link
                to="/vendor/inventory"
                className="text-xs font-semibold text-[#172B82] hover:underline flex items-center justify-between"
              >
                <span>Manage All Inventory Items</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders Section (Responsive Table on Desktop, Cards on Mobile) */}
        <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[#DDD7CA] shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-5 border-b border-[#DDD7CA] flex items-center justify-between bg-[#FFFCF5]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#172033]">Recent Orders</h3>
              <p className="text-[11px] sm:text-xs text-[#687085]">Instant orders within Bandra & Khar radius</p>
            </div>
            <Link
              to="/vendor/orders"
              className="wn-btn-secondary text-xs py-1.5 px-3 min-h-[36px]"
            >
              <span>View All ({orders.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer & Distance</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD7CA]/60">
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FFFCF5] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#172B82]">
                      <Link to={`/vendor/orders/${order.id}`} className="hover:underline">
                        {order.orderNumber}
                      </Link>
                      <p className="text-[10px] text-[#687085] font-normal">{order.createdAt}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#172033]">{order.customer.name}</p>
                      <p className="text-[11px] text-[#687085]">{order.customer.distanceKm} km away</p>
                    </td>
                    <td className="py-3 px-4 text-[#172033]">
                      {order.itemCount} items
                      <p className="text-[11px] text-[#687085] truncate max-w-[180px]">
                        {order.items[0]?.productName}
                      </p>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#172033]">
                      ₹{order.totalAmount}
                      <p className="text-[10px] text-emerald-600 font-semibold">{order.paymentMethod.replace(/_/g, ' ')}</p>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/vendor/orders/${order.id}`}
                        className="wn-btn-secondary text-[11px] py-1 px-2.5 inline-flex"
                      >
                        <Eye className="w-3 h-3" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE COMPACT CARDS */}
          <div className="md:hidden divide-y divide-[#DDD7CA]/60">
            {orders.slice(0, 4).map((order) => (
              <motion.div
                key={order.id}
                whileTap={{ scale: 0.99 }}
                className="p-3.5 space-y-2 hover:bg-[#FFFCF5] active:bg-[#FFFCF5] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#172B82]">{order.orderNumber}</span>
                  <StatusBadge status={order.status} size="sm" />
                </div>
                <div className="flex items-center justify-between text-xs text-[#172033]">
                  <span className="font-semibold">{order.customer.name} ({order.customer.distanceKm} km)</span>
                  <span className="font-bold">₹{order.totalAmount}</span>
                </div>
                <p className="text-[11px] text-[#687085] truncate">
                  {order.itemCount} item(s): {order.items[0]?.productName}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-[#687085]">{order.createdAt}</span>
                  <Link
                    to={`/vendor/orders/${order.id}`}
                    className="wn-btn-secondary text-xs py-1.5 px-3 min-h-[36px]"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Restock BottomSheet for mobile & modal for desktop */}
      <BottomSheet
        isOpen={!!selectedStockItem}
        onClose={() => setSelectedStockItem(null)}
        title="Quick Restock Product"
        subtitle={selectedStockItem?.productName}
      >
        {selectedStockItem && (
          <div className="space-y-4">
            <div>
              <label className="wn-label">Available Physical Stock</label>
              <input
                type="number"
                min={0}
                value={stockInput}
                onChange={(e) => setStockInput(Number(e.target.value))}
                className="wn-input text-lg font-bold"
              />
              <p className="text-[11px] text-[#687085] mt-1">
                Previous inventory: {selectedStockItem.availableStock} units.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedStockItem(null)}
                className="wn-btn-secondary text-xs flex-1 sm:flex-initial"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickStockSave}
                className="wn-btn-primary text-xs flex-1 sm:flex-initial"
              >
                Save Stock
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </AnimatedPage>
  );
};
