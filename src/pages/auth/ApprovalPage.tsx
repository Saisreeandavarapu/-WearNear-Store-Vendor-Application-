import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Headphones,
  RotateCw
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useAuth } from '../../context/AuthContext';
import { StoreStatus } from '../../types';

export const ApprovalPage: React.FC = () => {
  const { store, updateStoreStatus } = useAuth();

  const statusConfigs: Record<
    StoreStatus,
    {
      icon: React.ComponentType<{ className?: string }>;
      colorClass: string;
      bgClass: string;
      title: string;
      subtitle: string;
      explanation: string;
      nextAction: { label: string; to: string };
    }
  > = {
    ACTIVE: {
      icon: CheckCircle2,
      colorClass: 'text-[#16A34A]',
      bgClass: 'bg-[#16A34A]/10 border-[#16A34A]/30',
      title: 'Store Activated & Operational',
      subtitle: 'Your boutique is live on the WearNear Hyperlocal marketplace.',
      explanation:
        'All compliance checks, store geo-location boundaries, and banking mandates are verified. You can now accept instant 30-minute delivery orders, manage products, and run store offers.',
      nextAction: { label: 'Go to Store Dashboard', to: '/vendor/dashboard' }
    },
    PENDING: {
      icon: Clock,
      colorClass: 'text-[#F59E0B]',
      bgClass: 'bg-[#F59E0B]/10 border-[#F59E0B]/30',
      title: 'Store Under Review',
      subtitle: 'Our Trust & Operations team is reviewing your uploaded documents.',
      explanation:
        'Verification usually takes 12-24 hours. A representative may inspect your physical storefront or verify GST credentials before dispatching the first WearNear Captain pickup kit.',
      nextAction: { label: 'Review KYC Documents', to: '/vendor/kyc' }
    },
    REJECTED: {
      icon: XCircle,
      colorClass: 'text-[#DC2626]',
      bgClass: 'bg-[#DC2626]/10 border-[#DC2626]/30',
      title: 'Action Required: Application Incomplete',
      subtitle: 'Additional information is required before approval can be granted.',
      explanation:
        'Your business registration certificate or physical address proof could not be verified. Please review the remarks on the KYC page and re-upload clear copies.',
      nextAction: { label: 'Update KYC Documents', to: '/vendor/kyc' }
    },
    SUSPENDED: {
      icon: AlertTriangle,
      colorClass: 'text-[#DC2626]',
      bgClass: 'bg-[#DC2626]/10 border-[#DC2626]/30',
      title: 'Store Temporarily Suspended',
      subtitle: 'Order receiving is currently paused for this location.',
      explanation:
        'Your store has been paused either due to scheduled maintenance, prolonged order cancellations, or pending inventory reconciliation.',
      nextAction: { label: 'Contact Merchant Support', to: '/vendor/support' }
    },
    BLOCKED: {
      icon: ShieldAlert,
      colorClass: 'text-[#DC2626]',
      bgClass: 'bg-[#DC2626]/10 border-[#DC2626]/30',
      title: 'Account Access Blocked',
      subtitle: 'Please contact WearNear Compliance Cell immediately.',
      explanation:
        'Commercial operations for this vendor account have been restricted due to policy violation or critical compliance notice.',
      nextAction: { label: 'Contact Support Helpdesk', to: '/vendor/support' }
    }
  };

  const current = statusConfigs[store.status];
  const Icon = current.icon;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center p-3.5 sm:p-6">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-[#DDD7CA] shadow-xl p-5 sm:p-10 text-center">
          {/* Brand header */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <img
              src="/image.png"
              alt="WearNear"
              className="w-8 h-8 object-contain bg-white rounded-lg p-0.5 border border-[#DDD7CA]"
            />
            <span className="font-extrabold text-sm text-[#172B82]">WearNear Store</span>
          </div>

          {/* Animated Status Icon */}
          <div className="flex justify-center mb-5">
            {store.status === 'ACTIVE' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${current.bgClass} flex items-center justify-center border`}
              >
                <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${current.colorClass}`} />
              </motion.div>
            ) : store.status === 'PENDING' ? (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${current.bgClass} flex items-center justify-center border`}
              >
                <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${current.colorClass}`} />
              </motion.div>
            ) : (
              <motion.div
                animate={{ x: [-4, 4, -3, 3, 0] }}
                transition={{ duration: 0.4 }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${current.bgClass} flex items-center justify-center border`}
              >
                <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${current.colorClass}`} />
              </motion.div>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            {current.title}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-[#172B82] mt-1">
            {store.name} • {current.subtitle}
          </p>

          <p className="text-xs text-[#687085] mt-3.5 leading-relaxed max-w-sm mx-auto">
            {current.explanation}
          </p>

          {/* Action button */}
          <div className="mt-6 space-y-2.5">
            <Link
              to={current.nextAction.to}
              className="w-full wn-btn-primary py-3 min-h-[46px] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>{current.nextAction.label}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/vendor/support"
              className="w-full wn-btn-secondary py-2.5 min-h-[44px] text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Headphones className="w-3.5 h-3.5 text-[#172B82]" />
              <span>Contact Partner Support</span>
            </Link>
          </div>

          {/* Dev Operational Status Switcher */}
          <div className="mt-6 pt-5 border-t border-[#DDD7CA] text-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#687085] mb-2">
              Preview Different Compliance States
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {(['ACTIVE', 'PENDING', 'REJECTED', 'SUSPENDED'] as StoreStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => updateStoreStatus(st)}
                  className={`px-2.5 py-1 min-h-[34px] rounded-lg text-[10px] font-bold transition-colors ${
                    store.status === st
                      ? 'bg-[#172B82] text-white'
                      : 'bg-[#FFFCF5] border border-[#DDD7CA] text-[#687085] hover:text-[#172033]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
