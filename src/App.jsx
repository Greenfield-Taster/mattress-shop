import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";

import "./styles/main.scss";

function App() {
  return (
    <Router basename="/mattress-shop">
      <Layout>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<Home />} />

          {/* Catalog routes */}
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:size" element={<Catalog />} />

          {/* Product page */}
          <Route
            path="/product/:id"
            element={<div>Product Page - Coming Soon</div>}
          />

          {/* Cart */}
          <Route path="/cart" element={<div>Cart Page - Coming Soon</div>} />

          {/* Auth */}
          <Route path="/login" element={<div>Login Page - Coming Soon</div>} />
          <Route
            path="/register"
            element={<div>Register Page - Coming Soon</div>}
          />

          {/* Other pages */}
          <Route path="/about" element={<div>About Page - Coming Soon</div>} />
          <Route
            path="/contacts"
            element={<div>Contacts Page - Coming Soon</div>}
          />

          {/* 404 */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
