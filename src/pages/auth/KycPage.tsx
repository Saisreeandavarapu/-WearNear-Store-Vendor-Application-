import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Camera,
  Image,
  FolderOpen,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Loader2,
  X
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BottomSheet } from '../../components/common/BottomSheet';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { KycDocument } from '../../types';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const KycPage: React.FC = () => {
  const { kycDocuments, uploadKycDoc } = useData();
  const { success } = useToast();

  const [activeDocForUpload, setActiveDocForUpload] = useState<KycDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSimulateUpload = (method: string) => {
    if (!activeDocForUpload) return;
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      const mockName = `${activeDocForUpload.type.toLowerCase()}_verified_${Date.now().toString().slice(-4)}.pdf`;
      uploadKycDoc(activeDocForUpload.id, mockName);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setActiveDocForUpload(null);
        success('Document Uploaded', `${activeDocForUpload.title} submitted for compliance review via ${method}.`);
      }, 350);
    }, 700);
  };

  const approvedCount = kycDocuments.filter((d) => d.status === 'APPROVED').length;

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Store KYC & Compliance"
          subtitle="Upload verified business and bank credentials to maintain active merchant status on WearNear."
          breadcrumbs={[{ label: 'KYC & Verification' }]}
          badge={
            <StatusBadge
              status={approvedCount === kycDocuments.length ? 'APPROVED' : 'UNDER_REVIEW'}
              size="md"
            />
          }
        />

        {/* Verification Summary Banner */}
        <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-[#DDD7CA] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#172B82]/10 border border-[#172B82]/20 flex items-center justify-center text-[#172B82] shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-base font-bold text-[#172033]">
                Merchant Compliance: {approvedCount} of {kycDocuments.length} Verified
              </h3>
              <p className="text-[11px] sm:text-xs text-[#687085] mt-0.5">
                Documents are reviewed by WearNear Trust & Safety compliance team within 24 hours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="w-28 sm:w-32 bg-[#DDD7CA]/40 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(approvedCount / kycDocuments.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="bg-[#16A34A] h-full rounded-full"
              />
            </div>
            <span className="text-xs font-bold text-[#172033]">
              {Math.round((approvedCount / kycDocuments.length) * 100)}%
            </span>
          </div>
        </div>

        {/* KYC Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
        >
          {kycDocuments.map((doc) => (
            <motion.div
              key={doc.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#172B82]/5 border border-[#172B82]/15 flex items-center justify-center text-[#172B82]">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <StatusBadge status={doc.status} size="sm" />
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#172033]">{doc.title}</h4>
                <p className="text-[11px] sm:text-xs text-[#687085] mt-1 leading-relaxed">{doc.description}</p>

                <div className="mt-2.5 py-1.5 px-2.5 rounded-lg bg-[#FFFCF5] border border-[#DDD7CA] text-[10px] sm:text-[11px] text-[#687085] flex items-center justify-between">
                  <span>Format: {doc.requiredFileTypes}</span>
                  {doc.uploadedAt && <span>Uploaded {doc.uploadedAt}</span>}
                </div>

                {doc.fileName && (
                  <div className="mt-2 text-xs font-mono text-[#172B82] truncate">
                    📎 {doc.fileName}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#DDD7CA] flex items-center justify-between">
                <span className="text-[11px] text-[#687085]">
                  {doc.status === 'APPROVED' ? 'Verified' : 'Action Required'}
                </span>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveDocForUpload(doc)}
                  className={`text-xs font-semibold px-3 py-1.5 min-h-[36px] rounded-lg transition-colors flex items-center gap-1.5 ${
                    doc.status === 'APPROVED'
                      ? 'wn-btn-secondary opacity-70'
                      : 'wn-btn-primary'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  {doc.status === 'NOT_UPLOADED' ? 'Upload Document' : 'Replace Document'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Upload Bottom Sheet (Mobile & Desktop Accessible) */}
        <BottomSheet
          isOpen={!!activeDocForUpload}
          onClose={() => {
            if (!isUploading) setActiveDocForUpload(null);
          }}
          title={activeDocForUpload?.title || 'Upload Document'}
          subtitle={activeDocForUpload ? `Attach ${activeDocForUpload.requiredFileTypes}` : undefined}
        >
          {isUploading ? (
            <div className="p-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#172B82]/10 text-[#172B82] flex items-center justify-center mx-auto">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#172033]">Uploading Document...</h4>
                <p className="text-xs text-[#687085] mt-0.5">Encrypting and uploading to compliance server</p>
              </div>
              <div className="w-full bg-[#F5F0E6] h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[#172B82] h-full rounded-full"
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-[#172B82]">{uploadProgress}%</span>
            </div>
          ) : (
            <div className="space-y-2.5 py-1">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSimulateUpload('Camera')}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-[#DDD7CA] hover:border-[#172B82] bg-white hover:bg-[#FFFCF5] active:bg-[#FFFCF5] text-left transition-colors min-h-[56px]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#172B82]/10 flex items-center justify-center text-[#172B82] shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#172033]">Take Photo / Use Camera</p>
                  <p className="text-[11px] text-[#687085]">Instant photo capture with device camera</p>
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSimulateUpload('Gallery')}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-[#DDD7CA] hover:border-[#172B82] bg-white hover:bg-[#FFFCF5] active:bg-[#FFFCF5] text-left transition-colors min-h-[56px]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#172B82]/10 flex items-center justify-center text-[#172B82] shrink-0">
                  <Image className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#172033]">Choose from Photo Gallery</p>
                  <p className="text-[11px] text-[#687085]">Select existing image from phone gallery</p>
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSimulateUpload('Files / PDF')}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-[#DDD7CA] hover:border-[#172B82] bg-white hover:bg-[#FFFCF5] active:bg-[#FFFCF5] text-left transition-colors min-h-[56px]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#172B82]/10 flex items-center justify-center text-[#172B82] shrink-0">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#172033]">Browse Files / PDF Document</p>
                  <p className="text-[11px] text-[#687085]">Upload certified PDF or scanned certificate</p>
                </div>
              </motion.button>
            </div>
          )}
        </BottomSheet>
      </div>
    </AnimatedPage>
  );
};
