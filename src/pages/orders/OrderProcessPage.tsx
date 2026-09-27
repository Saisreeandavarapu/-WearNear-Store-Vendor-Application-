import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { OrderStatus } from '../../types';

export const OrderProcessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrderStatus } = useData();
  const { success } = useToast();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="text-center py-16">
        <h3 className="text-base font-bold text-[#172033]">Order Not Found</h3>
        <Link to="/vendor/orders" className="wn-btn-primary text-xs mt-3 inline-flex">
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'NEW', label: 'Order Received', desc: 'Customer placed order via WearNear app' },
    { status: 'ACCEPTED', label: 'Accepted by Boutique', desc: 'Garments verified in inventory' },
    { status: 'PREPARING', label: 'Packing in Progress', desc: 'Folded & bagged with security seal' },
    { status: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Counter handover ready for Captain' },
    { status: 'PICKED_UP', label: 'Captain Dispatched', desc: 'In-transit to customer address' }
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 1;

  const handleAdvanceStep = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (activeIndex < steps.length - 1) {
        const nextStatus = steps[activeIndex + 1].status;
        updateOrderStatus(order.id, nextStatus);
        success('Order Progressed', `Order status updated to ${nextStatus.replace(/_/g, ' ')}.`);
      } else {
        success('Pickup Handover Complete', 'Captain has departed for customer delivery.');
        navigate('/vendor/orders');
      }
    }, 450);
  };

  const progressPercentage = Math.round(((activeIndex + 1) / steps.length) * 100);

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto pb-20 sm:pb-0">
        <PageHeader
          title={`Order Processing: ${order.orderNumber}`}
          subtitle="Step-by-step visual fulfillment pipeline from receipt to Captain handover."
          breadcrumbs={[
            { label: 'Orders', path: '/vendor/orders' },
            { label: order.orderNumber, path: `/vendor/orders/${order.id}` },
            { label: 'Fulfillment' }
          ]}
        />

        {/* Main Flow Card */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#DDD7CA]">
            <div>
              <span className="text-xs font-mono font-bold text-[#172B82]">
                {order.orderNumber}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#172033] mt-0.5">
                {order.customer.name} • {order.itemCount} Garment(s)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#172B82]/10 text-[#172B82]">
                Step {activeIndex + 1} of {steps.length}
              </span>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-[#F5F0E6] rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-gradient-to-r from-[#172B82] to-[#3155D8] h-full rounded-full"
            />
          </div>

          {/* Steps Visual List */}
          <div className="space-y-3 sm:space-y-4">
            {steps.map((st, idx) => {
              const isDone = idx < activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <motion.div
                  key={st.status}
                  layout
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 sm:gap-4 select-none ${
                    isCurrent
                      ? 'bg-[#172B82]/5 border-[#172B82] shadow-xs'
                      : isDone
                      ? 'bg-[#16A34A]/5 border-[#16A34A]/30 text-[#172033]'
                      : 'bg-[#FFFCF5] border-[#DDD7CA] opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-[#16A34A] text-white'
                        : isCurrent
                        ? 'bg-[#172B82] text-white ring-4 ring-[#172B82]/20'
                        : 'bg-[#DDD7CA] text-[#687085]'
                    }`}
                  >
                    {isDone ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </motion.div>
                    ) : (
                      idx + 1
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-[#172033]">
                        {st.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#172B82] bg-white px-2 py-0.5 rounded border border-[#172B82]/30">
                          Current Step
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#687085] mt-0.5">{st.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Action Row */}
          <div className="hidden sm:flex pt-4 border-t border-[#DDD7CA] justify-between items-center">
            <Link to={`/vendor/orders/${order.id}`} className="wn-btn-secondary text-xs">
              Back to Details
            </Link>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={isProcessing}
              onClick={handleAdvanceStep}
              className="wn-btn-primary text-xs sm:text-sm py-2.5 px-6 font-bold flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Order Status...</span>
                </>
              ) : (
                <>
                  <span>
                    {activeIndex === steps.length - 1
                      ? 'Confirm Handover & Finish'
                      : `Proceed to ${steps[activeIndex + 1]?.label}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Sticky Bottom Action Bar */}
        <div className="sm:hidden fixed bottom-14 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#DDD7CA] z-30 shadow-lg flex items-center gap-2">
          <Link
            to={`/vendor/orders/${order.id}`}
            className="wn-btn-secondary text-xs px-3 py-2.5 min-h-[44px]"
          >
            Details
          </Link>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isProcessing}
            onClick={handleAdvanceStep}
            className="flex-1 wn-btn-primary text-xs py-2.5 min-h-[44px] font-bold flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {activeIndex === steps.length - 1
                    ? 'Confirm Handover'
                    : `Next: ${steps[activeIndex + 1]?.label}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </AnimatedPage>
  );
};
