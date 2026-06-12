'use client'
import { useState, useEffect } from 'react'

const questions = [
  {
    id: 1,
    question: "Suasana yang paling kamu suka?",
    options: [
      { label: "Pagi yang segar dan tenang", value: "fresh" },
      { label: "Malam yang hangat dan intim", value: "warm" },
    ]
  },
  {
    id: 2,
    question: "Kenangan yang paling kamu rindukan?",
    options: [
      { label: "Liburan di tepi pantai", value: "fresh" },
      { label: "Hujan deras di dalam kota", value: "warm" },
    ]
  },
  {
    id: 3,
    question: "Kamu lebih menggambarkan dirimu sebagai...",
    options: [
      { label: "Romantis dan penuh perasaan", value: "romantic" },
      { label: "Misterius dan penuh kepercayaan diri", value: "bold" },
    ]
  },
  {
    id: 4,
    question: "Kapan kamu biasanya memakai parfum?",
    options: [
      { label: "Setiap hari, bahkan di rumah", value: "fresh" },
      { label: "Saat ada momen spesial", value: "warm" },
    ]
  },
  {
    id: 5,
    question: "Aroma yang paling membuatmu nyaman?",
    options: [
      { label: "Bunga segar dan ringan", value: "fresh" },
      { label: "Kayu hangat dan dalam", value: "warm" },
    ]
  },
]

type Product = { id: string; name: string; description: string; photo: string }

export default function QuizPage() {
  const [step, setStep] = useState<'intro'|'quiz'|'result'>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selected, setSelected] = useState<string|null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [result, setResult] = useState<Product|null>(null)
  const [animating, setAnimating] = useState(false)

  useEffect(()=>{
    fetch('/api/products-public').then(r=>r.json()).then((data:any)=>{
      if(Array.isArray(data)) setProducts(data)
    })
  },[])

  const getResult = (ans: string[]) => {
    // Simple scoring — ambil produk berdasarkan jawaban terbanyak
    const score: Record<string,number> = {}
    ans.forEach(a => { score[a] = (score[a]||0) + 1 })
    // Map ke produk
    if(products.length === 0) return null
    const dominant = Object.entries(score).sort((a,b)=>b[1]-a[1])[0][0]
    // Assign produk berdasarkan dominant answer
    const idx = dominant === 'fresh' ? 0 : dominant === 'warm' ? 1 : dominant === 'romantic' ? 2 : 0
    return products[idx % products.length] || products[0]
  }

  const answer = (val: string) => {
    setSelected(val)
    setAnimating(true)
    setTimeout(()=>{
      const newAnswers = [...answers, val]
      setAnswers(newAnswers)
      setSelected(null)
      setAnimating(false)
      if(current < questions.length - 1){
        setCurrent(c => c+1)
      } else {
        const res = getResult(newAnswers)
        setResult(res)
        setStep('result')
      }
    }, 400)
  }

  const reset = () => {
    setStep('intro'); setCurrent(0); setAnswers([]); setSelected(null); setResult(null)
  }

  const progress = current / questions.length * 100

  return(<><style>{`
    .qz{--bg:#FAF8F4;--bg2:#F0EDE6;--black:#1C1917;--ink:#2E2A25;--muted:#7A736A;--gold:#C8B89A;--border:rgba(28,25,23,0.1);--serif:var(--font-cormorant),Georgia,serif;--sans:var(--font-jost),system-ui,sans-serif;background:var(--bg);min-height:100vh;font-family:var(--sans);font-weight:300;color:var(--ink)}
    .qz-hero{background:var(--black);padding:120px 6vw 80px;text-align:center;position:relative;overflow:hidden}
    .qz-hero-bg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--serif);font-size:clamp(80px,18vw,200px);font-weight:400;font-style:italic;color:rgba(200,184,154,.04);white-space:nowrap;pointer-events:none}
    .qz-hero h1{font-family:var(--serif);font-size:clamp(2.2rem,5vw,4rem);font-weight:400;line-height:1.15;color:#F0EBE3;margin-bottom:20px;position:relative}
    .qz-hero h1 em{font-style:italic;color:var(--gold)}
    .qz-hero p{font-size:15px;color:rgba(240,235,227,.45);max-width:480px;margin:0 auto;line-height:1.85;position:relative}
    .qz-label{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:rgba(200,184,154,.6);margin-bottom:20px;display:block;position:relative}
    .qz-start{display:inline-block;margin-top:36px;padding:16px 52px;background:#F0EBE3;color:var(--black);font-size:10px;letter-spacing:.2em;text-transform:uppercase;font-family:var(--sans);border:none;cursor:pointer;transition:opacity .2s,transform .2s;position:relative}
    .qz-start:hover{opacity:.85;transform:translateY(-1px)}
    .qz-body{max-width:640px;margin:0 auto;padding:80px 6vw}
    .qz-progress{height:1px;background:var(--border);margin-bottom:48px;position:relative}
    .qz-progress-fill{height:100%;background:var(--black);transition:width .5s ease}
    .qz-step{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-bottom:16px}
    .qz-q{font-family:var(--serif);font-size:clamp(1.6rem,3vw,2.4rem);font-weight:400;line-height:1.3;color:var(--black);margin-bottom:40px;opacity:1;transition:opacity .3s}
    .qz-q.fade{opacity:0}
    .qz-options{display:flex;flex-direction:column;gap:12px}
    .qz-opt{padding:20px 24px;border:1px solid var(--border);background:var(--bg);cursor:pointer;font-family:var(--serif);font-size:17px;font-weight:300;color:var(--ink);text-align:left;transition:background .2s,border-color .2s,transform .15s;font-style:italic}
    .qz-opt:hover{background:var(--bg2);border-color:rgba(28,25,23,0.2);transform:translateX(4px)}
    .qz-opt.picked{background:var(--black);color:#F0EBE3;border-color:var(--black)}
    .qz-result{text-align:center}
    .qz-result-label{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--muted);margin-bottom:24px}
    .qz-result h2{font-family:var(--serif);font-size:clamp(1.4rem,2.5vw,2rem);font-weight:400;color:var(--black);margin-bottom:8px}
    .qz-result p{font-size:14px;color:var(--muted);line-height:1.8;max-width:440px;margin:0 auto 40px}
    .qz-product-card{background:var(--bg2);border:1px solid var(--border);padding:40px;margin:32px 0;text-align:center}
    .qz-product-img{width:160px;height:160px;object-fit:cover;margin:0 auto 20px;display:block}
    .qz-product-name{font-family:var(--serif);font-size:28px;font-weight:400;color:var(--black);margin-bottom:8px}
    .qz-product-desc{font-size:14px;color:var(--muted);line-height:1.75;max-width:360px;margin:0 auto}
    .qz-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px}
    .qz-btn-primary{padding:14px 40px;background:var(--black);color:#F0EBE3;font-size:10px;letter-spacing:.2em;text-transform:uppercase;font-family:var(--sans);border:none;cursor:pointer;text-decoration:none;display:inline-block;transition:opacity .2s}
    .qz-btn-primary:hover{opacity:.8}
    .qz-btn-secondary{padding:14px 40px;background:transparent;color:var(--black);font-size:10px;letter-spacing:.2em;text-transform:uppercase;font-family:var(--sans);border:1px solid var(--border);cursor:pointer;transition:background .2s}
    .qz-btn-secondary:hover{background:var(--bg2)}
    @media(max-width:600px){.qz-body{padding:60px 5vw}}
  `}</style>
  <div className="qz">

    {/* HERO */}
    <div className="qz-hero">
      <div className="qz-hero-bg">Aroma</div>
      <span className="qz-label">Scent Quiz</span>
      <h1>Temukan aroma<br/><em>yang mencerminkanmu.</em></h1>
      <p>Setiap orang punya cerita yang berbeda. Jawab 5 pertanyaan singkat dan kami akan menemukan parfum Henima yang paling pas untukmu.</p>
      {step==='intro' && <button className="qz-start" onClick={()=>setStep('quiz')}>Mulai Quiz</button>}
    </div>

    {/* QUIZ */}
    {step==='quiz' && (
      <div className="qz-body">
        <div className="qz-progress">
          <div className="qz-progress-fill" style={{width: progress+'%'}}/>
        </div>
        <p className="qz-step">Pertanyaan {current+1} dari {questions.length}</p>
        <p className={`qz-q ${animating?'fade':''}`}>{questions[current].question}</p>
        <div className="qz-options">
          {questions[current].options.map(opt=>(
            <button key={opt.value} className={`qz-opt ${selected===opt.value?'picked':''}`} onClick={()=>answer(opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* RESULT */}
    {step==='result' && result && (
      <div className="qz-body">
        <div className="qz-result">
          <p className="qz-result-label">Hasil untukmu</p>
          <h2>Parfum yang paling mencerminkanmu adalah...</h2>
          <p>Berdasarkan jawabanmu, kami menemukan wewangian yang paling sesuai dengan kepribadian dan ceritamu.</p>
          <div className="qz-product-card">
            {(result as any).photo && <img src={(result as any).photo} alt={result.name} className="qz-product-img"/>}
            <p className="qz-product-name">{result.name}</p>
            <p className="qz-product-desc">{(result as any).description || 'Wewangian yang lahir dari cerita nyata — untuk kamu yang percaya bahwa aroma adalah cara terbaik mengabadikan momen.'}</p>
          </div>
          <div className="qz-actions">
            <a href={'/shop'} className="qz-btn-primary">Lihat Produk</a>
            <button className="qz-btn-secondary" onClick={reset}>Coba Lagi</button>
          </div>
        </div>
      </div>
    )}

  </div></>)
}
