import os

# API route subscribe
os.makedirs("src/app/api/subscribe", exist_ok=True)
with open("src/app/api/subscribe/route.ts", "w") as f:
    f.write('''import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
  }

  const { error } = await supabase.from("subscribers").insert({ email });
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
''')
print("API Done!")

# Update Navbar - fungsikan form subscribe
content = open("src/components/Navbar.tsx").read()
new_content = content.replace(
    '''          <div style={{display:"flex"}}>
              <input type="email" placeholder="Email address" style={{
                flex:1, background:"transparent",
                border:"1px solid rgba(255,255,255,0.15)", borderRight:"none",
                padding:"13px 16px", fontSize:"13px", color:"#F0EBE3",
                fontFamily:"var(--font-jost)", outline:"none",
              }} />
              <button style={{
                background:"#F0EBE3", border:"1px solid #F0EBE3",
                color:"#1C1917", padding:"13px 20px", fontSize:"11px",
                letterSpacing:"1px", textTransform:"uppercase",
                fontFamily:"var(--font-jost)", cursor:"pointer", fontWeight:500,
              }}>
                Subscribe
              </button>
            </div>''',
    '''<SubscribeForm />'''
)
open("src/components/Navbar.tsx", "w").write(new_content)
print("Navbar Done!")
