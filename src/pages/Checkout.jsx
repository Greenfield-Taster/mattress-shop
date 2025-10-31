import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/pages/Checkout.scss";

// Import icons (lucide-react)
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  Package,
  Clock,
  CheckCircle,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

const Checkout = () => {
  const { items, totals, currency } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Contact form state
  const [contactData, setContactData] = useState({
    fullName: user?.name || "",
    phone: "",
    email: user?.email || "",
    comment: "",
    createAccount: false,
  });

  // Delivery state
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryWarehouse, setDeliveryWarehouse] = useState("");
  const [saveDeliveryInfo, setSaveDeliveryInfo] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Delivery options
  const deliveryOptions = [
    {
      id: "nova-poshta",
      name: "Нова Пошта",
      subtitle: "Відділення / Поштомат",
      icon: "📦",
    },
    {
      id: "meest",
      name: "Meest",
      subtitle: "Відділення / Кур'єр",
      icon: "📮",
    },
    {
      id: "delivery",
      name: "Delivery",
      subtitle: "Відділення / Кур'єр",
      icon: "🚚",
    },
    {
      id: "intime",
      name: "InTime",
      subtitle: "Відділення / Кур'єр",
      icon: "⏱️",
    },
    {
      id: "courier",
      name: "Кур'єр",
      subtitle: "Адресна доставка",
      icon: "🚴",
    },
    {
      id: "pickup",
      name: "Самовивіз",
      subtitle: "Зі складу / магазину",
      icon: "🏪",
    },
  ];

  // Payment options
  const paymentOptions = [
    {
      id: "cash-on-delivery",
      name: "Оплата при отриманні",
      subtitle: "Готівка / картка при отриманні",
      icon: "💵",
    },
    {
      id: "card-online",
      name: "Картка онлайн",
      subtitle: "Visa / MasterCard",
      icon: "💳",
    },
    {
      id: "google-apple-pay",
      name: "Google Pay / Apple Pay",
      subtitle: "Швидка оплата",
      icon: "📱",
    },
    {
      id: "invoice",
      name: "Безготівковий рахунок",
      subtitle: "Для юр. осіб",
      icon: "🧾",
    },
  ];

  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContactData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!deliveryMethod) {
      alert("Будь ласка, оберіть спосіб доставки");
      return;
    }

    if (!paymentMethod) {
      alert("Будь ласка, оберіть спосіб оплати");
      return;
    }

    if (!agreeToTerms) {
      alert(
        "Необхідно погодитись з умовами оферти та політикою конфіденційності"
      );
      return;
    }

    // Here would be order submission logic
    console.log("Order submitted:", {
      contactData,
      deliveryMethod,
      deliveryCity,
      deliveryAddress,
      deliveryWarehouse,
      paymentMethod,
      items,
      totals,
    });

    alert("Замовлення успішно оформлено! (це тестовий режим)");
  };

  const deliveryPrice =
    deliveryMethod === "pickup" ? 0 : "за тарифами перевізника";

  return (
    <div className="checkout">
      <div className="checkout__container">
        <h1 className="checkout__title">Оформлення замовлення</h1>

        <div className="checkout__layout">
          {/* Left side - Forms */}
          <div className="checkout__forms">
            {/* Contact Data Block */}
            <section className="checkout__section">
              <h2 className="checkout__section-title">Контактні дані</h2>

              <div className="checkout__form-group">
                <label className="checkout__label">
                  <User size={18} />
                  ПІБ
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={contactData.fullName}
                  onChange={handleContactChange}
                  placeholder="Введіть ваше ПІБ"
                  className="checkout__input"
                  required
                />
              </div>

              <div className="checkout__form-row">
                <div className="checkout__form-group">
                  <label className="checkout__label">
                    <Phone size={18} />
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleContactChange}
                    placeholder="+380 XX XXX XX XX"
                    className="checkout__input"
                    required
                  />
                </div>

                <div className="checkout__form-group">
                  <label className="checkout__label">
                    <Mail size={18} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleContactChange}
                    placeholder="example@mail.com"
                    className="checkout__input"
                    required
                  />
                </div>
              </div>

              <div className="checkout__form-group">
                <label className="checkout__label">
                  Коментар до замовлення (необов'язково)
                </label>
                <textarea
                  name="comment"
                  value={contactData.comment}
                  onChange={handleContactChange}
                  placeholder="Додайте коментар"
                  className="checkout__textarea"
                  rows="3"
                />
              </div>

              <div className="checkout__checkbox">
                <input
                  type="checkbox"
                  id="createAccount"
                  name="createAccount"
                  checked={contactData.createAccount}
                  onChange={handleContactChange}
                />
                <label htmlFor="createAccount">
                  Створити акаунт та зберегти дані
                </label>
              </div>
            </section>

            {/* Delivery Block */}
            <section className="checkout__section">
              <h2 className="checkout__section-title">Доставка</h2>
              <p className="checkout__section-subtitle">
                Оберіть спосіб доставки
              </p>

              <div className="checkout__delivery-grid">
                {deliveryOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`checkout__delivery-card ${
                      deliveryMethod === option.id ? "active" : ""
                    }`}
                    onClick={() => setDeliveryMethod(option.id)}
                  >
                    <div className="checkout__delivery-icon">{option.icon}</div>
                    <div className="checkout__delivery-info">
                      <h3 className="checkout__delivery-name">{option.name}</h3>
                      <p className="checkout__delivery-subtitle">
                        {option.subtitle}
                      </p>
                    </div>
                    {deliveryMethod === option.id && (
                      <CheckCircle
                        size={20}
                        className="checkout__delivery-check"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Delivery details based on selection */}
              {deliveryMethod && deliveryMethod !== "pickup" && (
                <div className="checkout__delivery-details">
                  <div className="checkout__form-group">
                    <label className="checkout__label">
                      <MapPin size={18} />
                      Місто
                    </label>
                    <div className="checkout__select-wrapper">
                      <select
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        className="checkout__select"
                        required
                      >
                        <option value="">Оберіть місто</option>
                        <option value="kyiv">Київ</option>
                        <option value="lviv">Львів</option>
                        <option value="odesa">Одеса</option>
                        <option value="kharkiv">Харків</option>
                        <option value="dnipro">Дніпро</option>
                      </select>
                      <ChevronDown
                        size={20}
                        className="checkout__select-icon"
                      />
                    </div>
                  </div>

                  {deliveryMethod === "courier" ? (
                    <div className="checkout__form-group">
                      <label className="checkout__label">Адреса доставки</label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Вулиця, будинок, квартира"
                        className="checkout__input"
                        required
                      />
                    </div>
                  ) : (
                    <div className="checkout__form-group">
                      <label className="checkout__label">
                        Відділення / Поштомат
                      </label>
                      <div className="checkout__select-wrapper">
                        <select
                          value={deliveryWarehouse}
                          onChange={(e) => setDeliveryWarehouse(e.target.value)}
                          className="checkout__select"
                          required
                        >
                          <option value="">Оберіть відділення</option>
                          <option value="1">Відділення №1</option>
                          <option value="2">Відділення №2</option>
                          <option value="3">Поштомат №15</option>
                        </select>
                        <ChevronDown
                          size={20}
                          className="checkout__select-icon"
                        />
                      </div>
                    </div>
                  )}

                  <div className="checkout__checkbox">
                    <input
                      type="checkbox"
                      id="saveDelivery"
                      checked={saveDeliveryInfo}
                      onChange={(e) => setSaveDeliveryInfo(e.target.checked)}
                    />
                    <label htmlFor="saveDelivery">
                      Запам'ятати інформацію про доставку
                    </label>
                  </div>
                </div>
              )}

              {/* Pickup map placeholder */}
              {deliveryMethod === "pickup" && (
                <div className="checkout__pickup-map">
                  <MapPin size={24} />
                  <p>Карта з точками самовивозу</p>
                  <small>вул. Прикладна, 1, Київ</small>
                </div>
              )}
            </section>

            {/* Payment Block */}
            <section className="checkout__section">
              <h2 className="checkout__section-title">Оплата</h2>
              <p className="checkout__section-subtitle">
                Оберіть спосіб оплати
              </p>

              <div className="checkout__payment-grid">
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`checkout__payment-card ${
                      paymentMethod === option.id ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod(option.id)}
                  >
                    <div className="checkout__payment-icon">{option.icon}</div>
                    <div className="checkout__payment-info">
                      <h3 className="checkout__payment-name">{option.name}</h3>
                      <p className="checkout__payment-subtitle">
                        {option.subtitle}
                      </p>
                    </div>
                    {paymentMethod === option.id && (
                      <CheckCircle
                        size={20}
                        className="checkout__payment-check"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="checkout__checkbox">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <label htmlFor="agreeTerms">
                  Погоджуюсь з{" "}
                  <a href="/terms" className="checkout__link">
                    умовами оферти
                  </a>{" "}
                  та{" "}
                  <a href="/privacy" className="checkout__link">
                    політикою конфіденційності
                  </a>
                </label>
              </div>
            </section>
          </div>

          {/* Right side - Order Summary (Sticky) */}
          <aside className="checkout__sidebar">
            <div className="checkout__summary">
              <h2 className="checkout__summary-title">Підсумок замовлення</h2>

              <div className="checkout__items">
                {items.map((item, index) => (
                  <div key={index} className="checkout__item">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="checkout__item-image"
                    />
                    <div className="checkout__item-info">
                      <h3 className="checkout__item-title">{item.title}</h3>
                      <p className="checkout__item-specs">
                        {item.size} • {item.firmness}
                      </p>
                      <p className="checkout__item-price">
                        {item.price} {currency} × {item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout__totals">
                <div className="checkout__total-row">
                  <span>Товари:</span>
                  <span>
                    {totals.subtotal} {currency}
                  </span>
                </div>
                <div className="checkout__total-row">
                  <span>Знижка:</span>
                  <span className="checkout__discount">
                    -{totals.discount} {currency}
                  </span>
                </div>
                <div className="checkout__total-row">
                  <span>Доставка:</span>
                  <span>
                    {typeof deliveryPrice === "number"
                      ? `${deliveryPrice} ${currency}`
                      : deliveryPrice}
                  </span>
                </div>
                <div className="checkout__total-row checkout__total-final">
                  <span>Разом:</span>
                  <span>
                    {totals.total} {currency}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmitOrder}
                className="checkout__submit-btn"
              >
                Оплатити зараз
              </button>

              <div className="checkout__help">
                <h3 className="checkout__help-title">
                  <HelpCircle size={20} />
                  Потрібна допомога?
                </h3>
                <p className="checkout__help-phone">+38 (XXX) XXX-XX-XX</p>
                <p className="checkout__help-time">
                  <Clock size={16} />
                  Пн-Нд: 8:00-20:00
                </p>

                <div className="checkout__help-faq">
                  <p className="checkout__help-faq-text">
                    FAQ з доставки та оплати
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
