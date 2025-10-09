import { Link } from "react-router-dom";
import "./ProductCard.scss";

// TODO: Цей компонент отримує дані через пропс product
// В майбутньому product буде приходити з API
// Структура даних з API повинна відповідати:
// {
//   id: number,
//   name: string,
//   type: string,
//   height: number,
//   hardness: string,
//   price: number,
//   oldPrice: number | null,
//   image: string (URL)
// }

const ProductCard = ({ product }) => {
  const { id, name, type, height, hardness, price, oldPrice, image } = product;

  const hasDiscount = oldPrice && oldPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        <img src={image} alt={name} className="product-card__image" />
        {hasDiscount && (
          <div className="product-card__discount">-{discountPercent}%</div>
        )}
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{name}</h3>

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
            to={`/products/${id}`}
            className="product-card__button product-card__button--primary"
          >
            Детальніше
          </Link>
          <button
            className="product-card__button product-card__button--secondary"
            onClick={(e) => {
              e.preventDefault();
              // TODO: API - Додати логіку додавання товару в кошик
              // Потрібно буде викликати POST /api/cart з параметрами:
              // { productId: id, quantity: 1 }
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
