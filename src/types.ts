export type ProteinOption = 'chicken' | 'beef' | 'mixed';
export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra_hot';
export type SizeOption = 'regular' | 'large' | 'extra_large';

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface SizeConfig {
  size: SizeOption;
  label: string;
  priceAdd: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Shawarma' | 'Grills' | 'Chicken' | 'Beef' | 'Fish' | 'Suya' | 'Burgers' | 'Fries & Sides' | 'Drinks' | 'Combos' | 'Specials';
  price: number;
  description: string;
  image: string;
  rating: number;
  prepTimeMinutes: number;
  available: boolean;
  isPopular?: boolean;
  isBestSeller?: boolean;
  supportedProteins?: ProteinOption[];
  supportedSizes?: SizeConfig[];
  supportedAddOns?: AddOn[];
}

export interface CartItem {
  id: string;
  foodId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  protein: ProteinOption;
  size: SizeOption;
  spiceLevel: SpiceLevel;
  selectedAddOns: AddOn[];
  specialInstructions?: string;
  totalPrice: number;
}

export type OrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'paystack' | 'flutterwave' | 'card' | 'bank_transfer' | 'cash_on_delivery';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  whatsapp: string;
}

export interface DeliveryInfo {
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  area?: string;
  city?: string;
  landmark?: string;
  instructions?: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  vehicleType: string;
  vehicleNumber: string;
  status: 'AVAILABLE' | 'ON_DELIVERY' | 'OFFLINE';
  activeDeliveryId?: string;
  totalDeliveries: number;
  rating: number;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  status: OrderStatus;
  assignedRiderId?: string;
  assignedRider?: DeliveryAgent;
  scheduledTime?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistoryItem[];
  riderCoordinates?: { lat: number; lng: number };
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedMinutes: string;
  minOrderAmount: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_delivery';
  discountValue: number;
  minSubtotal: number;
  isActive: boolean;
  usageCount: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  foodItemName?: string;
  verifiedOrder?: boolean;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  outForDeliveryOrders: number;
  completedOrders: number;
  activeRiders: number;
  averageOrderValue: number;
  mostOrderedItem: string;
  salesByDay: { day: string; revenue: number; orders: number }[];
}
