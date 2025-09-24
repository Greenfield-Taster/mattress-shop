import React from "react";
import { Link } from "react-router-dom";
import { Award, Shield, Truck, HelpCircle } from "lucide-react";
import mattressImage from "../assets/images/variant-1.png";
import "../styles/pages/_home.scss";

const Home = () => {
  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1 id="hero-title" className="hero__title">
              Сон, що відновлює. Матраци для кожного дому.
            </h1>
            <p className="hero__subtitle">
              Підберемо комфорт і підтримку під ваш стиль сну. Легкий вибір,
              чесні ціни, швидка доставка.
            </p>
          </div>
          <div className="hero__art" aria-hidden="true">
            <img
              src={mattressImage}
              alt="Комфортний матрац"
              className="hero__image"
            />
          </div>
        </div>
      </section>

      <section className="chooser" aria-labelledby="chooser-title">
        <div className="container">
          <h2 id="chooser-title" className="section-title">
            Обрати швидко
          </h2>
          <div className="chooser__grid">
            <article className="card">
              <header className="card__head">
                <h3 className="card__title">Односпальні</h3>
                <p className="card__tag">
                  Ідеально підходять для дітей та підлітків
                </p>
              </header>
              <div className="card__sizes">
                <div className="size-pill">80×190 см</div>
                <div className="size-pill">90×200 см</div>
              </div>
              <Link
                to="/catalog?type=single"
                className="btn"
                aria-label="Відкрити фільтри каталогу — односпальні"
              >
                Перейти до каталогу
              </Link>
            </article>

            <article className="card">
              <header className="card__head">
                <h3 className="card__title">Півтораспальні</h3>
                <p className="card__tag">
                  Комфорт для одного з додатковим простором
                </p>
              </header>
              <div className="card__sizes">
                <div className="size-pill">120×200 см</div>
                <div className="size-pill">140×200 см</div>
                <div className="size-pill">150×200 см</div>
              </div>
              <Link
                to="/catalog?type=one-and-half"
                className="btn"
                aria-label="Відкрити фільтри каталогу — півтораспальні"
              >
                Перейти до каталогу
              </Link>
            </article>

            <article className="card">
              <header className="card__head">
                <h3 className="card__title">Двоспальні</h3>
                <p className="card__tag">Простір та комфорт для двох</p>
              </header>
              <div className="card__sizes">
                <div className="size-pill">160×200 см</div>
                <div className="size-pill">180×200 см</div>
                <div className="size-pill">200×200 см</div>
              </div>
              <Link
                to="/catalog?type=double"
                className="btn"
                aria-label="Відкрити фільтри каталогу — двоспальні"
              >
                Перейти до каталогу
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="why" aria-labelledby="why-title">
        <div className="container">
          <h2 id="why-title" className="section-title">
            Чому обирають нас
          </h2>
          <ul className="why__grid">
            <li className="why__item">
              <div className="ico" aria-hidden="true">
                <Award size={28} />
              </div>
              <h3 className="why__title">Якість</h3>
              <p className="why__text">Тільки перевірені виробники</p>
            </li>
            <li className="why__item">
              <div className="ico" aria-hidden="true">
                <Shield size={28} />
              </div>
              <h3 className="why__title">Гарантія</h3>
              <p className="why__text">До 10 років гарантії</p>
            </li>
            <li className="why__item">
              <div className="ico" aria-hidden="true">
                <Truck size={28} />
              </div>
              <h3 className="why__title">Доставка</h3>
              <p className="why__text">Швидка доставка по всій Україні</p>
            </li>
            <li className="why__item">
              <div className="ico" aria-hidden="true">
                <HelpCircle size={28} />
              </div>
              <h3 className="why__title">Консультація</h3>
              <p className="why__text">Допоможемо обрати ідеальний матрац</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
