import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Store,
  Building2,
  FileCheck,
  CreditCard,
  Users,
  Bell,
  ShieldCheck,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useAuth } from '../../context/AuthContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const SettingsPage: React.FC = () => {
  const { store, logout } = useAuth();

  const settingsLinks = [
    { title: 'Store Profile & Showcase', desc: 'Operating hours, boutique photos & brand presence', icon: Store, to: '/vendor/store-profile' },
    { title: 'Business & Legal Entity', desc: `GSTIN: ${store.gstin}, PAN & trade certificates`, icon: Building2, to: '/vendor/kyc' },
    { title: 'KYC & Document Verification', desc: 'Identity, store establishment & license proofs', icon: FileCheck, to: '/vendor/kyc' },
    { title: 'Bank Settlement Details', desc: `${store.bankDetails.bankName} (•••• ${store.bankDetails.accountNumber.slice(-4)})`, icon: CreditCard, to: '/vendor/settlements' },
    { title: 'Staff Access & Permissions', desc: 'Grant employee login roles and matrix rights', icon: Users, to: '/vendor/staff' },
    { title: 'Notification Alerts', desc: 'Order SMS alerts, low stock reminders, and sounds', icon: Bell, to: '/vendor/notifications' },
    { title: 'Security & Device Sessions', desc: 'Change password, 2FA OTP, active logins', icon: ShieldCheck, to: '/vendor/security' },
    { title: 'Support Helpdesk & Tickets', desc: 'Contact merchant relations team', icon: HelpCircle, to: '/vendor/support' }
  ];

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-20 sm:pb-0">
        <PageHeader
          title="Store Settings & Configuration"
          subtitle="Manage boutique master settings, financial authorizations, and security preferences."
          breadcrumbs={[{ label: 'System' }, { label: 'Settings' }]}
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="bg-white rounded-2xl border border-[#DDD7CA] divide-y divide-[#DDD7CA]/60 shadow-xs overflow-hidden"
        >
          {settingsLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={idx} variants={staggerItem}>
                <Link
                  to={item.to}
                  className="p-3.5 sm:p-5 flex items-center justify-between hover:bg-[#FFFCF5] active:bg-[#FFFCF5] transition-colors group min-h-[56px]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#172B82]/5 border border-[#172B82]/15 flex items-center justify-center text-[#172B82] group-hover:bg-[#172B82] group-hover:text-white transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#172033] group-hover:text-[#172B82] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[#687085] mt-0.5 line-clamp-1">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#687085]/60 group-hover:text-[#172B82] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Logout CTA */}
        <div className="pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-3.5 sm:p-4 bg-white border border-[#DC2626]/30 text-[#DC2626] font-semibold text-xs sm:text-sm rounded-2xl shadow-xs hover:bg-rose-50 transition-colors min-h-[48px]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out from Store Portal ({store.name})
          </motion.button>
        </div>
      </div>
    </AnimatedPage>
  );
};
