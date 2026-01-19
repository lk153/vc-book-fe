import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

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
    return <Navigate to="/login" replace />;
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
    return <Navigate to="/" replace />;
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
      <Route path="/" element={<BooksListingPage />} />
      <Route path="/book/:bookId" element={<BookDetailPage />} />

      {/* Cart and Checkout Routes */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Navigate to="/cart" replace />} />
      <Route
        path="/shipping-address"
        element={
          <ProtectedRoute>
            <ShippingAddressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        }
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/books" element={<AdminBooksPage />} />
      <Route path="/admin/books/new" element={<AdminBookFormPage />} />
      <Route path="/admin/books/:bookId/edit" element={<AdminBookFormPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
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
