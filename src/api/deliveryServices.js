// API для роботи з поштовими сервісами (всі через бекенд проксі)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";
const API_KEY = import.meta.env.VITE_PUBLISHABLE_API_KEY;

const storeHeaders = {
  "x-publishable-api-key": API_KEY,
};

/**
 * Нова Пошта API (через бекенд проксі — ключ зберігається на сервері)
 */
export const NovaPoshtaAPI = {
  async searchCities(query) {
    if (!query?.trim()) return [];

    try {
      const params = new URLSearchParams({ q: query.trim() });
      const response = await fetch(`${API_URL}/store/delivery/cities?${params}`, {
        headers: storeHeaders,
      });
      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      }

      return [];
    } catch (error) {
      console.error("Помилка при отриманні міст Нова Пошта:", error);
      return [];
    }
  },

  async getWarehouses(cityRef, query = "") {
    if (!cityRef) return [];

    try {
      const params = new URLSearchParams({ cityRef });
      if (query) params.set("q", query);

      const response = await fetch(`${API_URL}/store/delivery/warehouses?${params}`, {
        headers: storeHeaders,
      });
      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      }

      return [];
    } catch (error) {
      console.error("Помилка при отриманні відділень Нова Пошта:", error);
      return [];
    }
  },

  async getPostomats(cityRef) {
    if (!cityRef) return [];

    try {
      const params = new URLSearchParams({ cityRef, type: "postomat" });
      const response = await fetch(`${API_URL}/store/delivery/warehouses?${params}`, {
        headers: storeHeaders,
      });
      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      }

      return [];
    } catch (error) {
      console.error("Помилка при отриманні поштоматів Нова Пошта:", error);
      return [];
    }
  },
};

/**
 * Створює API-об'єкт для перевізника через бекенд проксі.
 * carrier — ідентифікатор для параметра ?carrier=
 */
function createCarrierAPI(carrier) {
  return {
    async searchCities(query) {
      if (!query?.trim()) return [];

      try {
        const params = new URLSearchParams({
          q: query.trim(),
          carrier,
        });
        const response = await fetch(`${API_URL}/store/delivery/cities?${params}`, {
          headers: storeHeaders,
        });
        const data = await response.json();

        if (data.success && data.data) {
          return data.data;
        }

        return [];
      } catch (error) {
        console.error(`Помилка при отриманні міст ${carrier}:`, error);
        return [];
      }
    },

    async getWarehouses(cityRef, query = "") {
      if (!cityRef) return [];

      try {
        const params = new URLSearchParams({
          cityRef,
          carrier,
        });
        if (query) params.set("q", query);

        const response = await fetch(`${API_URL}/store/delivery/warehouses?${params}`, {
          headers: storeHeaders,
        });
        const data = await response.json();

        if (data.success && data.data) {
          return data.data;
        }

        return [];
      } catch (error) {
        console.error(`Помилка при отриманні відділень ${carrier}:`, error);
        return [];
      }
    },
  };
}

/**
 * Meest API (через бекенд проксі)
 */
export const MeestAPI = createCarrierAPI("meest");

/**
 * Delivery Auto API (через бекенд проксі)
 */
export const DeliveryAPI = createCarrierAPI("delivery-auto");

/**
 * Укрпошта API (через бекенд проксі)
 */
export const UkrposhtaAPI = createCarrierAPI("ukrposhta");

/**
 * CAT API (через бекенд проксі)
 */
export const CatAPI = createCarrierAPI("cat");

export const getDeliveryAPI = (deliveryMethod) => {
  switch (deliveryMethod) {
    case "nova-poshta":
      return NovaPoshtaAPI;
    case "meest":
      return MeestAPI;
    case "delivery":
      return DeliveryAPI;
    case "ukrposhta":
      return UkrposhtaAPI;
    case "cat":
      return CatAPI;
    default:
      return null;
  }
};
