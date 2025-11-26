import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
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
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
  });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Якщо користувач не авторизований, перенаправляємо на головну
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Завантаження замовлень (mock дані)
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
      name: user?.name || "",
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
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <User size={40} />
              )}
            </div>
            <div className="profile-user-info__details">
              <h2 className="profile-user-info__name">
                {user?.name || "Користувач"}
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
                    name="name"
                    className="profile-form__input"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    placeholder="Введіть ваше ім'я"
                  />
                ) : (
                  <p className="profile-form__value">
                    {user?.name || "Не вказано"}
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
          <h3 className="profile-orders__title">
            <Package size={24} />
            Історія замовлень
          </h3>

          {orders.length === 0 ? (
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
