import React, { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  // Якщо користувач не авторизований, перенаправляємо на головну
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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

  if (!isAuthenticated) {
    return null;
  }

  // Форматування дати реєстрації
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

        <div className="profile-content">
          {/* Аватар і основна інформація */}
          <div className="profile-card profile-main">
            <div className="profile-avatar">
              <div className="profile-avatar__circle">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <User size={48} />
                )}
              </div>

              <div className="profile-avatar__info">
                <h2 className="profile-avatar__name">
                  {user?.name || "Користувач"}
                </h2>
                <p className="profile-avatar__email">
                  {user?.email || user?.phone}
                </p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <Calendar size={20} />
                <div className="profile-stat__content">
                  <span className="profile-stat__label">Дата реєстрації</span>
                  <span className="profile-stat__value">
                    {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

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

          {/* Додаткова інформація */}
          <div className="profile-card profile-info">
            <h3 className="profile-card__title-info">Корисна інформація</h3>

            <div className="profile-info__list">
              <div className="profile-info__item">
                <div className="profile-info__icon">💳</div>
                <div className="profile-info__content">
                  <h4>Історія замовлень</h4>
                  <p>Переглядайте свої попередні замовлення</p>
                </div>
              </div>

              <div className="profile-info__item">
                <div className="profile-info__icon">❤️</div>
                <div className="profile-info__content">
                  <h4>Список бажань</h4>
                  <p>Зберігайте улюблені товари</p>
                </div>
              </div>

              <div className="profile-info__item">
                <div className="profile-info__icon">🔔</div>
                <div className="profile-info__content">
                  <h4>Сповіщення</h4>
                  <p>Отримуйте новини та спеціальні пропозиції</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
