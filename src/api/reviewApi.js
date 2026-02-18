/**
 * Review API Service
 * Сервіс для роботи з відгуками
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_PUBLISHABLE_API_KEY;

/**
 * Отримати відгуки для продукту
 * @param {string} productId - ID продукту
 * @param {Object} options - параметри запиту
 * @param {string} options.sort - сортування: newest, highest, lowest
 * @param {number} options.limit - кількість відгуків
 * @param {number} options.offset - зміщення для пагінації
 * @returns {Promise<Object>} - { reviews, stats, count, offset, limit }
 */
export async function getProductReviews(productId, { sort = "newest", limit = 5, offset = 0 } = {}) {
  const params = new URLSearchParams({
    sort,
    limit: String(limit),
    offset: String(offset),
  });

  const response = await fetch(
    `${API_BASE_URL}/store/reviews/${productId}?${params.toString()}`,
    {
      headers: {
        "x-publishable-api-key": API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Створити відгук
 * @param {Object} reviewData - дані відгуку
 * @param {string} reviewData.product_id - ID продукту
 * @param {string} reviewData.name - ім'я автора
 * @param {string} reviewData.email - email автора
 * @param {number} reviewData.rating - оцінка 1-5
 * @param {string} reviewData.comment - текст відгуку
 * @returns {Promise<Object>} - { review, message }
 */
export async function createReview(reviewData) {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    "x-publishable-api-key": API_KEY,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/store/reviews`, {
    method: "POST",
    headers,
    body: JSON.stringify(reviewData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Помилка створення відгуку");
  }

  return data;
}
