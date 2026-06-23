import { supabase } from "@/lib/supabase";
import ProductReviews from "@/components/ProductReviews";

export async function getProductReviews(productId: string) {
  const { data } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  return data || [];
}
