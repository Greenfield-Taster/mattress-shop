import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../hooks/useCart";
import { fetchProducts } from "../api/fetchProducts";
import ProductGallery from "../components/ProductGallery/ProductGallery";
import Carousel from "../components/Carousel/Carousel";
import WishlistButton from "../components/WishlistButton/WishlistButton";
import certificateIso from "../assets/images/certificate-ISO.jpg";
import "../styles/pages/_product.scss";

import {
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("characteristics");
  const [loading, setLoading] = useState(true);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Форма для коментарів
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });

  // Мокові дані для відгуків (пізніше будуть з API)
  const mockReviews = useMemo(
    () => [
      {
        id: 1,
        name: "Олена Петренко",
        rating: 5,
        date: "2024-10-15",
        comment:
          "Чудовий матрац! Спина перестала боліти вже через тиждень. Сплю значно краще, прокидаюся відпочившою. Рекомендую всім, хто має проблеми зі спиною!",
        verified: true,
      },
      {
        id: 2,
        name: "Андрій Коваленко",
        rating: 4,
        date: "2024-10-10",
        comment:
          "Якість відмінна, але доставка зайняла трохи більше часу, ніж очікувалося. Сам матрац дуже добрий, ортопедичний ефект відчувається.",
        verified: true,
      },
      {
        id: 3,
        name: "Марія Сидоренко",
        rating: 5,
        date: "2024-10-05",
        comment:
          "Дуже задоволена покупкою. М'який та комфортний, але з хорошою підтримкою. Ціна повністю відповідає якості.",
        verified: true,
      },
      {
        id: 4,
        name: "Ігор Мельник",
        rating: 5,
        date: "2024-09-28",
        comment:
          "Відмінний матрац за свою ціну. Сплю краще ніж на старому дорогому. Не жалію про покупку!",
        verified: false,
      },
      {
        id: 5,
        name: "Наталія Іваненко",
        rating: 4,
        date: "2024-09-20",
        comment:
          "Гарний матрац, але перші дні був специфічний запах нового матеріалу. Швидко вивітрився після провітрювання.",
        verified: true,
      },
      {
        id: 6,
        name: "Сергій Бондаренко",
        rating: 5,
        date: "2024-09-15",
        comment:
          "Купували для дитини. Дуже задоволені. Середньої жорсткості, як рекомендував ортопед.",
        verified: true,
      },
    ],
    []
  );

  // Мокові дані для сертифікатів (пізніше з API)
  const mockCertificates = useMemo(
    () => [
      {
        id: 1,
        title: "Сертифікат якості ISO 9001",
        image: certificateIso,
        description: "Міжнародний стандарт системи управління якістю",
      },
      {
        id: 2,
        title: "Екологічний сертифікат",
        image: certificateIso,
        description:
          "Підтвердження екологічності матеріалів та безпечності для здоров'я",
      },
      {
        id: 3,
        title: "Гігієнічний сертифікат",
        image: certificateIso,
        description: "Відповідність санітарно-гігієнічним нормам України",
      },
    ],
    []
  );

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
          const sizes = [
            "80×190",
            "80×200",
            "90×190",
            "90×200",
            "120×190",
            "120×200",
            "140×190",
            "140×200",
            "160×190",
            "160×200",
            "180×190",
            "180×200",
            "200×200",
          ];

          const productWithVariants = {
            ...foundProduct,
            variants:
              foundProduct.variants ||
              sizes
                .slice(0, 8 + Math.floor(Math.random() * 5))
                .map((size, index) => ({
                  id: `${foundProduct.id}-${index + 1}`,
                  size,
                  price: foundProduct.price + index * 500,
                  oldPrice: foundProduct.oldPrice
                    ? foundProduct.oldPrice + index * 500
                    : null,
                })),
            images: foundProduct.images || [
              foundProduct.image,
              foundProduct.image,
              foundProduct.image,
            ],
            // Додаємо рекомендації (якщо є в API)
            recommendations: foundProduct.recommendations || null,
          };

          setProduct(productWithVariants);
          setSelectedVariant(productWithVariants.variants[0]);

          // Завантажуємо схожі продукти
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

  // Мемоїзовані значення
  const images = useMemo(() => product?.images || [], [product]);
  const variants = useMemo(() => product?.variants || [], [product]);

  // Розраховуємо кількість відгуків для показу
  const visibleReviews = useMemo(() => {
    return showAllReviews ? mockReviews : mockReviews.slice(0, 3);
  }, [showAllReviews, mockReviews]);

  // Розраховуємо середній рейтинг
  const averageRating = useMemo(() => {
    if (mockReviews.length === 0) return 0;
    const sum = mockReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / mockReviews.length).toFixed(1);
  }, [mockReviews]);

  // Handlers
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
    navigate("/checkout");
  }, [handleAddToCart, navigate]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleCommentSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log("Comment submitted:", commentForm);
      setCommentForm({
        name: "",
        email: "",
        rating: 5,
        comment: "",
      });
    },
    [commentForm]
  );

  const toggleSizesVisibility = useCallback(() => {
    setShowAllSizes((prev) => !prev);
  }, []);

  const toggleReviewsVisibility = useCallback(() => {
    setShowAllReviews((prev) => !prev);
  }, []);

  // Визначаємо, скільки розмірів показувати
  const visibleVariants = useMemo(() => {
    const threshold = 6;
    if (variants.length <= threshold || showAllSizes) {
      return variants;
    }
    return variants.slice(0, threshold);
  }, [variants, showAllSizes]);

  const hasMoreSizes = variants.length > 6;

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
            className="btnProd btnProd--primary"
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

              {/* Rating */}
              {mockReviews.length > 0 && (
                <div className="product-info__rating">
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`rating-star ${
                          star <= Math.round(averageRating)
                            ? "rating-star--filled"
                            : ""
                        }`}
                        size={20}
                      />
                    ))}
                  </div>
                  <span className="rating-value">{averageRating}</span>
                  <span className="rating-count">
                    ({mockReviews.length} відгуків)
                  </span>
                </div>
              )}

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
                  <>
                    <span className="product-info__price-old">
                      ₴{selectedVariant.oldPrice.toLocaleString("uk-UA")}
                    </span>
                    <span className="product-info__discount">
                      -
                      {Math.round(
                        ((selectedVariant.oldPrice - selectedVariant.price) /
                          selectedVariant.oldPrice) *
                          100
                      )}
                      %
                    </span>
                  </>
                )}
              </div>

              {/* Size Variants */}
              <div className="product-info__size">
                <label className="product-info__label">Розмір (см)</label>
                <div className="product-info__size-options">
                  {visibleVariants.map((variant) => (
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

                {hasMoreSizes && (
                  <button
                    className="show-more-sizes"
                    onClick={toggleSizesVisibility}
                    aria-expanded={showAllSizes}
                  >
                    {showAllSizes ? (
                      <>
                        Показати менше <ChevronUp size={18} />
                      </>
                    ) : (
                      <>
                        Показати всі розміри ({variants.length}){" "}
                        <ChevronDown size={18} />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="product-info__actions">
                <button
                  className="btnProd btnProd--primary btnProd--large"
                  onClick={handleAddToCart}
                  aria-label="Додати товар у кошик"
                >
                  Додати в кошик
                </button>
                <button
                  className="btnProd btnProd--secondary btnProd--large"
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
                Відгуки {mockReviews.length > 0 && `(${mockReviews.length})`}
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
              {/* Characteristics Tab */}
              {activeTab === "characteristics" && (
                <div
                  role="tabpanel"
                  id="characteristics-panel"
                  aria-labelledby="characteristics-tab"
                  className="tab-content"
                >
                  {/* Рекомендації (якщо є) */}
                  {product.recommendations && (
                    <div className="recommendations-block">
                      <div className="recommendations-block__icon">
                        <ShieldCheck size={24} />
                      </div>
                      <div className="recommendations-block__content">
                        <h3 className="recommendations-block__title">
                          Рекомендації експертів
                        </h3>
                        <p className="recommendations-block__text">
                          {product.recommendations}
                        </p>
                      </div>
                    </div>
                  )}

                  <h3 className="section-subtitle">Технічні характеристики</h3>
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

                  <div className="care-recommendations">
                    <h3 className="section-subtitle">
                      Рекомендації по догляду
                    </h3>
                    <ul className="care-list">
                      <li>Провітрюйте матрац кожні 2-3 місяці</li>
                      <li>Використовуйте наматрацник для захисту</li>
                      <li>
                        Перевертайте матрац раз на 3 місяці для рівномірного
                        зносу
                      </li>
                      <li>Уникайте прямих сонячних променів та вологи</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div
                  role="tabpanel"
                  id="reviews-panel"
                  aria-labelledby="reviews-tab"
                  className="tab-content"
                >
                  {/* Відгуки */}
                  {mockReviews.length > 0 ? (
                    <div className="reviews-section">
                      <div className="reviews-summary">
                        <div className="reviews-summary__rating">
                          <span className="reviews-summary__number">
                            {averageRating}
                          </span>
                          <div className="reviews-summary__stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`rating-star ${
                                  star <= Math.round(averageRating)
                                    ? "rating-star--filled"
                                    : ""
                                }`}
                                size={20}
                              />
                            ))}
                          </div>
                          <span className="reviews-summary__text">
                            Базується на {mockReviews.length} відгуках
                          </span>
                        </div>
                      </div>

                      <div className="reviews-list">
                        {visibleReviews.map((review) => (
                          <div key={review.id} className="review-card">
                            <div className="review-card__header">
                              <div className="review-card__author">
                                <span className="review-card__name">
                                  {review.name}
                                </span>
                                {review.verified && (
                                  <span className="review-card__verified">
                                    <CheckCircle size={16} />
                                    Підтверджена покупка
                                  </span>
                                )}
                              </div>
                              <span className="review-card__date">
                                {new Date(review.date).toLocaleDateString(
                                  "uk-UA",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="review-card__rating">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`rating-star rating-star--small ${
                                    star <= review.rating
                                      ? "rating-star--filled"
                                      : ""
                                  }`}
                                  size={16}
                                />
                              ))}
                            </div>
                            <p className="review-card__comment">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>

                      {mockReviews.length > 3 && (
                        <button
                          className="show-more-reviews"
                          onClick={toggleReviewsVisibility}
                          aria-expanded={showAllReviews}
                        >
                          {showAllReviews ? (
                            <>
                              Показати менше <ChevronUp size={18} />
                            </>
                          ) : (
                            <>
                              Показати всі відгуки ({mockReviews.length}){" "}
                              <ChevronDown size={18} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state__icon">
                        <Star size={48} />
                      </div>
                      <h3 className="empty-state__title">
                        Поки що немає відгуків
                      </h3>
                      <p className="empty-state__text">
                        Будьте першим, хто залишить відгук про цей матрац!
                      </p>
                    </div>
                  )}

                  {/* Форма додавання коментаря */}
                  <div className="comment-form">
                    <h3 className="comment-form__title">Залишити відгук</h3>
                    <form onSubmit={handleCommentSubmit}>
                      <div className="comment-form__row">
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
                          <label
                            htmlFor="email"
                            className="comment-form__label"
                          >
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
                          placeholder="Поділіться своїми враженнями про цей матрац..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="btnProd btnProd--primary"
                      >
                        Відправити відгук
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Certificates Tab */}
              {activeTab === "certificates" && (
                <div
                  role="tabpanel"
                  id="certificates-panel"
                  aria-labelledby="certificates-tab"
                  className="tab-content"
                >
                  {mockCertificates.length > 0 ? (
                    <div className="certificates-grid">
                      {mockCertificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="certificate-card"
                          onClick={() => setSelectedCertificate(cert)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSelectedCertificate(cert);
                            }
                          }}
                        >
                          <div className="certificate-card__image-wrapper">
                            <img
                              src={cert.image}
                              alt={cert.title}
                              className="certificate-card__image"
                              loading="lazy"
                            />
                            <div className="certificate-card__overlay">
                              <Award size={32} />
                              <span>Переглянути</span>
                            </div>
                          </div>
                          <div className="certificate-card__content">
                            <h4 className="certificate-card__title">
                              {cert.title}
                            </h4>
                            <p className="certificate-card__description">
                              {cert.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state__icon">
                        <Award size={48} />
                      </div>
                      <h3 className="empty-state__title">
                        Сертифікати відсутні
                      </h3>
                      <p className="empty-state__text">
                        Для даного товару сертифікати ще не додані. Зв'яжіться з
                        нами для отримання додаткової інформації.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div
          className="certificate-modal"
          onClick={() => setSelectedCertificate(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-modal-title"
        >
          <div
            className="certificate-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="certificate-modal__close"
              onClick={() => setSelectedCertificate(null)}
              aria-label="Закрити модальне вікно"
            >
              ×
            </button>
            <img
              src={selectedCertificate.image}
              alt={selectedCertificate.title}
              className="certificate-modal__image"
            />
            <div className="certificate-modal__info">
              <h3
                id="certificate-modal-title"
                className="certificate-modal__title"
              >
                {selectedCertificate.title}
              </h3>
              <p className="certificate-modal__description">
                {selectedCertificate.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <Carousel
          products={relatedProducts}
          title="Схожі товари"
          showTitle={true}
          showControls={true}
        />
      )}
    </div>
  );
};

export default Product;
