import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  ShieldCheck,
  Activity,
  History,
  Barcode,
  Layers,
  ShoppingBag,
  Package,
  Lock,
  Ban,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  Laptop,
  Smartphone,
  Globe,
  Save,
  ChevronRight,
  ArrowLeft,
  X,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ExecutivePermissions, PermissionPreset } from '../../types';

export const CatalogueExecutiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    catalogueExecutives,
    executiveActivities,
    executiveLoginHistories,
    executiveProductActivities,
    toggleExecutiveStatus,
    updateExecutivePermissions
  } = useData();
  const { success, error } = useToast();

  const executive = catalogueExecutives.find((e) => e.id === id || e.employeeId === id) || catalogueExecutives[0];

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'PERMISSIONS' | 'ACTIVITY' | 'LOGIN_HISTORY' | 'PRODUCT_ACTIVITY' | 'SECURITY'
  >('OVERVIEW');

  // Permission Matrix State
  const [permissions, setPermissions] = useState<ExecutivePermissions>(executive ? executive.permissions : {
    product: { view: true, create: true, update: true, delete: false, variants: true, images: true },
    bulk: { bulkImport: true, bulkUpdate: true, bulkExport: true, bulkPriceUpdate: false, bulkStockUpdate: true, bulkBarcodeAssignment: true },
    inventory: { view: true, add: true, update: true, adjust: false, transactions: true, bulkInventory: false },
    orders: { view: true, process: true, picking: true, productVerification: true, quantityVerification: true, packing: true, evidence: true, package: true, handover: true },
    barcode: { view: true, generate: true, assign: true, scan: true, print: true, bulkBarcode: true }
  });
  const [preset, setPreset] = useState<PermissionPreset>(executive ? executive.preset : 'STANDARD');

  // Security modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!executive) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-bold text-[#172033]">Executive Not Found</h3>
        <Link to="/vendor/catalogue-executives" className="wn-btn-primary mt-4 inline-block">
          Return to List
        </Link>
      </div>
    );
  }

  // Filter activities for this executive
  const activities = executiveActivities.filter(
    (a) => a.executiveId === executive.id || a.executiveName.includes(executive.name.split(' ')[0])
  );
  const loginHistory = executiveLoginHistories.filter((lh) => lh.executiveId === executive.id || executiveLoginHistories[0]);
  const productActivity = executiveProductActivities.find((pa) => pa.executiveId === executive.id) || executiveProductActivities[0];

  const handleTogglePermission = (
    category: keyof ExecutivePermissions,
    field: string
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !(prev[category] as any)[field]
      }
    }));
    setPreset('CUSTOM');
  };

  const handleSavePermissions = () => {
    updateExecutivePermissions(executive.id, permissions, preset);
    success('Permissions Saved', `Updated permissions for ${executive.name}.`);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      error('Password Too Short', 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('Password Mismatch', 'Passwords do not match.');
      return;
    }
    success('Password Updated', `Credentials updated for ${executive.name}.`);
    setIsPasswordModalOpen(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 pb-12">
        {/* Top Breadcrumb & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/vendor/catalogue-executives"
              className="p-2 rounded-xl bg-white border border-[#DDD7CA] text-[#687085] hover:text-[#172B82] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">{executive.name}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    executive.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {executive.status}
                </span>
              </div>
              <p className="text-xs text-[#687085] font-medium">
                {executive.role} · Employee ID: <span className="font-mono text-[#172B82] font-bold">{executive.employeeId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                toggleExecutiveStatus(executive.id);
                success('Status Changed', `${executive.name} is now ${executive.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'}.`);
              }}
              className={`wn-btn-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 ${
                executive.status === 'ACTIVE' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {executive.status === 'ACTIVE' ? <Ban className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{executive.status === 'ACTIVE' ? 'Suspend Executive' : 'Reactivate Executive'}</span>
            </button>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="wn-btn-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Reset Credentials</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Header */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-1.5 shadow-xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 min-w-max">
            {[
              { id: 'OVERVIEW', label: 'Overview', icon: Users },
              { id: 'PERMISSIONS', label: 'Permissions Matrix', icon: ShieldCheck },
              { id: 'ACTIVITY', label: 'Timeline Activity', icon: Activity },
              { id: 'LOGIN_HISTORY', label: 'Login History', icon: History },
              { id: 'PRODUCT_ACTIVITY', label: 'Product Activity', icon: Barcode },
              { id: 'SECURITY', label: 'Security & Access', icon: Lock }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#172B82] text-white shadow-sm'
                      : 'text-[#687085] hover:text-[#172033] hover:bg-[#F5F0E6]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENT 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-[#DDD7CA] p-5 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={executive.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={executive.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#DDD7CA]"
                  />
                  <div>
                    <h3 className="font-bold text-base text-[#172033]">{executive.name}</h3>
                    <p className="text-xs text-[#687085]">{executive.role}</p>
                    <span className="text-[10px] font-mono bg-[#F5F0E6] text-[#172B82] font-bold px-2 py-0.5 rounded border border-[#DDD7CA] inline-block mt-1">
                      {executive.employeeId}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#DDD7CA] text-xs">
                  <div className="flex items-center justify-between text-[#687085]">
                    <span>Mobile:</span>
                    <span className="font-semibold text-[#172033]">{executive.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#687085]">
                    <span>Email:</span>
                    <span className="font-semibold text-[#172033]">{executive.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#687085]">
                    <span>Joined Date:</span>
                    <span className="font-semibold text-[#172033]">{executive.joinedDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#687085]">
                    <span>Last Login:</span>
                    <span className="font-semibold text-[#172033]">{executive.lastLogin}</span>
                  </div>
                </div>
              </div>

              {/* Active Session info */}
              <div className="bg-white rounded-2xl border border-[#DDD7CA] p-5 space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-[#172B82]" />
                  <h3 className="font-bold text-sm text-[#172033]">Current Active Session</h3>
                </div>

                {executive.currentSession ? (
                  <div className="space-y-3 bg-[#F5F0E6] p-4 rounded-xl border border-[#DDD7CA] text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#687085]">Device:</span>
                      <span className="font-bold text-[#172033]">{executive.currentSession.device}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#687085]">IP Address:</span>
                      <span className="font-mono text-[#172B82]">{executive.currentSession.ip}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#687085]">Login Time:</span>
                      <span className="font-medium text-[#172033]">{executive.currentSession.loginTime}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#687085]">No current live active session.</p>
                )}

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                  <span className="font-bold">Security Scope:</span> Restricted exclusively to store catalogue, barcodes, and order processing operations.
                </div>
              </div>

              {/* Operational Stats */}
              <div className="bg-white rounded-2xl border border-[#DDD7CA] p-5 space-y-3 shadow-xs">
                <h3 className="font-bold text-sm text-[#172033] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#172B82]" /> Operational Impact
                </h3>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-[#F5F0E6] p-3 rounded-xl border border-[#DDD7CA]">
                    <p className="text-lg font-extrabold text-[#172B82]">{productActivity.barcodesGenerated}</p>
                    <p className="text-[10px] text-[#687085] font-bold">Barcodes Tagged</p>
                  </div>
                  <div className="bg-[#F5F0E6] p-3 rounded-xl border border-[#DDD7CA]">
                    <p className="text-lg font-extrabold text-emerald-700">{productActivity.productsCreated}</p>
                    <p className="text-[10px] text-[#687085] font-bold">Products Added</p>
                  </div>
                  <div className="bg-[#F5F0E6] p-3 rounded-xl border border-[#DDD7CA]">
                    <p className="text-lg font-extrabold text-indigo-700">{productActivity.variantsUpdated}</p>
                    <p className="text-[10px] text-[#687085] font-bold">Variants Updated</p>
                  </div>
                  <div className="bg-[#F5F0E6] p-3 rounded-xl border border-[#DDD7CA]">
                    <p className="text-lg font-extrabold text-purple-700">{productActivity.bulkOperations}</p>
                    <p className="text-[10px] text-[#687085] font-bold">Bulk Inwards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: PERMISSIONS MATRIX */}
        {activeTab === 'PERMISSIONS' && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD7CA]">
              <div>
                <h3 className="font-bold text-base text-[#172033]">Catalogue Executive Permission Matrix</h3>
                <p className="text-xs text-[#687085]">
                  Configure granular capability rights for Product, Bulk Ops, Inventory, Order Fulfilment, and Barcodes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#F5F0E6] p-1 rounded-xl border border-[#DDD7CA]">
                  {(['STANDARD', 'SENIOR', 'CUSTOM'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPreset(p);
                        if (p === 'STANDARD') {
                          setPermissions({
                            product: { view: true, create: true, update: true, delete: false, variants: true, images: true },
                            bulk: { bulkImport: true, bulkUpdate: true, bulkExport: true, bulkPriceUpdate: false, bulkStockUpdate: true, bulkBarcodeAssignment: true },
                            inventory: { view: true, add: true, update: true, adjust: false, transactions: true, bulkInventory: false },
                            orders: { view: true, process: true, picking: true, productVerification: true, quantityVerification: true, packing: true, evidence: true, package: true, handover: true },
                            barcode: { view: true, generate: true, assign: true, scan: true, print: true, bulkBarcode: true }
                          });
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        preset === p ? 'bg-[#172B82] text-white shadow-xs' : 'text-[#687085] hover:text-[#172033]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSavePermissions}
                  className="wn-btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Matrix</span>
                </motion.button>
              </div>
            </div>

            {/* Matrix Sections */}
            <div className="space-y-6">
              {/* Product permissions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#172B82] uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> Product & Catalog Permissions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'view', label: 'View Products' },
                    { key: 'create', label: 'Create New Product' },
                    { key: 'update', label: 'Update Product Details' },
                    { key: 'delete', label: 'Delete / Archive Product' },
                    { key: 'variants', label: 'Manage SKU Variants' },
                    { key: 'images', label: 'Upload Garment Images' }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-white cursor-pointer select-none text-xs font-semibold text-[#172033]"
                    >
                      <input
                        type="checkbox"
                        checked={(permissions.product as any)[item.key]}
                        onChange={() => handleTogglePermission('product', item.key)}
                        className="w-4 h-4 rounded text-[#172B82] border-[#DDD7CA] focus:ring-[#172B82]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bulk Operations */}
              <div className="space-y-2 pt-3 border-t border-[#DDD7CA]/60">
                <h4 className="text-xs font-bold text-[#172B82] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Bulk Operational Permissions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'bulkImport', label: 'Bulk Import Catalog' },
                    { key: 'bulkUpdate', label: 'Bulk Update Details' },
                    { key: 'bulkExport', label: 'Bulk Export SKU Data' },
                    { key: 'bulkPriceUpdate', label: 'Bulk Price Update' },
                    { key: 'bulkStockUpdate', label: 'Bulk Stock Update' },
                    { key: 'bulkBarcodeAssignment', label: 'Bulk Barcode Mapping' }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-white cursor-pointer select-none text-xs font-semibold text-[#172033]"
                    >
                      <input
                        type="checkbox"
                        checked={(permissions.bulk as any)[item.key]}
                        onChange={() => handleTogglePermission('bulk', item.key)}
                        className="w-4 h-4 rounded text-[#172B82] border-[#DDD7CA] focus:ring-[#172B82]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Fulfilment Permissions */}
              <div className="space-y-2 pt-3 border-t border-[#DDD7CA]/60">
                <h4 className="text-xs font-bold text-[#172B82] uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" /> Order Fulfilment & Packing Permissions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'view', label: 'View Orders List' },
                    { key: 'process', label: 'Process Order Steps' },
                    { key: 'picking', label: 'Order Picking Verification' },
                    { key: 'productVerification', label: 'Product Verification' },
                    { key: 'quantityVerification', label: 'Quantity Verification' },
                    { key: 'packing', label: 'Garment Packing' },
                    { key: 'evidence', label: 'Packing Evidence Photo' },
                    { key: 'package', label: 'Package Bagging' },
                    { key: 'handover', label: 'Handover to Logistics Captain' }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-white cursor-pointer select-none text-xs font-semibold text-[#172033]"
                    >
                      <input
                        type="checkbox"
                        checked={(permissions.orders as any)[item.key]}
                        onChange={() => handleTogglePermission('orders', item.key)}
                        className="w-4 h-4 rounded text-[#172B82] border-[#DDD7CA] focus:ring-[#172B82]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Barcode Tagging */}
              <div className="space-y-2 pt-3 border-t border-[#DDD7CA]/60">
                <h4 className="text-xs font-bold text-[#172B82] uppercase tracking-wider flex items-center gap-1.5">
                  <Barcode className="w-4 h-4" /> Barcode & Tagging Permissions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'view', label: 'View Barcode Tags' },
                    { key: 'generate', label: 'Generate EAN/UPC Barcodes' },
                    { key: 'assign', label: 'Assign Barcodes to Variants' },
                    { key: 'scan', label: 'Camera Barcode Scanning' },
                    { key: 'print', label: 'Print Price Tag Labels' },
                    { key: 'bulkBarcode', label: 'Bulk Barcode Printing' }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-white cursor-pointer select-none text-xs font-semibold text-[#172033]"
                    >
                      <input
                        type="checkbox"
                        checked={(permissions.barcode as any)[item.key]}
                        onChange={() => handleTogglePermission('barcode', item.key)}
                        className="w-4 h-4 rounded text-[#172B82] border-[#DDD7CA] focus:ring-[#172B82]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: TIMELINE ACTIVITY */}
        {activeTab === 'ACTIVITY' && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[#172033] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#172B82]" /> Chronological Activity Timeline
            </h3>

            <div className="relative pl-6 border-l-2 border-[#DDD7CA] space-y-6 my-4">
              {activities.map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#172B82] ring-4 ring-white" />
                  <div className="bg-[#FFFCF5] rounded-xl border border-[#DDD7CA] p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#172B82] uppercase tracking-wider">{act.action}</span>
                      <span className="text-[11px] text-[#687085]">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#172033] font-medium">{act.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT 4: LOGIN HISTORY */}
        {activeTab === 'LOGIN_HISTORY' && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[#172033] flex items-center gap-2">
              <History className="w-5 h-5 text-[#172B82]" /> Device & Login History Log
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E6] text-[#172033] font-bold border-y border-[#DDD7CA]">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Device</th>
                    <th className="py-3 px-4">Browser</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Session Duration</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD7CA]/60 font-medium">
                  {loginHistory.map((lh) => (
                    <tr key={lh.id} className="hover:bg-[#FFFCF5]">
                      <td className="py-3 px-4 text-[#172033]">{lh.date}, {lh.time}</td>
                      <td className="py-3 px-4">{lh.device}</td>
                      <td className="py-3 px-4 text-[#687085]">{lh.browser}</td>
                      <td className="py-3 px-4 font-mono text-[#172B82]">{lh.ip}</td>
                      <td className="py-3 px-4 text-[#687085]">{lh.sessionDuration}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          {lh.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT 5: PRODUCT ACTIVITY */}
        {activeTab === 'PRODUCT_ACTIVITY' && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-6 shadow-xs">
            <h3 className="font-bold text-base text-[#172033] flex items-center gap-2">
              <Barcode className="w-5 h-5 text-[#172B82]" /> Product & Barcode Activity Summary
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
              <div className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#DDD7CA]">
                <p className="text-2xl font-extrabold text-[#172033]">{productActivity.productsViewed}</p>
                <p className="text-xs text-[#687085] font-semibold mt-1">Products Viewed</p>
              </div>
              <div className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#DDD7CA]">
                <p className="text-2xl font-extrabold text-emerald-700">{productActivity.productsCreated}</p>
                <p className="text-xs text-[#687085] font-semibold mt-1">Products Created</p>
              </div>
              <div className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#DDD7CA]">
                <p className="text-2xl font-extrabold text-sky-700">{productActivity.productsUpdated}</p>
                <p className="text-xs text-[#687085] font-semibold mt-1">Products Updated</p>
              </div>
              <div className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#DDD7CA]">
                <p className="text-2xl font-extrabold text-indigo-700">{productActivity.variantsUpdated}</p>
                <p className="text-xs text-[#687085] font-semibold mt-1">Variants Updated</p>
              </div>
              <div className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#DDD7CA]">
                <p className="text-2xl font-extrabold text-amber-700">{productActivity.barcodesGenerated}</p>
                <p className="text-xs text-[#687085] font-semibold mt-1">Barcodes Tagged</p>
              </div>
              <div className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#DDD7CA]">
                <p className="text-2xl font-extrabold text-purple-700">{productActivity.bulkOperations}</p>
                <p className="text-xs text-[#687085] font-semibold mt-1">Bulk Operations</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 6: SECURITY */}
        {activeTab === 'SECURITY' && (
          <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-6 shadow-xs max-w-2xl">
            <h3 className="font-bold text-base text-[#172033] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#172B82]" /> Security Controls & Status
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-[#FFFCF5] rounded-2xl border border-[#DDD7CA] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#172033]">Account Access Status</h4>
                  <p className="text-[11px] text-[#687085]">Suspend or reactivate executive credentials</p>
                </div>
                <button
                  onClick={() => {
                    toggleExecutiveStatus(executive.id);
                    success('Status Changed', `${executive.name} status updated.`);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    executive.status === 'ACTIVE'
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  {executive.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
                </button>
              </div>

              <div className="p-4 bg-[#FFFCF5] rounded-2xl border border-[#DDD7CA] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#172033]">Reset Password</h4>
                  <p className="text-[11px] text-[#687085]">Generate new password for executive</p>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="wn-btn-secondary px-4 py-2 text-xs font-semibold"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Reset Modal */}
        <AnimatePresence>
          {isPasswordModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className="px-6 py-4 bg-[#172B82] text-white flex items-center justify-between">
                  <h3 className="font-bold text-base">Reset Executive Password</h3>
                  <button onClick={() => setIsPasswordModalOpen(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="wn-label">New Password *</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="wn-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="wn-label">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="wn-input text-xs"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="wn-btn-secondary px-4 py-2 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="wn-btn-primary px-5 py-2 text-xs font-semibold">
                      Save New Password
                    </button>
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

export default CatalogueExecutiveDetailPage;
