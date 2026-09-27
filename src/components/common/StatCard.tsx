import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { CountUp } from './CountUp';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  highlight?: boolean;
  subValue?: string;
  badge?: string;
  numericEnd?: number;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  highlight = false,
  subValue,
  badge,
  numericEnd,
  prefix,
  suffix,
  isCurrency,
  onClick
}) => {
  const effectivePrefix = prefix ?? (isCurrency ? '₹' : undefined);
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`relative p-3.5 sm:p-5 rounded-xl border select-none transition-all duration-200 ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${
        highlight
          ? 'bg-gradient-to-br from-[#172B82] to-[#243FBA] text-white border-[#172B82] shadow-md shadow-[#172B82]/15'
          : 'bg-white border-[#DDD7CA] text-[#172033] hover:border-[#172B82]/30 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <span
          className={`text-xs font-semibold tracking-wide truncate ${
            highlight ? 'text-white/80' : 'text-[#687085]'
          }`}
        >
          {label}
        </span>
        <div
          className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
            highlight
              ? 'bg-white/15 text-white'
              : 'bg-[#172B82]/10 text-[#172B82]'
          }`}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
          {numericEnd !== undefined ? (
            <CountUp end={numericEnd} prefix={effectivePrefix} suffix={suffix} />
          ) : typeof value === 'number' ? (
            <CountUp end={value} prefix={effectivePrefix} suffix={suffix} />
          ) : (
            effectivePrefix ? `${effectivePrefix}${value}` : value
          )}
        </h3>
        {badge && (
          <span
            className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
              highlight
                ? 'bg-white/20 text-white'
                : 'bg-[#172B82]/10 text-[#172B82]'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {(trend || subValue) && (
        <div
          className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] sm:text-xs ${
            highlight ? 'border-white/10' : 'border-[#DDD7CA]/50'
          }`}
        >
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`font-semibold flex items-center ${
                  trend.isPositive
                    ? highlight
                      ? 'text-emerald-300'
                      : 'text-emerald-600'
                    : highlight
                    ? 'text-rose-300'
                    : 'text-rose-600'
                }`}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {trend.value}
              </span>
              <span className={highlight ? 'text-white/70' : 'text-[#687085]'}>
                {trend.label || 'vs last week'}
              </span>
            </div>
          )}
          {subValue && (
            <span
              className={`truncate font-medium ${
                highlight ? 'text-white/80' : 'text-[#687085]'
              }`}
            >
              {subValue}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
