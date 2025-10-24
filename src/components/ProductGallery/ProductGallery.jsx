import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ProductGallery.scss";

const ProductGallery = ({ images, alt, priority = false }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const thumbnailsRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };

    const nextIndex = (selectedIndex + 1) % images.length;
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;

    if (images[nextIndex]) preloadImage(images[nextIndex]);
    if (images[prevIndex]) preloadImage(images[prevIndex]);
  }, [selectedIndex, images]);

  const goToImage = useCallback((index) => {
    if (index === selectedIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[index];
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedIndex, isTransitioning]);

  const goToNext = useCallback(() => {
    const nextIndex = (selectedIndex + 1) % images.length;
    goToImage(nextIndex);
  }, [selectedIndex, images.length, goToImage]);

  const goToPrevious = useCallback(() => {
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    goToImage(prevIndex);
  }, [selectedIndex, images.length, goToImage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  const generateSrcSet = useMemo(() => (src) => {
    return `${src} 1x, ${src} 2x`;
  }, []);

  const showNavigation = images.length > 1;

  return (
    <div className="product-gallery">
      <div 
        className="product-gallery__main"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[selectedIndex]}
          srcSet={generateSrcSet(images[selectedIndex])}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
          alt={`${alt} - зображення ${selectedIndex + 1} з ${images.length}`}
          className={`product-gallery__main-image ${
            isTransitioning ? "product-gallery__main-image--transitioning" : ""
          }`}
          loading={priority ? "eager" : "lazy"}
          width={800}
          height={600}
        />

        {showNavigation && (
          <>
            <button
              className="product-gallery__nav product-gallery__nav--prev"
              onClick={goToPrevious}
              disabled={isTransitioning}
              aria-label="Попереднє зображення"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="product-gallery__nav product-gallery__nav--next"
              onClick={goToNext}
              disabled={isTransitioning}
              aria-label="Наступне зображення"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {showNavigation && (
          <div className="product-gallery__counter">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {showNavigation && (
        <div className="product-gallery__thumbnails" ref={thumbnailsRef}>
          {images.map((image, index) => (
            <button
              key={index}
              className={`product-gallery__thumbnail ${
                index === selectedIndex ? "product-gallery__thumbnail--active" : ""
              }`}
              onClick={() => goToImage(index)}
              disabled={isTransitioning}
              aria-label={`Переглянути зображення ${index + 1}`}
              aria-pressed={index === selectedIndex}
            >
              <img
                src={image}
                alt={`${alt} мініатюра ${index + 1}`}
                loading="lazy"
                width={100}
                height={100}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
