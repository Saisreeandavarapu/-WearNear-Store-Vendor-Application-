import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
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
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-lg bg-[#FFFCF5] rounded-t-2xl sm:rounded-2xl border-t sm:border border-[#DDD7CA] shadow-sheet z-10 max-h-[88vh] flex flex-col pb-safe"
          >
            {/* Grab handle indicator */}
            <div className="w-full flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-[#DDD7CA]" />
            </div>

            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#DDD7CA]">
              <div>
                {title && <h3 className="text-base font-bold text-[#172033]">{title}</h3>}
                {subtitle && <p className="text-xs text-[#687085]">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[#687085] hover:text-[#172033] hover:bg-[#F5F0E6] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
