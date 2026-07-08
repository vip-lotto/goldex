import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { LanguageProvider } from "./context/LanguageContext";
import { DialogProvider } from "./components/DialogContext";

import BottomNav from "./components/BottomNav";

import Home from "./pages/Home";
import Market from "./pages/Market";
import Trade from "./pages/Trade";
import History from "./pages/History";
import Assets from "./pages/Assets";
import Mine from "./pages/Mine";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import DepositHistory from "./pages/DepositHistory";
import WithdrawHistory from "./pages/WithdrawHistory";
import TransferNew from "./pages/TransferNew";
import TransferReceipt from "./pages/TransferReceipt";
import TransferHistory from "./pages/TransferHistory";
import BankAccount from "./pages/BankAccount";
import TransactionHistory from "./pages/TransactionHistory";
import Language from "./pages/Language";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import ChangePassword from "./pages/ChangePassword";
import KYC from "./pages/KYC";
import Convert from "./pages/Convert";
import Referral from "./pages/Referral";
import About from "./pages/About";
import Notifications from "./pages/Notifications";

import AdminWithdraw from "./pages/admin/AdminWithdraw";
import AdminDeposit from "./pages/admin/AdminDeposit";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTradeOrders from "./pages/admin/AdminTradeOrders";
import AdminTrades from "./pages/admin/AdminTrades";
import AdminSettings from "./pages/admin/AdminSettings";


import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoute from "./pages/admin/AdminRoute";




function Layout() {

  const location = useLocation();

  const showBottomNav = [
    "/home",
    "/market",
    "/trade",
    "/assets",
    "/mine",
  ].includes(location.pathname);

  return (
    <>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/history" element={<History />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/mine" element={<Mine />} />

        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/transfer" element={<TransferNew />} />
        <Route path="/deposit-history" element={<DepositHistory />} />
        <Route path="/withdraw-history" element={<WithdrawHistory />} />
        <Route path="/transfer-new" element={<TransferNew />} />
        <Route path="/transfer-receipt" element={<TransferReceipt />} />
        <Route path="/transfer-history" element={<TransferHistory />} />
        <Route path="/bank-account" element={<BankAccount />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/language" element={<Language />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/convert" element={<Convert />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/about" element={<About />} />
        <Route path="/notifications" element={<Notifications />} />

        
        
        

<Route
  path="/admin/login"
  element={<AdminLogin />}
/>


<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>


<Route
  path="/admin/users"
  element={
    <AdminRoute>
      <AdminUsers />
    </AdminRoute>
  }
/>


<Route
  path="/admin/deposit"
  element={
    <AdminRoute>
      <AdminDeposit />
    </AdminRoute>
  }
/>


<Route
  path="/admin/withdraw"
  element={
    <AdminRoute>
      <AdminWithdraw />
    </AdminRoute>
  }
/>


<Route
  path="/admin/orders"
  element={
    <AdminRoute>
      <AdminTradeOrders />
    </AdminRoute>
  }
/>


<Route
  path="/admin/trades"
  element={
    <AdminRoute>
      <AdminTrades />
    </AdminRoute>
  }
/>


<Route
  path="/admin/settings"
  element={
    <AdminRoute>
      <AdminSettings />
    </AdminRoute>
  }
/>


      </Routes>

      {showBottomNav && <BottomNav />}
    </>
  );
}

export default function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <LanguageProvider>
      <ToastProvider>
        <DialogProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </DialogProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}