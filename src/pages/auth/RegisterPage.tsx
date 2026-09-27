import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  User,
  Building2,
  FileText,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  MapPin,
  Check,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

import { AnimatedPage } from '../../components/common/AnimatedPage';

export const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { success, warning } = useToast();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Store
    storeName: 'Elegance Haute Studio',
    category: "Women's Ethnic & Fusion",
    phone: '+91 98200 44102',
    email: 'contact@elegancehaute.com',
    operatingHours: '10:30 AM - 09:00 PM',
    // Step 2: Owner
    ownerName: 'Simran Khurana',
    ownerPhone: '+91 98200 44102',
    ownerEmail: 'simran.k@gmail.com',
    // Step 3: Business & Location
    businessType: 'Proprietorship',
    gstin: '27AAECF8921J1Z2',
    panNumber: 'AAECF8921J',
    street: 'Shop 2, Crystal Plaza, Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    // Step 4: Documents
    aadhaarUploaded: true,
    gstCertificateUploaded: true,
    storefrontImageUploaded: true,
    // Step 5: Bank Details
    accountNumber: '50200088921004',
    ifscCode: 'HDFC0000128',
    bankName: 'HDFC Bank',
    accountHolder: 'Elegance Haute Studio'
  });

  const steps = [
    { num: 1, label: 'Store', icon: Store },
    { num: 2, label: 'Owner', icon: User },
    { num: 3, label: 'Business', icon: Building2 },
    { num: 4, label: 'Documents', icon: FileText },
    { num: 5, label: 'Bank', icon: CreditCard },
    { num: 6, label: 'Review', icon: CheckCircle }
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      success('Application Submitted!', 'Store registered successfully. Proceeding to phone verification.');
      navigate(`/vendor/otp?target=${encodeURIComponent(formData.phone)}&mode=register`);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatedPage className="min-h-screen bg-[#F5F0E6] py-6 px-3.5 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-3xl mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/vendor/login" className="inline-flex items-center gap-2 mb-2">
            <img
              src="/image.png"
              alt="WearNear"
              className="w-9 h-9 object-contain bg-white rounded-xl p-1 border border-[#DDD7CA]"
            />
            <span className="text-lg font-extrabold text-[#172B82]">WearNear</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033]">
            Partner Store Onboarding
          </h1>
          <p className="text-xs text-[#687085] mt-0.5">
            Join the WearNear Hyperlocal Fashion Network in 6 simple steps
          </p>
        </div>

        {/* Progress Bar / Steps indicator */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-3 sm:p-5 shadow-xs mb-6">
          <div className="grid grid-cols-6 gap-1 relative">
            {steps.map((s) => {
              const Icon = s.icon;
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      isDone
                        ? 'bg-[#16A34A] text-white'
                        : isCurrent
                        ? 'bg-[#172B82] text-white ring-4 ring-[#172B82]/20'
                        : 'bg-[#F5F0E6] text-[#687085] border border-[#DDD7CA]'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3px]" /> : <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1 font-medium truncate max-w-full ${
                      isCurrent ? 'text-[#172B82] font-bold' : 'text-[#687085]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {/* Step 1: Store Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-[#DDD7CA] pb-3 mb-4">
                    <h3 className="text-base font-bold text-[#172033]">01. Store Details</h3>
                    <p className="text-xs text-[#687085]">How your boutique will appear to shoppers on WearNear</p>
                  </div>

                  <div>
                    <label className="wn-label">Store / Boutique Name</label>
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="wn-input"
                      placeholder="e.g. Elegance Haute Studio"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="wn-label">Primary Fashion Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="wn-input"
                      >
                        <option>Women's Ethnic & Fusion</option>
                        <option>Men's Tailored & Casuals</option>
                        <option>Streetwear & Denim</option>
                        <option>Luxury Leather & Footwear</option>
                      </select>
                    </div>

                    <div>
                      <label className="wn-label">Operating Hours</label>
                      <input
                        type="text"
                        value={formData.operatingHours}
                        onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                        className="wn-input"
                        placeholder="10:00 AM - 09:30 PM"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="wn-label">Store Contact Phone</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="wn-input"
                      />
                    </div>
                    <div>
                      <label className="wn-label">Store Orders Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="wn-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Owner Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-[#DDD7CA] pb-3 mb-4">
                    <h3 className="text-base font-bold text-[#172033]">02. Owner / Partner Details</h3>
                    <p className="text-xs text-[#687085]">Designated administrator for banking and legal authorisations</p>
                  </div>

                  <div>
                    <label className="wn-label">Owner Full Name</label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="wn-input"
                      placeholder="As per PAN card"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="wn-label">Mobile Number (For OTP Verification)</label>
                      <input
                        type="tel"
                        value={formData.ownerPhone}
                        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                        className="wn-input"
                      />
                    </div>
                    <div>
                      <label className="wn-label">Personal Email</label>
                      <input
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                        className="wn-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Business Information & Physical Address */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-[#DDD7CA] pb-3 mb-4">
                    <h3 className="text-base font-bold text-[#172033]">03. Business Entity & Location</h3>
                    <p className="text-xs text-[#687085]">Used for WearNear Captain pickup routing and GST invoice generation</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="wn-label">Constitution of Business</label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="wn-input"
                      >
                        <option>Proprietorship</option>
                        <option>Partnership</option>
                        <option>Pvt Ltd</option>
                        <option>LLP</option>
                      </select>
                    </div>
                    <div>
                      <label className="wn-label">GSTIN Number</label>
                      <input
                        type="text"
                        value={formData.gstin}
                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                        className="wn-input uppercase"
                      />
                    </div>
                    <div>
                      <label className="wn-label">PAN Number</label>
                      <input
                        type="text"
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                        className="wn-input uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="wn-label">Street Address & Landmark</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="wn-input"
                      placeholder="Shop number, building, prominent landmark"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="wn-label">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="wn-input"
                      />
                    </div>
                    <div>
                      <label className="wn-label">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="wn-input"
                      />
                    </div>
                    <div>
                      <label className="wn-label">Pincode</label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="wn-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Documents Upload */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-[#DDD7CA] pb-3 mb-4">
                    <h3 className="text-base font-bold text-[#172033]">04. KYC Documents</h3>
                    <p className="text-xs text-[#687085]">Upload digital copies for fast-track verification within 24 hours</p>
                  </div>

                  {[
                    { label: 'Identity Proof (Aadhaar / Passport)', desc: 'Clear front and back PDF or JPG', done: formData.aadhaarUploaded },
                    { label: 'GST REG-06 Registration Certificate', desc: 'Government issued registration certificate', done: formData.gstCertificateUploaded },
                    { label: 'Physical Storefront Image', desc: 'Showing shop sign board clearly for captain arrival', done: formData.storefrontImageUploaded }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-[#172033]">{doc.label}</p>
                        <p className="text-[11px] text-[#687085]">{doc.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {doc.done ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-1 rounded-lg border border-[#16A34A]/20">
                            <Check className="w-3.5 h-3.5" /> Uploaded
                          </span>
                        ) : (
                          <button className="wn-btn-secondary text-xs py-1.5 px-3">
                            <Upload className="w-3.5 h-3.5" /> Upload
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 5: Bank Details */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-[#DDD7CA] pb-3 mb-4">
                    <h3 className="text-base font-bold text-[#172033]">05. Bank Payout Details</h3>
                    <p className="text-xs text-[#687085]">Settlements are deposited directly into this business bank account</p>
                  </div>

                  <div>
                    <label className="wn-label">Bank Account Holder Name</label>
                    <input
                      type="text"
                      value={formData.accountHolder}
                      onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                      className="wn-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="wn-label">Account Number</label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="wn-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="wn-label">IFSC Code</label>
                      <input
                        type="text"
                        value={formData.ifscCode}
                        onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                        className="wn-input font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="wn-label">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="wn-input"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Review Application */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="border-b border-[#DDD7CA] pb-3 mb-4">
                    <h3 className="text-base font-bold text-[#172033]">06. Review & Submit Application</h3>
                    <p className="text-xs text-[#687085]">Verify your store profile before submitting for OTP signoff</p>
                  </div>

                  <div className="bg-[#FFFCF5] p-4 rounded-xl border border-[#DDD7CA] space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[#DDD7CA]">
                      <span className="text-[#687085]">Store Name</span>
                      <span className="font-bold text-[#172033]">{formData.storeName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-[#DDD7CA]">
                      <span className="text-[#687085]">Owner</span>
                      <span className="font-semibold text-[#172033]">{formData.ownerName} ({formData.phone})</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-[#DDD7CA]">
                      <span className="text-[#687085]">GSTIN</span>
                      <span className="font-mono text-[#172033]">{formData.gstin}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-[#DDD7CA]">
                      <span className="text-[#687085]">Pickup Location</span>
                      <span className="font-medium text-[#172033] text-right">{formData.street}, {formData.city} - {formData.pincode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#687085]">Bank Payout A/c</span>
                      <span className="font-mono font-semibold text-[#172B82]">{formData.bankName} (•••• {formData.accountNumber.slice(-4)})</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#172B82]/5 rounded-xl border border-[#172B82]/20 flex items-start gap-2 text-xs text-[#172B82]">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      By submitting, you agree to the WearNear Merchant Agreement and acknowledge our standard 12.5% commission on completed sales.
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 pt-5 border-t border-[#DDD7CA] flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="wn-btn-secondary text-xs sm:text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <Link
                to="/vendor/login"
                className="text-xs font-semibold text-[#687085] hover:text-[#172B82]"
              >
                Cancel and return to Login
              </Link>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="wn-btn-primary text-xs sm:text-sm ml-auto"
            >
              <span>{currentStep === 6 ? 'Submit Application' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
