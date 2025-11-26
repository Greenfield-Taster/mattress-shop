import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Скролимо вгору тільки при PUSH (нова сторінка) або REPLACE
    // Не скролимо при POP (кнопка назад/вперед браузера)
    if (navigationType !== 'POP') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
