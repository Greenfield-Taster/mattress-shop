import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import {
  formatPhoneNumber,
  formatCardNumber,
  formatCardExpiry,
  formatCVV,
  formatEDRPOU,
  validateCheckoutForm,
  clearFieldError,
} from "../utils/checkoutValidation";
import "../styles/pages/_checkout.scss";

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

  const [paymentMethod, setPaymentMethod] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [edrpou, setEdrpou] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    email: "",
    deliveryMethod: "",
    deliveryCity: "",
    deliveryAddress: "",
    deliveryWarehouse: "",
    paymentMethod: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardHolder: "",
    companyName: "",
    edrpou: "",
    companyAddress: "",
    agreeToTerms: "",
  });

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

  // Clear error when field is changed
  const clearError = (fieldName) => {
    setErrors((prev) => clearFieldError(prev, fieldName));
  };

  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setContactData((prev) => ({ ...prev, phone: formatted }));
    } else {
      setContactData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    clearError(name);
  };

  // Handle card number change with formatting
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    clearError("cardNumber");
  };

  // Handle card expiry change with formatting
  const handleCardExpiryChange = (e) => {
    const formatted = formatCardExpiry(e.target.value);
    setCardExpiry(formatted);
    clearError("cardExpiry");
  };

  // Handle CVV change with formatting
  const handleCVVChange = (e) => {
    const formatted = formatCVV(e.target.value);
    setCardCvv(formatted);
    clearError("cardCvv");
  };

  // Handle EDRPOU change with formatting
  const handleEDRPOUChange = (e) => {
    const formatted = formatEDRPOU(e.target.value);
    setEdrpou(formatted);
    clearError("edrpou");
  };

  // Handle Google/Apple Pay
  const handleGoogleApplePay = (paymentType) => {
    // Validate all required fields
    const formData = {
      contactData,
      deliveryMethod,
      deliveryCity,
      deliveryAddress,
      deliveryWarehouse,
      paymentMethod: "google-apple-pay",
      paymentData: {},
      agreeToTerms,
    };

    const newErrors = validateCheckoutForm(formData);
    setErrors(newErrors);

    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element =
        document.querySelector(`[name="${firstErrorField}"]`) ||
        document.querySelector(`.checkout__section`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    console.log(`Initiating ${paymentType} payment...`);
    alert(`🔄 Перенаправлення на ${paymentType}...\n(це тестовий режим)`);
    // Here would be Google/Apple Pay integration
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    // Prepare form data for validation
    const formData = {
      contactData,
      deliveryMethod,
      deliveryCity,
      deliveryAddress,
      deliveryWarehouse,
      paymentMethod,
      paymentData: {
        cardNumber,
        cardExpiry,
        cardCvv,
        cardHolder,
        companyName,
        edrpou,
        companyAddress,
      },
      agreeToTerms,
    };

    // Validate all form data
    const newErrors = validateCheckoutForm(formData);
    setErrors(newErrors);

    // If there are errors, scroll to first error
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element =
        document.querySelector(`[name="${firstErrorField}"]`) ||
        document.querySelector(`.checkout__section`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
                  className={`checkout__input ${
                    errors.fullName ? "error" : ""
                  }`}
                  required
                />
                {errors.fullName && (
                  <span className="checkout__error">{errors.fullName}</span>
                )}
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
                    placeholder="0XX XXX XX XX"
                    className={`checkout__input ${errors.phone ? "error" : ""}`}
                    required
                  />
                  {errors.phone && (
                    <span className="checkout__error">{errors.phone}</span>
                  )}
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
                    className={`checkout__input ${errors.email ? "error" : ""}`}
                    required
                  />
                  {errors.email && (
                    <span className="checkout__error">{errors.email}</span>
                  )}
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
              {errors.deliveryMethod && (
                <div className="checkout__section-error">
                  {errors.deliveryMethod}
                </div>
              )}

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
                        onChange={(e) => {
                          setDeliveryCity(e.target.value);
                          clearError("deliveryCity");
                        }}
                        className={`checkout__select ${
                          errors.deliveryCity ? "error" : ""
                        }`}
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
                    {errors.deliveryCity && (
                      <span className="checkout__error">
                        {errors.deliveryCity}
                      </span>
                    )}
                  </div>

                  {deliveryMethod === "courier" ? (
                    <div className="checkout__form-group">
                      <label className="checkout__label">Адреса доставки</label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => {
                          setDeliveryAddress(e.target.value);
                          clearError("deliveryAddress");
                        }}
                        placeholder="Вулиця, будинок, квартира"
                        className={`checkout__input ${
                          errors.deliveryAddress ? "error" : ""
                        }`}
                        required
                      />
                      {errors.deliveryAddress && (
                        <span className="checkout__error">
                          {errors.deliveryAddress}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="checkout__form-group">
                      <label className="checkout__label">
                        Відділення / Поштомат
                      </label>
                      <div className="checkout__select-wrapper">
                        <select
                          value={deliveryWarehouse}
                          onChange={(e) => {
                            setDeliveryWarehouse(e.target.value);
                            clearError("deliveryWarehouse");
                          }}
                          className={`checkout__select ${
                            errors.deliveryWarehouse ? "error" : ""
                          }`}
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
                      {errors.deliveryWarehouse && (
                        <span className="checkout__error">
                          {errors.deliveryWarehouse}
                        </span>
                      )}
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
              {errors.paymentMethod && (
                <div className="checkout__section-error">
                  {errors.paymentMethod}
                </div>
              )}

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

              {/* Dynamic payment forms based on selected method */}
              {paymentMethod === "cash-on-delivery" && (
                <div className="checkout__payment-details">
                  <div className="checkout__payment-info-box">
                    <p className="checkout__payment-info-text">
                      💵 Ви зможете оплатити замовлення готівкою або карткою при
                      отриманні товару.
                    </p>
                    <p className="checkout__payment-info-note">
                      Зверніть увагу: при оплаті на пошті можлива комісія
                      перевізника.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === "card-online" && (
                <div className="checkout__payment-details">
                  <div className="checkout__form-group">
                    <label className="checkout__label">
                      <CreditCard size={18} />
                      Номер картки
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className={`checkout__input ${
                        errors.cardNumber ? "error" : ""
                      }`}
                      maxLength="19"
                      required
                    />
                    {errors.cardNumber && (
                      <span className="checkout__error">
                        {errors.cardNumber}
                      </span>
                    )}
                  </div>

                  <div className="checkout__form-row">
                    <div className="checkout__form-group">
                      <label className="checkout__label">Термін дії</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        placeholder="MM/YY"
                        className={`checkout__input ${
                          errors.cardExpiry ? "error" : ""
                        }`}
                        maxLength="5"
                        required
                      />
                      {errors.cardExpiry && (
                        <span className="checkout__error">
                          {errors.cardExpiry}
                        </span>
                      )}
                    </div>

                    <div className="checkout__form-group">
                      <label className="checkout__label">CVV</label>
                      <input
                        type="text"
                        name="cardCvv"
                        value={cardCvv}
                        onChange={handleCVVChange}
                        placeholder="123"
                        className={`checkout__input ${
                          errors.cardCvv ? "error" : ""
                        }`}
                        maxLength="3"
                        required
                      />
                      {errors.cardCvv && (
                        <span className="checkout__error">
                          {errors.cardCvv}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="checkout__form-group">
                    <label className="checkout__label">
                      Ім'я власника картки
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={cardHolder}
                      onChange={(e) => {
                        setCardHolder(e.target.value);
                        clearError("cardHolder");
                      }}
                      placeholder="TARAS SHEVCHENKO"
                      className={`checkout__input ${
                        errors.cardHolder ? "error" : ""
                      }`}
                      required
                    />
                    {errors.cardHolder && (
                      <span className="checkout__error">
                        {errors.cardHolder}
                      </span>
                    )}
                  </div>

                  <div className="checkout__payment-security">
                    <p>🔒 Ваші дані захищені SSL-шифруванням</p>
                  </div>
                </div>
              )}

              {paymentMethod === "google-apple-pay" && (
                <div className="checkout__payment-details">
                  <div className="checkout__payment-buttons">
                    <button
                      className="checkout__payment-button checkout__payment-button--google"
                      onClick={() => handleGoogleApplePay("Google Pay")}
                      type="button"
                    >
                      <img
                        src="/google-pay-logo.png"
                        alt="Google Pay"
                        className="checkout__payment-logo"
                      />
                    </button>
                    <button
                      className="checkout__payment-button checkout__payment-button--apple"
                      onClick={() => handleGoogleApplePay("Apple Pay")}
                      type="button"
                    >
                      <img
                        src="/apple-pay-logo.png"
                        alt="Apple Pay"
                        className="checkout__payment-logo"
                      />
                    </button>
                  </div>
                  <div className="checkout__payment-info-box">
                    <p className="checkout__payment-info-text">
                      📱 Оберіть зручний спосіб оплати.
                    </p>
                    <p className="checkout__payment-info-note">
                      Переконайтесь, що ваш пристрій підтримує обраний спосіб
                      оплати.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === "invoice" && (
                <div className="checkout__payment-details">
                  <div className="checkout__form-group">
                    <label className="checkout__label">Назва компанії</label>
                    <input
                      type="text"
                      name="companyName"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        clearError("companyName");
                      }}
                      placeholder="ТОВ 'Назва компанії'"
                      className={`checkout__input ${
                        errors.companyName ? "error" : ""
                      }`}
                      required
                    />
                    {errors.companyName && (
                      <span className="checkout__error">
                        {errors.companyName}
                      </span>
                    )}
                  </div>

                  <div className="checkout__form-group">
                    <label className="checkout__label">ЄДРПОУ</label>
                    <input
                      type="text"
                      name="edrpou"
                      value={edrpou}
                      onChange={handleEDRPOUChange}
                      placeholder="12345678"
                      className={`checkout__input ${
                        errors.edrpou ? "error" : ""
                      }`}
                      maxLength="8"
                      required
                    />
                    {errors.edrpou && (
                      <span className="checkout__error">{errors.edrpou}</span>
                    )}
                  </div>

                  <div className="checkout__form-group">
                    <label className="checkout__label">Юридична адреса</label>
                    <input
                      type="text"
                      name="companyAddress"
                      value={companyAddress}
                      onChange={(e) => {
                        setCompanyAddress(e.target.value);
                        clearError("companyAddress");
                      }}
                      placeholder="Місто, вулиця, будинок"
                      className={`checkout__input ${
                        errors.companyAddress ? "error" : ""
                      }`}
                      required
                    />
                    {errors.companyAddress && (
                      <span className="checkout__error">
                        {errors.companyAddress}
                      </span>
                    )}
                  </div>

                  <div className="checkout__payment-info-box">
                    <p className="checkout__payment-info-text">
                      🧾 Рахунок буде надіслано на вказану email-адресу протягом
                      1 робочого дня.
                    </p>
                  </div>
                </div>
              )}

              <div className="checkout__checkbox">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    clearError("agreeToTerms");
                  }}
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
              {errors.agreeToTerms && (
                <div
                  className="checkout__section-error"
                  style={{ marginTop: "12px" }}
                >
                  {errors.agreeToTerms}
                </div>
              )}
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
                {paymentMethod === "card-online"
                  ? "Оплатити зараз"
                  : "Оформити замовлення"}
              </button>

              <div className="checkout__help">
                <h3 className="checkout__help-title">
                  <HelpCircle size={20} />
                  Потрібна допомога?
                </h3>
                <p className="checkout__help-phone">+38 (066) 666-66-66</p>
                <p className="checkout__help-time">
                  <Clock size={16} />
                  Пн-Нд: 8:00-20:00
                </p>

                <div className="checkout__help-faq">
                  <Link to="/contacts#faq" className="checkout__help-faq-link">
                    FAQ з доставки та оплати
                  </Link>
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
