export const normalizeError = (error, fallback = "Щось пішло не так. Спробуйте ще раз.") => {
  if (!error) return fallback;

  const msg = typeof error === "string" ? error : error.message || "";

  if (/[а-яіїєґ]/i.test(msg)) return msg;

  return fallback;
};
