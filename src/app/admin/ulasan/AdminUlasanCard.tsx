"use client";
import { useState } from "react";

const STARS = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default function AdminUlasanCard({ ulasan }: { ulasan: any }) {
  const [reply, setReply] = useState(ulasan.reply || "");
  const [approved, setApproved] = useState(ulasan.approved);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [expanded, setExpanded] = useState(!ulasan.approved);

  async function save(newApproved?: boolean) {
    setSaving(true);
    setMsg("");
    const approvedVal = newApproved !== undefined ? newApproved : approved;
    try {
      const res = await fetch("/api/admin/ulasan/" + ulasan.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply, approved: approvedVal }),
      });
      if (res.ok) {
        setApproved(approvedVal);
        setMsg("Tersimpan!");
      } else {
        setMsg("Gagal menyimpan");
      }
    } catch {
      setMsg("Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ border: "1px solid #e5e5e5", background: "#fff", overflow: "hidden" }}>
      <div onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{ulasan.customer_name}</p>
            <span style={{ color: "#B5935A", fontSize: "13px" }}>{STARS(ulasan.rating)}</span>
            <span style={{ fontSize: "10px", padding: "2px 8px", background: approved ? "#4CAF50" : "#DAA520", color: "#fff", fontWeight: 600 }}>
              {approved ? "Approved" : "Pending"}
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>{ulasan.product_name} · {new Date(ulasan.created_at).toLocaleDateString("id-ID")}</p>
          <p style={{ fontSize: "13px", color: "#555", margin: "6px 0 0", lineHeight: 1.5 }}>{ulasan.review}</p>
        </div>
        <span style={{ color: "#aaa", transform: expanded ? "rotate(90deg)" : "rotate(0)", transition: "0.2s" }}>›</span>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid #f0f0f0", padding: "20px", background: "#fafafa" }}>
          <label style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Balasan Admin</label>
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Tulis balasan untuk ulasan ini..."
            rows={3}
            style={{ width: "100%", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "13px", background: "#fff", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "var(--font-jost)", lineHeight: 1.6 }}
          />
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "12px", flexWrap: "wrap" }}>
            <button onClick={() => save()} disabled={saving} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "10px 20px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
              {saving ? "Menyimpan..." : "Simpan Balasan"}
            </button>
            {!approved && (
              <button onClick={() => save(true)} disabled={saving} style={{ background: "#4CAF50", color: "#fff", border: "none", padding: "10px 20px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
                ✓ Approve
              </button>
            )}
            {approved && (
              <button onClick={() => save(false)} disabled={saving} style={{ background: "#cc0000", color: "#fff", border: "none", padding: "10px 20px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
                ✗ Unapprove
              </button>
            )}
            {msg && <span style={{ fontSize: "12px", color: msg === "Tersimpan!" ? "#4CAF50" : "#cc0000" }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
