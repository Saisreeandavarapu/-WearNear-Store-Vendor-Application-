import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  Eye,
  CheckSquare,
  Square,
  Package,
  User,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Product, ProductLifecycleStatus } from '../../types';

export const ProductApprovalsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, approveProductByStore, rejectProductByStore, requestProductChangesByStore } = useData();

  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED' | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // Bulk selection state
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
  const [bulkActionSuccessMsg, setBulkActionSuccessMsg] = useState<string | null>(null);

  // Filter products by tab
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Tab filter
      if (activeTab === 'PENDING') {
        if (product.lifecycleStatus !== 'UNDER_REVIEW' && product.lifecycleStatus !== 'SUBMITTED') return false;
      } else if (activeTab === 'APPROVED') {
        if (product.lifecycleStatus !== 'APPROVED' && product.lifecycleStatus !== 'LIVE') return false;
      } else if (activeTab === 'CHANGES_REQUESTED') {
        if (product.lifecycleStatus !== 'CHANGES_REQUESTED') return false;
      } else if (activeTab === 'REJECTED') {
        if (product.lifecycleStatus !== 'REJECTED') return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSku = product.sku?.toLowerCase().includes(query) || product.variants.some((v) => v.sku.toLowerCase().includes(query));
        const matchesSubmitter = product.submittedBy?.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSku && !matchesSubmitter) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'ALL' && product.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [products, activeTab, searchQuery, categoryFilter]);

  // Status Counts
  const pendingCount = useMemo(() => products.filter((p) => p.lifecycleStatus === 'UNDER_REVIEW' || p.lifecycleStatus === 'SUBMITTED').length, [products]);
  const approvedCount = useMemo(() => products.filter((p) => p.lifecycleStatus === 'APPROVED' || p.lifecycleStatus === 'LIVE').length, [products]);
  const changesRequestedCount = useMemo(() => products.filter((p) => p.lifecycleStatus === 'CHANGES_REQUESTED').length, [products]);
  const rejectedCount = useMemo(() => products.filter((p) => p.lifecycleStatus === 'REJECTED').length, [products]);

  // Bulk checkbox handlers
  const pendingProductsInView = useMemo(() => filteredProducts.filter((p) => p.lifecycleStatus === 'UNDER_REVIEW' || p.lifecycleStatus === 'SUBMITTED'), [filteredProducts]);

  const toggleSelectAll = () => {
    if (selectedProductIds.length === pendingProductsInView.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(pendingProductsInView.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) => (prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]));
  };

  // Execute Bulk Approval
  const handleExecuteBulkApprove = () => {
    let countSuccess = 0;
    selectedProductIds.forEach((id) => {
      const res = approveProductByStore(id, 'Store Manager');
      if (res.success) countSuccess++;
    });

    setShowBulkApproveModal(false);
    setSelectedProductIds([]);
    setBulkActionSuccessMsg(`Successfully approved ${countSuccess} products! They are now LIVE for customers.`);
    setTimeout(() => setBulkActionSuccessMsg(null), 5000);
  };

  const getStatusBadge = (status?: ProductLifecycleStatus) => {
    switch (status) {
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pending Store Review
          </span>
        );
      case 'APPROVED':
      case 'LIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved & Live
          </span>
        );
      case 'CHANGES_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 border border-blue-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Changes Requested
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status || 'DRAFT'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#243FBA]/10 text-[#243FBA]">
              Store Manager Review Hub
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#172033] mt-1">Catalogue Product Approvals</h1>
          <p className="text-sm text-[#687085]">
            Review, inspect, approve, or request changes for products submitted by Catalogue Executives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/vendor/catalogue-executives')}
            className="px-3.5 py-2 text-sm font-semibold text-[#243FBA] bg-[#243FBA]/5 hover:bg-[#243FBA]/10 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            Manage Executives
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {bulkActionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{bulkActionSuccessMsg}</span>
          </div>
          <button onClick={() => setBulkActionSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTab === 'PENDING'
              ? 'bg-[#172B82] text-white border-[#172B82] shadow-md'
              : 'bg-white text-[#172033] border-[#DDD7CA] hover:border-[#243FBA]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${activeTab === 'PENDING' ? 'text-blue-100' : 'text-[#687085]'}`}>
              Pending Approval
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'PENDING' ? 'bg-white/20' : 'bg-amber-50 text-amber-600'}`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{pendingCount}</p>
          <p className={`text-xs mt-1 ${activeTab === 'PENDING' ? 'text-blue-200' : 'text-[#687085]'}`}>
            Awaiting store decision
          </p>
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTab === 'APPROVED'
              ? 'bg-[#172B82] text-white border-[#172B82] shadow-md'
              : 'bg-white text-[#172033] border-[#DDD7CA] hover:border-[#243FBA]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${activeTab === 'APPROVED' ? 'text-blue-100' : 'text-[#687085]'}`}>
              Approved & Live
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'APPROVED' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{approvedCount}</p>
          <p className={`text-xs mt-1 ${activeTab === 'APPROVED' ? 'text-blue-200' : 'text-[#687085]'}`}>
            Visible on customer app
          </p>
        </button>

        <button
          onClick={() => setActiveTab('CHANGES_REQUESTED')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTab === 'CHANGES_REQUESTED'
              ? 'bg-[#172B82] text-white border-[#172B82] shadow-md'
              : 'bg-white text-[#172033] border-[#DDD7CA] hover:border-[#243FBA]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${activeTab === 'CHANGES_REQUESTED' ? 'text-blue-100' : 'text-[#687085]'}`}>
              Changes Requested
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'CHANGES_REQUESTED' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{changesRequestedCount}</p>
          <p className={`text-xs mt-1 ${activeTab === 'CHANGES_REQUESTED' ? 'text-blue-200' : 'text-[#687085]'}`}>
            Returned to executive
          </p>
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTab === 'REJECTED'
              ? 'bg-[#172B82] text-white border-[#172B82] shadow-md'
              : 'bg-white text-[#172033] border-[#DDD7CA] hover:border-[#243FBA]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${activeTab === 'REJECTED' ? 'text-blue-100' : 'text-[#687085]'}`}>
              Rejected
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'REJECTED' ? 'bg-white/20' : 'bg-rose-50 text-rose-600'}`}>
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{rejectedCount}</p>
          <p className={`text-xs mt-1 ${activeTab === 'REJECTED' ? 'text-blue-200' : 'text-[#687085]'}`}>
            Not approved for sale
          </p>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-[#DDD7CA] p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {(['PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED', 'ALL'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-[#172B82] text-white'
                    : 'text-[#687085] hover:bg-slate-100 hover:text-[#172033]'
                }`}
              >
                {tab === 'PENDING' && `Pending Review (${pendingCount})`}
                {tab === 'APPROVED' && `Approved (${approvedCount})`}
                {tab === 'CHANGES_REQUESTED' && `Changes Requested (${changesRequestedCount})`}
                {tab === 'REJECTED' && `Rejected (${rejectedCount})`}
                {tab === 'ALL' && `All Submissions (${products.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#687085]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, brand, SKU, or executive submitter..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-[#DDD7CA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243FBA]/20 focus:border-[#243FBA]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 px-3 text-sm bg-slate-50 border border-[#DDD7CA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243FBA]/20"
            >
              <option value="ALL">All Categories</option>
              {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Approval Action Bar (When pending products are selected) */}
      {selectedProductIds.length > 0 && (
        <div className="bg-[#172B82] text-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-blue-200" />
            <span className="text-sm font-semibold">
              {selectedProductIds.length} {selectedProductIds.length === 1 ? 'product' : 'products'} selected for bulk store review
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProductIds([])}
              className="px-3 py-1.5 text-xs font-semibold text-blue-200 hover:text-white transition-colors"
            >
              Deselect All
            </button>
            <button
              onClick={() => setShowBulkApproveModal(true)}
              className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve Selected ({selectedProductIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Product Approval Cards List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#DDD7CA] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#687085]">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#172033]">No products found</h3>
          <p className="text-sm text-[#687085] max-w-md mx-auto">
            {activeTab === 'PENDING'
              ? 'Great job! There are currently no pending products awaiting store approval.'
              : 'No products match the selected status or search filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Select all toggle row if in pending view */}
          {(activeTab === 'PENDING' || activeTab === 'ALL') && pendingProductsInView.length > 0 && (
            <div className="flex items-center justify-between px-2 text-xs text-[#687085]">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 font-medium hover:text-[#172033] transition-colors"
              >
                {selectedProductIds.length === pendingProductsInView.length && pendingProductsInView.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-[#243FBA]" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Select All Pending ({pendingProductsInView.length})</span>
              </button>
              <span>Showing {filteredProducts.length} total items</span>
            </div>
          )}

          {filteredProducts.map((product) => {
            const isPending = product.lifecycleStatus === 'UNDER_REVIEW' || product.lifecycleStatus === 'SUBMITTED';
            const isSelected = selectedProductIds.includes(product.id);
            const totalStock = product.stock || product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-xl border transition-all hover:shadow-md p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isSelected ? 'border-[#243FBA] bg-blue-50/20' : 'border-[#DDD7CA]'
                }`}
              >
                <div className="flex items-start gap-3 w-full md:w-auto">
                  {/* Selection Checkbox */}
                  {isPending && (
                    <button
                      onClick={() => toggleSelectProduct(product.id)}
                      className="mt-1 text-slate-400 hover:text-[#243FBA] transition-colors shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-[#243FBA]" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                  )}

                  {/* Thumbnail */}
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
                  />

                  {/* Info */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-[#243FBA] bg-[#243FBA]/5 px-2 py-0.5 rounded">
                        {product.brand}
                      </span>
                      <span className="text-xs font-medium text-[#687085] bg-slate-100 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      {getStatusBadge(product.lifecycleStatus)}
                    </div>

                    <h3 className="font-bold text-[#172033] text-base truncate">{product.name}</h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#687085]">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">SKU: {product.sku || 'N/A'}</span>
                      <span>
                        <strong className="text-[#172033]">{product.variants?.length || 1}</strong> Variants
                      </span>
                      <span>
                        <strong className="text-[#172033]">{totalStock}</strong> Units Stock
                      </span>
                      <span className="font-semibold text-[#172033]">₹{product.price?.toLocaleString() || '0'}</span>
                    </div>

                    {/* Submitter info */}
                    <div className="flex items-center gap-2 text-xs text-[#687085] pt-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Submitted by <strong className="text-[#172033]">{product.submittedBy || 'Catalogue Exec'}</strong>
                      </span>
                      {product.submittedAt && (
                        <>
                          <span>•</span>
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(product.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => navigate(`/vendor/products/approvals/${product.id}`)}
                    className="w-full md:w-auto px-4 py-2 text-xs font-bold text-white bg-[#172B82] hover:bg-[#243FBA] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Review Product
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bulk Approval Modal */}
      {showBulkApproveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#172033]">
                Approve {selectedProductIds.length} Selected Products?
              </h3>
              <p className="text-sm text-[#687085]">
                Selected products will be published and become <strong className="text-emerald-700">LIVE</strong> on the WearNear customer application if all publication conditions are satisfied.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-[#687085]">
              <div className="flex justify-between font-semibold text-[#172033]">
                <span>Total Selected:</span>
                <span>{selectedProductIds.length} Products</span>
              </div>
              <div className="flex justify-between">
                <span>Action By:</span>
                <span>Store Owner / Manager</span>
              </div>
              <div className="flex justify-between">
                <span>Publication Target:</span>
                <span className="text-emerald-600 font-semibold">Live Catalogue</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowBulkApproveModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-[#687085] hover:text-[#172033] bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteBulkApprove}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductApprovalsListPage;
