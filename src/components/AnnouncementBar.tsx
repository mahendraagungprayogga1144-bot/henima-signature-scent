export default function AnnouncementBar() {
  const text = "✦ HENIMA SIGNATURE SCENT ✦ Luxury Scent, Crafted For Your Signature ✦ FREE ONGKIR untuk reseller baru ✦ HENIMA SIGNATURE SCENT ✦ Luxury Scent, Crafted For Your Signature ✦ FREE ONGKIR untuk reseller baru ✦";

  return (
    <div className="bg-ink-950 border-b border-ink-800 overflow-hidden py-2">
      <div className="flex whitespace-nowrap">
        <div className="animate-marquee flex gap-8 text-xs font-semibold tracking-[0.15em] text-gold-300">
          {text}
        </div>
        <div className="animate-marquee flex gap-8 text-xs font-semibold tracking-[0.15em] text-gold-300 ml-8" aria-hidden>
          {text}
        </div>
      </div>
    </div>
  );
}
