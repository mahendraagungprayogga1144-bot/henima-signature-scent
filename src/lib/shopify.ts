/**
 * Shopify Storefront API client (Headless channel).
 * Public token: browser-safe. Private token: server-only (preferred when set).
 */

const API_VERSION = "2025-01";

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  featuredImage?: { url: string; altText?: string | null } | null;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  variants: Array<{
    id: string;
    title: string;
    availableForSale: boolean;
    price: { amount: string; currencyCode: string };
  }>;
};

function storeDomain(): string {
  return (
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    ""
  ).replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function storefrontToken(preferPrivate = true): string {
  if (preferPrivate && process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN) {
    return process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  }
  return (
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ||
    process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN ||
    ""
  );
}

export function isShopifyConfigured(): boolean {
  return Boolean(storeDomain() && storefrontToken(true));
}

/** Which env keys are missing (names only — never values). */
export function shopifyConfigMissing(): string[] {
  const missing: string[] = [];
  if (!storeDomain()) {
    missing.push("SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN");
  }
  if (!storefrontToken(true)) {
    missing.push(
      "SHOPIFY_STOREFRONT_PRIVATE_TOKEN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN"
    );
  }
  return missing;
}

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  opts?: { private?: boolean }
): Promise<T> {
  const domain = storeDomain();
  const token = storefrontToken(opts?.private !== false);
  if (!domain || !token) {
    throw new Error("Shopify Storefront API is not configured");
  }

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data as T;
}

const PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          availableForSale
          featuredImage { url altText }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          variants(first: 25) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getShopifyProducts(first = 50): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: {
      edges: Array<{
        node: Omit<ShopifyProduct, "variants"> & {
          variants: { edges: Array<{ node: ShopifyProduct["variants"][number] }> };
        };
      }>;
    };
  }>(PRODUCTS_QUERY, { first });

  return data.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    availableForSale: node.availableForSale,
    featuredImage: node.featuredImage,
    priceRange: node.priceRange,
    variants: node.variants.edges.map((e) => e.node),
  }));
}

const CART_CREATE = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors { field message }
    }
  }
`;

export async function createShopifyCheckout(
  lines: Array<{ merchandiseId: string; quantity: number }>,
  buyerCountry?: string
): Promise<{ cartId: string; checkoutUrl: string }> {
  const input: Record<string, unknown> = {
    lines: lines.map((l) => ({
      merchandiseId: l.merchandiseId,
      quantity: l.quantity,
    })),
  };
  if (buyerCountry) {
    input.buyerIdentity = { countryCode: buyerCountry.toUpperCase() };
  }

  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null;
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(CART_CREATE, { input });

  const errors = data.cartCreate.userErrors;
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join("; "));
  }
  if (!data.cartCreate.cart?.checkoutUrl) {
    throw new Error("Shopify checkout URL missing");
  }
  return {
    cartId: data.cartCreate.cart.id,
    checkoutUrl: data.cartCreate.cart.checkoutUrl,
  };
}
