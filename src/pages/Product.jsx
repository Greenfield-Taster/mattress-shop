import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  Scale,
  ShoppingCart,
  Truck,
  Shield,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import mattressImage from "../assets/images/mattress-photo.png";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Mock product data
  const mockProduct = {
    id: parseInt(id),
    name: "Матрац Premium Dream Memory",
    price: 7200,
    oldPrice: 8500,
    rating: 4.8,
    reviewsCount: 156,
    inStock: true,
    category: "premium",
    brand: "DreamComfort",
    images: [mattressImage, mattressImage, mattressImage, mattressImage],
    sizes: [
      { id: "single", name: "90x200 см", price: 0 },
      { id: "double", name: "140x200 см", price: 1200 },
      { id: "king", name: "180x200 см", price: 2400 },
    ],
    features: [
      "Memory Foam 5 см",
      "Ортопедична підтримка",
      "Гіпоалергенний",
      "Охолоджуючий ефект",
      "Безшумний",
      "Гарантія 10 років",
    ],
    description: `
      Матрац Premium Dream Memory - це ідеальне поєднання комфорту та підтримки для здорового сну. 
      Інноваційна пам'ять форми Memory Foam адаптується до контурів вашого тіла, забезпечуючи 
      рівномірний розподіл ваги та зменшення тиску на суглоби.
      
      Семизонна підтримка забезпечує оптимальну підтримку різних ділянок тіла, а охолоджуючий 
      гель допомагає підтримувати комфортну температуру протягом всієї ночі.
    `,
    specifications: {
      Висота: "25 см",
      Жорсткість: "Середня",
      Матеріал: "Memory Foam + Pocket Spring",
      Чохол: "Бамбукове волокно",
      Вага: "35-45 кг (залежно від розміру)",
      Гарантія: "10 років",
      Виробник: "DreamComfort",
      Країна: "Україна",
    },
    delivery: {
      Київ: "Безкоштовно, 1-2 дні",
      Україна: "150-300 ₴, 3-5 днів",
      Піднесення: "50 ₴ за поверх",
    },
    reviews: [
      {
        id: 1,
        author: "Марія К.",
        rating: 5,
        date: "2024-12-10",
        text: "Чудовий матрац! Сплю набагато краще, спина не болить вранці.",
        verified: true,
      },
      {
        id: 2,
        author: "Олексій П.",
        rating: 4,
        date: "2024-12-05",
        text: "Якість гарна, доставка швидка. Трохи жорсткуватий для мене, але загалом задоволений.",
        verified: true,
      },
    ],
  };

  // Similar products mock data
  const similarProducts = [
    {
      id: 2,
      name: "Матрац Classic Comfort",
      price: 4500,
      image: mattressImage,
      rating: 4.5,
    },
    {
      id: 3,
      name: "Матрац Luxury Spring",
      price: 9200,
      image: mattressImage,
      rating: 4.9,
    },
    {
      id: 4,
      name: "Матрац Eco Natural",
      price: 6800,
      image: mattressImage,
      rating: 4.6,
    },
  ];

  useEffect(() => {
    // Scroll to top when component mounts or id changes
    window.scrollTo({ top: 0, behavior: "smooth" });

    setProduct(mockProduct);
    if (mockProduct.sizes.length > 0) {
      setSelectedSize(mockProduct.sizes[0].id);
    }

    // Reset states when changing products
    setSelectedImageIndex(0);
    setQuantity(1);
    setActiveTab("description");
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Оберіть розмір матраца");
      return;
    }

    alert(
      `Додано до кошика: ${product.name}, розмір: ${selectedSize}, кількість: ${quantity}`
    );
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Оберіть розмір матраца");
      return;
    }

    navigate("/cart");
  };

  const handleSimilarProductClick = (productId) => {
    // Reset state when clicking on similar product
    setSelectedImageIndex(0);
    setQuantity(1);
    setActiveTab("description");

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getSelectedSizePrice = () => {
    if (!selectedSize || !product) return product?.price || 0;
    const size = product.sizes.find((s) => s.id === selectedSize);
    return product.price + (size?.price || 0);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? "star-filled" : "star-empty"}
      />
    ));
  };

  if (!product) {
    return (
      <div className="product-loading">
        <div className="container">
          <div className="loading-spinner">Завантаження...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="product">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="product__breadcrumbs">
          <Link to="/">Головна</Link>
          <span>/</span>
          <Link to="/catalog">Каталог</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Back button */}
        <button onClick={() => navigate(-1)} className="product__back-btn">
          <ArrowLeft size={16} />
          Назад
        </button>

        <div className="product__content">
          {/* Product Images */}
          <div className="product__images">
            <div className="product__images-main">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="product__images-main-img"
              />
              {product.oldPrice && (
                <div className="product__images-badge">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </div>
              )}
            </div>
            <div className="product__images-thumbs">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`product__images-thumb ${
                    index === selectedImageIndex ? "active" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product__info">
            <div className="product__info-header">
              <h1 className="product__info-title">{product.name}</h1>
              <div className="product__info-rating">
                <div className="product__rating-stars">
                  {renderStars(product.rating)}
                  <span className="product__rating-value">
                    {product.rating}
                  </span>
                </div>
                <span className="product__rating-reviews">
                  ({product.reviewsCount} відгуків)
                </span>
              </div>
            </div>

            <div className="product__info-price">
              {product.oldPrice && (
                <span className="product__price-old">{product.oldPrice} ₴</span>
              )}
              <span className="product__price-current">
                {getSelectedSizePrice()} ₴
              </span>
            </div>

            {/* Features */}
            <div className="product__info-features">
              {product.features.map((feature, index) => (
                <span key={index} className="product__feature-tag">
                  {feature}
                </span>
              ))}
            </div>

            {/* Size Selection */}
            <div className="product__info-sizes">
              <h3>Розмір матраца:</h3>
              <div className="product__sizes-grid">
                {product.sizes.map((size) => (
                  <label
                    key={size.id}
                    className={`product__size-option ${
                      selectedSize === size.id ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={size.id}
                      checked={selectedSize === size.id}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    />
                    <div className="product__size-content">
                      <span className="product__size-name">{size.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="product__info-quantity">
              <h3>Кількість:</h3>
              <div className="product__quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="product__quantity-btn"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="product__quantity-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="product__quantity-btn"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product__info-actions">
              <button
                onClick={handleAddToCart}
                className="btn btn-outline btn-lg"
                disabled={!product.inStock}
              >
                <ShoppingCart size={18} />
                Додати в кошик
              </button>
              <button
                onClick={handleBuyNow}
                className="btn btn-primary btn-lg"
                disabled={!product.inStock}
              >
                Купити зараз
              </button>
            </div>

            {/* Additional actions */}
            <div className="product__info-extra">
              <button className="product__extra-btn">
                <Heart size={18} />В обране
              </button>
              <button className="product__extra-btn">
                <Scale size={18} />
                Порівняти
              </button>
            </div>

            {/* Delivery info */}
            <div className="product__delivery-info">
              <h4 className="product__delivery-title">
                Інформація про доставку
              </h4>
              <div className="product__delivery-item">
                <Truck size={18} />
                <span>Безкоштовна доставка по Києву</span>
              </div>
              <div className="product__delivery-item">
                <Shield size={18} />
                <span>Гарантія 10 років</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product__tabs">
          <div className="product__tabs-hint">
            <span>Корисна інформація про товар:</span>
          </div>
          <div className="product__tabs-nav">
            <button
              className={`product__tab-btn ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              Опис
            </button>
            <button
              className={`product__tab-btn ${
                activeTab === "specifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Характеристики
            </button>
            <button
              className={`product__tab-btn ${
                activeTab === "delivery" ? "active" : ""
              }`}
              onClick={() => setActiveTab("delivery")}
            >
              Доставка
            </button>
            <button
              className={`product__tab-btn ${
                activeTab === "reviews" ? "active" : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Відгуки ({product.reviews.length})
            </button>
          </div>

          <div className="product__tabs-content">
            {activeTab === "description" && (
              <div className="product__tab-panel">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="product__tab-panel">
                <table className="product__specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="product__tab-panel">
                <div className="product__delivery-options">
                  {Object.entries(product.delivery).map(([location, info]) => (
                    <div key={location} className="product__delivery-option">
                      <strong>{location}:</strong> {info}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="product__tab-panel">
                <div className="product__reviews">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="product__review">
                      <div className="product__review-header">
                        <div className="product__review-author">
                          <strong>{review.author}</strong>
                          {review.verified && (
                            <span className="product__review-verified">
                              ✓ Підтверджена покупка
                            </span>
                          )}
                        </div>
                        <div className="product__review-meta">
                          <div className="product__review-rating">
                            {renderStars(review.rating)}
                          </div>
                          <span className="product__review-date">
                            {review.date}
                          </span>
                        </div>
                      </div>
                      <p className="product__review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        <div className="product__similar">
          <h2 className="product__similar-title">Схожі товари</h2>
          <div className="product__similar-grid">
            {similarProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="product__similar-card"
                onClick={() => handleSimilarProductClick(item.id)}
              >
                <div className="product__similar-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="product__similar-content">
                  <h3>{item.name}</h3>
                  <div className="product__similar-rating">
                    {renderStars(item.rating)}
                    <span>{item.rating}</span>
                  </div>
                  <div className="product__similar-price">{item.price} ₴</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
