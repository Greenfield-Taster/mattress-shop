// API для роботи з поштовими сервісами

const NOVA_POSHTA_API_KEY = import.meta.env.VITE_NOVA_POSHTA_API_KEY || "";
const NOVA_POSHTA_API_URL = "https://api.novaposhta.ua/v2.0/json/";

/**
 * Нова Пошта API
 */
export const NovaPoshtaAPI = {
  async searchCities(query) {
    console.log("🔍 NovaPoshtaAPI.searchCities викликано з query:", query);
    console.log("🔑 API Key присутній:", !!NOVA_POSHTA_API_KEY);

    if (!NOVA_POSHTA_API_KEY) {
      console.warn(
        "⚠️ Нова Пошта API ключ не налаштовано. Використовується демо-режим."
      );

      return [];
    }

    try {
      const requestBody = {
        apiKey: NOVA_POSHTA_API_KEY,
        modelName: "Address",
        calledMethod: "getCities",
        methodProperties: {
          FindByString: query,
          Limit: 50,
        },
      };

      console.log("📤 Відправляємо запит до Нової Пошти:", requestBody);

      const response = await fetch(NOVA_POSHTA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Отримано відповідь, status:", response.status);

      const data = await response.json();
      console.log("📦 Дані від API:", data);

      if (data.success && data.data) {
        const cities = data.data.map((city) => ({
          value: city.Ref,
          label: city.Description,
          area: city.Area,
        }));
        console.log("✅ Повертаємо міста:", cities.length, "шт.");
        return cities;
      }

      console.warn("⚠️ Нова Пошта API повернула помилку:", data.errors);
      return [];
    } catch (error) {
      console.error("❌ Помилка при отриманні міст Нова Пошта:", error);
      return [];
    }
  },

  // Отримати список відділень
  async getWarehouses(cityRef, query = "") {
    console.log("🔍 NovaPoshtaAPI.getWarehouses викликано:", {
      cityRef,
      query,
    });
    console.log("🔑 API Key присутній:", !!NOVA_POSHTA_API_KEY);

    if (!NOVA_POSHTA_API_KEY) {
      console.warn(
        "⚠️ Нова Пошта API ключ не налаштовано. Використовується демо-режим."
      );
    }

    try {
      const requestBody = {
        apiKey: NOVA_POSHTA_API_KEY,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityRef: cityRef,
          FindByString: query,
          Limit: 50,
        },
      };

      console.log("📤 Відправляємо запит до Нової Пошти:", requestBody);

      const response = await fetch(NOVA_POSHTA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Отримано відповідь, status:", response.status);

      const data = await response.json();
      console.log("📦 Дані від API:", data);

      if (!response.ok || !data.success) {
        console.warn("⚠️ Нова Пошта API помилка (код:", response.status, ") ");
      }

      if (data.data) {
        const warehouses = data.data.map((warehouse) => ({
          value: warehouse.Ref,
          label: `${warehouse.Description}`,
          address: warehouse.ShortAddress,
          number: warehouse.Number,
        }));
        console.log("✅ Повертаємо відділення:", warehouses.length, "шт.");
        return warehouses;
      }

      console.warn("⚠️ Нова Пошта API повернула помилку:", data.errors);
      return [];
    } catch (error) {
      console.error("❌ Помилка при отриманні відділень Нова Пошта:", error);
      return [];
    }
  },

  // Отримати список поштоматів
  async getPostomats(cityRef) {
    console.log("🔍 NovaPoshtaAPI.getPostomats викликано:", cityRef);

    if (!NOVA_POSHTA_API_KEY) {
      return [];
    }

    try {
      const requestBody = {
        apiKey: NOVA_POSHTA_API_KEY,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityRef: cityRef,
          TypeOfWarehouseRef: "9a68df70-0267-42a8-bb5c-37f427e36ee4", // ID для поштоматів
          Limit: 50,
        },
      };

      console.log(
        "📤 Відправляємо запит до Нової Пошти (поштомати):",
        requestBody
      );

      const response = await fetch(NOVA_POSHTA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Дані від API (поштомати):", data);

      if (data.success && data.data) {
        return data.data.map((postomat) => ({
          value: postomat.Ref,
          label: `Поштомат ${postomat.Number}`,
          address: postomat.ShortAddress,
        }));
      }

      return [];
    } catch (error) {
      console.error("❌ Помилка при отриманні поштоматів Нова Пошта:", error);
      return [];
    }
  },
};

const MEEST_API_KEY = import.meta.env.VITE_MEEST_API_KEY || "";
const MEEST_API_URL = "https://api.meest.com/v1/";

/**
 * Meest API
 * Документація: https://api.meest.com/
 */
export const MeestAPI = {
  async searchCities(query) {
    console.log("🔍 MeestAPI.searchCities викликано з query:", query);
    console.log("🔑 API Key присутній:", !!MEEST_API_KEY);

    if (!MEEST_API_KEY) {
      console.warn(
        "⚠️ Meest API ключ не налаштовано. Використовується демо-режим."
      );
      // Fallback до демо-даних
      const cities = [
        { value: "kyiv", label: "Київ", area: "Київська область" },
        { value: "lviv", label: "Львів", area: "Львівська область" },
        { value: "odesa", label: "Одеса", area: "Одеська область" },
        { value: "kharkiv", label: "Харків", area: "Харківська область" },
        { value: "dnipro", label: "Дніпро", area: "Дніпропетровська область" },
        { value: "zaporizhzhia", label: "Запоріжжя", area: "Запорізька область" },
        { value: "vinnytsia", label: "Вінниця", area: "Вінницька область" },
        { value: "poltava", label: "Полтава", area: "Полтавська область" },
      ];
      return cities.filter((city) =>
        city.label.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const response = await fetch(`${MEEST_API_URL}location/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MEEST_API_KEY}`,
        },
        body: JSON.stringify({
          search: query,
          limit: 50,
        }),
      });

      console.log("📥 Отримано відповідь, status:", response.status);

      const data = await response.json();
      console.log("📦 Дані від API:", data);

      if (data.success && data.data) {
        const cities = data.data.map((city) => ({
          value: city.id,
          label: city.name,
          area: city.region,
        }));
        console.log("✅ Повертаємо міста:", cities.length, "шт.");
        return cities;
      }

      console.warn("⚠️ Meest API повернула помилку:", data.errors);
      return [];
    } catch (error) {
      console.error("❌ Помилка при отриманні міст Meest:", error);
      return [];
    }
  },

  async getWarehouses(cityRef, query = "") {
    console.log("🔍 MeestAPI.getWarehouses викликано:", { cityRef, query });
    console.log("🔑 API Key присутній:", !!MEEST_API_KEY);

    if (!MEEST_API_KEY) {
      console.warn(
        "⚠️ Meest API ключ не налаштовано. Використовується демо-режим."
      );
      // Fallback до демо-даних
      const warehouses = [
        { value: "1", label: "Відділення №1", address: "вул. Хрещатик, 1" },
        {
          value: "2",
          label: "Відділення №2",
          address: "вул. Саксаганського, 15",
        },
        {
          value: "3",
          label: "Відділення №3",
          address: "вул. Велика Васильківська, 72",
        },
        { value: "4", label: "Відділення №4", address: "вул. Басейна, 8" },
      ];
      return warehouses.filter(
        (warehouse) =>
          !query ||
          warehouse.label.toLowerCase().includes(query.toLowerCase()) ||
          warehouse.address.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const response = await fetch(`${MEEST_API_URL}location/branches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MEEST_API_KEY}`,
        },
        body: JSON.stringify({
          city_id: cityRef,
          search: query,
          limit: 50,
        }),
      });

      console.log("📥 Отримано відповідь, status:", response.status);

      const data = await response.json();
      console.log("📦 Дані від API:", data);

      if (data.success && data.data) {
        const warehouses = data.data.map((warehouse) => ({
          value: warehouse.id,
          label: `${warehouse.name}`,
          address: warehouse.address,
          number: warehouse.number,
        }));
        console.log("✅ Повертаємо відділення:", warehouses.length, "шт.");
        return warehouses;
      }

      console.warn("⚠️ Meest API повернула помилку:", data.errors);
      return [];
    } catch (error) {
      console.error("❌ Помилка при отриманні відділень Meest:", error);
      return [];
    }
  },
};

const DELIVERY_API_KEY = import.meta.env.VITE_DELIVERY_API_KEY || "";
const DELIVERY_API_URL = "https://api.delivery-auto.com/v1/";

/**
 * Delivery API
 * Документація: https://www.delivery-auto.com/api
 */
export const DeliveryAPI = {
  async searchCities(query) {
    console.log("🔍 DeliveryAPI.searchCities викликано з query:", query);
    console.log("🔑 API Key присутній:", !!DELIVERY_API_KEY);

    if (!DELIVERY_API_KEY) {
      console.warn(
        "⚠️ Delivery API ключ не налаштовано. Використовується демо-режим."
      );
      // Fallback до демо-даних
      const cities = [
        { value: "kyiv", label: "Київ", area: "Київська область" },
        { value: "lviv", label: "Львів", area: "Львівська область" },
        { value: "odesa", label: "Одеса", area: "Одеська область" },
        { value: "kharkiv", label: "Харків", area: "Харківська область" },
        { value: "dnipro", label: "Дніпро", area: "Дніпропетровська область" },
      ];
      return cities.filter((city) =>
        city.label.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const response = await fetch(`${DELIVERY_API_URL}cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": DELIVERY_API_KEY,
        },
        body: JSON.stringify({
          query: query,
          limit: 50,
        }),
      });

      console.log("📥 Отримано відповідь, status:", response.status);

      const data = await response.json();
      console.log("📦 Дані від API:", data);

      if (data.success && data.cities) {
        const cities = data.cities.map((city) => ({
          value: city.city_id,
          label: city.city_name,
          area: city.region_name,
        }));
        console.log("✅ Повертаємо міста:", cities.length, "шт.");
        return cities;
      }

      console.warn("⚠️ Delivery API повернула помилку:", data.error);
      return [];
    } catch (error) {
      console.error("❌ Помилка при отриманні міст Delivery:", error);
      return [];
    }
  },

  async getWarehouses(cityRef, query = "") {
    console.log("🔍 DeliveryAPI.getWarehouses викликано:", { cityRef, query });
    console.log("🔑 API Key присутній:", !!DELIVERY_API_KEY);

    if (!DELIVERY_API_KEY) {
      console.warn(
        "⚠️ Delivery API ключ не налаштовано. Використовується демо-режим."
      );
      // Fallback до демо-даних
      const warehouses = [
        { value: "1", label: "Відділення №1", address: "вул. Хрещатик, 1" },
        { value: "2", label: "Відділення №2", address: "вул. Басейна, 8" },
        {
          value: "3",
          label: "Відділення №3",
          address: "вул. Велика Васильківська, 72",
        },
      ];
      return warehouses.filter(
        (warehouse) =>
          !query ||
          warehouse.label.toLowerCase().includes(query.toLowerCase()) ||
          warehouse.address.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const response = await fetch(`${DELIVERY_API_URL}warehouses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": DELIVERY_API_KEY,
        },
        body: JSON.stringify({
          city_id: cityRef,
          query: query,
          limit: 50,
        }),
      });

      console.log("📥 Отримано відповідь, status:", response.status);

      const data = await response.json();
      console.log("📦 Дані від API:", data);

      if (data.success && data.warehouses) {
        const warehouses = data.warehouses.map((warehouse) => ({
          value: warehouse.warehouse_id,
          label: `${warehouse.warehouse_name}`,
          address: warehouse.address,
          number: warehouse.number,
        }));
        console.log("✅ Повертаємо відділення:", warehouses.length, "шт.");
        return warehouses;
      }

      console.warn("⚠️ Delivery API повернула помилку:", data.error);
      return [];
    } catch (error) {
      console.error("❌ Помилка при отриманні відділень Delivery:", error);
      return [];
    }
  },
};

export const getDeliveryAPI = (deliveryMethod) => {
  console.log("🎯 getDeliveryAPI викликано для:", deliveryMethod);

  switch (deliveryMethod) {
    case "nova-poshta":
      return NovaPoshtaAPI;
    case "meest":
      return MeestAPI;
    case "delivery":
      return DeliveryAPI;
    default:
      console.warn("⚠️ Невідомий метод доставки:", deliveryMethod);
      return null;
  }
};
