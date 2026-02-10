import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import Carousel from "../components/Carousel/Carousel";
import { useQuiz } from "../hooks/useQuiz";
import { fetchPopularProducts } from "../api/fetchProducts";
import "../styles/pages/_home.scss";

import heroCatImage from "/heero-cat.png";
import springImage from "/spring.png";
import springlessImage from "/springless.png";
import kidsImage from "/kids.png";
import toperImage from "/toper.png";
import pillowImage from "/pillow.png";

const Home = () => {
  const { openQuiz } = useQuiz();
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularProducts = async () => {
      try {
        const result = await fetchPopularProducts(6);
        setPopularProducts(result.items);
      } catch (error) {
        console.error("Error loading popular products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPopularProducts();
  }, []);

  const categories = [
    {
      id: 1,
      title: "Пружинні матраци",
      subtitle: "Pocket / Bonnell / З латексом",
      image: springImage,
      link: "/catalog?types=spring",
    },
    {
      id: 2,
      title: "Безпружинні",
      subtitle: "Піна / Латекс / Кокос",
      image: springlessImage,
      link: "/catalog?types=springless",
    },
    {
      id: 3,
      title: "Дитячі матраци",
      subtitle: "Гіпоалергенні, 12-16 см",
      image: kidsImage,
      link: "/catalog?types=children",
    },
    {
      id: 4,
      title: "Топери",
      subtitle: "Піна Memory / Латекс",
      image: toperImage,
      link: "/catalog?types=topper",
    },
    {
      id: 5,
      title: "Аксесуари для сну",
      subtitle: "Подушки, наматрацники",
      image: pillowImage,
      link: "/catalog?types=accessories",
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

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__left">
              <div className="hero__text">
                <h1 className="hero__title">
                  Твій найкращий сон починається тут
                </h1>
                <p className="hero__subtitle">
                  Безпружинні • Пружинні • Дитячі • Комфорт для кожного • Підбір
                  за вагою та жорсткістю
                </p>
              </div>
              <div className="hero__buttons">
                <Link
                  to="/catalog"
                  className="hero__button hero__button--primary"
                >
                  До каталогу
                </Link>
                <button
                  className="hero__button hero__button--secondary"
                  onClick={openQuiz}
                >
                  Підібрати за 60 сек
                </button>
              </div>
            </div>
            <div className="hero__mattress">
              <div className="hero__mattress-shape">
                <div className="hero__cat-container">
                  <img
                    src={heroCatImage}
                    alt="Котик на матраці"
                    className="hero__cat-image"
                  />
                  <div className="hero__zzz">
                    <span className="hero__zzz-item hero__zzz-item--1">Z</span>
                    <span className="hero__zzz-item hero__zzz-item--2">Z</span>
                    <span className="hero__zzz-item hero__zzz-item--3">Z</span>
                  </div>
                </div>
              </div>
            </div>
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

      {!loading && popularProducts.length > 0 && (
        <Carousel
          products={popularProducts}
          title="Популярні товари"
          showTitle={true}
          showControls={true}
        />
      )}

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
            <button className="cta__button" onClick={openQuiz}>
              Пройти підбір
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
