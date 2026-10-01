import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  FileText,
  CreditCard,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const BusinessProfilePage: React.FC = () => {
  const { businessProfile, updateBusinessProfile } = useData();
  const { success } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(businessProfile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(formData);
    success('Business Profile Updated', 'Saved company details, GST, and banking records.');
    setIsEditing(false);
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 pb-12 max-w-5xl mx-auto">
        <PageHeader
          title="Business Profile & Compliance"
          subtitle="Legal merchant identity, GSTIN registration, tax records, and payout bank account."
          breadcrumbs={[
            { label: 'Store Management', path: '/vendor/dashboard' },
            { label: 'Business Profile' }
          ]}
          action={{
            label: isEditing ? 'Cancel Editing' : 'Edit Business Profile',
            onClick: () => setIsEditing(!isEditing),
            icon: isEditing ? X : Edit,
            variant: isEditing ? 'secondary' : 'primary'
          }}
        />

        {/* Status Callout Banner */}
        <div className="bg-gradient-to-r from-[#172B82] via-[#1E3A8A] to-[#0F172A] rounded-3xl p-6 text-white shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Verified Merchant Compliance
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {businessProfile.legalName}
            </h2>
            <p className="text-xs sm:text-sm text-white/80">
              Trade Name: <span className="font-semibold text-white">{businessProfile.tradeName}</span> · GSTIN: <span className="font-mono text-amber-300 font-bold">{businessProfile.gstin}</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center min-w-[140px] shrink-0">
            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">KYC Status</p>
            <p className="text-xl font-extrabold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>{businessProfile.kycStatus}</span>
            </p>
          </div>
        </div>

        {isEditing ? (
          /* EDIT FORM */
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-6 shadow-xs">
              <h3 className="font-bold text-base text-[#172033] border-b border-[#DDD7CA] pb-3">
                Legal Entity & Tax Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="wn-label">Legal Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="wn-input"
                  />
                </div>
                <div>
                  <label className="wn-label">Trade / Store Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.tradeName}
                    onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                    className="wn-input"
                  />
                </div>
                <div>
                  <label className="wn-label">GSTIN Registration Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="wn-input uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="wn-label">PAN Card Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                    className="wn-input uppercase font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-6 shadow-xs">
              <h3 className="font-bold text-base text-[#172033] border-b border-[#DDD7CA] pb-3">
                Bank Payout Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="wn-label">Account Holder Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.bankDetails.accountHolder}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, accountHolder: e.target.value }
                    })}
                    className="wn-input"
                  />
                </div>
                <div>
                  <label className="wn-label">Bank Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.bankDetails.bankName}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, bankName: e.target.value }
                    })}
                    className="wn-input"
                  />
                </div>
                <div>
                  <label className="wn-label">Account Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, accountNumber: e.target.value }
                    })}
                    className="wn-input font-mono"
                  />
                </div>
                <div>
                  <label className="wn-label">IFSC Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.bankDetails.ifscCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, ifscCode: e.target.value }
                    })}
                    className="wn-input uppercase font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="wn-btn-secondary px-5 py-3 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="wn-btn-primary px-8 py-3 text-xs font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Business Profile</span>
              </button>
            </div>
          </form>
        ) : (
          /* READ-ONLY VIEW */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Entity Card */}
              <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-[#DDD7CA]">
                  <div className="w-10 h-10 rounded-xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#172033]">Company Identity</h3>
                    <p className="text-xs text-[#687085]">Registered legal structure</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#687085]">Legal Name:</span>
                    <span className="font-bold text-[#172033]">{businessProfile.legalName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#687085]">Trade Name:</span>
                    <span className="font-bold text-[#172033]">{businessProfile.tradeName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#687085]">Entity Type:</span>
                    <span className="font-bold text-[#172B82] bg-[#172B82]/10 px-2 py-0.5 rounded">
                      {businessProfile.businessType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#687085]">Authorized Signatory:</span>
                    <span className="font-semibold text-[#172033]">{businessProfile.authorizedSignatory}</span>
                  </div>
                </div>
              </div>

              {/* Tax & GSTIN Card */}
              <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-[#DDD7CA]">
                  <div className="w-10 h-10 rounded-xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#172033]">Tax & GST Compliance</h3>
                    <p className="text-xs text-[#687085]">Registered tax identification</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#687085]">GSTIN Number:</span>
                    <span className="font-mono font-bold text-[#172B82]">{businessProfile.gstin}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#687085]">PAN Card:</span>
                    <span className="font-mono font-bold text-[#172033]">{businessProfile.panNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#687085]">Registration Date:</span>
                    <span className="font-medium text-[#172033]">{businessProfile.taxRegistrationDate}</span>
                  </div>
                </div>
              </div>

              {/* Bank Settlement Account */}
              <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs md:col-span-2">
                <div className="flex items-center gap-3 pb-3 border-b border-[#DDD7CA]">
                  <div className="w-10 h-10 rounded-xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#172033]">Settlement Bank Account</h3>
                    <p className="text-xs text-[#687085]">Bank details for automated payouts</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-[#F5F0E6] p-3.5 rounded-xl border border-[#DDD7CA]">
                    <span className="text-[#687085] block font-medium">Bank Name</span>
                    <span className="font-bold text-[#172033] text-sm">{businessProfile.bankDetails.bankName}</span>
                  </div>
                  <div className="bg-[#F5F0E6] p-3.5 rounded-xl border border-[#DDD7CA]">
                    <span className="text-[#687085] block font-medium">Account Holder</span>
                    <span className="font-bold text-[#172033] text-sm">{businessProfile.bankDetails.accountHolder}</span>
                  </div>
                  <div className="bg-[#F5F0E6] p-3.5 rounded-xl border border-[#DDD7CA]">
                    <span className="text-[#687085] block font-medium">Account Number</span>
                    <span className="font-mono font-bold text-[#172B82] text-sm">{businessProfile.bankDetails.accountNumber}</span>
                  </div>
                  <div className="bg-[#F5F0E6] p-3.5 rounded-xl border border-[#DDD7CA]">
                    <span className="text-[#687085] block font-medium">IFSC Code</span>
                    <span className="font-mono font-bold text-[#172033] text-sm">{businessProfile.bankDetails.ifscCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default BusinessProfilePage;
