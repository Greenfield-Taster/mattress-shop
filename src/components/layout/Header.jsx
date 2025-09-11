import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0); // TODO: connect to cart state
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          MatressShop
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <Link 
            to="/" 
            className={`header__nav-link ${isActiveLink('/') ? 'active' : ''}`}
          >
            Головна
          </Link>
          <Link 
            to="/catalog" 
            className={`header__nav-link ${isActiveLink('/catalog') ? 'active' : ''}`}
          >
            Каталог
          </Link>
          <Link 
            to="/about" 
            className={`header__nav-link ${isActiveLink('/about') ? 'active' : ''}`}
          >
            Про нас
          </Link>
          <Link 
            to="/contacts" 
            className={`header__nav-link ${isActiveLink('/contacts') ? 'active' : ''}`}
          >
            Контакти
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="header__actions">
          {/* Cart */}
          <Link to="/cart" className="header__cart">
            <span>🛒</span>
            {cartCount > 0 && (
              <span className="header__cart__badge">{cartCount}</span>
            )}
          </Link>

          {/* Auth links - desktop only */}
          <div className="header__auth hidden-mobile">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Вхід
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Реєстрація
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="header__mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Відкрити меню"
          >
            <span>{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`header__mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="header__mobile-nav">
            <Link 
              to="/" 
              className={`header__nav-link ${isActiveLink('/') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Головна
            </Link>
            <Link 
              to="/catalog" 
              className={`header__nav-link ${isActiveLink('/catalog') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Каталог
            </Link>
            <Link 
              to="/about" 
              className={`header__nav-link ${isActiveLink('/about') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Про нас
            </Link>
            <Link 
              to="/contacts" 
              className={`header__nav-link ${isActiveLink('/contacts') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Контакти
            </Link>
            <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '1rem', marginTop: '1rem' }}>
              <Link 
                to="/login" 
                className="header__nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Вхід
              </Link>
              <Link 
                to="/register" 
                className="header__nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Реєстрація
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;