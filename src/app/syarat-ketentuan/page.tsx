export default function TermsPage() {
  const sections = [
    {
      title: "1. Penggunaan Website",
      content: "Dengan mengakses dan menggunakan website henimaofficial.com, Anda menyetujui untuk terikat dengan Syarat & Ketentuan ini. Website ini dioperasikan oleh Henima Signature Scent untuk menjual produk parfum secara daring di wilayah Indonesia."
    },
    {
      title: "2. Pemesanan",
      content: "Pemesanan dianggap sah setelah pelanggan melengkapi proses checkout dan melakukan pembayaran sesuai metode yang tersedia. Henima berhak membatalkan pesanan apabila terjadi kesalahan harga, stok tidak tersedia, atau indikasi kecurangan."
    },
    {
      title: "3. Harga dan Pembayaran",
      content: "Seluruh harga produk tercantum dalam Rupiah (IDR) dan sudah termasuk pajak yang berlaku, kecuali biaya pengiriman yang dihitung terpisah berdasarkan lokasi pelanggan. Pembayaran dapat dilakukan melalui transfer bank, virtual account, QRIS, atau metode lain yang tersedia di halaman checkout."
    },
    {
      title: "4. Pengiriman",
      content: "Estimasi waktu pengiriman bervariasi tergantung lokasi tujuan dan jasa kurir yang dipilih. Henima tidak bertanggung jawab atas keterlambatan yang disebabkan oleh pihak jasa kurir, cuaca, atau kondisi di luar kendali kami."
    },
    {
      title: "5. Hak Kekayaan Intelektual",
      content: "Seluruh konten di website ini, termasuk namun tidak terbatas pada logo, nama produk, foto, dan teks, merupakan milik Henima Signature Scent dan dilindungi oleh hukum hak cipta yang berlaku."
    },
    {
      title: "6. Perubahan Ketentuan",
      content: "Henima berhak mengubah Syarat & Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan akan berlaku efektif sejak dipublikasikan di halaman ini."
    },
    {
      title: "7. Kontak",
      content: "Untuk pertanyaan terkait Syarat & Ketentuan ini, silakan hubungi kami melalui WhatsApp di 085190311230 atau email yang tertera di halaman kontak kami."
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", fontFamily: "var(--font-jost, sans-serif)", color: "#1C1917" }}>
      <div style={{ padding: "80px 8vw 60px", borderBottom: "1px solid rgba(28,25,23,0.08)" }}>
        <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#9A8F82", marginBottom: "16px", fontWeight: 300 }}>Legal</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(40px,7vw,80px)", fontWeight: 300, color: "#1C1917", lineHeight: 1, fontStyle: "italic", marginBottom: "20px" }}>
          Syarat & Ketentuan
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
