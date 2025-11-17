import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import "../styles/pages/_wishlist.scss";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      title: product.name,
      size: "Стандарт",
      firmness: "Середня",
      price: product.price,
      image: product.image,
      qty: 1,
    });
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };

  const handleClearAll = () => {
    if (window.confirm("Ви впевнені, що хочете очистити весь список бажань?")) {
      clearWishlist();
    }
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <div className="wishlist-header__content">
            <h1 className="wishlist-header__title">
              <Heart size={40} />
              Список бажань
            </h1>
            <p className="wishlist-header__subtitle">
              {wishlist.length > 0
                ? `У вашому списку ${wishlist.length} ${
                    wishlist.length === 1
                      ? "товар"
                      : wishlist.length < 5
                      ? "товари"
                      : "товарів"
                  }`
                : "Ваш список бажань порожній"}
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              className="btn btn-outline btn-sm"
              onClick={handleClearAll}
              title="Очистити список"
            >
              <Trash2 size={16} />
              <span>Очистити все</span>
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty__icon">
              <Heart size={80} />
            </div>
            <h2 className="wishlist-empty__title">
              Ваш список бажань порожній
            </h2>
            <p className="wishlist-empty__text">
              Додайте товари, які вам сподобались, натиснувши на іконку серця
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/catalog")}
            >
              Перейти до каталогу
              <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div key={product.id} className="wishlist-card">
                <button
                  className="wishlist-card__remove"
                  onClick={() => handleRemove(product.id)}
                  title="Видалити зі списку"
                >
                  <Trash2 size={18} />
                </button>

                <Link
                  to={`/product/${product.id}`}
                  className="wishlist-card__image-wrapper"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="wishlist-card__image"
                  />
                </Link>

                <div className="wishlist-card__content">
                  <Link
                    to={`/product/${product.id}`}
                    className="wishlist-card__title"
                  >
                    {product.name}
                  </Link>

                  <div className="wishlist-card__footer">
                    <div className="wishlist-card__price">
                      {product.price.toLocaleString("uk-UA")} ₴
                    </div>
                    <button
                      className="btn btn-primary btn-sm wishlist-card__add-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={16} />
                      <span>В кошик</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="wishlist-actions">
            <p className="wishlist-actions__text">
              Не впевнені? Продовжуйте покупки та додавайте більше товарів
            </p>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/catalog")}
            >
              Продовжити покупки
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
