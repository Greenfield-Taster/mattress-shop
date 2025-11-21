import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard/ProductCard";
import "../styles/pages/_wishlist.scss";

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();

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
              <ProductCard key={product.id} product={product} />
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
