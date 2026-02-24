import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { fetchProducts, fetchProductById } from "../api/fetchProducts";
import { getProductReviews, createReview } from "../api/reviewApi";
import ProductGallery from "../components/ProductGallery/ProductGallery";
import Carousel from "../components/Carousel/Carousel";
import WishlistButton from "../components/WishlistButton/WishlistButton";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import { TYPE_LABELS, BLOCK_TYPE_LABELS, COVER_TYPE_LABELS, FILLER_LABELS, HARDNESS_LABELS, t } from "../utils/productLabels";
import usePageMeta from "../hooks/usePageMeta";
import { PAGE_SEO, buildProductJsonLd, buildBreadcrumbJsonLd } from "../utils/seoData";
import { STORE_INFO } from "../utils/storeInfo";
import { normalizeError } from "../utils/errorMessages";
import { SkeletonProductDetail } from "../components/Skeleton/Skeleton";
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
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  usePageMeta({
    title: product?.name,
    description: product ? `Ортопедичний матрац ${product.name} від Just Sleep. Ціна від ${product.minPrice || product.price} ₴. Доставка по Україні.` : undefined,
    path: product ? `/product/${product.handle || id}` : undefined,
    ogType: "product",
    ogImage: product?.images?.[0],
    jsonLd: product ? [
      buildProductJsonLd(product),
      buildBreadcrumbJsonLd([
        { name: "Головна", url: "/" },
        { name: "Каталог", url: "/catalog" },
        { name: product.name },
      ]),
    ] : undefined,
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  // Відгуки — реальні дані з API
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [reviewSort, setReviewSort] = useState("newest");
  const [reviewOffset, setReviewOffset] = useState(0);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Форма для коментарів
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });

  // Сертифікати з API
  const productCertificates = useMemo(
    () => (Array.isArray(product?.certificates) ? product.certificates : []),
    [product]
  );

  // Завантаження продукту та схожих товарів
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        // Спочатку пробуємо отримати продукт напряму за ID/handle
        let foundProduct = await fetchProductById(id);

        // Якщо не знайшли - шукаємо в списку (для сумісності з числовими ID)
        if (!foundProduct) {
          const response = await fetchProducts({ limit: 100 });
          foundProduct = response.items.find(
            (item) => item.id === id || item.id === parseInt(id) || item.handle === id
          );
        }

        if (foundProduct) {
          // Нормалізуємо структуру даних для сумісності з mock і API
          const normalizedProduct = {
            ...foundProduct,
            // Нормалізуємо description
            description: foundProduct.description || {
              main: foundProduct.descriptionMain || foundProduct.description_main || "",
              care: foundProduct.descriptionCare || foundProduct.description_care || "",
              specs: foundProduct.specs || [],
            },
            // Нормалізуємо variants (detail endpoint може повернути об'єкт замість масиву)
            variants: Array.isArray(foundProduct.variants)
              ? foundProduct.variants
              : (foundProduct.allVariants || []),
            // Нормалізуємо images
            images: foundProduct.images || [
              foundProduct.image || foundProduct.thumbnail,
            ].filter(Boolean),
            // cover може приходити як coverType
            cover: foundProduct.cover || foundProduct.coverType,
          };

          // Якщо description - рядок, перетворюємо в об'єкт
          if (typeof normalizedProduct.description === "string") {
            normalizedProduct.description = {
              main: normalizedProduct.description,
              care: foundProduct.descriptionCare || foundProduct.description_care || "",
              specs: foundProduct.specs || [],
            };
          }

          setProduct(normalizedProduct);

          if (normalizedProduct.variants.length > 0) {
            setSelectedVariant(normalizedProduct.variants[0]);
          }

          // Завантажуємо схожі продукти (по типу матраца)
          const productType = normalizedProduct.type;
          if (productType) {
            const response = await fetchProducts({
              types: [productType],
              limit: 7, // +1 бо потенційно включатиме поточний товар
            });
            const similar = response.items
              .filter((item) => item.id !== normalizedProduct.id)
              .slice(0, 6);
            setRelatedProducts(similar);
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Завантаження відгуків з API
  const loadReviews = useCallback(async (productId, sort = "newest", offset = 0, append = false) => {
    try {
      const data = await getProductReviews(productId, { sort, limit: 5, offset });
      if (append) {
        setReviews((prev) => [...prev, ...data.reviews]);
      } else {
        setReviews(data.reviews);
      }
      setReviewStats(data.stats);
      setReviewTotal(data.count);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  }, []);

  useEffect(() => {
    if (product?.id) {
      setReviews([]);
      setReviewOffset(0);
      loadReviews(product.id, reviewSort, 0);
    }
  }, [product?.id, reviewSort, loadReviews]);

  // Автозаповнення форми відгуку для авторизованих користувачів
  useEffect(() => {
    if (user && !reviewSubmitted) {
      setCommentForm((prev) => ({
        ...prev,
        name: prev.name || [user.firstName, user.lastName].filter(Boolean).join(" "),
        email: prev.email || user.email || "",
      }));
    }
  }, [user, reviewSubmitted]);

  // Мемоїзовані значення
  const images = useMemo(() => product?.images || [], [product]);

  // Варіанти продукту з обов'язковим "Нестандартний" розміром
  const variants = useMemo(() => {
    const productVariants = product?.variants || [];

    // Перевіряємо чи вже є нестандартний розмір
    const hasCustom = productVariants.some(v => v.isCustom || v.size === "custom" || v.size === "Нестандартний");

    if (hasCustom) {
      return productVariants;
    }

    // Додаємо нестандартний розмір в кінець списку
    const customVariant = {
      id: "custom",
      size: "Нестандартний",
      price: 0,
      isCustom: true,
    };

    return [...productVariants, customVariant];
  }, [product]);

  const averageRating = reviewStats.averageRating;
  const reviewCount = reviewStats.count;

  // Handlers
  const handleVariantChange = useCallback((variant) => {
    setSelectedVariant(variant);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedVariant) return;

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      product_id: product.id,
      variant_id: selectedVariant.id,
      title: product.name,
      size: selectedVariant.size,
      firmness: product.hardness,
      price: selectedVariant.price,
      image: product.images?.[0] || product.image,
      qty: 1,
    });

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  }, [product, selectedVariant, addItem]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    navigate("/checkout");
  }, [handleAddToCart, navigate]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Валідація форми відгуку
  const validateReviewForm = useCallback(() => {
    const errors = {};
    const { name, email, rating, comment } = commentForm;

    if (!name || name.trim().length < 2) {
      errors.name = "Ім'я має містити мінімум 2 символи";
    } else if (name.trim().length > 50) {
      errors.name = "Ім'я має містити максимум 50 символів";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Невірний формат email";
    }

    if (!rating || rating < 1 || rating > 5) {
      errors.rating = "Оберіть оцінку від 1 до 5";
    }

    if (!comment || comment.trim().length < 10) {
      errors.comment = "Відгук має містити мінімум 10 символів";
    } else if (comment.trim().length > 1000) {
      errors.comment = "Відгук має містити максимум 1000 символів";
    }

    return errors;
  }, [commentForm]);

  const handleCommentSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setReviewError("");
      setFormErrors({});

      const errors = validateReviewForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setReviewSubmitting(true);
      try {
        await createReview({
          product_id: product.id,
          name: commentForm.name.trim(),
          email: commentForm.email.trim(),
          rating: commentForm.rating,
          comment: commentForm.comment.trim(),
        });
        setReviewSubmitted(true);
      } catch (error) {
        setReviewError(normalizeError(error, "Помилка відправки відгуку. Спробуйте пізніше."));
      } finally {
        setReviewSubmitting(false);
      }
    },
    [commentForm, product, validateReviewForm]
  );

  const handleLoadMoreReviews = useCallback(() => {
    const newOffset = reviewOffset + 5;
    setReviewOffset(newOffset);
    loadReviews(product.id, reviewSort, newOffset, true);
  }, [reviewOffset, product, reviewSort, loadReviews]);

  const toggleSizesVisibility = useCallback(() => {
    setShowAllSizes((prev) => !prev);
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
    return <SkeletonProductDetail />;
  }

  // Error state
  if (loadError) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h2>Помилка завантаження</h2>
          <p>Не вдалося завантажити товар. Перевірте з'єднання з інтернетом.</p>
          <button
            onClick={() => window.location.reload()}
            className="btnProd btnProd--primary"
          >
            Спробувати ще раз
          </button>
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

              {/* Article ID */}
              {product.articleId && (
                <div className="product-info__article">
                  <span className="product-info__article-label">Артикул:</span>
                  <span className="product-info__article-value">{product.articleId}</span>
                </div>
              )}

              {/* Rating */}
              {reviewCount > 0 && (
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
                    ({reviewCount} відгуків)
                  </span>
                </div>
              )}

              <div className="product-info__features">
                <span className="product-info__feature">
                  {t(BLOCK_TYPE_LABELS, product.blockType)}
                </span>
                <span className="product-info__separator" aria-hidden="true">
                  •
                </span>
                <span className="product-info__feature">
                  {t(HARDNESS_LABELS, product.hardness)}
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
                      {t(COVER_TYPE_LABELS, product.cover)} чохол
                    </span>
                  </>
                )}
              </div>

              <div className="product-info__price">
                {selectedVariant?.isCustom ? (
                  <div className="product-info__custom-price">
                    <span className="product-info__custom-price-text">Під замовлення</span>
                    <span className="product-info__custom-price-subtitle">Зв'яжіться з нами для уточнення ціни</span>
                  </div>
                ) : (
                  <>
                    <span className="product-info__price-current">
                      ₴{selectedVariant?.price.toLocaleString("uk-UA")}
                    </span>
                    {selectedVariant?.oldPrice && (product.discount || product.discountPercent) > 0 && (
                      <>
                        <span className="product-info__price-old">
                          ₴{selectedVariant.oldPrice.toLocaleString("uk-UA")}
                        </span>
                        <span className="product-info__discount">
                          -{product.discount || product.discountPercent}%
                        </span>
                      </>
                    )}
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
                        variant.isCustom ? "size-button--custom" : ""
                      } ${
                        selectedVariant?.id === variant.id
                          ? "size-button--active"
                          : ""
                      }`}
                      onClick={() => handleVariantChange(variant)}
                      aria-pressed={selectedVariant?.id === variant.id}
                      aria-label={`Розмір ${variant.size}`}
                    >
                      {variant.isCustom ? "Нестандартний" : variant.size}
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
                {selectedVariant?.isCustom ? (
                  <>
                    <button
                      className="btnProd btnProd--primary btnProd--large"
                      onClick={() => window.location.href = '/contacts'}
                      aria-label="Зв'язатися з нами"
                    >
                      Замовити консультацію
                    </button>
                    <button
                      className="btnProd btnProd--secondary btnProd--large"
                      onClick={() => window.location.href = `tel:${STORE_INFO.phones[0]}`}
                      aria-label="Зателефонувати"
                    >
                      Подзвонити
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`btnProd btnProd--primary btnProd--large ${
                        isAdded ? "btnProd--added" : ""
                      }`}
                      onClick={handleAddToCart}
                      aria-label="Додати товар у кошик"
                      disabled={isAdded}
                    >
                      {isAdded ? "Додано! ✓" : "Додати в кошик"}
                    </button>
                    <button
                      className="btnProd btnProd--secondary btnProd--large"
                      onClick={handleBuyNow}
                      aria-label="Швидка покупка товару"
                    >
                      Купити зараз
                    </button>
                  </>
                )}
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
                aria-selected={activeTab === "description"}
                aria-controls="description-panel"
                id="description-tab"
                className={`tabs__button ${
                  activeTab === "description" ? "tabs__button--active" : ""
                }`}
                onClick={() => handleTabChange("description")}
              >
                Опис
              </button>
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
                Відгуки {reviewCount > 0 && `(${reviewCount})`}
              </button>
              {productCertificates.length > 0 && (
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
              )}
            </div>

            <div className="tabs__content">
              {/* Description Tab */}
              {activeTab === "description" && (
                <div
                  role="tabpanel"
                  id="description-panel"
                  aria-labelledby="description-tab"
                  className="tab-content"
                >
                  {/* Опис товару */}
                  {product.description?.main ? (
                    <div className="product-description">
                      <h3 className="section-subtitle">Опис товару</h3>
                      <div className="product-description__content">
                        <p className="product-description__text">{product.description.main}</p>

                        {product.description.care && (
                          <div className="product-description__care">
                            <h4 className="product-description__care-title">Догляд за матрацом:</h4>
                            <p className="product-description__care-text">{product.description.care}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state__icon">
                        <ShieldCheck size={48} />
                      </div>
                      <h3 className="empty-state__title">
                        Опис відсутній
                      </h3>
                      <p className="empty-state__text">
                        Для даного товару детальний опис ще не додано. Зв'яжіться з нами для отримання додаткової інформації.
                      </p>
                    </div>
                  )}
                </div>
              )}

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
                        {TYPE_LABELS[product.type] || product.type}
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
                        {t(HARDNESS_LABELS, product.hardness)}
                      </span>
                    </div>
                    <div className="characteristic-item">
                      <span className="characteristic-item__label">Блок:</span>
                      <span className="characteristic-item__value">
                        {t(BLOCK_TYPE_LABELS, product.blockType)}
                      </span>
                    </div>
                    {product.fillers?.length > 0 && (
                      <div className="characteristic-item">
                        <span className="characteristic-item__label">
                          Наповнювачі:
                        </span>
                        <span className="characteristic-item__value">
                          {product.fillers.map(f => t(FILLER_LABELS, f)).join(", ")}
                        </span>
                      </div>
                    )}
                    {product.cover && (
                      <div className="characteristic-item">
                        <span className="characteristic-item__label">
                          Чохол:
                        </span>
                        <span className="characteristic-item__value">
                          {t(COVER_TYPE_LABELS, product.cover)}
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
                  {reviewCount > 0 ? (
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
                            Базується на {reviewCount} відгуках
                          </span>
                        </div>

                        {/* Розподіл оцінок */}
                        <div className="reviews-distribution">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviewStats.distribution[star] || 0;
                            const percentage = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
                            return (
                              <div key={star} className="reviews-distribution__row">
                                <span className="reviews-distribution__label">{star}★</span>
                                <div className="reviews-distribution__bar">
                                  <div
                                    className="reviews-distribution__fill"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="reviews-distribution__count">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Сортування */}
                      <div className="reviews-sort">
                        <span className="reviews-sort__label">Сортувати:</span>
                        <CustomSelect
                          value={reviewSort}
                          onChange={(val) => {
                            setReviewSort(val);
                            setReviewOffset(0);
                          }}
                          options={[
                            { value: "newest", label: "Нові спочатку" },
                            { value: "highest", label: "Висока оцінка" },
                            { value: "lowest", label: "Низька оцінка" },
                          ]}
                        />
                      </div>

                      <div className="reviews-list">
                        {reviews.map((review) => (
                          <div key={review.id} className="review-card">
                            <div className="review-card__header">
                              <div className="review-card__author">
                                <span className="review-card__name">
                                  {review.name}
                                </span>
                                {review.is_verified_purchase && (
                                  <span className="review-card__verified">
                                    <CheckCircle size={16} />
                                    Підтверджена покупка
                                  </span>
                                )}
                              </div>
                              <span className="review-card__date">
                                {new Date(review.created_at).toLocaleDateString(
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

                      {reviews.length < reviewTotal && (
                        <button
                          className="show-more-reviews"
                          onClick={handleLoadMoreReviews}
                        >
                          Показати більше відгуків <ChevronDown size={18} />
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
                  {reviewSubmitted ? (
                    <div className="review-success">
                      <CheckCircle size={32} />
                      <h3>Дякуємо за ваш відгук!</h3>
                      <p>Ваш відгук буде опублікований після модерації.</p>
                    </div>
                  ) : (
                    <div className="comment-form">
                      <h3 className="comment-form__title">Залишити відгук</h3>

                      {reviewError && (
                        <div className="review-error">{reviewError}</div>
                      )}

                      <form onSubmit={handleCommentSubmit}>
                        <div className="comment-form__row">
                          <div className="comment-form__group">
                            <label htmlFor="review-name" className="comment-form__label">
                              Ваше ім'я *
                            </label>
                            <input
                              id="review-name"
                              type="text"
                              className={`comment-form__input ${formErrors.name ? "comment-form__input--error" : ""}`}
                              value={commentForm.name}
                              onChange={(e) =>
                                setCommentForm({
                                  ...commentForm,
                                  name: e.target.value,
                                })
                              }
                              maxLength={50}
                              disabled={reviewSubmitting}
                            />
                            {formErrors.name && (
                              <span className="comment-form__field-error">{formErrors.name}</span>
                            )}
                          </div>

                          <div className="comment-form__group">
                            <label
                              htmlFor="review-email"
                              className="comment-form__label"
                            >
                              Email *
                            </label>
                            <input
                              id="review-email"
                              type="email"
                              className={`comment-form__input ${formErrors.email ? "comment-form__input--error" : ""}`}
                              value={commentForm.email}
                              onChange={(e) =>
                                setCommentForm({
                                  ...commentForm,
                                  email: e.target.value,
                                })
                              }
                              disabled={reviewSubmitting}
                            />
                            {formErrors.email && (
                              <span className="comment-form__field-error">{formErrors.email}</span>
                            )}
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
                                disabled={reviewSubmitting}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                          {formErrors.rating && (
                            <span className="comment-form__field-error">{formErrors.rating}</span>
                          )}
                        </div>

                        <div className="comment-form__group">
                          <label
                            htmlFor="review-comment"
                            className="comment-form__label"
                          >
                            Ваш відгук *
                          </label>
                          <textarea
                            id="review-comment"
                            className={`comment-form__textarea ${formErrors.comment ? "comment-form__input--error" : ""}`}
                            rows="5"
                            value={commentForm.comment}
                            onChange={(e) =>
                              setCommentForm({
                                ...commentForm,
                                comment: e.target.value,
                              })
                            }
                            placeholder="Поділіться своїми враженнями про цей матрац..."
                            maxLength={1000}
                            disabled={reviewSubmitting}
                          ></textarea>
                          <div className="comment-form__char-count">
                            {commentForm.comment.length}/1000
                          </div>
                          {formErrors.comment && (
                            <span className="comment-form__field-error">{formErrors.comment}</span>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="btnProd btnProd--primary"
                          disabled={reviewSubmitting}
                        >
                          {reviewSubmitting ? "Відправка..." : "Відправити відгук"}
                        </button>
                      </form>
                    </div>
                  )}
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
                  <div className="certificates-grid">
                    {productCertificates.map((cert, index) => (
                      <div
                        key={index}
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
                          {cert.description && (
                            <p className="certificate-card__description">
                              {cert.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
              {selectedCertificate.description && (
                <p className="certificate-modal__description">
                  {selectedCertificate.description}
                </p>
              )}
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
