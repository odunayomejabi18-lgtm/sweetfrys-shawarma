import { FoodItem, DeliveryZone, DeliveryAgent, PromoCode, Review, Order } from '../types';

export const INITIAL_MENU_ITEMS: FoodItem[] = [
  {
    id: 'shw-01',
    name: 'Special Chicken Shawarma',
    category: 'Shawarma',
    price: 5500,
    description: 'Grilled double chicken, juicy sausages, fresh cabbage, creamy signature sauce and spicy suya pepper wrapped in toasted flatbread.',
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prepTimeMinutes: 15,
    available: true,
    isPopular: true,
    isBestSeller: true,
    supportedProteins: ['chicken', 'beef', 'mixed'],
    supportedSizes: [
      { size: 'regular', label: 'Regular (1 Sausage)', priceAdd: 0 },
      { size: 'large', label: 'Large (2 Sausages + Extra Meat)', priceAdd: 1500 },
      { size: 'extra_large', label: 'Jumbo XXL (Double Wrap)', priceAdd: 3000 },
    ],
    supportedAddOns: [
      { id: 'add-cheese', name: 'Melted Mozzarella Cheese', price: 1000 },
      { id: 'add-sausage', name: 'Extra Sausage', price: 800 },
      { id: 'add-chicken', name: 'Extra Grilled Chicken', price: 1500 },
      { id: 'add-egg', name: 'Boiled Egg Slice', price: 500 },
      { id: 'add-fries', name: 'Fries inside Shawarma', price: 1000 },
    ]
  },
  {
    id: 'shw-02',
    name: 'Jumbo Beef & Sausage Shawarma',
    category: 'Shawarma',
    price: 6000,
    description: 'Slow-grilled spiced beef strips, double franks, crunchy cabbage mix, secret garlic sauce & hot suya pepper.',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prepTimeMinutes: 15,
    available: true,
    isBestSeller: true,
    supportedProteins: ['beef', 'mixed'],
    supportedSizes: [
      { size: 'regular', label: 'Regular', priceAdd: 0 },
      { size: 'large', label: 'Large', priceAdd: 1500 },
      { size: 'extra_large', label: 'Monster XL', priceAdd: 3200 },
    ],
    supportedAddOns: [
      { id: 'add-cheese', name: 'Melted Cheese', price: 1000 },
      { id: 'add-beef', name: 'Extra Spiced Beef', price: 1800 },
      { id: 'add-sauce', name: 'Extra Garlic Mayo Sauce', price: 500 },
    ]
  },
  {
    id: 'shw-03',
    name: 'Cheesy Mixed Suya Shawarma',
    category: 'Shawarma',
    price: 6800,
    description: 'Combination of tender grilled chicken breast & suya beef loaded with gooey mozzarella, sweet corn & hot pepper.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    prepTimeMinutes: 18,
    available: true,
    isPopular: true,
    supportedProteins: ['mixed'],
    supportedSizes: [
      { size: 'regular', label: 'Regular', priceAdd: 0 },
      { size: 'large', label: 'Large Feast', priceAdd: 1800 },
    ],
    supportedAddOns: [
      { id: 'add-cheese', name: 'Double Cheese', price: 1200 },
      { id: 'add-sausage', name: 'Extra Sausage', price: 800 },
    ]
  },
  {
    id: 'grill-01',
    name: 'Flame-Grilled Quarter Chicken & Chips',
    category: 'Grills',
    price: 7500,
    description: 'Juicy 1/4 chicken marinated in Nigerian peppers & spices, charcoal grilled and served with crispy spicy potato fries & coleslaw.',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prepTimeMinutes: 25,
    available: true,
    isPopular: true,
    supportedSizes: [
      { size: 'regular', label: 'Quarter Chicken + Fries', priceAdd: 0 },
      { size: 'large', label: 'Half Chicken + Extra Fries', priceAdd: 3500 },
    ],
    supportedAddOns: [
      { id: 'add-plantain', name: 'Fried Sweet Plantain (Dodo)', price: 1200 },
      { id: 'add-sauce', name: 'Extra BBQ Pepper Sauce', price: 600 },
    ]
  },
  {
    id: 'grill-02',
    name: 'Whole Spicy Grilled Catfish',
    category: 'Fish',
    price: 14500,
    description: 'Fresh whole catfish slow-grilled over charcoal embers with rich spicy scotch bonnet pepper glaze, served with yam chips or fried plantain.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prepTimeMinutes: 35,
    available: true,
    isBestSeller: true,
    supportedAddOns: [
      { id: 'add-yam', name: 'Extra Fried Yam', price: 1500 },
      { id: 'add-plantain', name: 'Fried Plantain (Dodo)', price: 1200 },
      { id: 'add-coleslaw', name: 'Creamy Coleslaw', price: 800 },
    ]
  },
  {
    id: 'suya-01',
    name: 'Special Beef Suya Platter',
    category: 'Suya',
    price: 8000,
    description: 'Premium cut beef marinated in original Hausa Yaji suya spice, grilled over red hot coal, served with fresh onions, cucumber & tomatoes.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prepTimeMinutes: 20,
    available: true,
    isPopular: true,
    supportedAddOns: [
      { id: 'add-extra-yaji', name: 'Extra Yaji Pepper Dip', price: 500 },
      { id: 'add-masa', name: 'Fried Rice Cake (Masa - 2pcs)', price: 1000 },
    ]
  },
  {
    id: 'suya-02',
    name: 'Spicy Goat Meat Asun',
    category: 'Suya',
    price: 9500,
    description: 'Tender bite-sized grilled goat meat sautéed with scotch bonnet peppers, bell peppers and caramelized onions.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prepTimeMinutes: 25,
    available: true,
    supportedAddOns: [
      { id: 'add-plantain', name: 'Fried Plantain', price: 1200 },
    ]
  },
  {
    id: 'burger-01',
    name: 'Lagos Double Beef Suya Burger',
    category: 'Burgers',
    price: 7000,
    description: 'Double beef patties spiced with Yaji pepper, melted cheddar cheese, crispy bacon, onions & spicy Mayo served with seasoned fries.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prepTimeMinutes: 20,
    available: true,
    supportedAddOns: [
      { id: 'add-egg', name: 'Fried Egg', price: 600 },
      { id: 'add-bacon', name: 'Crispy Bacon', price: 1200 },
    ]
  },
  {
    id: 'side-01',
    name: 'Crispy Loaded Potato Fries',
    category: 'Fries & Sides',
    price: 3500,
    description: 'Golden seasoned French fries topped with melted cheese sauce, grilled chicken bits and spring onions.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prepTimeMinutes: 12,
    available: true,
    supportedAddOns: [
      { id: 'add-cheese', name: 'Extra Cheese Sauce', price: 800 },
    ]
  },
  {
    id: 'side-02',
    name: 'Spicy Peppered Chicken Wings (6pcs)',
    category: 'Chicken',
    price: 6500,
    description: 'Crisp fried chicken wings tossed in fiery Nigerian habanero pepper glaze and garnished with fresh parsley.',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prepTimeMinutes: 18,
    available: true,
    isPopular: true
  },
  {
    id: 'combo-01',
    name: 'Mega Grill & Shawarma Feast Combo',
    category: 'Combos',
    price: 18500,
    description: '1 Large Special Chicken Shawarma + 1 Flame-Grilled 1/4 Chicken + 1 Portion Loaded Fries + 1 Chilled Zobo Drink + 1 Coke.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    prepTimeMinutes: 30,
    available: true,
    isPopular: true,
    isBestSeller: true
  },
  {
    id: 'drink-01',
    name: 'Chilled Ice Zobo Drink (500ml)',
    category: 'Drinks',
    price: 1500,
    description: 'Homemade iced Hibiscus drink infused with pineapple, ginger, cloves and sweet mint.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prepTimeMinutes: 2,
    available: true
  },
  {
    id: 'drink-02',
    name: 'Chilled Chapman Cocktail (500ml)',
    category: 'Drinks',
    price: 2000,
    description: 'Classic Nigerian mocktail made with Angostura bitters, Fanta, Sprite, cucumber & fresh orange slices.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prepTimeMinutes: 5,
    available: true
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone-1', name: 'Lekki Phase 1', fee: 1500, estimatedMinutes: '20–30 mins', minOrderAmount: 3000 },
  { id: 'zone-2', name: 'Victoria Island (VI)', fee: 1500, estimatedMinutes: '20–35 mins', minOrderAmount: 3000 },
  { id: 'zone-3', name: 'Ikoyi', fee: 2000, estimatedMinutes: '25–40 mins', minOrderAmount: 4000 },
  { id: 'zone-4', name: 'Chevron / Ikota / Agungi', fee: 2000, estimatedMinutes: '25–40 mins', minOrderAmount: 4000 },
  { id: 'zone-5', name: 'Ajah / Sangotedo', fee: 2500, estimatedMinutes: '35–50 mins', minOrderAmount: 5000 },
  { id: 'zone-6', name: 'Ikeja / GRA / Maryland', fee: 2500, estimatedMinutes: '30–45 mins', minOrderAmount: 5000 },
  { id: 'zone-7', name: 'Surulere / Yaba', fee: 2200, estimatedMinutes: '30–45 mins', minOrderAmount: 4000 },
];

export const INITIAL_DELIVERY_AGENTS: DeliveryAgent[] = [
  {
    id: 'rider-01',
    name: 'David Adeleke',
    phone: '08031234567',
    email: 'david.delivery@sweetfrys.ng',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'TVS Boxed Bike',
    vehicleNumber: 'LAG-482-XY',
    status: 'AVAILABLE',
    totalDeliveries: 342,
    rating: 4.9,
  },
  {
    id: 'rider-02',
    name: 'John Okafor',
    phone: '08129876543',
    email: 'john.o@sweetfrys.ng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'Yamaha Express Bike',
    vehicleNumber: 'EKY-910-AA',
    status: 'ON_DELIVERY',
    activeDeliveryId: 'SHW-1024',
    totalDeliveries: 289,
    rating: 4.8,
  },
  {
    id: 'rider-03',
    name: 'Michael Danjuma',
    phone: '09087654321',
    email: 'michael.d@sweetfrys.ng',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'Bajaj Pulsar 150',
    vehicleNumber: 'GGE-112-AB',
    status: 'AVAILABLE',
    totalDeliveries: 195,
    rating: 4.9,
  },
  {
    id: 'rider-04',
    name: 'Samuel Chukwu',
    phone: '07034567890',
    email: 'samuel.c@sweetfrys.ng',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'Honda Ace 125',
    vehicleNumber: 'KJA-883-ZZ',
    status: 'OFFLINE',
    totalDeliveries: 120,
    rating: 4.7,
  }
];

export const INITIAL_PROMOS: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minSubtotal: 5000,
    isActive: true,
    usageCount: 142
  },
  {
    id: 'promo-2',
    code: 'SHAWARMA500',
    discountType: 'fixed',
    discountValue: 500,
    minSubtotal: 4000,
    isActive: true,
    usageCount: 88
  },
  {
    id: 'promo-3',
    code: 'FREEDELIVERY',
    discountType: 'free_delivery',
    discountValue: 0,
    minSubtotal: 10000,
    isActive: true,
    usageCount: 65
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Tolu A.',
    rating: 5,
    comment: 'The Special Chicken Shawarma is hands down the best in Lekki! Hot, juicy, and delivered in less than 25 mins.',
    date: 'Yesterday',
    foodItemName: 'Special Chicken Shawarma',
    verifiedOrder: true
  },
  {
    id: 'rev-2',
    customerName: 'Emeka N.',
    rating: 5,
    comment: 'The whole grilled catfish was packed so neatly and warm! The pepper sauce is out of this world.',
    date: '3 days ago',
    foodItemName: 'Whole Spicy Grilled Catfish',
    verifiedOrder: true
  },
  {
    id: 'rev-3',
    customerName: 'Bisi O.',
    rating: 5,
    comment: 'Very easy online ordering. Tracked my rider right to my compound gates in VI!',
    date: '5 days ago',
    foodItemName: 'Mega Grill & Shawarma Feast Combo',
    verifiedOrder: true
  }
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-1024',
    orderNumber: 'SHW-1024',
    customer: {
      fullName: 'Oluwaseun Bakare',
      phone: '08023456789',
      email: 'seun.b@example.com',
      whatsapp: '08023456789'
    },
    delivery: {
      deliveryType: 'delivery',
      address: 'Block 12, Flat 4, Admiralty Way',
      area: 'Lekki Phase 1',
      city: 'Lagos',
      landmark: 'Near Ebeano Supermarket',
      instructions: 'Call when at the main security gate.'
    },
    items: [
      {
        id: 'c-1',
        foodId: 'shw-01',
        name: 'Special Chicken Shawarma',
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80',
        unitPrice: 7000,
        quantity: 2,
        protein: 'chicken',
        size: 'large',
        spiceLevel: 'medium',
        selectedAddOns: [
          { id: 'add-cheese', name: 'Melted Mozzarella Cheese', price: 1000 }
        ],
        specialInstructions: 'Extra garlic mayo sauce please.',
        totalPrice: 16000
      },
      {
        id: 'c-2',
        foodId: 'side-01',
        name: 'Crispy Loaded Potato Fries',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
        unitPrice: 3500,
        quantity: 1,
        protein: 'chicken',
        size: 'regular',
        spiceLevel: 'mild',
        selectedAddOns: [],
        totalPrice: 3500
      }
    ],
    subtotal: 19500,
    deliveryFee: 1500,
    discount: 1000,
    total: 20000,
    paymentMethod: 'paystack',
    paymentStatus: 'PAID',
    status: 'OUT_FOR_DELIVERY',
    assignedRiderId: 'rider-02',
    assignedRider: INITIAL_DELIVERY_AGENTS[1],
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    statusHistory: [
      { status: 'NEW', timestamp: new Date(Date.now() - 25 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Order placed online' },
      { status: 'CONFIRMED', timestamp: new Date(Date.now() - 22 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Kitchen confirmed' },
      { status: 'PREPARING', timestamp: new Date(Date.now() - 20 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Food on grill' },
      { status: 'READY', timestamp: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Packed & ready' },
      { status: 'OUT_FOR_DELIVERY', timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Rider John picked up order' }
    ],
    riderCoordinates: { lat: 6.4485, lng: 3.4722 }
  },
  {
    id: 'ord-1025',
    orderNumber: 'SHW-1025',
    customer: {
      fullName: 'Amina Yusuf',
      phone: '08134567890',
      email: 'amina.y@example.com',
      whatsapp: '08134567890'
    },
    delivery: {
      deliveryType: 'delivery',
      address: '15 Bishop Aboyade Cole St',
      area: 'Victoria Island (VI)',
      city: 'Lagos',
      landmark: 'Opposite Zenith Bank Head Office'
    },
    items: [
      {
        id: 'c-3',
        foodId: 'grill-02',
        name: 'Whole Spicy Grilled Catfish',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        unitPrice: 14500,
        quantity: 1,
        protein: 'chicken',
        size: 'regular',
        spiceLevel: 'hot',
        selectedAddOns: [
          { id: 'add-plantain', name: 'Fried Plantain (Dodo)', price: 1200 }
        ],
        totalPrice: 15700
      }
    ],
    subtotal: 15700,
    deliveryFee: 1500,
    discount: 0,
    total: 17200,
    paymentMethod: 'card',
    paymentStatus: 'PAID',
    status: 'PREPARING',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    statusHistory: [
      { status: 'NEW', timestamp: new Date(Date.now() - 12 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { status: 'CONFIRMED', timestamp: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { status: 'PREPARING', timestamp: new Date(Date.now() - 8 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]
  }
];
