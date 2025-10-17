import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import CartSidePanel from "../components/Cart/CartSidePanel";
import SideAuthPanel from "../components/SideAuthPanel/SideAuthPanel";
import "../styles/layout/_header.scss";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  const { totals } = useCart();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      setIsAuthPanelOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="header__container">
          <Link to="/" className="header__logo">
            JUST SLEEP
          </Link>

          <nav className="header__nav">
            <Link
              to="/"
              className={`header__nav-link ${
                isActiveLink("/") ? "active" : ""
              }`}
            >
              Головна
            </Link>
            <Link
              to="/catalog"
              className={`header__nav-link ${
                isActiveLink("/catalog") ? "active" : ""
              }`}
            >
              Каталог
            </Link>
            <Link
              to="/contacts"
              className={`header__nav-link ${
                isActiveLink("/contacts") ? "active" : ""
              }`}
            >
              Контакти
            </Link>
          </nav>

          <div className="header__actions">
            <button
              onClick={handleCartClick}
              className="header__cart"
              aria-label="Відкрити кошик"
            >
              <ShoppingCart size={20} />
              {totals.itemsCount > 0 && (
                <span className="header__cart__badge">{totals.itemsCount}</span>
              )}
            </button>

            <div className="header__auth hidden-mobile">
              <button
                onClick={handleAuthClick}
                className="btn btn-primary btn-sm"
                title={
                  isAuthenticated
                    ? `Профіль${user?.name ? ": " + user.name : ""}`
                    : "Увійти"
                }
              >
                <User size={16} />
                {isAuthenticated ? user?.name || "Профіль" : "Вхід"}
              </button>
            </div>

            <button
              ref={mobileMenuButtonRef}
              className="header__mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Відкрити меню"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div
            ref={mobileMenuRef}
            className={`header__mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
          >
            <nav className="header__mobile-nav">
              <Link
                to="/"
                className={`header__nav-link ${
                  isActiveLink("/") ? "active" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Головна
              </Link>
              <Link
                to="/catalog"
                className={`header__nav-link ${
                  isActiveLink("/catalog") ? "active" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Каталог
              </Link>
              <Link
                to="/contacts"
                className={`header__nav-link ${
                  isActiveLink("/contacts") ? "active" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Контакти
              </Link>
              <div
                style={{
                  borderTop: "1px solid #e5e5e5",
                  paddingTop: "1rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  className="header__nav-link"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleAuthClick();
                  }}
                >
                  <User size={16} />
                  {isAuthenticated ? user?.name || "Профіль" : "Вхід"}
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <CartSidePanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <SideAuthPanel
        isOpen={isAuthPanelOpen}
        onClose={() => setIsAuthPanelOpen(false)}
      />
    </>
  );
};

export default Header;
