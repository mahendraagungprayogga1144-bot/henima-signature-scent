'use client'

import { useEffect, useRef } from 'react'

export default function OurStoryPage() {
  const progressRef  = useRef<HTMLDivElement>(null)
  const navRef       = useRef<HTMLElement>(null)
  const heroHeartsRef= useRef<HTMLDivElement>(null)
  const loveFloatsRef= useRef<HTMLDivElement>(null)
  const timelineRef  = useRef<HTMLDivElement>(null)
  const numbersRef   = useRef<HTMLDivElement>(null)
  const envWrapRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /* ── scroll: progress + nav ── */
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100
      if (progressRef.current) progressRef.current.style.width = Math.min(pct, 100) + '%'
      navRef.current?.classList.toggle('os-scrolled', window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    /* ── hero floating hearts ── */
    const heroEmoji = ['🤍','💛','✨','🌸','💫']
    const hw = heroHeartsRef.current
    if (hw) {
      for (let i = 0; i < 14; i++) {
        const h = document.createElement('div')
        h.className = 'os-fheart'
        h.textContent = heroEmoji[i % heroEmoji.length]
        h.style.cssText = `left:${5+Math.random()*90}%;top:${30+Math.random()*60}%;--fs:${10+Math.random()*14}px;--dur:${8+Math.random()*7}s;--delay:${Math.random()*8}s;--rot:${-15+Math.random()*30}deg`
        hw.appendChild(h)
      }
    }

    /* ── dark section floating hearts ── */
    const darkEmoji = ['💛','🤍','💌','✨','💫','🌙','⭐']
    const lf = loveFloatsRef.current
    if (lf) {
      for (let i = 0; i < 12; i++) {
        const h = document.createElement('div')
        h.className = 'os-love-float'
        h.textContent = darkEmoji[i % darkEmoji.length]
        h.style.cssText = `left:${Math.random()*100}%;top:${20+Math.random()*70}%;--fs:${12+Math.random()*18}px;--dur:${6+Math.random()*6}s;--delay:${Math.random()*6}s`
        lf.appendChild(h)
      }
    }

    /* ── generic reveal ── */
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.os-reveal, .os-reveal-l, .os-reveal-r').forEach(el => ro.observe(el))

    /* ── envelope wrap reveal ── */
    if (envWrapRef.current) {
      const eo = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); eo.unobserve(e.target) } })
      }, { threshold: 0.3 })
      eo.observe(envWrapRef.current)
    }

    /* ── love messages stagger ── */
    const lm = document.getElementById('os-love-msgs')
    if (lm) {
      const mo = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            document.querySelectorAll('.os-love-msg').forEach((m, i) =>
              setTimeout(() => m.classList.add('visible'), i * 280))
            mo.disconnect()
          }
        })
      }, { threshold: 0.15 })
      mo.observe(lm)
    }

    /* ── timeline ── */
    const tl = timelineRef.current
    if (tl) {
      const to = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            tl.classList.add('os-line-vis')
            tl.querySelectorAll('.os-t-item').forEach((el, i) =>
              setTimeout(() => el.classList.add('visible'), i * 200))
            to.disconnect()
          }
        })
      }, { threshold: 0.1 })
      to.observe(tl)
    }

    /* ── sentence lines ── */
    const s0 = document.getElementById('os-s0')
    if (s0) {
      const so = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            document.getElementById('os-sent-label')?.classList.add('vis')
            for (let i = 0; i <= 4; i++)
              setTimeout(() => document.getElementById(`os-s${i}`)?.classList.add('visible'), i * 170)
            so.disconnect()
          }
        })
      }, { threshold: 0.15 })
      so.observe(s0)
    }

    /* ── values stagger ── */
    const vo = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); vo.unobserve(e.target) } })
    }, { threshold: 0.15 })
    document.querySelectorAll('.os-v-card').forEach(el => vo.observe(el))

    /* ── counter animation ── */
    function animCount(el: HTMLElement, target: number, duration: number) {
      let start: number | null = null
      const fmt = (v: number) => target >= 1000 ? Math.round(v).toLocaleString('id-ID') : String(Math.round(v))
      const step = (ts: number) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / duration, 1)
        el.textContent = fmt((1 - Math.pow(1 - p, 3)) * target)
        if (p < 1) requestAnimationFrame(step)
        else el.textContent = fmt(target)
      }
      requestAnimationFrame(step)
    }
    if (numbersRef.current) {
      const no = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            document.querySelectorAll('.os-num-card').forEach((c, i) =>
              setTimeout(() => c.classList.add('vis'), i * 150))
            const n1 = document.getElementById('os-n1')
            const n2 = document.getElementById('os-n2')
            const n3 = document.getElementById('os-n3')
            if (n1) animCount(n1, 780,   1600)
            if (n2) setTimeout(() => n2 && animCount(n2, 100,   1400), 150)
            if (n3) setTimeout(() => n3 && animCount(n3, 10000, 2000), 300)
            no.disconnect()
          }
        })
      }, { threshold: 0.4 })
      no.observe(numbersRef.current)
    }

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── envelope open ── */
  const envelopeOpened = useRef(false)
  function openEnvelope() {
    if (envelopeOpened.current) return
    const env      = document.getElementById('os-envelope')
    const hint     = document.getElementById('os-env-hint')
    const expanded = document.getElementById('os-env-expanded')
    if (!env || !hint || !expanded) return

    env.classList.add('os-shaking')
    setTimeout(() => {
      env.classList.remove('os-shaking')

      /* burst particles */
      const emojis = ['💛','🤍','💫','✨','🌸','💌','⭐']
      for (let i = 0; i < 16; i++) {
        const p = document.createElement('div')
        p.className = 'os-env-particle'
        p.textContent = emojis[i % emojis.length]
        const angle = (i / 16) * 360
        const dist  = 60 + Math.random() * 80
        p.style.cssText = `left:50%;top:40%;--tx:${Math.cos(angle*Math.PI/180)*dist}px;--ty:${Math.sin(angle*Math.PI/180)*dist-20}px;--fs:${12+Math.random()*10}px;--dur:${0.6+Math.random()*0.5}s;--delay:${Math.random()*0.2}s;--rot:${-30+Math.random()*60}deg`
        env.parentElement?.appendChild(p)
        setTimeout(() => p.remove(), 1200)
      }

      env.classList.add('open')
      hint.style.animation = 'none'
      hint.style.opacity   = '0'

      setTimeout(() => {
        expanded.classList.add('show')
        requestAnimationFrame(() => requestAnimationFrame(() => expanded.classList.add('visible')))
        hint.textContent  = '💛'
        hint.style.opacity   = '1'
        hint.style.fontSize  = '20px'
        hint.style.letterSpacing = '0'
        hint.style.textTransform = 'none'
        envelopeOpened.current = true
      }, 700)
    }, 480)
  }

  const timelineItems = [
    { year: 'Awal mula',      title: 'Sebuah ide dari rasa rindu',           text: 'Ketika jarak terasa terlalu jauh, muncul pertanyaan sederhana: bagaimana caranya membuat seseorang tetap terasa dekat? Jawabannya ternyata ada di aroma.' },
    { year: 'Proses pertama', title: 'Belajar dari nol, tanpa bekal',         text: 'Kami memulai tanpa latar belakang parfum, tanpa modal besar — hanya keyakinan bahwa produk lokal yang penuh makna bisa bersaing dengan siapapun.' },
    { year: 'Titik balik',    title: 'Nama-nama yang lahir dari cerita nyata', text: 'Setiap varian Henima dinamai dari momen-momen dalam perjalanan kisah cinta kami — bukan dari riset pasar, tapi dari memori yang benar-benar pernah kami rasakan.' },
    { year: 'Hari ini',       title: 'Dari satu kisah, untuk jutaan cerita',  text: 'Henima kini hadir untuk semua yang pernah merasakan rindu, yang ingin mengabadikan momen, dan percaya bahwa cinta lokal bisa punya nilai dunia.' },
  ]

  const messages = [
    { side: '',      avatar: '🌙', name: 'Jakarta',  text: '"Malam ini terasa lebih sepi dari biasanya. Aku bisa menutup mata dan masih ingat betul bagaimana aromamu..."', time: '23:14' },
    { side: 'right', avatar: '⭐', name: 'Surabaya', text: '"Aku juga. Jarak ini yang membuat aku sadar — ada hal-hal yang tidak bisa digantikan kata-kata. Hanya perasaan yang tersisa."', time: '23:17' },
    { side: '',      avatar: '🌙', name: 'Jakarta',  text: '"Bagaimana jika ada cara untuk membawa perasaan ini — bukan dalam kata-kata, tapi dalam sesuatu yang bisa dirasakan setiap hari?"', time: '23:31' },
    { side: 'right', avatar: '⭐', name: 'Surabaya', text: '"Dan dari pertanyaan itulah, Henima lahir. 💛"', time: '23:33' },
  ]

  const manifesto = [
    { id:'os-s0', num:'01', bold:'cinta sejati layak dikenang',                      rest:'— dan aroma adalah cara terbaik untuk mengingatnya.' },
    { id:'os-s1', num:'02', bold:'produk lokal bisa menyentuh hati dunia',           rest:'— jika dibuat dengan niat yang benar.' },
    { id:'os-s2', num:'03', bold:'jarak bukan penghalang',                           rest:'— ia hanya membuat momen bersama terasa lebih berharga.' },
    { id:'os-s3', num:'04', bold:'setiap orang punya cerita cinta yang layak diabadikan', rest:'— dan itu adalah tugas kami.' },
    { id:'os-s4', num:'05', bold:'kemewahan sejati adalah perasaan',                 rest:', bukan angka di label harga.' },
  ]

  return (
    <>
      <style>{`
        /* ── BASE ── */
        .os-wrap *,
        .os-wrap *::before,
        .os-wrap *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .os-wrap {
          --bg:#F7F4EF;--bg2:#EFEBE3;--black:#1A1714;--ink:#2E2A25;--muted:#7A736A;
          --gold:#B5874A;--gold2:#D4A96A;--border:rgba(181,135,74,.18);
          --serif:'Playfair Display',Georgia,serif;
          --sans:'Inter',system-ui,sans-serif;
          background:var(--bg);color:var(--ink);font-family:var(--sans);
          font-weight:300;line-height:1.75;overflow-x:hidden;
        }

        /* ── PROGRESS ── */
        .os-progress{position:fixed;top:0;left:0;z-index:500;height:2px;background:var(--gold);width:0%;transition:width .1s linear;}

        /* ── NAV ── */
        .os-nav{position:fixed;top:0;left:0;right:0;z-index:400;padding:22px 6vw;display:flex;align-items:center;justify-content:space-between;transition:background .5s,backdrop-filter .5s,border-color .5s;border-bottom:1px solid transparent;}
        .os-nav.os-scrolled{background:rgba(247,244,239,.94);backdrop-filter:blur(16px);border-bottom-color:var(--border);}
        .os-nav-logo{font-family:var(--serif);font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);text-decoration:none;}
        .os-nav-links{display:flex;gap:32px;}
        .os-nav-link{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);text-decoration:none;position:relative;transition:color .2s;}
        .os-nav-link::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:1px;background:var(--gold);transform:scaleX(0);transform-origin:right;transition:transform .3s ease;}
        .os-nav-link:hover{color:var(--ink);}
        .os-nav-link:hover::after{transform:scaleX(1);transform-origin:left;}

        /* ── HERO ── */
        .os-hero{min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:0 6vw 10vh;position:relative;overflow:hidden;}
        .os-hearts-wrap{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
        .os-fheart{position:absolute;font-size:var(--fs,16px);opacity:0;animation:os-float-heart var(--dur,9s) var(--delay,0s) ease-in-out infinite;user-select:none;}
        @keyframes os-float-heart{0%{opacity:0;transform:translateY(0) rotate(var(--rot,0deg)) scale(.8)}15%{opacity:.35}85%{opacity:.2}100%{opacity:0;transform:translateY(-140px) rotate(calc(var(--rot,0deg) + 20deg)) scale(1.1)}}
        .os-hero-bg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--serif);font-size:clamp(90px,20vw,260px);font-weight:400;font-style:italic;color:rgba(181,135,74,.045);white-space:nowrap;pointer-events:none;user-select:none;animation:os-bg-drift 22s ease-in-out infinite alternate;}
        @keyframes os-bg-drift{0%{transform:translate(-50%,-50%) scale(1)}100%{transform:translate(-50%,-50%) scale(1.05)}}
        .os-eyebrow{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;opacity:0;animation:os-fadeUp .9s .2s forwards;}
        .os-h1{font-family:var(--serif);font-size:clamp(2.8rem,7.5vw,7rem);font-weight:400;line-height:1.08;color:var(--black);max-width:860px;opacity:0;animation:os-fadeUp 1s .45s forwards;}
        .os-h1 em{font-style:italic;color:var(--gold);}
        .os-rule{width:0;height:1px;background:var(--gold);margin:32px 0;animation:os-grow-line 1s .9s forwards;}
        @keyframes os-grow-line{to{width:56px}}
        .os-sub{font-size:clamp(14px,1.6vw,17px);color:var(--muted);max-width:480px;line-height:1.9;opacity:0;animation:os-fadeUp .9s .85s forwards;}
        .os-dist{display:flex;align-items:center;gap:16px;margin-top:48px;opacity:0;animation:os-fadeUp .9s 1.05s forwards;}
        .os-city{font-family:var(--serif);font-size:16px;color:var(--black);letter-spacing:.04em;}
        .os-track{position:relative;width:100px;height:1px;background:rgba(181,135,74,.25);}
        .os-dot{position:absolute;top:50%;transform:translateY(-50%);width:7px;height:7px;border-radius:50%;background:var(--gold);animation:os-travel 3s ease-in-out infinite;box-shadow:0 0 12px rgba(181,135,74,.6);}
        @keyframes os-travel{0%{left:0;opacity:1}45%{left:calc(100% - 7px);opacity:1}50%{left:calc(100% - 7px);opacity:0}55%{left:0;opacity:0}60%{left:0;opacity:1}100%{left:calc(100% - 7px);opacity:1}}
        .os-dlabel{font-size:11px;color:var(--muted);letter-spacing:.1em;}
        .os-scroll-cue{position:absolute;bottom:36px;left:6vw;display:flex;align-items:center;gap:14px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);opacity:0;animation:os-fadeUp .9s 1.4s forwards;}
        .os-scroll-line{width:40px;height:1px;background:var(--gold2);animation:os-pulse-line 2s ease-in-out infinite;}
        @keyframes os-pulse-line{0%,100%{width:40px;opacity:.4}50%{width:60px;opacity:1}}

        /* ── SECTIONS ── */
        .os-section{padding:110px 6vw;}
        .os-inner{max-width:1080px;margin:0 auto;}
        .os-alt{background:var(--bg2);}
        .os-label{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold);margin-bottom:18px;}

        /* ── CHAPTER 1 ── */
        .os-ch1-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;}
        .os-ch1-text h2{font-family:var(--serif);font-size:clamp(1.9rem,3.5vw,3rem);font-weight:400;line-height:1.2;color:var(--black);margin-bottom:32px;}
        .os-ch1-text p{font-size:15px;color:var(--muted);line-height:1.9;margin-bottom:22px;}
        .os-ch1-text p:last-child{margin-bottom:0;}
        .os-big-quote{font-family:var(--serif);font-size:clamp(1.4rem,2.5vw,2.2rem);font-style:italic;font-weight:400;line-height:1.55;color:var(--black);border-left:2px solid var(--gold);padding-left:28px;margin-bottom:18px;}
        .os-big-quote-cite{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);padding-left:28px;}

        /* ── LOVE SCENE ── */
        .os-love-scene{padding:100px 6vw;background:var(--black);position:relative;overflow:hidden;}
        .os-love-inner{max-width:900px;margin:0 auto;}
        .os-love-float{position:absolute;pointer-events:none;font-size:var(--fs,18px);animation:os-love-float var(--dur,6s) var(--delay,0s) ease-in-out infinite;opacity:0;}
        @keyframes os-love-float{0%{opacity:0;transform:translateY(0) scale(.7)}20%{opacity:.4}80%{opacity:.15}100%{opacity:0;transform:translateY(-100px) scale(1)}}

        /* ── ENVELOPE ── */
        .os-env-wrap{display:flex;justify-content:center;margin-bottom:64px;opacity:0;transform:translateY(24px);transition:opacity .9s ease,transform .9s ease;}
        .os-env-wrap.visible{opacity:1;transform:none;}
        .os-envelope{position:relative;width:220px;height:150px;cursor:pointer;transition:transform .2s;}
        .os-envelope:hover{transform:scale(1.03);}
        .os-envelope.os-shaking{animation:os-env-shake .45s ease;}
        @keyframes os-env-shake{0%,100%{transform:rotate(0deg)}15%{transform:rotate(-4deg) scale(1.04)}30%{transform:rotate(4deg) scale(1.06)}45%{transform:rotate(-3deg) scale(1.05)}60%{transform:rotate(3deg) scale(1.04)}75%{transform:rotate(-1deg) scale(1.02)}}
        .os-env-body{position:absolute;inset:0;background:#1e1a17;border:1px solid rgba(181,135,74,.3);border-radius:4px;overflow:hidden;}
        .os-env-flap{position:absolute;top:0;left:0;right:0;height:80px;clip-path:polygon(0 0,50% 60%,100% 0);background:#252018;border-bottom:1px solid rgba(181,135,74,.2);transform-origin:top center;transform:rotateX(0deg);transition:transform .7s cubic-bezier(.4,0,.2,1) .15s;}
        .os-envelope.open .os-env-flap{transform:rotateX(-185deg);}
        .os-env-letter{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:160px;height:100px;background:#F7F4EF;transition:transform .6s cubic-bezier(.34,1.56,.64,1) .4s;display:flex;align-items:center;justify-content:center;}
        .os-envelope.open .os-env-letter{transform:translateX(-50%) translateY(-78px);}
        .os-env-letter-text{font-family:var(--serif);font-style:italic;font-size:11px;color:var(--ink);text-align:center;line-height:1.6;padding:12px;}
        .os-env-seal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:32px;height:32px;border-radius:50%;background:rgba(181,135,74,.15);border:1px solid rgba(181,135,74,.3);display:flex;align-items:center;justify-content:center;font-size:14px;animation:os-seal-pulse 2.5s ease-in-out infinite;transition:opacity .3s;}
        .os-envelope.open .os-env-seal{opacity:0;}
        @keyframes os-seal-pulse{0%,100%{box-shadow:0 0 0 0 rgba(181,135,74,.3)}50%{box-shadow:0 0 0 8px rgba(181,135,74,0)}}
        .os-env-hint{text-align:center;margin-top:14px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(181,135,74,.5);animation:os-hint-blink 2s ease-in-out infinite;transition:all .3s;min-height:20px;}
        @keyframes os-hint-blink{0%,100%{opacity:.5}50%{opacity:1}}
        .os-env-expanded{max-width:560px;margin:0 auto;background:rgba(247,244,239,.04);border:1px solid rgba(181,135,74,.2);padding:36px 40px;opacity:0;transform:translateY(20px) scale(.97);transition:opacity .7s ease .2s,transform .7s ease .2s;display:none;}
        .os-env-expanded.show{display:block;}
        .os-env-expanded.visible{opacity:1;transform:none;}
        .os-env-exp-date{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(181,135,74,.6);margin-bottom:20px;}
        .os-env-exp-body{font-family:var(--serif);font-style:italic;font-size:clamp(14px,1.5vw,17px);color:rgba(245,240,232,.82);line-height:1.85;}
        .os-env-exp-body p{margin-bottom:16px;}
        .os-env-exp-body p:last-child{margin-bottom:0;}
        .os-env-exp-sign{margin-top:24px;padding-top:20px;border-top:1px solid rgba(181,135,74,.15);font-family:var(--serif);font-style:italic;font-size:16px;color:var(--gold);}
        .os-env-particle{position:absolute;pointer-events:none;font-size:var(--fs,16px);opacity:0;animation:os-burst var(--dur,.8s) var(--delay,0s) ease-out forwards;}
        @keyframes os-burst{0%{opacity:1;transform:translate(0,0) scale(.5) rotate(0deg)}60%{opacity:.8}100%{opacity:0;transform:translate(var(--tx,0px),var(--ty,-80px)) scale(1.2) rotate(var(--rot,20deg))}}

        /* ── CHAT MESSAGES ── */
        .os-love-messages{display:flex;flex-direction:column;gap:32px;}
        .os-love-msg{display:flex;gap:20px;align-items:flex-start;opacity:0;transform:translateX(var(--dir,-20px));transition:opacity .7s ease,transform .7s ease;}
        .os-love-msg.visible{opacity:1;transform:none;}
        .os-love-msg.right{flex-direction:row-reverse;}
        .os-msg-avatar{width:40px;height:40px;border-radius:50%;background:rgba(181,135,74,.12);border:1px solid rgba(181,135,74,.25);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;animation:os-avatar-glow 3s ease-in-out infinite;}
        @keyframes os-avatar-glow{0%,100%{box-shadow:0 0 0 0 rgba(181,135,74,.2)}50%{box-shadow:0 0 0 6px rgba(181,135,74,0)}}
        .os-msg-bubble{max-width:440px;background:rgba(255,255,255,.04);border:1px solid rgba(181,135,74,.15);border-radius:0 12px 12px 12px;padding:16px 20px;}
        .os-love-msg.right .os-msg-bubble{border-radius:12px 0 12px 12px;}
        .os-msg-name{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold2);margin-bottom:6px;}
        .os-msg-text{font-family:var(--serif);font-style:italic;font-size:15px;color:rgba(245,240,232,.8);line-height:1.7;}
        .os-msg-time{font-size:10px;color:rgba(245,240,232,.25);margin-top:8px;letter-spacing:.06em;}

        /* ── NUMBERS ── */
        .os-numbers-section{background:var(--black);}
        .os-numbers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(181,135,74,.12);border-top:1px solid rgba(181,135,74,.12);border-bottom:1px solid rgba(181,135,74,.12);}
        .os-num-card{background:var(--black);padding:64px 32px;text-align:center;position:relative;overflow:hidden;transition:background .3s;}
        .os-num-card::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(181,135,74,.06) 0%,transparent 70%);opacity:0;transition:opacity .4s;}
        .os-num-card:hover{background:#1a1512;}
        .os-num-card:hover::before{opacity:1;}
        .os-num-big{font-family:var(--serif);font-size:clamp(3rem,6vw,5rem);font-weight:400;line-height:1;margin-bottom:12px;display:flex;align-items:baseline;justify-content:center;gap:4px;}
        .os-num-val{color:#F5F0E8;}
        .os-num-suffix{color:var(--gold);font-size:.65em;}
        .os-num-label{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,240,232,.4);line-height:1.5;}

        /* ── TIMELINE ── */
        .os-timeline{position:relative;padding-left:36px;}
        .os-timeline::before{content:'';position:absolute;left:0;top:0;bottom:0;width:1px;background:var(--border);transform:scaleY(0);transform-origin:top;transition:transform 1.4s ease;}
        .os-timeline.os-line-vis::before{transform:scaleY(1);}
        .os-t-item{position:relative;padding-bottom:52px;opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease;}
        .os-t-item.visible{opacity:1;transform:none;}
        .os-t-item:last-child{padding-bottom:0;}
        .os-t-dot{position:absolute;left:-40px;top:6px;width:10px;height:10px;border-radius:50%;background:var(--bg);border:1.5px solid var(--gold);transition:background .3s,transform .3s,box-shadow .3s;}
        .os-t-item:hover .os-t-dot{background:var(--gold);transform:scale(1.35);box-shadow:0 0 14px rgba(181,135,74,.45);}
        .os-t-year{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;}
        .os-t-item h3{font-family:var(--serif);font-size:21px;font-weight:400;color:var(--black);margin-bottom:10px;transition:color .2s;}
        .os-t-item:hover h3{color:var(--gold);}
        .os-t-item p{font-size:14px;color:var(--muted);line-height:1.85;max-width:500px;}

        /* ── MANIFESTO ── */
        .os-sentence-section{padding:110px 6vw;background:var(--black);overflow:hidden;}
        .os-sentence-inner{max-width:860px;margin:0 auto;}
        .os-sent-label{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold);margin-bottom:48px;opacity:0;transition:opacity .6s;}
        .os-sent-label.vis{opacity:1;}
        .os-s-line{display:flex;align-items:flex-start;gap:16px;padding:20px 0;border-bottom:1px solid rgba(181,135,74,.1);overflow:hidden;}
        .os-s-line:first-of-type{border-top:1px solid rgba(181,135,74,.1);}
        .os-s-num{font-size:11px;color:rgba(181,135,74,.3);font-family:var(--serif);flex-shrink:0;padding-top:6px;letter-spacing:.08em;transition:color .3s;}
        .os-s-line:hover .os-s-num{color:var(--gold2);}
        .os-s-text{font-family:var(--serif);font-size:clamp(1.1rem,2vw,1.5rem);font-weight:400;line-height:1.6;color:rgba(245,240,232,.18);transform:translateY(100%);transition:color .6s ease,transform .7s ease;}
        .os-s-text strong{font-weight:400;color:var(--gold2);}
        .os-s-line.visible .os-s-text{transform:translateY(0);color:rgba(245,240,232,.75);}
        .os-s-line:hover .os-s-text{color:rgba(245,240,232,1) !important;}

        /* ── VALUES ── */
        .os-values-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border);margin-top:48px;}
        .os-v-card{background:var(--bg);padding:44px 32px;position:relative;overflow:hidden;opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease,background .3s;}
        .os-v-card.visible{opacity:1;transform:none;}
        .os-v-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .45s ease;}
        .os-v-card:hover{background:#EDE8DF;}
        .os-v-card:hover::after{transform:scaleX(1);}
        .os-v-num{font-family:var(--serif);font-size:52px;font-weight:400;color:rgba(181,135,74,.1);line-height:1;margin-bottom:22px;transition:color .3s;}
        .os-v-card:hover .os-v-num{color:rgba(181,135,74,.22);}
        .os-v-card h3{font-family:var(--serif);font-size:19px;font-weight:500;color:var(--black);margin-bottom:12px;line-height:1.3;}
        .os-v-card p{font-size:14px;color:var(--muted);line-height:1.85;}

        /* ── VISION ── */
        .os-vision-section{padding:130px 6vw;text-align:center;position:relative;overflow:hidden;background:var(--bg);}
        .os-vision-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:500px;border-radius:50%;background:radial-gradient(ellipse,rgba(181,135,74,.08) 0%,transparent 70%);pointer-events:none;animation:os-glow-breathe 5s ease-in-out infinite;}
        @keyframes os-glow-breathe{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.7}50%{transform:translate(-50%,-50%) scale(1.1);opacity:1}}
        .os-vision-inner{max-width:760px;margin:0 auto;position:relative;}
        .os-vision-inner h2{font-family:var(--serif);font-size:clamp(1.6rem,3vw,2.8rem);font-weight:400;font-style:italic;line-height:1.45;color:var(--black);margin-bottom:24px;}
        .os-vision-inner h2 em{font-style:normal;color:var(--gold);}
        .os-vision-inner p{font-size:15px;color:var(--muted);line-height:1.9;max-width:560px;margin:0 auto 40px;}
        .os-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;}
        .os-pill{font-size:10px;letter-spacing:.15em;text-transform:uppercase;padding:8px 20px;border:1px solid var(--border);color:var(--gold);background:transparent;cursor:default;transition:background .25s,color .25s,transform .2s;}
        .os-pill:hover{background:var(--gold);color:var(--bg);transform:translateY(-2px);}

        /* ── CTA ── */
        .os-cta-section{padding:130px 6vw;text-align:center;background:var(--bg2);border-top:1px solid var(--border);}
        .os-cta-section h2{font-family:var(--serif);font-size:clamp(2rem,5vw,4rem);font-weight:400;line-height:1.2;color:var(--black);margin-bottom:20px;}
        .os-cta-section h2 em{font-style:italic;color:var(--gold);}
        .os-cta-section p{font-size:15px;color:var(--muted);margin-bottom:44px;}
        .os-cta-btn{display:inline-block;padding:16px 52px;background:var(--black);color:var(--bg);font-size:11px;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;font-family:var(--sans);position:relative;overflow:hidden;transition:color .35s,transform .2s;}
        .os-cta-btn::before{content:'';position:absolute;inset:0;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .4s ease;}
        .os-cta-btn:hover{color:var(--black);transform:translateY(-2px);}
        .os-cta-btn:hover::before{transform:scaleX(1);}
        .os-cta-btn span{position:relative;z-index:1;}
        .os-cta-sub{display:block;margin-top:24px;font-size:12px;color:var(--muted);text-decoration:none;letter-spacing:.08em;border-bottom:1px solid var(--border);padding-bottom:2px;width:fit-content;margin-left:auto;margin-right:auto;transition:color .2s,border-color .2s;}
        .os-cta-sub:hover{color:var(--gold);border-color:var(--gold);}

        /* ── FOOTER ── */
        .os-footer{border-top:1px solid var(--border);padding:28px 6vw;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;background:var(--bg);}
        .os-footer p{font-size:12px;color:var(--muted);letter-spacing:.05em;}

        /* ── REVEAL ── */
        .os-reveal{opacity:0;transform:translateY(32px);transition:opacity .85s ease,transform .85s ease;}
        .os-reveal.visible{opacity:1;transform:none;}
        .os-reveal-l{opacity:0;transform:translateX(-28px);transition:opacity .85s ease,transform .85s ease;}
        .os-reveal-l.visible{opacity:1;transform:none;}
        .os-reveal-r{opacity:0;transform:translateX(28px);transition:opacity .85s ease,transform .85s ease;}
        .os-reveal-r.visible{opacity:1;transform:none;}

        @keyframes os-fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}

        /* ── RESPONSIVE ── */
        @media(max-width:768px){
          .os-ch1-grid{grid-template-columns:1fr;gap:40px;}
          .os-values-row{grid-template-columns:1fr;}
          .os-numbers-grid{grid-template-columns:1fr;}
          .os-love-msg,.os-love-msg.right{flex-direction:column;}
          .os-section{padding:80px 5vw;}
          .os-love-scene{padding:80px 5vw;}
        }
        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after{animation:none !important;transition:none !important;}
          .os-reveal,.os-reveal-l,.os-reveal-r,.os-t-item,.os-v-card,.os-s-text,.os-s-line,.os-love-msg,.os-env-wrap{opacity:1 !important;transform:none !important;}
          .os-rule{width:56px;}
          .os-timeline::before{transform:scaleY(1);}
          .os-h1,.os-eyebrow,.os-sub,.os-dist,.os-scroll-cue{opacity:1;}
        }
      `}</style>

      <div className="os-wrap">
        <div className="os-progress" ref={progressRef} />


        {/* ── HERO ── */}
        <section className="os-hero">
          <div className="os-hearts-wrap" ref={heroHeartsRef} />
          <div className="os-hero-bg">Henima</div>
          <p className="os-eyebrow">Our Story — Henima Signature Scent</p>
          <h1 className="os-h1">Jakarta. Surabaya.<br /><em>One love story.</em></h1>
          <div className="os-rule" />
          <p className="os-sub">Setiap botol Henima menyimpan sebuah kisah nyata — tentang rindu yang tulus, jarak yang dijalani, dan cinta yang memilih untuk bertahan.</p>
          <div className="os-dist">
            <span className="os-city">Jakarta</span>
            <div className="os-track"><div className="os-dot" /></div>
            <span className="os-city">Surabaya</span>
            <span className="os-dlabel">— 780 km of love</span>
          </div>
          <div className="os-scroll-cue">Scroll <div className="os-scroll-line" /></div>
        </section>

        {/* ── CHAPTER 1 ── */}
        <section className="os-section os-alt">
          <div className="os-inner">
            <div className="os-ch1-grid">
              <div className="os-ch1-text os-reveal-l">
                <p className="os-label">The beginning</p>
                <h2>Dimulai dari<br />jarak 780 kilometer.</h2>
                <p>Henima lahir dari sesuatu yang sangat sederhana dan sangat manusiawi — dua orang yang saling mencintai, dipisahkan oleh jarak Jakarta dan Surabaya. Di antara panggilan telepon yang tak pernah cukup, ada satu hal yang tetap tinggal: sebuah aroma yang mengingatkan pada kehadiran seseorang.</p>
                <p>Dari pengalaman itulah Henima Signature Scent hadir. Bukan sebagai bisnis semata, tapi sebagai medium — cara untuk membawa seseorang tetap dekat, meski raganya jauh.</p>
                <p>Kami memulai tanpa pengetahuan apapun tentang parfum. Hanya keberanian, keyakinan, dan sebuah cerita yang terlalu sayang untuk disimpan sendiri.</p>
              </div>
              <div className="os-reveal-r" style={{ paddingTop: '8px' }}>
                <div className="os-big-quote">&ldquo;Aroma adalah satu-satunya indera yang langsung terhubung ke memori. Kami tidak membuat parfum — kami membuat kenangan.&rdquo;</div>
                <p className="os-big-quote-cite">— Founder, Henima Signature Scent</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOVE SCENE ── */}
        <section className="os-love-scene">
          <div ref={loveFloatsRef} />
          <div className="os-love-inner">
            <p className="os-label os-reveal" style={{ color: '#D4A96A' }}>A love story across distance</p>

            {/* envelope */}
            <div className="os-env-wrap" ref={envWrapRef}>
              <div style={{ position: 'relative' }}>
                <div className="os-envelope" id="os-envelope" onClick={openEnvelope}>
                  <div className="os-env-body">
                    <div className="os-env-flap" />
                    <div className="os-env-letter">
                      <p className="os-env-letter-text">&ldquo;Aku rindu aromamu lebih dari yang bisa kukatakan...&rdquo;</p>
                    </div>
                    <div className="os-env-seal">💛</div>
                  </div>
                </div>
                <p className="os-env-hint" id="os-env-hint">Ketuk untuk membuka</p>
              </div>
            </div>

            {/* expanded letter */}
            <div className="os-env-expanded" id="os-env-expanded">
              <p className="os-env-exp-date">Suatu malam, antara Jakarta dan Surabaya</p>
              <div className="os-env-exp-body">
                <p>Ada malam-malam ketika rindu itu terasa lebih berat dari biasanya. Ketika layar telepon tidak cukup, ketika jarak 780 kilometer terasa seperti tak terbatas.</p>
                <p>Di malam seperti itulah kami bertanya — apakah ada cara untuk membuat seseorang tetap terasa <em>hadir</em>, meski raganya jauh?</p>
                <p>Jawabannya ternyata sederhana. Sebuah aroma yang mengingatkan padanya. Wewangian yang, ketika dihirup, membawa kembali semua kenangan — suaranya, senyumnya, kehangatan yang tak bisa dijelaskan kata-kata.</p>
                <p>Dari pertanyaan sederhana itulah Henima lahir.</p>
              </div>
              <p className="os-env-exp-sign">— Dengan cinta, Henima 💛</p>
            </div>

            {/* chat messages */}
            <div className="os-love-messages" id="os-love-msgs">
              {messages.map((m, i) => (
                <div key={i} className={`os-love-msg ${m.side}`} style={{ ['--dir' as string]: m.side === 'right' ? '20px' : '-20px' }}>
                  <div className="os-msg-avatar">{m.avatar}</div>
                  <div className="os-msg-bubble">
                    <p className="os-msg-name">{m.name}</p>
                    <p className="os-msg-text">{m.text}</p>
                    <p className="os-msg-time">{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DALAM ANGKA ── */}
        <section className="os-numbers-section">
          <div className="os-numbers-grid" ref={numbersRef}>
            {[
              { id: 'os-n1', suffix: ' km', label: 'Jarak yang menjadi awal segalanya' },
              { id: 'os-n2', suffix: '%',   label: 'Produk dibuat dengan cerita nyata' },
              { id: 'os-n3', suffix: '+',   label: 'Kenangan yang telah diabadikan' },
            ].map((n) => (
              <div key={n.id} className="os-num-card">
                <div className="os-num-big">
                  <span className="os-num-val" id={n.id}>0</span>
                  <span className="os-num-suffix">{n.suffix}</span>
                </div>
                <p className="os-num-label">{n.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="os-section">
          <div className="os-inner">
            <p className="os-label os-reveal">The journey</p>
            <h2 className="os-reveal" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: 'var(--black)', maxWidth: '560px', lineHeight: 1.25, marginBottom: '56px' }}>
              Perjalanan yang tidak pernah kami bayangkan akan sejauh ini.
            </h2>
            <div className="os-timeline" ref={timelineRef}>
              {timelineItems.map((t, i) => (
                <div key={i} className="os-t-item">
                  <div className="os-t-dot" />
                  <p className="os-t-year">{t.year}</p>
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MANIFESTO ── */}
        <section className="os-sentence-section">
          <div className="os-sentence-inner">
            <p className="os-sent-label" id="os-sent-label">Yang kami percaya</p>
            {manifesto.map((m) => (
              <div key={m.id} className="os-s-line" id={m.id}>
                <span className="os-s-num">{m.num}</span>
                <p className="os-s-text">Kami percaya bahwa <strong>{m.bold}</strong> {m.rest}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="os-section">
          <div className="os-inner">
            <p className="os-label os-reveal">What we stand for</p>
            <h2 className="os-reveal" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.7rem,2.8vw,2.5rem)', fontWeight: 400, color: 'var(--black)', lineHeight: 1.25 }}>
              Tiga hal yang tidak pernah<br />kami kompromikan.
            </h2>
            <div className="os-values-row">
              {[
                { num: 'I',   title: 'Ketulusan di atas segalanya',  text: 'Setiap produk lahir dari cerita nyata, bukan riset pasar. Kami hanya membuat apa yang kami sendiri percayai — dan itu yang membuat Henima berbeda.',                                           delay: '0s'   },
                { num: 'II',  title: 'Lokal adalah kebanggaan',       text: 'Kami bangga buatan Indonesia. Bukan sebagai klaim, tapi sebagai keyakinan bahwa tangan dan cerita kita sendiri mampu menyentuh hati jutaan orang.',                                              delay: '.15s' },
                { num: 'III', title: 'Makna lebih dari kemewahan',    text: 'Luxury sejati bukan soal harga. Ini soal bagaimana sebuah aroma membuat pemakainya merasa — dihargai, dikenang, dan terhubung dengan seseorang yang berarti.', delay: '.3s'  },
              ].map((v, i) => (
                <div key={i} className="os-v-card" style={{ transitionDelay: v.delay }}>
                  <div className="os-v-num">{v.num}</div>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VISION ── */}
        <section className="os-vision-section">
          <div className="os-vision-glow" />
          <div className="os-vision-inner os-reveal">
            <p className="os-label" style={{ marginBottom: '32px' }}>Our vision</p>
            <h2>&ldquo;Menjadi brand wewangian lokal yang paling <em>dicintai</em> di Indonesia — bukan hanya karena kualitasnya, tapi karena makna dan cerita di balik setiap tetesnya.&rdquo;</h2>
            <p>Kami tidak berlomba menjadi yang terbesar. Kami ingin menjadi yang paling diingat — brand yang namanya disebut saat seseorang ingin memberikan sesuatu yang benar-benar berarti.</p>
            <div className="os-pills">
              {['Emotional Meaning','Indonesian Pride','True Quality','Real Stories','Lasting Memory'].map(p => (
                <span key={p} className="os-pill">{p}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="os-cta-section">
          <h2 className="os-reveal">Temukan wewangian yang<br /><em>menceritakan kisahmu.</em></h2>
          <p className="os-reveal">Setiap koleksi Henima membawa sebuah cerita.<br />Temukan yang paling dekat dengan hatimu.</p>
          <a href="/shop"    className="os-cta-btn os-reveal"><span>Jelajahi Koleksi</span></a>
          <a href="/share-story" className="os-cta-sub os-reveal">Atau ceritakan kisahmu kepada kami →</a>
        </section>

      </div>
    </>
  )
}
