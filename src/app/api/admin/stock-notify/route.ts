import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'
import { getCurrentUser } from '@/lib/session'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { productId, productName } = await request.json()
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data: notifs } = await supabase
    .from('stock_notifications')
    .select('*')
    .eq('product_id', productId)
    .eq('notified', false)

  if (!notifs || notifs.length === 0) return NextResponse.json({ sent: 0 })

  let sent = 0
  for (const n of notifs) {
    try {
      await resend.emails.send({
        from: 'Henima Signature Scent <noreply@henimaofficial.com>',
        to: n.email,
        subject: `${productName} sudah tersedia kembali!`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family:Georgia,serif;background:#FAF8F4;margin:0;padding:0;">
            <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
              <div style="text-align:center;margin-bottom:40px;">
                <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:300;letter-spacing:8px;color:#1C1917;margin:0;">HENIMA</h1>
                <p style="font-size:10px;letter-spacing:3px;color:#9A8F82;text-transform:uppercase;margin-top:4px;">Signature Scent</p>
              </div>
              <div style="border-top:1px solid #E8E0D5;border-bottom:1px solid #E8E0D5;padding:32px 0;margin-bottom:32px;text-align:center;">
                <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B5935A;margin-bottom:8px;">Stok Sudah Tersedia</p>
                <h2 style="font-size:24px;font-weight:300;color:#1C1917;margin:0;">${productName}</h2>
              </div>
              <p style="font-size:14px;color:#6B5E52;line-height:1.8;margin-bottom:32px;text-align:center;">
                Kabar baik! Produk yang kamu tunggu sudah tersedia kembali.<br/>Segera dapatkan sebelum kehabisan.
              </p>
              <div style="text-align:center;margin-bottom:32px;">
                <a href="https://henimaofficial.com/shop" style="display:inline-block;background:#1C1917;color:#FAF8F4;padding:14px 48px;font-size:10px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;">Beli Sekarang</a>
              </div>
              <div style="border-top:1px solid #E8E0D5;margin-top:32px;padding-top:24px;text-align:center;">
                <p style="font-size:10px;color:#C8B89A;letter-spacing:2px;">HENIMA SIGNATURE SCENT · MADE IN INDONESIA</p>
              </div>
            </div>
          </body>
          </html>
        `
      })
      await supabase.from('stock_notifications').update({ notified: true, notified_at: new Date().toISOString() }).eq('id', n.id)
      sent++
    } catch(e) { console.error(e) }
  }

  return NextResponse.json({ sent })
}
