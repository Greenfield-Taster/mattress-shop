import React, { useState, useEffect } from "react";
import FAQ from "../components/FAQ/FAQ";
import { faqData } from "../data/faqData";
import { STORE_INFO } from "../utils/storeInfo";
import usePageMeta from "../hooks/usePageMeta";
import {
  PAGE_SEO,
  buildFAQJsonLd,
  buildBreadcrumbJsonLd,
} from "../utils/seoData";
import "../styles/pages/_contacts.scss";

const Contacts = () => {
  usePageMeta({
    ...PAGE_SEO.contacts,
    jsonLd: [
      buildFAQJsonLd(faqData),
      buildBreadcrumbJsonLd([
        { name: "Головна", url: "/" },
        { name: "Контакти" },
      ]),
    ],
  });
  useEffect(() => {
    if (window.location.hash === "#faq") {
      setTimeout(() => {
        const faqSection = document.getElementById("faq");
        if (faqSection) {
          const elementPosition = faqSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 140;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);

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
  const [submitError, setSubmitError] = useState("");

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

      case "phone": {
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
      }

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

    if (name === "phone") {
      processedValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

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

    setTouched({
      name: true,
      phone: true,
      email: true,
      message: true,
    });

    const newErrors = {
      name: validateField("name", formData.name),
      phone: validateField("phone", formData.phone),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      setIsSubmitting(true);
      setSubmitError("");

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";

        const response = await fetch(`${API_URL}/store/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": import.meta.env.VITE_PUBLISHABLE_API_KEY,
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            message: formData.message,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || "Помилка відправки");
        }

        setSubmitSuccess(true);

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

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitError(
          "Помилка при відправці форми. Спробуйте ще раз."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="contacts">
      <div className="container">
        <h1 className="contacts__title">Контакти</h1>
        <p className="contacts__subtitle">
          Ми завжди раді відповісти на ваші запитання та допомогти з вибором
          ідеального матраца
        </p>

        <div className="contacts__content">
          <div className="contacts__form-section">
            <div className="contacts__card">
              <h2 className="contacts__card-title">Зв'язатися з нами</h2>
              <p className="contacts__card-description">
                Заповніть форму нижче, і ми зв'яжемось з вами найближчим часом.
                Всі поля обов'язкові для заповнення.
              </p>

              {submitSuccess && (
                <div className="contacts__success-message">
                  ✓ Дякуємо! Ваше повідомлення успішно надіслано. Ми зв'яжемось
                  з вами найближчим часом.
                </div>
              )}

              {submitError && (
                <div className="contacts__error-message">
                  {submitError}
                </div>
              )}

              <form
                className="contacts__form"
                onSubmit={handleSubmit}
                noValidate
              >
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
                      touched.name && errors.name
                        ? "contacts__input--error"
                        : ""
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
                      touched.phone && errors.phone
                        ? "contacts__input--error"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.phone && errors.phone && (
                    <span className="contacts__error">{errors.phone}</span>
                  )}
                </div>

                <div className="contacts__form-group">
                  <label className="contacts__label">
                    Електронна пошта
                    <span className="contacts__required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`contacts__input ${
                      touched.email && errors.email
                        ? "contacts__input--error"
                        : ""
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
                  className={`contacts__submit-btn${submitSuccess ? " contacts__submit-btn--sent" : ""}`}
                  disabled={isSubmitting || submitSuccess}
                >
                  {isSubmitting
                    ? "Надсилання..."
                    : submitSuccess
                      ? "Надіслано ✓"
                      : "Надіслати"}
                </button>

                <p className="contacts__form-note">
                  Або напишіть нам у Telegram/Viber
                </p>
              </form>
            </div>
          </div>

          <div className="contacts__info-section">
            <div className="contacts__card contacts__info-card">
              <h2 className="contacts__card-title">Контактні дані</h2>
              <div className="contacts__info-list">
                <div className="contacts__info-item">
                  <span className="contacts__info-label">Телефон:</span>
                  <div className="contacts__info-values">
                    {STORE_INFO.phones.map((phone, i) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="contacts__info-link"
                      >
                        {STORE_INFO.phonesFormatted[i]}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="contacts__info-item">
                  <span className="contacts__info-label">Email:</span>
                  <a
                    href={`mailto:${STORE_INFO.email}`}
                    className="contacts__info-link"
                  >
                    {STORE_INFO.email}
                  </a>
                </div>

                <div className="contacts__info-item">
                  <span className="contacts__info-label">
                    Адреса / Самовивіз:
                  </span>
                  <span className="contacts__info-text">
                    {STORE_INFO.address}
                  </span>
                </div>

                <div className="contacts__info-item">
                  <span className="contacts__info-label">Графік:</span>
                  <span className="contacts__info-text">
                    {STORE_INFO.schedule}
                  </span>
                </div>

                <div className="contacts__info-item contacts__info-item--socials">
                  <span className="contacts__info-label">Соцмережі:</span>
                  <div className="contacts__social">
                    <a
                      href={STORE_INFO.social.telegram}
                      className="contacts__social-link"
                      aria-label="Telegram"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="contacts__social-icon"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        aria-hidden="true"
                      >
                        <path d="M9.04 15.07 8.9 18a.9.9 0 0 0 .71-.34l1.71-1.64 3.55 2.6c.65.36 1.12.17 1.28-.6l2.32-10.9c.21-.96-.35-1.33-1.02-1.1L3.9 9.2c-.94.34-.93.83-.17 1.05l4.2 1.31 9.76-6.15-8.65 7.66z" />
                      </svg>
                      <span className="contacts__social-text">Telegram</span>
                    </a>
                    <a
                      href={STORE_INFO.social.instagram}
                      className="contacts__social-link"
                      aria-label="Instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="contacts__social-icon"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        aria-hidden="true"
                      >
                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm6-1.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
                      </svg>
                      <span className="contacts__social-text">Instagram</span>
                    </a>
                    <a
                      href={STORE_INFO.social.facebook}
                      className="contacts__social-link"
                      aria-label="Facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="contacts__social-icon"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        aria-hidden="true"
                      >
                        <path d="M13 22v-8h3l1-4h-4V7a2 2 0 0 1 2-2h2V1h-3a5 5 0 0 0-5 5v4H6v4h3v8h4z" />
                      </svg>
                      <span className="contacts__social-text">Facebook</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="contacts__card contacts__map-card">
              <h2 className="contacts__card-title">Наш магазин / Самовивіз</h2>
              <p className="contacts__map-address">{STORE_INFO.address}</p>
              <div className="contacts__map">
                <iframe
                  src={STORE_INFO.map.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Магазин Just Sleep — самовивіз"
                />
              </div>
            </div>
          </div>
        </div>

        <section id="faq" className="contacts__faq-section">
          <h2 className="contacts__section-title">Часті питання</h2>
          <FAQ items={faqData} />
        </section>
      </div>
    </div>
  );
};

export default Contacts;
