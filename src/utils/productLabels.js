/**
 * Єдине джерело перекладів для атрибутів матраців.
 * Бекенд завжди повертає англійські ключі — фронт перекладає тут.
 *
 * Використовується в: Catalog, CatalogFilters, ProductCard, Product, MattressQuiz
 */

export const TYPE_LABELS = {
  springless: "Безпружинні",
  spring: "Пружинні",
  children: "Дитячі",
  topper: "Топери",
  rolled: "Скручені",
  accessories: "Аксесуари",
};

export const BLOCK_TYPE_LABELS = {
  independent_spring: "Незалежний пружинний блок",
  bonnel_spring: "Залежний пружинний блок (Bonnel)",
  springless: "Безпружинний",
};

export const COVER_TYPE_LABELS = {
  removable: "Знімний",
  non_removable: "Незнімний",
};

export const FILLER_LABELS = {
  latex: "Латекс",
  latex_foam: "Латексована піна",
  memory_foam: "Піна з пам'яттю",
  coconut: "Кокосове полотно",
};

export const HARDNESS_LABELS = {
  H1: "H1 (м'який)",
  H2: "H2 (помірно м'який)",
  H3: "H3 (середній)",
  H4: "H4 (жорсткий)",
  H5: "H5 (дуже жорсткий)",
};

/**
 * Хелпер: переклад ключа через таблицю, fallback на сам ключ
 */
export const t = (labels, key) => labels[key] || key;
