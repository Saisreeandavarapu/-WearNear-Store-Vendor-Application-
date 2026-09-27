import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Calendar
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const { success } = useToast();

  const reportMetrics = [
    { label: 'Weekly Gross GMV', value: '₹2,60,600', numericEnd: 260600, prefix: '₹', trend: '+18.4%' },
    { label: 'Units Delivered', value: '115 Garments', numericEnd: 115, suffix: ' Garments', trend: '+12.1%' },
    { label: 'Average Order Value', value: '₹2,266', numericEnd: 2266, prefix: '₹', trend: '+5.2%' },
    { label: 'Return Rate', value: '2.1%', trend: '-0.8%' }
  ];

  const categoryBreakdown = [
    { name: "Men's Shirts & Kurtas", share: 38, sales: '₹99,028', color: '#172B82' },
    { name: "Women's Ethnic & Sarees", share: 32, sales: '₹83,392', color: '#243FBA' },
    { name: 'Trousers & Denim', share: 18, sales: '₹46,908', color: '#3155D8' },
    { name: 'Footwear & Mules', share: 12, sales: '₹31,272', color: '#F59E0B' }
  ];

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Store Intelligence & Performance Reports"
          subtitle="Analyze GMV trends, category demand velocity, and localized consumer preferences."
          breadcrumbs={[{ label: 'Analytics' }, { label: 'Reports' }]}
          actions={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#DDD7CA] text-xs">
                {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-colors min-h-[34px] ${
                      period === p
                        ? 'bg-[#172B82] text-white shadow-xs'
                        : 'text-[#687085] hover:text-[#172033]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => success('Report Exported', 'Full store analytics report exported as PDF.')}
                className="wn-btn-secondary text-xs sm:text-sm min-h-[36px]"
              >
                <Download className="w-3.5 h-3.5 text-[#172B82]" />
                <span className="hidden sm:inline">Export PDF</span>
              </motion.button>
            </div>
          }
        />

        {/* Top Metric Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4"
        >
          {reportMetrics.map((m, idx) => (
            <motion.div
              key={m.label}
              variants={staggerItem}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs select-none"
            >
              <span className="text-xs font-semibold text-[#687085] truncate block mb-1">
                {m.label}
              </span>
              <h3 className="text-lg sm:text-2xl font-bold text-[#172033] tracking-tight">
                {m.value}
              </h3>
              <div className="mt-2 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span>{m.trend}</span>
                <span className="text-[#687085] font-normal">vs prev {period}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Category Contribution Section */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDD7CA] pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                Category Sales Velocity & Mix
              </h3>
              <p className="text-xs text-[#687085]">Distribution of retail revenue across boutique taxonomy</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="font-semibold text-[#172033]">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#172033]">{cat.sales}</span>
                    <span className="text-[#687085] font-mono text-[11px] w-8 text-right">{cat.share}%</span>
                  </div>
                </div>

                <div className="w-full bg-[#F5F0E6] h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.share}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
