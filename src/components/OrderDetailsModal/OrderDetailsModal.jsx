import {
  Package,
  Calendar,
  Truck,
  CreditCard,
  X,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Tag,
  Banknote,
} from "lucide-react";
import { STORE_INFO, DELIVERY_METHOD_LABELS } from "../../utils/storeInfo";
import useScrollLock from "../../hooks/useScrollLock";

const PAYMENT_METHOD_LABELS = {
  "cash-on-delivery": "Накладений платіж",
  "card-online": "Карткою онлайн",
  "google-apple-pay": "Google/Apple Pay", // Legacy: kept for existing orders
  invoice: "Рахунок (юр. особа)",
};

const PAYMENT_STATUS_CONFIG = {
  pending: { label: "Очікує оплати", color: "warning" },
  pending_payment: { label: "Очікує оплати онлайн", color: "warning" },
  paid: { label: "Оплачено", color: "success" },
  failed: { label: "Помилка оплати", color: "error" },
  refunded: { label: "Повернено", color: "neutral" },
};
import "./OrderDetailsModal.scss";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  useScrollLock(isOpen);

  if (!isOpen || !order) return null;

  const getStatusConfig = (status) => {
    const configs = {
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
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

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
            <h2 className="order-details-modal__title">
              Замовлення {order.id}
            </h2>
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
          <div className="order-details-modal__info">
            <div className="order-details-modal__info-item">
              <Calendar size={18} />
              <span className="order-details-modal__info-label">
                Дата замовлення:
              </span>
              <span className="order-details-modal__info-value">
                {formatDate(order.date)}
              </span>
            </div>
            <div
              className={`order-details-modal__status order-details-modal__status--${statusConfig.color}`}
            >
              <StatusIcon size={18} />
              <span>{statusConfig.label}</span>
            </div>
          </div>

          <div className="order-details-modal__section">
            <h3 className="order-details-modal__section-title">
              Товари в замовленні
            </h3>
            <div className="order-details-modal__items">
              {order.items.map((item) => (
                <div key={item.id} className="order-details-item">
                  <div className="order-details-item__image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="order-details-item__info">
                    <h4 className="order-details-item__name">{item.name}</h4>
                    <div className="order-details-item__attributes">
                      {item.size && (
                        <span className="order-details-item__attribute">
                          {item.size}
                        </span>
                      )}
                      {item.firmness && (
                        <span className="order-details-item__attribute">
                          {item.firmness}
                        </span>
                      )}
                    </div>
                    <p className="order-details-item__quantity">
                      {item.quantity} x{" "}
                      {Number(item.price || 0).toLocaleString("uk-UA")} ₴
                    </p>
                  </div>
                  <div className="order-details-item__price">
                    {Number(
                      item.total || (item.price || 0) * item.quantity
                    ).toLocaleString("uk-UA")}{" "}
                    ₴
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-details-modal__section">
            <h3 className="order-details-modal__section-title">Доставка</h3>
            <div className="order-details-modal__delivery-info">
              {order.deliveryMethod && (
                <div className="order-details-modal__delivery-row">
                  <Truck size={18} />
                  <span className="order-details-modal__delivery-label">
                    Служба доставки:
                  </span>
                  <span className="order-details-modal__delivery-value">
                    {DELIVERY_METHOD_LABELS[order.deliveryMethod] ||
                      order.deliveryMethod}
                  </span>
                </div>
              )}
              {order.deliveryMethod === "pickup" ? (
                <div className="order-details-modal__delivery-row">
                  <MapPin size={18} />
                  <span className="order-details-modal__delivery-label">
                    Адреса:
                  </span>
                  <span className="order-details-modal__delivery-value">
                    {STORE_INFO.pickupAddress}
                  </span>
                </div>
              ) : order.deliveryMethod === "courier" ? (
                <>
                  {order.deliveryCity && (
                    <div className="order-details-modal__delivery-row">
                      <MapPin size={18} />
                      <span className="order-details-modal__delivery-label">
                        Місто:
                      </span>
                      <span className="order-details-modal__delivery-value">
                        {order.deliveryCity}
                      </span>
                    </div>
                  )}
                  {order.deliveryAddress && (
                    <div className="order-details-modal__delivery-row">
                      <MapPin size={18} />
                      <span className="order-details-modal__delivery-label">
                        Адреса:
                      </span>
                      <span className="order-details-modal__delivery-value">
                        {order.deliveryAddress}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {order.deliveryCity && (
                    <div className="order-details-modal__delivery-row">
                      <MapPin size={18} />
                      <span className="order-details-modal__delivery-label">
                        Місто:
                      </span>
                      <span className="order-details-modal__delivery-value">
                        {order.deliveryCity}
                      </span>
                    </div>
                  )}
                  {order.deliveryWarehouse && (
                    <div className="order-details-modal__delivery-row">
                      <Package size={18} />
                      <span className="order-details-modal__delivery-label">
                        Відділення:
                      </span>
                      <span className="order-details-modal__delivery-value">
                        {order.deliveryWarehouse}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {order.payment_method && (
            <div className="order-details-modal__section">
              <h3 className="order-details-modal__section-title">Оплата</h3>
              <div className="order-details-modal__payment-info">
                <div className="order-details-modal__payment-row">
                  <Banknote size={18} />
                  <span className="order-details-modal__payment-label">
                    Спосіб оплати:
                  </span>
                  <span className="order-details-modal__payment-value">
                    {PAYMENT_METHOD_LABELS[order.payment_method] ||
                      order.payment_method}
                  </span>
                </div>
                {order.payment_status && (
                  <div className="order-details-modal__payment-row">
                    <CreditCard size={18} />
                    <span className="order-details-modal__payment-label">
                      Статус:
                    </span>
                    <span
                      className={`order-details-modal__payment-status order-details-modal__payment-status--${
                        PAYMENT_STATUS_CONFIG[order.payment_status]?.color ||
                        "warning"
                      }`}
                    >
                      {PAYMENT_STATUS_CONFIG[order.payment_status]?.label ||
                        order.payment_status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="order-details-modal__summary">
            <div className="order-details-modal__summary-row">
              <span>Сума товарів:</span>
              <span>
                {Number(order.subtotal || order.total || 0).toLocaleString("uk-UA")} ₴
              </span>
            </div>
            {order.promoCode && (
              <div className="order-details-modal__summary-row order-details-modal__summary-row--promo">
                <span>
                  <Tag size={14} />
                  Промокод "{order.promoCode}":
                </span>
                <span className="order-details-modal__discount">
                  -{(order.discount || 0).toLocaleString("uk-UA")} ₴
                </span>
              </div>
            )}
            <div className="order-details-modal__summary-row">
              <span>Доставка:</span>
              <span>
                {order.delivery_price_type === "carrier"
                  ? "За тарифами перевізника"
                  : order.delivery_price > 0
                    ? `${Number(order.delivery_price).toLocaleString("uk-UA")} ₴`
                    : "Безкоштовно"}
              </span>
            </div>
            <div className="order-details-modal__summary-row order-details-modal__summary-row--total">
              <span>Загальна сума:</span>
              <span>{Number(order.total || 0).toLocaleString("uk-UA")} ₴</span>
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
