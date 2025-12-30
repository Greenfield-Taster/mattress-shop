import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  AuthProvider,
  WishlistProvider,
  CartProvider,
  QuizProvider,
} from "./contexts";
import Layout from "./layout/Layout";
import ScrollToTop from "./utils/ScrollToTop";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

import "./styles/main.scss";

function App() {
  // Використовуємо basename тільки в продакшні
  const basename = import.meta.env.PROD ? "/mattress-shop" : "";

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider currency="₴">
          <QuizProvider>
            <Router basename={basename}>
              <ScrollToTop />
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Router>
          </QuizProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
