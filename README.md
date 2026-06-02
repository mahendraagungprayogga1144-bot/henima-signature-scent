# Toko Reseller

Portal pemesanan untuk reseller kopi — Next.js, Tailwind CSS, database JSON.

## Fitur

- Login & daftar reseller
- Katalog produk (Afternoon, Distance)
- Form pemesanan & pembayaran (Transfer BCA, QRIS)
- Unggah bukti pembayaran
- Pelacakan status pesanan
- Dashboard admin
- Notifikasi WhatsApp saat status berubah

## Menjalankan

```bash
cd ~/Projects/toko-reseller
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Akun demo

| Peran | Email | Kata sandi |
|-------|-------|------------|
| Admin | admin@toko.local | admin123 |
| Reseller | reseller@demo.local | reseller123 |

## WhatsApp

Setel di `.env.local`:

```
WHATSAPP_PHONE=6281234567890
```

Nomor tanpa `+`, format Indonesia (62...). Saat admin mengubah status pesanan, sistem membuat tautan `wa.me` untuk mengirim pesan ke reseller.

## Data

File `data/db.json` menyimpan pengguna, produk, dan pesanan. Unggahan bukti disimpan di `public/uploads/`.
