import React, { useState } from "react";
import FAQ from "../components/FAQ/FAQ";
import { faqData } from "../data/faqData";
import "../styles/pages/_contacts.scss";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Тут буде логіка відправки форми
  };

  return (
    <div className="contacts">
      <div className="container">
        <h1 className="contacts__title">Контакти</h1>

        <div className="contacts__content">
          {/* Форма зв'язку */}
          <div className="contacts__form-section">
            <div className="contacts__card">
              <h2 className="contacts__card-title">Зв'язатися з нами</h2>
              <p className="contacts__card-description">
                Заповніть форму нижче, і ми зв'яжемось з вами найближчим часом. 
                Всі поля обов'язкові для заповнення.
              </p>
              <form className="contacts__form" onSubmit={handleSubmit}>
                <div className="contacts__form-group">
                  <label className="contacts__label">
                    Ваше ім'я <span className="contacts__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Введіть ваше ім'я"
                    value={formData.name}
                    onChange={handleChange}
                    className="contacts__input"
                    required
                  />
                </div>

                <div className="contacts__form-group">
                  <label className="contacts__label">
                    Телефон <span className="contacts__required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+38 (0__) ___-__-__"
                    value={formData.phone}
                    onChange={handleChange}
                    className="contacts__input"
                    required
                  />
                </div>

                <div className="contacts__form-group">
                  <label className="contacts__label">
                    Електронна пошта <span className="contacts__required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="contacts__input"
                    required
                  />
                </div>

                <div className="contacts__form-group">
                  <label className="contacts__label">
                    Повідомлення <span className="contacts__required">*</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Напишіть ваше повідомлення..."
                    value={formData.message}
                    onChange={handleChange}
                    className="contacts__textarea"
                    required
                  />
                </div>

                <button type="submit" className="contacts__submit-btn">
                  Надіслати
                </button>

                <p className="contacts__form-note">
                  Або напишіть нам у Telegram/Viber
                </p>
              </form>
            </div>
          </div>

          {/* Контактна інформація і карта */}
          <div className="contacts__info-section">
            {/* Контактні дані */}
            <div className="contacts__card contacts__info-card">
              <h2 className="contacts__card-title">Контактні дані</h2>
              <div className="contacts__info-list">
                <div className="contacts__info-item">
                  <span className="contacts__info-label">Телефон:</span>
                  <div className="contacts__info-values">
                    <a href="tel:+380500000000" className="contacts__info-link">
                      +38 (050) 000-00-00
                    </a>
                    <a href="tel:+380670000000" className="contacts__info-link">
                      +38 (067) 000-00-00
                    </a>
                  </div>
                </div>

                <div className="contacts__info-item">
                  <span className="contacts__info-label">Email:</span>
                  <a
                    href="mailto:info@matrac.store"
                    className="contacts__info-link"
                  >
                    info@matrac.store
                  </a>
                </div>

                <div className="contacts__info-item">
                  <span className="contacts__info-label">Адреса:</span>
                  <span className="contacts__info-text">
                    м. Київ, вул. Прикладна, 1
                  </span>
                </div>

                <div className="contacts__info-item">
                  <span className="contacts__info-label">Графік:</span>
                  <span className="contacts__info-text">Пн–Сб 10:00–20:00</span>
                </div>

                <div className="contacts__info-item">
                  <span className="contacts__info-label">Соцмережі:</span>
                  <div className="contacts__social">
                    <a
                      href="#"
                      className="contacts__social-link"
                      aria-label="Telegram"
                    >
                      Telegram
                    </a>
                    <span className="contacts__social-separator">·</span>
                    <a
                      href="#"
                      className="contacts__social-link"
                      aria-label="Instagram"
                    >
                      Instagram
                    </a>
                    <span className="contacts__social-separator">·</span>
                    <a
                      href="#"
                      className="contacts__social-link"
                      aria-label="Facebook"
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Карта */}
            <div className="contacts__card contacts__map-card">
              <h2 className="contacts__card-title">Мапа</h2>
              <div className="contacts__map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.1!2d30.5234!3d50.4501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDI3JzAwLjQiTiAzMMKwMzEnMjQuMiJF!5e0!3m2!1suk!2sua!4v1234567890123!5m2!1suk!2sua"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                />
              </div>
            </div>
          </div>
        </div>

        <section className="contacts__faq-section">
          <h2 className="contacts__section-title">Часті питання</h2>
          <FAQ items={faqData} />
        </section>
      </div>
    </div>
  );
};

export default Contacts;
