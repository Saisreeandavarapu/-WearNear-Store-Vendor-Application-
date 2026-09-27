import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let bgClass = 'bg-[#172B82]/10 text-[#172B82] border-[#172B82]/20';
  let dotClass = 'bg-[#172B82]';
  let label = status.replace(/_/g, ' ');

  switch (normalized) {
    case 'ACTIVE':
    case 'COMPLETED':
    case 'DELIVERED':
    case 'PAID':
    case 'HEALTHY':
    case 'APPROVED':
    case 'REFUNDED':
    case 'VIP':
      bgClass = 'bg-[#16A34A]/10 text-[#15803D] border-[#16A34A]/30';
      dotClass = 'bg-[#16A34A]';
      break;

    case 'NEW':
    case 'PENDING':
    case 'UNDER_REVIEW':
    case 'SCHEDULED':
    case 'WAITING_FOR_USER':
      bgClass = 'bg-[#F59E0B]/15 text-[#B45309] border-[#F59E0B]/35';
      dotClass = 'bg-[#F59E0B]';
      break;

    case 'ACCEPTED':
    case 'PREPARING':
    case 'READY_FOR_PICKUP':
    case 'PICKED_UP':
    case 'IN_PROGRESS':
    case 'PROCESSING':
    case 'OPEN':
      bgClass = 'bg-[#172B82]/10 text-[#172B82] border-[#172B82]/30';
      dotClass = 'bg-[#172B82] animate-pulse';
      break;

    case 'LOW_STOCK':
      bgClass = 'bg-[#F59E0B]/15 text-[#B45309] border-[#F59E0B]/30';
      dotClass = 'bg-[#F59E0B]';
      break;

    case 'OUT_OF_STOCK':
    case 'CANCELLED':
    case 'REJECTED':
    case 'SUSPENDED':
    case 'BLOCKED':
    case 'FAILED':
      bgClass = 'bg-[#DC2626]/10 text-[#B91C1C] border-[#DC2626]/30';
      dotClass = 'bg-[#DC2626]';
      break;

    case 'NOT_UPLOADED':
    case 'INACTIVE':
    case 'CLOSED':
    case 'EXPIRED':
      bgClass = 'bg-[#687085]/10 text-[#475569] border-[#687085]/20';
      dotClass = 'bg-[#687085]';
      break;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold rounded-lg',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold rounded-lg'
  };

  return (
    <span
      className={`inline-flex items-center border capitalize tracking-wide select-none ${sizeClasses[size]} ${bgClass} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />}
      <span>{label.toLowerCase()}</span>
    </span>
  );
};
