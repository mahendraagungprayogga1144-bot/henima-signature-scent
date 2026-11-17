"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * Our Story — konten lengkap Henima, visual/font ala Kenzo Universe.
 * Animasi: hero enter + scroll reveal (tanpa floating emoji).
 */
export default function OurStoryPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);
  const envelopeOpened = useRef(false);

  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            reveal.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".hu-reveal").forEach((el) => reveal.observe(el));

    /* love messages stagger */
    const lm = document.getElementById("hu-love-msgs");
    let mo: IntersectionObserver | undefined;
    if (lm) {
      mo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              document.querySelectorAll(".hu-love-msg").forEach((m, i) =>
                setTimeout(() => m.classList.add("is-in"), i * 220)
              );
              mo?.disconnect();
            }
          });
        },
        { threshold: 0.15 }
      );
      mo.observe(lm);
    }

    /* timeline */
    const tl = timelineRef.current;
    let to: IntersectionObserver | undefined;
    if (tl) {
      to = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              tl.classList.add("hu-line-vis");
              tl.querySelectorAll(".hu-t-item").forEach((el, i) =>
                setTimeout(() => el.classList.add("is-in"), i * 180)
              );
              to?.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );
      to.observe(tl);
    }

    /* manifesto lines */
    const s0 = document.getElementById("hu-s0");
    let so: IntersectionObserver | undefined;
    if (s0) {
      so = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              document.getElementById("hu-sent-label")?.classList.add("is-in");
              for (let i = 0; i <= 4; i++) {
                setTimeout(
                  () => document.getElementById(`hu-s${i}`)?.classList.add("is-in"),
                  i * 160
                );
              }
              so?.disconnect();
            }
          });
        },
        { threshold: 0.15 }
      );
      so.observe(s0);
    }

    /* values */
    const vo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            vo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".hu-v-card").forEach((el) => vo.observe(el));

    /* counters */
    function animCount(el: HTMLElement, target: number, duration: number) {
      let start: number | null = null;
      const fmt = (v: number) =>
        target >= 1000 ? Math.round(v).toLocaleString("id-ID") : String(Math.round(v));
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        el.textContent = fmt((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = fmt(target);
      };
      requestAnimationFrame(step);
    }

    let no: IntersectionObserver | undefined;
    if (numbersRef.current) {
      no = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              document.querySelectorAll(".hu-num-card").forEach((c, i) =>
                setTimeout(() => c.classList.add("is-in"), i * 120)
              );
              const n1 = document.getElementById("hu-n1");
              const n2 = document.getElementById("hu-n2");
              const n3 = document.getElementById("hu-n3");
              if (n1) animCount(n1, 780, 1600);
              if (n2) setTimeout(() => n2 && animCount(n2, 100, 1400), 150);
              if (n3) setTimeout(() => n3 && animCount(n3, 10000, 2000), 300);
              no?.disconnect();
            }
          });
        },
        { threshold: 0.35 }
      );
      no.observe(numbersRef.current);
    }

    return () => {
      reveal.disconnect();
      mo?.disconnect();
      to?.disconnect();
      so?.disconnect();
      vo.disconnect();
      no?.disconnect();
    };
  }, []);

  function openEnvelope() {
    if (envelopeOpened.current) return;
    const env = document.getElementById("hu-envelope");
    const hint = document.getElementById("hu-env-hint");
    const expanded = document.getElementById("hu-env-expanded");
    if (!env || !hint || !expanded) return;

    env.classList.add("hu-shaking");
    setTimeout(() => {
      env.classList.remove("hu-shaking");
      env.classList.add("open");
      hint.style.opacity = "0";
      setTimeout(() => {
        expanded.classList.add("show");
        requestAnimationFrame(() =>
          requestAnimationFrame(() => expanded.classList.add("is-in"))
        );
        hint.textContent = "Opened";
        hint.style.opacity = "1";
        hint.style.letterSpacing = "0.14em";
        envelopeOpened.current = true;
      }, 650);
    }, 420);
  }

  const timelineItems = [
    {
      year: "Awal mula",
      title: "Sebuah ide dari rasa rindu",
      text: "Ketika jarak terasa terlalu jauh, muncul pertanyaan sederhana: bagaimana caranya membuat seseorang tetap terasa dekat? Jawabannya ternyata ada di aroma.",
    },
    {
      year: "Proses pertama",
      title: "Belajar dari nol, tanpa bekal",
      text: "Kami memulai tanpa latar belakang parfum, tanpa modal besar — hanya keyakinan bahwa produk lokal yang penuh makna bisa bersaing dengan siapapun.",
    },
    {
      year: "Titik balik",
      title: "Nama-nama yang lahir dari cerita nyata",
      text: "Setiap varian Henima dinamai dari momen-momen dalam perjalanan kisah cinta kami — bukan dari riset pasar, tapi dari memori yang benar-benar pernah kami rasakan.",
    },
    {
      year: "Hari ini",
      title: "Dari satu kisah, untuk jutaan cerita",
      text: "Henima kini hadir untuk semua yang pernah merasakan rindu, yang ingin mengabadikan momen, dan percaya bahwa cinta lokal bisa punya nilai dunia.",
    },
  ];

  const messages = [
    {
      side: "",
      city: "Jakarta",
      text: '"Malam ini terasa lebih sepi dari biasanya. Aku bisa menutup mata dan masih ingat betul bagaimana aromamu..."',
      time: "23:14",
    },
    {
      side: "right",
      city: "Surabaya",
      text: '"Aku juga. Jarak ini yang membuat aku sadar — ada hal-hal yang tidak bisa digantikan kata-kata. Hanya perasaan yang tersisa."',
      time: "23:17",
    },
    {
      side: "",
      city: "Jakarta",
      text: '"Bagaimana jika ada cara untuk membawa perasaan ini — bukan dalam kata-kata, tapi dalam sesuatu yang bisa dirasakan setiap hari?"',
      time: "23:31",
    },
    {
      side: "right",
      city: "Surabaya",
      text: '"Dan dari pertanyaan itulah, Henima lahir."',
      time: "23:33",
    },
  ];

  const manifesto = [
    {
      id: "hu-s0",
      num: "01",
      bold: "cinta sejati layak dikenang",
      rest: "— dan aroma adalah cara terbaik untuk mengingatnya.",
    },
    {
      id: "hu-s1",
      num: "02",
      bold: "produk lokal bisa menyentuh hati dunia",
      rest: "— jika dibuat dengan niat yang benar.",
    },
    {
      id: "hu-s2",
      num: "03",
      bold: "jarak bukan penghalang",
      rest: "— ia hanya membuat momen bersama terasa lebih berharga.",
    },
    {
      id: "hu-s3",
      num: "04",
      bold: "setiap orang punya cerita cinta yang layak diabadikan",
      rest: "— dan itu adalah tugas kami.",
    },
    {
      id: "hu-s4",
      num: "05",
      bold: "kemewahan sejati adalah perasaan",
      rest: ", bukan angka di label harga.",
    },
  ];

  const values = [
    {
      num: "I",
      title: "Ketulusan di atas segalanya",
      text: "Setiap produk lahir dari cerita nyata, bukan riset pasar. Kami hanya membuat apa yang kami sendiri percayai — dan itu yang membuat Henima berbeda.",
      delay: "0s",
    },
    {
      num: "II",
      title: "Lokal adalah kebanggaan",
      text: "Kami bangga buatan Indonesia. Bukan sebagai klaim, tapi sebagai keyakinan bahwa tangan dan cerita kita sendiri mampu menyentuh hati jutaan orang.",
      delay: "0.12s",
    },
    {
      num: "III",
      title: "Makna lebih dari kemewahan",
      text: "Luxury sejati bukan soal harga. Ini soal bagaimana sebuah aroma membuat pemakainya merasa — dihargai, dikenang, dan terhubung dengan seseorang yang berarti.",
      delay: "0.24s",
    },
  ];

  return (
    <div className="hu-wrap">
      {/* Hero */}
      <section className="hu-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/layout/chapter-afternoon.jpg" alt="" className="hu-hero-img" />
        <div className="hu-hero-shade" />
        <div className="hu-hero-copy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/henima-logo-white-tight.png"
            alt="Henima"
            className="hu-hero-logo hu-anim hu-anim-1"
          />
          <p className="hu-hero-eyebrow hu-anim hu-anim-2">Our Story — Signature Scent</p>
          <h1 className="hu-hero-title hu-anim hu-anim-3">
            Jakarta. Surabaya.
            <br />
            One love story.
          </h1>
          <div className="hu-hero-rule" aria-hidden />
          <p className="hu-hero-sub hu-anim hu-anim-4">
            Setiap botol Henima menyimpan sebuah kisah nyata — tentang rindu yang tulus, jarak yang
            dijalani, dan cinta yang memilih untuk bertahan.
          </p>
          <div className="hu-dist hu-anim hu-anim-5">
            <span>Jakarta</span>
            <div className="hu-track">
              <div className="hu-dot" />
            </div>
            <span>Surabaya</span>
            <span className="hu-dlabel">— 780 km of love</span>
          </div>
        </div>
      </section>

      {/* Beginning */}
      <section className="hu-section hu-section--soft">
        <div className="hu-inner hu-inner--wide">
          <div className="hu-ch1">
            <div className="hu-reveal">
              <p className="hu-label">The beginning</p>
              <h2 className="hu-h2 hu-h2--story">
                Dimulai dari
                <br />
                jarak 780 kilometer.
              </h2>
              <p className="hu-p hu-p--left">
                Henima lahir dari sesuatu yang sangat sederhana dan sangat manusiawi — dua orang
                yang saling mencintai, dipisahkan oleh jarak Jakarta dan Surabaya. Di antara
                panggilan telepon yang tak pernah cukup, ada satu hal yang tetap tinggal: sebuah
                aroma yang mengingatkan pada kehadiran seseorang.
              </p>
              <p className="hu-p hu-p--left">
                Dari pengalaman itulah Henima Signature Scent hadir. Bukan sebagai bisnis semata,
                tapi sebagai medium — cara untuk membawa seseorang tetap dekat, meski raganya jauh.
              </p>
              <p className="hu-p hu-p--left">
                Kami memulai tanpa pengetahuan apapun tentang parfum. Hanya keberanian, keyakinan,
                dan sebuah cerita yang terlalu sayang untuk disimpan sendiri.
              </p>
            </div>
            <div className="hu-quote-block hu-reveal hu-delay-2">
              <blockquote className="hu-quote">
                &ldquo;Aroma adalah satu-satunya indera yang langsung terhubung ke memori. Kami
                tidak membuat parfum — kami membuat kenangan.&rdquo;
              </blockquote>
              <p className="hu-quote-cite">— Founder, Henima Signature Scent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Love scene */}
      <section className="hu-love">
        <div className="hu-inner">
          <p className="hu-label hu-label--light hu-reveal">A love story across distance</p>

          <div className="hu-env-wrap hu-reveal">
            <button
              type="button"
              className="hu-envelope"
              id="hu-envelope"
              onClick={openEnvelope}
              aria-label="Buka surat"
            >
              <span className="hu-env-body">
                <span className="hu-env-flap" />
                <span className="hu-env-letter">
                  <span className="hu-env-letter-text">
                    &ldquo;Aku rindu aromamu lebih dari yang bisa kukatakan...&rdquo;
                  </span>
                </span>
                <span className="hu-env-seal" aria-hidden />
              </span>
            </button>
            <p className="hu-env-hint" id="hu-env-hint">
              Ketuk untuk membuka
            </p>
          </div>

          <div className="hu-env-expanded" id="hu-env-expanded">
            <p className="hu-env-exp-date">Suatu malam, antara Jakarta dan Surabaya</p>
            <div className="hu-env-exp-body">
              <p>
                Ada malam-malam ketika rindu itu terasa lebih berat dari biasanya. Ketika layar
                telepon tidak cukup, ketika jarak 780 kilometer terasa seperti tak terbatas.
              </p>
              <p>
                Di malam seperti itulah kami bertanya — apakah ada cara untuk membuat seseorang
                tetap terasa <em>hadir</em>, meski raganya jauh?
              </p>
              <p>
                Jawabannya ternyata sederhana. Sebuah aroma yang mengingatkan padanya. Wewangian
                yang, ketika dihirup, membawa kembali semua kenangan — suaranya, senyumnya,
                kehangatan yang tak bisa dijelaskan kata-kata.
              </p>
              <p>Dari pertanyaan sederhana itulah Henima lahir.</p>
            </div>
            <p className="hu-env-exp-sign">— Dengan cinta, Henima</p>
          </div>

          <div className="hu-love-messages" id="hu-love-msgs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`hu-love-msg ${m.side}`}
                style={{ ["--dir" as string]: m.side === "right" ? "20px" : "-20px" }}
              >
                <div className="hu-msg-avatar" aria-hidden>
                  {m.city.slice(0, 1)}
                </div>
                <div className="hu-msg-bubble">
                  <p className="hu-msg-name">{m.city}</p>
                  <p className="hu-msg-text">{m.text}</p>
                  <p className="hu-msg-time">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="hu-numbers" ref={numbersRef}>
        {[
          { id: "hu-n1", suffix: " km", label: "Jarak yang menjadi awal segalanya" },
          { id: "hu-n2", suffix: "%", label: "Produk dibuat dengan cerita nyata" },
          { id: "hu-n3", suffix: "+", label: "Kenangan yang telah diabadikan" },
        ].map((n) => (
          <div key={n.id} className="hu-num-card">
            <div className="hu-num-big">
              <span className="hu-num-val" id={n.id}>
                0
              </span>
              <span className="hu-num-suffix">{n.suffix}</span>
            </div>
            <p className="hu-num-label">{n.label}</p>
          </div>
        ))}
      </section>

      {/* Split media + variants note */}
      <section className="hu-split">
        <div className="hu-split-media hu-reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/layout/chapter-distance.jpg" alt="" />
        </div>
        <div className="hu-split-text">
          <p className="hu-label hu-reveal">The scents</p>
          <h2 className="hu-h2 hu-h2--story hu-reveal">
            Setiap varian
            <br />
            dari momen nyata.
          </h2>
          <p className="hu-p hu-p--left hu-reveal hu-delay-1">
            Afternoon, The Distance, Signature, Intimate, Beloved — bukan dari riset pasar, tapi
            dari memori yang benar-benar pernah kami rasakan dalam perjalanan cinta itu.
          </p>
          <p className="hu-p hu-p--left hu-reveal hu-delay-2">
            Bagaimana jika ada cara untuk membawa perasaan ini — bukan dalam kata-kata, tapi dalam
            sesuatu yang bisa dirasakan setiap hari? Dari pertanyaan itulah, Henima lahir.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="hu-section">
        <div className="hu-inner">
          <p className="hu-label hu-reveal">The journey</p>
          <h2 className="hu-h2 hu-h2--story hu-reveal" style={{ maxWidth: 560, marginBottom: 48 }}>
            Perjalanan yang tidak pernah kami bayangkan akan sejauh ini.
          </h2>
          <div className="hu-timeline" ref={timelineRef}>
            {timelineItems.map((t, i) => (
              <div key={i} className="hu-t-item">
                <div className="hu-t-dot" />
                <p className="hu-t-year">{t.year}</p>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="hu-manifesto">
        <div className="hu-inner">
          <p className="hu-sent-label" id="hu-sent-label">
            Yang kami percaya
          </p>
          {manifesto.map((m) => (
            <div key={m.id} className="hu-s-line" id={m.id}>
              <span className="hu-s-num">{m.num}</span>
              <p className="hu-s-text">
                Kami percaya bahwa <strong>{m.bold}</strong> {m.rest}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="hu-section">
        <div className="hu-inner hu-inner--wide">
          <p className="hu-label hu-reveal">What we stand for</p>
          <h2 className="hu-h2 hu-h2--story hu-reveal">
            Tiga hal yang tidak pernah
            <br />
            kami kompromikan.
          </h2>
          <div className="hu-values">
            {values.map((v, i) => (
              <div key={i} className="hu-v-card" style={{ transitionDelay: v.delay }}>
                <div className="hu-v-num">{v.num}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="hu-section hu-section--soft">
        <div className="hu-inner hu-vision hu-reveal">
          <p className="hu-label">Our vision</p>
          <h2 className="hu-vision-quote">
            &ldquo;Menjadi brand wewangian lokal yang paling dicintai di Indonesia — bukan hanya
            karena kualitasnya, tapi karena makna dan cerita di balik setiap tetesnya.&rdquo;
          </h2>
          <p className="hu-p">
            Kami tidak berlomba menjadi yang terbesar. Kami ingin menjadi yang paling diingat —
            brand yang namanya disebut saat seseorang ingin memberikan sesuatu yang benar-benar
            berarti.
          </p>
          <div className="hu-pills">
            {["Emotional Meaning", "Indonesian Pride", "True Quality", "Real Stories", "Lasting Memory"].map(
              (p) => (
                <span key={p} className="hu-pill">
                  {p}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hu-cta">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/henima-mark.png" alt="" className="hu-cta-mark hu-reveal" />
        <h2 className="hu-h2 hu-h2--story hu-reveal hu-delay-1">
          Temukan wewangian yang
          <br />
          menceritakan kisahmu.
        </h2>
        <p className="hu-p hu-reveal hu-delay-2">
          Setiap koleksi Henima membawa sebuah cerita.
          <br />
          Temukan yang paling dekat dengan hatimu.
        </p>
        <Link href="/shop" className="hu-btn hu-reveal hu-delay-3">
          Jelajahi Koleksi
        </Link>
        <Link href="/share-story" className="hu-cta-sub hu-reveal hu-delay-3">
          Atau ceritakan kisahmu kepada kami →
        </Link>
      </section>

      <style>{`
        .hu-wrap {
          background: #FFFFFF;
          color: #212529;
          font-family: var(--font-futura-nav), FuturaBT-Medium, Futura, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          overflow-x: hidden;
        }
        .hu-wrap *, .hu-wrap *::before, .hu-wrap *::after { box-sizing: border-box; }

        @keyframes hu-fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hu-grow {
          from { width: 0; opacity: 0.4; }
          to { width: 48px; opacity: 1; }
        }
        @keyframes hu-kenBurns {
          from { transform: scale(1.06); }
          to { transform: scale(1); }
        }
        @keyframes hu-travel {
          0% { left: 0; opacity: 1; }
          45% { left: calc(100% - 6px); opacity: 1; }
          50% { left: calc(100% - 6px); opacity: 0; }
          55% { left: 0; opacity: 0; }
          60% { left: 0; opacity: 1; }
          100% { left: calc(100% - 6px); opacity: 1; }
        }
        @keyframes hu-env-shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-3deg) scale(1.02); }
          40% { transform: rotate(3deg) scale(1.03); }
          60% { transform: rotate(-2deg); }
          80% { transform: rotate(1deg); }
        }

        .hu-anim {
          opacity: 0;
          animation: hu-fadeUp 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hu-anim-1 { animation-delay: 0.15s; }
        .hu-anim-2 { animation-delay: 0.35s; }
        .hu-anim-3 { animation-delay: 0.55s; }
        .hu-anim-4 { animation-delay: 1.0s; }
        .hu-anim-5 { animation-delay: 1.15s; }
        .hu-hero-logo {
          display: block;
          width: min(220px, 52vw);
          height: auto;
          margin: 0 auto 22px;
        }
        .hu-hero-rule {
          height: 1px;
          width: 0;
          background: rgba(255,255,255,0.7);
          margin: 20px auto 0;
          opacity: 0;
          animation: hu-grow 0.9s 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hu-cta-mark {
          display: block;
          width: 56px;
          height: auto;
          margin: 0 auto 28px;
          opacity: 0.9;
        }

        .hu-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hu-reveal.is-in { opacity: 1; transform: translateY(0); }
        .hu-delay-1 { transition-delay: 0.08s; }
        .hu-delay-2 { transition-delay: 0.16s; }
        .hu-delay-3 { transition-delay: 0.24s; }

        .hu-hero {
          position: relative;
          width: 100%;
          height: min(88vh, 720px);
          overflow: hidden;
          background: #111;
        }
        .hu-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          animation: hu-kenBurns 8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hu-hero-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.2) 45%, transparent 100%);
        }
        .hu-hero-copy {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 0 24px 52px;
          text-align: center;
          z-index: 1;
        }
        .hu-hero-eyebrow {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
        }
        .hu-hero-title {
          margin: 0;
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #fff;
          line-height: 1.2;
        }
        .hu-hero-sub {
          margin: 18px 0 0;
          max-width: 480px;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255,255,255,0.82);
        }
        .hu-dist {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 28px;
          color: rgba(255,255,255,0.9);
          font-size: 13px;
          letter-spacing: 0.06em;
        }
        .hu-track {
          position: relative;
          width: 72px;
          height: 1px;
          background: rgba(255,255,255,0.35);
        }
        .hu-dot {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          animation: hu-travel 3s ease-in-out infinite;
        }
        .hu-dlabel {
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.55);
        }

        .hu-section { background: #fff; padding: 88px 24px; }
        .hu-section--soft { background: #FAFAFA; }
        .hu-inner { max-width: 720px; margin: 0 auto; }
        .hu-inner--wide { max-width: 1080px; }

        .hu-label {
          margin: 0 0 16px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #868e96;
        }
        .hu-label--light { color: rgba(255,255,255,0.55); }

        .hu-h2 {
          margin: 0 0 16px;
          font-size: 32px;
          font-weight: 500;
          line-height: 1.2;
          color: #212529;
          letter-spacing: 0.02em;
        }
        .hu-h2--story {
          text-transform: none;
          font-size: clamp(24px, 3.2vw, 36px);
          line-height: 1.25;
        }
        .hu-p {
          margin: 0 0 18px;
          font-size: 16px;
          line-height: 1.75;
          color: #495057;
        }
        .hu-p--left { text-align: left; }

        .hu-ch1 {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 64px;
          align-items: start;
        }
        .hu-quote {
          margin: 0;
          padding-left: 24px;
          border-left: 2px solid #212121;
          font-size: clamp(18px, 2vw, 24px);
          line-height: 1.5;
          font-style: italic;
          color: #212529;
        }
        .hu-quote-cite {
          margin: 14px 0 0;
          padding-left: 24px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #868e96;
        }

        .hu-love {
          background: #111;
          color: #f5f5f5;
          padding: 88px 24px;
        }
        .hu-env-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 36px 0 48px;
        }
        .hu-envelope {
          position: relative;
          width: 220px;
          height: 150px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .hu-envelope:hover { transform: scale(1.02); }
        .hu-envelope.hu-shaking { animation: hu-env-shake 0.42s ease; }
        .hu-env-body {
          position: absolute;
          inset: 0;
          background: #1c1c1c;
          border: 1px solid rgba(255,255,255,0.18);
          display: block;
          overflow: hidden;
        }
        .hu-env-flap {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 80px;
          clip-path: polygon(0 0, 50% 60%, 100% 0);
          background: #262626;
          transform-origin: top center;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
        }
        .hu-envelope.open .hu-env-flap { transform: rotateX(-185deg); }
        .hu-env-letter {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 100px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) 0.35s;
        }
        .hu-envelope.open .hu-env-letter { transform: translateX(-50%) translateY(-78px); }
        .hu-env-letter-text {
          font-size: 11px;
          font-style: italic;
          color: #212529;
          text-align: center;
          line-height: 1.55;
          padding: 12px;
        }
        .hu-env-seal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.08);
          transition: opacity 0.3s;
        }
        .hu-envelope.open .hu-env-seal { opacity: 0; }
        .hu-env-hint {
          margin-top: 14px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          transition: opacity 0.3s;
        }
        .hu-env-expanded {
          max-width: 560px;
          margin: 0 auto 56px;
          padding: 32px 36px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.03);
          display: none;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hu-env-expanded.show { display: block; }
        .hu-env-expanded.is-in { opacity: 1; transform: none; }
        .hu-env-exp-date {
          margin: 0 0 18px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
        .hu-env-exp-body {
          font-size: 15px;
          line-height: 1.85;
          color: rgba(255,255,255,0.78);
          font-style: italic;
        }
        .hu-env-exp-body p { margin: 0 0 14px; }
        .hu-env-exp-sign {
          margin: 22px 0 0;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.12);
          font-style: italic;
          color: rgba(255,255,255,0.7);
        }

        .hu-love-messages { display: flex; flex-direction: column; gap: 28px; }
        .hu-love-msg {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          opacity: 0;
          transform: translateX(var(--dir, -20px));
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hu-love-msg.is-in { opacity: 1; transform: none; }
        .hu-love-msg.right { flex-direction: row-reverse; }
        .hu-msg-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.7);
          flex-shrink: 0;
        }
        .hu-msg-bubble {
          max-width: 440px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .hu-msg-name {
          margin: 0 0 6px;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .hu-msg-text {
          margin: 0;
          font-size: 15px;
          font-style: italic;
          line-height: 1.7;
          color: rgba(255,255,255,0.82);
        }
        .hu-msg-time {
          margin: 8px 0 0;
          font-size: 10px;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.28);
        }

        .hu-numbers {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background: #0d0d0d;
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .hu-num-card {
          padding: 56px 28px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hu-num-card:last-child { border-right: none; }
        .hu-num-card.is-in { opacity: 1; transform: none; }
        .hu-num-big {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 12px;
          font-size: clamp(2.4rem, 5vw, 4rem);
          line-height: 1;
          color: #fff;
        }
        .hu-num-suffix { color: rgba(255,255,255,0.55); font-size: 0.55em; }
        .hu-num-label {
          margin: 0;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          line-height: 1.5;
        }

        .hu-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 480px;
          margin-top: 28px;
          background: #fff;
        }
        .hu-split-media {
          position: relative;
          min-height: 360px;
          overflow: hidden;
          background: #eee;
        }
        .hu-split-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hu-split-media.is-in img { transform: scale(1.04); }
        .hu-split-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 48px;
        }

        .hu-timeline {
          position: relative;
          padding-left: 36px;
        }
        .hu-timeline::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background: #dee2e6;
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 1.3s ease;
        }
        .hu-timeline.hu-line-vis::before { transform: scaleY(1); }
        .hu-t-item {
          position: relative;
          padding-bottom: 48px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hu-t-item.is-in { opacity: 1; transform: none; }
        .hu-t-item:last-child { padding-bottom: 0; }
        .hu-t-dot {
          position: absolute;
          left: -40px;
          top: 6px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #fff;
          border: 1.5px solid #212121;
        }
        .hu-t-year {
          margin: 0 0 8px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #868e96;
        }
        .hu-t-item h3 {
          margin: 0 0 10px;
          font-size: 20px;
          font-weight: 500;
          color: #212529;
        }
        .hu-t-item p {
          margin: 0;
          font-size: 15px;
          line-height: 1.8;
          color: #495057;
          max-width: 520px;
        }

        .hu-manifesto {
          background: #111;
          padding: 88px 24px;
        }
        .hu-sent-label {
          margin: 0 0 40px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          opacity: 0;
          transition: opacity 0.6s;
        }
        .hu-sent-label.is-in { opacity: 1; }
        .hu-s-line {
          display: flex;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .hu-s-line:first-of-type { border-top: 1px solid rgba(255,255,255,0.1); }
        .hu-s-num {
          flex-shrink: 0;
          padding-top: 4px;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.3);
        }
        .hu-s-text {
          margin: 0;
          font-size: clamp(16px, 2vw, 22px);
          line-height: 1.55;
          color: rgba(255,255,255,0.18);
          transform: translateY(100%);
          transition: color 0.6s ease, transform 0.7s ease;
        }
        .hu-s-text strong { font-weight: 500; color: rgba(255,255,255,0.55); }
        .hu-s-line.is-in .hu-s-text {
          transform: translateY(0);
          color: rgba(255,255,255,0.78);
        }
        .hu-s-line.is-in .hu-s-text strong { color: #fff; }

        .hu-values {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          margin-top: 40px;
          background: #dee2e6;
          border: 1px solid #dee2e6;
        }
        .hu-v-card {
          background: #fff;
          padding: 40px 28px;
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hu-v-card.is-in { opacity: 1; transform: none; }
        .hu-v-num {
          margin-bottom: 18px;
          font-size: 42px;
          line-height: 1;
          color: rgba(33,37,41,0.12);
        }
        .hu-v-card h3 {
          margin: 0 0 12px;
          font-size: 18px;
          font-weight: 500;
          color: #212529;
          line-height: 1.3;
        }
        .hu-v-card p {
          margin: 0;
          font-size: 14px;
          line-height: 1.8;
          color: #495057;
        }

        .hu-vision { text-align: center; }
        .hu-vision-quote {
          margin: 0 0 24px;
          font-size: clamp(20px, 2.8vw, 30px);
          font-weight: 400;
          font-style: italic;
          line-height: 1.45;
          color: #212529;
        }
        .hu-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 28px;
        }
        .hu-pill {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 8px 16px;
          border: 1px solid #dee2e6;
          color: #495057;
        }

        .hu-cta {
          padding: 100px 24px;
          text-align: center;
          background: #FAFAFA;
          border-top: 1px solid #eee;
        }
        .hu-btn {
          display: inline-block;
          margin-top: 12px;
          padding: 14px 36px;
          background: #212121;
          color: #fff;
          text-decoration: none;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: opacity 0.2s, transform 0.25s;
        }
        .hu-btn:hover { opacity: 0.88; transform: translateY(-2px); }
        .hu-cta-sub {
          display: block;
          width: fit-content;
          margin: 22px auto 0;
          font-size: 13px;
          color: #495057;
          text-decoration: none;
          border-bottom: 1px solid #dee2e6;
          padding-bottom: 2px;
          transition: color 0.2s, border-color 0.2s;
        }
        .hu-cta-sub:hover { color: #212121; border-color: #212121; }

        @media (max-width: 767px) {
          .hu-hero { height: 70vh; min-height: 420px; }
          .hu-hero-copy { padding-bottom: 36px; }
          .hu-dist { flex-wrap: wrap; justify-content: center; gap: 10px; }
          .hu-section, .hu-love, .hu-manifesto, .hu-cta { padding: 64px 20px; }
          .hu-ch1 { grid-template-columns: 1fr; gap: 36px; }
          .hu-split { grid-template-columns: 1fr; }
          .hu-split-media { min-height: 280px; }
          .hu-split-text { padding: 40px 20px 48px; }
          .hu-h2--story, .hu-p--left { text-align: left; }
          .hu-numbers { grid-template-columns: 1fr; }
          .hu-num-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .hu-num-card:last-child { border-bottom: none; }
          .hu-values { grid-template-columns: 1fr; }
          .hu-love-msg, .hu-love-msg.right { flex-direction: column; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hu-anim, .hu-hero-img, .hu-dot { animation: none !important; opacity: 1 !important; transform: none !important; }
          .hu-reveal, .hu-love-msg, .hu-t-item, .hu-v-card, .hu-num-card, .hu-s-text {
            opacity: 1 !important; transform: none !important; transition: none !important;
          }
          .hu-timeline::before { transform: scaleY(1); }
          .hu-sent-label { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
