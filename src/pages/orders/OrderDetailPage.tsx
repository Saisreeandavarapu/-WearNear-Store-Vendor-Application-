import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bike,
  Phone,
  FileText,
  MapPin
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, createInvoice } = useData();
  const { success } = useToast();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <AnimatedPage>
        <div className="text-center py-16">
          <h2 className="text-lg font-bold text-[#172033]">Order Not Found</h2>
          <Link to="/vendor/orders" className="wn-btn-primary text-xs mt-3 inline-flex">
            Back to Orders
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  const handleGenerateInvoice = () => {
    const inv = createInvoice(order.id);
    success('Invoice Generated', `Invoice ${inv.invoiceNumber} created successfully.`);
    navigate(`/vendor/billing/${inv.id}`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title={`Order: ${order.orderNumber}`}
          subtitle={`Placed ${order.createdAt} • Target Delivery: ${order.pickupTimeWindow || '30 mins'}`}
          breadcrumbs={[
            { label: 'Orders', path: '/vendor/orders' },
            { label: order.orderNumber }
          ]}
          badge={<StatusBadge status={order.status} size="md" />}
          actions={
            <div className="flex items-center gap-2">
              <Link
                to={`/vendor/orders/${order.id}/process`}
                className="wn-btn-primary text-xs sm:text-sm"
              >
                Fulfillment Workflow →
              </Link>
              <button
                onClick={handleGenerateInvoice}
                className="wn-btn-secondary text-xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#172B82]" /> Bill
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column (8 cols): Items & Pricing */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Garments Ordered */}
            <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-5 shadow-xs space-y-3.5">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5">
                Items Ordered ({order.itemCount})
              </h3>

              <div className="space-y-2.5">
                {order.items.map((item) => (
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
                        <h4 className="text-xs sm:text-sm font-bold text-[#172033]">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-[#687085]">
                          Size: <strong className="text-[#172033]">{item.size}</strong> • Color:{' '}
                          <strong className="text-[#172033]">{item.color}</strong> • Qty:{' '}
                          <strong className="text-[#172B82]">{item.quantity}</strong>
                        </p>
                        <span className="text-[10px] font-mono text-[#687085]">SKU: {item.sku}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-[#172033]">₹{item.total}</span>
                      <span className="text-[11px] text-[#687085] block">₹{item.price} each</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="pt-3 border-t border-[#DDD7CA] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#687085]">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-[#172033]">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-[#687085]">
                  <span>Store Discount</span>
                  <span className="font-semibold text-emerald-600">-₹{order.discountTotal}</span>
                </div>
                <div className="flex justify-between text-[#687085]">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-[#172033]">
                    {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#687085]">
                  <span>Applicable GST & Cess</span>
                  <span className="font-semibold text-[#172033]">₹{order.taxes}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#DDD7CA] text-sm font-bold text-[#172033]">
                  <span>Total Amount</span>
                  <span className="text-[#172B82] text-base">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Captain Dispatch Assignment */}
            <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-5 shadow-xs space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2.5 flex items-center justify-between">
                <span>Assigned WearNear Captain</span>
                <Bike className="w-4 h-4 text-[#172B82]" />
              </h3>

              {order.captain ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFCF5] border border-[#DDD7CA]">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.captain.avatar}
                      alt={order.captain.name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#DDD7CA]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#172033]">{order.captain.name}</h4>
                      <p className="text-[11px] text-[#687085]">
                        {order.captain.vehicleType} • {order.captain.vehicleNumber}
                      </p>
                      <span className="text-[10px] text-amber-700 font-semibold">
                        ★ {order.captain.rating} Rating
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <a
                      href={`tel:${order.captain.phone}`}
                      className="wn-btn-secondary text-[11px] py-1 px-2.5 inline-flex min-h-[36px]"
                    >
                      <Phone className="w-3 h-3 text-[#172B82]" /> Call
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-[#687085]">
                  WearNear Captain will be assigned automatically upon order acceptance.
                </div>
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Customer Details & Timeline */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-5 shadow-xs space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2">
                Customer Information
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#687085] block text-[11px]">Full Name</span>
                  <span className="font-bold text-[#172033]">{order.customer.name}</span>
                </div>
                <div>
                  <span className="text-[#687085] block text-[11px]">Phone</span>
                  <span className="font-mono text-[#172033]">{order.customer.phone}</span>
                </div>
                <div>
                  <span className="text-[#687085] block text-[11px]">Delivery Address</span>
                  <span className="text-[#172033] leading-relaxed block">
                    {order.customer.address}
                  </span>
                  <span className="text-[10px] text-[#172B82] font-semibold">
                    {order.customer.distanceKm} km from boutique
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline of Order */}
            <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-5 shadow-xs space-y-3.5">
              <h3 className="text-xs sm:text-sm font-bold text-[#172033] border-b border-[#DDD7CA] pb-2">
                Order Activity Timeline
              </h3>

              <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DDD7CA]">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="relative text-xs">
                    <span
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        step.completed
                          ? 'border-[#16A34A] text-[#16A34A]'
                          : step.current
                          ? 'border-[#172B82] text-[#172B82] ring-2 ring-[#172B82]/20'
                          : 'border-[#DDD7CA] text-[#687085]'
                      }`}
                    >
                      {step.completed && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />}
                    </span>
                    <p className="font-bold text-[#172033]">{step.title}</p>
                    {step.description && (
                      <p className="text-[11px] text-[#687085]">{step.description}</p>
                    )}
                    <span className="text-[10px] text-[#687085]">{step.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="sm:hidden fixed bottom-14 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#DDD7CA] z-30 shadow-lg flex items-center gap-2">
          <button
            onClick={handleGenerateInvoice}
            className="wn-btn-secondary text-xs px-3 py-2.5 min-h-[44px]"
          >
            Generate Bill
          </button>
          <Link
            to={`/vendor/orders/${order.id}/process`}
            className="flex-1 wn-btn-primary text-xs py-2.5 min-h-[44px] font-bold flex items-center justify-center gap-1.5"
          >
            Fulfillment Workflow →
          </Link>
        </div>
      </div>
    </AnimatedPage>
  );
};
