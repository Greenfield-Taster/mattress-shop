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
  H1: "Н1",
  H2: "Н2",
  H3: "Н3",
  H4: "Н4",
  H5: "Н5",
};

export const HARDNESS_DETAILS = {
  H1: { label: "Н1 — М'який", subtitle: "Для сну на боці, вага до 60 кг" },
  H2: { label: "Н2 — Помірно м'який", subtitle: "Комфортна підтримка, вага 50-70 кг" },
  H3: { label: "Н3 — Середньої жорсткості", subtitle: "Універсальний, вага 60-90 кг" },
  H4: { label: "Н4 — Жорсткий", subtitle: "При болях у спині, вага 90-120 кг" },
  H5: { label: "Н5 — Дуже жорсткий", subtitle: "Максимальна підтримка, вага 120+ кг" },
};

export const t = (labels, key) => labels[key] || key;
