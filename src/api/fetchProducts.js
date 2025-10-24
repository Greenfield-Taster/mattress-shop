// 🔄 ВАЖЛИВО: Коли підключатимеш реальний сервер:
// 1. Замінити mockProducts на axios.get('/api/products', { params })
// 2. Обробити response.data замість локальних даних
// 3. Додати обробку помилок (try/catch)

import springMattress from "../assets/images/spring.png";

// Тимчасові mock-дані для розробки
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
    images: [springMattress, springMattress, springMattress, springMattress, springMattress, springMattress],
    size: "160х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 120,
    inStock: true,
    isNew: false,
    discount: 20,
    variants: [
      { id: 1, size: "140×200", price: 6990, oldPrice: 8990, inStock: true },
      { id: 2, size: "160×200", price: 7990, oldPrice: 9990, inStock: true },
      { id: 3, size: "180×200", price: 8990, oldPrice: 10990, inStock: true },
      { id: 4, size: "200×200", price: 9990, oldPrice: 11990, inStock: false },
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
      { id: 5, size: "160×200", price: 11500, inStock: true },
      { id: 6, size: "180×200", price: 12500, inStock: true },
      { id: 7, size: "200×200", price: 13500, inStock: true },
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
      { id: 8, size: "60×120", price: 4490, oldPrice: 5490, inStock: true },
      { id: 9, size: "70×140", price: 4990, oldPrice: 5990, inStock: true },
      { id: 10, size: "70×160", price: 5490, oldPrice: 6990, inStock: true },
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
    images: [springMattress, springMattress, springMattress, springMattress, springMattress],
    size: "200х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю", "Латекс"],
    cover: "Знімний",
    maxWeight: 150,
    inStock: true,
    isNew: true,
    discount: 0,
    variants: [
      { id: 11, size: "160×200", price: 13990, inStock: true },
      { id: 12, size: "180×200", price: 14990, inStock: true },
      { id: 13, size: "200×200", price: 15990, inStock: true },
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
      { id: 14, size: "90×200", price: 5490, inStock: true },
      { id: 15, size: "140×200", price: 6990, inStock: true },
      { id: 16, size: "160×200", price: 7490, inStock: true },
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
    inStock: false,
    isNew: false,
    discount: 25,
    variants: [
      { id: 17, size: "140×200", price: 2490, oldPrice: 3490, inStock: false },
      { id: 18, size: "160×200", price: 2790, oldPrice: 3790, inStock: false },
      { id: 19, size: "180×200", price: 2990, oldPrice: 3990, inStock: false },
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
      { id: 20, size: "80×190", price: 4490, inStock: true },
      { id: 21, size: "90×200", price: 4990, inStock: true },
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
    images: [springMattress, springMattress, springMattress, springMattress, springMattress, springMattress, springMattress],
    size: "200х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 160,
    inStock: true,
    isNew: false,
    discount: 17,
    variants: [
      { id: 22, size: "160×200", price: 16990, oldPrice: 20990, inStock: true },
      { id: 23, size: "180×200", price: 17990, oldPrice: 21990, inStock: true },
      { id: 24, size: "200×200", price: 18990, oldPrice: 22990, inStock: true },
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
      { id: 25, size: "140×200", price: 7990, inStock: true },
      { id: 26, size: "160×200", price: 8990, inStock: true },
      { id: 27, size: "180×200", price: 9990, inStock: true },
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
      { id: 28, size: "60×120", price: 4490, inStock: true },
      { id: 29, size: "70×140", price: 4990, inStock: true },
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
    images: [springMattress, springMattress, springMattress, springMattress, springMattress],
    size: "180х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 140,
    inStock: true,
    isNew: false,
    discount: 18,
    variants: [
      { id: 30, size: "160×200", price: 12990, oldPrice: 15990, inStock: true },
      { id: 31, size: "180×200", price: 13990, oldPrice: 16990, inStock: true },
      { id: 32, size: "200×200", price: 14990, oldPrice: 17990, inStock: true },
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
      { id: 33, size: "140×200", price: 1790, inStock: true },
      { id: 34, size: "160×200", price: 1990, inStock: true },
      { id: 35, size: "180×200", price: 2190, inStock: true },
    ],
  },
];

const filterProducts = (products, params) => {
  return products.filter(product => {
    if (params.types?.length > 0 && !params.types.includes(product.type)) {
      return false;
    }
    if (params.sizes?.length > 0 && !params.sizes.includes(product.size)) {
      return false;
    }
    if (params.height) {
      const [min, max] = params.height.split('-').map(Number);
      if (product.height < min || product.height > max) return false;
    }
    if (params.blockTypes?.length > 0 && !params.blockTypes.includes(product.blockType)) {
      return false;
    }
    if (params.fillers?.length > 0) {
      const hasAnyFiller = params.fillers.some(filler => 
        product.fillers.includes(filler)
      );
      if (!hasAnyFiller) return false;
    }
    if (params.covers?.length > 0 && !params.covers.includes(product.cover)) {
      return false;
    }
    if (params.maxWeight) {
      const maxWeightValue = parseInt(params.maxWeight.replace('<=', ''));
      if (product.maxWeight > maxWeightValue) return false;
    }
    if (params.price) {
      const [min, max] = params.price.split('-').map(Number);
      if (product.price < min || product.price > max) return false;
    }
    return true;
  });
};

const sortProducts = (products, sortParam) => {
  if (!sortParam || sortParam === 'default') return products;
  const sorted = [...products];
  switch (sortParam) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'popular':
      return sorted;
    case 'new':
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case 'discount':
      return sorted.sort((a, b) => b.discount - a.discount);
    default:
      return sorted;
  }
};

export const fetchProducts = async (params) => {
  await new Promise(resolve => setTimeout(resolve, 300));
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
