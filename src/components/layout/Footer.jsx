import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Send,
  Phone,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";

import "../../styles/components/_footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // TODO: додати логіку підписки
      alert("Дякуємо за підписку!");
      setEmail("");
    }
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__brand">
            <div className="footer__brand-logo">MattressShop</div>
            <p className="footer__brand-description">
              Ваш надійний партнер у виборі ідеального матраса для комфортного
              та здорового сну.
            </p>
            <div className="footer__brand-social">
              <a href="#" aria-label="Facebook" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Telegram" className="social-link">
                <Send size={20} />
              </a>
            </div>
          </div>

          <div className="footer__sections-wrapper">
            <div className="footer__section">
              <h3 className="footer__section-title">Каталог</h3>
              <ul className="footer__section-links">
                <li>
                  <Link to="/catalog?type=single">Односпальні матраци</Link>
                </li>
                <li>
                  <Link to="/catalog?type=one-and-half">Півтораспальні</Link>
                </li>
                <li>
                  <Link to="/catalog?type=double">Двоспальні</Link>
                </li>
                <li>
                  <Link to="/catalog">Весь каталог</Link>
                </li>
                <li>
                  <Link to="/catalog?filter=discount">Акції</Link>
                </li>
              </ul>
            </div>

            <div className="footer__section">
              <h3 className="footer__section-title">Інформація</h3>
              <ul className="footer__section-links">
                <li>
                  <Link to="/about">Про компанію</Link>
                </li>
                <li>
                  <Link to="/delivery">Доставка і оплата</Link>
                </li>
                <li>
                  <Link to="/warranty">Гарантія</Link>
                </li>
                <li>
                  <Link to="/returns">Обмін і повернення</Link>
                </li>
                <li>
                  <Link to="/contacts">Контакти</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer__section footer__section--wide">
            <h3 className="footer__section-title">Підпишіться на новини</h3>
            <p className="footer__newsletter-description">
              Отримуйте інформацію про нові товари та акції
            </p>
            <form
              className="footer__newsletter"
              onSubmit={handleNewsletterSubmit}
            >
              <div className="newsletter-input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            <div className="footer__contact-info">
              <div className="contact-item">
                <Phone size={16} />
                <span>+380 (44) 123-45-67</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>info@mattressshop.ua</span>
              </div>
              <div className="contact-item">
                <Clock size={16} />
                <span>Пн-Пт: 9:00-18:00, Сб: 10:00-16:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <div className="footer__copyright">
              © {currentYear} MattressShop. Всі права захищені.
            </div>
          </div>

          <div className="footer__bottom-right">
            <div className="footer__payment">
              <span className="footer__payment-title">Приймаємо:</span>
              <div className="payment-methods">
                <div className="payment-icon">Visa</div>
                <div className="payment-icon">MC</div>
                <div className="payment-icon">💳</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
