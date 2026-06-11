import os
os.makedirs("src/app/api/admin/retail-orders/[id]", exist_ok=True)
with open("src/app/api/admin/retail-orders/[id]/route.ts", "w") as f:
    f.write('''import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { status, resi } = await request.json();

  const { error } = await supabase
    .from("retail_orders")
    .update({ status, resi, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
''')
print("API Done!")
