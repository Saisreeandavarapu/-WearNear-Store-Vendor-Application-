import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download,
  RefreshCw,
  FileText,
  Sparkles
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { useToast } from '../../context/ToastContext';
import { buttonTapVariants, cardInteractiveVariants, modalVariants } from '../../utils/animations';

export const InventoryImportPage: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { success } = useToast();
  const navigate = useNavigate();

  const previewItems = [
    { sku: 'VL-MSK-01-BLU-S', name: 'Pure Mulberry Silk Festive Kurta', qty: 25, price: 3299, valid: true },
    { sku: 'RS-DNM-08-32', name: '14oz Raw Japanese Selvedge', qty: 15, price: 2899, valid: true },
    { sku: 'US-LNN-22-M', name: 'French Linen Button-Down Shirt', qty: 30, price: 1799, valid: true },
    { sku: 'ERR-INV-001', name: 'Unknown Garment Identifier', qty: 0, price: 0, valid: false, err: 'Missing required SKU tag' }
  ];

  const handleSimulateUpload = (name: string) => {
    setFileName(name);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('preview');
      success('File Validated', `${name} parsed successfully. 3 valid SKUs, 1 warning.`);
    }, 750);
  };

  const handleConfirmImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      success('Import Complete', '70 units added across 3 garment SKUs.');
    }, 800);
  };

  return (
    <AnimatedPage className="space-y-6">
      <PageHeader
        title="Batch Inventory Import"
        subtitle="Bulk update product stock and catalog listings via Excel (.xlsx) or CSV spreadsheet."
        breadcrumbs={[
          { label: 'Inventory', path: '/vendor/inventory' },
          { label: 'Bulk Import' }
        ]}
        actions={
          <motion.button
            variants={buttonTapVariants}
            whileTap="tap"
            onClick={() => success('Template downloaded', 'WearNear_Inventory_Template.xlsx ready.')}
            className="wn-btn-secondary text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#172B82]" /> <span>Download Excel Template</span>
          </motion.button>
        }
      />

      {/* Stepper Wizard Indicator */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DDD7CA] flex items-center justify-between sm:justify-around text-xs shadow-xs">
        <div className={`flex items-center gap-2 ${step === 'upload' ? 'font-bold text-[#172B82]' : 'text-[#16A34A]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'upload' ? 'bg-[#172B82] text-white' : 'bg-emerald-100 text-emerald-800'}`}>1</span>
          <span className="text-[11px] sm:text-xs">Upload</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#687085]" />
        <div className={`flex items-center gap-2 ${step === 'preview' ? 'font-bold text-[#172B82]' : step === 'success' ? 'text-[#16A34A]' : 'text-[#687085]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'preview' ? 'bg-[#172B82] text-white' : step === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-black/5 text-[#687085]'}`}>2</span>
          <span className="text-[11px] sm:text-xs">Preview</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#687085]" />
        <div className={`flex items-center gap-2 ${step === 'success' ? 'font-bold text-[#16A34A]' : 'text-[#687085]'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'success' ? 'bg-emerald-600 text-white' : 'bg-black/5 text-[#687085]'}`}>3</span>
          <span className="text-[11px] sm:text-xs">Done</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Upload Zone */}
        {step === 'upload' && (
          <motion.div
            key="upload"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white p-6 sm:p-12 rounded-3xl border-2 border-dashed border-[#DDD7CA] hover:border-[#172B82] transition-colors text-center flex flex-col items-center justify-center shadow-xs"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#172B82]/5 border border-[#172B82]/20 flex items-center justify-center text-[#172B82] mb-4">
              <FileSpreadsheet className="w-8 h-8" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#172033]">
              Drag & drop your store inventory file here
            </h3>
            <p className="text-xs text-[#687085] mt-1 max-w-sm mb-6">
              Supports .xlsx, .xls and .csv files up to 15MB. Ensure column headers match the WearNear template.
            </p>

            {isProcessing && (
              <div className="w-full max-w-xs mb-6 space-y-2">
                <div className="h-2 w-full bg-[#F5F0E6] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.7 }}
                    className="h-full bg-[#172B82] rounded-full"
                  />
                </div>
                <p className="text-[11px] text-[#687085]">Parsing spreadsheet data...</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
              <motion.button
                variants={buttonTapVariants}
                whileTap="tap"
                disabled={isProcessing}
                onClick={() => handleSimulateUpload('VogueLoom_Stock_Batch_Sep26.xlsx')}
                className="wn-btn-primary text-xs sm:text-sm py-3 px-6 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Choose File to Upload</span>
              </motion.button>
              <motion.button
                variants={buttonTapVariants}
                whileTap="tap"
                onClick={() => handleSimulateUpload('Demo_Sample_Fashion_Feed.csv')}
                className="wn-btn-secondary text-xs sm:text-sm py-3 px-6"
              >
                Use Demo Feed (.csv)
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Validate & Preview */}
        {step === 'preview' && (
          <motion.div
            key="preview"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white rounded-3xl border border-[#DDD7CA] p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD7CA] gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#172B82]" />
                  <span>File Preview: {fileName}</span>
                </h3>
                <p className="text-xs text-[#687085] mt-0.5">Review matched catalog items before applying to live store</p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 self-start sm:self-auto">
                1 Invalid Row Excluded
              </span>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Garment Name</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD7CA]/50">
                  {previewItems.map((row, idx) => (
                    <tr key={idx} className={row.valid ? 'hover:bg-[#FFFCF5]' : 'bg-rose-50/50'}>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#172033]">{row.sku}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#172033]">{row.name}</td>
                      <td className="py-2.5 px-3 font-bold">{row.qty}</td>
                      <td className="py-2.5 px-3">₹{row.price}</td>
                      <td className="py-2.5 px-3">
                        {row.valid ? (
                          <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                          </span>
                        ) : (
                          <span className="text-rose-700 text-xs font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {row.err}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-2.5">
              {previewItems.map((row, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border ${row.valid ? 'bg-[#FFFCF5] border-[#DDD7CA]' : 'bg-rose-50/60 border-rose-200'} space-y-1.5 text-xs`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-[#172033]">{row.name}</span>
                    <span className="font-extrabold text-xs">{row.qty} pcs</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#687085]">
                    <span className="font-mono text-[#172B82] font-semibold">{row.sku}</span>
                    <span>₹{row.price}</span>
                  </div>
                  <div className="pt-1.5 border-t border-[#DDD7CA]/60 flex items-center gap-1">
                    {row.valid ? (
                      <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Valid for import
                      </span>
                    ) : (
                      <span className="text-rose-700 text-[11px] font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {row.err}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#DDD7CA] flex flex-col sm:flex-row justify-between items-center gap-2.5">
              <button
                onClick={() => setStep('upload')}
                className="wn-btn-secondary text-xs w-full sm:w-auto"
              >
                Re-upload File
              </button>
              <motion.button
                variants={buttonTapVariants}
                whileTap="tap"
                disabled={isProcessing}
                onClick={handleConfirmImport}
                className="wn-btn-primary text-xs w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Confirm & Apply 70 Units</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <motion.div
            key="success"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white rounded-3xl border border-[#DDD7CA] p-8 sm:p-10 text-center space-y-4 max-w-lg mx-auto shadow-xs"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>
            <h3 className="text-lg font-bold text-[#172033]">Batch Import Successful</h3>
            <p className="text-xs text-[#687085] leading-relaxed">
              Your physical shelf quantities have been synced with the WearNear live app catalog.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2">
              <Link to="/vendor/inventory" className="wn-btn-primary text-xs">
                Go to Inventory Health
              </Link>
              <button
                onClick={() => setStep('upload')}
                className="wn-btn-secondary text-xs"
              >
                Import Another File
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

