import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Package,
  Layers,
  Edit,
  Trash2,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { BottomSheet } from '../../components/common/BottomSheet';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const ProductListPage: React.FC = () => {
  const { products, categories, deleteProduct, updateProduct } = useData();
  const { success } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('ALL');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;

    const matchesStock =
      selectedStockStatus === 'ALL' ||
      (selectedStockStatus === 'LOW' && p.stock <= p.lowStockThreshold && p.stock > 0) ||
      (selectedStockStatus === 'OUT' && p.stock === 0) ||
      (selectedStockStatus === 'IN_STOCK' && p.stock > p.lowStockThreshold);

    return matchesSearch && matchesCat && matchesStock;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from store catalog?`)) {
      deleteProduct(id);
      success('Product Removed', `${name} has been archived.`);
    }
  };

  const handleToggleStatus = (id: string, current: string) => {
    const newStatus = current === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateProduct(id, { status: newStatus as any });
    success('Status Updated', `Product visibility set to ${newStatus}.`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-5">
        <PageHeader
          title="Products Catalog"
          subtitle="Manage store garments, pricing, inventory thresholds and variant matrices."
          breadcrumbs={[{ label: 'Products' }]}
          actions={
            <Link to="/vendor/products/add" className="wn-btn-primary text-xs sm:text-sm">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          }
        />

        {/* Filter and Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#DDD7CA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#687085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, SKU, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wn-input pl-9 py-2 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#687085] hover:text-[#172033]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Filter Selectors */}
          <div className="hidden sm:flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="wn-input py-1.5 px-3 text-xs w-auto"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              className="wn-input py-1.5 px-3 text-xs w-auto"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock (Healthy)</option>
              <option value="LOW">Low Stock</option>
              <option value="OUT">Out of Stock</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFilterSheetOpen(true)}
            className="sm:hidden w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#FFFCF5] border border-[#DDD7CA] rounded-xl text-xs font-semibold text-[#172033] min-h-[42px]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#172B82]" />
            <span>Filters & Categories ({selectedCategory !== 'ALL' ? selectedCategory : 'All'})</span>
          </motion.button>
        </div>

        {/* Mobile Horizontal Category Scrolling Chips */}
        <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-1 -mx-3.5 px-3.5 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors min-h-[34px] ${
              selectedCategory === 'ALL'
                ? 'bg-[#172B82] text-white shadow-xs'
                : 'bg-white border border-[#DDD7CA] text-[#687085]'
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors min-h-[34px] ${
                selectedCategory === c.name
                  ? 'bg-[#172B82] text-white shadow-xs'
                  : 'bg-white border border-[#DDD7CA] text-[#687085]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Product List Content */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Products Found"
            description="Try modifying your search or filter criteria to locate garments in your inventory."
            actionLabel="Add New Product"
            onAction={() => navigate('/vendor/products/add')}
          />
        ) : (
          <>
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden lg:block bg-white rounded-2xl border border-[#DDD7CA] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category & Brand</th>
                    <th className="py-3 px-4">Price / MRP</th>
                    <th className="py-3 px-4">Available Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD7CA]/60">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#FFFCF5] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-11 h-11 rounded-lg object-cover border border-[#DDD7CA] shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              to={`/vendor/products/${product.id}`}
                              className="font-bold text-[#172033] hover:text-[#172B82] truncate block max-w-xs"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-[#687085] font-mono">
                              SKU: {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#172033]">{product.category}</p>
                        <p className="text-[11px] text-[#687085]">{product.brand}</p>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-sm text-[#172033]">
                            ₹{product.sellingPrice}
                          </span>
                          <span className="line-through text-[11px] text-[#687085]">
                            ₹{product.mrp}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                            {product.discountPercent}% OFF
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              product.stock === 0
                                ? 'text-[#DC2626]'
                                : product.stock <= product.lowStockThreshold
                                ? 'text-[#F59E0B]'
                                : 'text-[#16A34A]'
                            }`}
                          >
                            {product.stock} units
                          </span>
                          {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-bold">
                              Low
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(product.id, product.status)}
                          className="cursor-pointer"
                          title="Click to toggle active state"
                        >
                          <StatusBadge status={product.status} size="sm" />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/vendor/products/${product.id}/variants`}
                            className="wn-btn-secondary text-[11px] py-1 px-2.5"
                            title="Variants matrix"
                          >
                            <Layers className="w-3 h-3 text-[#172B82]" />
                            <span>Matrix</span>
                          </Link>
                          <Link
                            to={`/vendor/products/${product.id}`}
                            className="p-1.5 rounded-lg border border-[#DDD7CA] hover:bg-[#F5F0E6] text-[#687085]"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 rounded-lg border border-[#DDD7CA] hover:bg-rose-50 text-[#DC2626]"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE COMPACT CARDS VIEW */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:hidden space-y-2.5"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={staggerItem}
                  whileTap={{ scale: 0.99 }}
                  className="bg-white p-3 rounded-xl border border-[#DDD7CA] shadow-xs flex gap-3 select-none"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-24 rounded-lg object-cover border border-[#DDD7CA] shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          to={`/vendor/products/${product.id}`}
                          className="text-xs font-bold text-[#172033] hover:text-[#172B82] line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <StatusBadge status={product.status} size="sm" showDot={false} />
                      </div>

                      <p className="text-[11px] text-[#687085] truncate mt-0.5">{product.brand}</p>

                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-sm font-bold text-[#172033]">
                          ₹{product.sellingPrice}
                        </span>
                        <span className="line-through text-[11px] text-[#687085]">
                          ₹{product.mrp}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {product.discountPercent}% off
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#DDD7CA]/50 text-xs">
                      <span
                        className={`text-[11px] font-semibold ${
                          product.stock === 0
                            ? 'text-[#DC2626]'
                            : product.stock <= product.lowStockThreshold
                            ? 'text-[#F59E0B]'
                            : 'text-[#16A34A]'
                        }`}
                      >
                        Stock: {product.stock}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/vendor/products/${product.id}/variants`}
                          className="px-2 py-1 bg-[#F5F0E6] text-[#172B82] rounded-md text-[11px] font-semibold"
                        >
                          Matrix
                        </Link>
                        <Link
                          to={`/vendor/products/${product.id}`}
                          className="px-2.5 py-1 bg-[#172B82] text-white rounded-md text-[11px] font-semibold"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {/* Mobile Filter Sheet */}
        <BottomSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          title="Filter Products"
          subtitle="Narrow catalog by category and stock level"
        >
          <div className="space-y-4 py-2">
            <div>
              <label className="wn-label">Category</label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold ${
                    selectedCategory === 'ALL'
                      ? 'bg-[#172B82] text-white'
                      : 'bg-white border border-[#DDD7CA] text-[#172033]'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold ${
                      selectedCategory === c.name
                        ? 'bg-[#172B82] text-white'
                        : 'bg-white border border-[#DDD7CA] text-[#172033]'
                    }`}
                  >
                    {c.name} ({c.productCount})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="wn-label">Stock Status</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: 'ALL', label: 'All Items' },
                  { val: 'IN_STOCK', label: 'Healthy Stock' },
                  { val: 'LOW', label: 'Low Stock' },
                  { val: 'OUT', label: 'Out of Stock' }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setSelectedStockStatus(opt.val)}
                    className={`p-2.5 rounded-lg text-xs font-semibold text-center border ${
                      selectedStockStatus === opt.val
                        ? 'bg-[#172B82] text-white border-[#172B82]'
                        : 'bg-white border border-[#DDD7CA] text-[#172033]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsFilterSheetOpen(false)}
              className="w-full wn-btn-primary py-3 text-xs font-semibold mt-4"
            >
              Apply Filters
            </button>
          </div>
        </BottomSheet>
      </div>
    </AnimatedPage>
  );
};
