import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Package,
  Barcode,
  Tag,
  Layers,
  Image as ImageIcon,
  ShieldCheck,
  History,
  MessageSquare,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Eye,
  Store
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ProductLifecycleStatus } from '../../types';

export const ProductApprovalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    approveProductByStore,
    requestProductChangesByStore,
    rejectProductByStore,
    pauseProductByStore,
    unpauseProductByStore,
    businessProfile
  } = useData();

  const product = products.find((p) => p.id === id);

  // Modals state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Request changes form state
  const [selectedChanges, setSelectedChanges] = useState<string[]>([]);
  const [changesComment, setChangesComment] = useState('');
  const [changesError, setChangesError] = useState('');

  // Rejection form state
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  // Approval result state
  const [approvalResult, setApprovalResult] = useState<{ success: boolean; isLive: boolean; error?: string } | null>(null);

  // Preview Image Modal
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="bg-white rounded-xl border border-[#DDD7CA] p-12 text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#172033]">Product Not Found</h2>
        <p className="text-sm text-[#687085]">
          The product approval request you are trying to view does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/vendor/products/approvals')}
          className="px-4 py-2 text-xs font-bold text-white bg-[#172B82] rounded-lg hover:bg-[#243FBA] transition-colors"
        >
          Return to Approvals
        </button>
      </div>
    );
  }

  // 17. LIVE PRODUCT CONDITIONS CHECK
  const isStoreActive = businessProfile?.kycStatus === 'APPROVED' || businessProfile?.storeStatus === 'ACTIVE';
  const hasValidInfo = Boolean(product.name && product.category && product.brand);
  const hasValidImage = Boolean(product.image || (product.images && product.images.length > 0));
  const hasPrice = (product.price || 0) > 0;
  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const hasSkus = Boolean(product.sku || (product.variants && product.variants.every((v) => Boolean(v.sku))));
  const hasBarcodes = Boolean(product.barcode || (product.variants && product.variants.some((v) => Boolean(v.barcode))));

  const missingLiveConditions: string[] = [];
  if (!isStoreActive) missingLiveConditions.push('Store is not active (KYC pending)');
  if (!hasValidInfo) missingLiveConditions.push('Product basic information incomplete');
  if (!hasValidImage) missingLiveConditions.push('At least one valid product image required');
  if (!hasPrice) missingLiveConditions.push('Valid price required');
  if (!hasVariants) missingLiveConditions.push('At least one sellable variant required');
  if (!hasSkus) missingLiveConditions.push('SKU missing for product or variants');

  const isReadyForLive = missingLiveConditions.length === 0;

  // Toggle Request Changes Checklist
  const toggleChangeItem = (item: string) => {
    setSelectedChanges((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  // Handle Approve Action
  const handleConfirmApprove = () => {
    const res = approveProductByStore(product.id, 'Store Manager');
    setApprovalResult(res);
    setShowApproveModal(false);
  };

  // Handle Request Changes Submit
  const handleConfirmRequestChanges = () => {
    if (selectedChanges.length === 0 && !changesComment.trim()) {
      setChangesError('Please select at least one required change item or enter a comment.');
      return;
    }
    requestProductChangesByStore(product.id, selectedChanges, changesComment, 'Store Manager');
    setShowChangesModal(false);
    navigate('/vendor/products/approvals');
  };

  // Handle Reject Submit
  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      setRejectionError('Rejection reason is required.');
      return;
    }
    rejectProductByStore(product.id, rejectionReason, 'Store Manager');
    setShowRejectModal(false);
    navigate('/vendor/products/approvals');
  };

  const getStatusBadge = (status?: ProductLifecycleStatus) => {
    switch (status) {
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Under Store Review
          </span>
        );
      case 'APPROVED':
      case 'LIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved & Live
          </span>
        );
      case 'CHANGES_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 border border-blue-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Changes Requested
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status || 'DRAFT'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#687085] mb-2">
            <Link to="/vendor/products/approvals" className="hover:text-[#243FBA] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Approvals
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-[#172033] font-medium truncate max-w-xs">{product.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#172033]">{product.name}</h1>
            {getStatusBadge(product.lifecycleStatus)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/vendor/products/approvals')}
            className="px-3.5 py-2 text-xs font-semibold text-[#687085] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Back to Approvals List
          </button>
        </div>
      </div>

      {/* Result Notification Banner */}
      {approvalResult && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between animate-fade-in ${
            approvalResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {approvalResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>
              {approvalResult.success
                ? `Product Approved successfully! ${product.name} is now LIVE on customer app.`
                : approvalResult.error || 'Failed to approve product.'}
            </span>
          </div>
          <button onClick={() => setApprovalResult(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Live Product Readiness Banner */}
      <div className="bg-white rounded-xl border border-[#DDD7CA] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#243FBA]" />
            <h3 className="font-bold text-[#172033] text-sm">Store Live Product Readiness Audit</h3>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isReadyForLive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isReadyForLive ? '✓ Ready for Store Publication' : '⚠ Action Needed Before Live'}
          </span>
        </div>

        {!isReadyForLive && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Cannot Publish Product Directly Until Requirements Met:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-amber-700 pl-1">
              {missingLiveConditions.map((cond, idx) => (
                <li key={idx}>{cond}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className={hasValidInfo ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {hasValidInfo ? '✓' : '○'}
            </span>
            <span className="text-[#172033]">Basic Details</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={hasValidImage ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {hasValidImage ? '✓' : '○'}
            </span>
            <span className="text-[#172033]">Product Images</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={hasVariants ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {hasVariants ? '✓' : '○'}
            </span>
            <span className="text-[#172033]">Variants Created</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={hasSkus ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {hasSkus ? '✓' : '○'}
            </span>
            <span className="text-[#172033]">Unique SKU</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={hasBarcodes ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {hasBarcodes ? '✓' : '○'}
            </span>
            <span className="text-[#172033]">Barcode Assigned</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={hasPrice ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {hasPrice ? '✓' : '○'}
            </span>
            <span className="text-[#172033]">Price Configured</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={isStoreActive ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {isStoreActive ? '✓' : '○'}
            </span>
            <span className="text-[#172033]">Active Store</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Details & Images & Variants) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images Gallery */}
          <div className="bg-white rounded-xl border border-[#DDD7CA] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#243FBA]" />
                <h3 className="font-bold text-[#172033]">Product Images</h3>
              </div>
              <span className="text-xs text-[#687085]">
                {product.images?.length || 1} {product.images?.length === 1 ? 'image' : 'images'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                onClick={() => setSelectedPreviewImage(product.image)}
                className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer bg-slate-50"
              >
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400'}
                  alt="Primary"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#172B82] text-white">
                  Primary
                </span>
              </div>

              {product.images?.slice(1).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPreviewImage(imgUrl)}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer bg-slate-50"
                >
                  <img
                    src={imgUrl}
                    alt={`Detail ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white">
                    View #{idx + 2}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-xl border border-[#DDD7CA] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#243FBA]" />
                <h3 className="font-bold text-[#172033]">Product Specifications</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#687085]">Product Name</span>
                <p className="font-bold text-[#172033] text-sm mt-0.5">{product.name}</p>
              </div>
              <div>
                <span className="text-[#687085]">Brand</span>
                <p className="font-semibold text-[#172033] mt-0.5">{product.brand}</p>
              </div>
              <div>
                <span className="text-[#687085]">Category</span>
                <p className="font-semibold text-[#172033] mt-0.5">{product.category}</p>
              </div>
              <div>
                <span className="text-[#687085]">Base Price</span>
                <p className="font-bold text-[#172033] mt-0.5">₹{product.price?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <span className="text-[#687085]">Primary SKU</span>
                <p className="font-mono font-semibold text-[#172033] mt-0.5">{product.sku || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[#687085]">Barcode</span>
                <p className="font-mono text-[#172033] mt-0.5">{product.barcode || 'N/A'}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs text-[#687085]">Product Description</span>
              <p className="text-xs text-[#172033] mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {product.description || 'No detailed description provided by Catalogue Executive.'}
              </p>
            </div>
          </div>

          {/* Variants & Stock Table */}
          <div className="bg-white rounded-xl border border-[#DDD7CA] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#243FBA]" />
                <h3 className="font-bold text-[#172033]">Product Variants & Stock</h3>
              </div>
              <span className="text-xs text-[#687085] font-semibold">
                {product.variants?.length || 1} Variants
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#687085]">
                    <th className="p-3 font-semibold">Variant (Color/Size)</th>
                    <th className="p-3 font-semibold">SKU</th>
                    <th className="p-3 font-semibold">Barcode</th>
                    <th className="p-3 font-semibold">Price</th>
                    <th className="p-3 font-semibold">Stock</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {product.variants && product.variants.length > 0 ? (
                    product.variants.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-[#172033]">
                          {v.color || 'Default'} / {v.size || 'STD'}
                        </td>
                        <td className="p-3 font-mono text-slate-700">{v.sku}</td>
                        <td className="p-3 font-mono text-slate-500">{v.barcode || 'N/A'}</td>
                        <td className="p-3 font-semibold text-[#172033]">₹{v.price.toLocaleString()}</td>
                        <td className="p-3">
                          <span
                            className={`font-bold px-2 py-0.5 rounded ${
                              v.stock > 10
                                ? 'bg-emerald-50 text-emerald-700'
                                : v.stock > 0
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {v.stock} units
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{v.stock > 0 ? 'In Stock' : 'Out of Stock'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 font-semibold text-[#172033]">Standard Variant</td>
                      <td className="p-3 font-mono text-slate-700">{product.sku}</td>
                      <td className="p-3 font-mono text-slate-500">{product.barcode || 'N/A'}</td>
                      <td className="p-3 font-semibold text-[#172033]">₹{product.price?.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          {product.stock || 0} units
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 font-medium">In Stock</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Submitter Info, Store Action Card, Audit Trail) */}
        <div className="space-y-6">
          {/* Submitter Info Card */}
          <div className="bg-white rounded-xl border border-[#DDD7CA] p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-[#172033] text-sm border-b border-slate-100 pb-2">
              Submitted By Catalogue Executive
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#172B82] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {product.submittedBy ? product.submittedBy.substring(0, 2).toUpperCase() : 'CE'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#172033] text-sm truncate">{product.submittedBy || 'Priya Sharma'}</p>
                <p className="text-xs text-[#687085]">Catalogue Executive • EMP-204</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 text-[#687085]">
              <div className="flex justify-between">
                <span>Submitted Date:</span>
                <span className="font-medium text-[#172033]">
                  {product.submittedAt
                    ? new Date(product.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'Today'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Store Target:</span>
                <span className="font-medium text-[#172033]">{businessProfile?.storeName || 'WearNear Store'}</span>
              </div>
            </div>
          </div>

          {/* Audit Timeline Trail */}
          <div className="bg-white rounded-xl border border-[#DDD7CA] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#243FBA]" />
                <h3 className="font-bold text-[#172033] text-sm">Product Audit History</h3>
              </div>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-[#243FBA] border-2 border-white ring-2 ring-blue-100" />
                <p className="font-bold text-[#172033]">Product Submitted for Approval</p>
                <p className="text-[#687085]">By {product.submittedBy || 'Catalogue Executive'}</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-slate-400 border-2 border-white" />
                <p className="font-bold text-[#172033]">Stock & Barcode Verified</p>
                <p className="text-[#687085]">Variants and stock quantities added</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-slate-400 border-2 border-white" />
                <p className="font-bold text-[#172033]">Draft Product Created</p>
                <p className="text-[#687085]">Initial draft saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM APPROVAL ACTIONS BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DDD7CA] shadow-2xl p-4 md:pl-64">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#687085] hidden sm:block">
            Status: <strong className="text-[#172033] font-bold">{product.lifecycleStatus || 'UNDER_REVIEW'}</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200 flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              Reject Product
            </button>

            <button
              onClick={() => setShowChangesModal(true)}
              className="px-4 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              Request Changes
            </button>

            <button
              onClick={() => setShowApproveModal(true)}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve & Make Live
            </button>
          </div>
        </div>
      </div>

      {/* APPROVAL CONFIRMATION MODAL */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#172033]">Approve Product & Publish Live?</h3>
              <p className="text-sm text-[#687085]">
                <strong className="text-[#172033]">{product.name}</strong> will be approved and made immediately available for customer view and purchase on WearNear.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-[#687085]">
              <div className="flex justify-between">
                <span>Variants:</span>
                <span className="font-semibold text-[#172033]">{product.variants?.length || 1}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Stock:</span>
                <span className="font-semibold text-[#172033]">{product.stock || 0} Units</span>
              </div>
              <div className="flex justify-between">
                <span>Approver:</span>
                <span className="font-semibold text-[#172033]">Store Owner / Manager</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-[#687085] bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm & Make Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST CHANGES MODAL */}
      {showChangesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-[#172033]">Request Product Changes</h3>
              </div>
              <button onClick={() => setShowChangesModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {changesError && <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded">{changesError}</p>}

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#172033]">Required Changes Checklist:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Product Image',
                  'Product Description',
                  'Price & Discount',
                  'Variant Details',
                  'SKU Format',
                  'Barcode Assignment',
                  'Stock Quantity',
                  'Category Mapping'
                ].map((item) => (
                  <label key={item} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={selectedChanges.includes(item)}
                      onChange={() => toggleChangeItem(item)}
                      className="rounded border-slate-300 text-[#243FBA]"
                    />
                    <span className="text-[#172033] font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#172033]">Manager Instructions / Comments:</label>
              <textarea
                value={changesComment}
                onChange={(e) => setChangesComment(e.target.value)}
                placeholder="Example: Please replace the main image with a higher resolution studio shot and re-verify size L stock."
                rows={3}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243FBA]/20"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowChangesModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-[#687085] bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRequestChanges}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-[#172B82] hover:bg-[#243FBA] rounded-lg transition-colors shadow-md"
              >
                Send Back to Executive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT PRODUCT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#172033]">Reject Product Submission?</h3>
              <p className="text-sm text-[#687085]">
                Rejected products will not be approved for publication and will be returned with a mandatory rejection reason.
              </p>
            </div>

            {rejectionError && <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded">{rejectionError}</p>}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#172033]">Rejection Reason (Mandatory):</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Example: Product does not meet WearNear quality standards or vendor brand policies."
                rows={3}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-[#687085] bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {selectedPreviewImage && (
        <div
          onClick={() => setSelectedPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <img src={selectedPreviewImage} alt="Full Preview" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default ProductApprovalDetailPage;
