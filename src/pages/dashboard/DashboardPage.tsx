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
  Layers,
  Barcode,
  Printer,
  Sparkles,
  Zap,
  Tag,
  Camera,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { BottomSheet } from '../../components/common/BottomSheet';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { staggerContainer, staggerItem, buttonTapVariants } from '../../utils/animations';

export const DashboardPage: React.FC = () => {
  const { user, store } = useAuth();
  const { orders, inventory, products, invoices, walletBalance, updateStock } = useData();
  const navigate = useNavigate();

  const [salesTimeframe, setSalesTimeframe] = useState<'today' | 'week' | 'month'>('today');

  // Stats calculation
  const pendingOrders = orders.filter((o) => o.status === 'NEW' || o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const completedToday = orders.filter((o) => o.status === 'COMPLETED');
  const todaySalesTotal = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const unitsSold = orders.reduce((sum, o) => sum + o.itemCount, 0);
  const currentTotalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const inventoryValue = products.reduce((sum, p) => sum + p.stock * p.sellingPrice, 0);
  const barcodeSalesTotal = invoices.reduce((sum, inv) => sum + inv.finalAmount, 0);

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
        className="space-y-4 sm:space-y-6 pb-20 md:pb-8"
      >
        {/* Top Welcome & Store Status Header */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs"
        >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-bold text-[#172033]">
                Good Evening, {user?.name.split(' ')[0] || 'Store Owner'}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                Store Counter Active
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#687085] mt-0.5">
              {store.name} • {store.address.locality}, {store.address.city} • Barcode Retail Terminal Ready
            </p>
          </div>

          {/* Quick action buttons header */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
            {/* Prominent Desktop Scan & Bill Action */}
            <motion.div variants={buttonTapVariants} whileTap="tap">
              <Link
                to="/vendor/billing"
                className="wn-btn-primary text-xs sm:text-sm py-2 px-3.5 flex items-center gap-1.5 shadow-md shadow-[#172B82]/20"
              >
                <Barcode className="w-4 h-4" />
                <span>Scan & Bill (POS)</span>
              </Link>
            </motion.div>

            <Link
              to="/vendor/orders/new"
              className="wn-btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#172B82]" />
              <span>Incoming Orders</span>
              {pendingOrders.length > 0 && (
                <span className="bg-[#172B82] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {pendingOrders.length}
                </span>
              )}
            </Link>

            <Link
              to="/vendor/products/barcode-labels"
              className="wn-btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 hidden md:flex"
            >
              <Printer className="w-3.5 h-3.5 text-[#172B82]" />
              <span>Print Labels</span>
            </Link>
          </div>
        </motion.div>

        {/* MOBILE DASHBOARD PROMINENT SCAN & BILL BANNER */}
        <motion.div
          variants={staggerItem}
          className="lg:hidden p-4 rounded-3xl bg-gradient-to-r from-[#172B82] to-[#243FBA] text-white shadow-lg space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wide uppercase flex items-center gap-1.5">
              <Barcode className="w-4 h-4 text-emerald-300" />
              WearNear Retail POS
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              Instant Billing
            </span>
          </div>

          <p className="text-xs text-white/85 leading-snug">
            Fast camera barcode scanning with automatic inventory deduction and receipt generation.
          </p>

          <Link
            to="/vendor/billing"
            className="w-full py-2.5 bg-white text-[#172B82] rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md"
          >
            <Barcode className="w-4 h-4" />
            <span>Scan & Bill Customer Now</span>
          </Link>
        </motion.div>

        {/* INVENTORY INTELLIGENCE & SALES KPI CARDS */}
        <motion.div variants={staggerItem}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <StatCard
              label="Today's Sales"
              value={`₹${todaySalesTotal.toLocaleString('en-IN')}`}
              numericEnd={todaySalesTotal}
              prefix="₹"
              icon={TrendingUp}
              highlight={true}
              trend={{ value: '+24.5%', isPositive: true }}
              subValue="Retail + Online GMV"
              onClick={() => navigate('/vendor/reports')}
            />
            <StatCard
              label="Units Sold"
              value={unitsSold}
              numericEnd={unitsSold}
              icon={ShoppingBag}
              trend={{ value: '+14%', isPositive: true }}
              subValue="Across 4 orders & POS"
              onClick={() => navigate('/vendor/reports')}
            />
            <StatCard
              label="Current Stock"
              value={currentTotalStock}
              numericEnd={currentTotalStock}
              icon={Layers}
              subValue="Total shelf garments"
              onClick={() => navigate('/vendor/inventory')}
            />
            <StatCard
              label="Barcode POS Sales"
              value={`₹${barcodeSalesTotal.toLocaleString('en-IN')}`}
              numericEnd={barcodeSalesTotal}
              prefix="₹"
              icon={Barcode}
              trend={{ value: 'Live', isPositive: true }}
              subValue={`${invoices.length} retail invoices`}
              onClick={() => navigate('/vendor/billing')}
            />
          </div>
        </motion.div>

        {/* INVENTORY HEALTH & FINANCIAL METRICS */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            label="Low Stock Items"
            value={lowStockItems.length}
            numericEnd={lowStockItems.length}
            icon={AlertTriangle}
            subValue="Stock < 5 units"
            badge={lowStockItems.length > 0 ? 'Restock Soon' : undefined}
            onClick={() => navigate('/vendor/inventory')}
          />
          <StatCard
            label="Out of Stock"
            value={outOfStockItems.length}
            numericEnd={outOfStockItems.length}
            icon={AlertOctagon}
            subValue="Catalog auto-paused"
            onClick={() => navigate('/vendor/inventory')}
          />
          <StatCard
            label="Total Inventory Value"
            value={`₹${inventoryValue.toLocaleString('en-IN')}`}
            numericEnd={inventoryValue}
            prefix="₹"
            icon={Tag}
            subValue="Retail stock evaluation"
            onClick={() => navigate('/vendor/inventory')}
          />
          <StatCard
            label="Wallet Balance"
            value={`₹${walletBalance.available.toLocaleString('en-IN')}`}
            numericEnd={walletBalance.available}
            prefix="₹"
            icon={Wallet}
            subValue="Available to payout"
            onClick={() => navigate('/vendor/wallet')}
          />
        </motion.div>

        {/* SECTION 30: CATALOGUE APPROVAL SUMMARY (STORE OWNER / MANAGER) */}
        <motion.div variants={staggerItem} className="bg-gradient-to-r from-[#172B82] via-[#243FBA] to-[#3155D8] p-5 sm:p-6 rounded-3xl text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-white/20 text-white">
                  Store Approval Hub
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold mt-1 text-white">Catalogue Approval Overview</h2>
              <p className="text-xs text-blue-100">
                Review, approve, or request changes for products prepared by your Catalogue Executives.
              </p>
            </div>

            <Link
              to="/vendor/products/approvals"
              className="px-4 py-2 bg-white text-[#172B82] hover:bg-slate-100 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shrink-0 self-start sm:self-auto"
            >
              <Eye className="w-4 h-4 text-[#172B82]" />
              <span>Review Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] font-medium text-amber-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Pending Approval
              </span>
              <p className="text-2xl font-black mt-1">
                {products.filter((p) => p.lifecycleStatus === 'UNDER_REVIEW' || p.lifecycleStatus === 'SUBMITTED').length}
              </p>
              <p className="text-[10px] text-blue-200 mt-0.5">Awaiting decision</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] font-medium text-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approved Today
              </span>
              <p className="text-2xl font-black mt-1">
                {products.filter((p) => p.lifecycleStatus === 'APPROVED' || p.lifecycleStatus === 'LIVE').length}
              </p>
              <p className="text-[10px] text-blue-200 mt-0.5">Store approved</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] font-medium text-blue-200 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Changes Requested
              </span>
              <p className="text-2xl font-black mt-1">
                {products.filter((p) => p.lifecycleStatus === 'CHANGES_REQUESTED').length}
              </p>
              <p className="text-[10px] text-blue-200 mt-0.5">Returned to exec</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] font-medium text-rose-200 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Rejected
              </span>
              <p className="text-2xl font-black mt-1">
                {products.filter((p) => p.lifecycleStatus === 'REJECTED').length}
              </p>
              <p className="text-[10px] text-blue-200 mt-0.5">Not approved</p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] font-medium text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Live Today
              </span>
              <p className="text-2xl font-black mt-1">
                {products.filter((p) => p.lifecycleStatus === 'LIVE').length}
              </p>
              <p className="text-[10px] text-blue-200 mt-0.5">Visible to customers</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Action Ribbon with Barcode Shortcuts */}
        <motion.div variants={staggerItem} className="bg-white p-4 rounded-3xl border border-[#DDD7CA] shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-[#687085] uppercase tracking-wider mb-2.5">
            Quick Operational Shortcuts
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <Link
              to="/vendor/billing"
              className="flex items-center gap-2 p-3 rounded-2xl bg-[#172B82]/5 hover:bg-[#172B82]/10 border border-[#172B82]/20 text-xs font-bold text-[#172B82] transition-all"
            >
              <Barcode className="w-4 h-4 shrink-0" />
              <span className="truncate">Scan & Bill (POS)</span>
            </Link>
            <Link
              to="/vendor/barcode-scanner"
              className="flex items-center gap-2 p-3 rounded-2xl bg-[#FFFCF5] hover:bg-[#F5F0E6] border border-[#DDD7CA] text-xs font-semibold text-[#172033] transition-all"
            >
              <Camera className="w-4 h-4 text-[#172B82] shrink-0" />
              <span className="truncate">Scan Barcode</span>
            </Link>
            <Link
              to="/vendor/products/barcode-labels"
              className="flex items-center gap-2 p-3 rounded-2xl bg-[#FFFCF5] hover:bg-[#F5F0E6] border border-[#DDD7CA] text-xs font-semibold text-[#172033] transition-all"
            >
              <Printer className="w-4 h-4 text-[#172B82] shrink-0" />
              <span className="truncate">Print Labels</span>
            </Link>
            <Link
              to="/vendor/inventory/transactions"
              className="flex items-center gap-2 p-3 rounded-2xl bg-[#FFFCF5] hover:bg-[#F5F0E6] border border-[#DDD7CA] text-xs font-semibold text-[#172033] transition-all"
            >
              <FileText className="w-4 h-4 text-[#172B82] shrink-0" />
              <span className="truncate">Audit Ledger</span>
            </Link>
            <Link
              to="/vendor/products/add"
              className="col-span-2 sm:col-span-1 flex items-center gap-2 p-3 rounded-2xl bg-[#FFFCF5] hover:bg-[#F5F0E6] border border-[#DDD7CA] text-xs font-semibold text-[#172033] transition-all"
            >
              <Plus className="w-4 h-4 text-[#172B82] shrink-0" />
              <span className="truncate">Add Product</span>
            </Link>
          </div>
        </motion.div>

        {/* Main Grid: Responsive Sales Chart + Inventory Alerts */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Sales Chart (8 cols) */}
          <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#DDD7CA]">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                  Sales & Revenue Velocity
                </h3>
                <p className="text-[11px] sm:text-xs text-[#687085]">
                  Live counter sales + WearNear local delivery volume
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#FFFCF5] p-1 rounded-xl border border-[#DDD7CA] self-start sm:self-auto text-xs">
                {(['today', 'week', 'month'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSalesTimeframe(t)}
                    className={`px-3 py-1 rounded-lg capitalize font-semibold transition-colors ${
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

            {/* Responsive SVG Bar Chart */}
            <div className="h-44 sm:h-52 w-full flex items-end justify-between gap-2 pt-4 px-2">
              {weeklyData.map((d) => {
                const heightPercent = Math.round((d.sales / maxSale) * 100);
                const isSelected = d.label === 'Sun';

                return (
                  <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-[#687085] opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(d.sales / 1000).toFixed(0)}k
                    </span>

                    <div className="w-full max-w-[36px] bg-[#F5F0E6] rounded-xl overflow-hidden h-full flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`w-full rounded-xl transition-all ${
                          isSelected
                            ? 'bg-[#172B82] shadow-sm'
                            : 'bg-[#3155D8]/70 hover:bg-[#172B82]'
                        }`}
                      />
                    </div>

                    <span className={`text-[11px] font-bold ${isSelected ? 'text-[#172B82]' : 'text-[#687085]'}`}>
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#DDD7CA] flex items-center justify-between text-xs">
              <span className="text-[#687085]">Highest peak: Sunday (₹64,200)</span>
              <Link to="/vendor/reports" className="text-xs font-bold text-[#172B82] hover:underline flex items-center gap-1">
                <span>View Full Reports</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Urgent Inventory Alert Card (4 cols) */}
          <div className="lg:col-span-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#DDD7CA] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD7CA]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <h3 className="text-sm font-bold text-[#172033]">Stock Restock Alerts</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {lowStockItems.length + outOfStockItems.length} Urgent
                </span>
              </div>

              <div className="space-y-2.5 pt-3">
                {[...lowStockItems, ...outOfStockItems].slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-[#172033] truncate">{item.productName}</p>
                      <p className="text-[11px] text-[#687085]">
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
                      className="wn-btn-secondary text-[11px] py-1 px-2.5 shrink-0"
                    >
                      + Restock
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#DDD7CA]">
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

        {/* Recent Orders Section */}
        <motion.div variants={staggerItem} className="bg-white rounded-3xl border border-[#DDD7CA] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#DDD7CA] flex items-center justify-between bg-[#FFFCF5]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#172033]">Recent Orders & POS Sales</h3>
              <p className="text-[11px] sm:text-xs text-[#687085]">Instant local orders & counter sales</p>
            </div>
            <Link
              to="/vendor/orders"
              className="wn-btn-secondary text-xs py-1.5 px-3"
            >
              <span>View All ({orders.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#DDD7CA]/60">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="p-3.5 sm:p-4 hover:bg-[#FFFCF5] transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#172B82]">{order.orderNumber}</span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-[#687085] mt-0.5">
                    {order.customer.name} • {order.items[0]?.productName} ({order.itemCount} items)
                  </p>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <span className="font-bold text-sm text-[#172033]">₹{order.totalAmount}</span>
                    <span className="text-[10px] text-[#687085] block">{order.createdAt}</span>
                  </div>
                  <Link to={`/vendor/orders/${order.id}`} className="wn-btn-secondary text-xs py-1 px-2.5">
                    View
                  </Link>
                </div>
              </div>
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
