import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Phone, Mail, ArrowLeft, MapPin } from "lucide-react";
import "../styles/pages/_order-success.scss";

// Ключ для збереження номерів замовлень в localStorage
const SAVED_ORDERS_KEY = "savedOrderNumbers";

// Функція збереження номера замовлення
const saveOrderNumber = (orderNumber) => {
  try {
    const saved = localStorage.getItem(SAVED_ORDERS_KEY);
    const orders = saved ? JSON.parse(saved) : [];
    if (!orders.includes(orderNumber)) {
      orders.unshift(orderNumber);
      const trimmed = orders.slice(0, 10);
      localStorage.setItem(SAVED_ORDERS_KEY, JSON.stringify(trimmed));
    }
  } catch (error) {
    console.error("Error saving order number:", error);
  }
};

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Отримуємо дані замовлення з localStorage
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    }

    // Зберігаємо номер замовлення для відстеження
    const orderNum = orderNumber || JSON.parse(lastOrder)?.order_number;
    if (orderNum) {
      saveOrderNumber(orderNum);
    }
  }, [orderNumber]);

  return (
    <div className="order-success">
      <div className="order-success__container">
        <div className="order-success__card">
          <div className="order-success__icon">
            <CheckCircle size={64} />
          </div>

          <h1 className="order-success__title">Замовлення успішно оформлено!</h1>

          <div className="order-success__order-number">
            <Package size={24} />
            <span>Номер замовлення:</span>
            <strong>{orderNumber || order?.order_number}</strong>
          </div>

          <p className="order-success__message">
            Дякуємо за ваше замовлення! Ми зв'яжемося з вами найближчим часом для
            підтвердження.
          </p>

          {order && (
            <div className="order-success__details">
              <h3>Деталі замовлення:</h3>
              <div className="order-success__detail-row">
                <span>Статус:</span>
                <span className="order-success__status">Очікує обробки</span>
              </div>
              <div className="order-success__detail-row">
                <span>Сума:</span>
                <strong>{order.total} ₴</strong>
              </div>
              <div className="order-success__detail-row">
                <span>Дата:</span>
                <span>
                  {new Date(order.created_at).toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )}

          <div className="order-success__track">
            <Link
              to="/track-order"
              className="order-success__btn order-success__btn--track"
            >
              <MapPin size={18} />
              Відстежити замовлення
            </Link>
            <p className="order-success__track-hint">
              Номер замовлення збережено. Ви завжди можете перевірити статус.
            </p>
          </div>

          <div className="order-success__contact">
            <h3>Потрібна допомога?</h3>
            <div className="order-success__contact-row">
              <Phone size={18} />
              <a href="tel:+380666666666">+38 (066) 666-66-66</a>
            </div>
            <div className="order-success__contact-row">
              <Mail size={18} />
              <a href="mailto:info@mattress-shop.ua">info@mattress-shop.ua</a>
            </div>
          </div>

          <div className="order-success__actions">
            <Link to="/catalog" className="order-success__btn order-success__btn--secondary">
              <ArrowLeft size={18} />
              Продовжити покупки
            </Link>
            <Link to="/" className="order-success__btn order-success__btn--primary">
              На головну
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
