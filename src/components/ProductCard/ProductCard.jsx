import { Link } from "react-router-dom";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const { id, name, type, height, hardness, price, oldPrice, image } = product;

  const hasDiscount = oldPrice && oldPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      {/* IMAGE SECTION */}
      <div className="product-card__image-wrapper">
        <img src={image} alt={name} className="product-card__image" />
        {hasDiscount && (
          <div className="product-card__discount">-{discountPercent}%</div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="product-card__content">
        {/* TITLE */}
        <h3 className="product-card__title">{name}</h3>

        {/* SPECS */}
        <div className="product-card__specs">
          {type && <span className="product-card__spec">{type}</span>}
          {height && (
            <>
              <span className="product-card__separator">•</span>
              <span className="product-card__spec">{height} см</span>
            </>
          )}
          {hardness && (
            <>
              <span className="product-card__separator">•</span>
              <span className="product-card__spec">{hardness}</span>
            </>
          )}
        </div>

        {/* PRICE */}
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

        {/* ACTIONS */}
        <div className="product-card__actions">
          <Link
            to={`/products/${id}`}
            className="product-card__button product-card__button--primary"
          >
            Детальніше
          </Link>
          <button
            className="product-card__button product-card__button--secondary"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to cart logic
              console.log("Add to cart:", id);
            }}
          >
            До кошика
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
