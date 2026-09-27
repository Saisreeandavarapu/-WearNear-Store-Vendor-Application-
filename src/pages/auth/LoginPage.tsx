import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Smartphone, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('vikram@vogueloom.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      error('Input required', 'Please provide your registered mobile number or email.');
      return;
    }

    if (isOtpMode) {
      navigate(`/vendor/otp?target=${encodeURIComponent(identifier)}`);
      return;
    }

    setLoading(true);
    try {
      await login(identifier, password);
      success('Welcome back!', 'Authenticated into Vogue Loom Studio portal.');
      navigate('/vendor/dashboard');
    } catch (err) {
      error('Login failed', 'Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center p-3 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#DDD7CA] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* DESKTOP LEFT: Premium Fashion-Store Visual */}
          <div className="hidden lg:flex lg:col-span-5 relative bg-[#172B82] text-white p-8 flex-col justify-between overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#3155D8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#172B82] via-[#172B82]/85 to-transparent z-10" />
            
            <img
              src="/assets/boutique_store.png"
              alt="WearNear Fashion Store"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
            />

            {/* Top Brand Info */}
            <div className="relative z-20">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl w-fit">
                <img
                  src="/image.png"
                  alt="WearNear"
                  className="w-7 h-7 object-contain bg-white rounded-lg p-0.5"
                />
                <div>
                  <span className="font-extrabold text-sm tracking-tight text-white block leading-tight">
                    WearNear
                  </span>
                  <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                    Merchant Network
                  </span>
                </div>
              </div>
            </div>

            {/* Center Fashion Store Value Prop */}
            <div className="relative z-20 space-y-4 my-auto py-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-[#F5F0E6]">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Hyperlocal Fashion Commerce
              </div>
              <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-snug">
                Elevate your boutique into an instant 30-minute delivery destination.
              </h2>
              <p className="text-xs text-white/80 leading-relaxed max-w-sm">
                Manage inventory, live orders, logistics captain dispatches, GST billing and settlements in one unified workspace.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  'Instant pickup by certified WearNear Captains',
                  'Zero dead-inventory: Sync store counter & app stock',
                  'Transparent weekly settlements & instant wallet'
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Security Assurance */}
            <div className="relative z-20 flex items-center gap-2 text-[11px] text-white/60 pt-4 border-t border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit Encrypted Merchant Gateway</span>
            </div>
          </div>

          {/* RIGHT: Login Form (Desktop & Mobile) */}
          <div className="lg:col-span-7 p-5 sm:p-10 md:p-12 flex flex-col justify-between bg-[#FFFCF5]">
            {/* Header */}
            <div>
              {/* Mobile Logo View */}
              <div className="flex items-center gap-3 mb-6 lg:hidden">
                <img
                  src="/image.png"
                  alt="WearNear"
                  className="w-10 h-10 object-contain bg-white rounded-xl p-1 border border-[#DDD7CA]"
                />
                <div>
                  <h1 className="text-base font-extrabold text-[#172B82] leading-tight">
                    WearNear
                  </h1>
                  <p className="text-xs text-[#687085]">Store / Vendor Portal</p>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#687085] bg-[#F5F0E6] px-2.5 py-1 rounded-md border border-[#DDD7CA]">
                  Store Partner Access
                </span>
                <Link
                  to="/vendor/approval"
                  className="text-xs font-semibold text-[#172B82] hover:underline"
                >
                  Check Approval Status →
                </Link>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-[#687085] mt-1.5 max-w-md">
                Manage your store, products and orders from one place.
              </p>

              {/* Form */}
              <form onSubmit={handleLogin} className="mt-6 sm:mt-8 space-y-4">
                <div>
                  <label className="wn-label">
                    Mobile Number / Business Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#687085]">
                      {identifier.includes('@') ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <Smartphone className="w-4 h-4" />
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter phone or business email"
                      className="wn-input pl-10"
                    />
                  </div>
                </div>

                {!isOtpMode ? (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="wn-label mb-0">Password</label>
                      <a
                        href="#forgot"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsOtpMode(true);
                        }}
                        className="text-xs font-semibold text-[#172B82] hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#687085]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter account password"
                        className="wn-input pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#687085] hover:text-[#172033]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#172B82]/5 border border-[#172B82]/20 text-xs text-[#172B82]">
                    We will send a 6-digit one-time passcode to your mobile or email.
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#687085]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#172B82] border-[#DDD7CA] focus:ring-[#172B82]"
                    />
                    <span>Remember me on this browser</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full wn-btn-primary py-3 min-h-[48px] text-sm font-semibold tracking-wide flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      'Signing In...'
                    ) : isOtpMode ? (
                      <>
                        <span>Get 6-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      'Login to Store Dashboard'
                    )}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsOtpMode(!isOtpMode)}
                    className="w-full wn-btn-secondary py-2.5 min-h-[44px] text-xs font-semibold"
                  >
                    {isOtpMode ? 'Use Password Instead' : 'Login with OTP'}
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[#DDD7CA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-[#687085]">
                New Store Partner?{' '}
                <Link
                  to="/vendor/register"
                  className="font-bold text-[#172B82] hover:underline"
                >
                  Create Store Account
                </Link>
              </span>
              <Link
                to="/vendor/kyc"
                className="text-[#687085] hover:text-[#172B82] transition-colors"
              >
                Resume KYC Documents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
