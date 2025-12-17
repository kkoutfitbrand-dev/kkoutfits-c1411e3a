import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageTransition } from "@/components/PageTransition";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SizeGuide from "./pages/SizeGuide";
import CustomTailoring from "./pages/CustomTailoring";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import Search from "./pages/Search";
import TrackOrder from "./pages/TrackOrder";
import NotFound from "./pages/NotFound";
import OrderConfirmation from "./pages/OrderConfirmation";
import Sale from "./pages/Sale";
import Shop from "./pages/Shop";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnsExchange from "./pages/ReturnsExchange";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Careers from "./pages/Careers";
import Sustainability from "./pages/Sustainability";
import StoreLocator from "./pages/StoreLocator";
import PaymentOptions from "./pages/PaymentOptions";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/category/:category" element={<PageTransition><CategoryPage /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/cart" element={<ProtectedRoute><PageTransition><Cart /></PageTransition></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><PageTransition><Wishlist /></PageTransition></ProtectedRoute>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/order-confirmation" element={<ProtectedRoute><PageTransition><OrderConfirmation /></PageTransition></ProtectedRoute>} />
        <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/size-guide" element={<PageTransition><SizeGuide /></PageTransition>} />
        <Route path="/custom-tailoring" element={<PageTransition><CustomTailoring /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/search" element={<PageTransition><Search /></PageTransition>} />
        <Route path="/track-order" element={<PageTransition><TrackOrder /></PageTransition>} />
        <Route path="/sale" element={<PageTransition><Sale /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/shipping-policy" element={<PageTransition><ShippingPolicy /></PageTransition>} />
        <Route path="/returns-exchange" element={<PageTransition><ReturnsExchange /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms-conditions" element={<PageTransition><TermsConditions /></PageTransition>} />
        <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
        <Route path="/sustainability" element={<PageTransition><Sustainability /></PageTransition>} />
        <Route path="/store-locator" element={<PageTransition><StoreLocator /></PageTransition>} />
        <Route path="/payment-options" element={<PageTransition><PaymentOptions /></PageTransition>} />
        <Route path="/admin/dashboard" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><PageTransition><AdminProducts /></PageTransition></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><PageTransition><AdminCategories /></PageTransition></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><PageTransition><AdminOrders /></PageTransition></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><PageTransition><AdminCustomers /></PageTransition></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><PageTransition><AdminSettings /></PageTransition></AdminRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
