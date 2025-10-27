import { useState, useRef, useEffect, useCallback } from "react";
import ProductCard from "../ProductCard/ProductCard";
import "./UniversalCarousel.scss";

const UniversalCarousel = ({ 
  products, 
  title, 
  showTitle = true,
  showControls = true 
}) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Проверка возможности скролла
  const checkScrollability = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // Скролл по кнопкам
  const scroll = useCallback((direction) => {
    if (carouselRef.current) {
      const scrollAmount = 305;
      const newScrollLeft =
        direction === "left"
          ? carouselRef.current.scrollLeft - scrollAmount
          : carouselRef.current.scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  }, []);

  // Drag to scroll - начало
  const handleMouseDown = useCallback((e) => {
    if (!carouselRef.current) return;

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  }, []);

  // Drag to scroll - движение
  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !carouselRef.current) return;

    e.preventDefault();

    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;

    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }

    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  // Drag to scroll - конец
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    
    // Сбрасываем флаг через небольшую задержку
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  }, []);

  // Drag to scroll - покинул область
  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    }
  }, []);

  // Touch events для мобільних
  const handleTouchStart = useCallback((e) => {
    if (!carouselRef.current) return;
    
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDraggingRef.current || !carouselRef.current) return;

    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;

    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }

    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  }, []);

  // Обработчик клика на элементе карточки
  const handleCardClick = useCallback((e) => {
    // Если был драг - блокируем только переходы по ссылкам
    if (hasDraggedRef.current) {
      const target = e.target.closest('a');
      if (target) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, []);

  // Обработчик скролла
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollability);
      checkScrollability();

      return () => {
        carousel.removeEventListener("scroll", checkScrollability);
      };
    }
  }, [checkScrollability]);

  if (!products || products.length === 0) {
    return null;
  }

  const displayControls = showControls && products.length > 3;

  return (
    <section className="universal-carousel">
      <div className="container">
        {(showTitle || displayControls) && (
          <div className="universal-carousel__header">
            {showTitle && title && (
              <h2 className="universal-carousel__title">{title}</h2>
            )}
            {displayControls && (
              <div className="universal-carousel__controls">
                <button
                  className={`carousel-control carousel-control--left ${
                    !canScrollLeft ? "carousel-control--disabled" : ""
                  }`}
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Попередній слайд"
                >
                  ←
                </button>
                <button
                  className={`carousel-control carousel-control--right ${
                    !canScrollRight ? "carousel-control--disabled" : ""
                  }`}
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Наступний слайд"
                >
                  →
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className="universal-carousel__track"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="universal-carousel__item"
              onClick={handleCardClick}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniversalCarousel;
