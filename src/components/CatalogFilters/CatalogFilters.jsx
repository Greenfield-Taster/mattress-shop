import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Chip from "@mui/material/Chip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./CatalogFilters.scss";

const CatalogFilters = ({ params, onApply, onClearAll, onClose, filterOptions }) => {
  const [draft, setDraft] = useState(params);

  // Локальний стан для текстових полів ціни
  const [priceInputs, setPriceInputs] = useState(() => {
    const range = params.price ? params.price.split("-").map(Number) : [0, 50000];
    return { min: String(range[0]), max: String(range[1]) };
  });

  // Синхронізуємо draft з params, коли змінюється ззовні
  useEffect(() => {
    setDraft(params);
    const range = params.price ? params.price.split("-").map(Number) : [0, 50000];
    setPriceInputs({ min: String(range[0]), max: String(range[1]) });
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

    // Також оновлюємо стан інпутів ціни
    if (key === "price") {
      setPriceInputs({ min: String(value[0]), max: String(value[1]) });
    }
  };

  const handleMaxWeightChange = (value) => {
    setDraft((prev) => ({ ...prev, maxWeight: `<=${value}` }));
  };

  const handlePriceInputChange = (field, value) => {
    // Дозволяємо тільки цифри або порожній рядок
    if (value !== "" && !/^\d+$/.test(value)) {
      return;
    }

    // Оновлюємо локальний стан інпуту
    setPriceInputs((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Оновлюємо draft тільки якщо значення валідне
    const numValue = value === "" ? (field === "min" ? 0 : 50000) : parseInt(value);
    const currentMin = field === "min" ? numValue : (priceInputs.min === "" ? 0 : parseInt(priceInputs.min));
    const currentMax = field === "max" ? numValue : (priceInputs.max === "" ? 50000 : parseInt(priceInputs.max));

    setDraft((prev) => ({
      ...prev,
      price: `${currentMin}-${currentMax}`
    }));
  };

  const handlePriceInputBlur = (field) => {
    // При втраті фокуса, якщо поле порожнє, встановлюємо дефолтне значення
    if (priceInputs[field] === "") {
      const defaultValue = field === "min" ? "0" : "50000";
      setPriceInputs((prev) => ({
        ...prev,
        [field]: defaultValue,
      }));
    }
  };

  // Підраховує кількість активних фільтрів для бейджу
  const getActiveCount = () => {
    let count = 0;

    if (draft.types?.length > 0) count += draft.types.length;
    if (draft.hardness?.length > 0) count += draft.hardness.length;
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
      hardness: [],
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
    setPriceInputs({ min: "0", max: "50000" });
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
          {filterOptions.types.map((type) => {
            const value = type.value || type;
            const label = type.label || type;
            return (
              <Chip
                key={value}
                label={label}
                onClick={() => handleArrayToggle("types", value)}
                onDelete={
                  draft.types?.includes(value)
                    ? () => handleArrayToggle("types", value)
                    : undefined
                }
                color={draft.types?.includes(value) ? "primary" : "default"}
                variant={draft.types?.includes(value) ? "filled" : "outlined"}
                className="filter-chip"
              />
            );
          })}
        </div>
      </div>

      {/* Жорсткість - CHIPS */}
      <div className="filter-section">
        <h3 className="filter-section__title">Жорсткість</h3>
        <div className="filter-section__chips">
          {filterOptions.hardness.map((h) => {
            const value = h.value || h;
            const label = h.label || h;
            return (
              <Chip
                key={value}
                label={label}
                onClick={() => handleArrayToggle("hardness", value)}
                onDelete={
                  draft.hardness?.includes(value)
                    ? () => handleArrayToggle("hardness", value)
                    : undefined
                }
                color={draft.hardness?.includes(value) ? "primary" : "default"}
                variant={draft.hardness?.includes(value) ? "filled" : "outlined"}
                className="filter-chip"
              />
            );
          })}
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
          {filterOptions.blockTypes.map((bt) => {
            const value = bt.value || bt;
            const label = bt.label || bt;
            return (
              <label key={value} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={draft.blockTypes?.includes(value) || false}
                  onChange={() => handleArrayToggle("blockTypes", value)}
                />
                <span className="filter-checkbox__checkmark"></span>
                <span className="filter-checkbox__label">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Наповнювачі - CHECKBOXES */}
      <div className="filter-section">
        <h3 className="filter-section__title">Наповнювачі</h3>
        <div className="filter-section__checkboxes">
          {filterOptions.fillers.map((fl) => {
            const value = fl.value || fl;
            const label = fl.label || fl;
            return (
              <label key={value} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={draft.fillers?.includes(value) || false}
                  onChange={() => handleArrayToggle("fillers", value)}
                />
                <span className="filter-checkbox__checkmark"></span>
                <span className="filter-checkbox__label">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Чохол - CHIPS */}
      <div className="filter-section">
        <h3 className="filter-section__title">Чохол</h3>
        <div className="filter-section__chips">
          {filterOptions.covers.map((cv) => {
            const value = cv.value || cv;
            const label = cv.label || cv;
            return (
              <Chip
                key={value}
                label={label}
                onClick={() => handleArrayToggle("covers", value)}
                onDelete={
                  draft.covers?.includes(value)
                    ? () => handleArrayToggle("covers", value)
                    : undefined
                }
                color={draft.covers?.includes(value) ? "primary" : "default"}
                variant={draft.covers?.includes(value) ? "filled" : "outlined"}
                className="filter-chip"
              />
            );
          })}
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
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={priceInputs.min}
                onChange={(e) => handlePriceInputChange("min", e.target.value)}
                onBlur={() => handlePriceInputBlur("min")}
              />
              <span>грн</span>
            </div>
          </div>

          <span className="filter-section__price-separator">—</span>

          <div className="filter-section__price-input-group">
            <label>До</label>
            <div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="50000"
                value={priceInputs.max}
                onChange={(e) => handlePriceInputChange("max", e.target.value)}
                onBlur={() => handlePriceInputBlur("max")}
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
