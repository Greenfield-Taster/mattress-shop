import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Scale, ShoppingCart, Search, Filter, X } from "lucide-react";
import mattressPhoto from "../assets/images/mattress-photo.png";

const Catalog = () => {
  const { size } = useParams();
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    firmness: "",
    material: "",
  });

  const mockProducts = [
    {
      id: 1,
      name: "Матрац Comfort Classic",
      price: 4500,
      oldPrice: 5000,
      image: mattressPhoto,
      rating: 4.5,
      reviews: 23,
      features: ["Ортопедичний", "Гіпоалергенний"],
      inStock: true,
      size: "single",
      firmness: "medium",
      material: "spring",
    },
    {
      id: 2,
      name: "Матрац Premium Dream",
      price: 7200,
      image: mattressPhoto,
      rating: 4.8,
      reviews: 45,
      features: ["Memoria", "Охолоджуючий"],
      inStock: true,
      size: "double",
      firmness: "soft",
      material: "memory",
    },
    {
      id: 3,
      name: "Матрац Elite Support",
      price: 9800,
      image: mattressPhoto,
      rating: 4.9,
      reviews: 67,
      features: ["Pocket Spring", "Natura"],
      inStock: false,
      size: "king",
      firmness: "firm",
      material: "spring",
    },
    {
      id: 4,
      name: "Матрац Ultra Comfort",
      price: 6200,
      oldPrice: 7000,
      image: mattressPhoto,
      rating: 4.7,
      reviews: 89,
      features: ["Memory Foam", "Антибактеріальний"],
      inStock: true,
      size: "single",
      firmness: "soft",
      material: "memory",
    },
    {
      id: 5,
      name: "Матрац Royal Sleep",
      price: 12500,
      image: mattressPhoto,
      rating: 4.9,
      reviews: 156,
      features: ["Latex", "Терморегуляція"],
      inStock: true,
      size: "king",
      firmness: "firm",
      material: "latex",
    },
    {
      id: 6,
      name: "Матрац Nature Bio",
      price: 8900,
      image: mattressPhoto,
      rating: 4.6,
      reviews: 78,
      features: ["Eco-friendly", "Гіпоалергенний"],
      inStock: true,
      size: "double",
      firmness: "medium",
      material: "latex",
    },
    {
      id: 7,
      name: "Матрац Soft Dreams",
      price: 5400,
      image: mattressPhoto,
      rating: 4.4,
      reviews: 34,
      features: ["М'який", "Дихаючий"],
      inStock: true,
      size: "single",
      firmness: "soft",
      material: "memory",
    },
  ];

  const sizeConfig = {
    single: {
      title: "Односпальні матраци",
      description: "Компактні матраци для дітей та підлітків",
    },
    double: {
      title: "Півтораспальні матраци",
      description: "Комфортні матраци з додатковим простором",
    },
    king: {
      title: "Двоспальні матраци",
      description: "Просторі матраци для пар",
    },
  };

  const currentSizeConfig = sizeConfig[size] || {
    title: "Каталог матраців",
    description: "Широкий вибір якісних матраців",
  };

  // Фільтрація та сортування товарів
  const filteredAndSortedProducts = useMemo(() => {
    let result = mockProducts.filter((product) => {
      // Фільтр по розміру з URL
      if (size && product.size !== size) return false;

      // Фільтри з форми
      const { priceMin, priceMax, firmness, material } = filters;

      if (priceMin && product.price < Number(priceMin)) return false;
      if (priceMax && product.price > Number(priceMax)) return false;
      if (firmness && product.firmness !== firmness) return false;
      if (material && product.material !== material) return false;

      return true;
    });

    // Сортування
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [size, filters, sortBy, mockProducts]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: "",
      priceMax: "",
      firmness: "",
      material: "",
    });
  };

  return (
    <div className="catalog">
      <div className="container">
        {/* Header */}
        <div className="catalog__header">
          <div>
            <h1 className="catalog__header-title">{currentSizeConfig.title}</h1>
            <p className="catalog__header-subtitle">
              {currentSizeConfig.description}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="catalog__toolbar">
          <div className="catalog__toolbar-left">
            <div className="catalog__results-count">
              Знайдено: <strong>{filteredAndSortedProducts.length}</strong>{" "}
              товарів
            </div>
          </div>
          <div className="catalog__toolbar-right">
            <button
              className="catalog__filters-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Фільтри
            </button>
            <div className="catalog__sort">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">За назвою</option>
                <option value="price-asc">За ціною ↑</option>
                <option value="price-desc">За ціною ↓</option>
                <option value="rating">За рейтингом</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`catalog__filters ${
            showFilters ? "catalog__filters--open" : ""
          }`}
        >
          <div className="catalog__filters-header">
            <h3 className="catalog__filters-title">Фільтри</h3>
            <button
              className="catalog__filters-close"
              onClick={() => setShowFilters(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="catalog__filters-content">
            <div className="catalog__filters-group">
              <label className="form-label">Ціна від</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange("priceMin", e.target.value)}
              />
            </div>
            <div className="catalog__filters-group">
              <label className="form-label">Ціна до</label>
              <input
                type="number"
                className="form-input"
                placeholder="20000"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange("priceMax", e.target.value)}
              />
            </div>
            <div className="catalog__filters-group">
              <label className="form-label">Жорсткість</label>
              <select
                className="form-select"
                value={filters.firmness}
                onChange={(e) => handleFilterChange("firmness", e.target.value)}
              >
                <option value="">Будь-яка</option>
                <option value="soft">М'який</option>
                <option value="medium">Середній</option>
                <option value="firm">Жорсткий</option>
              </select>
            </div>
            <div className="catalog__filters-group">
              <label className="form-label">Матеріал</label>
              <select
                className="form-select"
                value={filters.material}
                onChange={(e) => handleFilterChange("material", e.target.value)}
              >
                <option value="">Будь-який</option>
                <option value="memory">Memory Foam</option>
                <option value="latex">Латекс</option>
                <option value="spring">Пружинний</option>
              </select>
            </div>
          </div>
          {Object.values(filters).some((value) => value) && (
            <div className="catalog__filters-actions">
              <button className="btn btn-ghost" onClick={clearFilters}>
                Скинути фільтри
              </button>
            </div>
          )}
        </div>

        {/* Filters Backdrop */}
        {showFilters && (
          <div
            className="catalog__filters-backdrop"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="catalog__grid">
            {filteredAndSortedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-card"
              >
                <div className="card__image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card__image"
                  />
                  {product.oldPrice && (
                    <div className="card__badge badge-sale">АКЦІЯ</div>
                  )}
                  <div className="product-card__actions">
                    <button
                      className="product-card__action-btn"
                      title="В закладки"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Add to favorites:", product.id);
                      }}
                    >
                      <Heart size={16} />
                    </button>
                    <button
                      className="product-card__action-btn"
                      title="Порівняти"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Add to compare:", product.id);
                      }}
                    >
                      <Scale size={16} />
                    </button>
                  </div>
                </div>
                <div className="card__content">
                  <div className="product-card__rating">
                    <div className="product-card__rating-stars">
                      {"★".repeat(Math.floor(product.rating))}
                    </div>
                    <span className="product-card__rating-text">
                      ({product.reviews})
                    </span>
                  </div>
                  <h3 className="card__title">{product.name}</h3>
                  <div className="product-card__features">
                    {product.features.map((feature, index) => (
                      <span key={index} className="product-card__features-item">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="card__footer">
                    <div className="card__price">
                      {product.oldPrice && (
                        <span className="card__price-old">
                          {product.oldPrice} ₴
                        </span>
                      )}
                      <span className="card__price-current">
                        {product.price} ₴
                      </span>
                    </div>
                    <button
                      className={`btn btn-primary ${
                        !product.inStock ? "btn-disabled" : ""
                      }`}
                      disabled={!product.inStock}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Add to cart:", product.id);
                      }}
                    >
                      {product.inStock ? (
                        <>
                          <ShoppingCart size={16} />
                          Купити
                        </>
                      ) : (
                        "Немає в наявності"
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="catalog__empty">
            <div className="catalog__empty-icon">
              <Search size={64} />
            </div>
            <h3 className="catalog__empty-title">Товари не знайдені</h3>
            <p className="catalog__empty-description">
              Спробуйте змінити параметри фільтрації або перегляньте інші
              категорії
            </p>
            <Link to="/catalog" className="btn btn-primary">
              Переглянути всі товари
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
