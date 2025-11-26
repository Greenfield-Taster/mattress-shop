import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard/ProductCard";
import CatalogFilters from "../components/CatalogFilters/CatalogFilters";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import { fetchProducts } from "../api/fetchProducts";
import "../styles/pages/_catalog.scss";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const parseParams = () => {
    const params = {
      types: searchParams.get("types")?.split(",").filter(Boolean) || [],
      sizes: searchParams.get("sizes")?.split(",").filter(Boolean) || [],
      blockTypes:
        searchParams.get("blockTypes")?.split(",").filter(Boolean) || [],
      fillers: searchParams.get("fillers")?.split(",").filter(Boolean) || [],
      covers: searchParams.get("covers")?.split(",").filter(Boolean) || [],
      height: searchParams.get("height") || "3-45",
      maxWeight: searchParams.get("maxWeight") || "<=250",
      price: searchParams.get("price") || "0-50000",
      sort: searchParams.get("sort") || "default",
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 12,
    };
    return params;
  };

  const params = parseParams();

  // Завантаження продуктів при зміні параметрів
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const result = await fetchProducts(params);
        setProducts(result.items);
        setTotal(result.total);
      } catch (error) {
        console.error("Error loading products:", error);
        // 🔄 НА СЕРВЕРІ: Додати обробку помилок (toast, notification)
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchParams]); // Перезавантажуємо при зміні URL

  // Блокування скролу при відкритій панелі фільтрів
  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [filtersOpen]);

  const updateURL = (newParams) => {
    const query = new URLSearchParams();

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        // Для масивів
        if (Array.isArray(value) && value.length > 0) {
          query.set(key, value.join(","));
        }
        // Для дефолтних значень - не додаємо в URL
        else if (
          (key === "height" && value === "3-45") ||
          (key === "maxWeight" && value === "<=250") ||
          (key === "price" && value === "0-50000") ||
          (key === "sort" && value === "default") ||
          (key === "page" && value === 1) ||
          (key === "limit" && value === 12)
        ) {
          // Пропускаємо дефолтні значення
        }
        // Для всіх інших
        else {
          query.set(key, value);
        }
      }
    });

    setSearchParams(query);
  };

  const handleApplyFilters = (newFilters) => {
    updateURL({
      ...newFilters,
      page: 1, // Скидаємо на першу сторінку при зміні фільтрів
    });
  };

  const handleClearAll = () => {
    setSearchParams({}); // Повністю очищаємо URL
  };

  const handleSortChange = (sortValue) => {
    updateURL({
      ...params,
      sort: sortValue,
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    updateURL({
      ...params,
      page: newPage,
    });

    // Прокрутка до початку каталогу
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const sortOptions = [
    { value: "default", label: "За замовчуванням" },
    { value: "price-asc", label: "Спочатку дешевші" },
    { value: "price-desc", label: "Спочатку дорожчі" },
    { value: "discount", label: "Зі знижкою" },
  ];

  const filterOptions = {
    types: [
      "Безпружинні",
      "Пружинні",
      "Дитячі",
      "Топери",
      "Скручені",
      "Аксесуари",
    ],
    sizes: [
      "200х200",
      "180х200",
      "180х190",
      "170х200",
      "170х190",
      "160х200",
      "160х190",
      "150х200",
      "150х190",
      "140х200",
      "140х190",
      "120х200",
      "120х190",
      "90х200",
      "90х190",
      "80х200",
      "80х190",
      "70х200",
      "70х190",
      "80х180",
      "80х170",
      "80х160",
      "80х150",
      "70х180",
      "70х170",
      "70х160",
      "70х150",
      "60х120",
      "нестандартний розмір",
    ],
    blockTypes: ["Безпружинний", "Незалежний пружинний блок"],
    fillers: [
      "Латекс",
      "Латексована піна",
      "Піна з пам'яттю",
      "Кокосове полотно",
    ],
    covers: ["Знімний", "Незнімний"],
  };

  const totalPages = Math.ceil(total / params.limit);

  return (
    <div className="catalog">
      <div className="catalog__container">
        <div className="catalog__header">
          <div className="catalog__title-wrapper">
            <h1 className="catalog__title">Каталог матраців</h1>
          </div>
          <div className="catalog__controls">
            <div className="catalog__sort">
              <span className="catalog__sort-label">Сортувати:</span>
              <CustomSelect
                value={params.sort}
                onChange={handleSortChange}
                options={sortOptions}
              />
            </div>
            <p className="catalog__count">Знайдено: {total} товарів</p>
          </div>
        </div>

        <div className="catalog__content">
          <aside
            className={`catalog__filters ${
              filtersOpen ? "catalog__filters--open" : ""
            }`}
          >
            <div
              className="catalog__filters-overlay"
              onClick={() => setFiltersOpen(false)}
            ></div>
            <div className="catalog__filters-panel">
              <CatalogFilters
                params={params}
                onApply={(filters) => {
                  handleApplyFilters(filters);
                  setFiltersOpen(false);
                }}
                onClearAll={() => {
                  handleClearAll();
                }}
                onClose={() => setFiltersOpen(false)}
                filterOptions={filterOptions}
              />
            </div>
          </aside>

          <div className="catalog__products">
            {loading ? (
              <div className="catalog__loader">
                <div className="loader-spinner"></div>
                <p>Завантаження товарів...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Пагінація */}
                {totalPages > 1 && (
                  <div className="catalog__pagination">
                    <button
                      className="pagination__button"
                      onClick={() => handlePageChange(params.page - 1)}
                      disabled={params.page === 1}
                    >
                      ‹
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      // Показуємо тільки деякі сторінки
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= params.page - 1 &&
                          pageNum <= params.page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            className={`pagination__button ${
                              params.page === pageNum
                                ? "pagination__button--active"
                                : ""
                            }`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === params.page - 2 ||
                        pageNum === params.page + 2
                      ) {
                        return <span key={pageNum}>...</span>;
                      }
                      return null;
                    })}

                    <button
                      className="pagination__button"
                      onClick={() => handlePageChange(params.page + 1)}
                      disabled={params.page === totalPages}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="catalog__empty">
                <h2>Товари не знайдено</h2>
                <p>Спробуйте змінити параметри фільтрації</p>
                <button
                  onClick={handleClearAll}
                  className="catalog__empty-button"
                >
                  Скинути фільтри
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Фіксована кнопка фільтрів для мобільних */}
        <button
          className="catalog__filters-toggle"
          onClick={() => setFiltersOpen(true)}
          aria-label="Відкрити фільтри"
        >
          <SlidersHorizontal size={24} />
        </button>
      </div>
    </div>
  );
};

export default Catalog;
