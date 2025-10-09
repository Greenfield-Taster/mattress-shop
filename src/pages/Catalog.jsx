import React, { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import "../styles/pages/_catalog.scss";

// Тестові дані матраців з різними характеристиками
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Orthopedic AirFlow Pro",
    type: "Пружинний",
    height: 22,
    hardness: "Н3",
    price: 7990,
    oldPrice: 9990,
    image: "https://via.placeholder.com/300x300?text=AirFlow+Pro",
    size: "160х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 120,
  },
  {
    id: 2,
    name: "Comfort Dream Latex",
    type: "Безпружинні",
    height: 18,
    hardness: "Н2",
    price: 12500,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Dream+Latex",
    size: "180х200",
    blockType: "Безпружинний",
    fillers: ["Латексована піна", "Кокосове полотно"],
    cover: "Незнімний",
    maxWeight: 140,
  },
  {
    id: 3,
    name: "Kids Paradise Soft",
    type: "Дитячі",
    height: 12,
    hardness: "Н1",
    price: 5490,
    oldPrice: 6990,
    image: "https://via.placeholder.com/300x300?text=Kids+Paradise",
    size: "70х160",
    blockType: "Безпружинний",
    fillers: ["Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 60,
  },
  {
    id: 4,
    name: "Memory Foam Elite",
    type: "Безпружинні",
    height: 25,
    hardness: "Н3",
    price: 15990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Memory+Elite",
    size: "200х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю", "Латекс"],
    cover: "Знімний",
    maxWeight: 150,
  },
  {
    id: 5,
    name: "Spring Classic",
    type: "Пружинні",
    height: 20,
    hardness: "Н2",
    price: 6990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Spring+Classic",
    size: "140х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латексована піна"],
    cover: "Незнімний",
    maxWeight: 110,
  },
  {
    id: 6,
    name: "Topper Ultra Soft",
    type: "Топери",
    height: 5,
    hardness: "Н1",
    price: 2990,
    oldPrice: 3990,
    image: "https://via.placeholder.com/300x300?text=Topper+Soft",
    size: "180х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 120,
  },
  {
    id: 7,
    name: "Roll & Go Travel",
    type: "Скручені",
    height: 15,
    hardness: "Н2",
    price: 4990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Roll+Go",
    size: "90х200",
    blockType: "Безпружинний",
    fillers: ["Латексована піна"],
    cover: "Незнімний",
    maxWeight: 90,
  },
  {
    id: 8,
    name: "Premium Ortho Max",
    type: "Пружинні",
    height: 28,
    hardness: "Н4",
    price: 18990,
    oldPrice: 22990,
    image: "https://via.placeholder.com/300x300?text=Ortho+Max",
    size: "200х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 160,
  },
  {
    id: 9,
    name: "EcoNatural Coconut",
    type: "Безпружинні",
    height: 14,
    hardness: "Н3",
    price: 8990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=EcoNatural",
    size: "160х200",
    blockType: "Безпружинний",
    fillers: ["Кокосове полотно", "Латекс"],
    cover: "Знімний",
    maxWeight: 130,
  },
  {
    id: 10,
    name: "Baby Dream Comfort",
    type: "Дитячі",
    height: 10,
    hardness: "Н1",
    price: 4490,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Baby+Dream",
    size: "60х120",
    blockType: "Безпружинний",
    fillers: ["Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 50,
  },
  {
    id: 11,
    name: "Deluxe Spring Pro",
    type: "Пружинні",
    height: 24,
    hardness: "Н3",
    price: 13990,
    oldPrice: 16990,
    image: "https://via.placeholder.com/300x300?text=Deluxe+Spring",
    size: "180х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 140,
  },
  {
    id: 12,
    name: "Topper Memory 3cm",
    type: "Топери",
    height: 3,
    hardness: "Н1",
    price: 1990,
    oldPrice: null,
    image: "https://via.placeholder.com/300x300?text=Topper+3cm",
    size: "160х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю"],
    cover: "Незнімний",
    maxWeight: 100,
  },
];

const Catalog = () => {
  // Стани фільтрів
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [heightRange, setHeightRange] = useState([3, 45]);
  const [selectedBlockTypes, setSelectedBlockTypes] = useState([]);
  const [selectedFillers, setSelectedFillers] = useState([]);
  const [selectedCovers, setSelectedCovers] = useState([]);
  const [maxWeightFilter, setMaxWeightFilter] = useState(200);
  const [priceRange, setPriceRange] = useState([0, 50000]);

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

  // Функція для toggle фільтрів
  const toggleFilter = (value, setFilter) => {
    setFilter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Фільтрація товарів
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Фільтр по типу
      if (selectedTypes.length > 0 && !selectedTypes.includes(product.type)) {
        return false;
      }

      // Фільтр по розміру
      if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) {
        return false;
      }

      // Фільтр по висоті
      if (product.height < heightRange[0] || product.height > heightRange[1]) {
        return false;
      }

      // Фільтр по типу блоку
      if (
        selectedBlockTypes.length > 0 &&
        !selectedBlockTypes.includes(product.blockType)
      ) {
        return false;
      }

      // Фільтр по наповнювачам
      if (selectedFillers.length > 0) {
        const hasSelectedFiller = selectedFillers.some((filler) =>
          product.fillers.includes(filler)
        );
        if (!hasSelectedFiller) return false;
      }

      // Фільтр по чохлу
      if (
        selectedCovers.length > 0 &&
        !selectedCovers.includes(product.cover)
      ) {
        return false;
      }

      // Фільтр по навантаженню (до безкінечності якщо 200)
      if (maxWeightFilter < 200 && product.maxWeight > maxWeightFilter) {
        return false;
      }

      // Фільтр по ціні
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [
    selectedTypes,
    selectedSizes,
    heightRange,
    selectedBlockTypes,
    selectedFillers,
    selectedCovers,
    maxWeightFilter,
    priceRange,
  ]);

  // Скидання всіх фільтрів
  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedSizes([]);
    setHeightRange([3, 45]);
    setSelectedBlockTypes([]);
    setSelectedFillers([]);
    setSelectedCovers([]);
    setMaxWeightFilter(200);
    setPriceRange([0, 50000]);
  };

  return (
    <div className="catalog">
      <div className="catalog__container">
        {/* Хлібні крихти */}
        <div className="catalog__breadcrumbs">
          <span className="catalog__breadcrumb">Головна</span>
          <span className="catalog__breadcrumb-separator">/</span>
          <span className="catalog__breadcrumb catalog__breadcrumb--active">
            Каталог
          </span>
        </div>

        {/* Заголовок */}
        <div className="catalog__header">
          <h1 className="catalog__title">Каталог матраців</h1>
          <p className="catalog__count">
            Знайдено: {filteredProducts.length} товари
          </p>
        </div>

        <div className="catalog__content">
          {/* Фільтри */}
          <aside className="catalog__filters">
            <div className="filters">
              <div className="filters__header">
                <h2 className="filters__title">Фільтри</h2>
                <button className="filters__reset" onClick={resetFilters}>
                  Скинути
                </button>
              </div>

              {/* Тип */}
              <div className="filter-group">
                <h3 className="filter-group__title">Тип</h3>
                <div className="filter-group__options">
                  {filterOptions.types.map((type) => (
                    <label key={type} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleFilter(type, setSelectedTypes)}
                      />
                      <span className="filter-checkbox__label">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Розміри */}
              <div className="filter-group">
                <h3 className="filter-group__title">Розміри</h3>
                <div className="filter-group__options filter-group__options--grid">
                  {filterOptions.sizes.map((size) => (
                    <button
                      key={size}
                      className={`filter-chip ${
                        selectedSizes.includes(size)
                          ? "filter-chip--active"
                          : ""
                      }`}
                      onClick={() => toggleFilter(size, setSelectedSizes)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Висота */}
              <div className="filter-group">
                <h3 className="filter-group__title">
                  Висота: {heightRange[0]} см - {heightRange[1]} см
                </h3>
                <div className="filter-range">
                  <input
                    type="range"
                    min="3"
                    max="45"
                    value={heightRange[0]}
                    onChange={(e) =>
                      setHeightRange([Number(e.target.value), heightRange[1]])
                    }
                    className="filter-range__input"
                  />
                  <input
                    type="range"
                    min="3"
                    max="45"
                    value={heightRange[1]}
                    onChange={(e) =>
                      setHeightRange([heightRange[0], Number(e.target.value)])
                    }
                    className="filter-range__input"
                  />
                </div>
              </div>

              {/* Тип блоку */}
              <div className="filter-group">
                <h3 className="filter-group__title">Тип блоку</h3>
                <div className="filter-group__options">
                  {filterOptions.blockTypes.map((type) => (
                    <label key={type} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedBlockTypes.includes(type)}
                        onChange={() =>
                          toggleFilter(type, setSelectedBlockTypes)
                        }
                      />
                      <span className="filter-checkbox__label">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Наповнювачі */}
              <div className="filter-group">
                <h3 className="filter-group__title">Наповнювачі</h3>
                <div className="filter-group__options">
                  {filterOptions.fillers.map((filler) => (
                    <label key={filler} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedFillers.includes(filler)}
                        onChange={() =>
                          toggleFilter(filler, setSelectedFillers)
                        }
                      />
                      <span className="filter-checkbox__label">{filler}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Чохол */}
              <div className="filter-group">
                <h3 className="filter-group__title">Чохол</h3>
                <div className="filter-group__options">
                  {filterOptions.covers.map((cover) => (
                    <label key={cover} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCovers.includes(cover)}
                        onChange={() => toggleFilter(cover, setSelectedCovers)}
                      />
                      <span className="filter-checkbox__label">{cover}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Навантаження */}
              <div className="filter-group">
                <h3 className="filter-group__title">
                  Навантаження:{" "}
                  {maxWeightFilter >= 200 ? "до ∞" : `до ${maxWeightFilter} кг`}
                </h3>
                <div className="filter-range">
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={maxWeightFilter}
                    onChange={(e) => setMaxWeightFilter(Number(e.target.value))}
                    className="filter-range__input"
                  />
                </div>
              </div>

              {/* Ціна */}
              <div className="filter-group">
                <h3 className="filter-group__title">
                  Ціна: ₴{priceRange[0].toLocaleString()} - ₴
                  {priceRange[1].toLocaleString()}
                </h3>
                <div className="filter-range">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="filter-range__input"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="filter-range__input"
                  />
                </div>
              </div>

              {/* Кнопка застосувати */}
              <button className="filters__apply">Застосувати</button>
            </div>
          </aside>

          {/* Сітка товарів */}
          <div className="catalog__products">
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="catalog__empty">
                <p>За обраними фільтрами товарів не знайдено</p>
                <button
                  onClick={resetFilters}
                  className="catalog__empty-button"
                >
                  Скинути фільтри
                </button>
              </div>
            )}

            {/* Пагінація */}
            {filteredProducts.length > 0 && (
              <div className="catalog__pagination">
                <button className="pagination__button pagination__button--disabled">
                  ‹
                </button>
                <button className="pagination__button pagination__button--active">
                  1
                </button>
                <button className="pagination__button">2</button>
                <button className="pagination__button">3</button>
                <button className="pagination__button">...</button>
                <button className="pagination__button">6</button>
                <button className="pagination__button">›</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
