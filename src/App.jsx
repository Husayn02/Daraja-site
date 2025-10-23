import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

/**********************
 Daraja.online – React skeleton (v1)
 - Home (logo + shior)
 - MockTest (Listening→Reading→Writing→Speaking flow)
 - Levels (A1–C1 chooser)
 - Results (score + level decision) – CEFR mapping
 - Certificate (preview-only demo)
 - AdminPanel (placeholder for now)

 Notes:
 - Tailwind classes are used for styling but optional for first run.
 - Audio/Recording are stubbed with demo data & timers.
 - Level rules: 0–35 no certificate; 36–51 B1; 52–65 B2; 66–75 C1
 - Max skill score = 75
**********************/

/************ utils ************/
const CEFR = (avg) => {
  if (avg < 36) return { label: "Sertifikat berilmaydi", code: null };
  if (avg <= 51) return { label: "B1", code: "B1" };
  if (avg <= 65) return { label: "B2", code: "B2" };
  return { label: "C1", code: "C1" };
};

/************ Layout ************/
function Nav() {
  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-amber-500 text-white grid place-items-center font-bold">D</div>
          <span className="font-semibold text-slate-800">Daraja.online</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/mock" className="hover:text-amber-600">Mock test</Link>
          <Link to="/levels" className="hover:text-amber-600">Darajaviy testlar</Link>
          <Link to="/results" className="hover:text-amber-600">Natijalar</Link>
          <Link to="/certificate" className="hover:text-amber-600">Sertifikat</Link>
          <Link to="/admin" className="hover:text-amber-600">Admin</Link>
        </div>
      </div>
    </nav>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-slate-800">
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      <footer className="border-t mt-12 py-6 text-center text-xs text-slate-500">© {new Date().getFullYear()} Daraja.online • "Harakat qil! Va muvaffaqiyatga erish!"</footer>
    </div>
  );
}

/************ Pages ************/
function Home() {
  const nav = useNavigate();
  return (
    <Shell>
      <section className="text-center py-14">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white grid place-items-center text-2xl font-black">D</div>
          <h1 className="text-3xl md:text-4xl font-bold">Daraja.online</h1>
        </div>
        <p className="text-lg md:text-xl text-slate-600 mb-8">Harakat qil! Va muvaffaqiyatga erish!</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => nav('/mock')} className="px-5 py-3 rounded-full bg-amber-600 text-white hover:bg-amber-700">Mock test yechish</button>
          <button onClick={() => nav('/levels')} className="px-5 py-3 rounded-full bg-slate-900 text-white hover:bg-black">Darajaviy testlar (A1–C1)</button>
        </div>
      </section>
    </Shell>
  );
}

/************ MockTest flow ************/
const demoListeningPool = {
  A2: ["audio/a2_1.mp3", "audio/a2_2.mp3", "audio/a2_3.mp3"],
  B1: ["audio/b1_1.mp3", "audio/b1_2.mp3"],
  B2: ["audio/b2_1.mp3"],
  C1: ["audio/c1_1.mp3"],
};

function useCountdown(seconds, onDone) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);
  useEffect(() => {
    if (left <= 0) { onDone && onDone(); return; }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onDone]);
  return left;
}

function ListeningStage({ level = "A2", onScore }) {
  // random audio from pool per entry
  const src = useMemo(() => {
    const list = demoListeningPool[level] || [];
    if (!list.length) return null;
    const i = Math.floor(Math.random() * list.length);
    return list[i];
  }, [level]);

  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0); // /75

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Eshitib tushunish — {level}</h3>
      <div className="p-4 rounded-lg border bg-white">
        <p className="text-sm text-slate-600 mb-2">Audio (namuna). Siz real fayllarni /public/audio/ ichiga joylaysiz.</p>
        {src ? (
          <audio controls src={src} className="w-full"/>
        ) : (
          <div className="text-sm text-slate-500">Audio topilmadi (demo havzasi bo‘sh).</div>
        )}
      </div>

      <div className="p-4 rounded-lg border bg-white">
        <p className="mb-3">3 ta savol (demo):</p>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="mb-2">
            <div className="font-medium">Savol {idx + 1}</div>
            <div className="flex gap-3 mt-1">
              {['A','B','C','D'].map((k) => (
                <label key={k} className="inline-flex items-center gap-1 text-sm">
                  <input type="radio" name={`q${idx}`} /> {k}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={() => { setScore(60 + Math.floor(Math.random()*16)); setAnswered(true); onScore && onScore(0); }}
          className="mt-2 px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700">
          Javoblarni yuborish
        </button>
        {answered && (
          <div className="mt-3 text-sm text-slate-600">Demo: Sizning eshitish ballingiz keyin yakuniy hisobda belgilab qo‘yiladi.</div>
        )}
      </div>
    </div>
  );
}

function ReadingStage({ onScore }) {
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">O‘qib tushunish</h3>
      <div className="p-4 rounded-lg border bg-white space-y-3">
        <p className="text-sm text-slate-600">Bu yerda matn bo‘ladi (siz yuboradigan namunalar). Pastda variantli savollar.
        </p>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx}>
            <div className="font-medium">Savol {idx + 1}</div>
            <div className="flex gap-3 mt-1">
              {['A','B','C','D'].map((k) => (
                <label key={k} className="inline-flex items-center gap-1 text-sm">
                  <input type="radio" name={`r${idx}`} /> {k}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button onClick={() => { setDone(true); onScore && onScore(0);} } className="px-4 py-2 rounded bg-amber-600 text-white">Javoblarni yuborish</button>
        {done && <div className="text-sm text-slate-600">Demo: o‘qish balli yakunda hisoblanadi.</div>}
      </div>
    </div>
  );
}

function WritingStage({ onUpload }) {
  const [topic] = useState("Mavzu: Texnologiya hayotni osonlashtiradimi yoki qiyinlashtiradimi?");
  const [phase, setPhase] = useState("prep"); // prep → run → upload → done
  const [img, setImg] = useState(null);

  const prepLeft = useCountdown(5, () => setPhase("run"));
  const runLeft = useCountdown(phase === "run" ? 3600 : 0, () => setPhase("upload"));

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Yozish (1 soat ichida rasm yuklash)</h3>
      <div className="p-4 rounded-lg border bg-white space-y-3">
        <div className="font-medium">{topic}</div>
        {phase === 'prep' && <div className="text-sm">Tayyorlanish: {prepLeft}s</div>}
        {phase === 'run' && <div className="text-sm">Qolgan vaqt: {runLeft}s</div>}
        {phase === 'upload' && (
          <div className="space-y-2">
            <div className="text-sm">Vaqt tugadi. Iltimos, yozgan ishngiz fotosuratini yuklang (telefon ham bo‘ladi).</div>
            <input type="file" accept="image/*" onChange={(e)=> setImg(e.target.files?.[0]||null)} />
            <button onClick={()=>{ setPhase("done"); onUpload && onUpload(img); }} className="px-4 py-2 rounded bg-amber-600 text-white">Yuborish</button>
          </div>
        )}
        {phase === 'done' && <div className="text-sm text-green-700">Qabul qilindi. Admin tekshiradi.</div>}
      </div>
    </div>
  );
}

function SpeakingStage() {
  const [step, setStep] = useState(0); // 0..2 for 3 questions
  const [phase, setPhase] = useState("prep");
  const mediaRef = useRef(null);
  const prep = useCountdown(phase === "prep" ? 5 : 0, () => setPhase("record"));
  const talk = useCountdown(phase === "record" ? 30 : 0, () => setPhase("done"));

  useEffect(()=>{
    if (phase === "record") {
      // Here you'd start MediaRecorder real recording
      // For demo we do nothing. After 30s, it auto-stops.
    }
  }, [phase]);

  const next = () => {
    if (step < 2) { setStep(step+1); setPhase("prep"); }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Og‘zaki (3 savol, har biri 5s tayyor, 30s gapirish)</h3>
      <div className="p-4 rounded-lg border bg-white space-y-3">
        <div className="font-medium">Savol {step+1} (demo matn): O‘zingizni tanishtiring / kundalik mavzu haqida gapiring.</div>
        {phase === 'prep' && <div className="text-sm">Tayyorlanish: {prep}s</div>}
        {phase === 'record' && <div className="text-sm">Gapiring: {talk}s</div>}
        {phase === 'done' && (
          <div className="flex items-center gap-3">
            <span className="text-green-700 text-sm">Yozuv saqlandi (demo).</span>
            <button className="px-3 py-2 rounded bg-slate-900 text-white" onClick={next}>Keyingi savol</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MockTest() {
  const [scores, setScores] = useState({ listen: null, read: null, write: null, speak: null });
  const [stage, setStage] = useState(0); // 0=L,1=R,2=W,3=S,4=done

  const next = () => setStage((s) => Math.min(4, s + 1));

  const finalize = () => {
    // For demo assign random plausible scores out of 75 if nulls remain
    const s = {
      listen: scores.listen ?? (60 + Math.floor(Math.random()*16)),
      read: scores.read ?? (60 + Math.floor(Math.random()*16)),
      write: scores.write ?? (60 + Math.floor(Math.random()*16)),
      speak: scores.speak ?? (60 + Math.floor(Math.random()*16)),
    };
    setScores(s);
    setStage(4);
  };

  return (
    <Shell>
      <h2 className="text-2xl font-bold mb-6">Mock test</h2>
      <div className="space-y-6">
        {stage === 0 && (
          <>
            <ListeningStage level="A2" onScore={(v)=> setScores((p)=> ({...p, listen: v}))} />
            <div className="flex justify-end"><button onClick={next} className="px-5 py-2 rounded bg-slate-900 text-white">Keyingi: O‘qish</button></div>
          </>
        )}
        {stage === 1 && (
          <>
            <ReadingStage onScore={(v)=> setScores((p)=> ({...p, read: v}))} />
            <div className="flex justify-end"><button onClick={next} className="px-5 py-2 rounded bg-slate-900 text-white">Keyingi: Yozish</button></div>
          </>
        )}
        {stage === 2 && (
          <>
            <WritingStage onUpload={()=> setScores((p)=> ({...p, write: 0}))} />
            <div className="flex justify-end"><button onClick={next} className="px-5 py-2 rounded bg-slate-900 text-white">Keyingi: Og‘zaki</button></div>
          </>
        )}
        {stage === 3 && (
          <>
            <SpeakingStage />
            <div className="flex justify-end"><button onClick={finalize} className="px-5 py-2 rounded bg-amber-600 text-white">Mock testni yakunlash</button></div>
          </>
        )}
        {stage === 4 && <MockDone scores={scores} />}
      </div>
    </Shell>
  );
}

function MockDone({ scores }) {
  const vals = Object.values(scores).filter((v)=> typeof v === 'number');
  const avg = vals.length ? Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)*100)/100 : 0;
  const lvl = CEFR(avg);
  return (
    <div className="p-6 rounded-xl border bg-white">
      <h3 className="text-xl font-semibold mb-4">Natijangiz qabul qilindi</h3>
      <ul className="text-sm space-y-1">
        <li>Eshitib tushunish: <b>{scores.listen ?? '—'}</b></li>
        <li>O‘qish: <b>{scores.read ?? '—'}</b></li>
        <li>Yozish: <b>{scores.write ?? '—'}</b></li>
        <li>Gapirish: <b>{scores.speak ?? '—'}</b></li>
      </ul>
      <div className="mt-3 text-sm">O‘rtacha: <b>{avg}</b> • Daraja: <b>{lvl.label}</b></div>
      <p className="mt-4 text-slate-600 text-sm">1–2 kun ichida tekshirib, sertifikatga ruxsat beramiz.</p>
      <Link to="/results" className="inline-block mt-4 px-4 py-2 rounded bg-slate-900 text-white">Natijalar sahifasiga</Link>
    </div>
  );
}

function Levels() {
  const nav = useNavigate();
  const levels = ["A1","A2","B1","B2","C1"];
  return (
    <Shell>
      <h2 className="text-2xl font-bold mb-6">Darajaviy testlar</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {levels.map(l => (
          <div key={l} className="p-5 rounded-xl border bg-white">
            <div className="text-lg font-semibold">{l}</div>
            <p className="text-sm text-slate-600">Listening • Reading • Writing</p>
            <button onClick={()=> nav('/mock')} className="mt-3 px-4 py-2 rounded bg-amber-600 text-white">Boshlash</button>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Results() {
  const [name, setName] = useState("");
  const [s, setS] = useState({ listen: "", read: "", write: "", speak: "" });
  const avg = useMemo(()=>{
    const vals = [s.listen, s.read, s.write, s.speak].map(Number).filter(n=>!isNaN(n));
    if (!vals.length) return 0;
    return Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)*100)/100;
  }, [s]);
  const level = CEFR(avg);
  return (
    <Shell>
      <h2 className="text-2xl font-bold mb-6">Natijalar (demo hisoblagich)</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border bg-white space-y-3">
          <input value={name} onChange={(e)=> setName(e.target.value)} placeholder="Ism Familiya" className="w-full border rounded px-3 py-2"/>
          {[
            ["Eshitib tushunish","listen"],
            ["O‘qish","read"],
            ["Yozish","write"],
            ["Gapirish","speak"],
          ].map(([label,key])=> (
            <div key={key} className="flex items-center gap-3">
              <label className="w-44 text-sm">{label} (0–75)</label>
              <input type="number" min={0} max={75} value={s[key]} onChange={(e)=> setS(prev=>({...prev,[key]: e.target.value}))} className="border rounded px-3 py-2 w-36"/>
            </div>
          ))}
          <div className="text-sm text-slate-600">O‘rtacha: <b>{avg}</b> • Daraja: <b>{level.label}</b></div>
        </div>
        <div className="p-5 rounded-xl border bg-white">
          <h3 className="font-semibold mb-3">Sertifikat (CEFR uslubi, soddalashtirilgan)</h3>
          <div className="border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded bg-amber-500 text-white grid place-items-center font-bold">D</div>
              <div className="font-semibold">Daraja.online</div>
            </div>
            <div className="text-center font-semibold">TIL KO‘NIKMALARINI BAHOLASH SERTIFIKATI</div>
            <div className="mt-4 space-y-1 text-sm">
              <div>Ism Familiya: <b>{name || "—"}</b></div>
              <div>Til: Arab tili</div>
              <div>Berilgan sana: {new Date().toLocaleDateString("uz-UZ", { year:'numeric', month:'long', day:'2-digit' })}</div>
            </div>
            <div className="mt-3 text-sm">
              <div className="flex justify-between border-b py-1"><span>Eshitib tushunish</span><b>{s.listen || '—'}</b></div>
              <div className="flex justify-between border-b py-1"><span>O‘qish</span><b>{s.read || '—'}</b></div>
              <div className="flex justify-between border-b py-1"><span>Yozish</span><b>{s.write || '—'}</b></div>
              <div className="flex justify-between border-b py-1"><span>Gapirish</span><b>{s.speak || '—'}</b></div>
            </div>
            <div className="mt-3 text-sm">Daraja: <b>{level.code ?? '—'}</b></div>
            <div className="mt-6 text-center">
              <div className="border-t w-64 mx-auto pt-2 text-xs">Husayn To‘rabekov — Baholovchi va mas’ul shaxs</div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Certificate() {
  return (
    <Shell>
      <h2 className="text-2xl font-bold mb-6">Sertifikat (preview)</h2>
      <p className="text-sm text-slate-600">Bu sahifada yakuniy PDF generatsiya (jspdf/pdfmake) qo‘shiladi. Hozircha preview Results sahifasida mavjud.</p>
    </Shell>
  );
}

function AdminPanel() {
  return (
    <Shell>
      <h2 className="text-2xl font-bold mb-6">Admin panel (demo)</h2>
      <ul className="list-disc pl-5 text-sm space-y-1">
        <li>Foydalanuvchilar ro‘yxati (keyinroq Supabase/Firebase bilan)</li>
        <li>Yozma ishlar (rasm) & Og‘zaki javoblar (audio) ko‘rish</li>
        <li>Ball qo‘yish va sertifikatga ruxsat tugmasi</li>
      </ul>
    </Shell>
  );
}

/************ App ************/
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mock" element={<MockTest />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/results" element={<Results />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
