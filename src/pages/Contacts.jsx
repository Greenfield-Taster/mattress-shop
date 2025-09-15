import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ім'я обов'язкове";
    }

    if (!formData.email) {
      newErrors.email = "Email обов'язковий";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Неправильний формат email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Повідомлення обов'язкове";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Тут буде логіка відправки форми
      console.log("Form submitted:", formData);
      alert(
        "Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Адреса",
      details: ["м. Київ, вул. Хрещатик, 25", "2-й поверх, секція 15"],
    },
    {
      icon: Phone,
      title: "Телефони",
      details: ["+380 (44) 123-45-67", "+380 (63) 987-65-43"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@mattressshop.ua", "support@mattressshop.ua"],
    },
    {
      icon: Clock,
      title: "Графік роботи",
      details: ["Пн-Пт: 9:00 - 19:00", "Сб-Нд: 10:00 - 18:00"],
    },
  ];

  return (
    <div className="contacts">
      <div className="container">
        {/* Hero Section */}
        <section className="contacts__hero">
          <h1 className="contacts__hero-title">Контакти</h1>
          <p className="contacts__hero-subtitle">
            Зв'яжіться з нами будь-яким зручним способом. Ми завжди готові
            відповісти на ваші запитання та допомогти з вибором матраса.
          </p>
        </section>

        <div className="contacts__content">
          {/* Contact Information */}
          <div className="contacts__info">
            <h2 className="contacts__info-title">Як з нами зв'язатися</h2>

            <div className="contacts__info-grid">
              {contactInfo.map((item, index) => (
                <div key={index} className="contacts__info-item">
                  <div className="contacts__info-icon">
                    <item.icon size={24} />
                  </div>
                  <div className="contacts__info-content">
                    <h3 className="contacts__info-item-title">{item.title}</h3>
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="contacts__info-detail">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="contacts__map">
              <div className="contacts__map-placeholder">
                <MapPin size={48} />
                <p>Інтерактивна карта</p>
                <p className="contacts__map-address">
                  м. Київ, вул. Хрещатик, 25
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contacts__form-section">
            <h2 className="contacts__form-title">Напишіть нам</h2>
            <p className="contacts__form-subtitle">
              Залиште своє повідомлення, і ми зв'яжемося з вами протягом доби
            </p>

            <form onSubmit={handleSubmit} className="contacts__form">
              <div className="contacts__form-row">
                <div className="form-group">
                  <label className="form-label">Ім'я *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${
                      errors.name ? "form-input-error" : ""
                    }`}
                    placeholder="Ваше ім'я"
                  />
                  {errors.name && (
                    <span className="form-error">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${
                      errors.email ? "form-input-error" : ""
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <span className="form-error">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="contacts__form-row">
                <div className="form-group">
                  <label className="form-label">Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+380 XX XXX XX XX"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Тема</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Оберіть тему</option>
                    <option value="consultation">Консультація з вибору</option>
                    <option value="order">Питання щодо замовлення</option>
                    <option value="delivery">Доставка</option>
                    <option value="warranty">Гарантія</option>
                    <option value="complaint">Скарга</option>
                    <option value="other">Інше</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Повідомлення *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`form-textarea ${
                    errors.message ? "form-input-error" : ""
                  }`}
                  placeholder="Опишіть ваше питання або побажання..."
                  rows="5"
                />
                {errors.message && (
                  <span className="form-error">{errors.message}</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                <Send size={18} />
                Надіслати повідомлення
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="contacts__faq">
          <h2 className="contacts__faq-title">Часті запитання</h2>
          <div className="contacts__faq-grid">
            <div className="contacts__faq-item">
              <h3>Як довго триває доставка?</h3>
              <p>
                По Києву доставка здійснюється протягом 1-2 днів. По Україні -
                3-5 робочих днів.
              </p>
            </div>
            <div className="contacts__faq-item">
              <h3>Чи можна протестувати матрас?</h3>
              <p>
                Так, у нашому шоу-румі ви можете протестувати будь-який матрас
                перед покупкою.
              </p>
            </div>
            <div className="contacts__faq-item">
              <h3>Яка гарантія на матраси?</h3>
              <p>
                Гарантія залежить від виробника та моделі, зазвичай від 5 до 10
                років.
              </p>
            </div>
            <div className="contacts__faq-item">
              <h3>Чи можна повернути матрас?</h3>
              <p>
                Так, протягом 30 днів після покупки ви можете повернути або
                обміняти матрас.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Contact */}
        <section className="contacts__quick">
          <div className="contacts__quick-content">
            <div className="contacts__quick-item">
              <Phone size={32} />
              <div>
                <h3>Подзвоніть нам</h3>
                <p>+380 (44) 123-45-67</p>
              </div>
            </div>
            <div className="contacts__quick-item">
              <MessageCircle size={32} />
              <div>
                <h3>Напишіть в Telegram</h3>
                <p>@mattressshop_ua</p>
              </div>
            </div>
            <div className="contacts__quick-item">
              <Mail size={32} />
              <div>
                <h3>Email</h3>
                <p>info@mattressshop.ua</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contacts;
