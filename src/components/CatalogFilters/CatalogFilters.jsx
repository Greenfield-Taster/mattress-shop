import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Chip from "@mui/material/Chip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./CatalogFilters.scss";

const CatalogFilters = ({ params, onApply, onClearAll, onClose, filterOptions }) => {
  const [draft, setDraft] = useState(params);

  // Синхронізуємо draft з params, коли змінюється ззовні
  useEffect(() => {
    setDraft(params);
  }, [params]);

  // Обробник для checkbox-фільтрів (множинний вибір)
  const handleArrayToggle = (key, value) => {
    setDraft((prev) => {
      const current = prev[key] || [];
      const isActive = current.includes(value);

      return {
        ...prev,
        [key]: isActive
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  // Обробник для слайдерів (range)
  const handleSliderChange = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: `${value[0]}-${value[1]}` }));
  };

  const handleMaxWeightChange = (value) => {
    setDraft((prev) => ({ ...prev, maxWeight: `<=${value}` }));
  };

  const handlePriceInputChange = (index, value) => {
    const priceRange = draft.price
      ? draft.price.split("-").map(Number)
      : [0, 50000];
    const newRange = [...priceRange];

    // Дозволяємо порожнє значення для зручності введення
    if (value === "") {
      newRange[index] = index === 0 ? 0 : 50000;
    } else {
      // Обмежуємо тільки в межах 0-50000
      let numValue = parseInt(value) || 0;
      numValue = Math.max(0, Math.min(50000, numValue));
      newRange[index] = numValue;
    }

    setDraft((prev) => ({ ...prev, price: `${newRange[0]}-${newRange[1]}` }));
  };

  // Підраховує кількість активних фільтрів для бейджу
  const getActiveCount = () => {
    let count = 0;

    if (draft.types?.length > 0) count += draft.types.length;
    if (draft.sizes?.length > 0) count += draft.sizes.length;
    if (draft.blockTypes?.length > 0) count += draft.blockTypes.length;
    if (draft.fillers?.length > 0) count += draft.fillers.length;
    if (draft.covers?.length > 0) count += draft.covers.length;
    if (draft.height && draft.height !== "3-45") count++;
    if (draft.price && draft.price !== "0-50000") count++;
    if (draft.maxWeight && draft.maxWeight !== "<=250") count++;

    return count;
  };

  // Застосувати фільтри → передати в батьківський компонент
  const handleApply = () => {
    onApply(draft);
  };

  const handleClear = () => {
    const cleared = {
      types: [],
      sizes: [],
      blockTypes: [],
      fillers: [],
      covers: [],
      height: "3-45",
      maxWeight: "<=250",
      price: "0-50000",
      sort: "default",
      page: 1,
      limit: 12,
    };
    setDraft(cleared);
    onClearAll();
  };

  // Парсинг значень для слайдерів
  const heightRange = draft.height
    ? draft.height.split("-").map(Number)
    : [3, 45];
  const priceRange = draft.price
    ? draft.price.split("-").map(Number)
    : [0, 50000];
  const maxWeightValue = draft.maxWeight
    ? parseInt(draft.maxWeight.replace("<=", ""))
    : 250;

  const activeCount = getActiveCount();

  return (
    <div className="catalog-filters">
      <div className="catalog-filters__header">
        <div className="catalog-filters__title-wrapper">
          <h2 className="catalog-filters__title">Фільтри</h2>
          {activeCount > 0 && (
            <button className="catalog-filters__reset" onClick={handleClear}>
              Очистити все
            </button>
          )}
        </div>
        {onClose && (
          <button
            className="catalog-filters__close"
            onClick={onClose}
            aria-label="Закрити фільтри"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Контейнер для скролу на мобільних */}
      <div className="catalog-filters__content">
        {/* Тип матрацу - CHIPS */}
        <div className="filter-section">
        <h3 className="filter-section__title">Тип матрацу</h3>
        <div className="filter-section__chips">
          {filterOptions.types.map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => handleArrayToggle("types", type)}
              onDelete={
                draft.types?.includes(type)
                  ? () => handleArrayToggle("types", type)
                  : undefined
              }
              color={draft.types?.includes(type) ? "primary" : "default"}
              variant={draft.types?.includes(type) ? "filled" : "outlined"}
              className="filter-chip"
            />
          ))}
        </div>
      </div>

      {/* Розміри - CHIPS */}
      <div className="filter-section">
        <h3 className="filter-section__title">Розміри (см)</h3>
        <div className="filter-section__chips filter-section__chips--grid">
          {filterOptions.sizes.map((size) => (
            <Chip
              key={size}
              label={size}
              onClick={() => handleArrayToggle("sizes", size)}
              onDelete={
                draft.sizes?.includes(size)
                  ? () => handleArrayToggle("sizes", size)
                  : undefined
              }
              color={draft.sizes?.includes(size) ? "primary" : "default"}
              variant={draft.sizes?.includes(size) ? "filled" : "outlined"}
              className="filter-chip filter-chip--size"
              size="small"
            />
          ))}
        </div>
      </div>

      {/* Висота */}
      <div className="filter-section">
        <h3 className="filter-section__title">
          Висота матрацу: {heightRange[0]} - {heightRange[1]} см
        </h3>
        <div className="filter-section__slider">
          <Slider
            range
            min={3}
            max={45}
            value={heightRange}
            onChange={(value) => handleSliderChange("height", value)}
            className="custom-slider"
          />
          <div className="filter-section__slider-labels">
            <span>3 см</span>
            <span>45 см</span>
          </div>
        </div>
      </div>

      {/* Тип блоку - CHECKBOXES */}
      <div className="filter-section">
        <h3 className="filter-section__title">Тип блоку</h3>
        <div className="filter-section__checkboxes">
          {filterOptions.blockTypes.map((type) => (
            <label key={type} className="filter-checkbox">
              <input
                type="checkbox"
                checked={draft.blockTypes?.includes(type) || false}
                onChange={() => handleArrayToggle("blockTypes", type)}
              />
              <span className="filter-checkbox__checkmark"></span>
              <span className="filter-checkbox__label">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Наповнювачі - CHECKBOXES */}
      <div className="filter-section">
        <h3 className="filter-section__title">Наповнювачі</h3>
        <div className="filter-section__checkboxes">
          {filterOptions.fillers.map((filler) => (
            <label key={filler} className="filter-checkbox">
              <input
                type="checkbox"
                checked={draft.fillers?.includes(filler) || false}
                onChange={() => handleArrayToggle("fillers", filler)}
              />
              <span className="filter-checkbox__checkmark"></span>
              <span className="filter-checkbox__label">{filler}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Чохол - CHIPS */}
      <div className="filter-section">
        <h3 className="filter-section__title">Чохол</h3>
        <div className="filter-section__chips">
          {filterOptions.covers.map((cover) => (
            <Chip
              key={cover}
              label={cover}
              onClick={() => handleArrayToggle("covers", cover)}
              onDelete={
                draft.covers?.includes(cover)
                  ? () => handleArrayToggle("covers", cover)
                  : undefined
              }
              color={draft.covers?.includes(cover) ? "primary" : "default"}
              variant={draft.covers?.includes(cover) ? "filled" : "outlined"}
              className="filter-chip"
            />
          ))}
        </div>
      </div>

      {/* Максимальне навантаження */}
      <div className="filter-section">
        <h3 className="filter-section__title">
          Максимальне навантаження: до {maxWeightValue} кг
        </h3>
        <div className="filter-section__slider">
          <Slider
            min={50}
            max={250}
            step={10}
            value={maxWeightValue}
            onChange={handleMaxWeightChange}
            className="custom-slider"
          />
          <div className="filter-section__slider-labels">
            <span>50 кг</span>
            <span>250 кг</span>
          </div>
        </div>
      </div>

      {/* Ціна з інпутами */}
      <div className="filter-section">
        <h3 className="filter-section__title">Ціна</h3>
        <div className="filter-section__slider">
          <Slider
            range
            min={0}
            max={50000}
            step={500}
            value={priceRange}
            onChange={(value) => handleSliderChange("price", value)}
            className="custom-slider"
          />
          <div className="filter-section__slider-labels">
            <span>0 грн</span>
            <span>50 000 грн</span>
          </div>
        </div>

        {/* Інпути для введення ціни */}
        <div className="filter-section__price-inputs">
          <div className="filter-section__price-input-group">
            <label>Від</label>
            <div>
              <input
                type="number"
                min="0"
                max="50000"
                step="100"
                value={priceRange[0]}
                onChange={(e) => handlePriceInputChange(0, e.target.value)}
              />
              <span>грн</span>
            </div>
          </div>

          <span className="filter-section__price-separator">—</span>

          <div className="filter-section__price-input-group">
            <label>До</label>
            <div>
              <input
                type="number"
                min="0"
                max="50000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => handlePriceInputChange(1, e.target.value)}
              />
              <span>грн</span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Кнопка застосувати */}
      <button className="catalog-filters__apply" onClick={handleApply}>
        Застосувати фільтри
      </button>
    </div>
  );
};

export default CatalogFilters;
