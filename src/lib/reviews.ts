import { supabase } from "@/lib/supabase";

export async function getProductReviews(productId: string) {
  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("getProductReviews:", error.message);
      return [];
    }
    return (data || []).map((r) => ({
      id: String(r.id),
      customer_name: String(r.customer_name || "Anonim"),
      rating: Number(r.rating) || 0,
      comment: String(r.comment || r.review || ""),
      created_at: String(r.created_at || ""),
      reply: r.reply ? String(r.reply) : undefined,
    }));
  } catch (e) {
    console.error("getProductReviews failed:", e);
    return [];
  }
}
