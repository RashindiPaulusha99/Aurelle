import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AccountLayout } from "@/components/account/AccountLayout";

import { Home } from "@/pages/Home";
import { Catalog } from "@/pages/Catalog";
import { ProductDetail } from "@/pages/ProductDetail";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { OrderConfirmation } from "@/pages/OrderConfirmation";
import { Wishlist } from "@/pages/Wishlist";
import { FindMySize } from "@/pages/FindMySize";
import { VirtualTryOn } from "@/pages/VirtualTryOn";
import { NotFound } from "@/pages/NotFound";

import { Login } from "@/pages/account/Login";
import { Register } from "@/pages/account/Register";
import { AccountOverview } from "@/pages/account/AccountOverview";
import { OrderHistory } from "@/pages/account/OrderHistory";
import { OrderDetail } from "@/pages/account/OrderDetail";
import { Addresses } from "@/pages/account/Addresses";
import { Profile } from "@/pages/account/Profile";

import { AdminLogin } from "@/pages/admin/AdminLogin";
import { Dashboard } from "@/pages/admin/Dashboard";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminCustomers } from "@/pages/admin/AdminCustomers";
import { AdminCoupons } from "@/pages/admin/AdminCoupons";
import { AdminHeroSlides } from "@/pages/admin/AdminHeroSlides";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products/*" element={<AdminProducts />} />
          <Route path="orders/*" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="hero-slides" element={<AdminHeroSlides />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/find-my-size" element={<FindMySize />} />
          <Route path="/try-on" element={<VirtualTryOn />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountOverview />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
