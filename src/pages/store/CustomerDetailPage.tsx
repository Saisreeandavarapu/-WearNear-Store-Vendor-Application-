import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, ShoppingBag, Award, Clock, ChevronRight } from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useData } from '../../context/DataContext';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { customers, orders } = useData();

  const customer = customers.find((c) => c.id === id) || customers[0];
  const customerOrders = orders.filter(
    (o) => o.customer.name.toLowerCase() === customer.name.toLowerCase() || o.customer.id === customer.id
  );

  return (
    <AnimatedPage>
      <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Link
            to="/vendor/customers"
            className="p-2 rounded-xl bg-white border border-[#DDD7CA] text-[#687085] hover:text-[#172033]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <PageHeader
            title={`Customer Profile: ${customer.name}`}
            subtitle="Shopper history, total lifetime value, and recent order fulfilment status."
            breadcrumbs={[
              { label: 'Customers', path: '/vendor/customers' },
              { label: customer.name }
            ]}
          />
        </div>

        {/* Overview Header Card */}
        <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#172B82]/10 text-[#172B82] flex items-center justify-center font-bold text-2xl border border-[#172B82]/20">
              {customer.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#172033]">{customer.name}</h2>
                <StatusBadge status={customer.status} />
              </div>
              <p className="text-xs text-[#687085] flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> {customer.phone} · <Mail className="w-3.5 h-3.5" /> {customer.email}
              </p>
              <p className="text-xs text-[#687085] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#172B82]" /> {customer.locality}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center shrink-0">
            <div className="bg-[#F5F0E6] p-3.5 rounded-2xl border border-[#DDD7CA] min-w-[120px]">
              <p className="text-xl font-extrabold text-[#172B82]">{customer.ordersCount}</p>
              <p className="text-[10px] text-[#687085] font-bold uppercase tracking-wider">Orders Placed</p>
            </div>
            <div className="bg-[#F5F0E6] p-3.5 rounded-2xl border border-[#DDD7CA] min-w-[120px]">
              <p className="text-xl font-extrabold text-emerald-700">₹{customer.totalSpent.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-[#687085] font-bold uppercase tracking-wider">Total Spent</p>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-base text-[#172033] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#172B82]" /> Customer Order History
          </h3>

          <div className="space-y-3">
            {customerOrders.length > 0 ? (
              customerOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#FFFCF5] rounded-2xl border border-[#DDD7CA] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#172B82]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#172B82]">{ord.orderNumber}</span>
                      <span className="text-[11px] text-[#687085]">{ord.createdAt}</span>
                    </div>
                    <p className="text-xs text-[#172033] font-medium mt-1">
                      {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-xs text-[#172033]">₹{ord.totalAmount.toLocaleString('en-IN')}</p>
                      <StatusBadge status={ord.status} size="sm" />
                    </div>
                    <Link
                      to={`/vendor/orders/${ord.id}`}
                      className="p-2 rounded-xl bg-white border border-[#DDD7CA] text-[#687085] hover:text-[#172B82]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#687085]">No recent orders found for this customer.</p>
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CustomerDetailPage;
