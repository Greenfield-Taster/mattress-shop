import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, ShoppingBag } from "lucide-react";
import "../styles/pages/_notfound.scss";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-number">
          <span className="notfound-number__digit">4</span>
          <span className="notfound-number__digit notfound-number__digit--bed">
            🛏️
          </span>
          <span className="notfound-number__digit">4</span>
        </div>

        <div className="notfound-content">
          <h1 className="notfound-title">Сторінку не знайдено</h1>
          <p className="notfound-subtitle">
            На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
            <br />
            Можливо, ви помилилися в адресі або посилання застаріло.
          </p>
        </div>

        <div className="notfound-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/")}
          >
            <Home size={20} />
            <span>На головну</span>
          </button>

          <button
            className="btn btn-outline btn-lg"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>
        </div>

        <div className="notfound-links">
          <h3 className="notfound-links__title">Популярні сторінки:</h3>

          <div className="notfound-links__grid">
            <Link to="/catalog" className="notfound-link">
              <div className="notfound-link__icon">
                <ShoppingBag size={24} />
              </div>
              <div className="notfound-link__content">
                <h4>Каталог</h4>
                <p>Перегляньте наші матраци</p>
              </div>
            </Link>

            <Link to="/contacts" className="notfound-link">
              <div className="notfound-link__icon">
                <Search size={24} />
              </div>
              <div className="notfound-link__content">
                <h4>Контакти</h4>
                <p>Зв'яжіться з нами</p>
              </div>
            </Link>

            <Link to="/profile" className="notfound-link">
              <div className="notfound-link__icon">👤</div>
              <div className="notfound-link__content">
                <h4>Профіль</h4>
                <p>Ваші особисті дані</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
