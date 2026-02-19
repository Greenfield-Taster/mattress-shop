/**
 * Order Email Service
 * Відправка email з підтвердженням замовлення через EmailJS
 */

import emailjs from "@emailjs/browser";
import { DELIVERY_METHOD_LABELS } from "../utils/storeInfo";

/**
 * Відправити email з підтвердженням замовлення
 * Виклик — fire-and-forget (не блокує оформлення замовлення)
 *
 * @param {Object} params
 * @param {string} params.orderNumber - Номер замовлення
 * @param {string} params.email - Email отримувача
 * @param {string} params.fullName - ПІБ отримувача
 * @param {Array} params.items - Товари [{title, size, qty, price}]
 * @param {Object} params.totals - {subtotal, discount, total}
 * @param {string} params.deliveryMethod - Спосіб доставки (ключ)
 * @param {string|null} params.deliveryCity - Місто доставки
 * @param {string|null} params.deliveryWarehouse - Відділення
 * @param {string|null} params.deliveryAddress - Адреса (для кур'єра)
 * @param {number} params.deliveryPrice - Вартість доставки
 * @param {string} params.deliveryPriceType - Тип ціни (free/fixed/carrier)
 */
export async function sendOrderConfirmationEmail({
  orderNumber,
  email,
  fullName,
  items,
  totals,
  deliveryMethod,
  deliveryCity,
  deliveryWarehouse,
  deliveryAddress,
  deliveryPrice,
  deliveryPriceType,
}) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("[orderEmail] EmailJS order template not configured, skipping email");
    return;
  }

  // Формуємо текстовий список товарів
  const itemsList = items
    .map((item) => {
      const size = item.size ? ` (${item.size})` : "";
      const qty = item.qty || item.quantity || 1;
      return `${item.title}${size} — ${qty} x ${item.price} ₴`;
    })
    .join("\n");

  // Формуємо рядок доставки
  const deliveryLabel = DELIVERY_METHOD_LABELS[deliveryMethod] || deliveryMethod;
  let deliveryDestination = "";
  if (deliveryMethod === "pickup") {
    deliveryDestination = "Самовивіз";
  } else if (deliveryMethod === "courier" && deliveryAddress) {
    deliveryDestination = `${deliveryCity || ""}, ${deliveryAddress}`.trim();
  } else if (deliveryWarehouse) {
    deliveryDestination = deliveryCity
      ? `${deliveryCity}, ${deliveryWarehouse}`
      : deliveryWarehouse;
  } else if (deliveryCity) {
    deliveryDestination = deliveryCity;
  }

  // Формуємо вартість доставки
  let deliveryCost = "Безкоштовно";
  if (deliveryPriceType === "carrier") {
    deliveryCost = "За тарифами перевізника";
  } else if (deliveryPrice > 0) {
    deliveryCost = `${deliveryPrice} ₴`;
  }

  const templateParams = {
    to_email: email,
    to_name: fullName,
    order_number: orderNumber,
    items_list: itemsList,
    subtotal: `${totals.subtotal} ₴`,
    discount: totals.discount > 0 ? `-${totals.discount} ₴` : "",
    delivery_cost: deliveryCost,
    total: `${totals.total} ₴`,
    delivery_method: deliveryLabel,
    delivery_destination: deliveryDestination,
  };

  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
  } catch (error) {
    // Не кидаємо помилку — email не повинен блокувати замовлення
    console.error("[orderEmail] Failed to send confirmation email:", error);
  }
}
