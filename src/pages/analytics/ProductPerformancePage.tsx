import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowDownRight, Package } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const ProductPerformancePage: React.FC = () => {
  const { products } = useData();

  const sortedBySales = [...products].sort((a, b) => b.salesCount - a.salesCount);
  const bestSellers = sortedBySales.slice(0, 3);
  const lowPerformers = sortedBySales.slice(-2);

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Product Performance & SKU Velocity"
          subtitle="Identify top volume revenue drivers and stagnant inventory requiring promotional offers."
          breadcrumbs={[
            { label: 'Analytics', path: '/vendor/reports' },
            { label: 'Product Performance' }
          ]}
        />

        {/* Top Best Sellers Podium / Cards */}
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-[#172033] mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Top Volume Best Sellers</span>
          </h3>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
          >
            {bestSellers.map((prod, idx) => (
              <motion.div
                key={prod.id}
                variants={staggerItem}
                whileTap={{ scale: 0.99 }}
                className="bg-white rounded-2xl border border-[#DDD7CA] p-3.5 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden select-none"
              >
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center shadow-xs">
                  #{idx + 1}
                </div>

                <div>
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-32 sm:h-36 object-cover rounded-xl border border-[#DDD7CA] mb-2.5"
                  />
                  <h4 className="text-xs sm:text-sm font-bold text-[#172033] line-clamp-1">
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-[#687085]">{prod.brand} • {prod.category}</p>

                  <div className="mt-2.5 pt-2.5 border-t border-[#DDD7CA] flex items-baseline justify-between text-xs">
                    <span className="font-extrabold text-[#172B82]">
                      ₹{(prod.salesCount * prod.sellingPrice).toLocaleString('en-IN')} GMV
                    </span>
                    <span className="font-semibold text-[#172033]">
                      {prod.salesCount} Sold
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Link
                    to={`/vendor/products/${prod.id}`}
                    className="w-full wn-btn-secondary text-[11px] py-1.5 min-h-[34px] flex items-center justify-center"
                  >
                    View Product Performance
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Low Velocity Inventory Needing Attention */}
        <div className="bg-white rounded-2xl border border-[#DDD7CA] p-4 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#DDD7CA] pb-2.5">
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-[#F59E0B]" />
              <h3 className="text-xs sm:text-sm font-bold text-[#172033]">
                Stagnant SKUs (Low Inventory Velocity)
              </h3>
            </div>
            <Link to="/vendor/offers" className="text-xs font-bold text-[#172B82] hover:underline">
              Create Promotional Offer →
            </Link>
          </div>

          <div className="space-y-2">
            {lowPerformers.map((prod) => (
              <div
                key={prod.id}
                className="p-3 rounded-xl bg-[#FFFCF5] border border-[#DDD7CA] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-10 h-10 rounded-lg object-cover border border-[#DDD7CA]"
                  />
                  <div>
                    <h5 className="font-bold text-[#172033] line-clamp-1">{prod.name}</h5>
                    <span className="text-[11px] text-[#687085]">
                      Only {prod.salesCount} sold in last 30 days • {prod.stock} units idling
                    </span>
                  </div>
                </div>

                <Link
                  to={`/vendor/offers/create?sku=${prod.sku}`}
                  className="wn-btn-secondary text-[11px] py-1 px-2.5 shrink-0 min-h-[34px]"
                >
                  Discount SKU
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
