import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ROUTES } from './constants/routes';

import { BooksListingPage } from './features/books/BooksListingPage';
import { BookDetailPage } from './features/books/BookDetailPage';
import { CartPage } from './features/cart/CartPage';
import { ShippingAddressPage } from './features/cart/ShippingAddressPage';
import { OrderSuccessPage } from './features/cart/OrderSuccessPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/ResetPasswordPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { OrdersPage } from './features/orders/OrdersPage';
import { FloatingContact } from './components/FloatingContact';

// Admin pages
import {
  AdminLoginPage,
  AdminDashboardPage,
  AdminOrdersPage,
  AdminUsersPage,
  AdminBooksPage,
  AdminBookFormPage,
} from './features/admin';

function ProtectedRoute({ children }) {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}

function AppRoutes() {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<BooksListingPage />} />
      <Route path={ROUTES.BOOK_DETAIL} element={<BookDetailPage />} />

      {/* Cart and Checkout Routes */}
      <Route path={ROUTES.CART} element={<CartPage />} />
      <Route path={ROUTES.CHECKOUT} element={<Navigate to={ROUTES.CART} replace />} />
      <Route
        path={ROUTES.SHIPPING_ADDRESS}
        element={
          <ProtectedRoute>
            <ShippingAddressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ORDER_SUCCESS}
        element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        }
      />

      {/* Auth Routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ORDERS}
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
      <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
      <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrdersPage />} />
      <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
      <Route path={ROUTES.ADMIN_BOOKS} element={<AdminBooksPage />} />
      <Route path={ROUTES.ADMIN_BOOKS_NEW} element={<AdminBookFormPage />} />
      <Route path={ROUTES.ADMIN_BOOKS_EDIT} element={<AdminBookFormPage />} />

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <AuthProvider>
        <CartProvider>
          <AdminAuthProvider>
            <AppRoutes />
            <FloatingContact />
          </AdminAuthProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
