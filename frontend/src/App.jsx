// Main application shell that wires routing and global UI assets.
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ScrollToTop from "./components/common/ScrollToTop";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import StockManagerHeader from "./components/common/StockManagerHeader";
import StockManagerFooter from "./components/common/StockManagerFooter";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import DeliveryDetails from "./pages/DeliveryDetails";
import UserProfile from "./pages/UserProfile";
import OrderConfirmation from "./pages/OrderConfirmation";
import Recommendations from "./pages/Recommendations";
import Wishlist from "./pages/Wishlist";
import AdminPanel from "./pages/AdminPanel";
import StockManager from "./pages/StockManager";
// In your App.jsx or routing file
import PrivacyPolicy from "./components/policies/PrivacyPolicy";
import TermsOfService from "./components/policies/TermsOfService";
import CookiePolicy from "./components/policies/CookiePolicy";
// import AdminHeader from './components/AdminHeader';
// import AdminFooter from './components/AdminFooter';

// Layout components
const MainLayout = ({ children }) => (
  <div className="main-layout">
    <Header />
    <main className="main-content">{children}</main>
    <Footer />
  </div>
);

// const StockManagerLayout = ({ children }) => (
//   <div className="stock-manager-layout">
//     <StockManagerHeader />
//     <main className="stock-manager-content">
//       {children}
//     </main>
//     <StockManagerFooter />
//   </div>
// );

// const AdminPanelLayout = ({ children }) => (
//   <div className="admin-panel-layout">
//     <AdminHeader />
//     <main className="admin-panel-content">
//       {children}
//     </main>
//     <AdminFooter />
//   </div>
// );

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          {/* Main site routes with regular layout */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/marketplace"
            element={
              <MainLayout>
                <Marketplace />
              </MainLayout>
            }
          />
          <Route
            path="/community"
            element={
              <MainLayout>
                <Community />
              </MainLayout>
            }
          />
          <Route
            path="/wishlist"
            element={
              <MainLayout>
                <Wishlist />
              </MainLayout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/cart"
            element={
              <MainLayout>
                <Cart />
              </MainLayout>
            }
          />
          <Route
            path="/delivery-details"
            element={
              <MainLayout>
                <DeliveryDetails />
              </MainLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <MainLayout>
                <Checkout />
              </MainLayout>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <MainLayout>
                <OrderConfirmation />
              </MainLayout>
            }
          />
          <Route
            path="/recommendations"
            element={
              <MainLayout>
                <Recommendations />
              </MainLayout>
            }
          />
          <Route
            path="/user-profile"
            element={
              <MainLayout>
                <UserProfile />
              </MainLayout>
            }
          />

          {/* Admin routes */}
          {/* <Route path="/admin-panel" element={
            <AdminPanelLayout>
              <AdminPanel />
            </AdminPanelLayout>
          } /> */}
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Stock Manager with special layout */}
          {/* <Route path="/stock-manager" element={
            <StockManagerLayout>
              <StockManager />
            </StockManagerLayout>
          } /> */}

          <Route
            path="/stock-manager"
            element={
              <ProtectedRoute requireStockManager>
                <StockManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/privacy-policy"
            element={
              <MainLayout>
                <PrivacyPolicy />
              </MainLayout>
            }
          />

          <Route
            path="/terms-of-service"
            element={
              <MainLayout>
                <TermsOfService />
              </MainLayout>
            }
          />

          <Route
            path="/cookies"
            element={
              <MainLayout>
                <CookiePolicy />
              </MainLayout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
