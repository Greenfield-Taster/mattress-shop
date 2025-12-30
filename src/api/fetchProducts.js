import springMattress from "/spring.png";

// Визначаємо чи використовувати mock чи реальний API
const USE_MOCK = import.meta.env.VITE_MOCK_AUTH === "true";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";

// Publishable API key для store endpoints
const API_KEY = "pk_b11088232151fd94ff6c53ffb32616379865f9e7e90ffa27c8828d30f55ba98f";

// Всі доступні розміри з базовими цінами
const allAvailableSizes = [
  { size: "60×120", priceModifier: -2500, category: "Дитячий" },
  { size: "70×140", priceModifier: -2000, category: "Дитячий" },
  { size: "70×160", priceModifier: -1500, category: "Дитячий" },
  { size: "80×190", priceModifier: -1000, category: "Односпальний" },
  { size: "80×200", priceModifier: -800, category: "Односпальний" },
  { size: "90×190", priceModifier: -500, category: "Односпальний" },
  { size: "90×200", priceModifier: -300, category: "Односпальний" },
  { size: "120×190", priceModifier: 0, category: "Полуторний" },
  { size: "120×200", priceModifier: 200, category: "Полуторний" },
  { size: "140×190", priceModifier: 500, category: "Двоспальний" },
  { size: "140×200", priceModifier: 700, category: "Двоспальний" },
  { size: "160×190", priceModifier: 1000, category: "Двоспальний" },
  { size: "160×200", priceModifier: 1200, category: "Двоспальний" },
  { size: "180×190", priceModifier: 1500, category: "King Size" },
  { size: "180×200", priceModifier: 1700, category: "King Size" },
  { size: "200×200", priceModifier: 2000, category: "King Size XL" },
  { size: "custom", priceModifier: 0, category: "Нестандартний", isCustom: true },
];

// Функція для генерації варіантів розмірів для продукту
const generateVariants = (basePrice, hasOldPrice = false, oldPriceModifier = 1.25) => {
  return allAvailableSizes.map((sizeData, index) => {
    const price = sizeData.isCustom ? null : basePrice + sizeData.priceModifier;
    const oldPrice = hasOldPrice && !sizeData.isCustom
      ? Math.round((basePrice + sizeData.priceModifier) * oldPriceModifier)
      : null;

    return {
      id: index + 1,
      size: sizeData.size,
      price: price,
      oldPrice: oldPrice,
      category: sizeData.category,
      isCustom: sizeData.isCustom || false,
    };
  });
};

const mockProducts = [
  {
    id: 1,
    articleId: "MAT-001-PRO",
    name: "Orthopedic AirFlow Pro",
    type: "Пружинні",
    height: 22,
    hardness: "Н3",
    price: 7990,
    oldPrice: 9990,
    image: springMattress,
    images: [
      springMattress,
      springMattress,
      springMattress,
      springMattress,
      springMattress,
      springMattress,
    ],
    size: "160х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 120,
    inStock: true,
    isNew: false,
    discount: 20,
    description: {
      main: "Матрац оптимальної жорсткості з ортопедичним ефектом. Основу моделі складає незалежний пружинний блок «Pocket Spring», який забезпечує індивідуальну підтримку кожної точки тіла. У комплектації використані сучасні матеріали — латекс та піна з пам'яттю, що створюють ідеальний баланс між м'якістю та підтримкою. Модель має чудове співвідношення ціни та якості, забезпечуючи здоровий та міцний сон. Знімний чохол спрощує догляд за виробом.",
      care: "Виконувати глибоку чистку дозволяється тільки клінінговій компанії або хімчистці. Спеціалісти допоможуть зберегти м'якість та розміри виробу, забезпечити повне висихання наповнювачів та настилів. Не варто застосовувати засоби зі змістом хлору. Для екстреного видалення мокрих плям скористайтесь паперовими серветками. Рекомендується провітрювати матрац кожні 2-3 місяці.",
      specs: [
        "Допустиме навантаження на одне спальне місце - 120 кг",
        "Рівень жорсткості - H3 (середня)",
        "Регламентована висота - 22 см",
        "Об'ємна висота - 24 см",
        "Матрац двосторонньої конструкції",
        "Вага 1м² виробу - 14,5 кг (±5%)",
      ],
    },
    variants: generateVariants(7990, true, 1.25),
  },
  {
    id: 2,
    articleId: "MAT-002-LTX",
    name: "Comfort Dream Latex",
    type: "Безпружинні",
    height: 18,
    hardness: "Н2",
    price: 12500,
    oldPrice: null,
    image: springMattress,
    images: [springMattress, springMattress, springMattress, springMattress],
    size: "180х200",
    blockType: "Безпружинний",
    fillers: ["Латексована піна", "Кокосове полотно"],
    cover: "Незнімний",
    maxWeight: 140,
    inStock: true,
    isNew: true,
    discount: 0,
    description: {
      main: "Безпружинний матрац середньої жорсткості з латексованою піною та кокосовим волокном. Латексована піна забезпечує комфортну підтримку та швидко відновлює форму, а кокосове полотно надає додаткову жорсткість та природну вентиляцію. Ідеально підходить для тих, хто цінує екологічні матеріали та природний комфорт. Матрац має чудові ортопедичні властивості та витримує навантаження до 140 кг на спальне місце.",
      care: "Для догляду використовуйте м'яку щітку або пилосос з насадкою для меблів. У разі появи плям зверніться до професійної хімчистки. Не використовуйте агресивні хімічні засоби. Регулярно провітрюйте приміщення для підтримання оптимальної вологості. Рекомендується перевертати матрац раз на 3 місяці.",
      specs: [
        "Допустиме навантаження на одне спальне місце - 140 кг",
        "Рівень жорсткості - H2 (нижче середньої)",
        "Регламентована висота - 18 см",
        "Безпружинна конструкція",
        "Натуральні екологічні матеріали",
        "Вага 1м² виробу - 12,8 кг (±5%)",
      ],
    },
    variants: generateVariants(12500, false),
  },
  {
    id: 3,
    articleId: "MAT-003-KID",
    name: "Kids Paradise Soft",
    type: "Дитячі",
    height: 12,
    hardness: "Н1",
    price: 5490,
    oldPrice: 6990,
    image: springMattress,
    images: [springMattress, springMattress, springMattress],
    size: "70х160",
    blockType: "Безпружинний",
    fillers: ["Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 60,
    inStock: true,
    isNew: false,
    discount: 21,
    description: {
      main: "Дитячий ортопедичний матрац м'якої жорсткості, створений спеціально для здорового розвитку хребта дитини. Наповнювач з кокосового волокна забезпечує природну вентиляцію та гіпоалергенність. Знімний чохол легко прати, що особливо важливо для дитячих виробів. Рекомендований педіатрами та ортопедами для дітей віком від 3 років. Ідеальне поєднання безпеки, комфорту та доступної ціни.",
      care: "Чохол можна прати в пральній машині при температурі до 40°C. Для видалення забруднень з матраца використовуйте вологу серветку з м'яким миючим засобом. Регулярно провітрюйте матрац. Уникайте прямих сонячних променів. Рекомендується використовувати наматрацник для додаткового захисту.",
      specs: [
        "Допустиме навантаження - 60 кг",
        "Рівень жорсткості - H1 (м'який)",
        "Висота - 12 см",
        "Гіпоалергенні матеріали",
        "Знімний чохол (можна прати)",
        "Рекомендований вік - від 3 років",
      ],
    },
    variants: generateVariants(5490, true, 1.27),
  },
  {
    id: 4,
    articleId: "MAT-004-MEM",
    name: "Memory Foam Elite",
    type: "Безпружинні",
    height: 25,
    hardness: "Н3",
    price: 15990,
    oldPrice: null,
    image: springMattress,
    images: [
      springMattress,
      springMattress,
      springMattress,
      springMattress,
      springMattress,
    ],
    size: "200х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю", "Латекс"],
    cover: "Знімний",
    maxWeight: 150,
    inStock: true,
    isNew: true,
    discount: 0,
    description: {
      main: "Преміум матрац з піною з пам'яттю формоподібної конструкції. Memory Foam адаптується до контурів вашого тіла, забезпечуючи індивідуальну підтримку та максимальний комфорт. Латекс додає пружності та покращує вентиляцію. Ідеальний вибір для тих, хто шукає найвищий рівень комфорту та готовий інвестувати в якісний сон. Знімний чохол з тканини преміум-класу.",
      care: "Знімний чохол можна прати при температурі до 30°C в делікатному режимі. Для матраца рекомендується регулярне провітрювання та використання наматрацника. У разі появи плям зверніться до професійної хімчистки. Уникайте прямих сонячних променів та високих температур.",
      specs: [
        "Допустиме навантаження - 150 кг",
        "Рівень жорсткості - H3 (середня)",
        "Висота - 25 см",
        "Преміум матеріали Memory Foam",
        "Анатомічна підтримка тіла",
        "Вага 1м² виробу - 16,2 кг (±5%)",
      ],
    },
    variants: generateVariants(15990, false),
  },
  {
    id: 5,
    articleId: "MAT-005-CLS",
    name: "Spring Classic",
    type: "Пружинні",
    height: 20,
    hardness: "Н2",
    price: 6990,
    oldPrice: null,
    image: springMattress,
    images: [springMattress, springMattress, springMattress, springMattress],
    size: "140х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латексована піна"],
    cover: "Незнімний",
    maxWeight: 110,
    inStock: true,
    isNew: false,
    discount: 0,
    variants: generateVariants(6990, false),
  },
  {
    id: 6,
    articleId: "MAT-006-TOP",
    name: "Topper Ultra Soft",
    type: "Топери",
    height: 5,
    hardness: "Н1",
    price: 2990,
    oldPrice: 3990,
    image: springMattress,
    images: [springMattress, springMattress],
    size: "180х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 120,
    inStock: true,
    isNew: false,
    discount: 25,
    variants: generateVariants(2990, true, 1.33),
  },
  {
    id: 7,
    articleId: "MAT-007-ROL",
    name: "Roll & Go Travel",
    type: "Скручені",
    height: 15,
    hardness: "Н2",
    price: 4990,
    oldPrice: null,
    image: springMattress,
    images: [springMattress, springMattress, springMattress],
    size: "90х200",
    blockType: "Безпружинний",
    fillers: ["Латексована піна"],
    cover: "Незнімний",
    maxWeight: 90,
    inStock: true,
    isNew: true,
    discount: 0,
    variants: generateVariants(4990, false),
  },
  {
    id: 8,
    articleId: "MAT-008-MAX",
    name: "Premium Ortho Max",
    type: "Пружинні",
    height: 28,
    hardness: "Н4",
    price: 18990,
    oldPrice: 22990,
    image: springMattress,
    images: [
      springMattress,
      springMattress,
      springMattress,
      springMattress,
      springMattress,
      springMattress,
      springMattress,
    ],
    size: "200х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 160,
    inStock: true,
    isNew: false,
    discount: 17,
    variants: generateVariants(18990, true, 1.21),
  },
  {
    id: 9,
    articleId: "MAT-009-ECO",
    name: "EcoNatural Coconut",
    type: "Безпружинні",
    height: 14,
    hardness: "Н3",
    price: 8990,
    oldPrice: null,
    image: springMattress,
    images: [springMattress, springMattress, springMattress, springMattress],
    size: "160х200",
    blockType: "Безпружинний",
    fillers: ["Кокосове полотно", "Латекс"],
    cover: "Знімний",
    maxWeight: 130,
    inStock: true,
    isNew: false,
    discount: 0,
    variants: generateVariants(8990, false),
  },
  {
    id: 10,
    articleId: "MAT-010-BAB",
    name: "Baby Dream Comfort",
    type: "Дитячі",
    height: 10,
    hardness: "Н1",
    price: 4490,
    oldPrice: null,
    image: springMattress,
    images: [springMattress, springMattress],
    size: "60х120",
    blockType: "Безпружинний",
    fillers: ["Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 50,
    inStock: true,
    isNew: true,
    discount: 0,
    variants: generateVariants(4490, false),
  },
  {
    id: 11,
    articleId: "MAT-011-DLX",
    name: "Deluxe Spring Pro",
    type: "Пружинні",
    height: 24,
    hardness: "Н3",
    price: 13990,
    oldPrice: 16990,
    image: springMattress,
    images: [
      springMattress,
      springMattress,
      springMattress,
      springMattress,
      springMattress,
    ],
    size: "180х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 140,
    inStock: true,
    isNew: false,
    discount: 18,
    variants: generateVariants(13990, true, 1.21),
  },
  {
    id: 12,
    articleId: "MAT-012-TOP",
    name: "Topper Memory 3cm",
    type: "Топери",
    height: 3,
    hardness: "Н1",
    price: 1990,
    oldPrice: null,
    image: springMattress,
    images: [springMattress, springMattress],
    size: "160х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю"],
    cover: "Незнімний",
    maxWeight: 100,
    inStock: true,
    isNew: false,
    discount: 0,
    variants: generateVariants(1990, false),
  },
  {
    id: 13,
    articleId: "MAT-013-CLD",
    name: "Cloud Comfort Plus",
    type: "Пружинні",
    height: 26,
    hardness: "Н2",
    price: 11990,
    oldPrice: 14990,
    image: springMattress,
    images: [springMattress, springMattress, springMattress, springMattress],
    size: "160х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Латексована піна"],
    cover: "Знімний",
    maxWeight: 135,
    inStock: true,
    isNew: true,
    discount: 20,
    variants: generateVariants(11990, true, 1.25),
  },
  {
    id: 14,
    articleId: "MAT-014-ROY",
    name: "Royal Latex Premium",
    type: "Безпружинні",
    height: 20,
    hardness: "Н3",
    price: 16990,
    oldPrice: null,
    image: springMattress,
    images: [
      springMattress,
      springMattress,
      springMattress,
      springMattress,
      springMattress,
    ],
    size: "180х200",
    blockType: "Безпружинний",
    fillers: ["Латекс", "Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 145,
    inStock: true,
    isNew: true,
    discount: 0,
    variants: generateVariants(16990, false),
  },
  {
    id: 15,
    articleId: "MAT-015-SPT",
    name: "Sport Active",
    type: "Пружинні",
    height: 23,
    hardness: "Н4",
    price: 14990,
    oldPrice: null,
    image: springMattress,
    images: [springMattress, springMattress, springMattress],
    size: "140х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Кокосове полотно"],
    cover: "Незнімний",
    maxWeight: 150,
    inStock: true,
    isNew: false,
    discount: 0,
    variants: generateVariants(14990, false),
  },
  {
    id: 16,
    articleId: "MAT-016-TEN",
    name: "Teen Comfort",
    type: "Дитячі",
    height: 14,
    hardness: "Н2",
    price: 5990,
    oldPrice: 7490,
    image: springMattress,
    images: [springMattress, springMattress, springMattress],
    size: "80х190",
    blockType: "Безпружинний",
    fillers: ["Латексована піна", "Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 80,
    inStock: true,
    isNew: false,
    discount: 20,
    variants: generateVariants(5990, true, 1.25),
  },
  {
    id: 17,
    articleId: "MAT-017-GEL",
    name: "Gel Cool Breeze",
    type: "Безпружинні",
    height: 22,
    hardness: "Н2",
    price: 19990,
    oldPrice: null,
    image: springMattress,
    images: [springMattress, springMattress, springMattress, springMattress],
    size: "200х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю", "Латекс"],
    cover: "Знімний",
    maxWeight: 140,
    inStock: true,
    isNew: true,
    discount: 0,
    variants: generateVariants(19990, false),
  },
  {
    id: 18,
    articleId: "MAT-018-BDG",
    name: "Budget Spring",
    type: "Пружинні",
    height: 18,
    hardness: "Н2",
    price: 5490,
    oldPrice: null,
    image: springMattress,
    images: [springMattress, springMattress],
    size: "140х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латексована піна"],
    cover: "Незнімний",
    maxWeight: 100,
    inStock: true,
    isNew: false,
    discount: 0,
    variants: generateVariants(5490, false),
  },
  {
    id: 19,
    articleId: "MAT-019-LTX",
    name: "Topper Latex Soft",
    type: "Топери",
    height: 4,
    hardness: "Н1",
    price: 3490,
    oldPrice: 4490,
    image: springMattress,
    images: [springMattress, springMattress],
    size: "180х200",
    blockType: "Безпружинний",
    fillers: ["Латекс"],
    cover: "Знімний",
    maxWeight: 120,
    inStock: true,
    isNew: false,
    discount: 22,
    variants: generateVariants(3490, true, 1.29),
  },
  {
    id: 20,
    articleId: "MAT-020-TRV",
    name: "Holiday Travel Mat",
    type: "Скручені",
    height: 12,
    hardness: "Н2",
    price: 3990,
    oldPrice: null,
    image: springMattress,
    images: [springMattress, springMattress],
    size: "80х190",
    blockType: "Безпружинний",
    fillers: ["Латексована піна"],
    cover: "Незнімний",
    maxWeight: 85,
    inStock: true,
    isNew: false,
    discount: 0,
    variants: generateVariants(3990, false),
  },
];

const filterProducts = (products, params) => {
  return products.filter((product) => {
    if (params.types?.length > 0 && !params.types.includes(product.type)) {
      return false;
    }
    if (params.sizes?.length > 0 && !params.sizes.includes(product.size)) {
      return false;
    }
    if (params.height) {
      const [min, max] = params.height.split("-").map(Number);
      if (product.height < min || product.height > max) return false;
    }
    if (
      params.blockTypes?.length > 0 &&
      !params.blockTypes.includes(product.blockType)
    ) {
      return false;
    }
    if (params.fillers?.length > 0) {
      const hasAnyFiller = params.fillers.some((filler) =>
        product.fillers.includes(filler)
      );
      if (!hasAnyFiller) return false;
    }
    if (params.covers?.length > 0 && !params.covers.includes(product.cover)) {
      return false;
    }
    if (params.maxWeight) {
      const maxWeightValue = parseInt(params.maxWeight.replace("<=", ""));
      if (product.maxWeight > maxWeightValue) return false;
    }
    if (params.price) {
      const [min, max] = params.price.split("-").map(Number);
      if (product.price < min || product.price > max) return false;
    }
    return true;
  });
};

const sortProducts = (products, sortParam) => {
  if (!sortParam || sortParam === "default") return products;
  const sorted = [...products];
  switch (sortParam) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "popular":
      return sorted;
    case "new":
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case "discount":
      return sorted.sort((a, b) => b.discount - a.discount);
    default:
      return sorted;
  }
};

/**
 * Отримує продукти з mock-даних
 */
const fetchProductsMock = async (params) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 12;
  let filtered = filterProducts(mockProducts, params);
  filtered = sortProducts(filtered, params.sort);
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filtered.slice(start, end);
  return { items, total, page, limit };
};

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
 * Отримує продукти з реального API
 */
const fetchProductsApi = async (params) => {
  const url = buildApiUrl(params);

  try {
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

    // API повертає { items, total, page, limit }
    return {
      items: data.items || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 12,
    };
  } catch (error) {
    console.error("Error fetching products from API:", error);
    // Fallback до mock-даних при помилці
    console.warn("Falling back to mock data");
    return fetchProductsMock(params);
  }
};

/**
 * Головна функція для отримання продуктів
 * Використовує mock або реальний API залежно від налаштувань
 */
export const fetchProducts = async (params) => {
  if (USE_MOCK) {
    return fetchProductsMock(params);
  }
  return fetchProductsApi(params);
};

/**
 * Отримує продукт за ID або handle
 */
export const fetchProductById = async (idOrHandle) => {
  if (USE_MOCK) {
    // Mock: шукаємо по id
    await new Promise((resolve) => setTimeout(resolve, 200));
    const product = mockProducts.find(
      (p) => p.id === parseInt(idOrHandle) || p.articleId === idOrHandle
    );
    return product || null;
  }

  // Real API
  try {
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
  } catch (error) {
    console.error("Error fetching product:", error);
    // Fallback до mock
    const product = mockProducts.find(
      (p) => p.id === parseInt(idOrHandle) || p.articleId === idOrHandle
    );
    return product || null;
  }
};

export default fetchProducts;
