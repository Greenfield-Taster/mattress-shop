import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getMyOrders } from "../api/orderApi";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  LogOut,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  AlertCircle,
  Loader,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderDetailsModal from "../components/OrderDetailsModal/OrderDetailsModal";
import "../styles/pages/_profile.scss";

const Profile = () => {
  const { user, logout, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Якщо користувач не авторизований, перенаправляємо на головну
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Завантаження реальних замовлень з API
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);

    try {
      const response = await getMyOrders();

      if (response.orders) {
        // Перетворюємо формат API до формату компонента
        const formattedOrders = response.orders.map((order) => ({
          id: order.order_number || order.id,
          date: order.created_at,
          status: order.status,
          total: order.total,
          items: order.items.map((item) => ({
            id: item.id,
            name: item.title,
            size: item.size || "Стандартний",
            quantity: item.quantity,
            price: item.unit_price,
            image: item.image || "/spring.png",
          })),
          deliveryAddress: order.delivery_warehouse
            ? `${order.delivery_city}, ${order.delivery_warehouse}`
            : order.delivery_city || "Не вказано",
        }));

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Помилка завантаження замовлень:", error);
      setOrdersError("Не вдалося завантажити історію замовлень");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    const result = await updateUser(editedUser);

    if (result.success) {
      setIsEditing(false);
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Конфігурація статусів замовлень
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
    return configs[status] || configs.pending;
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Заголовок */}
        <div className="profile-header">
          <div className="profile-header__content">
            <h1 className="profile-header__title">Мій профіль</h1>
            <p className="profile-header__subtitle">
              Керуйте своїми персональними даними та налаштуваннями
            </p>
          </div>

          <button
            className="btn btn-outline btn-icon"
            onClick={handleLogout}
            title="Вийти з акаунту"
          >
            <LogOut size={20} />
            <span>Вийти</span>
          </button>
        </div>

        {/* Інформація про користувача */}
        <div className="profile-user-info">
          <div className="profile-user-info__left">
            <div className="profile-user-info__avatar">
              <img
                src={user?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent((user?.firstName || "U") + "+" + (user?.lastName || "")) + "&background=1e3a5f&color=fff&size=128"}
                alt={`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Користувач"}
                onError={(e) => {
                  e.target.src = "https://ui-avatars.com/api/?name=U&background=1e3a5f&color=fff&size=128";
                }}
              />
            </div>
            <div className="profile-user-info__details">
              <h2 className="profile-user-info__name">
                {user?.firstName || user?.lastName
                  ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
                  : "Користувач"}
              </h2>
              <p className="profile-user-info__email">
                {user?.email || user?.phone}
              </p>
            </div>
          </div>
          <div className="profile-user-info__right">
            <Calendar size={18} />
            <span className="profile-user-info__date">
              Дата реєстрації: {formatDate(user?.createdAt)}
            </span>
          </div>
        </div>

        <div className="profile-content">

          {/* Персональні дані */}
          <div className="profile-card profile-details">
            <div className="profile-card__header">
              <h3 className="profile-card__title">Персональні дані</h3>

              {!isEditing ? (
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={16} />
                  <span>Редагувати</span>
                </button>
              ) : (
                <div className="profile-card__actions">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X size={16} />
                    <span>Скасувати</span>
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save size={16} />
                    <span>{isSaving ? "Збереження..." : "Зберегти"}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="profile-form">
              <div className="profile-form__group">
                <label className="profile-form__label">
                  <User size={18} />
                  <span>Ім'я</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    className="profile-form__input"
                    value={editedUser.firstName}
                    onChange={handleInputChange}
                    placeholder="Введіть ваше ім'я"
                  />
                ) : (
                  <p className="profile-form__value">
                    {user?.firstName || "Не вказано"}
                  </p>
                )}
              </div>

              <div className="profile-form__group">
                <label className="profile-form__label">
                  <User size={18} />
                  <span>Прізвище</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    className="profile-form__input"
                    value={editedUser.lastName}
                    onChange={handleInputChange}
                    placeholder="Введіть ваше прізвище"
                  />
                ) : (
                  <p className="profile-form__value">
                    {user?.lastName || "Не вказано"}
                  </p>
                )}
              </div>

              <div className="profile-form__group">
                <label className="profile-form__label">
                  <Mail size={18} />
                  <span>Email</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    className="profile-form__input"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                ) : (
                  <p className="profile-form__value">
                    {user?.email || "Не вказано"}
                  </p>
                )}
              </div>

              <div className="profile-form__group">
                <label className="profile-form__label">
                  <Phone size={18} />
                  <span>Телефон</span>
                </label>
                <p className="profile-form__value profile-form__value--phone">
                  {user?.phone || "Не вказано"}
                </p>
              </div>

              <div className="profile-form__group">
                <label className="profile-form__label">
                  <MapPin size={18} />
                  <span>Місто</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    className="profile-form__input"
                    value={editedUser.city}
                    onChange={handleInputChange}
                    placeholder="Київ"
                  />
                ) : (
                  <p className="profile-form__value">
                    {user?.city || "Не вказано"}
                  </p>
                )}
              </div>

              <div className="profile-form__group profile-form__group--full">
                <label className="profile-form__label">
                  <MapPin size={18} />
                  <span>Адреса доставки</span>
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    className="profile-form__textarea"
                    value={editedUser.address}
                    onChange={handleInputChange}
                    placeholder="Введіть адресу доставки"
                    rows={3}
                  />
                ) : (
                  <p className="profile-form__value">
                    {user?.address || "Не вказано"}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Історія замовлень */}
        <div className="profile-orders">
          <div className="profile-orders__header">
            <h3 className="profile-orders__title">
              <Package size={24} />
              Історія замовлень
            </h3>
            {!ordersLoading && (
              <button
                className="btn btn-sm btn-outline"
                onClick={fetchOrders}
                title="Оновити список замовлень"
              >
                <RefreshCw size={16} />
                <span>Оновити</span>
              </button>
            )}
          </div>

          {ordersLoading ? (
            <div className="profile-orders-loading">
              <Loader size={32} className="spinner" />
              <p>Завантаження замовлень...</p>
            </div>
          ) : ordersError ? (
            <div className="profile-orders-error">
              <AlertCircle size={48} />
              <p>{ordersError}</p>
              <button className="btn btn-primary" onClick={fetchOrders}>
                Спробувати ще раз
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="profile-orders-empty">
              <Package size={48} />
              <p>У вас поки немає замовлень</p>
            </div>
          ) : (
            <div className="profile-orders-list">
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
                            <p className="order-item__size">
                              Розмір: {item.size}
                            </p>
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
                      <button
                        className="btn btn-outline btn-sm order-card__details-btn"
                        onClick={() => setSelectedOrder(order)}
                      >
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

      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
};

export default Profile;
