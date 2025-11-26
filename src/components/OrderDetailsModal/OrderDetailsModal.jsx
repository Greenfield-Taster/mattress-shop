import { useEffect } from "react";
import { Package, Calendar, Truck, CreditCard, X, CheckCircle, Clock, XCircle } from "lucide-react";
import "./OrderDetailsModal.scss";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  // Блокування скролу body коли модальне вікно відкрите
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  // Конфігурація статусів
  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        label: "Доставлено",
        icon: CheckCircle,
        color: "success",
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
      cancelled: {
        label: "Скасовано",
        icon: XCircle,
        color: "error",
      },
    };
    return configs[status] || configs.processing;
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  // Форматування дати
  const formatDate = (dateString) => {
    if (!dateString) return "Нещодавно";
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="order-details-modal">
      <div className="order-details-modal__overlay" onClick={onClose} />
      <div className="order-details-modal__container">
        <div className="order-details-modal__header">
          <div className="order-details-modal__header-left">
            <Package size={24} />
            <h2 className="order-details-modal__title">Замовлення {order.id}</h2>
          </div>
          <button
            className="order-details-modal__close"
            onClick={onClose}
            aria-label="Закрити"
          >
            <X size={24} />
          </button>
        </div>

        <div className="order-details-modal__content">
          {/* Статус та дата */}
          <div className="order-details-modal__info">
            <div className="order-details-modal__info-item">
              <Calendar size={18} />
              <span className="order-details-modal__info-label">Дата замовлення:</span>
              <span className="order-details-modal__info-value">{formatDate(order.date)}</span>
            </div>
            <div className={`order-details-modal__status order-details-modal__status--${statusConfig.color}`}>
              <StatusIcon size={18} />
              <span>{statusConfig.label}</span>
            </div>
          </div>

          {/* Список товарів */}
          <div className="order-details-modal__section">
            <h3 className="order-details-modal__section-title">Товари в замовленні</h3>
            <div className="order-details-modal__items">
              {order.items.map((item) => (
                <div key={item.id} className="order-details-item">
                  <div className="order-details-item__image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="order-details-item__info">
                    <h4 className="order-details-item__name">{item.name}</h4>
                    <p className="order-details-item__size">Розмір: {item.size}</p>
                    <p className="order-details-item__quantity">Кількість: {item.quantity} шт.</p>
                  </div>
                  <div className="order-details-item__price">
                    {(item.price * item.quantity).toLocaleString("uk-UA")} ₴
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Адреса доставки */}
          <div className="order-details-modal__section">
            <h3 className="order-details-modal__section-title">Доставка</h3>
            <div className="order-details-modal__delivery">
              <Truck size={18} />
              <span>{order.deliveryAddress}</span>
            </div>
          </div>

          {/* Підсумок */}
          <div className="order-details-modal__summary">
            <div className="order-details-modal__summary-row">
              <span>Сума товарів:</span>
              <span>{order.total.toLocaleString("uk-UA")} ₴</span>
            </div>
            <div className="order-details-modal__summary-row">
              <span>Доставка:</span>
              <span>Безкоштовно</span>
            </div>
            <div className="order-details-modal__summary-row order-details-modal__summary-row--total">
              <span>Загальна сума:</span>
              <span>{order.total.toLocaleString("uk-UA")} ₴</span>
            </div>
          </div>
        </div>

        <div className="order-details-modal__footer">
          <button className="order-details-modal__button" onClick={onClose}>
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
