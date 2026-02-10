import { useState, useEffect, useCallback, useMemo } from "react";
import { CartContext } from "./CartContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";
const API_KEY = import.meta.env.VITE_PUBLISHABLE_API_KEY;

const CART_STORAGE_KEY = "cart";
const PROMO_STORAGE_KEY = "cart_promo";

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children, currency = "₴" }) => {
  const [items, setItems] = useState(() => loadFromStorage(CART_STORAGE_KEY, []));
  const [promoCode, setPromoCode] = useState(() => loadFromStorage(PROMO_STORAGE_KEY, null));

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (promoCode) {
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promoCode));
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [promoCode]);

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

  const applyPromoCode = useCallback(async (code) => {
    try {
      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      const response = await fetch(`${API_BASE_URL}/store/promo-codes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": API_KEY,
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          order_amount: subtotal,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setPromoCode({
          code: data.code,
          discount: data.discount_value,
          type: data.discount_type,
        });
        return { success: true, message: data.message || "" };
      }

      return {
        success: false,
        message: data.message || "Невірний промокод. Спробуйте інший.",
      };
    } catch {
      return {
        success: false,
        message: "Помилка перевірки промокоду. Спробуйте пізніше.",
      };
    }
  }, [items]);

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
        discount = Math.round((subtotal * promoCode.discount) / 100);
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

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
