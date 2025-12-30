import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useCart } from "../../hooks/useCart";
import WishlistButton from "../WishlistButton/WishlistButton";
import "./ProductCard.scss";

// Нормалізує розмір для порівняння (замінює різні варіанти "x" на кириличний "х")
const normalizeSize = (size) => {
  if (!size) return "";
  return size.replace(/[×xXхХ]/g, "х");
};

const ProductCard = ({ product, selectedSize = null }) => {
  const { id, name, type, height, hardness, image, variants } = product;
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Визначаємо ціну на основі вибраного розміру або використовуємо базову
  const { displayPrice, displayOldPrice, displaySize } = useMemo(() => {
    // Якщо є вибраний розмір і є варіанти - шукаємо відповідний варіант
    if (selectedSize && variants?.length > 0) {
      const normalizedSelectedSize = normalizeSize(selectedSize);
      const matchedVariant = variants.find(
        (v) => normalizeSize(v.size) === normalizedSelectedSize
      );

      if (matchedVariant) {
        return {
          displayPrice: matchedVariant.price,
          displayOldPrice: matchedVariant.oldPrice,
          displaySize: matchedVariant.size,
        };
      }
    }

    // Інакше використовуємо базову ціну продукту
    return {
      displayPrice: product.price,
      displayOldPrice: product.oldPrice,
      displaySize: product.size,
    };
  }, [product, selectedSize, variants]);

  // Використовуємо знижку з API (discount або discountPercent), а не розраховуємо з цін
  const discountPercent = product.discount || product.discountPercent || 0;
  const hasDiscount = discountPercent > 0 && displayOldPrice && displayOldPrice > displayPrice;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id,
      title: name,
      size: displaySize || (height ? `${height} см` : "Стандарт"),
      firmness: hardness || "Середня",
      price: displayPrice,
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
            ₴{displayPrice?.toLocaleString("uk-UA")}
          </span>
          {hasDiscount && (
            <span className="product-card__old-price">
              ₴{displayOldPrice?.toLocaleString("uk-UA")}
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
