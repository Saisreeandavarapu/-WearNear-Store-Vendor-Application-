import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useToast } from '../../context/ToastContext';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || 'registered email/mobile';

  const [otp, setOtp] = useState(['5', '8', '2', '9', '1', '4']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((digit) => !digit)) {
      error('OTP Required', 'Please enter the complete 6-digit code.');
      return;
    }
    if (newPassword.length < 6) {
      error('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success('Password Reset Successful', 'Your store portal password has been updated.');
      navigate('/vendor/login');
    }, 1000);
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#172033] tracking-tight">Set New Password</h2>
            <p className="text-xs text-[#687085] leading-relaxed">
              Verification OTP sent to <span className="font-semibold text-[#172033]">{target}</span>
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            {/* OTP Input row */}
            <div>
              <label className="wn-label">6-Digit Verification OTP</label>
              <div className="grid grid-cols-6 gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-full text-center text-lg font-bold py-2 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] focus:bg-white focus:border-[#172B82] focus:ring-2 focus:ring-[#172B82]/20"
                  />
                ))}
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="wn-label">New Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="wn-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#687085]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="wn-label">Confirm New Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="wn-input"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full wn-btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Updating Password...' : 'Reset Password & Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ResetPasswordPage;
