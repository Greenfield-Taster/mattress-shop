import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductCarousel.scss";

const ProductCarousel = ({ products, title }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const checkScrollability = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

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

  const handleMouseDown = useCallback((e) => {
    if (!carouselRef.current) return;

    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !carouselRef.current) return;

    e.preventDefault();

    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;

    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }

    carouselRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleCardClick = useCallback((e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [hasMoved]);

  const handleTouchStart = useCallback((e) => {
    if (!carouselRef.current) return;
    
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !carouselRef.current) return;

    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;

    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }

    carouselRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

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

  const showControls = products.length > 3;

  return (
    <section className="product-carousel">
      <div className="container">
        <div className="product-carousel__header">
          {title && <h2 className="product-carousel__title">{title}</h2>}
          
          {showControls && (
            <div className="product-carousel__controls">
              <button
                className={`carousel-control carousel-control--left ${
                  !canScrollLeft ? "carousel-control--disabled" : ""
                }`}
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Попередній товар"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className={`carousel-control carousel-control--right ${
                  !canScrollRight ? "carousel-control--disabled" : ""
                }`}
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Наступний товар"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div
          className={`product-carousel__track ${
            isDragging ? "product-carousel__track--dragging" : ""
          }`}
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
              className="product-carousel__item"
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

export default ProductCarousel;
