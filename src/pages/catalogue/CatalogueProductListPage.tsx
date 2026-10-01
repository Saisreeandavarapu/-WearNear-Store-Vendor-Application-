import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Send,
  Layers,
  Barcode,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ProductLifecycleStatus } from '../../types';

export const CatalogueProductListPage: React.FC = () => {
  const { products, resubmitProductForApproval } = useData();
  const { success } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ProductLifecycleStatus | 'ALL'>('ALL');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' || p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadgeStyle = (status: ProductLifecycleStatus) => {
    switch (status) {
      case 'LIVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'APPROVED':
        return 'bg-[#172B82]/10 text-[#172B82] border-[#172B82]/30';
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'CHANGES_REQUESTED':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'DRAFT':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'PAUSED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'OUT_OF_STOCK':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 pb-16">
        {/* Page Header */}
        <PageHeader
          title="Catalogue Executive Product Desk"
          subtitle="Prepare garment catalogs, generate variant barcodes, inward stock, and submit for Store Owner approval."
          breadcrumbs={[
            { label: 'Catalogue Desk', path: '/vendor/catalogue/products' },
            { label: 'Products' }
          ]}
          action={{
            label: 'Create New Product',
            onClick: () => navigate('/vendor/catalogue/products/add'),
            icon: Plus,
            variant: 'primary'
          }}
        />

        {/* Workflow Info Banner */}
        <div className="bg-gradient-to-r from-[#172B82] via-[#1E3A8A] to-[#0F172A] rounded-2xl p-5 text-white shadow-lg border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-xs text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Controlled Product Publishing Flow
            </div>
            <h2 className="text-lg font-bold text-white">
              Catalogue Executive Preparation → Store Approval → Live Product
            </h2>
            <p className="text-xs text-white/80">
              Products created or edited by Catalogue Executives remain in <span className="text-amber-300 font-bold">UNDER_REVIEW</span> until approved by the Store Manager. Only approved products transition to <span className="text-emerald-300 font-bold">LIVE</span> for customer purchase.
            </p>
          </div>

          <Link
            to="/vendor/catalogue/products/add"
            className="bg-white text-[#172B82] hover:bg-[#F5F0E6] text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Search & Tabs Toolbar */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#687085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by product name, SKU, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="wn-input pl-10 text-xs py-2"
              />
            </div>

            <div className="text-xs text-[#687085] font-semibold">
              Showing {filteredProducts.length} Products
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-[#DDD7CA]/60 pt-3">
            {[
              { id: 'ALL', label: 'All Products' },
              { id: 'UNDER_REVIEW', label: 'Under Review' },
              { id: 'CHANGES_REQUESTED', label: 'Changes Requested' },
              { id: 'LIVE', label: 'Live Products' },
              { id: 'APPROVED', label: 'Approved' },
              { id: 'DRAFT', label: 'Drafts' },
              { id: 'OUT_OF_STOCK', label: 'Out of Stock' },
              { id: 'REJECTED', label: 'Rejected' },
              { id: 'PAUSED', label: 'Paused' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const count = tab.id === 'ALL' ? products.length : products.filter((p) => p.status === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#172B82] text-white shadow-xs'
                      : 'bg-[#F5F0E6] text-[#687085] hover:text-[#172033] hover:bg-white border border-[#DDD7CA]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#172033]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#DDD7CA] p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Image & Header */}
                <div className="flex items-start gap-3">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300'}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#DDD7CA] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider mb-1 ${getStatusBadgeStyle(
                        product.status
                      )}`}
                    >
                      {product.status.replace(/_/g, ' ')}
                    </span>
                    <h3 className="font-bold text-sm text-[#172033] truncate group-hover:text-[#172B82] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#687085]">{product.brand} · {product.category}</p>
                  </div>
                </div>

                {/* SKU & Variant metrics */}
                <div className="mt-3 pt-3 border-t border-[#DDD7CA]/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#687085]">
                    <span>Base SKU:</span>
                    <span className="font-mono font-bold text-[#172033]">{product.sku}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#687085]">
                    <span>Variants & Stock:</span>
                    <span className="font-bold text-[#172B82]">
                      {product.variants.length} Variants · {product.stock} Units
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#687085]">
                    <span>Price:</span>
                    <span className="font-bold text-emerald-700">
                      ₹{product.sellingPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] line-through text-[#687085] font-normal">₹{product.mrp}</span>
                    </span>
                  </div>
                </div>

                {/* Status-specific Callouts */}
                {product.status === 'CHANGES_REQUESTED' && (
                  <div className="mt-3 p-2.5 bg-orange-50 rounded-xl border border-orange-200 text-xs text-orange-950 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-orange-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600" /> Store Manager Comment:
                    </span>
                    <p className="text-[11px] text-orange-900 italic">"{product.reviewComment || 'Please verify image lighting and description details.'}"</p>
                  </div>
                )}

                {product.status === 'UNDER_REVIEW' && (
                  <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Awaiting Store Owner Approval</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#DDD7CA] flex items-center justify-between gap-2">
                <Link
                  to={`/vendor/products/${product.id}`}
                  className="flex-1 wn-btn-secondary py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Link>

                {product.status === 'CHANGES_REQUESTED' && (
                  <button
                    onClick={() => {
                      resubmitProductForApproval(product.id);
                      success('Resubmitted for Approval', `${product.name} is now pending store review.`);
                    }}
                    className="wn-btn-primary py-2 px-3 text-xs font-semibold flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Resubmit</span>
                  </button>
                )}

                {(product.status === 'DRAFT' || product.status === 'CHANGES_REQUESTED') && (
                  <Link
                    to={`/vendor/products/${product.id}/edit`}
                    className="p-2 rounded-xl bg-white border border-[#DDD7CA] text-[#172B82] hover:bg-[#F5F0E6]"
                    title="Edit Product"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CatalogueProductListPage;
