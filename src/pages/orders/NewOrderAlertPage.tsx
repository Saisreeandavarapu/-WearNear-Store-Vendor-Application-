import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const NewOrderAlertPage: React.FC = () => {
  const { orders, acceptOrder, rejectOrder } = useData();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const newOrders = orders.filter((o) => o.status === 'NEW');
  const incomingOrder = newOrders[0] || orders[0];

  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = () => {
    if (!incomingOrder) return;
    setIsProcessing(true);
    setTimeout(() => {
      acceptOrder(incomingOrder.id);
      setIsProcessing(false);
      success('Order Accepted!', `Captain dispatch initialized for ${incomingOrder.orderNumber}`);
      navigate(`/vendor/orders/${incomingOrder.id}/process`);
    }, 500);
  };

  const handleReject = () => {
    if (!incomingOrder) return;
    if (window.confirm('Are you sure you want to reject this incoming order?')) {
      rejectOrder(incomingOrder.id, 'Store inventory unavailable');
      error('Order Declined', `Order ${incomingOrder.orderNumber} has been rejected.`);
      navigate('/vendor/orders');
    }
  };

  if (!incomingOrder) {
    return (
      <AnimatedPage>
        <div className="text-center py-16">
          <ShoppingBag className="w-12 h-12 text-[#687085] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#172033]">No Incoming Orders Right Now</h3>
          <p className="text-xs text-[#687085] mt-1 mb-4">
            All active orders have been accepted and dispatched.
          </p>
          <Link to="/vendor/orders" className="wn-btn-primary text-xs">
            View All Active Orders
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-20 sm:pb-0">
        {/* Alert Header Banner */}
        <motion.div
          animate={{ scale: [1, 1.008, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-gradient-to-r from-[#172B82] to-[#243FBA] text-white p-3.5 sm:p-5 rounded-2xl shadow-lg flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-amber-300 animate-bounce" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold leading-tight">
                Incoming Instant Delivery Order!
              </h2>
              <p className="text-[11px] sm:text-xs text-white/80">
                Review and accept within 15 minutes to guarantee 30-min doorstep arrival.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-white/70 block uppercase">Timer</span>
            <span className="text-base sm:text-lg font-extrabold text-amber-300">14:22</span>
          </div>
        </motion.div>

        {/* Main Order Card */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#DDD7CA] gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-[#172B82]">
                Order #{incomingOrder.orderNumber}
              </span>
              <h3 className="text-base sm:text-xl font-bold text-[#172033] mt-0.5">
                Customer: {incomingOrder.customer.name}
              </h3>
              <p className="text-xs text-[#687085] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#172B82]" />
                {incomingOrder.customer.address} ({incomingOrder.customer.distanceKm} km away)
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xl sm:text-2xl font-bold text-[#172033] block">
                ₹{incomingOrder.totalAmount}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                {incomingOrder.paymentStatus} via {incomingOrder.paymentMethod.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Ordered Garments List */}
          <div>
            <h4 className="text-[11px] sm:text-xs font-bold text-[#687085] uppercase tracking-wider mb-2.5">
              Garments to Pick & Pack ({incomingOrder.itemCount} items)
            </h4>
            <div className="space-y-2.5">
              {incomingOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#FFFCF5] border border-[#DDD7CA] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-[#DDD7CA]"
                    />
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-[#172033]">
                        {item.productName}
                      </h5>
                      <p className="text-xs text-[#687085]">
                        Size: <strong className="text-[#172033]">{item.size}</strong> • Color:{' '}
                        <strong className="text-[#172033]">{item.color}</strong> • Qty:{' '}
                        <strong className="text-[#172B82]">{item.quantity}</strong>
                      </p>
                      <p className="text-[10px] text-[#687085] font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-[#172033]">₹{item.total}</span>
                    {item.discount > 0 && (
                      <span className="text-[10px] text-emerald-600 block">
                        Save ₹{item.discount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes if any */}
          {incomingOrder.notes && (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
              <strong>Customer Packaging Request:</strong> {incomingOrder.notes}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden sm:flex pt-4 border-t border-[#DDD7CA] items-center justify-between gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleReject}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-lg border border-[#DC2626]/30 text-[#DC2626] font-semibold text-xs hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Reject Order
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAccept}
              disabled={isProcessing}
              className="wn-btn-primary py-3 px-8 text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Accepting Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Order & Start Packing</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="sm:hidden fixed bottom-14 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#DDD7CA] z-30 shadow-lg flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReject}
            disabled={isProcessing}
            className="px-3.5 py-2.5 rounded-xl border border-[#DC2626]/30 text-[#DC2626] font-semibold text-xs min-h-[44px]"
          >
            Reject
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1 wn-btn-primary text-xs py-2.5 min-h-[44px] font-bold flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Accepting...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Start Packing</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </AnimatedPage>
  );
};
