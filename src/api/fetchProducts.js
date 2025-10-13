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
    size: "160х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 120,
    inStock: true,
    isNew: false,
    discount: 20,
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
    size: "180х200",
    blockType: "Безпружинний",
    fillers: ["Латексована піна", "Кокосове полотно"],
    cover: "Незнімний",
    maxWeight: 140,
    inStock: true,
    isNew: true,
    discount: 0,
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
    size: "70х160",
    blockType: "Безпружинний",
    fillers: ["Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 60,
    inStock: true,
    isNew: false,
    discount: 21,
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
    size: "200х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю", "Латекс"],
    cover: "Знімний",
    maxWeight: 150,
    inStock: true,
    isNew: true,
    discount: 0,
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
    size: "140х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латексована піна"],
    cover: "Незнімний",
    maxWeight: 110,
    inStock: true,
    isNew: false,
    discount: 0,
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
    size: "180х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 120,
    inStock: false,
    isNew: false,
    discount: 25,
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
    size: "90х200",
    blockType: "Безпружинний",
    fillers: ["Латексована піна"],
    cover: "Незнімний",
    maxWeight: 90,
    inStock: true,
    isNew: true,
    discount: 0,
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
    size: "200х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 160,
    inStock: true,
    isNew: false,
    discount: 17,
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
    size: "160х200",
    blockType: "Безпружинний",
    fillers: ["Кокосове полотно", "Латекс"],
    cover: "Знімний",
    maxWeight: 130,
    inStock: true,
    isNew: false,
    discount: 0,
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
    size: "60х120",
    blockType: "Безпружинний",
    fillers: ["Кокосове полотно"],
    cover: "Знімний",
    maxWeight: 50,
    inStock: true,
    isNew: true,
    discount: 0,
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
    size: "180х200",
    blockType: "Незалежний пружинний блок",
    fillers: ["Латекс", "Піна з пам'яттю"],
    cover: "Знімний",
    maxWeight: 140,
    inStock: true,
    isNew: false,
    discount: 18,
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
    size: "160х200",
    blockType: "Безпружинний",
    fillers: ["Піна з пам'яттю"],
    cover: "Незнімний",
    maxWeight: 100,
    inStock: true,
    isNew: false,
    discount: 0,
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
