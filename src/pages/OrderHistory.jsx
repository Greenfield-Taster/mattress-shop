import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import "../styles/pages/_orderhistory.scss";

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Якщо користувач не авторизований, перенаправляємо на головну
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock дані для замовлень (замінити на реальні API запити)
  useEffect(() => {
    const mockOrders = [
      {
        id: "ORD-2024-001",
        date: "2024-11-10",
        status: "delivered",
        total: 15980,
        items: [
          {
            id: 1,
            name: "Ортопедичний матрац AirFlow Pro",
            size: "160×200",
            quantity: 1,
            price: 7990,
            image: "/spring.png",
          },
          {
            id: 2,
            name: "Ортопедична подушка Memory Foam",
            size: "50×70",
            quantity: 2,
            price: 3995,
            image: "/pillow.png",
          },
        ],
        deliveryAddress: "Київ, вул. Хрещатик, 1",
      },
      {
        id: "ORD-2024-002",
        date: "2024-11-15",
        status: "processing",
        total: 12990,
        items: [
          {
            id: 3,
            name: "Безпружинний матрац Eco Dream",
            size: "140×200",
            quantity: 1,
            price: 12990,
            image: "/springless.png",
          },
        ],
        deliveryAddress: "Львів, пр. Свободи, 25",
      },
      {
        id: "ORD-2024-003",
        date: "2024-10-28",
        status: "cancelled",
        total: 8990,
        items: [
          {
            id: 4,
            name: "Дитячий матрац Baby Dream",
            size: "120×60",
            quantity: 1,
            price: 8990,
            image: "/kids.png",
          },
        ],
        deliveryAddress: "Одеса, вул. Дерибасівська, 10",
      },
    ];

    setOrders(mockOrders);
  }, []);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        <div className="order-history-header">
          <div className="order-history-header__content">
            <h1 className="order-history-header__title">Історія замовлень</h1>
            <p className="order-history-header__subtitle">
              Переглядайте статус та деталі ваших замовлень
            </p>
          </div>
          <div className="order-history-header__icon">
            <ShoppingBag size={48} />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="order-history-empty">
            <Package size={64} />
            <h2>У вас поки немає замовлень</h2>
            <p>Почніть покупки та ваші замовлення з'являться тут</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/catalog")}
            >
              Перейти до каталогу
            </button>
          </div>
        ) : (
          <div className="order-history-list">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={order.id} className="order-card">
                  <div className="order-card__header">
                    <div className="order-card__header-left">
                      <div className="order-card__id">
                        <Package size={20} />
                        <span>Замовлення {order.id}</span>
                      </div>
                      <div className="order-card__date">
                        <Calendar size={16} />
                        <span>{formatDate(order.date)}</span>
                      </div>
                    </div>
                    <div
                      className={`order-card__status order-card__status--${statusConfig.color}`}
                    >
                      <StatusIcon size={18} />
                      <span>{statusConfig.label}</span>
                    </div>
                  </div>

                  <div className="order-card__items">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="order-item__image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="order-item__details">
                          <h4 className="order-item__name">{item.name}</h4>
                          <p className="order-item__size">Розмір: {item.size}</p>
                        </div>
                        <div className="order-item__quantity">
                          x{item.quantity}
                        </div>
                        <div className="order-item__price">
                          {item.price.toLocaleString("uk-UA")} ₴
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-card__footer">
                    <div className="order-card__info">
                      <div className="order-card__delivery">
                        <Truck size={16} />
                        <span>{order.deliveryAddress}</span>
                      </div>
                      <div className="order-card__total">
                        <CreditCard size={16} />
                        <span className="order-card__total-label">
                          Загальна сума:
                        </span>
                        <span className="order-card__total-value">
                          {order.total.toLocaleString("uk-UA")} ₴
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm order-card__details-btn">
                      <span>Деталі</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
