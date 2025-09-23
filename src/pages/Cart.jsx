import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
} from "lucide-react";
import mattressImage from "../assets/images/mattress-photo.png";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Матрац Premium Dream Memory",
      price: 7200,
      size: "140x200 см",
      quantity: 1,
      image: mattressImage,
    },
    {
      id: 2,
      name: "Матрац Classic Comfort",
      price: 4500,
      size: "90x200 см",
      quantity: 2,
      image: mattressImage,
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const applyPromoCode = () => {
    // Simulation of promo code logic
    const validCodes = {
      SAVE10: 0.1,
      FIRST20: 0.2,
      MATTRESS15: 0.15,
    };

    if (validCodes[promoCode]) {
      setPromoDiscount(validCodes[promoCode]);
      alert(`Промокод застосовано! Знижка ${validCodes[promoCode] * 100}%`);
    } else {
      alert("Невірний промокод");
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getDeliveryPrice = () => {
    const subtotal = getSubtotal();
    return subtotal >= 5000 ? 0 : 200; // Free delivery over 5000
  };

  const getDiscountAmount = () => {
    return getSubtotal() * promoDiscount;
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    const delivery = getDeliveryPrice();
    const discount = getDiscountAmount();
    return subtotal + delivery - discount;
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart cart--empty">
        <div className="container">
          <div className="cart__empty">
            <div className="cart__empty-icon">
              <ShoppingCart size={64} />
            </div>
            <h2 className="cart__empty-title">Ваш кошик порожній</h2>
            <p className="cart__empty-description">
              Додайте товари до кошика, щоб продовжити покупки
            </p>
            <Link to="/catalog" className="btn btn-primary btn-lg">
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        {/* Header */}
        <div className="cart__header">
          <Link to="/catalog" className="cart__back-btn">
            <ArrowLeft size={16} />
            Продовжити покупки
          </Link>
          <h1 className="cart__title">Кошик ({cartItems.length})</h1>
        </div>

        <div className="cart__content">
          {/* Cart Items */}
          <div className="cart__items">
            <div className="cart__items-header">
              <h2>Товари в кошику</h2>
            </div>

            <div className="cart__items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart__item">
                  <Link to={`/product/${item.id}`} className="cart__item-image">
                    <img src={item.image} alt={item.name} />
                  </Link>

                  <div className="cart__item-info">
                    <Link
                      to={`/product/${item.id}`}
                      className="cart__item-name"
                    >
                      {item.name}
                    </Link>
                    <div className="cart__item-details">
                      <span className="cart__item-size">
                        Розмір: {item.size}
                      </span>
                    </div>
                    <div className="cart__item-price">{item.price} ₴</div>
                  </div>

                  <div className="cart__item-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="cart__quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="cart__quantity-value">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cart__quantity-btn"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="cart__item-total">
                    {item.price * item.quantity} ₴
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="cart__item-remove"
                    title="Видалити товар"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart__summary">
            <div className="cart__summary-card">
              <h3 className="cart__summary-title">Разом до сплати</h3>

              {/* Promo Code */}
              <div className="cart__promo">
                <h4>Промокод</h4>
                <div className="cart__promo-input">
                  <input
                    type="text"
                    placeholder="Введіть промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="form-input"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="btn btn-secondary btn-sm"
                  >
                    Застосувати
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="cart__summary-breakdown">
                <div className="cart__summary-row">
                  <span>
                    Товари (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    шт.)
                  </span>
                  <span>{getSubtotal()} ₴</span>
                </div>

                <div className="cart__summary-row">
                  <span>Доставка</span>
                  <span>
                    {getDeliveryPrice() === 0 ? (
                      <span className="cart__delivery-free">Безкоштовно</span>
                    ) : (
                      `${getDeliveryPrice()} ₴`
                    )}
                  </span>
                </div>

                {promoDiscount > 0 && (
                  <div className="cart__summary-row cart__summary-discount">
                    <span>Знижка ({promoDiscount * 100}%)</span>
                    <span>-{getDiscountAmount()} ₴</span>
                  </div>
                )}

                <div className="cart__summary-total">
                  <span>Загалом</span>
                  <span>{getTotalPrice()} ₴</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="btn btn-primary btn-lg btn-full cart__checkout-btn">
                <CreditCard size={18} />
                Оформити замовлення
              </button>

              {/* Delivery Info */}
              <div className="cart__delivery-info">
                <div className="cart__delivery-item">
                  <Truck size={16} />
                  <span>
                    {getDeliveryPrice() === 0
                      ? "Безкоштовна доставка по Києву"
                      : "Доставка по Києву - 200 ₴"}
                  </span>
                </div>
                <div className="cart__delivery-item">
                  <Shield size={16} />
                  <span>Гарантія повернення 30 днів</span>
                </div>
                {getSubtotal() < 5000 && (
                  <div className="cart__delivery-note">
                    Додайте товарів на {5000 - getSubtotal()} ₴ для безкоштовної
                    доставки
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="cart__recommendations">
          <h2 className="cart__recommendations-title">Рекомендовані товари</h2>
          <div className="cart__recommendations-grid">
            {[1, 2, 3].map((id) => (
              <Link
                key={id}
                to={`/product/${id + 10}`}
                className="cart__recommendation-card"
              >
                <img src={mattressImage} alt="Recommended product" />
                <h3>Матрац Comfort Plus</h3>
                <div className="cart__recommendation-price">5800 ₴</div>
                <button className="btn btn-outline btn-sm">
                  <ShoppingCart size={14} />
                  Додати в кошик
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
