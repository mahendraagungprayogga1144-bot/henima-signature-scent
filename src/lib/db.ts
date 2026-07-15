import { supabase } from "./supabase";
import type { Database, Product, User, Order, Settings } from "./types";

// ---------- Row <-> TypeScript mappers ----------

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    photo: (row.photo as string) ?? "/products/placeholder.svg",
    photos: (row.photos as string[]) ?? [],
    video: (row.video as string) ?? undefined,
    originalPrice: row.original_price as number,
    discountPrice: row.discount_price as number,
    active: row.active as boolean,
    variants: (row.variants as Product["variants"]) ?? [],
    topNotes: (row.top_notes as string) ?? undefined,
    middleNotes: (row.middle_notes as string) ?? undefined,
    baseNotes: (row.base_notes as string) ?? undefined,
    inspiration: (row.inspiration as string) ?? undefined,
    sillage: (row.sillage as string) ?? undefined,
    projection: (row.projection as string) ?? undefined,
    longevity: (row.longevity as string) ?? undefined,
    scentFamily: (row.scent_family as string) ?? undefined,
    comingSoon: (row.coming_soon as boolean) ?? false,
  };
}

function productToRow(p: Product) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    photo: p.photo,
    photos: p.photos ?? [],
    video: p.video ?? null,
    original_price: p.originalPrice,
    discount_price: p.discountPrice,
    active: p.active,
    variants: p.variants,
    top_notes: p.topNotes ?? null,
    middle_notes: p.middleNotes ?? null,
    base_notes: p.baseNotes ?? null,
    inspiration: p.inspiration ?? null,
    sillage: (p as any).sillage ?? null,
    projection: (p as any).projection ?? null,
    longevity: (p as any).longevity ?? null,
    scent_family: (p as any).scentFamily ?? null,
    coming_soon: (p as any).comingSoon ?? false,
  };
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    passwordHash: row.password_hash as string,
    name: row.name as string,
    phone: (row.phone as string) ?? "",
    role: row.role as User["role"],
    storeName: (row.store_name as string) ?? "",
    address: (row.address as string | null) ?? undefined,
    reseller: (row.reseller as User["reseller"] | null) ?? undefined,
    createdAt: row.created_at as string,
    resetToken: (row.reset_token as string | null) ?? undefined,
    resetTokenExpiry: (row.reset_token_expiry as string | null) ?? undefined,
  } as any;
}

function userToRow(u: User) {
  return {
    id: u.id,
    email: u.email,
    password_hash: u.passwordHash,
    name: u.name,
    phone: u.phone,
    role: u.role,
    store_name: u.storeName,
    address: u.address ?? null,
    reseller: u.reseller ?? null,
    created_at: u.createdAt,
    reset_token: (u as any).resetToken ?? null,
    reset_token_expiry: (u as any).resetTokenExpiry ?? null,
  };
}

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    resellerId: row.reseller_id as string,
    resellerName: (row.reseller_name as string) ?? "",
    resellerPhone: (row.reseller_phone as string) ?? "",
    storeName: (row.store_name as string) ?? "",
    orderType: row.order_type as Order["orderType"],
    shipping: row.shipping as Order["shipping"],
    courier: row.courier as Order["courier"],
    items: (row.items as Order["items"]) ?? [],
    total: row.total as number,
    status: row.status as Order["status"],
    statusHistory: (row.status_history as Order["statusHistory"]) ?? [],
    paymentMethod: (row.payment_method as Order["paymentMethod"] | null) ?? undefined,
    paymentProof: (row.payment_proof as string | null) ?? undefined,
    paymentBank: (row.payment_bank as Order["paymentBank"] | null) ?? undefined,
    paymentConfirmedAt: (row.payment_confirmed_at as string | null) ?? undefined,
    invoicePdf: (row.invoice_pdf as string | null) ?? undefined,
    resi: (row.resi as string | null) ?? undefined,
    notes: (row.notes as string | null) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    shippingCost: (row.shipping_cost as number) ?? 0,
  };
}

function orderToRow(o: Order) {
  return {
    id: o.id,
    reseller_id: o.resellerId,
    reseller_name: o.resellerName,
    reseller_phone: o.resellerPhone,
    store_name: o.storeName,
    order_type: o.orderType,
    shipping: o.shipping,
    courier: o.courier,
    items: o.items,
    total: o.total,
    status: o.status,
    status_history: o.statusHistory,
    payment_method: o.paymentMethod ?? null,
    payment_proof: o.paymentProof ?? null,
    payment_bank: o.paymentBank ?? null,
    payment_confirmed_at: o.paymentConfirmedAt ?? null,
    invoice_pdf: o.invoicePdf ?? null,
    resi: o.resi ?? null,
    notes: o.notes ?? null,
    created_at: o.createdAt,
    shipping_cost: (o as any).shippingCost ?? 0,
    updated_at: o.updatedAt,
  };
}

const DEFAULT_SETTINGS: Settings = {
  company: {
    name: "Henima Signature Scent",
    tagline: "Luxury scent, crafted for your signature.",
    vision: "",
    mission: "",
    brandStory: "",
  },
  payment: {
    qrisImage: "/payment/qris-placeholder.svg",
    bankAccounts: [
      { code: "bca", bankName: "BCA", accountNumber: "0000000000", accountName: "Henima Signature Scent", active: true },
      { code: "mandiri", bankName: "Mandiri", accountNumber: "0000000000", accountName: "Henima Signature Scent", active: false },
      { code: "bri", bankName: "BRI", accountNumber: "0000000000", accountName: "Henima Signature Scent", active: false },
    ],
  },
};

// ---------- Public API ----------

export async function getDatabase(): Promise<Database> {
  const [
    { data: productsData, error: pErr },
    { data: usersData, error: uErr },
    { data: ordersData, error: oErr },
    { data: settingsData },
  ] = await Promise.all([
    supabase.from("products").select("*").order("name"),
    supabase.from("users").select("*").order("created_at"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  if (pErr) throw new Error(`Products fetch failed: ${pErr.message}`);
  if (uErr) throw new Error(`Users fetch failed: ${uErr.message}`);
  if (oErr) throw new Error(`Orders fetch failed: ${oErr.message}`);

  const settings: Settings = settingsData
    ? {
        company: settingsData.company as Settings["company"],
        payment: settingsData.payment as Settings["payment"],
        catalog: settingsData.catalog as any,
        gallery: settingsData.gallery as any,
        marqueeItems: settingsData.marquee_items as any,
        marqueeItems: settingsData.marquee_items as any,
      }
    : DEFAULT_SETTINGS;

  return {
    products: (productsData ?? []).map(rowToProduct),
    users: (usersData ?? []).map(rowToUser),
    orders: (ordersData ?? []).map(rowToOrder),
    settings,
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToUser(data as Record<string, unknown>);
}

export async function updateDatabase(
  updater: (db: Database) => void | Promise<void>
): Promise<Database> {
  const before = await getDatabase();
  const after: Database = JSON.parse(JSON.stringify(before));

  await updater(after); // may throw — nothing is saved if it does

  await Promise.all([
    syncProducts(before.products, after.products),
    syncArray("users", before.users, after.users, userToRow),
    syncArray("orders", before.orders, after.orders, orderToRow),
    syncSettings(before.settings, after.settings),
  ]);

  return after;
}

// ---------- Internal sync helpers ----------

const PRODUCT_MEDIA_COLUMNS = ["photos", "video"] as const;

function isMissingColumnError(message: string): boolean {
  return /column|schema cache|could not find/i.test(message);
}

async function syncProducts(before: Product[], after: Product[]): Promise<void> {
  const afterIds = new Set(after.map((i) => i.id));
  const deleted = before.filter((i) => !afterIds.has(i.id));
  if (deleted.length > 0) {
    const { error } = await supabase
      .from("products")
      .delete()
      .in("id", deleted.map((i) => i.id));
    if (error) throw new Error(`Delete from products failed: ${error.message}`);
  }

  const beforeMap = new Map(before.map((i) => [i.id, JSON.stringify(i)]));
  const upserted = after.filter((i) => beforeMap.get(i.id) !== JSON.stringify(i));
  if (upserted.length === 0) return;

  const rows = upserted.map((p) => productToRow(p));
  let { error } = await supabase.from("products").upsert(rows);

  if (error && isMissingColumnError(error.message)) {
    const fallbackRows = rows.map((row, idx) => {
      const product = upserted[idx];
      const next = { ...row } as Record<string, unknown>;
      for (const col of PRODUCT_MEDIA_COLUMNS) delete next[col];
      if (product.photos?.[0]) next.photo = product.photos[0];
      return next;
    });
    ({ error } = await supabase.from("products").upsert(fallbackRows));
  }

  if (error) throw new Error(`Upsert to products failed: ${error.message}`);
}

async function syncArray<T extends { id: string }>(
  table: string,
  before: T[],
  after: T[],
  toRow: (item: T) => object
): Promise<void> {
  const afterIds = new Set(after.map((i) => i.id));
  const deleted = before.filter((i) => !afterIds.has(i.id));
  if (deleted.length > 0) {
    const { error } = await supabase
      .from(table)
      .delete()
      .in("id", deleted.map((i) => i.id));
    if (error) throw new Error(`Delete from ${table} failed: ${error.message}`);
  }

  const beforeMap = new Map(before.map((i) => [i.id, JSON.stringify(i)]));
  const upserted = after.filter((i) => beforeMap.get(i.id) !== JSON.stringify(i));
  if (upserted.length > 0) {
    const { error } = await supabase.from(table).upsert(upserted.map(toRow));
    if (error) throw new Error(`Upsert to ${table} failed: ${error.message}`);
  }
}

async function syncSettings(before: Settings, after: Settings): Promise<void> {
  if (JSON.stringify(before) === JSON.stringify(after)) return;
  const { error } = await supabase
    .from("settings")
    .upsert({ id: 1, company: after.company, payment: after.payment });
  if (error) throw new Error(`Settings upsert failed: ${error.message}`);
}
