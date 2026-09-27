import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bike, CheckCircle2, Clock, MapPin, Phone, ArrowRight, PackageCheck, AlertCircle } from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, cardInteractiveVariants, buttonTapVariants } from '../../utils/animations';

export const PickupsPage: React.FC = () => {
  const { orders, updateOrderStatus } = useData();
  const { success } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const readyOrders = orders.filter(
    (o) => o.status === 'READY_FOR_PICKUP' || o.status === 'ACCEPTED'
  );

  const handleHandover = (orderId: string, orderNumber: string) => {
    setProcessingId(orderId);
    setTimeout(() => {
      updateOrderStatus(orderId, 'PICKED_UP');
      setProcessingId(null);
      success('Handover Confirmed', `${orderNumber} handed over to WearNear Captain.`);
    }, 400);
  };

  return (
    <AnimatedPage className="space-y-6">
      <PageHeader
        title="Pickup Counter Management"
        subtitle="Manage ready packages and execute fast handovers to arriving WearNear Captains."
        breadcrumbs={[{ label: 'Orders', path: '/vendor/orders' }, { label: 'Captain Pickups' }]}
        badge={
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
            <Bike className="w-3.5 h-3.5" />
            {readyOrders.length} Pending Handover
          </span>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {readyOrders.map((order) => (
          <motion.div
            key={order.id}
            variants={cardInteractiveVariants}
            className="bg-white rounded-3xl border border-[#DDD7CA] p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD7CA]">
                <div>
                  <span className="text-xs font-bold text-[#172B82] font-mono">
                    {order.orderNumber}
                  </span>
                  <p className="text-xs text-[#687085] mt-0.5">Customer: <strong className="text-[#172033]">{order.customer.name}</strong></p>
                </div>
                <StatusBadge status={order.status} size="sm" />
              </div>

              {/* Garment Summary */}
              <div className="mt-3.5 space-y-1 text-xs">
                <span className="text-[#687085] font-medium">Boutique Items for Handover:</span>
                <p className="font-bold text-[#172033] leading-snug">
                  {order.items.map((i) => `${i.productName} (${i.size})`).join(', ')}
                </p>
              </div>

              {/* Captain Info */}
              <div className="mt-3.5 p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#172B82]/10 flex items-center justify-center text-[#172B82]">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#172033]">
                      {order.captain?.name || 'Sameer Sheikh (Captain)'}
                    </p>
                    <p className="text-[10px] text-[#687085]">
                      {order.captain?.vehicleType || 'EV Scooter'} •{' '}
                      {order.captain?.vehicleNumber || 'MH 02 ER 8820'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#172B82] bg-[#172B82]/10 px-2 py-1 rounded-lg">
                    ETA {order.captain?.etaMinutes || 5}m
                  </span>
                  <a
                    href={`tel:${order.captain?.phone || '+919876543210'}`}
                    className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200"
                    title="Call Captain"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-[#DDD7CA] flex items-center justify-between gap-3">
              <Link
                to={`/vendor/orders/${order.id}`}
                className="text-xs font-bold text-[#687085] hover:text-[#172B82] transition-colors"
              >
                Inspect Items
              </Link>

              <motion.button
                variants={buttonTapVariants}
                whileTap="tap"
                disabled={processingId === order.id}
                onClick={() => handleHandover(order.id, order.orderNumber)}
                className="wn-btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                {processingId === order.id ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Confirm Handover</span>
              </motion.button>
            </div>
          </motion.div>
        ))}

        {readyOrders.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl border border-[#DDD7CA] p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">All Pickups Dispatched!</h3>
            <p className="text-xs text-[#687085] max-w-sm mx-auto">
              There are no pending packages awaiting captain handover right now.
            </p>
            <div className="pt-2">
              <Link to="/vendor/orders" className="wn-btn-secondary text-xs inline-flex">
                View All Orders
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatedPage>
  );
};

