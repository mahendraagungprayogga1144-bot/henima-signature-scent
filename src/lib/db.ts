import { promises as fs } from "fs";
import path from "path";
import type { Database } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

let writeQueue: Promise<void> = Promise.resolve();

function migrateDatabase(input: any): { db: Database; changed: boolean } {
  let changed = false;

  const products = Array.isArray(input?.products) ? input.products : [];
  const users = Array.isArray(input?.users) ? input.users : [];
  const orders = Array.isArray(input?.orders) ? input.orders : [];
  const settings = input?.settings ?? {};

  const db: Database = {
    products: products.map((p: any) => {
      const photo =
        typeof p?.photo === "string"
          ? p.photo
          : typeof p?.image === "string"
            ? p.image
            : "/products/placeholder.svg";

      const originalPrice =
        typeof p?.originalPrice === "number"
          ? p.originalPrice
          : typeof p?.price === "number"
            ? p.price
            : 0;

      const discountPrice =
        typeof p?.discountPrice === "number" ? p.discountPrice : originalPrice;

      const active = typeof p?.active === "boolean" ? p.active : true;

      const variantsRaw = Array.isArray(p?.variants) ? p.variants : null;
      const variants =
        variantsRaw && variantsRaw.length > 0
          ? variantsRaw.map((v: any, idx: number) => ({
              id:
                typeof v?.id === "string"
                  ? v.id
                  : `${String(p?.id || "prod")}-v${idx + 1}`,
              sizeMl:
                v?.sizeMl === 30 || v?.sizeMl === 50 || v?.sizeMl === 100
                  ? v.sizeMl
                  : 50,
              sku: typeof v?.sku === "string" ? v.sku : undefined,
              stock: typeof v?.stock === "number" ? v.stock : 0,
              originalPrice:
                typeof v?.originalPrice === "number" ? v.originalPrice : originalPrice,
              discountPrice:
                typeof v?.discountPrice === "number" ? v.discountPrice : discountPrice,
              active: typeof v?.active === "boolean" ? v.active : true,
            }))
          : [
              {
                id: `${String(p?.id || "prod")}-30`,
                sizeMl: 30 as const,
                stock: typeof p?.stock === "number" ? p.stock : 0,
                originalPrice,
                discountPrice,
                active: true,
              },
              {
                id: `${String(p?.id || "prod")}-50`,
                sizeMl: 50 as const,
                stock: typeof p?.stock === "number" ? p.stock : 0,
                originalPrice,
                discountPrice,
                active: true,
              },
              {
                id: `${String(p?.id || "prod")}-100`,
                sizeMl: 100 as const,
                stock: typeof p?.stock === "number" ? p.stock : 0,
                originalPrice,
                discountPrice,
                active: true,
              },
            ];

      const normalized = {
        id: String(p?.id || ""),
        name: String(p?.name || ""),
        description: String(p?.description || ""),
        photo,
        originalPrice,
        discountPrice,
        active,
        variants,
      };

      if (
        p?.image !== undefined ||
        p?.price !== undefined ||
        p?.originalPrice === undefined ||
        p?.discountPrice === undefined ||
        !Array.isArray(p?.variants)
      ) {
        changed = true;
      }

      return normalized;
    }),
    users: users.map((u: any) => {
      const base = {
        id: String(u?.id || ""),
        email: String(u?.email || ""),
        passwordHash: String(u?.passwordHash || ""),
        name: String(u?.name || ""),
        phone: String(u?.phone || ""),
        role: u?.role === "admin" ? "admin" : "reseller",
        storeName: String(u?.storeName || ""),
        address: typeof u?.address === "string" ? u.address : undefined,
        createdAt: String(u?.createdAt || new Date().toISOString()),
      } as any;

      if (base.role === "reseller") {
        base.reseller = {
          approved: u?.reseller?.approved ?? true,
          tier: u?.reseller?.tier ?? "Bronze",
          commissionPct:
            typeof u?.reseller?.commissionPct === "number" ? u.reseller.commissionPct : 0,
          commissionEarned:
            typeof u?.reseller?.commissionEarned === "number"
              ? u.reseller.commissionEarned
              : 0,
        };
        if (!u?.reseller) changed = true;
      }

      return base;
    }),
    orders: orders.map((o: any) => {
      const legacyShippingAddress = typeof o?.shippingAddress === "string" ? o.shippingAddress : "";

      const shipping =
        o?.shipping && typeof o.shipping === "object"
          ? {
              fullName: String(o.shipping.fullName || o?.resellerName || ""),
              phone: String(o.shipping.phone || o?.resellerPhone || ""),
              address: String(o.shipping.address || legacyShippingAddress || ""),
              city: String(o.shipping.city || ""),
              province: String(o.shipping.province || ""),
              postalCode: String(o.shipping.postalCode || ""),
            }
          : {
              fullName: String(o?.resellerName || ""),
              phone: String(o?.resellerPhone || ""),
              address: String(legacyShippingAddress || ""),
              city: "",
              province: "",
              postalCode: "",
            };

      const itemsRaw = Array.isArray(o?.items) ? o.items : [];
      const items = itemsRaw.map((it: any, idx: number) => ({
        productId: String(it?.productId || ""),
        variantId: String(it?.variantId || `${String(it?.productId || "prod")}-50`),
        productName: String(it?.productName || ""),
        sizeMl: it?.sizeMl === 30 || it?.sizeMl === 50 || it?.sizeMl === 100 ? it.sizeMl : 50,
        quantity: Number(it?.quantity || 0),
        unitPrice: Number(it?.unitPrice || 0),
        subtotal: Number(it?.subtotal || 0),
      }));

      const status =
        o?.status === "pending_payment" ||
        o?.status === "pending_confirmation" ||
        o?.status === "confirmed" ||
        o?.status === "packed" ||
        o?.status === "shipped" ||
        o?.status === "delivered"
          ? o.status
          : o?.status === "pending"
            ? "pending_payment"
            : "pending_payment";

      const paymentMethod =
        o?.paymentMethod === "qris" || o?.paymentMethod === "bank_transfer"
          ? o.paymentMethod
          : o?.paymentMethod === "bca"
            ? "bank_transfer"
            : undefined;

      if (o?.shippingAddress !== undefined || o?.status === "pending" || o?.paymentMethod === "bca") {
        changed = true;
      }

      return {
        id: String(o?.id || ""),
        resellerId: String(o?.resellerId || ""),
        resellerName: String(o?.resellerName || ""),
        resellerPhone: String(o?.resellerPhone || ""),
        storeName: String(o?.storeName || ""),
        orderType: o?.orderType === "satuan" ? "satuan" : "reseller",
        shipping,
        courier:
          o?.courier === "jne" || o?.courier === "jnt" || o?.courier === "sicepat" || o?.courier === "anteraja"
            ? o.courier
            : "jne",
        items,
        total: Number(o?.total || 0),
        status,
        statusHistory: Array.isArray(o?.statusHistory)
          ? o.statusHistory.map((h: any) => ({
              status:
                h?.status === "pending_payment" ||
                h?.status === "pending_confirmation" ||
                h?.status === "confirmed" ||
                h?.status === "packed" ||
                h?.status === "shipped" ||
                h?.status === "delivered"
                  ? h.status
                  : h?.status === "pending"
                    ? "pending_payment"
                    : "pending_payment",
              note: typeof h?.note === "string" ? h.note : undefined,
              at: String(h?.at || new Date().toISOString()),
            }))
          : [],
        paymentMethod,
        paymentProof: typeof o?.paymentProof === "string" ? o.paymentProof : undefined,
        paymentBank:
          o?.paymentBank === "bca" || o?.paymentBank === "mandiri" || o?.paymentBank === "bri"
            ? o.paymentBank
            : undefined,
        paymentConfirmedAt:
          typeof o?.paymentConfirmedAt === "string" ? o.paymentConfirmedAt : undefined,
        invoicePdf: typeof o?.invoicePdf === "string" ? o.invoicePdf : undefined,
        resi: typeof o?.resi === "string" ? o.resi : undefined,
        notes: typeof o?.notes === "string" ? o.notes : undefined,
        createdAt: String(o?.createdAt || new Date().toISOString()),
        updatedAt: String(o?.updatedAt || o?.createdAt || new Date().toISOString()),
      };
    }),
    settings: {
      company: {
        name:
          typeof settings?.company?.name === "string" && settings.company.name.trim()
            ? settings.company.name.trim()
            : "Henima Signature Scent",
        whatsappNumber:
          typeof settings?.company?.whatsappNumber === "string"
            ? settings.company.whatsappNumber
            : undefined,
        address:
          typeof settings?.company?.address === "string"
            ? settings.company.address
            : undefined,
        tagline:
          typeof settings?.company?.tagline === "string"
            ? settings.company.tagline
            : "Luxury scent, crafted for your signature.",
        vision:
          typeof settings?.company?.vision === "string"
            ? settings.company.vision
            : "",
        mission:
          typeof settings?.company?.mission === "string"
            ? settings.company.mission
            : "",
        brandStory:
          typeof settings?.company?.brandStory === "string"
            ? settings.company.brandStory
            : "",
        logo: typeof settings?.company?.logo === "string" ? settings.company.logo : undefined,
        heroImage:
          typeof settings?.company?.heroImage === "string"
            ? settings.company.heroImage
            : undefined,
      },
      payment: {
        qrisImage:
          typeof settings?.payment?.qrisImage === "string"
            ? settings.payment.qrisImage
            : typeof settings?.qrisImage === "string"
              ? settings.qrisImage
              : "/payment/qris-placeholder.svg",
        bankAccounts: Array.isArray(settings?.payment?.bankAccounts)
          ? settings.payment.bankAccounts
          : [
              {
                code: "bca",
                bankName:
                  typeof settings?.bankName === "string" ? settings.bankName : "BCA",
                accountNumber:
                  typeof settings?.bankAccount === "string"
                    ? settings.bankAccount
                    : "0000000000",
                accountName:
                  typeof settings?.bankAccountName === "string"
                    ? settings.bankAccountName
                    : "Henima Signature Scent",
                active: true,
              },
              {
                code: "mandiri",
                bankName: "Mandiri",
                accountNumber: "0000000000",
                accountName: "Henima Signature Scent",
                active: false,
              },
              {
                code: "bri",
                bankName: "BRI",
                accountNumber: "0000000000",
                accountName: "Henima Signature Scent",
                active: false,
              },
            ],
      },
    },
  };

  if (input?.settings?.bankName || input?.settings?.bankAccount || input?.settings?.bankAccountName) {
    changed = true;
  }
  if (!settings?.company || settings?.company?.tagline === undefined) {
    changed = true;
  }

  return { db, changed };
}

async function readDb(): Promise<Database> {
  const raw = await fs.readFile(DB_PATH, "utf8");
  const parsed = JSON.parse(raw);
  const { db, changed } = migrateDatabase(parsed);
  if (changed) {
    // Best-effort normalize persisted schema once.
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  }
  return db;
}

async function writeDb(data: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function getDatabase(): Promise<Database> {
  return readDb();
}

export async function updateDatabase(
  updater: (db: Database) => void | Promise<void>
): Promise<Database> {
  let result!: Database;
  const task = async () => {
    const db = await readDb();
    await updater(db);
    await writeDb(db);
    result = db;
  };
  writeQueue = writeQueue.then(task, task);
  await writeQueue;
  return result;
}
