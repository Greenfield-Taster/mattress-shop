import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Grid, List, Heart, Scale, ShoppingCart, Search } from "lucide-react";
import mattressPhoto from "../assets/images/mattress-photo.png";

const Catalog = () => {
  const { size } = useParams();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    firmness: "",
    material: "",
  });

  // Mock data - в реальному проекті буде з API
  const mockProducts = [
    {
      id: 1,
      name: "Матрас Comfort Classic",
      price: 4500,
      oldPrice: 5000,
      image: mattressPhoto,
      rating: 4.5,
      reviews: 23,
      features: ["Ортопедичний", "Гіпоалергенний"],
      inStock: true,
      size: "single",
    },
    {
      id: 2,
      name: "Матрас Premium Dream",
      price: 7200,
      image: mattressPhoto,
      rating: 4.8,
      reviews: 45,
      features: ["Memoria", "Охолоджуючий"],
      inStock: true,
      size: "double",
    },
    {
      id: 3,
      name: "Матрас Elite Support",
      price: 9800,
      image: mattressPhoto,
      rating: 4.9,
      reviews: 67,
      features: ["Pocket Spring", "Natura"],
      inStock: false,
      size: "king",
    },
  ];

  const getSizeTitle = (sizeParam) => {
    const titles = {
      single: "Односпальні матраси",
      double: "Полуторні матраси",
      king: "Двоспальні матраси",
    };
    return titles[sizeParam] || "Каталог матрасів";
  };

  const getSizeDescription = (sizeParam) => {
    const descriptions = {
      single: "Компактні матраси для дітей та підлітків",
      double: "Комфортні матраси з додатковим простором",
      king: "Просторі матраси для пар",
    };
    return descriptions[sizeParam] || "Широкий вибір якісних матрасів";
  };

  const filteredProducts = mockProducts.filter((product) => {
    if (size && product.size !== size) return false;
    return true;
  });

  return (
    <div className="catalog">
      <div className="container">
        {/* Header */}
        <div className="catalog__header">
          <div>
            <h1 className="catalog__header-title">{getSizeTitle(size)}</h1>
            <p className="catalog__header-subtitle">
              {getSizeDescription(size)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="catalog__filters">
          <h3 className="catalog__filters-title">Фільтри</h3>
          <div className="catalog__filters-row">
            <div className="catalog__filters-group">
              <label className="form-label">Ціна від</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) =>
                  setFilters({ ...filters, priceMin: e.target.value })
                }
              />
            </div>
            <div className="catalog__filters-group">
              <label className="form-label">Ціна до</label>
              <input
                type="number"
                className="form-input"
                placeholder="20000"
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters({ ...filters, priceMax: e.target.value })
                }
              />
            </div>
            <div className="catalog__filters-group">
              <label className="form-label">Жорсткість</label>
              <select
                className="form-select"
                value={filters.firmness}
                onChange={(e) =>
                  setFilters({ ...filters, firmness: e.target.value })
                }
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
                onChange={(e) =>
                  setFilters({ ...filters, material: e.target.value })
                }
              >
                <option value="">Будь-який</option>
                <option value="memory">Memory Foam</option>
                <option value="latex">Латекс</option>
                <option value="spring">Пружинний</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="catalog__toolbar">
          <div className="catalog__toolbar-left">
            <div className="catalog__results-count">
              Знайдено: <strong>{filteredProducts.length}</strong> товарів
            </div>
          </div>
          <div className="catalog__toolbar-right">
            <div className="catalog__sort">
              <label>Сортувати:</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">За назвою</option>
                <option value="price-asc">За ціною (зростання)</option>
                <option value="price-desc">За ціною (спадання)</option>
                <option value="rating">За рейтингом</option>
              </select>
            </div>
            <div className="catalog__view-toggle">
              <button
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={16} />
              </button>
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`catalog__grid ${viewMode}-view`}>
            {filteredProducts.map((product) => (
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
                        // Логіка додавання в закладки
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
                        // Логіка додавання до порівняння
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
                        // Логіка додавання в кошик
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
              <Search size={64} style={{ color: "#c7d7fd" }} />
            </div>
            <h3 className="catalog__empty-title">Товари не знайдені</h3>
            <p className="catalog__empty-description">
              Спробуйте змінити параметри фільтрації або перегляньте інші
              категорії
            </p>
            <a href="/catalog" className="btn btn-primary">
              Переглянути всі товари
            </a>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="catalog__pagination">
            <div className="pagination">
              <a href="#" className="pagination__item disabled">
                ‹
              </a>
              <a href="#" className="pagination__item active">
                1
              </a>
              <a href="#" className="pagination__item">
                2
              </a>
              <a href="#" className="pagination__item">
                3
              </a>
              <span className="pagination__dots">...</span>
              <a href="#" className="pagination__item">
                10
              </a>
              <a href="#" className="pagination__item">
                ›
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
