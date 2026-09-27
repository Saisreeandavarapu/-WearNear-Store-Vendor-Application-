import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const OtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || '+91 98201 44520';
  const isRegister = searchParams.get('mode') === 'register';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0]?.focus();

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    setHasError(false);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    if (inputRefs.current[Math.min(pasted.length, 5)]) {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setHasError(true);
      error('Incomplete Code', 'Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    setTimeout(async () => {
      setIsVerifying(false);
      if (code === '000000') {
        setHasError(true);
        error('Invalid OTP', 'The code entered has expired or is incorrect.');
      } else {
        await login(target);
        success('Verification Successful', 'Store account verified securely.');
        if (isRegister) {
          navigate('/vendor/approval');
        } else {
          navigate('/vendor/dashboard');
        }
      }
    }, 700);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(45);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    success('OTP Sent', `A new 6-digit code was dispatched to ${target}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center p-3.5 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#DDD7CA] shadow-xl p-5 sm:p-8"
      >
        {/* Back Link */}
        <Link
          to="/vendor/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#687085] hover:text-[#172B82] mb-5 min-h-[36px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>

        {/* Brand Logo & Header */}
        <div className="text-center mb-5">
          <div className="inline-flex p-2.5 rounded-2xl bg-[#172B82]/5 border border-[#172B82]/15 mb-2.5">
            <img
              src="/image.png"
              alt="WearNear"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Verify Mobile Number
          </h2>
          <p className="text-xs text-[#687085] mt-1 leading-relaxed">
            We sent a 6-digit authentication code to
            <br />
            <strong className="text-[#172033]">{target}</strong>
          </p>
        </div>

        {/* 6-Digit Inputs: Responsive sizing to prevent overflow on 320px devices */}
        <form onSubmit={handleVerify}>
          <motion.div
            animate={hasError ? { x: [-8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="flex justify-center gap-1.5 sm:gap-2.5 my-5"
            onPaste={handlePaste}
          >
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border bg-[#FFFCF5] focus:outline-none transition-all duration-150 ${
                  hasError
                    ? 'border-[#DC2626] ring-2 ring-[#DC2626]/20'
                    : digit
                    ? 'border-[#172B82] bg-white ring-2 ring-[#172B82]/10 text-[#172B82]'
                    : 'border-[#DDD7CA] text-[#172033] focus:border-[#172B82] focus:ring-2 focus:ring-[#172B82]/20'
                }`}
              />
            ))}
          </motion.div>

          <p className="text-center text-[11px] text-[#687085] mb-5">
            Tip: You can paste any 6-digit code or enter digits directly.
          </p>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isVerifying}
            className="w-full wn-btn-primary py-3 min-h-[48px] text-sm font-semibold tracking-wide flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" /> Verifying Code...
              </>
            ) : (
              <>
                Verify & Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Resend & Change Number */}
        <div className="mt-5 pt-4 border-t border-[#DDD7CA] flex flex-col items-center gap-2 text-xs">
          {timer > 0 ? (
            <span className="text-[#687085]">
              Resend code in <strong className="text-[#172B82]">{timer}s</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-[#172B82] hover:underline min-h-[36px]"
            >
              Resend 6-Digit Code
            </button>
          )}

          <Link
            to="/vendor/login"
            className="text-[11px] text-[#687085] hover:text-[#172033]"
          >
            Entered wrong phone number? Change number
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
