import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard/ProductCard";
import CatalogFilters from "../components/CatalogFilters/CatalogFilters";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import { fetchProducts } from "../api/fetchProducts";
import "../styles/pages/_catalog.scss";

/**
 * Головна сторінка каталогу з фільтрацією, сортуванням та пагінацією
 *
 * Архітектура:
 * - URL як джерело правди (query params)
 * - Серверна фільтрація та сортування
 * - Sticky sidebar з фільтрами
 * - Адаптивний layout
 */
const Catalog = () => {
  // URL query params - джерело правди
  const [searchParams, setSearchParams] = useSearchParams();

  // Стан для продуктів
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Парсинг параметрів з URL
   */
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

  /**
   * Завантаження продуктів при зміні параметрів
   *
   * 🔄 КОЛИ ПІДКЛЮЧАТИМЕШ СЕРВЕР:
   * Ця функція вже готова працювати з серверним API
   * fetchProducts автоматично відправить всі параметри на сервер
   */
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

  /**
   * Оновлення URL з новими параметрами
   */
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

  /**
   * Обробник застосування фільтрів
   */
  const handleApplyFilters = (newFilters) => {
    updateURL({
      ...newFilters,
      page: 1, // Скидаємо на першу сторінку при зміні фільтрів
    });
  };

  /**
   * Обробник очищення всіх фільтрів
   */
  const handleClearAll = () => {
    setSearchParams({}); // Повністю очищаємо URL
  };

  /**
   * Обробник зміни сортування
   */
  const handleSortChange = (sortValue) => {
    updateURL({
      ...params,
      sort: sortValue,
      page: 1,
    });
  };

  /**
   * Обробник зміни сторінки пагінації
   */
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

  // Опції для сортування
  const sortOptions = [
    { value: "default", label: "За замовчуванням" },
    { value: "price-asc", label: "Спочатку дешевші" },
    { value: "price-desc", label: "Спочатку дорожчі" },
    { value: "popular", label: "Популярні" },
    { value: "new", label: "Новинки" },
    { value: "discount", label: "Зі знижкою" },
  ];

  // Опції фільтрів
  const filterOptions = {
    types: ["Безпружинні", "Пружинні", "Дитячі", "Топери", "Скручені"],
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

  // Розрахунок пагінації
  const totalPages = Math.ceil(total / params.limit);

  return (
    <div className="catalog">
      <div className="catalog__container">
        {/* Заголовок і сортування */}
        <div className="catalog__header">
          <h1 className="catalog__title">Каталог матраців</h1>
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
          {/* Фільтри */}
          <aside className="catalog__filters">
            <CatalogFilters
              params={params}
              onApply={handleApplyFilters}
              onClearAll={handleClearAll}
              filterOptions={filterOptions}
            />
          </aside>

          {/* Сітка товарів */}
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
      </div>
    </div>
  );
};

export default Catalog;
