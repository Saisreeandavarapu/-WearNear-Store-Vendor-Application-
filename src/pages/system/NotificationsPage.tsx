import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  ShoppingBag,
  AlertTriangle,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
  const { success } = useToast();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filtered = notifications.filter(
    (n) => activeFilter === 'ALL' || n.type === activeFilter
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_ORDER':
        return <ShoppingBag className="w-4 h-4 text-[#172B82]" />;
      case 'LOW_STOCK':
      case 'OUT_OF_STOCK':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
      case 'SETTLEMENT':
      case 'PAYMENT':
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#172B82]" />;
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Notifications & Operational Alerts"
          subtitle="Real-time alerts regarding new orders, safety stock thresholds, and bank settlements."
          breadcrumbs={[{ label: 'System' }, { label: 'Notifications' }]}
          actions={
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                markAllNotificationsAsRead();
                success('All Read', 'Marked all operational alerts as read.');
              }}
              className="wn-btn-secondary text-xs sm:text-sm"
            >
              <CheckCheck className="w-4 h-4 text-[#172B82]" />
              <span className="hidden sm:inline">Mark All as Read</span>
              <span className="sm:hidden">Mark Read</span>
            </motion.button>
          }
        />

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {[
            { val: 'ALL', label: 'All Alerts' },
            { val: 'NEW_ORDER', label: 'Orders' },
            { val: 'LOW_STOCK', label: 'Inventory' },
            { val: 'SETTLEMENT', label: 'Settlements' }
          ].map((f) => (
            <button
              key={f.val}
              onClick={() => setActiveFilter(f.val)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors min-h-[34px] ${
                activeFilter === f.val
                  ? 'bg-[#172B82] text-white shadow-xs'
                  : 'bg-white border border-[#DDD7CA] text-[#687085] hover:text-[#172033]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification Cards List */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-2.5"
        >
          {filtered.map((n) => (
            <motion.div
              key={n.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.actionUrl) navigate(n.actionUrl);
              }}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                !n.isRead
                  ? 'bg-white border-[#172B82]/30 shadow-xs'
                  : 'bg-[#FFFCF5] border-[#DDD7CA] opacity-80'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#172B82]/10 flex items-center justify-center shrink-0">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#172033] truncate">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-[#687085] shrink-0 font-medium">{n.timestamp}</span>
                </div>
                <p className="text-xs text-[#687085] mt-0.5 leading-relaxed">{n.message}</p>
              </div>

              {n.actionUrl && (
                <ArrowRight className="w-4 h-4 text-[#172B82] shrink-0 self-center hidden sm:block" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  );
};
