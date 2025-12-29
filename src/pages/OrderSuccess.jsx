import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Phone, Mail, ArrowLeft } from "lucide-react";
import "../styles/pages/_order-success.scss";

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Отримуємо дані замовлення з localStorage
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    }
  }, []);

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

          <div className="order-success__info">
            <p>
              Збережіть номер замовлення для відстеження статусу. Ви також
              отримаєте підтвердження на вказаний email.
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
