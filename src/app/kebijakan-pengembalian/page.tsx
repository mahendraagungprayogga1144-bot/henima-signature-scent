export default function RefundPolicyPage() {
  const sections = [
    {
      title: "1. Ketentuan Umum",
      content: "Henima Signature Scent berkomitmen memberikan produk berkualitas kepada seluruh pelanggan. Kebijakan pengembalian ini berlaku untuk seluruh pembelian yang dilakukan melalui website henimaofficial.com."
    },
    {
      title: "2. Syarat Pengembalian",
      content: "Pengembalian atau penukaran produk hanya dapat dilakukan apabila: produk yang diterima rusak, cacat produksi, atau tidak sesuai dengan pesanan. Klaim wajib diajukan maksimal 3 (tiga) hari kalender sejak produk diterima, disertai foto/video bukti kerusakan."
    },
    {
      title: "3. Produk yang Tidak Dapat Dikembalikan",
      content: "Karena alasan higienitas, produk parfum yang sudah dibuka segelnya atau digunakan tidak dapat dikembalikan kecuali terbukti cacat produksi dari pabrik."
    },
    {
      title: "4. Proses Pengajuan Klaim",
      content: "Hubungi tim kami melalui WhatsApp di 085190311230 dengan menyertakan nomor pesanan, foto/video produk yang bermasalah, dan deskripsi kendala. Tim kami akan meninjau klaim dalam waktu 1x24 jam kerja."
    },
    {
      title: "5. Metode Penyelesaian",
      content: "Setelah klaim disetujui, Henima akan memberikan salah satu dari berikut: penggantian produk baru, pengembalian dana penuh ke metode pembayaran asal, atau store credit, sesuai kesepakatan dengan pelanggan."
    },
    {
      title: "6. Estimasi Waktu Pengembalian Dana",
      content: "Pengembalian dana akan diproses dalam waktu 3-7 hari kerja setelah klaim disetujui, tergantung kebijakan masing-masing bank atau penyedia metode pembayaran."
    },
    {
      title: "7. Biaya Pengiriman Retur",
      content: "Apabila kerusakan disebabkan oleh kesalahan dari pihak Henima atau kurir, biaya pengiriman retur ditanggung oleh Henima. Apabila pengembalian disebabkan oleh kesalahan pelanggan (salah pesan, berubah pikiran), biaya pengiriman retur ditanggung oleh pelanggan."
    },
    {
      title: "8. Kontak",
      content: "Untuk pertanyaan lebih lanjut mengenai kebijakan pengembalian, silakan hubungi kami melalui WhatsApp di 085190311230."
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", fontFamily: "var(--font-jost, sans-serif)", color: "#1C1917" }}>
      <div style={{ padding: "80px 8vw 60px", borderBottom: "1px solid rgba(28,25,23,0.08)" }}>
        <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#9A8F82", marginBottom: "16px", fontWeight: 300 }}>Legal</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(40px,7vw,80px)", fontWeight: 300, color: "#1C1917", lineHeight: 1, fontStyle: "italic", marginBottom: "20px" }}>
          Kebijakan Pengembalian
        </h1>
        <div style={{ width: "40px", height: "1px", background: "#C8B89A" }} />
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 8vw 100px" }}>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "22px", fontWeight: 500, color: "#1C1917", marginBottom: "12px" }}>
              {s.title}
            </h2>
            <p style={{ fontSize: "14px", color: "#6B5E52", lineHeight: 1.9 }}>
              {s.content}
            </p>
          </div>
        ))}
        <p style={{ fontSize: "12px", color: "#9A8F82", marginTop: "60px" }}>
          Terakhir diperbarui: 20 Juni 2026
        </p>
      </div>
    </div>
  );
}
