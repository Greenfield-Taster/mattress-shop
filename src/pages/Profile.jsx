import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getMyOrders } from "../api/orderApi";
import usePageMeta from "../hooks/usePageMeta";
import { PAGE_SEO } from "../utils/seoData";
import {
  User,
  Mail,
  Phone,
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

  RefreshCw,
  Banknote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderDetailsModal from "../components/OrderDetailsModal/OrderDetailsModal";
import { DELIVERY_METHOD_LABELS } from "../utils/storeInfo";
import { SkeletonProfile } from "../components/Skeleton/Skeleton";
import "../styles/pages/_profile.scss";

const PAYMENT_METHOD_LABELS = {
  "cash-on-delivery": "Накладений платіж",
  "card-online": "Карткою онлайн",
  "google-apple-pay": "Google/Apple Pay", // Legacy: kept for existing orders
  invoice: "Рахунок (юр. особа)",
};

const PAYMENT_STATUS_LABELS = {
  pending: { label: "Очікує", color: "warning" },
  pending_payment: { label: "Очікує оплати", color: "warning" },
  paid: { label: "Оплачено", color: "success" },
  failed: { label: "Помилка", color: "error" },
  refunded: { label: "Повернено", color: "neutral" },
};

const formatPhoneForDisplay = (phone) => {
  if (!phone) return "Не вказано";

  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("380")) {
    cleaned = "0" + cleaned.slice(3);
  }

  if (cleaned.length === 10 && cleaned.startsWith("0")) {
    const digits = cleaned.slice(1);
    return `+380 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
  }

  return phone;
};

const Profile = () => {
  usePageMeta(PAGE_SEO.profile);
  const { user, logout, updateUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);

    try {
      const response = await getMyOrders();

      if (response.orders) {
        const formattedOrders = response.orders.map((order) => ({
          id: order.order_number || order.id,
          date: order.created_at,
          status: order.status,
          total: order.total,
          subtotal: order.subtotal,
          discount: order.discount,
          promoCode: order.promo_code,
          payment_status: order.payment_status || "pending",
          payment_method: order.payment_method || null,
          delivery_price: order.delivery_price || 0,
          delivery_price_type: order.delivery_price_type || "free",
          items: order.items.map((item) => ({
            id: item.id,
            name: item.title,
            size: item.size || null,
            firmness: item.firmness || null,
            quantity: item.quantity,
            price: item.unit_price,
            total: item.total || item.unit_price * item.quantity,
            image: item.image || "/spring.webp",
          })),
          deliveryMethod: order.delivery_method,
          deliveryCity: order.delivery_city,
          deliveryWarehouse: order.delivery_warehouse,
          deliveryAddress: order.delivery_address,
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
    setSaveMessage(null);

    if (!editedUser.firstName?.trim()) {
      setSaveMessage({ type: "error", text: "Введіть ім'я" });
      return;
    }
    if (editedUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
      setSaveMessage({ type: "error", text: "Невірний формат email" });
      return;
    }

    setIsSaving(true);

    const result = await updateUser(editedUser);

    if (result.success) {
      setIsEditing(false);
      setSaveMessage({ type: "success", text: "Дані успішно збережено" });
      setTimeout(() => setSaveMessage(null), 4000);
    } else {
      setSaveMessage({ type: "error", text: result.error || "Не вдалося зберегти дані" });
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "Нещодавно";
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <SkeletonProfile />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
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

        <div className="profile-user-info">
          <div className="profile-user-info__left">
            <div className="profile-user-info__avatar">
              <User size={48} />
            </div>
            <div className="profile-user-info__details">
              <h2 className="profile-user-info__name">
                {user?.firstName || user?.lastName
                  ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
                  : "Користувач"}
              </h2>
              <p className="profile-user-info__email">
                {user?.email || formatPhoneForDisplay(user?.phone)}
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

            {saveMessage && (
              <div className={`profile-save-message profile-save-message--${saveMessage.type}`}>
                {saveMessage.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{saveMessage.text}</span>
              </div>
            )}

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
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    className="profile-form__input"
                    value={editedUser.phone}
                    onChange={handleInputChange}
                    placeholder="0XX XXX XX XX"
                  />
                ) : (
                  <p className="profile-form__value profile-form__value--phone">
                    {formatPhoneForDisplay(user?.phone)}
                  </p>
                )}
              </div>

            </div>
          </div>

        </div>

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
            <div className="profile-orders-list">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="order-card">
                  <div className="order-card__header">
                    <div className="order-card__header-left">
                      <div className="skeleton" style={{ height: 18, width: 180, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 14, width: 140, borderRadius: 4 }} />
                    </div>
                    <div className="skeleton" style={{ height: 32, width: 130, borderRadius: 20 }} />
                  </div>
                  <div className="order-card__items">
                    <div className="order-item">
                      <div className="order-item__image">
                        <div className="skeleton" style={{ width: "100%", height: "100%", borderRadius: 8 }} />
                      </div>
                      <div className="order-item__details" style={{ flex: 1 }}>
                        <div className="skeleton" style={{ height: 16, width: "70%", borderRadius: 4 }} />
                        <div className="skeleton" style={{ height: 14, width: "35%", borderRadius: 4, marginTop: 6 }} />
                      </div>
                      <div className="order-item__pricing">
                        <div className="skeleton" style={{ height: 14, width: 80, borderRadius: 4 }} />
                        <div className="skeleton" style={{ height: 16, width: 70, borderRadius: 4, marginTop: 4 }} />
                      </div>
                    </div>
                  </div>
                  <div className="order-card__footer">
                    <div className="order-card__info">
                      <div className="skeleton" style={{ height: 14, width: 180, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 14, width: 150, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 16, width: 200, borderRadius: 4 }} />
                    </div>
                    <div className="skeleton" style={{ height: 36, width: 100, borderRadius: 8 }} />
                  </div>
                </div>
              ))}
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
                            <div className="order-item__meta">
                              {item.size && (
                                <span className="order-item__attr">
                                  {item.size}
                                </span>
                              )}
                              {item.firmness && (
                                <span className="order-item__attr">
                                  {item.firmness}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="order-item__pricing">
                            <span className="order-item__qty-price">
                              {item.quantity} x{" "}
                              {Number(item.price || 0).toLocaleString("uk-UA")}{" "}
                              ₴
                            </span>
                            <span className="order-item__total">
                              {Number(
                                item.total || item.price * item.quantity || 0
                              ).toLocaleString("uk-UA")}{" "}
                              ₴
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-card__footer">
                      <div className="order-card__info">
                        <div className="order-card__delivery">
                          <Truck size={16} />
                          <span>
                            {DELIVERY_METHOD_LABELS[order.deliveryMethod] ||
                              order.deliveryMethod}
                          </span>
                        </div>
                        {order.payment_method && (
                          <div className="order-card__payment">
                            <Banknote size={16} />
                            <span>
                              {PAYMENT_METHOD_LABELS[order.payment_method] ||
                                order.payment_method}
                            </span>
                            {order.payment_status && (
                              <span
                                className={`order-card__payment-badge order-card__payment-badge--${
                                  PAYMENT_STATUS_LABELS[order.payment_status]
                                    ?.color || "warning"
                                }`}
                              >
                                {PAYMENT_STATUS_LABELS[order.payment_status]
                                  ?.label || order.payment_status}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="order-card__total">
                          <CreditCard size={16} />
                          <span className="order-card__total-label">
                            Загальна сума:
                          </span>
                          <span className="order-card__total-value">
                            {Number(order.total || 0).toLocaleString("uk-UA")} ₴
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
