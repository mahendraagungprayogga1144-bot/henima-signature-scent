import { promises as fs } from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import type { Order, Settings } from "./types";
import { formatRupiah } from "./format";

export async function generateInvoicePdf(params: {
  order: Order;
  settings: Settings;
}): Promise<{ publicPath: string }> {
  const { order, settings } = params;

  const dir = path.join(process.cwd(), "public", "uploads", "invoices");
  await fs.mkdir(dir, { recursive: true });

  const filename = `invoice-${order.id}.pdf`;
  const outPath = path.join(dir, filename);

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const stream = (await fs.open(outPath, "w")).createWriteStream();

  const done = new Promise<void>((resolve, reject) => {
    stream.on("finish", () => resolve());
    stream.on("error", (e) => reject(e));
  });

  doc.pipe(stream);

  doc.fontSize(18).text(settings.company.name, { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor("#444").text("INVOICE", { align: "left" });
  doc.fillColor("black");

  doc.moveDown();
  doc.fontSize(10).text(`Invoice: ${order.id}`);
  doc.text(`Tanggal: ${new Date(order.paymentConfirmedAt || order.createdAt).toLocaleString("id-ID")}`);
  doc.moveDown();

  doc.fontSize(11).text("Dikirim ke:");
  doc.fontSize(10).fillColor("#333");
  doc.text(order.shipping.fullName);
  doc.text(order.shipping.phone);
  doc.text(order.shipping.address);
  const cityLine = [order.shipping.city, order.shipping.province, order.shipping.postalCode]
    .filter(Boolean)
    .join(", ");
  if (cityLine) doc.text(cityLine);
  doc.fillColor("black");

  doc.moveDown();
  doc.fontSize(11).text("Rincian:");
  doc.moveDown(0.5);

  order.items.forEach((it) => {
    doc.fontSize(10).text(
      `${it.productName} ${it.sizeMl}ml × ${it.quantity}  —  ${formatRupiah(it.subtotal)}`
    );
  });

  doc.moveDown();
  doc.fontSize(12).text(`Total: ${formatRupiah(order.total)}`, { align: "right" });
  doc.moveDown();

  doc.fontSize(9).fillColor("#666");
  doc.text("Terima kasih telah berbelanja di Henima Signature Scent.");
  doc.end();

  await done;
  await stream.close();

  return { publicPath: `/uploads/invoices/${filename}` };
}

