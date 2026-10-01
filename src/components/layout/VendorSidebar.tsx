import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Grid,
  Maximize2,
  Palette,
  FileText,
  Wallet,
  Landmark,
  BarChart3,
  TrendingUp,
  Store,
  Users,
  Star,
  RotateCcw,
  RefreshCw,
  CreditCard,
  Percent,
  Bell,
  Barcode,
  Printer,
  HelpCircle,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface VendorSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { store, logout } = useAuth();
  const { orders, notifications, inventory } = useData();
  const location = useLocation();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const pendingOrdersCount = orders.filter((o) => o.status === 'NEW' || o.status === 'PENDING').length;
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;
  const lowStockCount = inventory.filter((i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK').length;

  const sections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
        { label: 'Scan Barcode', path: '/vendor/barcode-scanner', icon: Barcode },
        { label: 'Orders', path: '/vendor/orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
        { label: 'Products', path: '/vendor/products', icon: Package },
        { label: 'Inventory', path: '/vendor/inventory', icon: Layers, badge: lowStockCount > 0 ? lowStockCount : undefined }
      ]
    },
    {
      title: 'CATALOG',
      items: [
        { label: 'Barcode Labels', path: '/vendor/products/barcode-labels', icon: Printer },
        { label: 'Categories', path: '/vendor/categories', icon: Grid },
        { label: 'Brands', path: '/vendor/brands', icon: Tag },
        { label: 'Sizes', path: '/vendor/sizes', icon: Maximize2 },
        { label: 'Colors', path: '/vendor/colors', icon: Palette }
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { label: 'Billing', path: '/vendor/billing', icon: FileText },
        { label: 'Wallet', path: '/vendor/wallet', icon: Wallet },
        { label: 'Settlements', path: '/vendor/settlements', icon: Landmark }
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { label: 'Reports', path: '/vendor/reports', icon: BarChart3 },
        { label: 'Product Performance', path: '/vendor/reports/products', icon: TrendingUp }
      ]
    },
    {
      title: 'STORE & BUSINESS',
      items: [
        { label: 'Store Profile', path: '/vendor/store-profile', icon: Store },
        { label: 'Business Profile', path: '/vendor/business', icon: Building2 },
        { label: 'Customers', path: '/vendor/customers', icon: Users },
        { label: 'Staff Management', path: '/vendor/staff', icon: Users },
        { label: 'Catalogue Executives', path: '/vendor/catalogue-executives', icon: UserCheck, badge: '3/3' },
        { label: 'Reviews', path: '/vendor/reviews', icon: Star }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Returns', path: '/vendor/returns', icon: RotateCcw },
        { label: 'Exchanges', path: '/vendor/exchanges', icon: RefreshCw },
        { label: 'Refunds', path: '/vendor/refunds', icon: CreditCard },
        { label: 'Offers', path: '/vendor/offers', icon: Percent }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Notifications', path: '/vendor/notifications', icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined },
        { label: 'Support', path: '/vendor/support', icon: HelpCircle },
        { label: 'Settings', path: '/vendor/settings', icon: Settings },
        { label: 'Security', path: '/vendor/security', icon: ShieldCheck }
      ]
    }
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-[#DDD7CA] transition-all duration-300 relative z-30 select-none ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`h-16 flex items-center border-b border-[#DDD7CA] shrink-0 transition-all ${
          collapsed ? 'justify-center px-2' : 'justify-between px-3.5'
        }`}
      >
        {collapsed ? (
          <div className="relative group flex items-center justify-center">
            <button
              onClick={onToggleCollapse}
              className="relative p-1 rounded-xl bg-white border border-[#DDD7CA] hover:border-[#172B82] shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center"
              title="Expand sidebar"
            >
              <img
                src="/image.png"
                alt="WearNear Logo"
                className="h-10 w-10 object-contain rounded-lg p-0.5"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#172B82] text-white flex items-center justify-center shadow-xs border-2 border-white group-hover:scale-110 transition-transform">
                <ChevronRight className="w-3 h-3" />
              </span>
            </button>

            {/* Hover Tooltip when collapsed */}
            <div className="absolute left-[64px] top-1/2 -translate-y-1/2 z-50 bg-[#172033] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
              <span>WearNear Store</span>
              <span className="text-[10px] text-white/70 font-normal">(Click to expand)</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src="/image.png"
                alt="WearNear Logo"
                className="h-9 w-9 object-contain shrink-0 rounded-lg p-0.5 border border-[#DDD7CA]/60 bg-[#FFFCF5]"
              />
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col min-w-0"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[15px] tracking-tight text-[#172B82]">
                    WearNear
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#172B82]/10 text-[#172B82] uppercase tracking-wider">
                    Store
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#687085] truncate max-w-[130px]">
                  {store.name}
                </span>
              </motion.div>
            </div>

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              className="w-7 h-7 rounded-lg border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-[#F5F0E6] text-[#687085] hover:text-[#172B82] flex items-center justify-center transition-colors shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!collapsed ? (
              <p className="px-2.5 text-[10px] font-bold text-[#687085] tracking-wider uppercase">
                {section.title}
              </p>
            ) : (
              <div className="h-px bg-[#DDD7CA]/50 mx-2 my-1.5" />
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/vendor/dashboard' && location.pathname.startsWith(item.path));

                return (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <NavLink
                      to={item.path}
                      className={`group flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                        isActive
                          ? 'bg-[#172B82] text-white shadow-sm'
                          : 'text-[#172033] hover:bg-[#F5F0E6] hover:text-[#172B82]'
                      } ${collapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''}`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-[#687085] group-hover:text-[#172B82]'
                        }`}
                      />

                      {!collapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

                      {!collapsed && item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                            isActive
                              ? 'bg-white text-[#172B82]'
                              : 'bg-[#172B82]/10 text-[#172B82]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {collapsed && item.badge !== undefined && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3155D8] ring-2 ring-white" />
                      )}
                    </NavLink>

                    {/* Tooltip when collapsed */}
                    {collapsed && hoveredItem === item.path && (
                      <div className="absolute left-[70px] top-1/2 -translate-y-1/2 z-50 bg-[#172033] text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-2 border-t border-[#DDD7CA] shrink-0 space-y-1">
        {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 text-[#687085] hover:text-[#172B82] hover:bg-[#F5F0E6] rounded-lg transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#DC2626] hover:bg-rose-50 rounded-lg transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
