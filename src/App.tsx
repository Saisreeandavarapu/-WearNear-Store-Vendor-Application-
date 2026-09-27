import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { VendorLayout } from './components/layout/VendorLayout';

// Auth & Onboarding Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OtpPage } from './pages/auth/OtpPage';
import { KycPage } from './pages/auth/KycPage';
import { ApprovalPage } from './pages/auth/ApprovalPage';

// Main Application Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { StoreProfilePage } from './pages/store/StoreProfilePage';
import { CustomersPage } from './pages/store/CustomersPage';
import { StaffPage } from './pages/store/StaffPage';

// Products & Catalog
import { ProductListPage } from './pages/products/ProductListPage';
import { AddProductPage } from './pages/products/AddProductPage';
import { ProductDetailPage } from './pages/products/ProductDetailPage';
import { ProductVariantsPage } from './pages/products/ProductVariantsPage';
import { CategoriesPage } from './pages/catalog/CategoriesPage';
import { BrandsPage } from './pages/catalog/BrandsPage';
import { SizesPage } from './pages/catalog/SizesPage';
import { ColorsPage } from './pages/catalog/ColorsPage';

// Inventory
import { InventoryPage } from './pages/inventory/InventoryPage';
import { InventoryTransactionsPage } from './pages/inventory/InventoryTransactionsPage';
import { InventoryImportPage } from './pages/inventory/InventoryImportPage';

// Orders & Logistics
import { OrderListPage } from './pages/orders/OrderListPage';
import { NewOrderAlertPage } from './pages/orders/NewOrderAlertPage';
import { OrderDetailPage } from './pages/orders/OrderDetailPage';
import { OrderProcessPage } from './pages/orders/OrderProcessPage';
import { PickupsPage } from './pages/orders/PickupsPage';

// Billing & Finance
import { BillingPage } from './pages/billing/BillingPage';
import { CreateInvoicePage } from './pages/billing/CreateInvoicePage';
import { InvoiceViewPage } from './pages/billing/InvoiceViewPage';
import { WalletPage } from './pages/finance/WalletPage';
import { SettlementsPage } from './pages/finance/SettlementsPage';

// Analytics
import { ReportsPage } from './pages/analytics/ReportsPage';
import { ProductPerformancePage } from './pages/analytics/ProductPerformancePage';

// Operations
import { ReturnsPage } from './pages/operations/ReturnsPage';
import { ExchangesPage } from './pages/operations/ExchangesPage';
import { RefundsPage } from './pages/operations/RefundsPage';
import { OffersPage } from './pages/operations/OffersPage';
import { ReviewsPage } from './pages/operations/ReviewsPage';

// System
import { NotificationsPage } from './pages/system/NotificationsPage';
import { SupportPage } from './pages/system/SupportPage';
import { SettingsPage } from './pages/system/SettingsPage';
import { SecurityPage } from './pages/system/SecurityPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Root redirects to Login as required */}
      <Route path="/" element={<Navigate to="/vendor/login" replace />} />

      {/* Authentication & Onboarding Routes */}
      <Route path="/vendor/login" element={<LoginPage />} />
      <Route path="/vendor/register" element={<RegisterPage />} />
      <Route path="/vendor/otp" element={<OtpPage />} />
      <Route path="/vendor/kyc" element={<KycPage />} />
      <Route path="/vendor/approval" element={<ApprovalPage />} />

      {/* Authenticated Application Shell Routes */}
      <Route element={<VendorLayout />}>
        {/* Main Dashboard */}
        <Route path="/vendor/dashboard" element={<DashboardPage />} />

        {/* Store Profile */}
        <Route path="/vendor/store-profile" element={<StoreProfilePage />} />
        <Route path="/vendor/store-profile/edit" element={<StoreProfilePage />} />
        <Route path="/vendor/store-profile/images" element={<StoreProfilePage />} />

        {/* Products */}
        <Route path="/vendor/products" element={<ProductListPage />} />
        <Route path="/vendor/products/add" element={<AddProductPage />} />
        <Route path="/vendor/products/:id" element={<ProductDetailPage />} />
        <Route path="/vendor/products/:id/edit" element={<AddProductPage />} />
        <Route path="/vendor/products/:id/variants" element={<ProductVariantsPage />} />
        <Route path="/vendor/products/:id/images" element={<ProductDetailPage />} />

        {/* Catalog */}
        <Route path="/vendor/categories" element={<CategoriesPage />} />
        <Route path="/vendor/categories/add" element={<CategoriesPage />} />
        <Route path="/vendor/categories/:id/edit" element={<CategoriesPage />} />
        <Route path="/vendor/brands" element={<BrandsPage />} />
        <Route path="/vendor/brands/add" element={<BrandsPage />} />
        <Route path="/vendor/brands/:id/edit" element={<BrandsPage />} />
        <Route path="/vendor/sizes" element={<SizesPage />} />
        <Route path="/vendor/colors" element={<ColorsPage />} />

        {/* Inventory */}
        <Route path="/vendor/inventory" element={<InventoryPage />} />
        <Route path="/vendor/inventory/:productId" element={<InventoryPage />} />
        <Route path="/vendor/inventory/transactions" element={<InventoryTransactionsPage />} />
        <Route path="/vendor/inventory/low-stock" element={<InventoryPage />} />
        <Route path="/vendor/inventory/out-of-stock" element={<InventoryPage />} />
        <Route path="/vendor/inventory/import" element={<InventoryImportPage />} />
        <Route path="/vendor/inventory/import/history" element={<InventoryImportPage />} />

        {/* Orders */}
        <Route path="/vendor/orders" element={<OrderListPage />} />
        <Route path="/vendor/orders/new" element={<NewOrderAlertPage />} />
        <Route path="/vendor/orders/:id" element={<OrderDetailPage />} />
        <Route path="/vendor/orders/:id/process" element={<OrderProcessPage />} />
        <Route path="/vendor/pickups" element={<PickupsPage />} />
        <Route path="/vendor/pickups/:id" element={<PickupsPage />} />

        {/* Finance & Billing */}
        <Route path="/vendor/billing" element={<BillingPage />} />
        <Route path="/vendor/billing/create" element={<CreateInvoicePage />} />
        <Route path="/vendor/billing/:id" element={<InvoiceViewPage />} />
        <Route path="/vendor/billing/history" element={<BillingPage />} />
        <Route path="/vendor/wallet" element={<WalletPage />} />
        <Route path="/vendor/wallet/transactions" element={<WalletPage />} />
        <Route path="/vendor/settlements" element={<SettlementsPage />} />
        <Route path="/vendor/settlements/:id" element={<SettlementsPage />} />

        {/* Analytics */}
        <Route path="/vendor/reports" element={<ReportsPage />} />
        <Route path="/vendor/reports/products" element={<ProductPerformancePage />} />

        {/* Customers & Staff */}
        <Route path="/vendor/customers" element={<CustomersPage />} />
        <Route path="/vendor/staff" element={<StaffPage />} />
        <Route path="/vendor/staff/add" element={<StaffPage />} />
        <Route path="/vendor/staff/:id" element={<StaffPage />} />
        <Route path="/vendor/staff/:id/edit" element={<StaffPage />} />
        <Route path="/vendor/staff/:id/permissions" element={<StaffPage />} />

        {/* Operations */}
        <Route path="/vendor/returns" element={<ReturnsPage />} />
        <Route path="/vendor/returns/:id" element={<ReturnsPage />} />
        <Route path="/vendor/exchanges" element={<ExchangesPage />} />
        <Route path="/vendor/exchanges/:id" element={<ExchangesPage />} />
        <Route path="/vendor/refunds" element={<RefundsPage />} />
        <Route path="/vendor/offers" element={<OffersPage />} />
        <Route path="/vendor/offers/create" element={<OffersPage />} />
        <Route path="/vendor/reviews" element={<ReviewsPage />} />

        {/* System */}
        <Route path="/vendor/notifications" element={<NotificationsPage />} />
        <Route path="/vendor/support" element={<SupportPage />} />
        <Route path="/vendor/support/create" element={<SupportPage />} />
        <Route path="/vendor/support/:id" element={<SupportPage />} />
        <Route path="/vendor/settings" element={<SettingsPage />} />
        <Route path="/vendor/security" element={<SecurityPage />} />
      </Route>

      {/* Fallback to Dashboard */}
      <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
    </Routes>
  );
};

export default App;
