import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../hooks/useCart";
import { fetchProducts } from "../api/fetchProducts";
import ProductGallery from "../components/ProductGallery/ProductGallery";
import ProductCarousel from "../components/ProductCarousel/ProductCarousel";
import WishlistButton from "../components/WishlistButton/WishlistButton";
import "../styles/pages/Product.scss";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("characteristics");
  const [loading, setLoading] = useState(true);

  // Форма для коментарів
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });

  // Завантаження продукту та схожих товарів
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const response = await fetchProducts({ limit: 100 });
        const foundProduct = response.items.find(
          (item) => item.id === parseInt(id)
        );

        if (foundProduct) {
          // Додаємо варіанти розмірів якщо їх немає
          const productWithVariants = {
            ...foundProduct,
            variants: foundProduct.variants || [
              {
                id: `${foundProduct.id}-1`,
                size: "160×200",
                price: foundProduct.price,
                oldPrice: foundProduct.oldPrice,
              },
              {
                id: `${foundProduct.id}-2`,
                size: "180×200",
                price: foundProduct.price + 1000,
                oldPrice: foundProduct.oldPrice
                  ? foundProduct.oldPrice + 1000
                  : null,
              },
              {
                id: `${foundProduct.id}-3`,
                size: "200×200",
                price: foundProduct.price + 2000,
                oldPrice: foundProduct.oldPrice
                  ? foundProduct.oldPrice + 2000
                  : null,
              },
            ],
            images: foundProduct.images || [
              foundProduct.image,
              foundProduct.image,
              foundProduct.image,
            ],
          };

          setProduct(productWithVariants);

          // Вибираємо перший варіант
          setSelectedVariant(productWithVariants.variants[0]);

          // Завантажуємо всі схожі продукти (без slice для каруселі)
          const similar = response.items.filter(
            (item) =>
              item.type === foundProduct.type && item.id !== foundProduct.id
          );
          setRelatedProducts(similar);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Мемоїзовані значення для оптимізації
  const images = useMemo(() => {
    return product?.images || [];
  }, [product]);

  const variants = useMemo(() => {
    return product?.variants || [];
  }, [product]);

  // Handlers з useCallback для оптимізації
  const handleVariantChange = useCallback((variant) => {
    setSelectedVariant(variant);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedVariant) return;

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      title: product.name,
      size: selectedVariant.size,
      firmness: product.hardness,
      price: selectedVariant.price,
      image: product.images?.[0] || product.image,
      qty: 1,
    });
  }, [product, selectedVariant, addItem]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    navigate("/cart");
  }, [handleAddToCart, navigate]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleCommentSubmit = useCallback(
    (e) => {
      e.preventDefault();
      // TODO: Відправка коментаря на сервер
      console.log("Comment submitted:", commentForm);
      // Очистити форму
      setCommentForm({
        name: "",
        email: "",
        rating: 5,
        comment: "",
      });
    },
    [commentForm]
  );

  // Loading state
  if (loading) {
    return (
      <div className="product-loading">
        <div className="container">
          <div className="product-loading__spinner">
            <div className="spinner"></div>
            <p>Завантаження...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h2>Товар не знайдено</h2>
          <p>На жаль, цей товар недоступний або видалений з каталогу.</p>
          <button
            onClick={() => navigate("/catalog")}
            className="btn btn--primary"
          >
            Повернутися до каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      {/* Product Details Section */}
      <section className="product-details">
        <div className="container">
          <div className="product-details__grid">
            {/* Image Gallery */}
            <ProductGallery
              images={images}
              alt={product.name}
              priority={true}
            />

            {/* Product Info */}
            <div className="product-info">
              <div className="product-info__header">
                <h1 className="product-info__title">{product.name}</h1>
                <WishlistButton product={product} variant="default" />
              </div>

              <div className="product-info__features">
                <span className="product-info__feature">
                  {product.blockType}
                </span>
                <span className="product-info__separator" aria-hidden="true">
                  •
                </span>
                <span className="product-info__feature">
                  {product.hardness}
                </span>
                {product.cover && (
                  <>
                    <span
                      className="product-info__separator"
                      aria-hidden="true"
                    >
                      •
                    </span>
                    <span className="product-info__feature">
                      {product.cover} чохол
                    </span>
                  </>
                )}
              </div>

              <div className="product-info__price">
                <span className="product-info__price-current">
                  ₴{selectedVariant?.price.toLocaleString("uk-UA")}
                </span>
                {selectedVariant?.oldPrice && (
                  <span className="product-info__price-old">
                    ₴{selectedVariant.oldPrice.toLocaleString("uk-UA")}
                  </span>
                )}
              </div>

              {/* Size Variants */}
              <div className="product-info__size">
                <label className="product-info__label">Розмір (см)</label>
                <div className="product-info__size-options">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      className={`size-button ${
                        selectedVariant?.id === variant.id
                          ? "size-button--active"
                          : ""
                      }`}
                      onClick={() => handleVariantChange(variant)}
                      aria-pressed={selectedVariant?.id === variant.id}
                      aria-label={`Розмір ${variant.size}`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="product-info__actions">
                <button
                  className="btn btn--primary btn--large"
                  onClick={handleAddToCart}
                  aria-label="Додати товар у кошик"
                >
                  Додати в кошик
                </button>
                <button
                  className="btn btn--secondary btn--large"
                  onClick={handleBuyNow}
                  aria-label="Швидка покупка товару"
                >
                  Купити зараз
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="product-tabs">
        <div className="container">
          <div className="tabs">
            <div className="tabs__header" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === "characteristics"}
                aria-controls="characteristics-panel"
                id="characteristics-tab"
                className={`tabs__button ${
                  activeTab === "characteristics" ? "tabs__button--active" : ""
                }`}
                onClick={() => handleTabChange("characteristics")}
              >
                Характеристики
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "reviews"}
                aria-controls="reviews-panel"
                id="reviews-tab"
                className={`tabs__button ${
                  activeTab === "reviews" ? "tabs__button--active" : ""
                }`}
                onClick={() => handleTabChange("reviews")}
              >
                Відгуки
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "certificates"}
                aria-controls="certificates-panel"
                id="certificates-tab"
                className={`tabs__button ${
                  activeTab === "certificates" ? "tabs__button--active" : ""
                }`}
                onClick={() => handleTabChange("certificates")}
              >
                Сертифікати
              </button>
            </div>

            <div className="tabs__content">
              {activeTab === "characteristics" && (
                <div
                  role="tabpanel"
                  id="characteristics-panel"
                  aria-labelledby="characteristics-tab"
                  className="tab-content"
                >
                  <div className="characteristics-grid">
                    <div className="characteristic-item">
                      <span className="characteristic-item__label">Тип:</span>
                      <span className="characteristic-item__value">
                        {product.type}
                      </span>
                    </div>
                    <div className="characteristic-item">
                      <span className="characteristic-item__label">
                        Висота:
                      </span>
                      <span className="characteristic-item__value">
                        {product.height} см
                      </span>
                    </div>
                    <div className="characteristic-item">
                      <span className="characteristic-item__label">
                        Жорсткість:
                      </span>
                      <span className="characteristic-item__value">
                        {product.hardness}
                      </span>
                    </div>
                    <div className="characteristic-item">
                      <span className="characteristic-item__label">Блок:</span>
                      <span className="characteristic-item__value">
                        {product.blockType}
                      </span>
                    </div>
                    {product.fillers && (
                      <div className="characteristic-item">
                        <span className="characteristic-item__label">
                          Наповнювачі:
                        </span>
                        <span className="characteristic-item__value">
                          {product.fillers.join(", ")}
                        </span>
                      </div>
                    )}
                    {product.cover && (
                      <div className="characteristic-item">
                        <span className="characteristic-item__label">
                          Чохол:
                        </span>
                        <span className="characteristic-item__value">
                          {product.cover}
                        </span>
                      </div>
                    )}
                    {product.maxWeight && (
                      <div className="characteristic-item">
                        <span className="characteristic-item__label">
                          Макс. вага:
                        </span>
                        <span className="characteristic-item__value">
                          до {product.maxWeight} кг
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="tab-content__description">
                    Рекомендації: провітрювати кожні 2 місяці, використовувати
                    наматрацник для захисту.
                  </p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div
                  role="tabpanel"
                  id="reviews-panel"
                  aria-labelledby="reviews-tab"
                  className="tab-content"
                >
                  {/* Форма додавання коментаря */}
                  <div className="comment-form">
                    <h3 className="comment-form__title">Залишити відгук</h3>
                    <form onSubmit={handleCommentSubmit}>
                      <div className="comment-form__group">
                        <label htmlFor="name" className="comment-form__label">
                          Ваше ім'я *
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="comment-form__input"
                          value={commentForm.name}
                          onChange={(e) =>
                            setCommentForm({
                              ...commentForm,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="comment-form__group">
                        <label htmlFor="email" className="comment-form__label">
                          Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="comment-form__input"
                          value={commentForm.email}
                          onChange={(e) =>
                            setCommentForm({
                              ...commentForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="comment-form__group">
                        <label className="comment-form__label">Оцінка *</label>
                        <div className="comment-form__rating" role="radiogroup">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              role="radio"
                              aria-checked={star === commentForm.rating}
                              aria-label={`${star} з 5 зірок`}
                              className={`comment-form__star ${
                                star <= commentForm.rating
                                  ? "comment-form__star--active"
                                  : ""
                              }`}
                              onClick={() =>
                                setCommentForm({ ...commentForm, rating: star })
                              }
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="comment-form__group">
                        <label
                          htmlFor="comment"
                          className="comment-form__label"
                        >
                          Ваш відгук *
                        </label>
                        <textarea
                          id="comment"
                          className="comment-form__textarea"
                          rows="5"
                          value={commentForm.comment}
                          onChange={(e) =>
                            setCommentForm({
                              ...commentForm,
                              comment: e.target.value,
                            })
                          }
                          required
                        ></textarea>
                      </div>

                      <button type="submit" className="btn btn--primary">
                        Відправити відгук
                      </button>
                    </form>
                  </div>

                  {/* Список відгуків */}
                  <div className="reviews-list">
                    <p className="reviews-list__empty">
                      Відгуки відсутні. Будьте першим, хто залишить відгук!
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "certificates" && (
                <div
                  role="tabpanel"
                  id="certificates-panel"
                  aria-labelledby="certificates-tab"
                  className="tab-content"
                >
                  <p className="tab-content__description">
                    Інформація про сертифікати буде доступна незабаром.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Similar Products Carousel */}
      {relatedProducts.length > 0 && (
        <ProductCarousel products={relatedProducts} title="Схожі товари" />
      )}
    </div>
  );
};

export default Product;
