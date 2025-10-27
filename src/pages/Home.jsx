import { Link } from "react-router-dom";
import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import UniversalCarousel from "../components/UniversalCarousel/UniversalCarousel";
import "../styles/pages/_home.scss";

import heroCatImage from "../assets/images/heero-cat.png";
import springImage from "../assets/images/spring.png";
import springlessImage from "../assets/images/springless.png";
import kidsImage from "../assets/images/kids.png";
import toperImage from "../assets/images/toper.png";
import pillowImage from "../assets/images/pillow.png";

const Home = () => {
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

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__text">
              <h1 className="hero__title">
                Сон преміум-класу.
                <br />
                Матраци для
                <br />
                здорової спини
              </h1>
              <p className="hero__subtitle">
                Беапружинні, пружинні та дитячі моделі з піни,
                <br />
                латексу та кокосу. Підбір за вагою та жорсткісти.
              </p>
              <div className="hero__buttons">
                <Link
                  to="/catalog"
                  className="hero__button hero__button--primary"
                >
                  До каталогу
                </Link>
                <Link
                  to="/quiz"
                  className="hero__button hero__button--secondary"
                >
                  Підібрати за 30 сек
                </Link>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-bar">
        <div className="container">
          <div className="categories-bar__grid">
            <Link to="/catalog?type=spring" className="category-icon-item">
              <div className="category-icon-item__icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 10C20 10 15 15 15 20C15 25 20 30 20 30C20 30 25 25 25 20C25 15 20 10 20 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span>Пружинні</span>
            </Link>
            <Link to="/catalog?type=springless" className="category-icon-item">
              <div className="category-icon-item__icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="20"
                    cy="15"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M20 22C20 22 13 24 13 30H27C27 24 20 22 20 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span>Безпружинні</span>
            </Link>
            <Link to="/catalog?type=kids" className="category-icon-item">
              <div className="category-icon-item__icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="20"
                    cy="12"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M20 17C20 17 14 19 14 24H26C26 19 20 17 20 17Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="13"
                    cy="32"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="27"
                    cy="32"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span>Дитячі</span>
            </Link>
            <Link to="/catalog?type=toppers" className="category-icon-item">
              <div className="category-icon-item__icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 20C10 20 12 12 20 12C28 12 30 20 30 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 20C10 20 12 28 20 28C28 28 30 20 30 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="20"
                    y1="12"
                    x2="20"
                    y2="28"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span>Топери</span>
            </Link>
            <Link to="/catalog?type=accessories" className="category-icon-item">
              <div className="category-icon-item__icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 20C12 20 15 12 20 12C25 12 28 20 28 20C28 20 25 28 20 28C15 28 12 20 12 20Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span>Аксесуари</span>
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

      <UniversalCarousel
        products={popularProducts}
        title="Популярні товари"
        showTitle={true}
        showControls={true}
      />

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
