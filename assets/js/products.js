// Mock Product Database for Pal Grocery

const PRODUCTS = [
  {
    id: "prod-1",
    name: "Organic Shimla Apples",
    category: "essentials",
    price: 180,
    discountPrice: 149,
    rating: 4.8,
    reviewsCount: 142,
    stock: 45,
    expiryDate: "2026-07-15",
    supplier: "Himalayan Farms",
    barcode: "8901020304011",
    description: "Crisp, sweet and hand-picked fresh organic apples direct from the orchards of Shimla. Rich in antioxidants and dietary fiber."
  },
  {
    id: "prod-2",
    name: "Fresh Cavendish Bananas",
    category: "essentials",
    price: 60,
    discountPrice: 49,
    rating: 4.5,
    reviewsCount: 98,
    stock: 8, // Low stock for testing alerts
    expiryDate: "2026-06-30", // Near expiry
    supplier: "Maha Fruits Ltd",
    barcode: "8901020304028",
    description: "Naturally ripened premium Cavendish bananas, high in potassium and energy. Perfect as a quick workout snack."
  },
  {
    id: "prod-3",
    name: "Amul Premium Butter (500g)",
    category: "essentials",
    price: 275,
    discountPrice: null,
    rating: 4.9,
    reviewsCount: 420,
    stock: 30,
    expiryDate: "2026-09-10",
    supplier: "Amul India Corp",
    barcode: "8901262010015",
    description: "The classic Utterly Butterly Delicious salted butter. Spread it on toast, melt it over paranthas, or use it in baking."
  },
  {
    id: "prod-4",
    name: "Mother Dairy Full Cream Milk (1L)",
    category: "essentials",
    price: 66,
    discountPrice: 64,
    rating: 4.7,
    reviewsCount: 310,
    stock: 65,
    expiryDate: "2026-06-27", // Expiring tomorrow (for testing warnings)
    supplier: "Mother Dairy Delhi",
    barcode: "8901020304042",
    description: "Pasteurized, homogenized full cream milk with 6% fat. Excellent for making paneer, curd, tea, coffee, and desserts."
  },
  {
    id: "prod-5",
    name: "Organic Country Eggs (Pack of 10)",
    category: "essentials",
    price: 110,
    discountPrice: 95,
    rating: 4.6,
    reviewsCount: 88,
    stock: 3, // Very low stock
    expiryDate: "2026-07-04",
    supplier: "Happy Hens Poultry",
    barcode: "8901020304059",
    description: "Free-range, high-protein organic brown eggs packed with nutrition. Collected daily from humanely raised country chickens."
  },
  {
    id: "prod-6",
    name: "Haldiram's Bhujia Sev (350g)",
    category: "snacks",
    price: 110,
    discountPrice: null,
    rating: 4.8,
    reviewsCount: 512,
    stock: 120,
    expiryDate: "2026-11-20",
    supplier: "Haldiram Foods",
    barcode: "8904063200057",
    description: "A crispy, crunchy moth pulse flour fried noodle snack spiced with red chillies, black pepper, and dry ginger."
  },
  {
    id: "prod-7",
    name: "Lays India's Magic Masala (115g)",
    category: "snacks",
    price: 50,
    discountPrice: 45,
    rating: 4.4,
    reviewsCount: 280,
    stock: 90,
    expiryDate: "2026-10-05",
    supplier: "Pepsico India",
    barcode: "8902083002131",
    description: "Crispy potato chips seasoned with a proprietary blend of aromatic Indian spices. The ultimate tea-time companion."
  },
  {
    id: "prod-8",
    name: "Daawat Rozana Basmati Rice (5kg)",
    category: "groceries",
    price: 499,
    discountPrice: 389,
    rating: 4.5,
    reviewsCount: 195,
    stock: 22,
    expiryDate: "2027-04-12",
    supplier: "Daawat Foods",
    barcode: "8901537006023",
    description: "Rich aroma, pristine white long grains. Ideal for everyday dishes like steam rice, jeera rice, and khichdi."
  },
  {
    id: "prod-9",
    name: "Fortune Kachi Ghani Mustard Oil (1L)",
    category: "groceries",
    price: 185,
    discountPrice: 165,
    rating: 4.7,
    reviewsCount: 154,
    stock: 40,
    expiryDate: "2026-12-15",
    supplier: "Adani Wilmar",
    barcode: "8906007281313",
    description: "Cold-pressed from premium mustard seeds. Retains natural aroma, pungency and essential nutrients for authentic Indian cooking."
  },
  {
    id: "prod-10",
    name: "Tata Salt Iodized (1kg)",
    category: "essentials",
    price: 28,
    discountPrice: null,
    rating: 4.9,
    reviewsCount: 890,
    stock: 150,
    expiryDate: "2028-01-01",
    supplier: "Tata Consumer Products",
    barcode: "8901058002315",
    description: "Desh ka namak. Vacuum evaporated, iodized salt that guarantees purity and standardized iodine content for family health."
  },
  {
    id: "prod-11",
    name: "Coca Cola Classic (750ml)",
    category: "cold_drink",
    price: 45,
    discountPrice: 40,
    rating: 4.6,
    reviewsCount: 340,
    stock: 80,
    expiryDate: "2026-09-01",
    supplier: "Coca Cola Bottling",
    barcode: "8901764032222",
    description: "The world's favorite sparkling carbonated soft drink. Crisp, refreshing taste served chilled with meals."
  },
  {
    id: "prod-12",
    name: "Nescafe Classic Coffee (100g)",
    category: "cold_drink",
    price: 320,
    discountPrice: 299,
    rating: 4.7,
    reviewsCount: 220,
    stock: 15,
    expiryDate: "2027-02-28",
    supplier: "Nestle India",
    barcode: "8901058860601",
    description: "100% pure instant coffee granules. Signature bold aroma and rich taste derived from carefully roasted Robusta beans."
  },
  {
    id: "prod-13",
    name: "Aashirvaad Shudh Chakki Atta (10kg)",
    category: "essentials",
    price: 460,
    discountPrice: 440,
    rating: 4.8,
    reviewsCount: 654,
    stock: 18,
    expiryDate: "2026-08-30",
    supplier: "ITC Limited",
    barcode: "8901725181228",
    description: "100% stone-ground whole wheat flour. Contains zero maida, ensuring soft, fluffy, and nutritious rotis for days."
  },
  {
    id: "prod-14",
    name: "Cadbury Dairy Milk Silk (150g)",
    category: "snacks",
    price: 175,
    discountPrice: 150,
    rating: 4.9,
    reviewsCount: 390,
    stock: 35,
    expiryDate: "2026-06-25", // Expired yesterday (for testing expiry warning)
    supplier: "Mondelez India",
    barcode: "7622210817028",
    description: "Rich, smooth and creamy chocolate bar that melts in your mouth for an indulgent chocolate experience."
  },
  {
    id: "prod-15",
    name: "Real Fruit Power Mixed Fruit Juice (1L)",
    category: "cold_drink",
    price: 130,
    discountPrice: 115,
    rating: 4.5,
    reviewsCount: 180,
    stock: 50,
    expiryDate: "2026-10-18",
    supplier: "Dabur India",
    barcode: "8901207010490",
    description: "Rich blend of 9 delicious fruits (orange, apple, guava, pineapple, mango, banana, apricot, peach, passion fruit)."
  },
  {
    id: "lassi-mango",
    name: "Shahi Mango Lassi",
    category: "lassi",
    price: 60,
    discountPrice: 49,
    rating: 4.8,
    reviewsCount: 120,
    stock: 25,
    expiryDate: "2026-07-02",
    supplier: "Pal Dairy Solutions",
    barcode: "8901020305018",
    description: "Thick, creamy, traditional sweet lassi blended with fresh mango pulp and topped with nuts."
  },
  {
    id: "lassi-kesar",
    name: "Royal Kesar Pista Lassi",
    category: "lassi",
    price: 80,
    discountPrice: 69,
    rating: 4.9,
    reviewsCount: 154,
    stock: 15,
    expiryDate: "2026-07-02",
    supplier: "Pal Dairy Solutions",
    barcode: "8901020305025",
    description: "Rich saffron flavored sweet lassi with real pistachios and premium almonds."
  },
  {
    id: "lassi-rose",
    name: "Rose Gulab Lassi",
    category: "lassi",
    price: 70,
    discountPrice: null,
    rating: 4.7,
    reviewsCount: 88,
    stock: 20,
    expiryDate: "2026-07-02",
    supplier: "Pal Dairy Solutions",
    barcode: "8901020305032",
    description: "Fragrant pink sweet lassi infused with premium organic rose syrup and petals."
  },
  {
    id: "lassi-mint",
    name: "Spicy Mint Chaas / Salted Lassi",
    category: "lassi",
    price: 40,
    discountPrice: null,
    rating: 4.6,
    reviewsCount: 95,
    stock: 35,
    expiryDate: "2026-07-02",
    supplier: "Pal Dairy Solutions",
    barcode: "8901020305049",
    description: "Refreshing buttermilk blended with fresh mint leaves, roasted cumin, and black salt."
  },
  {
    id: "prod-cold-1",
    name: "Sprite Lime Soft Drink (750ml)",
    category: "cold_drink",
    price: 45,
    discountPrice: 40,
    rating: 4.6,
    reviewsCount: 195,
    stock: 45,
    expiryDate: "2026-10-15",
    supplier: "Coca Cola Bottling",
    barcode: "8901764031111",
    description: "Crisp and clean tasting lemon-lime flavored soft drink that cures your thirst instantly."
  },
  {
    id: "prod-cold-2",
    name: "Thums Up Bold Taste (750ml)",
    category: "cold_drink",
    price: 45,
    discountPrice: null,
    rating: 4.7,
    reviewsCount: 260,
    stock: 55,
    expiryDate: "2026-10-15",
    supplier: "Coca Cola Bottling",
    barcode: "8901764032223",
    description: "Strong carbonated cola with a bold, masculine spicy taste. India's favorite thanda."
  },
  {
    id: "prod-ess-1",
    name: "Britannia Atta Bread (400g)",
    category: "essentials",
    price: 35,
    discountPrice: 32,
    rating: 4.5,
    reviewsCount: 110,
    stock: 15,
    expiryDate: "2026-07-01",
    supplier: "Britannia Industries",
    barcode: "8901063024040",
    description: "Soft and healthy whole wheat brown bread, sliced and baked fresh daily."
  },
  {
    id: "prod-ess-2",
    name: "Premium Harvest Sugar (1kg)",
    category: "essentials",
    price: 55,
    discountPrice: 50,
    rating: 4.6,
    reviewsCount: 305,
    stock: 80,
    expiryDate: "2027-06-01",
    supplier: "Harvest Agro Products",
    barcode: "8901020306015",
    description: "Refined, sulphur-free pure sugar crystals, packed hygienically for daily tea, coffee, and cooking."
  }
];

// Beautiful Minimalist SVG Vector Generator (with uploaded image support)
function getProductSVG(productOrId) {
  if (!productOrId) {
    return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="40" fill="#cbd5e1"/></svg>`;
  }

  let productId = productOrId;
  let image = null;
  let productName = "Product";

  if (typeof productOrId === 'object' && productOrId !== null) {
    productId = productOrId.id;
    image = productOrId.image || productOrId.img || productOrId.imageUrl;
    productName = productOrId.name || "Product";
  } else if (typeof productOrId === 'string') {
    productId = productOrId;
    const found = (window.state && window.state.inventory && window.state.inventory.find(p => p.id === productId))
               || (window.PRODUCTS && window.PRODUCTS.find(p => p.id === productId));
    if (found) {
      image = found.image || found.img || found.imageUrl;
      productName = found.name || "Product";
    }
  }

  if (image) {
    const safeTitle = productName.replace(/"/g, '&quot;');
    return `<img src="${image}" alt="${safeTitle}" class="product-card-img" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null; this.parentElement.innerHTML='<svg viewBox=\\'0 0 100 100\\' width=\\'100%\\' height=\\'100%\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'#f1f5f9\\'/><circle cx=\\'50\\' cy=\\'50\\' r=\\'30\\' fill=\\'#cbd5e1\\'/></svg>';"/>`;
  }

  const svgs = {
    "prod-1": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="apple-grad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#ff6b6b"/>
          <stop offset="70%" stop-color="#ee5253"/>
          <stop offset="100%" stop-color="#b81e1e"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="55" r="30" fill="url(#apple-grad)"/>
      <path d="M50,25 C52,15 62,10 65,18 C65,22 55,24 50,25 Z" fill="#2ed573"/>
      <path d="M50,25 Q46,18 48,12" stroke="#4b2c20" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
    "prod-2": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="banana-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffeaa7"/>
          <stop offset="70%" stop-color="#fdcb6e"/>
          <stop offset="100%" stop-color="#e1b12c"/>
        </linearGradient>
      </defs>
      <path d="M25,20 C42,16 68,28 78,56 C82,68 76,78 72,78 C65,78 60,65 52,50 C44,35 30,28 25,20 Z" fill="url(#banana-grad)"/>
      <path d="M25,20 C24,18 20,12 18,14 Q22,22 25,20" fill="#4b2c20"/>
      <path d="M72,78 Q74,82 76,80 C78,78 74,74 72,78" fill="#57606f"/>
    </svg>`,
    "prod-3": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="butter-grad" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stop-color="#fff9db"/>
          <stop offset="70%" stop-color="#ffd43b"/>
          <stop offset="100%" stop-color="#f59f00"/>
        </linearGradient>
      </defs>
      <rect x="20" y="30" width="60" height="40" rx="4" fill="url(#butter-grad)" stroke="#fab005" stroke-width="2"/>
      <rect x="25" y="35" width="50" height="30" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 2" rx="2"/>
      <text x="50" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="10" fill="#e8590c" text-anchor="middle">BUTTER</text>
    </svg>`,
    "prod-4": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="40" height="50" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M30,30 L40,18 L60,18 L70,30 Z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="45" y="12" width="10" height="6" fill="#1e3a8a" rx="1"/>
      <rect x="30" y="44" width="40" height="15" fill="#3b82f6"/>
      <text x="50" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="9" fill="#ffffff" text-anchor="middle">MILK</text>
    </svg>`,
    "prod-5": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="25" width="70" height="50" rx="8" fill="#d7ccc8" stroke="#8d6e63" stroke-width="2"/>
      <ellipse cx="35" cy="45" rx="10" ry="14" fill="#fff" stroke="#cfd8dc" stroke-width="1"/>
      <ellipse cx="50" cy="53" rx="10" ry="14" fill="#fff" stroke="#cfd8dc" stroke-width="1"/>
      <ellipse cx="65" cy="45" rx="10" ry="14" fill="#fff" stroke="#cfd8dc" stroke-width="1"/>
      <text x="50" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8" fill="#5d4037" text-anchor="middle">EGGS</text>
    </svg>`,
    "prod-6": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="20" width="50" height="60" rx="6" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
      <rect x="30" y="32" width="40" height="24" fill="#dc2626"/>
      <text x="50" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="7" fill="#ffffff" text-anchor="middle">BHUJIA</text>
      <text x="50" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="5" fill="#fef08a" text-anchor="middle">SEV</text>
      <circle cx="50" cy="68" r="8" fill="#eab308"/>
    </svg>`,
    "prod-7": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="20" width="50" height="60" rx="6" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
      <ellipse cx="50" cy="50" rx="18" ry="12" fill="#fbbf24"/>
      <text x="50" y="53" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8" fill="#dc2626" text-anchor="middle">Lays</text>
      <path d="M25,20 L35,28 L45,20 L55,28 L65,20 L75,28" stroke="#1d4ed8" stroke-width="2" fill="none"/>
    </svg>`,
    "prod-8": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M25,25 L75,25 L70,80 L30,80 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <path d="M25,25 Q50,15 75,25" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <rect x="35" y="38" width="30" height="20" fill="#047857" rx="2"/>
      <text x="50" y="50" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="8" fill="#ffffff" text-anchor="middle">RICE</text>
      <path d="M38,70 L42,65 L46,70 M54,72 L58,67 L62,72" stroke="#94a3b8" stroke-width="2" fill="none"/>
    </svg>`,
    "prod-9": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="25" width="30" height="55" rx="8" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
      <rect x="42" y="15" width="16" height="10" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
      <line x1="35" y1="40" x2="65" y2="40" stroke="#d97706" stroke-width="2"/>
      <text x="50" y="54" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8" fill="#78350f" text-anchor="middle">MUSTARD</text>
      <text x="50" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8" fill="#78350f" text-anchor="middle">OIL</text>
    </svg>`,
    "prod-10": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M30,30 L70,30 L65,75 L35,75 Z" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
      <path d="M30,30 C30,30 50,22 70,30 L65,75" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <rect x="30" y="45" width="40" height="16" fill="#3b82f6"/>
      <text x="50" y="56" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="9" fill="#ffffff" text-anchor="middle">SALT</text>
    </svg>`,
    "prod-11": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="36" y="24" width="28" height="56" rx="6" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
      <rect x="42" y="14" width="16" height="10" fill="#f3f4f6" stroke="#94a3b8" stroke-width="2"/>
      <path d="M36,44 Q50,54 64,44" stroke="#ffffff" stroke-width="4" fill="none"/>
      <text x="50" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="7" fill="#ffffff" text-anchor="middle">Cola</text>
    </svg>`,
    "prod-12": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="34" y="28" width="32" height="52" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2"/>
      <rect x="40" y="16" width="20" height="12" fill="#1e293b" rx="2"/>
      <rect x="34" y="42" width="32" height="20" fill="#fef3c7"/>
      <text x="50" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8" fill="#78350f" text-anchor="middle">NESCAFE</text>
    </svg>`,
    "prod-13": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M22,30 L78,30 L72,85 L28,85 Z" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
      <ellipse cx="50" cy="52" rx="16" ry="16" fill="#ea580c"/>
      <text x="50" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8" fill="#ffffff" text-anchor="middle">ATTA</text>
      <text x="50" y="74" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="6" fill="#7c2d12" text-anchor="middle">AASHIRVAAD</text>
    </svg>`,
    "prod-14": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="25" width="60" height="50" rx="4" fill="#6b21a8" stroke="#4c1d95" stroke-width="2"/>
      <path d="M20,40 Q50,20 80,40" fill="#a855f7" opacity="0.3"/>
      <text x="50" y="50" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="9" fill="#fcd34d" text-anchor="middle">SILK</text>
      <rect x="35" y="56" width="30" height="10" fill="#451a03" rx="1"/>
    </svg>`,
    "prod-15": `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="32" y="24" width="36" height="56" rx="4" fill="#ea580c" stroke="#c2410c" stroke-width="2"/>
      <path d="M32,24 L42,12 L58,12 L68,24 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="50" cy="48" r="10" fill="#fbbf24"/>
      <text x="50" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="8" fill="#ffffff" text-anchor="middle">JUICE</text>
    </svg>`
  };
  
  if (productId.startsWith("lassi")) {
    return `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kulhad-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a76b43"/>
          <stop offset="50%" stop-color="#854d27"/>
          <stop offset="100%" stop-color="#5c3114"/>
        </linearGradient>
      </defs>
      <!-- Clay Kulhad cup -->
      <path d="M 30 20 L 36 82 C 37 88, 63 88, 64 82 L 70 20 Z" fill="url(#kulhad-g)" stroke="#5c3114" stroke-width="1.5"/>
      <line x1="32" y1="36" x2="68" y2="36" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <line x1="34" y1="52" x2="66" y2="52" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
      <line x1="35" y1="68" x2="65" y2="68" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
      <!-- Lassi Froth Top -->
      <ellipse cx="50" cy="20" rx="19" ry="7" fill="#fffdf5" stroke="#f1f5f9" stroke-width="0.5"/>
      <circle cx="45" cy="20" r="3" fill="#f59e0b" opacity="0.8"/>
      <circle cx="53" cy="18" r="2.5" fill="#10b981" opacity="0.8"/>
      <circle cx="49" cy="22" r="2.2" fill="#ef4444" opacity="0.8"/>
    </svg>`;
  }
  
  return svgs[productId] || `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="40" fill="#cbd5e1"/></svg>`;
}

// Global Exports
window.PRODUCTS = PRODUCTS;
window.getProductSVG = getProductSVG;
