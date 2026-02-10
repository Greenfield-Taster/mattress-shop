const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";

// Publishable API key для store endpoints
const API_KEY = import.meta.env.VITE_PUBLISHABLE_API_KEY;

/**
 * Будує URL з параметрами для API запиту
 */
const buildApiUrl = (params) => {
  const url = new URL(`${API_URL}/store/mattresses`);

  // Додаємо параметри фільтрації
  if (params.types?.length > 0) {
    url.searchParams.set("types", params.types.join(","));
  }
  if (params.sizes?.length > 0) {
    url.searchParams.set("sizes", params.sizes.join(","));
  }
  if (params.hardness?.length > 0) {
    url.searchParams.set("hardness", params.hardness.join(","));
  }
  if (params.blockTypes?.length > 0) {
    url.searchParams.set("blockTypes", params.blockTypes.join(","));
  }
  if (params.fillers?.length > 0) {
    url.searchParams.set("fillers", params.fillers.join(","));
  }
  if (params.covers?.length > 0) {
    url.searchParams.set("covers", params.covers.join(","));
  }
  if (params.height && params.height !== "3-45") {
    url.searchParams.set("height", params.height);
  }
  if (params.maxWeight && params.maxWeight !== "<=250") {
    url.searchParams.set("maxWeight", params.maxWeight);
  }
  if (params.price && params.price !== "0-50000") {
    url.searchParams.set("price", params.price);
  }
  if (params.sort && params.sort !== "default") {
    url.searchParams.set("sort", params.sort);
  }

  // Пагінація
  url.searchParams.set("page", String(params.page || 1));
  url.searchParams.set("limit", String(params.limit || 12));

  return url.toString();
};

/**
 * Головна функція для отримання продуктів
 */
export const fetchProducts = async (params) => {
  const url = buildApiUrl(params);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return {
    items: data.items || [],
    total: data.total || 0,
    page: data.page || 1,
    limit: data.limit || 12,
  };
};

/**
 * Отримує популярні товари для головної сторінки
 */
export const fetchPopularProducts = async (limit = 6) => {
  const response = await fetch(
    `${API_URL}/store/mattresses/popular?limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    items: data.items || [],
    total: data.total || 0,
  };
};

/**
 * Отримує продукт за ID або handle
 */
export const fetchProductById = async (idOrHandle) => {
  const response = await fetch(`${API_URL}/store/mattresses/${idOrHandle}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.mattress || data;
};

export default fetchProducts;
