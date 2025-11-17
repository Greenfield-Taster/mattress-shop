import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import WishlistButton from "../WishlistButton/WishlistButton";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const { id, name, type, height, hardness, price, oldPrice, image } = product;
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const hasDiscount = oldPrice && oldPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id,
      title: name,
      size: height ? `${height} см` : "Стандарт",
      firmness: hardness || "Середня",
      price,
      image,
      qty: 1,
    });

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        <Link to={`/product/${id}`} className="product-card__image-link">
          <img
            src={image}
            alt={name}
            className="product-card__image"
            loading="lazy"
            width={290}
            height={290}
          />
        </Link>

        {hasDiscount && (
          <div className="product-card__discount">-{discountPercent}%</div>
        )}

        <div className="product-card__wishlist">
          <WishlistButton product={product} variant="small" />
        </div>
      </div>

      <div className="product-card__content">
        <Link to={`/product/${id}`} className="product-card__title-link">
          <h3 className="product-card__title">{name}</h3>
        </Link>

        <div className="product-card__specs">
          {type && <span className="product-card__spec">{type}</span>}
          {height && (
            <>
              <span className="product-card__separator" aria-hidden="true">
                •
              </span>
              <span className="product-card__spec">{height} см</span>
            </>
          )}
          {hardness && (
            <>
              <span className="product-card__separator" aria-hidden="true">
                •
              </span>
              <span className="product-card__spec">{hardness}</span>
            </>
          )}
        </div>

        <div className="product-card__price-wrapper">
          <span className="product-card__price">
            ₴{price.toLocaleString("uk-UA")}
          </span>
          {hasDiscount && (
            <span className="product-card__old-price">
              ₴{oldPrice.toLocaleString("uk-UA")}
            </span>
          )}
        </div>

        <div className="product-card__actions">
          <Link
            to={`/product/${id}`}
            className="product-card__button product-card__button--primary"
          >
            Детальніше
          </Link>
          <button
            className={`product-card__button product-card__button--secondary ${
              isAdded ? "product-card__button--added" : ""
            }`}
            onClick={handleAddToCart}
            aria-label={`Додати ${name} в кошик`}
            disabled={isAdded}
          >
            {isAdded ? "Додано! ✓" : "Купити"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
