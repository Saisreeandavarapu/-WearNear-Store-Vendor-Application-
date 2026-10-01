import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import {
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  Settings,
  ShieldCheck,
  LogOut,
  Store,
  Barcode
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StoreStatus } from '../../types';

interface VendorHeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu?: () => void;
}

export const VendorHeader: React.FC<VendorHeaderProps> = ({ onOpenSearch }) => {
  const { user, store, updateStoreStatus, logout } = useAuth();
  const { notifications, markNotificationAsRead } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 12);
    });
  }, [scrollY]);

  const statusRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (path: string): string => {
    if (path.includes('/barcode-scanner')) return 'Barcode Scanner';
    if (path.includes('/barcode-labels')) return 'Barcode Labels';
    if (path.includes('/products/add')) return 'Add Product';
    if (path.includes('/products/') && path.includes('/edit')) return 'Edit Product';
    if (path.includes('/products/') && path.includes('/variants')) return 'Product Variants';
    if (path.startsWith('/vendor/products/')) return 'Product Details';
    if (path === '/vendor/products') return 'Products';
    if (path.includes('/orders/new')) return 'New Orders';
    if (path.includes('/orders/') && path.includes('/process')) return 'Process Order';
    if (path.startsWith('/vendor/orders/')) return 'Order Details';
    if (path === '/vendor/orders') return 'Orders';
    if (path === '/vendor/inventory') return 'Inventory';
    if (path.includes('/inventory/transactions')) return 'Stock Log';
    if (path.includes('/inventory/import')) return 'Import Products';
    if (path === '/vendor/categories') return 'Categories';
    if (path === '/vendor/brands') return 'Brands';
    if (path === '/vendor/sizes') return 'Size Matrix';
    if (path === '/vendor/colors') return 'Color Palette';
    if (path === '/vendor/billing') return 'Billing & Invoices';
    if (path.includes('/billing/create')) return 'Create Invoice';
    if (path.startsWith('/vendor/billing/')) return 'Invoice View';
    if (path === '/vendor/wallet') return 'Store Wallet';
    if (path === '/vendor/settlements') return 'Settlements';
    if (path === '/vendor/reports') return 'Sales Reports';
    if (path === '/vendor/reports/products') return 'Performance';
    if (path === '/vendor/store-profile') return 'Store Profile';
    if (path.includes('/vendor/business')) return 'Business Profile';
    if (path.includes('/vendor/catalogue-executives')) return 'Catalogue Executives';
    if (path === '/vendor/customers') return 'Customers';
    if (path === '/vendor/staff') return 'Staff & Access';
    if (path === '/vendor/notifications') return 'Notifications';
    if (path === '/vendor/returns') return 'Returns';
    if (path === '/vendor/exchanges') return 'Exchanges';
    if (path === '/vendor/refunds') return 'Refunds';
    if (path === '/vendor/offers') return 'Offers & Deals';
    if (path === '/vendor/reviews') return 'Store Reviews';
    if (path === '/vendor/support') return 'Help & Support';
    if (path === '/vendor/settings') return 'Settings';
    if (path === '/vendor/security') return 'Security';
    return 'WearNear';
  };

  const isRootDashboard = location.pathname === '/vendor/dashboard';
  const pageTitle = getPageTitle(location.pathname);

  const statusOptions: { status: StoreStatus; label: string; desc: string }[] = [
    { status: 'ACTIVE', label: 'Store Active', desc: 'Accepting instant orders & deliveries' },
    { status: 'PENDING', label: 'Under Review', desc: 'Onboarding verification in progress' },
    { status: 'SUSPENDED', label: 'Suspended', desc: 'Store temporarily offline' },
    { status: 'BLOCKED', label: 'Blocked', desc: 'Compliance inquiry required' }
  ];

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-200 border-b border-[#DDD7CA] px-3 sm:px-6 flex items-center justify-between gap-2 ${
        isScrolled
          ? 'h-13 sm:h-15 bg-white/98 shadow-xs backdrop-blur-lg'
          : 'h-14 sm:h-16 bg-white/95 backdrop-blur-md'
      }`}
    >
      {/* Mobile Header Left Section */}
      <div className="flex items-center gap-2 lg:hidden min-w-0 flex-1">
        {!isRootDashboard ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-[#F5F0E6] flex items-center justify-center text-[#172033] shrink-0 active:bg-[#ECE7DE]"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-[#172B82]" />
          </motion.button>
        ) : (
          <Link to="/vendor/dashboard" className="flex items-center shrink-0">
            <img
              src="/image.png"
              alt="WearNear Logo"
              className="w-8 h-8 object-contain rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] p-1 shadow-2xs"
            />
          </Link>
        )}

        {/* Dynamic Mobile Page Title */}
        <div className="flex flex-col min-w-0 pr-1">
          <span className="font-extrabold text-sm sm:text-base text-[#172033] leading-tight truncate">
            {isRootDashboard ? 'WearNear' : pageTitle}
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#687085] font-medium leading-none truncate mt-0.5">
            {store.name}
          </span>
        </div>
      </div>

      {/* Desktop Search Bar Trigger */}
      <div className="hidden lg:flex items-center flex-1 max-w-md">
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#FFFCF5] hover:bg-[#F5F0E6] text-[#687085] border border-[#DDD7CA] rounded-xl text-xs font-medium transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#172B82]" />
            <span>Search products, orders, customers, invoices...</span>
          </div>
          <kbd className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#DDD7CA] text-[#687085]">
            ⌘K
          </kbd>
        </motion.button>
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
        {/* Quick Scan & Bill Button */}
        <Link
          to="/vendor/billing"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#172B82] hover:bg-[#243FBA] text-white text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <Barcode className="w-3.5 h-3.5" />
          <span>Scan & Bill</span>
        </Link>

        <Link
          to="/vendor/billing"
          className="sm:hidden w-9 h-9 rounded-xl border border-[#DDD7CA] bg-[#172B82]/10 text-[#172B82] flex items-center justify-center shrink-0"
          title="Scan & Bill POS"
        >
          <Barcode className="w-4 h-4" />
        </Link>

        {/* Mobile Search Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenSearch}
          className="lg:hidden w-9 h-9 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-[#F5F0E6] flex items-center justify-center text-[#172B82] shrink-0"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </motion.button>

        {/* Store Status Toggle Menu */}
        <div className="relative shrink-0" ref={statusRef}>
          {/* Desktop Status Pill */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-[#F5F0E6] text-xs font-semibold text-[#172033] transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                store.status === 'ACTIVE'
                  ? 'bg-[#16A34A] animate-pulse'
                  : store.status === 'PENDING'
                  ? 'bg-[#F59E0B]'
                  : 'bg-[#DC2626]'
              }`}
            />
            <span>Store {store.status}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#687085]" />
          </motion.button>

          {/* Mobile Status Dot Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="sm:hidden w-9 h-9 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-[#F5F0E6] flex items-center justify-center shrink-0 relative"
            aria-label="Store Status"
            title={`Store ${store.status}`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                store.status === 'ACTIVE'
                  ? 'bg-[#16A34A] animate-pulse'
                  : store.status === 'PENDING'
                  ? 'bg-[#F59E0B]'
                  : 'bg-[#DC2626]'
              }`}
            />
          </motion.button>

          {showStatusMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute -right-8 sm:right-0 mt-2 w-[calc(100vw-32px)] max-w-[260px] bg-white rounded-2xl shadow-xl border border-[#DDD7CA] p-2 z-50"
            >
              <div className="px-2 py-1.5 border-b border-[#DDD7CA] mb-1">
                <p className="text-[11px] font-bold text-[#687085] uppercase tracking-wider">
                  Store Status Simulator
                </p>
                <p className="text-[10px] text-[#687085]">
                  Test operational states in real-time
                </p>
              </div>
              <div className="space-y-1">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.status}
                    onClick={() => {
                      updateStoreStatus(opt.status);
                      setShowStatusMenu(false);
                    }}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors ${
                      store.status === opt.status ? 'bg-[#172B82]/10' : 'hover:bg-[#F5F0E6]'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                        opt.status === 'ACTIVE'
                          ? 'bg-[#16A34A]'
                          : opt.status === 'PENDING'
                          ? 'bg-[#F59E0B]'
                          : 'bg-[#DC2626]'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#172033]">{opt.label}</p>
                      <p className="text-[10px] text-[#687085]">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="relative shrink-0" ref={notifRef}>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative w-9 h-9 sm:w-auto sm:px-2.5 sm:py-1.5 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-[#F5F0E6] text-[#172033] flex items-center justify-center transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#172B82]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </motion.button>

          {showNotifMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="absolute -right-2 sm:right-0 mt-2 w-[calc(100vw-24px)] max-w-sm bg-white rounded-2xl shadow-xl border border-[#DDD7CA] overflow-hidden z-50"
            >
              <div className="p-3 border-b border-[#DDD7CA] flex items-center justify-between bg-[#FFFCF5]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#172033]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#172B82]/10 text-[#172B82]">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <Link
                  to="/vendor/notifications"
                  onClick={() => setShowNotifMenu(false)}
                  className="text-[11px] font-semibold text-[#172B82] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#DDD7CA]/50">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.actionUrl) {
                        navigate(n.actionUrl);
                        setShowNotifMenu(false);
                      }
                    }}
                    className={`p-3 cursor-pointer hover:bg-[#F5F0E6] transition-colors ${
                      !n.isRead ? 'bg-[#172B82]/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#172033] truncate">{n.title}</p>
                      <span className="text-[10px] text-[#687085] shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#687085] mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Profile Avatar & Menu (Desktop only - mobile has More sheet) */}
        <div className="relative shrink-0 hidden md:block" ref={profileRef}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 sm:px-2 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] hover:bg-[#F5F0E6] transition-colors min-h-[36px]"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
              alt={user?.name || 'Store Owner'}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-[#DDD7CA]"
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#172033] leading-tight">
                {user?.name || 'Store Owner'}
              </span>
              <span className="text-[10px] text-[#687085] font-medium leading-none">
                {user?.role === 'STORE_OWNER' ? 'Owner' : 'Staff'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#687085]" />
          </motion.button>

          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#DDD7CA] p-2 z-50"
            >
              <div className="p-2 border-b border-[#DDD7CA] mb-1">
                <p className="text-xs font-bold text-[#172033]">{user?.name}</p>
                <p className="text-[11px] text-[#687085] truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-[#172B82] bg-[#172B82]/10 px-1.5 py-0.5 rounded-lg">
                  {store.name}
                </span>
              </div>

              <div className="space-y-0.5">
                <Link
                  to="/vendor/store-profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#172033] hover:bg-[#F5F0E6] rounded-xl transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-[#172B82]" />
                  Store Profile
                </Link>
                <Link
                  to="/vendor/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#172033] hover:bg-[#F5F0E6] rounded-xl transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#172B82]" />
                  Settings
                </Link>
                <Link
                  to="/vendor/security"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#172033] hover:bg-[#F5F0E6] rounded-xl transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#172B82]" />
                  Security
                </Link>

                <div className="h-px bg-[#DDD7CA] my-1" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-[#DC2626] hover:bg-rose-50 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

