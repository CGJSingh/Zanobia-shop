// Sample product data with local images
// This can be used for testing or as fallback when API is not available

export const sampleProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: "199.99",
    regular_price: "249.99",
    sale_price: "199.99",
    localImage: "products/headphones-1.jpg",
    images: [
      { src: "/images/products/headphones-1.jpg" },
      { src: "/images/products/headphones-2.jpg" },
      { src: "/images/products/headphones-3.jpg" }
    ],
    short_description: "High-quality wireless headphones with noise cancellation",
    description: "Experience premium sound quality with these wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    categories: [
      { id: 1, name: "Electronics" },
      { id: 2, name: "Audio" }
    ],
    slug: "premium-wireless-headphones"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: "299.99",
    regular_price: "299.99",
    localImage: "products/smartwatch-1.jpg",
    images: [
      { src: "/images/products/smartwatch-1.jpg" },
      { src: "/images/products/smartwatch-2.jpg" }
    ],
    short_description: "Track your fitness goals with this advanced smartwatch",
    description: "Monitor your health and fitness with this feature-rich smartwatch. Includes heart rate monitoring, GPS tracking, and water resistance up to 50 meters.",
    categories: [
      { id: 1, name: "Electronics" },
      { id: 3, name: "Fitness" }
    ],
    slug: "smart-fitness-watch"
  },
  {
    id: 3,
    name: "Professional Laptop",
    price: "1299.99",
    regular_price: "1499.99",
    sale_price: "1299.99",
    localImage: "products/laptop-1.jpg",
    images: [
      { src: "/images/products/laptop-1.jpg" },
      { src: "/images/products/laptop-2.jpg" },
      { src: "/images/products/laptop-3.jpg" }
    ],
    short_description: "High-performance laptop for professionals",
    description: "Powerful laptop with latest processor, 16GB RAM, and 512GB SSD. Perfect for work, gaming, and creative projects.",
    categories: [
      { id: 1, name: "Electronics" },
      { id: 4, name: "Computers" }
    ],
    slug: "professional-laptop"
  },
  {
    id: 4,
    name: "Wireless Bluetooth Speaker",
    price: "89.99",
    regular_price: "89.99",
    localImage: "products/speaker-1.jpg",
    images: [
      { src: "/images/products/speaker-1.jpg" },
      { src: "/images/products/speaker-2.jpg" }
    ],
    short_description: "Portable speaker with excellent sound quality",
    description: "Take your music anywhere with this compact wireless speaker. Features 12-hour battery life and waterproof design.",
    categories: [
      { id: 1, name: "Electronics" },
      { id: 2, name: "Audio" }
    ],
    slug: "wireless-bluetooth-speaker"
  },
  {
    id: 5,
    name: "Gaming Mechanical Keyboard",
    price: "149.99",
    regular_price: "149.99",
    localImage: "products/keyboard-1.jpg",
    images: [
      { src: "/images/products/keyboard-1.jpg" },
      { src: "/images/products/keyboard-2.jpg" }
    ],
    short_description: "RGB mechanical keyboard for gamers",
    description: "Enhance your gaming experience with this mechanical keyboard featuring RGB lighting, tactile switches, and programmable keys.",
    categories: [
      { id: 1, name: "Electronics" },
      { id: 5, name: "Gaming" }
    ],
    slug: "gaming-mechanical-keyboard"
  },
  {
    id: 6,
    name: "4K Ultra HD Monitor",
    price: "399.99",
    regular_price: "499.99",
    sale_price: "399.99",
    localImage: "products/monitor-1.jpg",
    images: [
      { src: "/images/products/monitor-1.jpg" },
      { src: "/images/products/monitor-2.jpg" }
    ],
    short_description: "27-inch 4K monitor for professional use",
    description: "Crystal-clear 4K display with HDR support. Perfect for graphic design, video editing, and gaming.",
    categories: [
      { id: 1, name: "Electronics" },
      { id: 4, name: "Computers" }
    ],
    slug: "4k-ultra-hd-monitor"
  }
];

export const sampleCategories = [
  { id: 1, name: "Electronics", slug: "electronics" },
  { id: 2, name: "Audio", slug: "audio" },
  { id: 3, name: "Fitness", slug: "fitness" },
  { id: 4, name: "Computers", slug: "computers" },
  { id: 5, name: "Gaming", slug: "gaming" }
];
