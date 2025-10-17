import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../../hooks/useCart';
import CartItemCompact from './CartItemCompact';
import './CartSidePanel.scss';

const CartSidePanel = ({ isOpen, onClose }) => {
  const {
    items,
    updateQty,
    removeItem,
    clearCart,
    totals,
    currency,
    promoCode,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Trap focus в панелі
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Блокування скролу body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    
    if (!promoInput.trim()) {
      setPromoMessage({ text: 'Введіть промокод', type: 'error' });
      return;
    }

    const result = applyPromoCode(promoInput);
    setPromoMessage({ 
      text: result.message, 
      type: result.success ? 'success' : 'error' 
    });

    if (result.success) {
      setPromoInput('');
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoMessage({ text: '', type: '' });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="cart-side-panel-overlay" onClick={handleOverlayClick}>
      <div
        ref={panelRef}
        className={`cart-side-panel ${isOpen ? 'cart-side-panel--open' : ''}`}
        role="dialog"
        aria-labelledby="cart-panel-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="cart-side-panel__header">
          <h2 id="cart-panel-title" className="cart-side-panel__title">
            Кошик
            {totals.itemsCount > 0 && (
              <span className="cart-side-panel__count">({totals.itemsCount})</span>
            )}
          </h2>
          <button
            ref={closeButtonRef}
            className="cart-side-panel__close"
            onClick={onClose}
            aria-label="Закрити кошик"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="cart-side-panel__content">
          {items.length === 0 ? (
            <div className="cart-side-panel__empty">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 16L12 52H52L56 16H8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 24V12C24 9.79086 25.7909 8 28 8H36C38.2091 8 40 9.79086 40 12V24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="cart-side-panel__empty-text">Ваш кошик порожній</p>
              <p className="cart-side-panel__empty-subtext">
                Додайте товари з каталогу
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="cart-side-panel__items">
                {items.map((item, index) => (
                  <CartItemCompact
                    key={`${item.id}-${item.size}-${item.firmness}-${index}`}
                    item={item}
                    onUpdateQty={updateQty}
                    onRemove={removeItem}
                    currency={currency}
                  />
                ))}
              </div>

              {/* Promo Code */}
              <div className="cart-side-panel__promo">
                {!promoCode ? (
                  <form onSubmit={handlePromoSubmit} className="cart-side-panel__promo-form">
                    <input
                      type="text"
                      className="cart-side-panel__promo-input"
                      placeholder="Промокод"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    />
                    <button
                      type="submit"
                      className="cart-side-panel__promo-button"
                    >
                      Застосувати
                    </button>
                  </form>
                ) : (
                  <div className="cart-side-panel__promo-applied">
                    <div className="cart-side-panel__promo-info">
                      <span className="cart-side-panel__promo-code">{promoCode.code}</span>
                      <span className="cart-side-panel__promo-discount">
                        -{promoCode.type === 'percentage' 
                          ? `${promoCode.discount}%` 
                          : `${currency}${promoCode.discount}`}
                      </span>
                    </div>
                    <button
                      className="cart-side-panel__promo-remove"
                      onClick={handleRemovePromo}
                      type="button"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4L4 12M4 4L12 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {promoMessage.text && (
                  <p className={`cart-side-panel__promo-message cart-side-panel__promo-message--${promoMessage.type}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-side-panel__footer">
            <div className="cart-side-panel__totals">
              <div className="cart-side-panel__total-row">
                <span>Проміжний підсумок:</span>
                <span>{currency}{totals.subtotal.toLocaleString('uk-UA')}</span>
              </div>
              {totals.discount > 0 && (
                <div className="cart-side-panel__total-row cart-side-panel__total-row--discount">
                  <span>Знижка:</span>
                  <span>-{currency}{totals.discount.toLocaleString('uk-UA')}</span>
                </div>
              )}
              <div className="cart-side-panel__total-row cart-side-panel__total-row--final">
                <span>Разом:</span>
                <span>{currency}{totals.total.toLocaleString('uk-UA')}</span>
              </div>
            </div>

            <button
              className="cart-side-panel__checkout-button"
              onClick={() => alert('Перехід до оформлення')}
              type="button"
            >
              Оформити замовлення
            </button>

            <button
              className="cart-side-panel__clear-button"
              onClick={clearCart}
              type="button"
            >
              Очистити кошик
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CartSidePanel;
