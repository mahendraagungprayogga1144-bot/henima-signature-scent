export type UserRole = "admin" | "reseller";

export type OrderStatus =
  | "pending_payment"
  | "pending_confirmation"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered";

export type PaymentMethod = "qris" | "bank_transfer";

export type Courier = "jne" | "jnt" | "sicepat" | "anteraja";

export type OrderType = "reseller" | "satuan";

export type ResellerTier = "Bronze" | "Silver" | "Gold";

export type BankCode = "bca" | "mandiri" | "bri";

export interface ProductVariant {
  id: string;
  sizeMl: 30 | 50 | 100;
  sku?: string;
  stock: number;
  originalPrice: number;
  discountPrice: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  photo: string;
  originalPrice: number;
  discountPrice: number;
  active: boolean;
  variants: ProductVariant[];
  topNotes?: string;
  middleNotes?: string;
  baseNotes?: string;
  inspiration?: string;
  comingSoon?: boolean;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  role: UserRole;
  storeName: string;
  address?: string;
  reseller?: {
    approved: boolean;
    tier: ResellerTier;
    commissionPct: number;
    commissionEarned: number;
  };
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  sizeMl: 30 | 50 | 100;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  note?: string;
  at: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Order {
  id: string;
  resellerId: string;
  resellerName: string;
  resellerPhone: string;
  storeName: string;
  orderType: OrderType;
  shipping: ShippingInfo;
  courier: Courier;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  paymentMethod?: PaymentMethod;
  paymentProof?: string;
  paymentBank?: BankCode;
  paymentConfirmedAt?: string;
  invoicePdf?: string;
  resi?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  code: BankCode;
  bankName: string;
  accountNumber: string;
  accountName: string;
  active: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
}

export interface Advantage {
  id: string;
  title: string;
  desc: string;
  icon?: string;
}

export interface CompanySettings {
  name: string;
  whatsappNumber?: string;
  address?: string;
  tagline?: string;
  vision?: string;
  mission?: string;
  brandStory?: string;
  foundingYear?: string;
  logo?: string;
  heroImage?: string;
  team?: TeamMember[];
  advantages?: Advantage[];
}

export interface CatalogSettings {
  images: string[];
  pdfUrl?: string;
  title?: string;
}

export interface PaymentSettings {
  qrisImage: string;
  bankAccounts: BankAccount[];
}

export interface Settings {
  company: CompanySettings;
  payment: PaymentSettings;
  catalog?: CatalogSettings;
}

export interface Database {
  products: Product[];
  users: User[];
  orders: Order[];
  settings: Settings;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Menunggu Pembayaran",
  pending_confirmation: "Menunggu Konfirmasi Pembayaran",
  confirmed: "Dikonfirmasi",
  packed: "Dikemas",
  shipped: "Dikirim",
  delivered: "Terkirim",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending_payment",
  "pending_confirmation",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "Transfer Bank",
  qris: "QRIS",
};
