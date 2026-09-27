import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-xl border border-dashed border-[#DDD7CA] my-4">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#172B82]/5 border border-[#172B82]/15 flex items-center justify-center text-[#172B82] mb-3.5">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[#172033]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#687085] mt-1 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-3">
        {actionLabel && onAction && (
          <button onClick={onAction} className="wn-btn-primary text-xs sm:text-sm">
            {actionLabel}
          </button>
        )}
        {secondaryAction}
      </div>
    </div>
  );
};
