
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoachingPage from "./pages/Coaching";
import BootcampPage from "./pages/Bootcamps";
import BootcampView from "./pages/BootcampView";
import AboutPage from "./pages/About";
import ImprintPage from "./pages/legal/Imprint";
import PrivacyPage from "./pages/legal/Privacy";
import TermsPage from "./pages/legal/Terms";
import TestimonialsPage from "./pages/Testimonials";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmation";
import CourseDetailPage from "./pages/CourseDetail";
import CoursesPage from "./pages/Courses";
import BootcampDetailPage from "./pages/BootcampDetail";
import BootcampsPage from "./pages/Bootcamps";
import AuthPage from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import Orders from './pages/dashboard/Orders';
import Courses from './pages/dashboard/Courses';
import Bootcamps from './pages/dashboard/Bootcamps';
import DashboardCourseDetail from './pages/dashboard/CourseDetail';
import DashboardBootcampDetail from './pages/dashboard/BootcampDetail';

// Admin imports
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminCourses from './pages/admin/Courses';
import AdminOrders from './pages/admin/Orders';
import AdminNewsletter from './pages/admin/Newsletter';
import AdminContact from './pages/admin/Contact';
import CreateCourse from './pages/admin/CreateCourse';
import EditCourse from './pages/admin/EditCourse';
import AdminSessions from './pages/admin/Sessions';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/coaching" element={<CoachingPage />} />
              
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />

              <Route path="/bootcamps" element={<BootcampsPage />} />
              <Route path="/bootcamps/:id" element={<BootcampDetailPage />} />
              
              <Route path="/bootcampview" element={<BootcampView />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
              <Route path="/legal/imprint" element={<ImprintPage />} />
              <Route path="/legal/privacy" element={<PrivacyPage />} />
              <Route path="/legal/terms" element={<TermsPage />} />
              <Route path="/login" element={<AuthPage />} />
              
              {/* Dashboard Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<Orders />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<DashboardCourseDetail />} />
                <Route path="bootcamps" element={<Bootcamps />} />
                <Route path="bootcamps/:id" element={<DashboardBootcampDetail />} />
              </Route>
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="courses/new" element={<CreateCourse />} />
                <Route path="courses/edit/:id" element={<EditCourse />} />
                <Route path="sessions" element={<AdminSessions />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="settings" element={<div className="p-4">Settings coming soon</div>} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
