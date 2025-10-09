import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import ProductCard from "../components/ProductCard/ProductCard";
import "../styles/pages/_home.scss";

import heroCatImage from "../assets/images/hero-cat.png";
import springImage from "../assets/images/spring.png";
import springlessImage from "../assets/images/springless.png";
import kidsImage from "../assets/images/kids.png";
import toperImage from "../assets/images/toper.png";
import pillowImage from "../assets/images/pillow.png";

const Home = () => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  //TODO: Replace with real data from backend
  const popularProducts = [
    {
      id: 1,
      name: "Orthopedic AirFlow Pro",
      type: "Пружинний",
      height: 22,
      hardness: "H3",
      price: 7990,
      image: kidsImage,
    },
    {
      id: 2,
      name: "Cloud Foam",
      type: "Безпружинний",
      height: 20,
      hardness: "H2",
      price: 2490,
      oldPrice: 6490,
      image: toperImage,
    },
    {
      id: 3,
      name: "Latex Flex",
      type: "Латекс",
      height: 24,
      hardness: "H3",
      price: 8990,
      image: springlessImage,
    },
    {
      id: 4,
      name: "Dream Sleep Pro",
      type: "Пружинний",
      height: 25,
      hardness: "H4",
      price: 9990,
      image: springImage,
    },
    {
      id: 5,
      name: "Memory Comfort",
      type: "Безпружинний",
      height: 18,
      hardness: "H2",
      price: 5990,
      oldPrice: 7990,
      image: springlessImage,
    },
    {
      id: 6,
      name: "Eco Latex Premium",
      type: "Латекс",
      height: 26,
      hardness: "H3",
      price: 11990,
      image: springlessImage,
    },
  ];

  const categories = [
    {
      id: 1,
      title: "Пружинні матраци",
      subtitle: "Pocket / Bonnell / З латексом",
      image: springImage,
      link: "/catalog?type=spring",
    },
    {
      id: 2,
      title: "Безпружинні",
      subtitle: "Піна / Латекс / Кокос",
      image: springlessImage,
      link: "/catalog?type=springless",
    },
    {
      id: 3,
      title: "Дитячі матраци",
      subtitle: "Гіпоалергенні, 12-16 см",
      image: kidsImage,
      link: "/catalog?type=kids",
    },
    {
      id: 4,
      title: "Топери",
      subtitle: "Піна Memory / Латекс",
      image: toperImage,
      link: "/catalog?type=toppers",
    },
    {
      id: 5,
      title: "Аксесуари для сну",
      subtitle: "Подушки, наматрацники",
      image: pillowImage,
      link: "/catalog?type=accessories",
    },
  ];

  const benefits = [
    {
      id: 1,
      title: "Якість",
      description: "Тільки перевірені виробники",
      icon: ShieldCheck,
    },
    {
      id: 2,
      title: "Швидка доставка",
      description: "1-3 дні по всій Українi",
      icon: Truck,
    },
    {
      id: 3,
      title: "Обмін 14 днів",
      description: "За умови, що товар не розпаковано",
      icon: RefreshCw,
    },
  ];

  // Проверка возможности скролла
  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Скролл по кнопкам
  const scroll = (direction) => {
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
  };

  // Drag to scroll - начало
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;

    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  // Drag to scroll - движение
  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;

    e.preventDefault();

    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;

    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }

    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Drag to scroll - конец
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Drag to scroll - покинул область
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Обработчик клика - блокируем переход если был драг
  const handleCardClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

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
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__text">
              <h1 className="hero__title">
                Сон преміум-класу. Матраци для здорової спини.
              </h1>
              <p className="hero__subtitle">
                Ортопедична підтримка · Безпружинні та пружинні · Доставка 1-3
                дні
              </p>
            </div>
            <div className="hero__image">
              <img src={heroCatImage} alt="Котик на матраці" />
            </div>
            <Link to="/catalog" className="hero__button">
              До каталогу
            </Link>
          </div>
        </div>
      </section>

      <section className="quick-selection">
        <div className="container">
          <h2 className="section-title">Швидкий підбір</h2>
          <div className="quick-selection__grid">
            {categories.map((category) => (
              <Link
                to={category.link}
                key={category.id}
                className="category-card"
              >
                <div className="category-card__image">
                  <img src={category.image} alt={category.title} />
                </div>
                <div className="category-card__content">
                  <h3 className="category-card__title">{category.title}</h3>
                  <p className="category-card__subtitle">{category.subtitle}</p>
                  <span className="category-card__button">Перейти</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="popular-products">
        <div className="container">
          <div className="popular-products__header">
            <h2 className="section-title section-title--inline">
              Популярні товари
            </h2>
            <div className="popular-products__controls">
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
          </div>

          <div
            className={`popular-products__carousel ${
              isDragging ? "is-dragging" : ""
            }`}
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {popularProducts.map((product) => (
              <div
                key={product.id}
                className="popular-products__item"
                onClick={handleCardClick}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="container">
          <h2 className="section-title">Чому обирають нас</h2>
          <div className="benefits__grid">
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <div key={benefit.id} className="benefit-card">
                  <div className="benefit-card__icon">
                    <IconComponent size={32} strokeWidth={2} />
                  </div>
                  <div className="benefit-card__content">
                    <h3 className="benefit-card__title">{benefit.title}</h3>
                    <p className="benefit-card__description">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta__content">
            <h2 className="cta__title">Підібрати матрац за 1 хвилину?</h2>
            <Link to="/quiz" className="cta__button">
              Пройти підбір
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
