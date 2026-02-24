import { authenticatedFetch } from "./apiClient";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_PUBLISHABLE_API_KEY;

export async function createOrder(orderData) {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    "x-publishable-api-key": API_KEY,
  };

  try {
    const fetchFn = token ? authenticatedFetch : fetch;
    const response = await fetchFn(`${API_BASE_URL}/store/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Помилка створення замовлення");
    }

    return data;
  } catch (error) {
    console.error("[orderApi] createOrder error:", error);
    throw error;
  }
}

export async function getOrder(orderId) {
  const token = localStorage.getItem("authToken");

  const headers = {
    "x-publishable-api-key": API_KEY,
  };

  try {
    const fetchFn = token ? authenticatedFetch : fetch;
    const response = await fetchFn(`${API_BASE_URL}/store/orders/${orderId}`, {
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Замовлення не знайдено");
    }

    return data;
  } catch (error) {
    console.error("[orderApi] getOrder error:", error);
    throw error;
  }
}

export async function getMyOrders() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Необхідна авторизація");
  }

  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/shop-orders`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Помилка отримання замовлень");
    }

    return data;
  } catch (error) {
    console.error("[orderApi] getMyOrders error:", error);
    throw error;
  }
}

export function formatOrderData(formData, items, totals, promoCode = null, deliveryInfo = null) {
  return {
    contactData: {
      fullName: formData.contactData.fullName,
      phone: formData.contactData.phone,
      email: formData.contactData.email,
      comment: formData.contactData.comment || null,
      createAccount: formData.contactData.createAccount || false,
    },

    deliveryMethod: formData.deliveryMethod,
    deliveryCity: formData.deliveryCity || null,
    deliveryCityRef: formData.deliveryCityRef || null,
    deliveryAddress: formData.deliveryAddress || null,
    deliveryWarehouse: formData.deliveryWarehouse || null,
    deliveryPrice: deliveryInfo?.price ?? 0,
    deliveryPriceType: deliveryInfo?.type || "free",

    paymentMethod: formData.paymentMethod,
    paymentData: formData.paymentData || null,

    items: items.map((item) => ({
      id: item.id,
      product_id: item.product_id || String(item.id),
      variant_id: item.variant_id || null,
      title: item.title,
      image: item.image || null,
      size: item.size || null,
      firmness: item.firmness || null,
      price: item.price,
      qty: item.qty,
    })),

    totals: {
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
    },

    promoCode: promoCode
      ? {
          code: promoCode.code,
          discount: promoCode.discount,
          type: promoCode.type,
        }
      : null,
  };
}
