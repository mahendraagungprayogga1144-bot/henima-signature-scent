import os
os.makedirs("src/app/api/orders/[id]", exist_ok=True)
with open("src/app/api/orders/[id]/route.ts", "w") as f:
    f.write('''import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("retail_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
''')
print("Done!")
