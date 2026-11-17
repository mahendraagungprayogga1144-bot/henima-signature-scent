# Henima Design System

Token visual yang dipakai di seluruh website. Pakai ini untuk halaman baru agar konsisten.

## Colors

| Token | Hex | Usage |
|-------|-----|--------|
| White | `#FFFFFF` | Background utama |
| Soft white | `#F5F5F4` | Panel sekunder, gallery empty |
| Ink | `#111111` | Teks utama, CTA solid |
| Muted | `#737373` | Body sekunder |
| Soft muted | `#A3A3A3` | Placeholder, hint, meta |
| Line | `rgba(17,17,17,0.08)` | Divider tipis |
| White text | `#FFFFFF` | Teks di hero gelap / footer ink |

### The Intimate tier accents

| Tier | Color |
|------|-------|
| Signature | `#525252` |
| Intimate | `#404040` |
| Soulscent | `#262626` |
| Beloved | `#171717` |

## Typography

- **Semua teks (display + body):** `var(--font-jakarta)` — Plus Jakarta Sans
- Alias lama masih valid: `--font-jost` / `--font-cormorant` → Jakarta
- Brand mark: letter-spacing lebar, uppercase
- Label form: 10–11px, uppercase, letter-spacing ~2–3px, warna muted
- CTA: 10–12px, uppercase, letter-spacing ~2–3px

## Forms

- Input: tanpa border box; underline tipis `1px solid rgba(17,17,17,0.15)`
- Focus: underline `#111111`
- Background form: white
- Submit: solid `#111111`, teks `#FFFFFF`

## Spacing

- Page horizontal padding: `8vw` (mobile `6vw` / `24px`)
- Section vertical: ~80–120px
- Form field gap: ~20–28px

## Motion

- Reveal: `cubic-bezier(0.16, 1, 0.3, 1)` ~0.9–1.2s
- Image hover: scale 1.04, 0.8s
- Nav: blur + fade on scroll

## Auth split layout

- Desktop: 50/50 — kiri foto full-bleed, kanan form
- Mobile: foto di atas (min-height ~40vw) atau sembunyikan, form full width
