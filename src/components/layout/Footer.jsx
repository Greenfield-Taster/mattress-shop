import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Send,
  Phone,
  MapPin,
  Mail,
  Clock,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          {/* Brand Section */}
          <div className="footer__brand">
            <div className="footer__brand-logo">MattressShop</div>
            <p className="footer__brand-description">
              Ваш надійний партнер у виборі ідеального матраса для комфортного
              та здорового сну. Якість, комфорт та доступні ціни.
            </p>
            <div className="footer__brand-social">
              <a href="#" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Telegram">
                <Send size={20} />
              </a>
              <a href="#" aria-label="Viber">
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h3 className="footer__section-title">Швидкі посилання</h3>
            <ul className="footer__section-links">
              <li>
                <Link to="/">Головна</Link>
              </li>
              <li>
                <Link to="/catalog">Каталог</Link>
              </li>
              <li>
                <Link to="/catalog/single">Односпальні</Link>
              </li>
              <li>
                <Link to="/catalog/double">Полуторні</Link>
              </li>
              <li>
                <Link to="/catalog/king">Двоспальні</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer__section">
            <h3 className="footer__section-title">Підтримка</h3>
            <ul className="footer__section-links">
              <li>
                <Link to="/about">Про нас</Link>
              </li>
              <li>
                <Link to="/contacts">Контакти</Link>
              </li>
              <li>
                <Link to="/delivery">Доставка</Link>
              </li>
              <li>
                <Link to="/returns">Повернення</Link>
              </li>
              <li>
                <Link to="/warranty">Гарантія</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__section">
            <h3 className="footer__section-title">Контакти</h3>
            <ul className="footer__section-links">
              <li>
                <MapPin size={16} style={{ color: "#FFFFFF" }} /> Київ, Україна
              </li>
              <li>
                <Phone size={16} style={{ color: "#FFFFFF" }} /> +380 (xx)
                xxx-xx-xx
              </li>
              <li>
                <Mail size={16} style={{ color: "#FFFFFF" }} />{" "}
                info@mattressshop.ua
              </li>
              <li>
                <Clock size={16} style={{ color: "#FFFFFF" }} /> Пн-Пт: 9:00 -
                18:00
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            © {currentYear} MattressShop. Всі права захищені.
          </div>

          <div className="footer__payment">
            <span className="footer__payment-title">Приймаємо:</span>
            <div className="footer__payment-icon">VISA</div>
            <div className="footer__payment-icon">MC</div>
            <div className="footer__payment-icon">💳</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
