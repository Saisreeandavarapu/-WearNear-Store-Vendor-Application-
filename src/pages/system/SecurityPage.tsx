import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Smartphone, Key, Laptop, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useToast } from '../../context/ToastContext';

export const SecurityPage: React.FC = () => {
  const { success } = useToast();

  const [is2faEnabled, setIs2faEnabled] = useState(true);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass) return;
    setOldPass('');
    setNewPass('');
    success('Password Changed', 'Your merchant credentials were updated securely.');
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-20 sm:pb-0">
        <PageHeader
          title="Security & Active Sessions"
          subtitle="Manage authentication credentials, 2-factor OTP protection, and active device logins."
          breadcrumbs={[{ label: 'System' }, { label: 'Security' }]}
        />

        {/* Password Change Card */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-7 shadow-xs space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5 flex items-center gap-2">
            <Key className="w-4 h-4 text-[#172B82]" />
            <span>Change Store Password</span>
          </h3>

          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
            <div>
              <label className="wn-label">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="wn-input"
              />
            </div>
            <div>
              <label className="wn-label">New Password</label>
              <input
                type="password"
                placeholder="Min 8 characters"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="wn-input"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end pt-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full sm:w-auto wn-btn-primary text-xs min-h-[44px] px-5"
              >
                Update Password
              </motion.button>
            </div>
          </form>
        </div>

        {/* 2FA Section */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#172033]">
                Two-Factor OTP Authentication
              </h4>
              <p className="text-[11px] sm:text-xs text-[#687085] mt-0.5">
                Require instant SMS OTP code on every new browser sign-in
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
            <input
              type="checkbox"
              checked={is2faEnabled}
              onChange={() => {
                setIs2faEnabled(!is2faEnabled);
                success('2FA Updated', `Two-factor authentication is now ${!is2faEnabled ? 'active' : 'disabled'}.`);
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#DDD7CA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#172B82]"></div>
          </label>
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-6 shadow-xs space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5 flex items-center gap-2">
            <Laptop className="w-4 h-4 text-[#172B82]" />
            <span>Active Login Devices & Sessions</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#FFFCF5] border border-[#DDD7CA] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-[#172B82]" />
                <div>
                  <p className="font-bold text-[#172033]">Boutique Counter Terminal (MacBook Pro)</p>
                  <p className="text-[11px] text-[#687085]">Chrome 128 • Mumbai, Bandra West • Active Now</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                This Device
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#DDD7CA] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#687085]" />
                <div>
                  <p className="font-bold text-[#172033]">Store Manager iPhone 15 Pro</p>
                  <p className="text-[11px] text-[#687085]">WearNear Vendor App • Last active 42 mins ago</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => success('Session Terminated', 'Logged out iPhone 15 Pro.')}
                className="text-[11px] font-semibold text-[#DC2626] hover:underline"
              >
                Revoke
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
