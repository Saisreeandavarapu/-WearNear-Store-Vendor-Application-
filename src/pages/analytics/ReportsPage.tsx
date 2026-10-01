import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download,
  Calendar,
  Barcode,
  ShoppingBag,
  TrendingUp,
  Layers,
  RotateCcw,
  CheckCircle2,
  Tag,
  Landmark,
  Package,
  BarChart3,
  Filter
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, buttonTapVariants } from '../../utils/animations';

export const ReportsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, invoices, products, inventory, inventoryTransactions, settlements } = useData();
  const { success } = useToast();

  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | '7days' | '30days'>('7days');

  // Determine sub-tab from route
  const path = location.pathname;
  let activeTab: 'overview' | 'products' | 'inventory' | 'orders' | 'settlements' = 'overview';
  if (path.includes('/reports/products')) activeTab = 'products';
  else if (path.includes('/reports/inventory')) activeTab = 'inventory';
  else if (path.includes('/reports/orders')) activeTab = 'orders';
  else if (path.includes('/reports/settlements')) activeTab = 'settlements';

  // Real data calculations
  const totalSalesGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalUnitsSold = orders.reduce((sum, o) => sum + o.itemCount, 0);
  const barcodeSalesAmount = invoices.reduce((sum, inv) => sum + inv.finalAmount, 0);
  const averageBillValue = invoices.length > 0 ? Math.round(barcodeSalesAmount / invoices.length) : 2250;

  // Inventory movement count by type from real transactions
  const movementCounts = inventoryTransactions.reduce((acc, tx) => {
    acc[tx.type] = (acc[tx.type] || 0) + Math.abs(tx.quantityChange);
    return acc;
  }, {} as Record<string, number>);

  // Top selling products & variants from actual orders
  const productSalesMap = new Map<string, { name: string; sku: string; units: number; gmv: number }>();
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const existing = productSalesMap.get(item.productName) || {
        name: item.productName,
        sku: item.sku,
        units: 0,
        gmv: 0
      };
      existing.units += item.quantity;
      existing.gmv += item.total;
      productSalesMap.set(item.productName, existing);
    });
  });

  const topSellingList = Array.from(productSalesMap.values())
    .sort((a, b) => b.units - a.units);

  return (
    <AnimatedPage className="space-y-4 sm:space-y-6 pb-24 md:pb-8">
      <PageHeader
        title="Store Intelligence & Analytics Reports"
        subtitle="Analyze GMV trends, product sales performance, inventory movement logs, and settlement payout cycles."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Reports' }]}
        actions={
          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#DDD7CA] text-xs">
              {(['today', 'yesterday', '7days', '30days'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDateFilter(d)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors min-h-[34px] ${
                    dateFilter === d
                      ? 'bg-[#172B82] text-white shadow-xs'
                      : 'text-[#687085] hover:text-[#172033]'
                  }`}
                >
                  {d === 'today' ? 'Today' : d === 'yesterday' ? 'Yesterday' : d === '7days' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>

            <motion.button
              variants={buttonTapVariants}
              whileTap="tap"
              onClick={() => success('Report Exported', 'Full store analytics report exported as PDF.')}
              className="wn-btn-secondary text-xs sm:text-sm min-h-[36px] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#172B82]" />
              <span className="hidden sm:inline">Export PDF</span>
            </motion.button>
          </div>
        }
      />

      {/* Sub-nav Tabs */}
      <div className="bg-white rounded-2xl border border-[#DDD7CA] p-1.5 shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'overview', label: 'Sales Overview', path: '/vendor/reports', icon: BarChart3 },
            { id: 'products', label: 'Product Reports', path: '/vendor/reports/products', icon: Package },
            { id: 'inventory', label: 'Inventory Reports', path: '/vendor/reports/inventory', icon: Layers },
            { id: 'orders', label: 'Order Reports', path: '/vendor/reports/orders', icon: ShoppingBag },
            { id: 'settlements', label: 'Settlement Reports', path: '/vendor/reports/settlements', icon: Landmark }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#172B82] text-white shadow-sm'
                    : 'text-[#687085] hover:text-[#172033] hover:bg-[#F5F0E6]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* OVERVIEW / SALES TAB */}
      {(activeTab === 'overview' || activeTab === 'products') && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4"
          >
            <StatCard
              label="Total Store GMV"
              value={`₹${totalSalesGMV.toLocaleString('en-IN')}`}
              numericEnd={totalSalesGMV}
              prefix="₹"
              icon={TrendingUp}
              highlight={true}
              trend={{ value: '+18.4%', isPositive: true }}
              subValue="Retail POS + Local Delivery"
            />
            <StatCard
              label="Units Sold"
              value={totalUnitsSold}
              numericEnd={totalUnitsSold}
              suffix=" Garments"
              icon={ShoppingBag}
              trend={{ value: '+12.1%', isPositive: true }}
              subValue="Across active collections"
            />
            <StatCard
              label="Barcode POS Revenue"
              value={`₹${barcodeSalesAmount.toLocaleString('en-IN')}`}
              numericEnd={barcodeSalesAmount}
              prefix="₹"
              icon={Barcode}
              trend={{ value: `${invoices.length} Bills`, isPositive: true }}
              subValue={`Avg ticket: ₹${averageBillValue}`}
            />
            <StatCard
              label="Inventory Movements"
              value={inventoryTransactions.length}
              numericEnd={inventoryTransactions.length}
              suffix=" Operations"
              icon={Layers}
              subValue="Audited ledger transactions"
            />
          </motion.div>

          {/* Top Selling Products List */}
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDD7CA] pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#172033] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#172B82]" /> Top Selling Garments & Performance
                </h3>
                <p className="text-xs text-[#687085]">Highest velocity products by volume and retail revenue</p>
              </div>
            </div>

            <div className="space-y-3">
              {topSellingList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#172B82] text-white font-extrabold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-[#172033]">{item.name}</p>
                      <p className="text-[10px] text-[#687085] font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-sm text-[#172033] block">
                      ₹{item.gmv.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold block">
                      {item.units} Units Sold
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[#172033] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#172B82]" /> Inventory Health & Movement Audit
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#DDD7CA]">
                <p className="text-2xl font-extrabold text-emerald-700">{inventory.filter((i) => i.status === 'HEALTHY').length}</p>
                <p className="text-xs text-[#687085] font-semibold mt-1">Healthy Stock SKUs</p>
              </div>
              <div className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#DDD7CA]">
                <p className="text-2xl font-extrabold text-amber-700">{inventory.filter((i) => i.status === 'LOW_STOCK').length}</p>
                <p className="text-xs text-[#687085] font-semibold mt-1">Low Stock Threshold</p>
              </div>
              <div className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#DDD7CA]">
                <p className="text-2xl font-extrabold text-rose-700">{inventory.filter((i) => i.status === 'OUT_OF_STOCK').length}</p>
                <p className="text-xs text-[#687085] font-semibold mt-1">Out of Stock SKUs</p>
              </div>
            </div>

            <div className="overflow-x-auto pt-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E6] text-[#172033] font-bold border-y border-[#DDD7CA]">
                  <tr>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Available</th>
                    <th className="py-3 px-4">Reserved</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD7CA]/60 font-medium">
                  {inventory.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#FFFCF5]">
                      <td className="py-3 px-4 font-bold text-[#172033]">{inv.productName}</td>
                      <td className="py-3 px-4 font-mono text-[#687085]">{inv.sku}</td>
                      <td className="py-3 px-4 text-[#687085]">{inv.category}</td>
                      <td className="py-3 px-4 font-bold text-[#172B82]">{inv.availableStock}</td>
                      <td className="py-3 px-4 text-[#687085]">{inv.reservedStock}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          inv.status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[#172033] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#172B82]" /> Order Fulfilment & Sales Velocity
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E6] text-[#172033] font-bold border-y border-[#DDD7CA]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD7CA]/60 font-medium">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FFFCF5]">
                      <td className="py-3 px-4 font-mono font-bold text-[#172B82]">{ord.orderNumber}</td>
                      <td className="py-3 px-4 text-[#172033]">{ord.customer.name}</td>
                      <td className="py-3 px-4 text-[#687085]">{ord.itemCount} items</td>
                      <td className="py-3 px-4 font-bold text-[#172033]">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-[#687085]">{ord.paymentMethod}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">{ord.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SETTLEMENTS TAB */}
      {activeTab === 'settlements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[#172033] flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#172B82]" /> Settlement Payout Reports
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E6] text-[#172033] font-bold border-y border-[#DDD7CA]">
                  <tr>
                    <th className="py-3 px-4">Settlement ID</th>
                    <th className="py-3 px-4">Cycle Period</th>
                    <th className="py-3 px-4">Orders Count</th>
                    <th className="py-3 px-4">Gross Sales</th>
                    <th className="py-3 px-4">Commission</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD7CA]/60 font-medium">
                  {settlements.map((stl) => (
                    <tr key={stl.id} className="hover:bg-[#FFFCF5]">
                      <td className="py-3 px-4 font-mono font-bold text-[#172B82]">{stl.settlementId}</td>
                      <td className="py-3 px-4 text-[#687085]">{stl.cyclePeriod}</td>
                      <td className="py-3 px-4 font-bold text-[#172033]">{stl.ordersCount}</td>
                      <td className="py-3 px-4 text-[#172033]">₹{stl.grossAmount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-rose-600">-₹{stl.commissionAmount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-extrabold text-emerald-700">₹{stl.netPayout.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">{stl.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};

export default ReportsPage;
