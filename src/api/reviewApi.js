const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_PUBLISHABLE_API_KEY;

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
