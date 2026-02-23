/**
 * Нормалізує повідомлення про помилку до українського тексту.
 * Якщо помилка — сирий англійський текст від fetch/бекенду,
 * повертає fallback на українській.
 */
export const normalizeError = (error, fallback = "Щось пішло не так. Спробуйте ще раз.") => {
  if (!error) return fallback;

  const msg = typeof error === "string" ? error : error.message || "";

  // Якщо повідомлення вже українською — повертаємо як є
  if (/[а-яіїєґ]/i.test(msg)) return msg;

  // Англійські/технічні помилки → fallback
  return fallback;
};
