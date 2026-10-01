import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Send,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Settings,
  Activity,
  History,
  Barcode,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Building2,
  KeyRound,
  Ban,
  RefreshCw,
  X
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { CatalogueExecutive, ExecutiveRequest } from '../../types';

export const CatalogueExecutivesListPage: React.FC = () => {
  const {
    catalogueExecutives,
    executiveRequests,
    maxActiveExecutivesLimit,
    toggleExecutiveStatus,
    requestAdditionalExecutives
  } = useData();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Request Form state
  const [requestedCount, setRequestedCount] = useState<number>(2);
  const [requestReason, setRequestReason] = useState<string>('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const activeCount = catalogueExecutives.filter((e) => e.status === 'ACTIVE').length;
  const isLimitReached = activeCount >= maxActiveExecutivesLimit;

  const filteredExecutives = catalogueExecutives.filter((exec) => {
    const matchesSearch =
      exec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || exec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestReason.trim()) {
      error('Reason Required', 'Please explain why your store requires additional Catalogue Executives.');
      return;
    }
    setIsSubmittingRequest(true);
    try {
      requestAdditionalExecutives(requestedCount, requestReason);
      success(
        'Request Submitted to Super Admin',
        `Requested +${requestedCount} Catalogue Executive slots. You will be notified upon review.`
      );
      setIsRequestModalOpen(false);
      setRequestReason('');
      setRequestedCount(2);
    } catch (err) {
      error('Failed to submit request', 'An error occurred while submitting your request.');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleAddClick = () => {
    if (isLimitReached) {
      info(
        'Limit Reached',
        `Your store has reached the maximum default limit of ${maxActiveExecutivesLimit} active Catalogue Executives.`
      );
      setIsRequestModalOpen(true);
    } else {
      navigate('/vendor/catalogue-executives/add');
    }
  };

  return (
    <AnimatedPage>
      <div className="space-[#172033] space-y-6 pb-12">
        {/* Page Header */}
        <PageHeader
          title="Catalogue Executive Management"
          subtitle="Manage store fulfilment leads, barcode tags operators, granular permissions, and operational activity."
          breadcrumbs={[
            { label: 'Store Management', path: '/vendor/dashboard' },
            { label: 'Catalogue Executives' }
          ]}
          action={{
            label: isLimitReached ? 'Request Additional Executive' : 'Add Catalogue Executive',
            onClick: handleAddClick,
            icon: isLimitReached ? Lock : UserPlus,
            variant: isLimitReached ? 'secondary' : 'primary'
          }}
        />

        {/* Executive Count Banner Card */}
        <div className="bg-gradient-to-r from-[#172B82] via-[#1E3A8A] to-[#0F172A] rounded-2xl text-white p-5 sm:p-6 shadow-xl border border-white/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Store Fulfilment Operations Module
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Active Catalogue Executives: {activeCount} / {maxActiveExecutivesLimit} Allowed
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Catalogue Executives are dedicated store staff managing products, barcode labels, inventory inwarding, and order packing. Store financial and sensitive wallet settings remain private to the Store Owner.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[120px]">
                <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Active Staff</p>
                <p className="text-2xl font-extrabold text-white">{activeCount} / {maxActiveExecutivesLimit}</p>
              </div>

              {isLimitReached ? (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsRequestModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-[#172033] font-bold text-xs px-4 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors min-h-[44px]"
                >
                  <Lock className="w-4 h-4 text-[#172033]" />
                  <span>Request Additional Executive</span>
                </motion.button>
              ) : (
                <Link
                  to="/vendor/catalogue-executives/add"
                  className="bg-white text-[#172B82] hover:bg-[#F5F0E6] font-bold text-xs px-4 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors min-h-[44px]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Executive</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Limit Reached Callout (If limit is reached) */}
        {isLimitReached && (
          <div className="bg-amber-50 rounded-2xl border border-amber-200/80 p-4 sm:p-5 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950">Catalogue Executive Limit Reached (3 / 3 Active)</h4>
                <p className="text-xs text-amber-800 mt-0.5 max-w-xl">
                  You cannot directly create another Catalogue Executive because your default allocation of 3 active executives is filled. Submit an expansion request for Super Admin approval.
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsRequestModalOpen(true)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>[ Request Additional Executive ]</span>
            </motion.button>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#687085]" />
            <input
              type="text"
              placeholder="Search by name, ID, role, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wn-input pl-10 text-xs py-2"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-[#687085] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            <div className="flex items-center bg-[#F5F0E6] p-1 rounded-xl border border-[#DDD7CA]">
              {(['ALL', 'ACTIVE', 'SUSPENDED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? 'bg-white text-[#172B82] shadow-xs'
                      : 'text-[#687085] hover:text-[#172033]'
                  }`}
                >
                  {st === 'ALL' ? 'All Executives' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Executive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExecutives.map((exec) => (
            <div
              key={exec.id}
              className="bg-white rounded-2xl border border-[#DDD7CA] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={exec.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={exec.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#DDD7CA] shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#172033] group-hover:text-[#172B82] transition-colors">
                          {exec.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#687085] font-medium">{exec.role}</p>
                      <span className="text-[10px] font-mono text-[#687085] bg-[#F5F0E6] px-1.5 py-0.5 rounded border border-[#DDD7CA] inline-block mt-0.5">
                        ID: {exec.employeeId}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      exec.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {exec.status}
                  </span>
                </div>

                {/* Preset Badge & Contact */}
                <div className="mt-4 pt-3 border-t border-[#DDD7CA]/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#687085]">
                    <span>Permission Preset:</span>
                    <span className="font-bold text-[#172B82] bg-[#172B82]/10 px-2 py-0.5 rounded-md text-[11px]">
                      {exec.preset} PRESET
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#687085]">
                    <span>Joined Date:</span>
                    <span className="font-medium text-[#172033]">{exec.joinedDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#687085]">
                    <span>Last Login:</span>
                    <span className="font-medium text-[#172033]">{exec.lastLogin}</span>
                  </div>
                </div>

                {/* Permission Highlights pill list */}
                <div className="mt-3 pt-3 border-t border-[#DDD7CA]/60 flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                    ✓ Catalogue & Barcode
                  </span>
                  <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md border border-sky-200 font-medium">
                    ✓ Inwarding & Stock
                  </span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200 font-medium">
                    ✓ Picking & Packing
                  </span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200 font-medium">
                    🔒 No Financial View
                  </span>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="pt-3 border-t border-[#DDD7CA] flex items-center justify-between gap-2">
                <Link
                  to={`/vendor/catalogue-executives/${exec.id}`}
                  className="flex-1 wn-btn-secondary py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Profile & Access</span>
                </Link>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    toggleExecutiveStatus(exec.id);
                    success(
                      'Status Updated',
                      `${exec.name} status changed to ${exec.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'}.`
                    );
                  }}
                  title={exec.status === 'ACTIVE' ? 'Suspend Executive' : 'Reactivate Executive'}
                  className={`p-2 rounded-xl border transition-colors ${
                    exec.status === 'ACTIVE'
                      ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {exec.status === 'ACTIVE' ? <Ban className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredExecutives.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#DDD7CA] p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-[#687085] mx-auto opacity-40" />
            <h3 className="text-base font-bold text-[#172033]">No Catalogue Executives Found</h3>
            <p className="text-xs text-[#687085]">Try adjusting search query or status filter.</p>
          </div>
        )}

        {/* Requests History Section */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#172B82]" />
              <h3 className="text-base font-bold text-[#172033]">Additional Executive Limit Requests</h3>
            </div>
            <span className="text-xs text-[#687085] font-semibold">
              Super Admin Approvals
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E6] text-[#172033] font-bold border-y border-[#DDD7CA]">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Current Count</th>
                  <th className="py-3 px-4">Requested Additional</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Requested By</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD7CA]/60 font-medium">
                {executiveRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FFFCF5]">
                    <td className="py-3 px-4 font-mono font-bold text-[#172B82]">{req.id}</td>
                    <td className="py-3 px-4">{req.currentCount} Active</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700">+{req.requestedAdditionalCount} Slots</td>
                    <td className="py-3 px-4 max-w-xs truncate text-[#687085]" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-3 px-4 text-[#172033]">{req.requestedBy}</td>
                    <td className="py-3 px-4 text-[#687085]">{req.date}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {req.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                        {req.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        <span>{req.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: Request Additional Executive */}
        <AnimatePresence>
          {isRequestModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl max-w-lg w-full overflow-hidden"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 bg-[#172B82] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="w-5 h-5 text-amber-300" />
                    <div>
                      <h3 className="font-bold text-base leading-tight">Request Additional Executive Limit</h3>
                      <p className="text-[11px] text-white/70">Super Admin approval workflow</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsRequestModalOpen(false)}
                    className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Current Limit: {activeCount} / {maxActiveExecutivesLimit} Active</span>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Your request will be sent to WearNear Super Admin for quota review. Once approved, your active limit will be increased automatically.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="wn-label">Current Active Count</label>
                      <input
                        type="text"
                        disabled
                        value={`${activeCount} Executives`}
                        className="wn-input bg-[#F5F0E6] text-[#687085] font-semibold cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="wn-label">Additional Count Needed</label>
                      <select
                        value={requestedCount}
                        onChange={(e) => setRequestedCount(Number(e.target.value))}
                        className="wn-select"
                      >
                        <option value={1}>+1 Additional Executive</option>
                        <option value={2}>+2 Additional Executives</option>
                        <option value={3}>+3 Additional Executives</option>
                        <option value={5}>+5 Additional Executives</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="wn-label">Reason for Request *</label>
                    <textarea
                      required
                      rows={3}
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      placeholder="e.g. Festival sale season workload, second store counter inwarding expansion..."
                      className="wn-input text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#F5F0E6] p-3 rounded-xl border border-[#DDD7CA]">
                    <div>
                      <span className="text-[#687085] font-medium block">Requested By:</span>
                      <span className="font-bold text-[#172033]">Store Owner</span>
                    </div>
                    <div>
                      <span className="text-[#687085] font-medium block">Request Date:</span>
                      <span className="font-bold text-[#172033]">Today</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsRequestModalOpen(false)}
                      className="wn-btn-secondary px-4 py-2.5 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmittingRequest}
                      className="wn-btn-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request to Admin</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
};

export default CatalogueExecutivesListPage;
