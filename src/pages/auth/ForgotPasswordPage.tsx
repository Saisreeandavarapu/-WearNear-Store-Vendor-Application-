import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Smartphone, ArrowRight, ArrowLeft, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('vikram@vogueloom.com');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      error('Input required', 'Please provide your registered mobile number or email.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success('OTP Sent', `A 6-digit verification code was sent to ${identifier}.`);
      navigate(`/vendor/reset-password?target=${encodeURIComponent(identifier)}`);
    }, 1000);
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/vendor/login" className="p-2 rounded-xl bg-[#F5F0E6] text-[#687085] hover:text-[#172033]">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider text-[#687085]">
              Account Recovery
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#172033] tracking-tight">Forgot Password?</h2>
            <p className="text-xs text-[#687085] leading-relaxed">
              Enter your registered mobile number or business email to receive a password reset OTP.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="wn-label">Registered Mobile / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#687085]">
                  {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter mobile or email"
                  className="wn-input pl-10"
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full wn-btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending Code...' : 'Send Reset Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ForgotPasswordPage;
