import { Outlet } from "react-router-dom";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MiniCart } from "./MiniCart";
import { ToastHost } from "@/components/ui/ToastHost";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MiniCart />
      <ToastHost />
    </div>
  );
}
