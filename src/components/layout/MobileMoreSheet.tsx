import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  X,
  Store,
  FileCheck,
  FileText,
  Users,
  Grid,
  Tag,
  Maximize2,
  Palette,
  Wallet,
  Landmark,
  BarChart3,
  TrendingUp,
  RotateCcw,
  RefreshCw,
  CreditCard,
  Percent,
  Star,
  Bell,
  HelpCircle,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({ isOpen, onClose }) => {
  const { store, logout } = useAuth();

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 400) {
      onClose();
    }
  };

  const groups = [
    {
      title: 'STORE & COMPLIANCE',
      items: [
        { label: 'Store Profile', path: '/vendor/store-profile', icon: Store, desc: 'Store details & visual gallery' },
        { label: 'KYC Verification', path: '/vendor/kyc', icon: FileCheck, desc: 'Identity, GST & bank docs' },
        { label: 'Staff Management', path: '/vendor/staff', icon: Users, desc: 'Team access & permissions' }
      ]
    },
    {
      title: 'CATALOG & ATTRIBUTES',
      items: [
        { label: 'Categories', path: '/vendor/categories', icon: Grid, desc: 'Fashion taxonomy & counts' },
        { label: 'Brands', path: '/vendor/brands', icon: Tag, desc: 'Partner brands & tiering' },
        { label: 'Sizes', path: '/vendor/sizes', icon: Maximize2, desc: 'Standard sizing matrix' },
        { label: 'Colors', path: '/vendor/colors', icon: Palette, desc: 'Palette swatches' }
      ]
    },
    {
      title: 'FINANCE & PAYOUTS',
      items: [
        { label: 'Billing & Invoices', path: '/vendor/billing', icon: FileText, desc: 'GST invoice generation' },
        { label: 'Store Wallet', path: '/vendor/wallet', icon: Wallet, desc: 'Live earnings & balance' },
        { label: 'Settlements', path: '/vendor/settlements', icon: Landmark, desc: 'Bank payout cycles & UTR' }
      ]
    },
    {
      title: 'ANALYTICS & INSIGHTS',
      items: [
        { label: 'Sales Reports', path: '/vendor/reports', icon: BarChart3, desc: 'Revenue, orders & trends' },
        { label: 'Product Performance', path: '/vendor/reports/products', icon: TrendingUp, desc: 'Top sellers & low performers' }
      ]
    },
    {
      title: 'OPERATIONS & CUSTOMER CARE',
      items: [
        { label: 'Returns', path: '/vendor/returns', icon: RotateCcw, desc: 'Return requests & inspection' },
        { label: 'Exchanges', path: '/vendor/exchanges', icon: RefreshCw, desc: 'Size & color replacements' },
        { label: 'Refunds', path: '/vendor/refunds', icon: CreditCard, desc: 'Disbursements status' },
        { label: 'Offers & Discounts', path: '/vendor/offers', icon: Percent, desc: 'Promotions & seasonal sales' },
        { label: 'Customer Reviews', path: '/vendor/reviews', icon: Star, desc: 'Product & store feedback' }
      ]
    },
    {
      title: 'SYSTEM & SECURITY',
      items: [
        { label: 'Notifications', path: '/vendor/notifications', icon: Bell, desc: 'Operational alerts' },
        { label: 'Help & Support Desk', path: '/vendor/support', icon: HelpCircle, desc: 'Tickets & live agent chat' },
        { label: 'Settings', path: '/vendor/settings', icon: Settings, desc: 'Store preferences' },
        { label: 'Security & Sessions', path: '/vendor/security', icon: ShieldCheck, desc: 'Password & active devices' }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#172033]/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className="relative w-full bg-[#FFFCF5] rounded-t-3xl border-t border-[#DDD7CA] shadow-2xl z-10 max-h-[85vh] flex flex-col"
          >
            {/* Grab handle bar */}
            <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-[#DDD7CA]" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 border-b border-[#DDD7CA] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/image.png"
                  alt="WearNear"
                  className="w-8 h-8 rounded-lg border border-[#DDD7CA] bg-white p-0.5 object-contain"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#172033] leading-tight">
                    {store.name}
                  </h3>
                  <p className="text-[11px] text-[#687085] leading-none">
                    More Management Modules
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg text-[#687085] hover:text-[#172033] hover:bg-[#F5F0E6] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Module Lists */}
            <div className="overflow-y-auto p-4 space-y-5 flex-1 overscroll-contain">
              {groups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1.5">
                  <p className="text-[10px] font-bold text-[#687085] uppercase tracking-wider px-1">
                    {group.title}
                  </p>
                  <div className="bg-white rounded-xl border border-[#DDD7CA] divide-y divide-[#DDD7CA]/50 overflow-hidden shadow-xs">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={onClose}
                          className="flex items-center justify-between p-3.5 hover:bg-[#F5F0E6] active:bg-[#F5F0E6] transition-colors group min-h-[50px]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#172B82]/5 border border-[#172B82]/15 flex items-center justify-center text-[#172B82] group-hover:bg-[#172B82] group-hover:text-white transition-colors shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#172033] group-hover:text-[#172B82] transition-colors">
                                {item.label}
                              </p>
                              <p className="text-[10px] text-[#687085] line-clamp-1">{item.desc}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#687085]/60 group-hover:text-[#172B82] group-hover:translate-x-0.5 transition-all" />
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Logout CTA */}
              <div className="pt-2 pb-6">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3.5 bg-white border border-[#DC2626]/30 text-[#DC2626] font-semibold text-xs rounded-xl shadow-xs hover:bg-rose-50 transition-colors min-h-[46px]"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out from {store.name}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
