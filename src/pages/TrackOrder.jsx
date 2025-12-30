import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Search,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowLeft,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { getOrder } from "../api/orderApi";
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
      orders.unshift(orderNumber); // Додаємо на початок
      // Зберігаємо максимум 10 останніх замовлень
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
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
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

  // Завантажуємо збережені номери при монтуванні
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

      // Зберігаємо номер після успішного пошуку
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
    // Автоматично шукаємо
    setLoading(true);
    getOrder(savedNumber)
      .then((result) => {
        setOrder(result.order || result);
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

  return (
    <div className="track-order">
      <div className="track-order__container">
        <div className="track-order__header">
          <Link to="/" className="track-order__back">
            <ArrowLeft size={20} />
            На головну
          </Link>
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
              placeholder="Номер замовлення (напр. ORD-2024-12345)"
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

            <div className="track-order__result-details">
              {order.created_at && (
                <div className="track-order__detail-row">
                  <span>Дата замовлення:</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>
              )}

              {(order.total || order.totals?.total) && (
                <div className="track-order__detail-row">
                  <span>Сума:</span>
                  <strong>{order.total || order.totals?.total} ₴</strong>
                </div>
              )}

              {order.delivery_address && (
                <div className="track-order__detail-row">
                  <span>Адреса доставки:</span>
                  <span>{order.delivery_address}</span>
                </div>
              )}

              {order.contact_data?.fullName && (
                <div className="track-order__detail-row">
                  <span>Отримувач:</span>
                  <span>{order.contact_data.fullName}</span>
                </div>
              )}
            </div>

            {/* Товари в замовленні */}
            {order.items && order.items.length > 0 && (
              <div className="track-order__items">
                <h4>Товари в замовленні:</h4>
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
                        {item.size && (
                          <span className="track-order__item-size">
                            Розмір: {item.size}
                          </span>
                        )}
                        <span className="track-order__item-qty">
                          Кількість: {item.qty || item.quantity || 1}
                        </span>
                      </div>
                      <span className="track-order__item-price">
                        {item.price} ₴
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="track-order__new-search"
              onClick={() => {
                setOrder(null);
                setOrderNumber("");
              }}
            >
              Шукати інше замовлення
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
