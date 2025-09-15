import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found__content">
          <div className="not-found__illustration">
            <div className="not-found__number">404</div>
            <div className="not-found__icon">
              <Search size={64} />
            </div>
          </div>
          
          <div className="not-found__text">
            <h1 className="not-found__title">Сторінку не знайдено</h1>
            <p className="not-found__description">
              Вибачте, але сторінка, яку ви шукаєте, не існує. 
              Можливо, вона була переміщена або видалена.
            </p>
          </div>

          <div className="not-found__actions">
            <Link to="/" className="btn btn-primary btn-lg">
              <HomeIcon size={18} />
              На головну
            </Link>
            <Link to="/catalog" className="btn btn-outline btn-lg">
              <Search size={18} />
              До каталогу
            </Link>
          </div>

          <div className="not-found__suggestions">
            <h3>Можливо, вас зацікавить:</h3>
            <div className="not-found__links">
              <Link to="/catalog/single">Односпальні матраси</Link>
              <Link to="/catalog/double">Полуторні матраси</Link>
              <Link to="/catalog/king">Двоспальні матраси</Link>
              <Link to="/about">Про нас</Link>
              <Link to="/contacts">Контакти</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;