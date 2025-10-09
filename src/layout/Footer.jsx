import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  Wallet,
  Smartphone,
  CreditCard,
  FileText,
} from "lucide-react";

import "../styles/layout/_footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__brand">
            <div className="footer__brand-logo">JUST SLEEP</div>

            <div className="footer__brand-social">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-link"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="social-link"
              >
                <Send size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer__section">
            <h3 className="footer__section-title">Навігація</h3>
            <ul className="footer__section-links">
              <li>
                <Link to="/catalog">Каталог товарів</Link>
              </li>
              <li>
                <Link to="/catalog?filter=discount">Акції</Link>
              </li>
              <li>
                <Link to="/delivery">Доставка та оплата</Link>
              </li>
              <li>
                <Link to="/contacts#faq">Обмін і повернення</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__section">
            <h3 className="footer__section-title">Контакти</h3>
            <div className="footer__contact-list">
              <a href="tel:+380441234567" className="contact-item">
                <Phone size={18} />
                <span>+380 (44) 123-45-67</span>
              </a>
              <a href="tel:+380671234567" className="contact-item">
                <Phone size={18} />
                <span>+380 (67) 123-45-67</span>
              </a>
              <a href="mailto:just.sleep@info.ua" className="contact-item">
                <Mail size={18} />
                <span>just.sleep@info.ua</span>
              </a>
              <div className="contact-item">
                <MapPin size={18} />
                <span>м. Київ, вул. Прикладна, 1</span>
              </div>
              <div className="contact-item">
                <Clock size={18} />
                <span>
                  Пн-Пт: 9:00-18:00, <br /> Сб: 10:00-16:00
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="footer__section">
            <h3 className="footer__section-title">Способи оплати</h3>
            <div className="footer__payment-methods">
              <div className="payment-method">
                <Wallet size={20} />
                <span>Оплата при отриманні</span>
              </div>
              <div className="payment-method">
                <Smartphone size={20} />
                <span>Google Pay / Apple Pay</span>
              </div>
              <div className="payment-method">
                <CreditCard size={20} />
                <span>Картка онлайн</span>
              </div>
              <div className="payment-method">
                <FileText size={20} />
                <span>Оплата по рахунку</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            © {currentYear} JUST SLEEP. Всі права захищені.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
