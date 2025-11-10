import { createContext, useState, useCallback, useMemo } from "react";
import pillowImage from "/pillow.png";

export const CartContext = createContext(null);

export const CartProvider = ({ children, currency = "₴" }) => {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "Матрац Comfort Plus",
      size: "160x200",
      firmness: "Середня",
      price: 12999,
      image: pillowImage,
      qty: 1,
    },
    {
      id: 2,
      title: "Матрац Premium Lux",
      size: "140x200",
      firmness: "Жорстка",
      price: 15999,
      image: pillowImage,
      qty: 1,
    },
  ]);

  const [promoCode, setPromoCode] = useState(null);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.firmness === item.firmness
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += item.qty || 1;
        return updated;
      }

      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  }, []);

  const updateQty = useCallback((id, size, firmness, qty) => {
    if (qty < 1) {
      setItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.id === id &&
              item.size === size &&
              item.firmness === firmness
            )
        )
      );
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.firmness === firmness
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((id, size, firmness) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.size === size && item.firmness === firmness)
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode(null);
  }, []);

  const applyPromoCode = useCallback((code) => {
    const mockPromos = {
      SAVE10: { discount: 10, type: "percentage" },
      SAVE20: { discount: 20, type: "percentage" },
      NEW100: { discount: 100, type: "fixed" },
      BEST50: { discount: 50, type: "percentage" },
      GIFT15: { discount: 15, type: "percentage" },
      VIP500: { discount: 500, type: "fixed" },
    };

    const promo = mockPromos[code.toUpperCase()];
    if (promo) {
      setPromoCode({ code: code.toUpperCase(), ...promo });
      return { success: true, message: "" };
    }
    return { success: false, message: "Невірний промокод. Спробуйте інший." };
  }, []);

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
  }, []);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    let discount = 0;
    if (promoCode) {
      if (promoCode.type === "percentage") {
        discount = (subtotal * promoCode.discount) / 100;
      } else {
        discount = promoCode.discount;
      }
    }

    const total = Math.max(0, subtotal - discount);

    return {
      subtotal,
      discount,
      total,
      itemsCount: items.reduce((sum, item) => sum + item.qty, 0),
    };
  }, [items, promoCode]);

  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    totals,
    currency,
    promoCode,
    applyPromoCode,
    removePromoCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
