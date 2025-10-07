import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import Modal from "../ui/Modal";
import LoginForm from "../ui/LoginForm";
import "../../styles/components/_header.scss";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0); // TODO: connect to cart state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          JUST SLEEP
        </Link>

        <nav className="header__nav">
          <Link
            to="/"
            className={`header__nav-link ${isActiveLink("/") ? "active" : ""}`}
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
          <Link to="/cart" className="header__cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="header__cart__badge">{cartCount}</span>
            )}
          </Link>

          <div className="header__auth hidden-mobile">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <User size={16} />
              Вхід
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
                  setIsLoginModalOpen(true);
                }}
              >
                <User size={16} />
                Вхід
              </button>
            </div>
          </nav>
        </div>
      </div>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Вхід в акаунт"
      >
        <LoginForm onClose={() => setIsLoginModalOpen(false)} />
      </Modal>
    </header>
  );
};

export default Header;
