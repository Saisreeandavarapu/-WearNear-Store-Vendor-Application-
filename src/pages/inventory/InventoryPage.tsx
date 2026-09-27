import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Search,
  Upload,
  History,
  Edit2
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BottomSheet } from '../../components/common/BottomSheet';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { InventoryItem } from '../../types';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const InventoryPage: React.FC = () => {
  const { inventory, updateStock } = useData();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'HEALTHY' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);
  const [reasonInput, setReasonInput] = useState('Stock Count Verification');

  const healthyCount = inventory.filter((i) => i.status === 'HEALTHY').length;
  const lowCount = inventory.filter((i) => i.status === 'LOW_STOCK').length;
  const outCount = inventory.filter((i) => i.status === 'OUT_OF_STOCK').length;
  const totalUnits = inventory.reduce((sum, i) => sum + i.availableStock, 0);

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenRestock = (item: InventoryItem) => {
    setSelectedItem(item);
    setStockInput(item.availableStock);
  };

  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    updateStock(selectedItem.productId, Number(stockInput), reasonInput);
    success('Inventory Adjusted', `${selectedItem.productName} updated to ${stockInput} units.`);
    setSelectedItem(null);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="Store Inventory Health"
          subtitle="Live physical stock tracking, reserve allocations, and safety reorder alerts."
          breadcrumbs={[{ label: 'Inventory' }]}
          actions={
            <div className="flex items-center gap-2">
              <Link
                to="/vendor/inventory/import"
                className="wn-btn-secondary text-xs sm:text-sm"
              >
                <Upload className="w-3.5 h-3.5" /> Import CSV
              </Link>
              <Link
                to="/vendor/inventory/transactions"
                className="wn-btn-secondary text-xs sm:text-sm"
              >
                <History className="w-3.5 h-3.5" /> Stock Log
              </Link>
            </div>
          }
        />

        {/* KPI Cards (Mobile: 2x2 grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            label="Total Units On Hand"
            value={totalUnits}
            numericEnd={totalUnits}
            icon={Layers}
            subValue={`${inventory.length} total SKUs`}
          />
          <StatCard
            label="Healthy In-Stock"
            value={healthyCount}
            numericEnd={healthyCount}
            icon={CheckCircle2}
            subValue="Instant dispatch ready"
          />
          <StatCard
            label="Low Stock Alert"
            value={lowCount}
            numericEnd={lowCount}
            icon={AlertTriangle}
            badge={lowCount > 0 ? 'Urgent' : undefined}
            subValue="Below safety buffer"
          />
          <StatCard
            label="Out of Stock"
            value={outCount}
            numericEnd={outCount}
            icon={AlertOctagon}
            badge={outCount > 0 ? 'Action' : undefined}
            subValue="Suppressed in app"
          />
        </div>

        {/* Search and Status Filters */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#DDD7CA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#687085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by garment title, SKU, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wn-input pl-9 py-2 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs scrollbar-none">
            {[
              { val: 'ALL', label: 'All Items' },
              { val: 'HEALTHY', label: 'Healthy' },
              { val: 'LOW_STOCK', label: 'Low Stock' },
              { val: 'OUT_OF_STOCK', label: 'Out of Stock' }
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setFilterStatus(tab.val as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors min-h-[36px] ${
                  filterStatus === tab.val
                    ? 'bg-[#172B82] text-white shadow-xs'
                    : 'bg-[#FFFCF5] text-[#687085] hover:text-[#172033] border border-[#DDD7CA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* DESKTOP INVENTORY TABLE */}
        <div className="hidden md:block bg-white rounded-2xl border border-[#DDD7CA] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
              <tr>
                <th className="py-3 px-4">Garment / SKU</th>
                <th className="py-3 px-4">Category & Brand</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                <th className="py-3 px-4 text-center">Reserved in Orders</th>
                <th className="py-3 px-4">Inventory Health</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD7CA]/60">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#FFFCF5] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#172033] block">{item.productName}</span>
                    <span className="text-[11px] text-[#687085] font-mono">SKU: {item.sku}</span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#172033]">{item.category}</p>
                    <p className="text-[11px] text-[#687085]">{item.brand}</p>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-extrabold text-sm ${
                        item.availableStock === 0
                          ? 'text-[#DC2626]'
                          : item.availableStock <= item.lowStockThreshold
                          ? 'text-[#F59E0B]'
                          : 'text-[#16A34A]'
                      }`}
                    >
                      {item.availableStock}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="font-medium text-[#687085]">
                      {item.reservedStock} units
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>

                  <td className="py-3 px-4 text-[#687085] text-[11px]">
                    {item.lastUpdated}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenRestock(item)}
                      className="wn-btn-secondary text-[11px] py-1 px-2.5 inline-flex"
                    >
                      <Edit2 className="w-3 h-3 text-[#172B82]" /> Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE COMPACT INVENTORY CARDS */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="md:hidden space-y-2.5"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              className="bg-white p-3.5 rounded-xl border border-[#DDD7CA] shadow-xs space-y-2.5 select-none"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-[#172033]">{item.productName}</h4>
                  <p className="text-[11px] text-[#687085] font-mono">SKU: {item.sku}</p>
                </div>
                <StatusBadge status={item.status} size="sm" showDot={false} />
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#FFFCF5] p-2.5 rounded-lg border border-[#DDD7CA] text-xs">
                <div>
                  <span className="text-[#687085] block text-[10px]">Available Units</span>
                  <span
                    className={`font-extrabold text-sm ${
                      item.availableStock === 0
                        ? 'text-[#DC2626]'
                        : item.availableStock <= item.lowStockThreshold
                        ? 'text-[#F59E0B]'
                        : 'text-[#16A34A]'
                    }`}
                  >
                    {item.availableStock}
                  </span>
                </div>
                <div>
                  <span className="text-[#687085] block text-[10px]">Reserved in Orders</span>
                  <span className="font-semibold text-xs text-[#172033]">
                    {item.reservedStock} units
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[11px] text-[#687085]">{item.lastUpdated}</span>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleOpenRestock(item)}
                  className="wn-btn-primary text-xs py-1.5 px-3 min-h-[36px]"
                >
                  Quick Restock
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stock Adjustment Bottom Sheet (Mobile-first, adapts to centered modal on desktop) */}
        <BottomSheet
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title="Stock Level Adjustment"
          subtitle={selectedItem ? `Adjust count for ${selectedItem.productName}` : undefined}
        >
          {selectedItem && (
            <form onSubmit={handleSaveStock} className="space-y-4 py-1">
              <div>
                <label className="wn-label">Physical Count Available</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={stockInput}
                  onChange={(e) => setStockInput(Number(e.target.value))}
                  className="wn-input text-lg font-bold"
                />
                <p className="text-[11px] text-[#687085] mt-1">
                  Current recorded quantity: {selectedItem.availableStock}
                </p>
              </div>

              <div>
                <label className="wn-label">Adjustment Reason</label>
                <select
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="wn-input text-xs"
                >
                  <option>Stock Count Verification</option>
                  <option>New Shipment Received</option>
                  <option>Counter In-Store Sale POS</option>
                  <option>Damaged Garment Write-Off</option>
                  <option>Customer Return Inward</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="wn-btn-secondary text-xs flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="wn-btn-primary text-xs flex-1">
                  Confirm & Record
                </button>
              </div>
            </form>
          )}
        </BottomSheet>
      </div>
    </AnimatedPage>
  );
};
