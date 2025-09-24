import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

import "./styles/main.scss";

function App() {
  // Використовуємо basename тільки в продакшні
  const basename = import.meta.env.PROD ? "/mattress-shop" : "";

  return (
    <Router basename={basename}>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:size" element={<Catalog />} />

          <Route path="/product/:id" element={<Product />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/login" element={<div>Login Page - Coming Soon</div>} />
          <Route
            path="/register"
            element={<div>Register Page - Coming Soon</div>}
          />

          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
