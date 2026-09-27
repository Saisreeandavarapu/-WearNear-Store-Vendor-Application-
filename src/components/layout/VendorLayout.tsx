import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { VendorSidebar } from './VendorSidebar';
import { VendorHeader } from './VendorHeader';
import { VendorMobileNav } from './VendorMobileNav';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const VendorLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut listener for Cmd/Ctrl + K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex flex-col antialiased selection:bg-[#172B82] selection:text-white">
      <div className="flex flex-1 min-h-screen">
        {/* Desktop Sidebar */}
        <VendorSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <VendorHeader onOpenSearch={() => setIsSearchOpen(true)} />

          {/* Page Viewport */}
          <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <VendorMobileNav />

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
