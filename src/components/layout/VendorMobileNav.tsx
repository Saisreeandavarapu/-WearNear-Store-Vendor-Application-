import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  MoreHorizontal
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { MobileMoreSheet } from './MobileMoreSheet';

export const VendorMobileNav: React.FC = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { orders, inventory } = useData();
  const location = useLocation();

  const pendingOrders = orders.filter((o) => o.status === 'NEW' || o.status === 'PENDING').length;
  const lowStock = inventory.filter((i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK').length;

  const navItems = [
    { label: 'Home', path: '/vendor/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/vendor/orders', icon: ShoppingBag, badge: pendingOrders > 0 ? pendingOrders : undefined },
    { label: 'Products', path: '/vendor/products', icon: Package },
    { label: 'Inventory', path: '/vendor/inventory', icon: Layers, badge: lowStock > 0 ? lowStock : undefined }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDD7CA] shadow-[0_-4px_16px_rgba(23,43,130,0.06)] lg:hidden">
        <div className="flex items-center justify-around px-2 py-1.5 safe-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/vendor/dashboard' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] min-h-[44px] rounded-xl select-none group"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-0 bg-[#172B82]/8 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{ scale: isActive ? 1.08 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-[#172B82] stroke-[2.4px]' : 'text-[#687085] stroke-[1.8px] group-hover:text-[#172033]'
                      }`}
                    />
                    {item.badge !== undefined && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-2.5 min-w-[16px] h-[16px] bg-[#DC2626] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-xs border-2 border-white"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                      isActive ? 'font-bold text-[#172B82]' : 'font-medium text-[#687085] group-hover:text-[#172033]'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}

          {/* More Sheet Trigger */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMoreOpen(true)}
            className="relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] min-h-[44px] rounded-xl text-[#687085] hover:text-[#172033] select-none"
            aria-label="Open More Menu"
          >
            <MoreHorizontal className="w-5 h-5 stroke-[1.8px]" />
            <span className="text-[10px] mt-0.5 font-medium">More</span>
          </motion.button>
        </div>
      </nav>

      {/* Mobile More Sheet */}
      <MobileMoreSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  );
};
