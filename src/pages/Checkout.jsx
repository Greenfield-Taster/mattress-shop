import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import DeliveryAutocomplete from "../components/DeliveryAutocomplete/DeliveryAutocomplete";
import { getDeliveryAPI } from "../api/deliveryServices";
import { createOrder, formatOrderData } from "../api/orderApi";
import { sendOrderConfirmationEmail } from "../api/orderEmailService";
import {
  formatPhoneNumber,
  formatCardNumber,
  formatCardExpiry,
  formatCVV,
  formatEDRPOU,
  validateCheckoutForm,
  clearFieldError,
} from "../utils/checkoutValidation";
import LegalModal from "../components/LegalModal/LegalModal";
import { STORE_INFO } from "../utils/storeInfo";
import { normalizeError } from "../utils/errorMessages";
import usePageMeta from "../hooks/usePageMeta";
import { PAGE_SEO } from "../utils/seoData";
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
  HelpCircle,
} from "lucide-react";

const CheckoutItemImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const handleLoad = useCallback(() => setLoaded(true), []);
  return (
    <div className={`checkout__item-image ${!loaded ? "checkout__item-image--loading" : ""}`}>
      <img
        src={src}
        alt={alt}
        className={`checkout__item-img ${loaded ? "checkout__item-img--loaded" : ""}`}
        onLoad={handleLoad}
        onError={handleLoad}
      />
    </div>
  );
};

const Checkout = () => {
  usePageMeta(PAGE_SEO.checkout);
  const { items, totals, currency, promoCode, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate("/catalog", { replace: true });
    }
  }, [items.length, orderPlaced, navigate]);

  // Contact form state
  const [contactData, setContactData] = useState({
    fullName: user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.firstName || user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    comment: "",
    createAccount: false,
  });

  // Delivery state
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryCityRef, setDeliveryCityRef] = useState("");
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

  const [legalModal, setLegalModal] = useState({ isOpen: false, type: 'terms' });

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
      icon: <img src="/nova-poshta.png" alt="Нова Пошта" className="checkout__delivery-logo" />,
    },
    {
      id: "delivery",
      name: "Delivery",
      subtitle: "Відділення",
      icon: <img src="/delivery.png" alt="Delivery" className="checkout__delivery-logo" />,
    },
    {
      id: "cat",
      name: "SAT",
      subtitle: "Відділення",
      icon: <img src="/sat.png" alt="SAT" className="checkout__delivery-logo" />,
    },
    {
      id: "courier",
      name: "Кур'єр",
      subtitle: "Тільки Київ",
      icon: <Truck size={32} />,
    },
    {
      id: "pickup",
      name: "Самовивіз",
      subtitle: "Зі складу / магазину",
      icon: <Package size={32} />,
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

    alert(`🔄 Перенаправлення на ${paymentType}...\n(це тестовий режим)`);
    // Here would be Google/Apple Pay integration
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Prepare form data for validation
    const formData = {
      contactData,
      deliveryMethod,
      deliveryCity,
      deliveryCityRef,
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

    // Відправка замовлення на сервер
    setIsSubmitting(true);

    try {
      const orderData = formatOrderData(formData, items, totals, promoCode, deliveryInfo);
      const result = await createOrder(orderData);

      // Позначаємо що замовлення оформлено (щоб useEffect не редіректив на каталог)
      setOrderPlaced(true);

      // Очищуємо кошик
      clearCart();

      // Зберігаємо дані замовлення в localStorage для сторінки успіху
      const lastOrderData = {
        ...result.order,
        delivery_method: deliveryMethod,
        delivery_city: deliveryCity || null,
        delivery_warehouse: deliveryWarehouse || null,
        delivery_address: deliveryAddress || null,
      };
      localStorage.setItem("lastOrder", JSON.stringify(lastOrderData));

      // Відправляємо email з підтвердженням (fire-and-forget)
      sendOrderConfirmationEmail({
        orderNumber: result.order.order_number,
        email: formData.contactData.email,
        fullName: formData.contactData.fullName,
        items,
        totals,
        deliveryMethod,
        deliveryCity: deliveryCity || null,
        deliveryWarehouse: deliveryWarehouse || null,
        deliveryAddress: deliveryAddress || null,
        deliveryPrice: deliveryInfo?.price ?? 0,
        deliveryPriceType: deliveryInfo?.type || "free",
      });

      // Перенаправляємо на сторінку успіху
      navigate(`/order-success/${result.order.order_number}`);
    } catch (error) {
      console.error("❌ Помилка створення замовлення:", error);
      setSubmitError(
        normalizeError(error, "Помилка створення замовлення. Спробуйте ще раз.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функції для пошуку міст та відділень
  const handleCitySearch = async (query) => {
    const api = getDeliveryAPI(deliveryMethod);
    if (!api) return [];
    try {
      return await api.searchCities(query);
    } catch (error) {
      console.error("Помилка пошуку міст:", error);
      return [];
    }
  };

  const handleWarehouseSearch = async (query, cityRef) => {
    const effectiveCityRef = cityRef || deliveryCityRef;
    const api = getDeliveryAPI(deliveryMethod);
    if (!api || !effectiveCityRef) return [];

    try {
      // Завантажуємо відділення і поштомати паралельно
      const [warehouses, postomats] = await Promise.all([
        api.getWarehouses(effectiveCityRef, query),
        api.getPostomats ? api.getPostomats(effectiveCityRef) : [],
      ]);

      // Якщо є пошуковий запит — фільтруємо поштомати теж
      const filteredPostomats = query
        ? postomats.filter((p) =>
            p.label.toLowerCase().includes(query.toLowerCase()) ||
            (p.address && p.address.toLowerCase().includes(query.toLowerCase()))
          )
        : postomats;

      // Видаляємо дублікати (та ж локація може бути і відділенням, і поштоматом)
      const warehouseRefs = new Set(warehouses.map((w) => w.value));
      const uniquePostomats = filteredPostomats.filter((p) => !warehouseRefs.has(p.value));

      // Відділення першими, потім поштомати
      return [...warehouses, ...uniquePostomats];
    } catch (error) {
      console.error("Помилка пошуку відділень:", error);
      return [];
    }
  };

  const handleCityChange = (city) => {
    setDeliveryCity(city.label);
    setDeliveryCityRef(city.value);
    // Скидання відділення при зміні міста
    setDeliveryWarehouse("");
    clearError("deliveryCity");
  };

  const handleWarehouseChange = (warehouse) => {
    setDeliveryWarehouse(warehouse.label);
    clearError("deliveryWarehouse");
  };

  // Скидаємо дані доставки при зміні способу
  useEffect(() => {
    if (!deliveryMethod) return;

    setDeliveryCity("");
    setDeliveryCityRef("");
    setDeliveryWarehouse("");
    setDeliveryAddress("");

    if (deliveryMethod === "courier") {
      setDeliveryCity("Київ");
      setDeliveryCityRef("kyiv");
    }
  }, [deliveryMethod]);

  // Логіка ціни доставки на основі FAQ:
  // - Самовивіз: безкоштовно
  // - Кур'єр (Київ): безкоштовно від 8000 грн, інакше 500 грн
  // - Нова Пошта: безкоштовно від 8000 грн, інакше за тарифами
  // - Delivery / SAT: безкоштовно від 13000 грн, інакше за тарифами
  const getDeliveryPrice = () => {
    if (!deliveryMethod || deliveryMethod === "pickup") {
      return { price: 0, type: "free" };
    }
    if (deliveryMethod === "courier") {
      return totals.subtotal >= 8000
        ? { price: 0, type: "free" }
        : { price: 500, type: "fixed" };
    }
    if (deliveryMethod === "nova-poshta") {
      return totals.subtotal >= 8000
        ? { price: 0, type: "free" }
        : { price: null, type: "carrier" };
    }
    // delivery, cat (SAT)
    return totals.subtotal >= 13000
      ? { price: 0, type: "free" }
      : { price: null, type: "carrier" };
  };

  const deliveryInfo = getDeliveryPrice();
  const deliveryPrice = deliveryInfo.price;

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
              <p className="checkout__section-subtitle">
                Заповніть ваші контактні дані
              </p>
              <div className="checkout__form-group">
                <label htmlFor="fullName" className="checkout__label">
                  <User size={18} />
                  ПІБ
                </label>
                <input
                  type="text"
                  id="fullName"
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
                  <label htmlFor="phone" className="checkout__label">
                    <Phone size={18} />
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
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
                  <label htmlFor="email" className="checkout__label">
                    <Mail size={18} />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
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
                <label htmlFor="comment" className="checkout__label--comment">
                  Коментар до замовлення
                </label>
                <textarea
                  id="comment"
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
                  {/* Повідомлення для кур'єрської доставки */}
                  {deliveryMethod === "courier" && (
                    <div className="checkout__delivery-info-box">
                      <p className="checkout__delivery-info-text">
                        🚴 Кур'єрська доставка доступна тільки в межах Києва
                      </p>
                    </div>
                  )}

                  {/* Для кур'єрської доставки не показуємо поле вибору міста */}
                  {deliveryMethod !== "courier" && (
                    <div className="checkout__form-group">
                      <label htmlFor="deliveryCity" className="checkout__label">
                        <MapPin size={18} />
                        Місто
                      </label>
                      <DeliveryAutocomplete
                        id="deliveryCity"
                        type="city"
                        value={deliveryCity}
                        onChange={handleCityChange}
                        onSearch={handleCitySearch}
                        placeholder="Почніть вводити назву міста"
                        error={errors.deliveryCity}
                      />
                    </div>
                  )}

                  {deliveryMethod === "courier" ? (
                    <div className="checkout__form-group">
                      <label htmlFor="deliveryAddress" className="checkout__label">Адреса доставки</label>
                      <input
                        type="text"
                        id="deliveryAddress"
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
                      <label htmlFor="deliveryWarehouse" className="checkout__label">
                        {deliveryMethod === "nova-poshta" ? "Відділення / Поштомат" : "Відділення"}
                      </label>
                      <DeliveryAutocomplete
                        id="deliveryWarehouse"
                        type="warehouse"
                        value={deliveryWarehouse}
                        onChange={handleWarehouseChange}
                        onSearch={handleWarehouseSearch}
                        placeholder="Почніть вводити номер або адресу"
                        error={errors.deliveryWarehouse}
                        cityRef={deliveryCityRef}
                        disabled={!deliveryCityRef}
                      />
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

              {deliveryMethod === "pickup" && (
                <div className="checkout__pickup-info">
                  <div className="checkout__pickup-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="checkout__pickup-details">
                    <h3 className="checkout__pickup-title">
                      Точка самовивозу
                    </h3>
                    <p className="checkout__pickup-address">
                      {STORE_INFO.pickupAddress}
                    </p>
                    <p className="checkout__pickup-hours">
                      <Clock size={16} />
                      {STORE_INFO.pickupHours}
                    </p>
                  </div>
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
                    <label htmlFor="cardNumber" className="checkout__label">
                      <CreditCard size={18} />
                      Номер картки
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
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
                      <label htmlFor="cardExpiry" className="checkout__label">Термін дії</label>
                      <input
                        type="text"
                        id="cardExpiry"
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
                      <label htmlFor="cardCvv" className="checkout__label">CVV</label>
                      <input
                        type="text"
                        id="cardCvv"
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
                    <label htmlFor="cardHolder" className="checkout__label">
                      Ім'я власника картки
                    </label>
                    <input
                      type="text"
                      id="cardHolder"
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
                    <label htmlFor="companyName" className="checkout__label">Назва компанії</label>
                    <input
                      type="text"
                      id="companyName"
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
                    <label htmlFor="edrpou" className="checkout__label">ЄДРПОУ</label>
                    <input
                      type="text"
                      id="edrpou"
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
                    <label htmlFor="companyAddress" className="checkout__label">Юридична адреса</label>
                    <input
                      type="text"
                      id="companyAddress"
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
                  <button
                    type="button"
                    className="checkout__link"
                    onClick={(e) => {
                      e.preventDefault();
                      setLegalModal({ isOpen: true, type: "terms" });
                    }}
                  >
                    умовами оферти
                  </button>{" "}
                  та{" "}
                  <button
                    type="button"
                    className="checkout__link"
                    onClick={(e) => {
                      e.preventDefault();
                      setLegalModal({ isOpen: true, type: "privacy" });
                    }}
                  >
                    політикою конфіденційності
                  </button>
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
                    <CheckoutItemImage src={item.image} alt={item.title} />
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
                    {deliveryInfo.type === "free"
                      ? "Безкоштовно"
                      : deliveryInfo.type === "fixed"
                        ? `${deliveryPrice} ${currency}`
                        : !deliveryMethod
                          ? "Оберіть спосіб доставки"
                          : "За тарифами перевізника"}
                  </span>
                </div>
                <div className="checkout__total-row checkout__total-final">
                  <span>Разом:</span>
                  <span>
                    {totals.total + (typeof deliveryPrice === "number" ? deliveryPrice : 0)} {currency}
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="checkout__submit-error">{submitError}</div>
              )}

              <button
                type="submit"
                onClick={handleSubmitOrder}
                className="checkout__submit-btn"
                disabled={isSubmitting || items.length === 0}
              >
                {isSubmitting
                  ? "Оформлення..."
                  : paymentMethod === "card-online"
                  ? "Оплатити зараз"
                  : "Оформити замовлення"}
              </button>

              <div className="checkout__help">
                <h3 className="checkout__help-title">
                  <HelpCircle size={20} />
                  Потрібна допомога?
                </h3>
                <p className="checkout__help-phone">+380 (50) 123-45-67</p>
                <p className="checkout__help-time">
                  <Clock size={16} />
                  Пн-Пт: 9:00-18:00, Сб: 10:00-16:00
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

      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={() => setLegalModal({ isOpen: false, type: legalModal.type })}
        type={legalModal.type}
      />
    </div>
  );
};

export default Checkout;
