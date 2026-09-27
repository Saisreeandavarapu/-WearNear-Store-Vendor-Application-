import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Landmark,
  TrendingUp,
  Clock,
  Download,
  Loader2
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { CountUp } from '../../components/common/CountUp';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const WalletPage: React.FC = () => {
  const { walletBalance, walletTransactions } = useData();
  const { store } = useAuth();
  const { success } = useToast();

  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  const handleWithdraw = () => {
    setIsRequestingPayout(true);
    setTimeout(() => {
      setIsRequestingPayout(false);
      success(
        'Payout Requested',
        `₹${walletBalance.available.toLocaleString('en-IN')} payout initiated to HDFC Bank A/c ending 9824.`
      );
    }, 700);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Store Wallet & Financial Balance"
          subtitle="Live earnings from completed garment deliveries, platform fee deductions, and bank payouts."
          breadcrumbs={[{ label: 'Finance' }, { label: 'Store Wallet' }]}
          actions={
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={isRequestingPayout || walletBalance.available <= 0}
              onClick={handleWithdraw}
              className="wn-btn-primary text-xs sm:text-sm"
            >
              {isRequestingPayout ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Landmark className="w-3.5 h-3.5" />
              )}
              {isRequestingPayout ? 'Processing...' : 'Request Instant Payout'}
            </motion.button>
          }
        />

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Available Balance */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-[#172B82] to-[#243FBA] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-[#172B82] space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">Available for Payout</span>
              <Wallet className="w-5 h-5 text-white/80" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              <CountUp end={walletBalance.available} prefix="₹" />
            </h2>
            <p className="text-[11px] text-white/70 truncate">
              Linked: {store.bankDetails.bankName} (•••• {store.bankDetails.accountNumber.slice(-4)})
            </p>
          </motion.div>

          {/* Pending Clearance */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#687085]">In Clearance / Escrow</span>
              <Clock className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              <CountUp end={walletBalance.pending} prefix="₹" />
            </h2>
            <p className="text-[11px] text-[#687085]">
              Released 24h after doorstep delivery
            </p>
          </motion.div>

          {/* Lifetime Earnings */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#687085]">Cumulative Net Earnings</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              <CountUp end={walletBalance.totalEarnings} prefix="₹" />
            </h2>
            <p className="text-[11px] text-emerald-600 font-semibold">
              All-time completed orders volume
            </p>
          </motion.div>
        </div>

        {/* Transaction Ledger Table */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-5 border-b border-[#DDD7CA] flex items-center justify-between bg-[#FFFCF5]">
            <div>
              <h3 className="text-xs sm:text-base font-bold text-[#172033]">
                Wallet Ledger Transactions
              </h3>
              <p className="text-[10px] sm:text-xs text-[#687085]">
                Credits for deliveries & debits for commission or withdrawals
              </p>
            </div>
            <button
              onClick={() => success('Export Ready', 'Ledger statement exported as CSV.')}
              className="wn-btn-secondary text-xs min-h-[36px]"
            >
              <Download className="w-3.5 h-3.5 text-[#172B82]" />
              <span className="hidden sm:inline">Statement (.csv)</span>
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E6] text-[#687085] uppercase text-[10px] tracking-wider border-b border-[#DDD7CA]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Activity Type</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD7CA]/60">
                {walletTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FFFCF5]">
                    <td className="py-3 px-4 text-[#687085] font-medium">{tx.date}</td>
                    <td className="py-3 px-4 font-semibold text-[#172033]">{tx.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#172B82]">
                      {tx.orderNumber || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.isCredit
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tx.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-extrabold text-sm ${tx.isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.isCredit ? `+₹${tx.amount.toLocaleString('en-IN')}` : `-₹${tx.amount.toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#172033]">
                      ₹{tx.balanceAfter.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Ledger Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="md:hidden divide-y divide-[#DDD7CA]/60"
          >
            {walletTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                variants={staggerItem}
                whileTap={{ scale: 0.99 }}
                className="p-3.5 space-y-1.5 text-xs select-none"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#172033]">{tx.description}</span>
                  <span
                    className={`font-bold text-sm ${
                      tx.isCredit ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.isCredit ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#687085]">
                  <span>{tx.date}</span>
                  <span className="font-mono">Balance: ₹{tx.balanceAfter.toLocaleString('en-IN')}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};
