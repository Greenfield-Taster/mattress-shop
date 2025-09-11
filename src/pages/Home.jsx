import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const mattressSizes = [
    {
      id: 'single',
      title: 'Односпальні',
      description: 'Ідеально підходять для дітей та підлітків',
      dimensions: '80x190 см, 90x200 см',
      icon: '🛏️',
      link: '/catalog/single'
    },
    {
      id: 'double',
      title: 'Полуторні',
      description: 'Комфорт для однієї людини з додатковим простором',
      dimensions: '120x200 см, 140x200 см',
      icon: '🛌',
      link: '/catalog/double'
    },
    {
      id: 'king',
      title: 'Двоспальні',
      description: 'Простір та комфорт для двох',
      dimensions: '160x200 см, 180x200 см',
      icon: '🏨',
      link: '/catalog/king'
    }
  ];

  const features = [
    {
      id: 1,
      title: 'Якість',
      description: 'Тільки перевірені виробники',
      icon: '⭐'
    },
    {
      id: 2,
      title: 'Гарантія',
      description: 'До 10 років гарантії',
      icon: '🛡️'
    },
    {
      id: 3,
      title: 'Доставка',
      description: 'Безкоштовна доставка по Києву',
      icon: '🚚'
    },
    {
      id: 4,
      title: 'Консультація',
      description: 'Допоможемо обрати ідеальний матрас',
      icon: '💬'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero">
        <div className="container">
          <h1 className="home__hero-title">
            Знайдіть свій ідеальний матрас
          </h1>
          <p className="home__hero-subtitle">
            Якісні матраси для комфортного сну. Різні розміри, матеріали та цінові категорії. 
            Безкоштовна доставка та професійна консультація.
          </p>
        </div>
      </section>

      {/* Size Selection */}
      <section className="home__sizes">
        <div className="container">
          <h2 className="home__sizes-title">
            Оберіть розмір матраса
          </h2>
          <div className="home__sizes-grid">
            {mattressSizes.map((size) => (
              <Link 
                key={size.id}
                to={size.link}
                className="home__size-card"
              >
                <div className="home__size-card__icon">
                  {size.icon}
                </div>
                <h3 className="home__size-card__title">
                  {size.title}
                </h3>
                <p className="home__size-card__description">
                  {size.description}
                </p>
                <span className="home__size-card__dimensions">
                  {size.dimensions}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home__features">
        <div className="container">
          <h2 className="home__features-title">
            Чому обирають нас
          </h2>
          <div className="home__features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="home__feature">
                <div className="home__feature__icon">
                  {feature.icon}
                </div>
                <h3 className="home__feature__title">
                  {feature.title}
                </h3>
                <p className="home__feature__description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;