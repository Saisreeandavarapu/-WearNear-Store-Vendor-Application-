import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  Landmark,
  Image,
  ChevronRight,
  X
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const KycStatusPage: React.FC = () => {
  const { kycDocuments, uploadKycDoc } = useData();
  const { success } = useToast();

  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const approvedCount = kycDocuments.filter((d) => d.status === 'APPROVED').length;
  const isAllApproved = approvedCount === kycDocuments.length;

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUploadId || !selectedFileName) return;
    uploadKycDoc(activeUploadId, selectedFileName);
    success('Document Uploaded', 'Submitted document for Super Admin compliance verification.');
    setActiveUploadId(null);
    setSelectedFileName('');
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        <PageHeader
          title="KYC & Compliance Verification Status"
          subtitle="Track identity, GST registration, storefront photograph, and bank account proof verification."
          breadcrumbs={[
            { label: 'Store Management', path: '/vendor/dashboard' },
            { label: 'KYC Status' }
          ]}
        />

        {/* Verification Overview Banner */}
        <div
          className={`rounded-3xl p-6 text-white shadow-xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
            isAllApproved
              ? 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 border-emerald-500/30'
              : 'bg-gradient-to-r from-[#172B82] via-[#1E3A8A] to-[#0F172A] border-white/10'
          }`}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Store Status: ACTIVE & VERIFIED
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {isAllApproved ? '100% KYC Verification Complete' : 'KYC Verification in Progress'}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              All active store operations, order fulfillment, instant payout withdrawals, and catalog listings are enabled for verified partners.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center min-w-[140px] shrink-0">
            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Documents Status</p>
            <p className="text-2xl font-extrabold text-white mt-0.5">{approvedCount} / {kycDocuments.length} Verified</p>
          </div>
        </div>

        {/* Document Status List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#172B82]" /> Verified Compliance Documents
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {kycDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-[#DDD7CA] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center shrink-0 border border-[#172B82]/15">
                    {doc.type === 'IDENTITY' && <ShieldCheck className="w-6 h-6" />}
                    {doc.type === 'BUSINESS' && <FileText className="w-6 h-6" />}
                    {doc.type === 'STORE' && <Building2 className="w-6 h-6" />}
                    {doc.type === 'BANK' && <Landmark className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#172033]">{doc.title}</h4>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          doc.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'UNDER_REVIEW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#687085] mt-0.5">{doc.description}</p>
                    {doc.fileName && (
                      <p className="text-[11px] font-mono text-[#172B82] font-semibold mt-1">
                        File: {doc.fileName} ({doc.uploadedAt})
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 justify-end">
                  {doc.status === 'APPROVED' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveUploadId(doc.id)}
                      className="wn-btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Re-upload File</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Re-upload */}
        <AnimatePresence>
          {activeUploadId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className="px-6 py-4 bg-[#172B82] text-white flex items-center justify-between">
                  <h3 className="font-bold text-base">Re-upload Compliance Document</h3>
                  <button onClick={() => setActiveUploadId(null)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSimulateUpload} className="p-6 space-y-4">
                  <div>
                    <label className="wn-label">Document File Name / Path *</label>
                    <input
                      type="text"
                      required
                      value={selectedFileName}
                      onChange={(e) => setSelectedFileName(e.target.value)}
                      placeholder="e.g. updated_gst_certificate.pdf"
                      className="wn-input text-xs"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveUploadId(null)}
                      className="wn-btn-secondary px-4 py-2 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="wn-btn-primary px-5 py-2 text-xs font-semibold">
                      Submit for Review
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

export default KycStatusPage;
