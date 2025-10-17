import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Layout from "./layout/Layout";
import ScrollToTop from "./utils/ScrollToTop";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

import "./styles/main.scss";

function App() {
  // Використовуємо basename тільки в продакшні
  const basename = import.meta.env.PROD ? "/mattress-shop" : "";

  return (
    <CartProvider currency="₴">
      <Router basename={basename}>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/contacts" element={<Contacts />} />

            <Route path="/login" element={<div>Login Page </div>} />
            <Route path="/register" element={<div>Register Page </div>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
