export default function AnnouncementBar() {
  const items = ["Henima", "Signature of Your Story", "Afternoon", "The Distance", "Luxury Scent", "Crafted For You"];

  return (
    <div className="overflow-hidden bg-ink-900 border-b border-ink-800 py-2.5">
      <div className="flex whitespace-nowrap">
        <div className="animate-marquee flex items-center shrink-0">
          {items.map((text, i) => (
            <span key={i} className="mx-8 text-xs font-medium tracking-[0.25em] uppercase text-ink-300">
              {text}
              {i < items.length - 1 && <span className="ml-8 text-gold-500">·</span>}
            </span>
          ))}
        </div>
        <div className="animate-marquee flex items-center shrink-0" aria-hidden>
          {items.map((text, i) => (
            <span key={i} className="mx-8 text-xs font-medium tracking-[0.25em] uppercase text-ink-300">
              {text}
              {i < items.length - 1 && <span className="ml-8 text-gold-500">·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
