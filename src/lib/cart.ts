// Cart utility - localStorage based
export interface CartItem {
  productId: string;
  productName: string;
  productPhoto: string;
  variantId: string;
  sizeMl: number;
  price: number;
  quantity: number;
  isFlashSale?: boolean;
  originalPrice?: number;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("henima_cart");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem("henima_cart", JSON.stringify(items));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find(
    (i) => i.productId === item.productId && i.variantId === item.variantId
  );
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function removeFromCart(productId: string, variantId: string) {
  const cart = getCart().filter(
    (i) => !(i.productId === productId && i.variantId === variantId)
  );
  saveCart(cart);
}

export function updateQty(productId: string, variantId: string, qty: number) {
  const cart = getCart().map((i) =>
    i.productId === productId && i.variantId === variantId
      ? { ...i, quantity: qty }
      : i
  );
  saveCart(cart.filter((i) => i.quantity > 0));
}

export function clearCart() {
  localStorage.removeItem("henima_cart");
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
