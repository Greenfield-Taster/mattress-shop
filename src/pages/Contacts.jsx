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

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    message: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Валідація окремого поля
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Будь ласка, введіть ваше ім'я";
        } else if (value.trim().length < 2) {
          error = "Ім'я має містити мінімум 2 символи";
        } else if (value.trim().length > 50) {
          error = "Ім'я має містити максимум 50 символів";
        } else if (!/^[а-яА-ЯіІїЇєЄґҐa-zA-Z\s'-]+$/.test(value)) {
          error = "Ім'я може містити тільки літери";
        }
        break;

      case "phone":
        // Видаляємо всі символи крім цифр і +
        const phoneDigits = value.replace(/[^\d+]/g, "");
        if (!value.trim()) {
          error = "Будь ласка, введіть номер телефону";
        } else if (phoneDigits.length < 10) {
          error = "Номер телефону занадто короткий";
        } else if (phoneDigits.length > 13) {
          error = "Номер телефону занадто довгий";
        } else if (!/^(\+?38)?0\d{9}$/.test(phoneDigits)) {
          error = "Некоректний формат телефону (напр. +380501234567)";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Будь ласка, введіть email";
        } else if (
          !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
        ) {
          error = "Некоректний формат email";
        }
        break;

      case "message":
        if (!value.trim()) {
          error = "Будь ласка, введіть повідомлення";
        } else if (value.trim().length < 10) {
          error = "Повідомлення має містити мінімум 10 символів";
        } else if (value.trim().length > 500) {
          error = "Повідомлення має містити максимум 500 символів";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Форматування телефону
  const formatPhone = (value) => {
    const phoneDigits = value.replace(/\D/g, "");
    let formatted = "";

    if (phoneDigits.length > 0) {
      if (phoneDigits.startsWith("38")) {
        formatted = "+38";
        const remaining = phoneDigits.slice(2);
        if (remaining.length > 0) {
          formatted += " (" + remaining.slice(0, 3);
          if (remaining.length > 3) {
            formatted += ") " + remaining.slice(3, 6);
            if (remaining.length > 6) {
              formatted += "-" + remaining.slice(6, 8);
              if (remaining.length > 8) {
                formatted += "-" + remaining.slice(8, 10);
              }
            }
          }
        }
      } else if (phoneDigits.startsWith("0")) {
        formatted = "+38 (" + phoneDigits.slice(0, 3);
        if (phoneDigits.length > 3) {
          formatted += ") " + phoneDigits.slice(3, 6);
          if (phoneDigits.length > 6) {
            formatted += "-" + phoneDigits.slice(6, 8);
            if (phoneDigits.length > 8) {
              formatted += "-" + phoneDigits.slice(8, 10);
            }
          }
        }
      } else {
        formatted = value;
      }
    }

    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Форматування телефону
    if (name === "phone") {
      processedValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Валідація в реальному часі якщо поле вже було touched
    if (touched[name]) {
      const error = validateField(name, processedValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Позначаємо всі поля як touched
    setTouched({
      name: true,
      phone: true,
      email: true,
      message: true,
    });

    // Валідуємо всі поля
    const newErrors = {
      name: validateField("name", formData.name),
      phone: validateField("phone", formData.phone),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);

    // Перевіряємо чи є помилки
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      setIsSubmitting(true);
      
      try {
        // Тут буде логіка відправки форми на сервер
        console.log("Form submitted:", formData);
        
        // Симуляція відправки
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Успішна відправка
        setSubmitSuccess(true);
        
        // Очищення форми
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
        });
        
        setTouched({
          name: false,
          phone: false,
          email: false,
          message: false,
        });
        
        // Сховати повідомлення успіху через 5 секунд
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
        
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Помилка при відправці форми. Спробуйте ще раз.");
      } finally {
        setIsSubmitting(false);
      }
    }
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

              {submitSuccess && (
                <div className="contacts__success-message">
                  ✓ Дякуємо! Ваше повідомлення успішно надіслано. Ми зв'яжемось з вами найближчим часом.
                </div>
              )}

              <form className="contacts__form" onSubmit={handleSubmit} noValidate>
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
                    onBlur={handleBlur}
                    className={`contacts__input ${
                      touched.name && errors.name ? "contacts__input--error" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.name && errors.name && (
                    <span className="contacts__error">{errors.name}</span>
                  )}
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
                    onBlur={handleBlur}
                    className={`contacts__input ${
                      touched.phone && errors.phone ? "contacts__input--error" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.phone && errors.phone && (
                    <span className="contacts__error">{errors.phone}</span>
                  )}
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
                    onBlur={handleBlur}
                    className={`contacts__input ${
                      touched.email && errors.email ? "contacts__input--error" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.email && errors.email && (
                    <span className="contacts__error">{errors.email}</span>
                  )}
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
                    onBlur={handleBlur}
                    className={`contacts__textarea ${
                      touched.message && errors.message
                        ? "contacts__textarea--error"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.message && errors.message && (
                    <span className="contacts__error">{errors.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="contacts__submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Надсилання..." : "Надіслати"}
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
