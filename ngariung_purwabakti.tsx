import React, { useState, useEffect } from 'react';
import { Leaf, Calculator, TrendingUp, Smartphone, Download, MapPin, Users, Award, Sprout, CheckCircle2, X, ChevronLeft, Wallet, Percent, Coins, ArrowRight } from 'lucide-react';

// --- CSS Animasi Smooth & Bouncy ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');

  html { scroll-behavior: smooth; }
  body { background-color: #FDF8F2; color: #333; font-family: 'Fredoka', 'Quicksand', sans-serif; }
  
  .bouncy-hover { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .bouncy-hover:hover { transform: scale(1.05) translateY(-5px); }
  .bouncy-hover:active { transform: scale(0.95); }

  .float-anim { animation: float 3s ease-in-out infinite; }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  
  .pulse-glow { animation: pulseGlow 2s infinite; }
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0 rgba(244, 99, 146, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(244, 99, 146, 0); }
    100% { box-shadow: 0 0 0 0 rgba(244, 99, 146, 0); }
  }

  .toast-enter { animation: slideUpFade 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .modal-enter { animation: slideUpModal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  
  @keyframes slideUpFade {
    0% { transform: translate(-50%, 100%); opacity: 0; }
    100% { transform: translate(-50%, 0); opacity: 1; }
  }
  
  @keyframes slideUpModal {
    0% { transform: translateY(100%); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  .confetti-piece { position: absolute; width: 10px; height: 10px; background: #F46392; border-radius: 50%; animation: fall 2s linear forwards; }
  @keyframes fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
  }

  /* Custom Scrollbar for Modal */
  .custom-scroll::-webkit-scrollbar { width: 6px; }
  .custom-scroll::-webkit-scrollbar-track { background: transparent; }
  .custom-scroll::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
`;

// --- Web Audio API: Fun Sounds ---
const playFunSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'bloop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'tada') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
      osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (e) {
    console.log("Audio not supported or blocked", e);
  }
};

// Format Rupiah Helper
const formatRp = (angka) => {
  if (!angka) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

export default function NgariungApp() {
  const [toast, setToast] = useState({ show: false, message: '' });
  const [confetti, setConfetti] = useState([]);
  
  // State for Toolbox Modal
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [activeTool, setActiveTool] = useState('menu'); // 'menu', 'tata', 'utub'

  // State for UTUB Calculator
  const [utubBiaya, setUtubBiaya] = useState('');
  const [utubPanen, setUtubPanen] = useState('');
  const [utubMargin, setUtubMargin] = useState('20');

  // State for TATA Calculator
  const [tataPemasukan, setTataPemasukan] = useState('');
  const [tataPengeluaran, setTataPengeluaran] = useState('');

  // --- Handlers ---
  const handleDownload = (moduleName) => {
    playFunSound('tada');
    setToast({ show: true, message: `PDF Modul ${moduleName} berhasil diunduh!` });
    
    const newConfetti = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100 + '%',
      color: ['#F46392', '#63B3ED', '#76B852', '#FACC15'][Math.floor(Math.random() * 4)]
    }));
    setConfetti(newConfetti);

    setTimeout(() => {
      setToast({ show: false, message: '' });
      setConfetti([]);
    }, 3000);
  };

  const toggleToolbox = () => {
    playFunSound('bloop');
    setIsToolboxOpen(!isToolboxOpen);
    if (!isToolboxOpen) setActiveTool('menu');
  };

  const selectTool = (tool) => {
    playFunSound('pop');
    setActiveTool(tool);
  };

  // --- Calculator Logic ---
  const hppPerKg = utubBiaya && utubPanen ? parseFloat(utubBiaya) / parseFloat(utubPanen) : 0;
  const hargaJual = hppPerKg + (hppPerKg * (parseFloat(utubMargin || 0) / 100));
  const potensiUntung = (hargaJual - hppPerKg) * parseFloat(utubPanen || 0);

  const saldoTata = (parseFloat(tataPemasukan) || 0) - (parseFloat(tataPengeluaran) || 0);

  // --- Renders ---
  return (
    <div className="relative min-h-screen overflow-x-hidden font-medium text-gray-700 selection:bg-[#F46392] selection:text-white pb-24">
      <style>{styles}</style>

      {/* --- Floating Toast Notification --- */}
      {toast.show && (
        <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white px-6 py-4 font-semibold text-[#4F9A52] shadow-xl toast-enter w-max max-w-[90vw]">
          <CheckCircle2 size={24} className="text-[#4F9A52] shrink-0" />
          <span className="truncate">{toast.message}</span>
          {confetti.map(c => (
            <div key={c.id} className="confetti-piece" style={{ left: c.left, backgroundColor: c.color }} />
          ))}
        </div>
      )}

      {/* --- Floating Action Button (Toolbox) --- */}
      <button 
        onClick={toggleToolbox}
        className="fixed bottom-6 right-6 z-40 float-anim pulse-glow flex h-16 w-16 items-center justify-center rounded-full bg-[#F46392] text-white shadow-[0_10px_25px_rgba(244,99,146,0.5)] transition-transform hover:scale-110 active:scale-95"
      >
        <Calculator size={32} />
      </button>

      {/* --- Toolbox Modal / Bottom Sheet --- */}
      {isToolboxOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#FDF8F2]/80 backdrop-blur-sm sm:items-center">
          <div className="modal-enter custom-scroll relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem]">
            
            {/* Header Modal */}
            <div className="mb-6 flex items-center justify-between">
              {activeTool !== 'menu' ? (
                <button onClick={() => selectTool('menu')} className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                  <ChevronLeft size={24} />
                </button>
              ) : (
                <div className="h-10 w-10"></div> // Spacer
              )}
              <h2 className="text-2xl font-semibold text-gray-800">
                {activeTool === 'menu' ? 'Peralatan Desa' : activeTool === 'utub' ? 'Kalkulator UTUB' : 'Simulasi TATA'}
              </h2>
              <button onClick={toggleToolbox} className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-[#F46392] hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content: Menu */}
            {activeTool === 'menu' && (
              <div className="flex flex-col gap-4">
                <button onClick={() => selectTool('utub')} className="group flex items-center gap-4 rounded-3xl border-2 border-transparent bg-[#76B852]/10 p-4 text-left transition-colors hover:border-[#76B852]/30">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#76B852] text-white group-hover:scale-110 transition-transform">
                    <Percent size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#76B852]">Kalkulator HPP</h3>
                    <p className="text-sm text-gray-500">Hitung harga modal & margin (UTUB)</p>
                  </div>
                  <ArrowRight className="text-[#76B852] opacity-50 group-hover:opacity-100" />
                </button>

                <button onClick={() => selectTool('tata')} className="group flex items-center gap-4 rounded-3xl border-2 border-transparent bg-[#63B3ED]/10 p-4 text-left transition-colors hover:border-[#63B3ED]/30">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#63B3ED] text-white group-hover:scale-110 transition-transform">
                    <Wallet size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#63B3ED]">Simulasi Kas</h3>
                    <p className="text-sm text-gray-500">Hitung saldo bersih hari ini (TATA)</p>
                  </div>
                  <ArrowRight className="text-[#63B3ED] opacity-50 group-hover:opacity-100" />
                </button>
              </div>
            )}

            {/* Content: Kalkulator UTUB */}
            {activeTool === 'utub' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Total Biaya Produksi (Rp)</label>
                  <input type="number" value={utubBiaya} onChange={(e) => setUtubBiaya(e.target.value)} placeholder="Misal: 5000000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 text-lg outline-none focus:border-[#76B852] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Total Panen (Kg)</label>
                  <input type="number" value={utubPanen} onChange={(e) => setUtubPanen(e.target.value)} placeholder="Misal: 1000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 text-lg outline-none focus:border-[#76B852] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Target Margin (%)</label>
                  <input type="number" value={utubMargin} onChange={(e) => setUtubMargin(e.target.value)} placeholder="Misal: 20" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 text-lg outline-none focus:border-[#76B852] focus:bg-white" />
                </div>

                <div className="mt-4 rounded-3xl bg-[#76B852] p-5 text-white shadow-lg">
                  <div className="mb-3 border-b border-white/20 pb-3">
                    <p className="text-sm text-white/80">Harga Modal (HPP) per Kg</p>
                    <p className="text-2xl font-bold">{formatRp(hppPerKg)}</p>
                  </div>
                  <div className="mb-3 border-b border-white/20 pb-3">
                    <p className="text-sm text-white/80">Saran Harga Jual per Kg</p>
                    <p className="text-2xl font-bold">{formatRp(hargaJual)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Potensi Keuntungan Bersih</p>
                    <p className="text-2xl font-bold text-[#FDF8F2]">{formatRp(potensiUntung)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Content: Kalkulator TATA */}
            {activeTool === 'tata' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#4F9A52]">Pemasukan Hari Ini (Rp)</label>
                  <input type="number" value={tataPemasukan} onChange={(e) => setTataPemasukan(e.target.value)} placeholder="Uang masuk..." className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 text-lg text-[#4F9A52] outline-none focus:border-[#63B3ED] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#F46392]">Pengeluaran Hari Ini (Rp)</label>
                  <input type="number" value={tataPengeluaran} onChange={(e) => setTataPengeluaran(e.target.value)} placeholder="Uang keluar..." className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 text-lg text-[#F46392] outline-none focus:border-[#63B3ED] focus:bg-white" />
                </div>

                <div className="mt-4 rounded-3xl bg-[#63B3ED] p-5 text-center text-white shadow-lg">
                  <p className="text-sm text-white/80">Sisa Saldo Kas Bersih</p>
                  <p className="text-4xl font-bold mt-1">{formatRp(saldoTata)}</p>
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white/20 py-2 text-sm">
                    <Coins size={16} /> Jangan lupa dicatat di Buku TATA ya!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- HEADER: Logo Kolaborasi --- */}
      <header className="absolute left-0 right-0 top-0 z-10 flex flex-col items-center justify-between gap-4 p-6 sm:flex-row md:px-12">
        <div className="flex h-10 items-center justify-center rounded-xl bg-white/50 px-4 backdrop-blur-sm">
          {/* Logo Placeholder - Asumsi ditaruh di folder public */}
          <div className="flex items-center gap-2 font-bold text-gray-800">
             <span className="text-xl tracking-tight">Danantara</span>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-full bg-white/60 px-5 py-2 shadow-sm backdrop-blur-md">
           <span className="text-xl font-bold text-[#00A39D] tracking-tight">BSI</span>
           <div className="h-5 w-px bg-gray-400"></div>
           <span className="text-lg font-semibold text-[#F1A03C]">BSI <span className="text-[#00A39D]">MASLAHAT</span></span>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative flex min-h-[95vh] flex-col items-center justify-center px-6 pt-28 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FDF8F2] via-[#FDF8F2] to-white" />
        
        {/* Emblem Vector (CSS Based matching the logo style) */}
        <div className="float-anim mb-8 flex h-56 w-56 items-center justify-center rounded-full bg-white p-2 shadow-[0_20px_60px_rgba(244,99,146,0.15)] border-4 border-white overflow-hidden">
          <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" fill="#FDF8F2" />
            <circle cx="100" cy="100" r="90" fill="#fff" stroke="#F46392" strokeWidth="6" />
            {/* Sun */}
            <circle cx="130" cy="50" r="22" fill="#F46392" />
            {/* Mountains */}
            <path d="M15 120 L80 65 L125 105 L165 75 L195 110 L195 130 L15 130 Z" fill="#63B3ED" />
            {/* Trees */}
            <circle cx="165" cy="85" r="15" fill="#4F9A52" />
            <rect x="162" y="90" width="6" height="25" fill="#4F9A52" />
            {/* Houses (Pink) */}
            <path d="M60 85 L95 60 L130 85 L130 115 L60 115 Z" fill="#F46392" />
            <rect x="70" y="85" width="50" height="30" fill="#fff" />
            <rect x="80" y="95" width="10" height="15" fill="#63B3ED" />
            <rect x="100" y="95" width="10" height="10" fill="#63B3ED" />
            
            <path d="M130 100 L155 80 L180 100 L180 120 L130 120 Z" fill="#F46392" />
            <rect x="140" y="100" width="30" height="20" fill="#fff" />
            <rect x="145" y="105" width="8" height="15" fill="#F46392" />
            
            {/* Fields */}
            <path d="M10 120 Q100 110 190 130 L190 180 Q100 190 10 160 Z" fill="#76B852" />
            <path d="M20 140 Q100 130 180 150" stroke="#FDF8F2" strokeWidth="4" fill="none" />
            <path d="M120 120 Q160 140 190 135 L190 160 Q150 160 100 180 Z" fill="#63B3ED" />
            
            {/* People */}
            <circle cx="60" cy="130" r="12" fill="#F46392" />
            <path d="M40 160 Q60 145 80 160 Z" fill="#F46392" />
            <circle cx="95" cy="120" r="16" fill="#63B3ED" />
            <path d="M70 170 Q95 145 120 170 Z" fill="#63B3ED" />
            <circle cx="125" cy="135" r="10" fill="#4F9A52" />
            <path d="M110 165 Q125 155 140 165 Z" fill="#4F9A52" />
            
            {/* Leaves Left */}
            <path d="M25 105 Q25 80 40 85 Q40 110 25 105 Z" fill="#4F9A52" />
            <path d="M45 120 Q30 95 45 90 Q60 115 45 120 Z" fill="#4F9A52" />
            
            {/* Bottom Big Leaves */}
            <path d="M30 160 Q80 190 95 175 Q60 140 30 160 Z" fill="#4F9A52" stroke="#fff" strokeWidth="3" />
            <path d="M170 160 Q120 190 105 175 Q140 140 170 160 Z" fill="#4F9A52" stroke="#fff" strokeWidth="3" />
            <path d="M85 185 Q100 170 100 195 Q85 195 85 185 Z" fill="#4F9A52" />
            <path d="M115 185 Q100 170 100 195 Q115 195 115 185 Z" fill="#4F9A52" />
          </svg>
        </div>

        <p className="mb-3 rounded-full bg-[#63B3ED]/10 px-5 py-2 text-xs font-bold tracking-widest text-[#63B3ED] uppercase">
          Proyek Kolaborasi BSI & BSI Maslahat
        </p>
        <h1 className="mb-4 flex flex-col items-center text-6xl font-semibold tracking-tight md:text-8xl">
          <span className="text-[#4F9A52]">ngariung</span>
          <span className="text-[#F46392] mt-[-5px]">purwabakti</span>
        </h1>
        <p className="mb-12 max-w-lg text-xl text-gray-500">
          Akselerasi kemandirian ekonomi Kelompok Purbaya Tani Mandiri berbasis pendekatan yang berpusat pada manusia.
        </p>

        <a 
          href="#fakta-desa"
          onClick={() => playFunSound('bloop')}
          className="bouncy-hover flex items-center gap-3 rounded-full bg-[#F46392] px-10 py-5 text-xl font-semibold text-white shadow-lg shadow-[#F46392]/40"
        >
          Mulai Jelajahi
          <span className="animate-bounce">↓</span>
        </a>
      </section>

      {/* --- FAKTA DESA SECTION --- */}
      <section id="fakta-desa" className="relative px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-semibold text-[#4F9A52]">Potensi Desa Kita</h2>
            <p className="mt-3 text-lg text-gray-500">Kekuatan Purwabakti untuk berdaya saing dan mandiri.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bouncy-hover flex flex-col items-center rounded-[2rem] bg-white p-8 text-center shadow-sm border-2 border-transparent hover:border-[#63B3ED]/30 transition-colors">
              <div className="mb-4 rounded-full bg-[#63B3ED]/15 p-5 text-[#63B3ED]">
                <Users size={36} />
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-800">8.225 Jiwa Populasi</h3>
              <p className="text-gray-500 font-medium">Sumber daya manusia yang melimpah, motor penggerak utama ekonomi lokal.</p>
            </div>

            <div className="bouncy-hover flex flex-col items-center rounded-[2rem] bg-white p-8 text-center shadow-sm border-2 border-transparent hover:border-[#76B852]/30 transition-colors">
              <div className="mb-4 rounded-full bg-[#76B852]/15 p-5 text-[#76B852]">
                <MapPin size={36} />
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-800">Lereng Gn. Salak</h3>
              <p className="text-gray-500 font-medium">Lanskap alam yang sangat mendukung agrowisata & ekowisata berkelanjutan.</p>
            </div>

            <div className="bouncy-hover flex flex-col items-center rounded-[2rem] bg-white p-8 text-center shadow-sm border-2 border-transparent hover:border-[#F46392]/30 transition-colors">
              <div className="mb-4 rounded-full bg-[#F46392]/15 p-5 text-[#F46392]">
                <Award size={36} />
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-800">Top 75 ADWI 2023</h3>
              <p className="text-gray-500 font-medium">Tervalidasi sebagai Desa Wisata Terbaik, membuka peluang kunjungan luas.</p>
            </div>

            <div className="bouncy-hover flex flex-col items-center rounded-[2rem] bg-white p-8 text-center shadow-sm border-2 border-transparent hover:border-[#4F9A52]/30 transition-colors">
              <div className="mb-4 rounded-full bg-[#4F9A52]/15 p-5 text-[#4F9A52]">
                <Sprout size={36} />
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-800">Hibah BSI Maslahat</h3>
              <p className="text-gray-500 font-medium">Pendanaan senilai Rp 3,9 Miliar (Mesin RMU) butuh manajemen alokasi presisi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROGRAM MODULES (SMOOTH VERTICAL FLOW) --- */}
      <section className="relative bg-white px-6 py-24 md:px-12 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="mx-auto max-w-3xl">
          <div className="mb-24 text-center">
            <h2 className="text-5xl font-semibold text-[#4F9A52]">Modul Belajar</h2>
            <p className="mt-4 text-xl text-gray-500 font-medium">4 Pilar peningkatan kemampuan tata kelola pertanian.</p>
          </div>

          <div className="flex flex-col gap-24">
            
            {/* Program 1: TATA */}
            <div id="tata" className="group relative flex flex-col items-center text-center">
              <div className="bouncy-hover relative z-10 mb-6 flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-[#63B3ED] shadow-xl shadow-[#63B3ED]/30 text-white transform rotate-3 transition-transform group-hover:rotate-6">
                <Calculator size={48} strokeWidth={2.5} />
              </div>
              <h3 className="mb-2 text-4xl font-semibold text-gray-800">TATA</h3>
              <p className="mb-4 text-xl font-semibold text-[#63B3ED]">Tani Mandiri & Tercatat</p>
              <p className="mb-8 max-w-lg text-gray-500 font-medium text-lg leading-relaxed">
                Pencatatan keuangan mandiri untuk menjaga efisiensi usaha tani. Biasakan mencatat kas harian dan memantau stok gabah dengan rapi.
              </p>
              <button 
                onClick={() => handleDownload('TATA')}
                className="bouncy-hover flex items-center gap-3 rounded-full bg-[#63B3ED] px-8 py-4 text-xl font-semibold text-white shadow-lg shadow-[#63B3ED]/30"
              >
                <Download size={24} />
                Unduh Buku Kas
              </button>
            </div>

            {/* Separator Line */}
            <div className="mx-auto h-32 w-1.5 rounded-full bg-gradient-to-b from-[#63B3ED] to-[#76B852] opacity-40"></div>

            {/* Program 2: UTUB */}
            <div id="utub" className="group relative flex flex-col items-center text-center">
              <div className="bouncy-hover relative z-10 mb-6 flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-[#76B852] shadow-xl shadow-[#76B852]/30 text-white transform -rotate-3 transition-transform group-hover:-rotate-6">
                <TrendingUp size={48} strokeWidth={2.5} />
              </div>
              <h3 className="mb-2 text-4xl font-semibold text-gray-800">UTUB</h3>
              <p className="mb-4 text-xl font-semibold text-[#76B852]">Usaha Tepat Untung Berlipat</p>
              <p className="mb-8 max-w-lg text-gray-500 font-medium text-lg leading-relaxed">
                Menghitung Harga Pokok Penjualan (HPP) dengan presisi. Tetapkan margin keuntungan yang pas agar bisnis RMU makin untung.
              </p>
              <button 
                onClick={() => handleDownload('UTUB')}
                className="bouncy-hover flex items-center gap-3 rounded-full bg-[#76B852] px-8 py-4 text-xl font-semibold text-white shadow-lg shadow-[#76B852]/30"
              >
                <Download size={24} />
                Unduh Workbook HPP
              </button>
            </div>

            {/* Separator Line */}
            <div className="mx-auto h-32 w-1.5 rounded-full bg-gradient-to-b from-[#76B852] to-[#F46392] opacity-40"></div>

            {/* Program 3: SEKAR */}
            <div id="sekar" className="group relative flex flex-col items-center text-center">
              <div className="bouncy-hover relative z-10 mb-6 flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-[#F46392] shadow-xl shadow-[#F46392]/30 text-white transform rotate-3 transition-transform group-hover:rotate-6">
                <Leaf size={48} strokeWidth={2.5} />
              </div>
              <h3 className="mb-2 text-4xl font-semibold text-gray-800">SEKAR</h3>
              <p className="mb-4 text-xl font-semibold text-[#F46392]">Sekam Kreatif Bernilai</p>
              <p className="mb-8 max-w-lg text-gray-500 font-medium text-lg leading-relaxed">
                Limbah sekam padi jangan dibuang percuma! Pelajari cara menyulap sekam menjadi arang briket padat yang punya nilai jual tinggi.
              </p>
              <button 
                onClick={() => handleDownload('SEKAR')}
                className="bouncy-hover flex items-center gap-3 rounded-full bg-[#F46392] px-8 py-4 text-xl font-semibold text-white shadow-lg shadow-[#F46392]/30"
              >
                <Download size={24} />
                Unduh SOP Briket
              </button>
            </div>

            {/* Separator Line */}
            <div className="mx-auto h-32 w-1.5 rounded-full bg-gradient-to-b from-[#F46392] to-[#4F9A52] opacity-40"></div>

            {/* Program 4: DIGIMARK */}
            <div id="digimark" className="group relative flex flex-col items-center text-center">
              <div className="bouncy-hover relative z-10 mb-6 flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-[#4F9A52] shadow-xl shadow-[#4F9A52]/30 text-white transform -rotate-3 transition-transform group-hover:-rotate-6">
                <Smartphone size={48} strokeWidth={2.5} />
              </div>
              <h3 className="mb-2 text-4xl font-semibold text-gray-800">DIGIMARK</h3>
              <p className="mb-4 text-xl font-semibold text-[#4F9A52]">Purwabakti Go Online</p>
              <p className="mb-8 max-w-lg text-gray-500 font-medium text-lg leading-relaxed">
                Bawa produk unggulanmu ke ranah digital. Tata foto di studio mini dan rapikan etalase toko online untuk jangkau pasar luas.
              </p>
              <button 
                onClick={() => handleDownload('DIGIMARK')}
                className="bouncy-hover flex items-center gap-3 rounded-full bg-[#4F9A52] px-8 py-4 text-xl font-semibold text-white shadow-lg shadow-[#4F9A52]/30"
              >
                <Download size={24} />
                Unduh Modul Katalog
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER / FYI --- */}
      <footer className="bg-[#FDF8F2] px-6 py-16 text-center text-gray-400">
        <div className="flex justify-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F46392]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#63B3ED]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#76B852]"></span>
        </div>
        <p className="font-semibold text-gray-500 text-lg">Dikembangkan oleh Kelompok 3 ODP BSI Angkatan 31 & 32</p>
        <p className="mt-2 font-medium">Berbasis Pendekatan Human-Centered Design</p>
      </footer>
    </div>
  );
}