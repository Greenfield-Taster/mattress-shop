import { STORE_INFO } from "./storeInfo";

export const SITE_NAME = "Just Sleep";
export const BASE_URL = (import.meta.env.VITE_SITE_URL || "https://just-sleep.com.ua").replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
export const DEFAULT_DESCRIPTION = "Інтернет-магазин ортопедичних матраців Just Sleep. Пружинні, безпружинні та дитячі матраци від виробника з доставкою по Україні.";

export const PAGE_SEO = {
  home: {
    title: "Ортопедичні матраци у Києві",
    description: "Інтернет-магазин ортопедичних матраців Just Sleep. Пружинні, безпружинні та дитячі матраци від виробника з доставкою по Україні.",
    path: "/",
  },
  catalog: {
    title: "Каталог матраців",
    description: "Каталог ортопедичних матраців Just Sleep. Пружинні, безпружинні, дитячі матраци різних розмірів та жорсткості. Фільтри, сортування, зручний підбір.",
    path: "/catalog",
  },
  contacts: {
    title: "Контакти",
    description: "Контакти інтернет-магазину Just Sleep. Адреса, телефон, email, графік роботи. Зв'яжіться з нами для консультації з підбору матрацу.",
    path: "/contacts",
  },
  wishlist: {
    title: "Обране",
    description: "Список обраних товарів",
    path: "/wishlist",
    noindex: true,
  },
  profile: {
    title: "Профіль",
    description: "Особистий кабінет",
    path: "/profile",
    noindex: true,
  },
  checkout: {
    title: "Оформлення замовлення",
    description: "Оформлення замовлення в інтернет-магазині Just Sleep",
    path: "/checkout",
    noindex: true,
  },
  orderSuccess: {
    title: "Замовлення оформлено",
    description: "Замовлення успішно оформлено",
    path: "/order-success",
    noindex: true,
  },
  trackOrder: {
    title: "Відстеження замовлення",
    description: "Перевірте статус вашого замовлення в інтернет-магазині Just Sleep за номером замовлення.",
    path: "/track-order",
  },
  notFound: {
    title: "Сторінку не знайдено",
    description: "Сторінку не знайдено",
    path: "/404",
    noindex: true,
  },
};

// --- JSON-LD Builders ---

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/heero-cat.png`,
    description: "Інтернет-магазин ортопедичних матраців з доставкою по Україні",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: STORE_INFO.phones[0],
      contactType: "customer service",
      availableLanguage: "Ukrainian",
    },
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/heero-cat.png`,
    image: DEFAULT_OG_IMAGE,
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Київ",
      addressCountry: "UA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.4501,
      longitude: 30.5234,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "16:00",
      },
    ],
    paymentAccepted: "Готівка, Грошовий переказ, Післяплата",
    currenciesAccepted: "UAH",
    priceRange: "₴₴",
    areaServed: {
      "@type": "Country",
      name: "UA",
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "Джаст Сліп",
    url: BASE_URL,
  };
}

export function buildProductJsonLd(product) {
  const image = product.images?.[0] || DEFAULT_OG_IMAGE;
  const price = product.minPrice || product.price;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Ортопедичний матрац ${product.name} від Just Sleep`,
    image,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "UAH",
      lowPrice: price,
      highPrice: product.maxPrice || price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
      },
    }),
  };
}

export function buildBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url ? `${BASE_URL}${item.url}` : undefined,
    })),
  };
}

export function buildFAQJsonLd(faqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.plainText || item.question,
      },
    })),
  };
}
