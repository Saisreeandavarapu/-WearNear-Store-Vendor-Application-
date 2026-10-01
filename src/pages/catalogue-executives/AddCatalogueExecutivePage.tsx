import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlus,
  ShieldCheck,
  Lock,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Package,
  Layers,
  ShoppingBag,
  Barcode,
  Sparkles
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { PermissionPreset } from '../../types';

export const AddCatalogueExecutivePage: React.FC = () => {
  const { catalogueExecutives, maxActiveExecutivesLimit, addCatalogueExecutive } = useData();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preset, setPreset] = useState<PermissionPreset>('STANDARD');
  const [role, setRole] = useState<'Catalogue Executive' | 'Senior Executive' | 'Fulfilment Lead'>('Catalogue Executive');
  const [loading, setLoading] = useState(false);

  const activeCount = catalogueExecutives.filter((e) => e.status === 'ACTIVE').length;
  const isLimitReached = activeCount >= maxActiveExecutivesLimit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) {
      error('Limit Reached', 'Cannot add executive. Your active executive quota of 3 is full.');
      return;
    }

    setLoading(true);
    try {
      const created = addCatalogueExecutive({
        name,
        phone,
        email,
        preset,
        role
      });
      success('Catalogue Executive Added', `Created ${created.name} (${created.employeeId}) with ${preset} permission preset.`);
      navigate('/vendor/catalogue-executives');
    } catch (err: any) {
      error('Creation Failed', err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        <PageHeader
          title="Add Catalogue Executive"
          subtitle="Create credentials and assign granular catalogue, barcode, and order picking permissions."
          breadcrumbs={[
            { label: 'Catalogue Executives', path: '/vendor/catalogue-executives' },
            { label: 'Add Executive' }
          ]}
        />

        {isLimitReached ? (
          <div className="bg-amber-50 rounded-3xl border border-amber-200 p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-amber-950">Active Executive Limit Reached (3 / 3 Active)</h3>
              <p className="text-xs text-amber-800 max-w-md mx-auto">
                You currently have 3 active Catalogue Executives assigned to your store. To add more team members, request an increase from the Super Admin.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link to="/vendor/catalogue-executives" className="wn-btn-secondary px-5 py-2.5 text-xs">
                Back to Executives
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-[#DDD7CA]">
                <div className="w-10 h-10 rounded-xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#172033]">Executive Account Details</h3>
                  <p className="text-xs text-[#687085]">Personal details and assigned store role</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="wn-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="wn-input"
                  />
                </div>

                <div>
                  <label className="wn-label">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="wn-input"
                  />
                </div>

                <div>
                  <label className="wn-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@store.com"
                    className="wn-input"
                  />
                </div>

                <div>
                  <label className="wn-label">Store Designation *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="wn-select"
                  >
                    <option value="Catalogue Executive">Catalogue Executive</option>
                    <option value="Senior Executive">Senior Executive</option>
                    <option value="Fulfilment Lead">Fulfilment Lead</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Permission Preset Matrix Selector */}
            <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-[#DDD7CA]">
                <div className="w-10 h-10 rounded-xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#172033]">Select Permission Preset</h3>
                  <p className="text-xs text-[#687085]">Control operational capabilities for this executive</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* STANDARD PRESET */}
                <div
                  onClick={() => setPreset('STANDARD')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    preset === 'STANDARD'
                      ? 'border-[#172B82] bg-[#172B82]/5 ring-2 ring-[#172B82]/20'
                      : 'border-[#DDD7CA] hover:border-[#172B82]/50 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#172033]">STANDARD PRESET</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-[#687085] mt-1.5 leading-relaxed">
                    Product view/create/edit, barcode scanning, label printing, stock inwarding, order picking, and packing. Cannot delete products or edit store settings.
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#DDD7CA]/50 space-y-1 text-[11px] text-[#172033]">
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Full Catalogue & Barcode Tagging</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Stock Inward & Transactions</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Order Picking & Package Verification</div>
                  </div>
                </div>

                {/* SENIOR PRESET */}
                <div
                  onClick={() => setPreset('SENIOR')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    preset === 'SENIOR'
                      ? 'border-[#172B82] bg-[#172B82]/5 ring-2 ring-[#172B82]/20'
                      : 'border-[#DDD7CA] hover:border-[#172B82]/50 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#172033]">SENIOR PRESET</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      Extended Access
                    </span>
                  </div>
                  <p className="text-xs text-[#687085] mt-1.5 leading-relaxed">
                    Includes all Standard permissions plus product archiving, manual inventory stock adjustments, bulk imports, and price updates.
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#DDD7CA]/50 space-y-1 text-[11px] text-[#172033]">
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> All Standard Permissions</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Product Archiving & Delete</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Manual Stock Adjustments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link to="/vendor/catalogue-executives" className="wn-btn-secondary px-5 py-3 text-xs font-semibold">
                Cancel
              </Link>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="wn-btn-primary px-8 py-3 text-xs font-semibold flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating Executive...' : 'Create Catalogue Executive'}</span>
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </AnimatedPage>
  );
};

export default AddCatalogueExecutivePage;
