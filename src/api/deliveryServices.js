// API для роботи з поштовими сервісами

const NOVA_POSHTA_API_KEY = import.meta.env.VITE_NOVA_POSHTA_API_KEY || "";
const NOVA_POSHTA_API_URL = "https://api.novaposhta.ua/v2.0/json/";

/**
 * Нова Пошта API
 */
export const NovaPoshtaAPI = {
  // Отримати список міст
  async searchCities(query) {
    console.log("🔍 NovaPoshtaAPI.searchCities викликано з query:", query);
    console.log("🔑 API Key присутній:", !!NOVA_POSHTA_API_KEY);

    if (!NOVA_POSHTA_API_KEY) {
      console.warn(
        "⚠️ Нова Пошта API ключ не налаштовано. Використовується демо-режим."
      );
      // Повертаємо демо-дані для тестування
      return [
        { value: "kyiv-ref", label: "Київ", area: "Київська область" },
        { value: "lviv-ref", label: "Львів", area: "Львівська область" },
        { value: "odesa-ref", label: "Одеса", area: "Одеська область" },
        { value: "kharkiv-ref", label: "Харків", area: "Харківська область" },
        {
          value: "dnipro-ref",
          label: "Дніпро",
          area: "Дніпропетровська область",
        },
      ].filter((city) =>
        city.label.toLowerCase().includes(query.toLowerCase())
      );
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      // Демо-дані
      return [
        {
          value: "1",
          label: "Відділення №1",
          address: "вул. Хрещатик, 1",
          number: "1",
        },
        {
          value: "2",
          label: "Відділення №2",
          address: "вул. Саксаганського, 15",
          number: "2",
        },
        {
          value: "3",
          label: "Відділення №3",
          address: "вул. Велика Васильківська, 72",
          number: "3",
        },
        {
          value: "4",
          label: "Поштомат №501",
          address: "вул. Басейна, 8",
          number: "501",
        },
      ].filter(
        (warehouse) =>
          !query ||
          warehouse.label.toLowerCase().includes(query.toLowerCase()) ||
          warehouse.address.toLowerCase().includes(query.toLowerCase())
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Дані від API:", data);

      if (data.success && data.data) {
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

/**
 * Meest API
 * Документація: https://api.meest.com/
 */
export const MeestAPI = {
  async searchCities(query) {
    console.log("🔍 MeestAPI.searchCities:", query);

    // Демо-дані для тестування
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
  },

  async getWarehouses(cityRef, query = "") {
    console.log("🔍 MeestAPI.getWarehouses:", { cityRef, query });

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
  },
};

/**
 * Delivery API
 * Документація: https://www.delivery-auto.com/
 */
export const DeliveryAPI = {
  async searchCities(query) {
    console.log("🔍 DeliveryAPI.searchCities:", query);

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
  },

  async getWarehouses(cityRef, query = "") {
    console.log("🔍 DeliveryAPI.getWarehouses:", { cityRef, query });

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
  },
};

/**
 * InTime API
 * Документація: https://www.intime.ua/
 */
export const InTimeAPI = {
  async searchCities(query) {
    console.log("🔍 InTimeAPI.searchCities:", query);

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
  },

  async getWarehouses(cityRef, query = "") {
    console.log("🔍 InTimeAPI.getWarehouses:", { cityRef, query });

    const warehouses = [
      {
        value: "1",
        label: "Відділення №1",
        address: "вул. Велика Васильківська, 10",
      },
      { value: "2", label: "Відділення №2", address: "вул. Жилянська, 45" },
      { value: "3", label: "Відділення №3", address: "вул. Хрещатик, 5" },
    ];

    return warehouses.filter(
      (warehouse) =>
        !query ||
        warehouse.label.toLowerCase().includes(query.toLowerCase()) ||
        warehouse.address.toLowerCase().includes(query.toLowerCase())
    );
  },
};

/**
 * Допоміжна функція для отримання API за типом доставки
 */
export const getDeliveryAPI = (deliveryMethod) => {
  console.log("🎯 getDeliveryAPI викликано для:", deliveryMethod);

  switch (deliveryMethod) {
    case "nova-poshta":
      return NovaPoshtaAPI;
    case "meest":
      return MeestAPI;
    case "delivery":
      return DeliveryAPI;
    case "intime":
      return InTimeAPI;
    default:
      console.warn("⚠️ Невідомий метод доставки:", deliveryMethod);
      return null;
  }
};
