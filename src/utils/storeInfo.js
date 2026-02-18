/**
 * Store information — single source of truth for contact data and pickup address.
 * Used across: Footer, Contacts, Checkout (pickup), OrderSuccess, TrackOrder, seoData.
 *
 * When real data is available, update values here — all pages will reflect changes.
 */

export const STORE_INFO = {
  name: "Just Sleep",
  phones: ["+380501234567", "+380671234567"],
  phonesFormatted: ["+380 (50) 123-45-67", "+380 (67) 123-45-67"],
  email: "info@just-sleep.com.ua",
  address: "м. Київ, вул. Прикладна, 1",
  schedule: "Пн-Пт: 9:00-18:00, Сб: 10:00-16:00",
  pickupAddress: "м. Київ, вул. Прикладна, 1",
  pickupHours: "Пн-Пт: 9:00-18:00, Сб: 10:00-16:00",
  social: {
    telegram: "https://t.me/justsleep_ua",
    instagram: "https://instagram.com/justsleep.ua",
    facebook: "https://facebook.com/justsleep.ua",
  },
  map: {
    lat: 50.4501,
    lng: 30.5234,
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.1!2d30.5234!3d50.4501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDI3JzAwLjQiTiAzMMKwMzEnMjQuMiJF!5e0!3m2!1suk!2sua!4v1234567890123!5m2!1suk!2sua",
  },
};

export const DELIVERY_METHOD_LABELS = {
  "nova-poshta": "Нова Пошта",
  meest: "Meest",
  delivery: "Delivery",
  ukrposhta: "Укрпошта",
  cat: "CAT",
  courier: "Кур'єр (Київ)",
  pickup: "Самовивіз",
};

/**
 * Get human-readable delivery destination string.
 * Used in OrderSuccess and TrackOrder.
 */
export function getDeliveryDestination(order) {
  if (!order) return null;

  const method = order.delivery_method;

  if (method === "pickup") {
    return STORE_INFO.pickupAddress;
  }

  if (method === "courier" && order.delivery_address) {
    return order.delivery_address;
  }

  if (order.delivery_warehouse) {
    return order.delivery_city
      ? `${order.delivery_city}, ${order.delivery_warehouse}`
      : order.delivery_warehouse;
  }

  if (order.delivery_city) {
    return order.delivery_city;
  }

  return null;
}
