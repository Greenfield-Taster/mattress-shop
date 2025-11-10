import springMattress from "/spring.png";

const mockProducts = [
  {
    id: 1,
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
    variants: [
      { id: 1, size: "140×200", price: 6990, oldPrice: 8990 },
      { id: 2, size: "160×200", price: 7990, oldPrice: 9990 },
      { id: 3, size: "180×200", price: 8990, oldPrice: 10990 },
      { id: 4, size: "200×200", price: 9990, oldPrice: 11990 },
      { id: 5, size: "140×200", price: 6990, oldPrice: 8990 },
      { id: 6, size: "160×200", price: 7990, oldPrice: 9990 },
      { id: 7, size: "180×200", price: 8990, oldPrice: 10990 },
      { id: 8, size: "200×200", price: 9990, oldPrice: 11990 },
      { id: 9, size: "140×200", price: 6990, oldPrice: 8990 },
      { id: 10, size: "160×200", price: 7990, oldPrice: 9990 },
      { id: 11, size: "180×200", price: 8990, oldPrice: 10990 },
      { id: 12, size: "200×200", price: 9990, oldPrice: 11990 },
      { id: 13, size: "140×200", price: 6990, oldPrice: 8990 },
      { id: 14, size: "160×200", price: 7990, oldPrice: 9990 },
      { id: 15, size: "180×200", price: 8990, oldPrice: 10990 },
      { id: 16, size: "200×200", price: 9990, oldPrice: 11990 },
    ],
  },
  {
    id: 2,
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
    variants: [
      { id: 1, size: "160×200", price: 11500 },
      { id: 2, size: "180×200", price: 12500 },
      { id: 3, size: "200×200", price: 13500 },
      { id: 4, size: "160×200", price: 11500 },
      { id: 5, size: "180×200", price: 12500 },
      { id: 6, size: "200×200", price: 13500 },
      { id: 7, size: "200×200", price: 13500 },
    ],
  },
  {
    id: 3,
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
    variants: [
      { id: 8, size: "60×120", price: 4490, oldPrice: 5490 },
      { id: 9, size: "70×140", price: 4990, oldPrice: 5990 },
      { id: 10, size: "70×160", price: 5490, oldPrice: 6990 },
    ],
  },
  {
    id: 4,
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
    variants: [
      { id: 11, size: "160×200", price: 13990 },
      { id: 12, size: "180×200", price: 14990 },
      { id: 13, size: "200×200", price: 15990 },
    ],
  },
  {
    id: 5,
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
    variants: [
      { id: 14, size: "90×200", price: 5490 },
      { id: 15, size: "140×200", price: 6990 },
      { id: 16, size: "160×200", price: 7490 },
    ],
  },
  {
    id: 6,
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
    variants: [
      { id: 17, size: "140×200", price: 2490, oldPrice: 3490 },
      { id: 18, size: "160×200", price: 2790, oldPrice: 3790 },
      { id: 19, size: "180×200", price: 2990, oldPrice: 3990 },
    ],
  },
  {
    id: 7,
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
    variants: [
      { id: 20, size: "80×190", price: 4490 },
      { id: 21, size: "90×200", price: 4990 },
    ],
  },
  {
    id: 8,
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
    variants: [
      { id: 22, size: "160×200", price: 16990, oldPrice: 20990 },
      { id: 23, size: "180×200", price: 17990, oldPrice: 21990 },
      { id: 24, size: "200×200", price: 18990, oldPrice: 22990 },
    ],
  },
  {
    id: 9,
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
    variants: [
      { id: 25, size: "140×200", price: 7990 },
      { id: 26, size: "160×200", price: 8990 },
      { id: 27, size: "180×200", price: 9990 },
    ],
  },
  {
    id: 10,
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
    variants: [
      { id: 28, size: "60×120", price: 4490 },
      { id: 29, size: "70×140", price: 4990 },
    ],
  },
  {
    id: 11,
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
    variants: [
      { id: 30, size: "160×200", price: 12990, oldPrice: 15990 },
      { id: 31, size: "180×200", price: 13990, oldPrice: 16990 },
      { id: 32, size: "200×200", price: 14990, oldPrice: 17990 },
    ],
  },
  {
    id: 12,
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
    variants: [
      { id: 33, size: "140×200", price: 1790 },
      { id: 34, size: "160×200", price: 1990 },
      { id: 35, size: "180×200", price: 2190 },
    ],
  },
  {
    id: 13,
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
    variants: [
      { id: 36, size: "140×200", price: 10990, oldPrice: 13990 },
      { id: 37, size: "160×200", price: 11990, oldPrice: 14990 },
      { id: 38, size: "180×200", price: 12990, oldPrice: 15990 },
    ],
  },
  {
    id: 14,
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
    variants: [
      { id: 39, size: "160×200", price: 15990 },
      { id: 40, size: "180×200", price: 16990 },
      { id: 41, size: "200×200", price: 17990 },
    ],
  },
  {
    id: 15,
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
    variants: [
      { id: 42, size: "140×200", price: 14990 },
      { id: 43, size: "160×200", price: 15990 },
      { id: 44, size: "180×200", price: 16990 },
    ],
  },
  {
    id: 16,
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
    variants: [
      { id: 45, size: "80×190", price: 5990, oldPrice: 7490 },
      { id: 46, size: "90×200", price: 6490, oldPrice: 7990 },
    ],
  },
  {
    id: 17,
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
    variants: [
      { id: 47, size: "180×200", price: 18990 },
      { id: 48, size: "200×200", price: 19990 },
    ],
  },
  {
    id: 18,
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
    variants: [
      { id: 49, size: "90×200", price: 4490 },
      { id: 50, size: "140×200", price: 5490 },
      { id: 51, size: "160×200", price: 5990 },
    ],
  },
  {
    id: 19,
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
    variants: [
      { id: 52, size: "160×200", price: 3190, oldPrice: 4190 },
      { id: 53, size: "180×200", price: 3490, oldPrice: 4490 },
      { id: 54, size: "200×200", price: 3790, oldPrice: 4790 },
    ],
  },
  {
    id: 20,
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
    variants: [
      { id: 55, size: "80×190", price: 3990 },
      { id: 56, size: "90×200", price: 4290 },
    ],
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

export const fetchProducts = async (params) => {
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

export default fetchProducts;
