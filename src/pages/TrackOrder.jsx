import { useState, useEffect } from "react";
import {
  Package,
  Search,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Trash2,
  Copy,
  Check,
  MapPin,
  CreditCard,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { getOrder } from "../api/orderApi";
import { STORE_INFO, DELIVERY_METHOD_LABELS, getDeliveryDestination } from "../utils/storeInfo";
import usePageMeta from "../hooks/usePageMeta";
import { PAGE_SEO } from "../utils/seoData";
import "../styles/pages/_track-order.scss";

// Конфігурація статусів замовлень
const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Очікує обробки",
    icon: Clock,
    color: "warning",
  },
  confirmed: {
    label: "Підтверджено",
    icon: CheckCircle,
    color: "info",
  },
  processing: {
    label: "Обробляється",
    icon: Clock,
    color: "warning",
  },
  shipping: {
    label: "В дорозі",
    icon: Truck,
    color: "info",
  },
  delivered: {
    label: "Доставлено",
    icon: CheckCircle,
    color: "success",
  },
  cancelled: {
    label: "Скасовано",
    icon: XCircle,
    color: "error",
  },
};

// Порядок кроків для прогрес-бару (без cancelled)
const STATUS_STEPS = [
  { key: "pending", label: "Нове" },
  { key: "confirmed", label: "Підтверджено" },
  { key: "processing", label: "Обробка" },
  { key: "shipping", label: "В дорозі" },
  { key: "delivered", label: "Доставлено" },
];

const PAYMENT_STATUS_LABELS = {
  pending: "Очікує оплати",
  paid: "Оплачено",
  failed: "Помилка оплати",
  refunded: "Повернено",
};

const PAYMENT_METHOD_LABELS = {
  "cash-on-delivery": "При отриманні",
  "card-online": "Картка онлайн",
  "google-apple-pay": "Google/Apple Pay",
  invoice: "Рахунок",
};

// Ключ для збереження номерів замовлень в localStorage
const SAVED_ORDERS_KEY = "savedOrderNumbers";

// Функції для роботи з localStorage
const getSavedOrders = () => {
  try {
    const saved = localStorage.getItem(SAVED_ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveOrderNumber = (orderNumber) => {
  try {
    const orders = getSavedOrders();
    if (!orders.includes(orderNumber)) {
      orders.unshift(orderNumber);
      const trimmed = orders.slice(0, 10);
      localStorage.setItem(SAVED_ORDERS_KEY, JSON.stringify(trimmed));
    }
  } catch (error) {
    console.error("Error saving order number:", error);
  }
};

const removeOrderNumber = (orderNumber) => {
  try {
    const orders = getSavedOrders();
    const filtered = orders.filter((num) => num !== orderNumber);
    localStorage.setItem(SAVED_ORDERS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing order number:", error);
  }
};

const TrackOrder = () => {
  usePageMeta(PAGE_SEO.trackOrder);
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedOrders, setSavedOrders] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleCopyOrderNumber = async () => {
    const numberToCopy = order?.order_number || order?.id;
    if (!numberToCopy) return;

    try {
      await navigator.clipboard.writeText(numberToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    setSavedOrders(getSavedOrders());
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    const searchNumber = orderNumber.trim();

    if (!searchNumber) {
      setError("Введіть номер замовлення");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const result = await getOrder(searchNumber);
      setOrder(result.order || result);
      setIsOwner(result.is_owner || false);

      saveOrderNumber(searchNumber);
      setSavedOrders(getSavedOrders());
    } catch (err) {
      console.error("Order search error:", err);
      setError("Замовлення не знайдено. Перевірте номер і спробуйте ще раз.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSavedOrderClick = (savedNumber) => {
    setOrderNumber(savedNumber);
    setError("");
    setLoading(true);
    getOrder(savedNumber)
      .then((result) => {
        setOrder(result.order || result);
        setIsOwner(result.is_owner || false);
        setError("");
      })
      .catch((err) => {
        console.error("Order search error:", err);
        setError("Замовлення не знайдено. Можливо, воно було видалено.");
        setOrder(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveSavedOrder = (e, orderNum) => {
    e.stopPropagation();
    removeOrderNumber(orderNum);
    setSavedOrders(getSavedOrders());
  };

  const getStatusConfig = (status) => {
    return (
      ORDER_STATUS_CONFIG[status] || {
        label: status || "Невідомий",
        icon: Clock,
        color: "warning",
      }
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (amount) => {
    if (amount == null) return "0 ₴";
    return `${Number(amount).toLocaleString("uk-UA")} ₴`;
  };

  // Визначаємо поточний індекс статусу для прогрес-бару
  const getStatusStepIndex = (status) => {
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : -1;
  };

  const getDeliveryPriceLabel = (order) => {
    if (!order) return null;
    const type = order.delivery_price_type;
    const price = order.delivery_price;

    if (type === "free" || (!price && type !== "carrier")) return "Безкоштовно";
    if (type === "carrier") return "За тарифами перевізника";
    if (price > 0) return formatMoney(price);
    return "Безкоштовно";
  };

  const customerName = order?.full_name || order?.contact_data?.fullName;

  return (
    <div className="track-order">
      <div className="track-order__container">
        <div className="track-order__header">
          <h1 className="track-order__title">
            <Package size={32} />
            Відстеження замовлення
          </h1>
          <p className="track-order__subtitle">
            Введіть номер замовлення, щоб перевірити його статус
          </p>
        </div>

        <form onSubmit={handleSearch} className="track-order__form">
          <div className="track-order__input-wrapper">
            <Search size={20} className="track-order__input-icon" />
            <input
              type="text"
              className="track-order__input"
              placeholder="Номер замовлення (напр. 12345678)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="track-order__submit"
            disabled={loading || !orderNumber.trim()}
          >
            {loading ? "Пошук..." : "Знайти"}
          </button>
        </form>

        {error && <div className="track-order__error">{error}</div>}

        {/* Збережені замовлення */}
        {savedOrders.length > 0 && !order && (
          <div className="track-order__saved">
            <h3 className="track-order__saved-title">Ваші замовлення</h3>
            <div className="track-order__saved-list">
              {savedOrders.map((savedNum) => (
                <div
                  key={savedNum}
                  className="track-order__saved-item"
                  onClick={() => handleSavedOrderClick(savedNum)}
                >
                  <Package size={16} />
                  <span>{savedNum}</span>
                  <button
                    className="track-order__saved-remove"
                    onClick={(e) => handleRemoveSavedOrder(e, savedNum)}
                    title="Видалити"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Результат пошуку */}
        {order && (
          <div className="track-order__result">
            {/* Шапка замовлення */}
            <div className="track-order__result-header">
              <div className="track-order__result-info">
                <span className="track-order__result-label">Замовлення</span>
                <div className="track-order__result-number">
                  <strong>{order.order_number || order.id}</strong>
                  <button
                    className={`track-order__copy-btn ${copied ? "track-order__copy-btn--copied" : ""}`}
                    onClick={handleCopyOrderNumber}
                    title={copied ? "Скопійовано!" : "Копіювати номер"}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                {order.created_at && (
                  <span className="track-order__result-date">
                    {formatDate(order.created_at)}
                  </span>
                )}
              </div>
              <div
                className={`track-order__status track-order__status--${
                  getStatusConfig(order.status).color
                }`}
              >
                {(() => {
                  const StatusIcon = getStatusConfig(order.status).icon;
                  return <StatusIcon size={18} />;
                })()}
                {getStatusConfig(order.status).label}
              </div>
            </div>

            {/* Прогрес-бар статусу */}
            {order.status !== "cancelled" && (
              <div className="track-order__progress">
                {STATUS_STEPS.map((step, index) => {
                  const currentIdx = getStatusStepIndex(order.status);
                  const isCompleted = index <= currentIdx;
                  const isCurrent = index === currentIdx;
                  return (
                    <div
                      key={step.key}
                      className={`track-order__progress-step ${
                        isCompleted ? "track-order__progress-step--completed" : ""
                      } ${isCurrent ? "track-order__progress-step--current" : ""}`}
                    >
                      <div className="track-order__progress-dot">
                        {isCompleted ? <Check size={12} /> : <span>{index + 1}</span>}
                      </div>
                      <span className="track-order__progress-label">{step.label}</span>
                      {index < STATUS_STEPS.length - 1 && (
                        <div
                          className={`track-order__progress-line ${
                            index < currentIdx ? "track-order__progress-line--filled" : ""
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Скасоване замовлення */}
            {order.status === "cancelled" && (
              <div className="track-order__cancelled-banner">
                <XCircle size={20} />
                <span>Це замовлення було скасовано</span>
              </div>
            )}

            {/* Секції з деталями */}
            <div className="track-order__sections">
              {/* Отримувач */}
              {customerName && (
                <div className="track-order__section">
                  <div className="track-order__section-header">
                    <ShieldCheck size={18} />
                    <h4>Отримувач</h4>
                  </div>
                  <div className="track-order__section-body">
                    <div className="track-order__detail-row">
                      <span>ПІБ:</span>
                      <span>{customerName}</span>
                    </div>
                    {isOwner && order.phone && (
                      <div className="track-order__detail-row">
                        <span>Телефон:</span>
                        <span>{order.phone}</span>
                      </div>
                    )}
                    {isOwner && order.email && (
                      <div className="track-order__detail-row">
                        <span>Email:</span>
                        <span>{order.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Доставка */}
              {order.delivery_method && (
                <div className="track-order__section">
                  <div className="track-order__section-header">
                    <Truck size={18} />
                    <h4>Доставка</h4>
                  </div>
                  <div className="track-order__section-body">
                    <div className="track-order__detail-row">
                      <span>Спосіб:</span>
                      <span>
                        {DELIVERY_METHOD_LABELS[order.delivery_method] ||
                          order.delivery_method}
                      </span>
                    </div>

                    {order.delivery_method === "pickup" ? (
                      <div className="track-order__pickup-info">
                        <MapPin size={18} />
                        <div>
                          <p className="track-order__pickup-address">
                            {STORE_INFO.pickupAddress}
                          </p>
                          <p className="track-order__pickup-hours">
                            <Clock size={14} />
                            {STORE_INFO.pickupHours}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {order.delivery_city && (
                          <div className="track-order__detail-row">
                            <span>Місто:</span>
                            <span>{order.delivery_city}</span>
                          </div>
                        )}
                        {order.delivery_warehouse && (
                          <div className="track-order__detail-row">
                            <span>Відділення:</span>
                            <span>{order.delivery_warehouse}</span>
                          </div>
                        )}
                        {order.delivery_address && (
                          <div className="track-order__detail-row">
                            <span>Адреса:</span>
                            <span>{order.delivery_address}</span>
                          </div>
                        )}
                      </>
                    )}

                    <div className="track-order__detail-row">
                      <span>Вартість доставки:</span>
                      <span className={order.delivery_price_type === "free" ? "track-order__free-delivery" : ""}>
                        {getDeliveryPriceLabel(order)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Оплата (для власника) */}
              {(order.payment_method || order.payment_status) && (
                <div className="track-order__section">
                  <div className="track-order__section-header">
                    <CreditCard size={18} />
                    <h4>Оплата</h4>
                  </div>
                  <div className="track-order__section-body">
                    {order.payment_method && (
                      <div className="track-order__detail-row">
                        <span>Спосіб:</span>
                        <span>
                          {PAYMENT_METHOD_LABELS[order.payment_method] ||
                            order.payment_method}
                        </span>
                      </div>
                    )}
                    {order.payment_status && (
                      <div className="track-order__detail-row">
                        <span>Статус:</span>
                        <span
                          className={`track-order__payment-badge track-order__payment-badge--${order.payment_status}`}
                        >
                          {PAYMENT_STATUS_LABELS[order.payment_status] ||
                            order.payment_status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Коментар (для власника) */}
              {isOwner && order.comment && (
                <div className="track-order__section">
                  <div className="track-order__section-header">
                    <Package size={18} />
                    <h4>Коментар</h4>
                  </div>
                  <div className="track-order__section-body">
                    <p className="track-order__comment">{order.comment}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Товари в замовленні */}
            {order.items && order.items.length > 0 && (
              <div className="track-order__items">
                <h4 className="track-order__items-title">
                  Товари
                  <span className="track-order__items-count">
                    {order.items.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0)} шт.
                  </span>
                </h4>
                <div className="track-order__items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="track-order__item">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="track-order__item-image"
                        />
                      )}
                      <div className="track-order__item-info">
                        <span className="track-order__item-title">
                          {item.title}
                        </span>
                        {(item.size || item.firmness) && (
                          <span className="track-order__item-meta">
                            {[item.size, item.firmness].filter(Boolean).join(" | ")}
                          </span>
                        )}
                        <span className="track-order__item-qty">
                          {(item.quantity || item.qty || 1)} x {formatMoney(item.price)}
                        </span>
                      </div>
                      <span className="track-order__item-total">
                        {formatMoney(item.total || item.price * (item.quantity || item.qty || 1))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Підсумок — чек */}
            <div className="track-order__summary">
              <div className="track-order__summary-row">
                <span>Сума товарів</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>

              {order.delivery_price > 0 && (
                <div className="track-order__summary-row">
                  <span>Доставка</span>
                  <span>{formatMoney(order.delivery_price)}</span>
                </div>
              )}
              {order.delivery_price_type === "free" && (
                <div className="track-order__summary-row">
                  <span>Доставка</span>
                  <span className="track-order__free-delivery">Безкоштовно</span>
                </div>
              )}
              {order.delivery_price_type === "carrier" && !order.delivery_price && (
                <div className="track-order__summary-row">
                  <span>Доставка</span>
                  <span className="track-order__carrier-note">За тарифами</span>
                </div>
              )}

              {order.discount > 0 && (
                <div className="track-order__summary-row track-order__summary-row--discount">
                  <span>
                    Знижка
                    {order.promo_code && ` (${order.promo_code})`}
                  </span>
                  <span>-{formatMoney(order.discount)}</span>
                </div>
              )}

              <div className="track-order__summary-total">
                <span>Разом до сплати</span>
                <span>{formatMoney(order.total)}</span>
              </div>
            </div>

            <button
              className="track-order__new-search"
              onClick={() => {
                setOrder(null);
                setOrderNumber("");
                setIsOwner(false);
              }}
            >
              <Search size={16} />
              Шукати інше замовлення
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
