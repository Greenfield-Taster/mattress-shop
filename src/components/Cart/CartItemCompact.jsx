import "./CartItemCompact.scss";

const CartItemCompact = ({ item, onUpdateQty, onRemove, currency = "₴" }) => {
  const { id, title, size, firmness, price, qty, image } = item;

  const handleQtyChange = (e) => {
    const newQty = parseInt(e.target.value, 10);
    if (!isNaN(newQty) && newQty >= 1) {
      onUpdateQty(id, size, firmness, newQty);
    }
  };

  const handleIncrement = () => {
    onUpdateQty(id, size, firmness, qty + 1);
  };

  const handleDecrement = () => {
    if (qty > 1) {
      onUpdateQty(id, size, firmness, qty - 1);
    } else {
      onRemove(id, size, firmness);
    }
  };

  const itemTotal = price * qty;

  return (
    <div className="cart-item-compact">
      <div className="cart-item-compact__image-wrapper">
        <img src={image} alt={title} className="cart-item-compact__image" />
      </div>

      <div className="cart-item-compact__content">
        <div className="cart-item-compact__header">
          <h4 className="cart-item-compact__title">{title}</h4>
          <button
            className="cart-item-compact__remove"
            onClick={() => onRemove(id, size, firmness)}
            aria-label="Видалити товар"
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

        <div className="cart-item-compact__specs">
          {size && (
            <span className="cart-item-compact__spec">Розмір: {size}</span>
          )}
          {firmness && (
            <>
              {size && <span className="cart-item-compact__separator">•</span>}
              <span className="cart-item-compact__spec">{firmness}</span>
            </>
          )}
        </div>

        <div className="cart-item-compact__footer">
          <div className="cart-item-compact__qty-control">
            <button
              className="cart-item-compact__qty-btn"
              onClick={handleDecrement}
              aria-label="Зменшити кількість"
              type="button"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 6H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <input
              type="number"
              className="cart-item-compact__qty-input"
              value={qty}
              onChange={handleQtyChange}
              min="1"
              aria-label="Кількість"
            />

            <button
              className="cart-item-compact__qty-btn"
              onClick={handleIncrement}
              aria-label="Збільшити кількість"
              type="button"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2V10M2 6H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="cart-item-compact__price">
            {currency}
            {itemTotal.toLocaleString("uk-UA")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCompact;
