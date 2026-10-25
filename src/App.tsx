import React, { useState, useEffect } from 'react';
import { 
  Leaf, Calculator, TrendingUp, Smartphone, Download, MapPin, Users, Award, 
  Sprout, CheckCircle2, X, ChevronLeft, Wallet, Percent, Coins, ArrowRight,
  Flame, ShoppingCart, Target, ShieldCheck, Scale, Copy, Check, Sparkles,
  ChevronDown, Globe, RotateCcw
} from 'lucide-react';
import {
  hitungRasioBrisma,
  generateCaption,
  hitungHargaEcommerce,
  simulasiTargetVolume,
  validasiFloorPrice,
  konversiStokGabah
} from './algorithms';
import { translations, Language } from './translations';

// --- CSS Animasi Smooth, Parallax, Glassmorphism & Apple-Inspired Minimalist ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Quicksand:wght@400;500;600;700&display=swap');

  html { 
    scroll-behavior: smooth; 
  }
  
  body { 
    background-color: #FAF6F0; 
    color: #2D3748; 
    font-family: 'Plus Jakarta Sans', 'Quicksand', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .font-display {
    font-family: 'Fredoka', 'Plus Jakarta Sans', sans-serif;
  }

  .bouncy-hover { 
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
  }
  .bouncy-hover:hover { 
    transform: translateY(-4px) scale(1.02); 
  }
  .bouncy-hover:active { 
    transform: scale(0.98); 
  }

  /* Parallax Floating Elements */
  .floating-orb {
    pointer-events: none;
    position: absolute;
    border-radius: 50%;
    filter: blur(50px);
    opacity: 0.35;
    z-index: 0;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .float-slow {
    animation: gentleFloat 6s ease-in-out infinite;
  }
  .float-medium {
    animation: gentleFloat 4.5s ease-in-out infinite 1s;
  }
  .float-fast {
    animation: gentleFloat 3.5s ease-in-out infinite 0.5s;
  }

  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-16px) rotate(3deg); }
  }

  .pulse-glow { animation: pulseGlow 2.5s infinite; }
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0 rgba(244, 99, 146, 0.4); }
    70% { box-shadow: 0 0 0 16px rgba(244, 99, 146, 0); }
    100% { box-shadow: 0 0 0 0 rgba(244, 99, 146, 0); }
  }

  /* Glassmorphism Card Style */
  .apple-card {
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0,0,0,0.02);
  }

  .apple-card-hover {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .apple-card-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 45px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9);
  }

  /* Reveal on Scroll Transitions */
  .reveal-section {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, transform;
  }
  .reveal-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .toast-enter { animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .modal-enter { animation: slideUpModal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
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
  .custom-scroll::-webkit-scrollbar-thumb { background-color: #E2E8F0; border-radius: 20px; }
`;

// --- Web Audio API: Fun Sounds ---
const playFunSound = (type: 'bloop' | 'pop' | 'tada') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
const formatRp = (angka: number) => {
  if (isNaN(angka)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

// Instagram Icon SVG Component
const InstagramIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function NgariungApp() {
  // Default language set to Bahasa Indonesia ('id')
  const [lang, setLang] = useState<Language>('id');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const t = translations[lang];

  const [toast, setToast] = useState({ show: false, message: '' });
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; color: string }>>([]);
  const [scrollY, setScrollY] = useState(0);
  
  // State for Toolbox Modal
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('menu'); 

  // State for UTUB Calculator (HPP)
  const [utubBiaya, setUtubBiaya] = useState('');
  const [utubPanen, setUtubPanen] = useState('');
  const [utubMargin, setUtubMargin] = useState('20');

  // State for TATA Calculator (Kas)
  const [tataPemasukan, setTataPemasukan] = useState('');
  const [tataPengeluaran, setTataPengeluaran] = useState('');

  // 1. Tool State: Rasio BRISMA (SEKAR)
  const [brismaSekam, setBrismaSekam] = useState('');

  // 2. Tool State: Caption Generator (DIGIMARK)
  const [captionNama, setCaptionNama] = useState('Beras Purbaya Organik');
  const [captionKeunggulan, setCaptionKeunggulan] = useState('Beras pulen alami tanpa pemutih & pewangi');
  const [captionHarga, setCaptionHarga] = useState('15000');
  const [captionKontak, setCaptionKontak] = useState('081234567890');
  const [copiedCaption, setCopiedCaption] = useState(false);

  // 3. Tool State: Harga E-Commerce (DIGIMARK)
  const [ecomHpp, setEcomHpp] = useState('12000');
  const [ecomLaba, setEcomLaba] = useState('3000');
  const [ecomFee, setEcomFee] = useState('7');

  // 4. Tool State: Target Volume (UTUB)
  const [targetLabaBulanan, setTargetLabaBulanan] = useState('5000000');
  const [marginPerKg, setMarginPerKg] = useState('2500');

  // 5. Tool State: Floor Price B2B (UTUB)
  const [fpHpp, setFpHpp] = useState('11000');
  const [fpVolume, setFpVolume] = useState('1000');
  const [fpHargaTawar, setFpHargaTawar] = useState('12500000');

  // 6. Tool State: Konversi Stok Gabah (TATA)
  const [stokGabah, setStokGabah] = useState('2000');
  const [hargaJualBeras, setHargaJualBeras] = useState('14000');
  const [rendemenPersen, setRendemenPersen] = useState('62.5');

  // Parallax Scroll Listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll Fade-in & Slide-up
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-section');
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  // --- Handlers ---
  const handleLanguageChange = (newLang: Language) => {
    playFunSound('pop');
    setLang(newLang);
    setIsLangModalOpen(false);
  };

  const handleDownload = (moduleName: string) => {
    playFunSound('tada');
    setToast({ show: true, message: t.toastDownload(moduleName) });

    // File download trigger
    const fileMap: Record<string, string> = {
      'TATA': '/downloads/TATA-BUKU-KAS.pdf',
      'UTUB': '/downloads/UTUB-WORKBOOK.pdf',
      'SEKAR': '/downloads/SEKAR-RESEP.pdf',
    };
    if (fileMap[moduleName]) {
      const a = document.createElement('a');
      a.href = fileMap[moduleName];
      a.download = `${moduleName}-Modul-Purwabakti.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    
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

  const selectTool = (tool: string) => {
    playFunSound('pop');
    setActiveTool(tool);
    if (!isToolboxOpen) setIsToolboxOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    playFunSound('bloop');
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  // --- Calculations ---
  const hppPerKg = utubBiaya && utubPanen ? parseFloat(utubBiaya) / parseFloat(utubPanen) : 0;
  const hargaJual = hppPerKg + (hppPerKg * (parseFloat(utubMargin || '0') / 100));
  const potensiUntung = (hargaJual - hppPerKg) * parseFloat(utubPanen || '0');

  const saldoTata = (parseFloat(tataPemasukan) || 0) - (parseFloat(tataPengeluaran) || 0);

  let brismaRes: { beratTapiokaKg: number; volumeAirLiter: number } | null = null;
  try {
    if (brismaSekam) brismaRes = hitungRasioBrisma(brismaSekam);
  } catch (e) {
    brismaRes = null;
  }

  let generatedCaption = '';
  try {
    if (captionNama && captionHarga) {
      generatedCaption = generateCaption(captionNama, captionKeunggulan, captionHarga, captionKontak);
    }
  } catch (e) {
    generatedCaption = '';
  }

  let ecomHargaJual = 0;
  try {
    if (ecomHpp && ecomLaba && ecomFee) {
      ecomHargaJual = hitungHargaEcommerce(ecomHpp, ecomLaba, ecomFee);
    }
  } catch (e) {
    ecomHargaJual = 0;
  }

  let targetVolumeKg = 0;
  try {
    if (targetLabaBulanan && marginPerKg) {
      targetVolumeKg = simulasiTargetVolume(targetLabaBulanan, marginPerKg);
    }
  } catch (e) {
    targetVolumeKg = 0;
  }

  let floorPriceRes: { batasBawah: number; statusTransaksi: string; isDiterima: boolean } | null = null;
  try {
    if (fpHpp && fpVolume && fpHargaTawar) {
      floorPriceRes = validasiFloorPrice(fpHpp, fpVolume, fpHargaTawar);
    }
  } catch (e) {
    floorPriceRes = null;
  }

  let konversiStokRes: { estimasiBerasKg: number; potensiOmzetRp: number } | null = null;
  try {
    if (stokGabah && hargaJualBeras) {
      konversiStokRes = konversiStokGabah(stokGabah, hargaJualBeras, rendemenPersen || 62.5);
    }
  } catch (e) {
    konversiStokRes = null;
  }

  const getToolTitle = () => {
    const titles = t.toolbox.titles as Record<string, string>;
    return titles[activeTool] || t.toolbox.titles.menu;
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden font-medium text-gray-700 selection:bg-[#F46392] selection:text-white pb-16">
      <style>{styles}</style>

      {/* --- Ambient Floating Orbs for Parallax Depth --- */}
      <div 
        className="floating-orb w-96 h-96 bg-[#F46392]/20 -top-20 -left-20"
        style={{ transform: `translate3d(0, ${scrollY * 0.18}px, 0)` }}
      />
      <div 
        className="floating-orb w-[30rem] h-[30rem] bg-[#63B3ED]/25 top-[30vh] -right-32"
        style={{ transform: `translate3d(0, ${scrollY * -0.12}px, 0)` }}
      />
      <div 
        className="floating-orb w-[28rem] h-[28rem] bg-[#76B852]/20 top-[90vh] left-[10%]"
        style={{ transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }}
      />
      <div 
        className="floating-orb w-[32rem] h-[32rem] bg-[#F46392]/15 top-[180vh] right-[5%]"
        style={{ transform: `translate3d(0, ${scrollY * -0.06}px, 0)` }}
      />

      {/* --- Floating Toast Notification --- */}
      {toast.show && (
        <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/95 backdrop-blur-md px-6 py-4 font-semibold text-[#4F9A52] shadow-2xl toast-enter w-max max-w-[90vw] border border-[#4F9A52]/20">
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
        aria-label={t.fabAria}
        className="fixed bottom-6 right-6 z-40 float-slow pulse-glow flex h-16 w-16 items-center justify-center rounded-full bg-[#F46392] text-white shadow-[0_12px_30px_rgba(244,99,146,0.45)] transition-all hover:scale-110 active:scale-95 cursor-pointer"
        style={{ transform: `translate3d(0, ${Math.sin(scrollY * 0.005) * 4}px, 0)` }}
      >
        <Calculator size={30} strokeWidth={2.2} />
      </button>

      {/* --- Toolbox Modal / Bottom Sheet --- */}
      {isToolboxOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-md sm:items-center p-0 sm:p-4">
          <div className="modal-enter custom-scroll relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-[2.5rem] bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl sm:rounded-[2.5rem] border border-white/60">
            
            {/* Header Modal - Robust layout with safe area padding and perfectly aligned close button */}
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex-1 flex items-center min-w-0">
                {activeTool !== 'menu' ? (
                  <button 
                    onClick={() => selectTool('menu')} 
                    className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
                  >
                    <ChevronLeft size={16} /> {t.toolbox.backMenu}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#F46392] animate-ping" />
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F46392] truncate">{t.toolbox.collectionBadge}</span>
                  </div>
                )}
              </div>

              {activeTool !== 'menu' && (
                <h2 className="text-base sm:text-lg font-bold text-gray-800 text-center truncate px-2 font-display flex-shrink">
                  {getToolTitle()}
                </h2>
              )}

              <div className="flex-1 flex justify-end">
                <button 
                  onClick={toggleToolbox} 
                  aria-label="Tutup Menu Peralatan"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#F46392] hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content: Main Menu */}
            {activeTool === 'menu' && (
              <div className="flex flex-col gap-6">
                
                {/* Section UTUB */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#76B852]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#76B852]">{t.toolbox.menu.utubGroup}</span>
                  </div>
                  <div className="grid gap-2.5">
                    <button onClick={() => selectTool('utub')} className="group flex items-center gap-3.5 rounded-2xl border border-[#76B852]/20 bg-[#76B852]/5 p-3.5 text-left transition-all hover:bg-[#76B852]/15 hover:shadow-sm cursor-pointer">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#76B852] text-white group-hover:scale-105 transition-transform">
                        <Percent size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">{t.toolbox.menu.utubHppTitle}</h4>
                        <p className="text-xs text-gray-500">{t.toolbox.menu.utubHppDesc}</p>
                      </div>
                      <ArrowRight size={18} className="text-[#76B852] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button onClick={() => selectTool('targetVol')} className="group flex items-center gap-3.5 rounded-2xl border border-[#76B852]/20 bg-[#76B852]/5 p-3.5 text-left transition-all hover:bg-[#76B852]/15 hover:shadow-sm cursor-pointer">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#76B852] text-white group-hover:scale-105 transition-transform">
                        <Target size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">{t.toolbox.menu.utubVolTitle}</h4>
                        <p className="text-xs text-gray-500">{t.toolbox.menu.utubVolDesc}</p>
                      </div>
                      <ArrowRight size={18} className="text-[#76B852] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button onClick={() => selectTool('floorPrice')} className="group flex items-center gap-3.5 rounded-2xl border border-[#76B852]/20 bg-[#76B852]/5 p-3.5 text-left transition-all hover:bg-[#76B852]/15 hover:shadow-sm cursor-pointer">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#76B852] text-white group-hover:scale-105 transition-transform">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">{t.toolbox.menu.utubB2bTitle}</h4>
                        <p className="text-xs text-gray-500">{t.toolbox.menu.utubB2bDesc}</p>
                      </div>
                      <ArrowRight size={18} className="text-[#76B852] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                {/* Section TATA */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#63B3ED]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#63B3ED]">{t.toolbox.menu.tataGroup}</span>
                  </div>
                  <div className="grid gap-2.5">
                    <button onClick={() => selectTool('tata')} className="group flex items-center gap-3.5 rounded-2xl border border-[#63B3ED]/20 bg-[#63B3ED]/5 p-3.5 text-left transition-all hover:bg-[#63B3ED]/15 hover:shadow-sm cursor-pointer">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#63B3ED] text-white group-hover:scale-105 transition-transform">
                        <Wallet size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">{t.toolbox.menu.tataKasTitle}</h4>
                        <p className="text-xs text-gray-500">{t.toolbox.menu.tataKasDesc}</p>
                      </div>
                      <ArrowRight size={18} className="text-[#63B3ED] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button onClick={() => selectTool('konversiStok')} className="group flex items-center gap-3.5 rounded-2xl border border-[#63B3ED]/20 bg-[#63B3ED]/5 p-3.5 text-left transition-all hover:bg-[#63B3ED]/15 hover:shadow-sm cursor-pointer">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#63B3ED] text-white group-hover:scale-105 transition-transform">
                        <Scale size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">{t.toolbox.menu.tataStokTitle}</h4>
                        <p className="text-xs text-gray-500">{t.toolbox.menu.tataStokDesc}</p>
                      </div>
                      <ArrowRight size={18} className="text-[#63B3ED] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                {/* Section SEKAR */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#F46392]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F46392]">{t.toolbox.menu.sekarGroup}</span>
                  </div>
                  <div className="grid gap-2.5">
                    <button onClick={() => selectTool('brisma')} className="group flex items-center gap-3.5 rounded-2xl border border-[#F46392]/20 bg-[#F46392]/5 p-3.5 text-left transition-all hover:bg-[#F46392]/15 hover:shadow-sm cursor-pointer">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F46392] text-white group-hover:scale-105 transition-transform">
                        <Flame size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">{t.toolbox.menu.sekarBrismaTitle}</h4>
                        <p className="text-xs text-gray-500">{t.toolbox.menu.sekarBrismaDesc}</p>
                      </div>
                      <ArrowRight size={18} className="text-[#F46392] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                {/* Section DIGIMARK */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#4F9A52]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4F9A52]">{t.toolbox.menu.digimarkGroup}</span>
                  </div>
                  <div className="grid gap-2.5">
                    <button onClick={() => selectTool('caption')} className="group flex items-center gap-3.5 rounded-2xl border border-[#4F9A52]/20 bg-[#4F9A52]/5 p-3.5 text-left transition-all hover:bg-[#4F9A52]/15 hover:shadow-sm cursor-pointer">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4F9A52] text-white group-hover:scale-105 transition-transform">
                        <Sparkles size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">{t.toolbox.menu.digimarkCapTitle}</h4>
                        <p className="text-xs text-gray-500">{t.toolbox.menu.digimarkCapDesc}</p>
                      </div>
                      <ArrowRight size={18} className="text-[#4F9A52] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button onClick={() => selectTool('ecommerce')} className="group flex items-center gap-3.5 rounded-2xl border border-[#4F9A52]/20 bg-[#4F9A52]/5 p-3.5 text-left transition-all hover:bg-[#4F9A52]/15 hover:shadow-sm cursor-pointer">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4F9A52] text-white group-hover:scale-105 transition-transform">
                        <ShoppingCart size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">{t.toolbox.menu.digimarkEcomTitle}</h4>
                        <p className="text-xs text-gray-500">{t.toolbox.menu.digimarkEcomDesc}</p>
                      </div>
                      <ArrowRight size={18} className="text-[#4F9A52] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* --- Tool: UTUB HPP --- */}
            {activeTool === 'utub' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.utubHpp.costLabel}</label>
                  <input type="number" value={utubBiaya} onChange={(e) => setUtubBiaya(e.target.value)} placeholder={t.toolbox.utubHpp.costPlh} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.utubHpp.yieldLabel}</label>
                  <input type="number" value={utubPanen} onChange={(e) => setUtubPanen(e.target.value)} placeholder={t.toolbox.utubHpp.yieldPlh} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.utubHpp.marginLabel}</label>
                  <input type="number" value={utubMargin} onChange={(e) => setUtubMargin(e.target.value)} placeholder={t.toolbox.utubHpp.marginPlh} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white transition-colors" />
                </div>

                <div className="mt-2 rounded-2xl bg-[#76B852] p-5 text-white shadow-lg">
                  <div className="mb-3 border-b border-white/20 pb-2">
                    <p className="text-xs text-white/80">{t.toolbox.utubHpp.resHpp}</p>
                    <p className="text-2xl font-bold font-display">{formatRp(hppPerKg)}</p>
                  </div>
                  <div className="mb-3 border-b border-white/20 pb-2">
                    <p className="text-xs text-white/80">{t.toolbox.utubHpp.resSell}</p>
                    <p className="text-2xl font-bold font-display">{formatRp(hargaJual)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/80">{t.toolbox.utubHpp.resProfit}</p>
                    <p className="text-2xl font-bold text-[#FAF6F0] font-display">{formatRp(potensiUntung)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* --- Tool: UTUB Target Volume --- */}
            {activeTool === 'targetVol' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500 leading-relaxed">{t.toolbox.targetVol.intro}</p>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.targetVol.targetLabel}</label>
                  <input type="number" value={targetLabaBulanan} onChange={(e) => setTargetLabaBulanan(e.target.value)} placeholder="5000000" className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.targetVol.marginLabel}</label>
                  <input type="number" value={marginPerKg} onChange={(e) => setMarginPerKg(e.target.value)} placeholder="2500" className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white transition-colors" />
                </div>

                <div className="mt-2 rounded-2xl bg-[#76B852] p-5 text-center text-white shadow-lg">
                  <p className="text-xs text-white/80">{t.toolbox.targetVol.resTitle}</p>
                  <p className="text-4xl font-bold mt-1 font-display">
                    {targetVolumeKg ? targetVolumeKg.toLocaleString('id-ID') : 0} <span className="text-xl font-normal">Kg</span>
                  </p>
                  <p className="mt-3 text-xs bg-white/20 rounded-xl py-2 px-3">
                    {t.toolbox.targetVol.resDaily(targetVolumeKg ? Math.ceil(targetVolumeKg / 30) : 0)}
                  </p>
                </div>
              </div>
            )}

            {/* --- Tool: UTUB Floor Price B2B --- */}
            {activeTool === 'floorPrice' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500 leading-relaxed">{t.toolbox.floorPrice.intro}</p>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.floorPrice.hppLabel}</label>
                  <input type="number" value={fpHpp} onChange={(e) => setFpHpp(e.target.value)} placeholder="11000" className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.floorPrice.volLabel}</label>
                  <input type="number" value={fpVolume} onChange={(e) => setFpVolume(e.target.value)} placeholder="1000" className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.floorPrice.bidLabel}</label>
                  <input type="number" value={fpHargaTawar} onChange={(e) => setFpHargaTawar(e.target.value)} placeholder="12500000" className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white transition-colors" />
                </div>

                {floorPriceRes && (
                  <div className={`mt-2 rounded-2xl p-5 text-white shadow-lg ${floorPriceRes.isDiterima ? 'bg-[#76B852]' : 'bg-[#E53E3E]'}`}>
                    <div className="flex items-center justify-between border-b border-white/20 pb-2">
                      <span className="text-xs text-white/80">{t.toolbox.floorPrice.baseCost}</span>
                      <span className="font-bold">{formatRp(floorPriceRes.batasBawah)}</span>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-xs text-white/80 uppercase tracking-wider">{t.toolbox.floorPrice.recTitle}</p>
                      <p className="text-2xl font-bold mt-0.5 font-display">
                        {floorPriceRes.isDiterima ? t.toolbox.floorPrice.accepted : t.toolbox.floorPrice.rejected}
                      </p>
                      <p className="text-xs mt-2 bg-black/15 py-1.5 px-3 rounded-xl">
                        {floorPriceRes.isDiterima 
                          ? t.toolbox.floorPrice.profitNote(formatRp(parseFloat(fpHargaTawar) - floorPriceRes.batasBawah))
                          : t.toolbox.floorPrice.lossNote(formatRp(floorPriceRes.batasBawah - parseFloat(fpHargaTawar)))}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- Tool: TATA Kas Harian --- */}
            {activeTool === 'tata' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#4F9A52]">{t.toolbox.tataKas.inLabel}</label>
                  <input type="number" value={tataPemasukan} onChange={(e) => setTataPemasukan(e.target.value)} placeholder={t.toolbox.tataKas.inPlh} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base text-[#4F9A52] outline-none focus:border-[#63B3ED] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#F46392]">{t.toolbox.tataKas.outLabel}</label>
                  <input type="number" value={tataPengeluaran} onChange={(e) => setTataPengeluaran(e.target.value)} placeholder={t.toolbox.tataKas.outPlh} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base text-[#F46392] outline-none focus:border-[#63B3ED] focus:bg-white transition-colors" />
                </div>

                <div className="mt-2 rounded-2xl bg-[#63B3ED] p-5 text-center text-white shadow-lg">
                  <p className="text-xs text-white/80">{t.toolbox.tataKas.resBalance}</p>
                  <p className="text-4xl font-bold mt-1 font-display">{formatRp(saldoTata)}</p>
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white/20 py-2 text-xs">
                    <Coins size={16} /> {t.toolbox.tataKas.note}
                  </div>
                </div>
              </div>
            )}

            {/* --- Tool: TATA Konversi Stok Gabah --- */}
            {activeTool === 'konversiStok' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500 leading-relaxed">{t.toolbox.konversiStok.intro}</p>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.konversiStok.grainLabel}</label>
                  <input type="number" value={stokGabah} onChange={(e) => setStokGabah(e.target.value)} placeholder="2000" className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#63B3ED] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.konversiStok.priceLabel}</label>
                  <input type="number" value={hargaJualBeras} onChange={(e) => setHargaJualBeras(e.target.value)} placeholder="14000" className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#63B3ED] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.konversiStok.yieldRateLabel}</label>
                  <input type="number" value={rendemenPersen} onChange={(e) => setRendemenPersen(e.target.value)} placeholder="62.5" className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#63B3ED] focus:bg-white transition-colors" />
                </div>

                {konversiStokRes && (
                  <div className="mt-2 rounded-2xl bg-[#63B3ED] p-5 text-white shadow-lg">
                    <div className="mb-3 border-b border-white/20 pb-2">
                      <p className="text-xs text-white/80">{t.toolbox.konversiStok.resRice}</p>
                      <p className="text-3xl font-bold mt-0.5 font-display">{konversiStokRes.estimasiBerasKg.toLocaleString('id-ID')} <span className="text-lg font-normal">Kg</span></p>
                    </div>
                    <div>
                      <p className="text-xs text-white/80">{t.toolbox.konversiStok.resRevenue}</p>
                      <p className="text-3xl font-bold text-[#FAF6F0] mt-0.5 font-display">{formatRp(konversiStokRes.potensiOmzetRp)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- Tool: SEKAR Rasio BRISMA --- */}
            {activeTool === 'brisma' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500 leading-relaxed">{t.toolbox.brisma.intro}</p>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.brisma.huskLabel}</label>
                  <input type="number" value={brismaSekam} onChange={(e) => setBrismaSekam(e.target.value)} placeholder="15" className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#F46392] focus:bg-white transition-colors" />
                </div>

                {brismaRes ? (
                  <div className="mt-2 rounded-2xl bg-[#F46392] p-5 text-white shadow-lg space-y-3">
                    <div className="border-b border-white/20 pb-2">
                      <p className="text-xs text-white/80">{t.toolbox.brisma.resTapioca}</p>
                      <p className="text-3xl font-bold mt-0.5 font-display">{brismaRes.beratTapiokaKg} <span className="text-lg font-normal">Kg</span></p>
                      <p className="text-xs text-white/70 mt-0.5">{t.toolbox.brisma.tapiocaNote}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/80">{t.toolbox.brisma.resWater}</p>
                      <p className="text-3xl font-bold mt-0.5 font-display">{brismaRes.volumeAirLiter} <span className="text-lg font-normal">Liter</span></p>
                      <p className="text-xs text-white/70 mt-0.5">{t.toolbox.brisma.waterNote}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 text-xs text-amber-800">
                    {t.toolbox.brisma.emptyHint}
                  </div>
                )}
              </div>
            )}

            {/* --- Tool: DIGIMARK Caption Generator --- */}
            {activeTool === 'caption' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.caption.nameLabel}</label>
                  <input type="text" value={captionNama} onChange={(e) => setCaptionNama(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3 text-sm outline-none focus:border-[#4F9A52] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.caption.uspLabel}</label>
                  <input type="text" value={captionKeunggulan} onChange={(e) => setCaptionKeunggulan(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3 text-sm outline-none focus:border-[#4F9A52] focus:bg-white transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.caption.priceLabel}</label>
                    <input type="number" value={captionHarga} onChange={(e) => setCaptionHarga(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3 text-sm outline-none focus:border-[#4F9A52] focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.caption.waLabel}</label>
                    <input type="text" value={captionKontak} onChange={(e) => setCaptionKontak(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3 text-sm outline-none focus:border-[#4F9A52] focus:bg-white transition-colors" />
                  </div>
                </div>

                <div className="mt-2 rounded-2xl bg-[#4F9A52]/10 border border-[#4F9A52]/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4F9A52]">{t.toolbox.caption.resHeader}</span>
                    <button 
                      onClick={() => copyToClipboard(generatedCaption)}
                      className="flex items-center gap-1.5 rounded-full bg-[#4F9A52] text-white px-3 py-1 text-xs font-semibold hover:bg-[#3e7d41] transition-colors cursor-pointer"
                    >
                      {copiedCaption ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCaption ? t.toolbox.caption.copiedBtn : t.toolbox.caption.copyBtn}
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed font-sans">
                    {generatedCaption || t.toolbox.caption.emptyHint}
                  </div>
                </div>
              </div>
            )}

            {/* --- Tool: DIGIMARK E-Commerce Pricing --- */}
            {activeTool === 'ecommerce' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500 leading-relaxed">{t.toolbox.ecommerce.intro}</p>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.ecommerce.hppLabel}</label>
                  <input type="number" value={ecomHpp} onChange={(e) => setEcomHpp(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#4F9A52] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.ecommerce.profitLabel}</label>
                  <input type="number" value={ecomLaba} onChange={(e) => setEcomLaba(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#4F9A52] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">{t.toolbox.ecommerce.feeLabel}</label>
                  <input type="number" value={ecomFee} onChange={(e) => setEcomFee(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 p-3.5 text-base outline-none focus:border-[#4F9A52] focus:bg-white transition-colors" />
                </div>

                <div className="mt-2 rounded-2xl bg-[#4F9A52] p-5 text-white shadow-lg">
                  <p className="text-xs text-white/80">{t.toolbox.ecommerce.resPrice}</p>
                  <p className="text-4xl font-bold mt-1 font-display">{formatRp(ecomHargaJual)}</p>
                  <div className="mt-3 text-xs bg-white/20 rounded-xl p-2.5 space-y-1">
                    <p>• {t.toolbox.ecommerce.noteBase}: {formatRp((parseFloat(ecomHpp) || 0) + (parseFloat(ecomLaba) || 0))}</p>
                    <p>• {t.toolbox.ecommerce.noteFee(ecomFee)}: {formatRp(Math.floor(ecomHargaJual * ((parseFloat(ecomFee) || 0) / 100)))}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- HEADER: Glassmorphism Nav + Sleek Language Switcher --- */}
      <header className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-4 md:px-12 transition-all">
        <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3.5 py-2 shadow-sm backdrop-blur-xl border border-white/60">
          <img 
            src="/Logo Ngariung Purwabakti.png" 
            alt="Logo Ngariung Purwabakti" 
            className="h-8 sm:h-9 w-auto object-contain transition-transform hover:rotate-6"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-bold leading-tight text-[#4F9A52] font-display">Ngariung</span>
            <span className="text-[11px] sm:text-xs font-semibold leading-tight text-[#F46392]">Purwabakti</span>
          </div>
        </div>

        {/* Right Nav: High-Visibility Accessible Language Switcher + Instagram */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              playFunSound('bloop');
              setIsLangModalOpen(true);
            }}
            aria-label={t.langSelector}
            className="bouncy-hover relative flex items-center gap-2 sm:gap-2.5 rounded-2xl bg-white/90 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-gray-800 shadow-md backdrop-blur-xl border border-gray-200/80 hover:border-[#4F9A52] hover:text-[#4F9A52] hover:shadow-lg transition-all cursor-pointer"
          >
            {/* Red Notification Pulse Dot if language is changed from default ID */}
            {lang !== 'id' && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600 border border-white" />
              </span>
            )}

            <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-xl bg-[#4F9A52]/15 text-[#4F9A52]">
              <Globe size={16} strokeWidth={2.4} />
            </div>
            <span className="font-semibold tracking-tight">{t.langSelector}</span>
            <span className={`inline-flex rounded-lg px-2 py-0.5 text-[11px] font-bold uppercase transition-colors ${
              lang !== 'id' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-600'
            }`}>
              {lang.toUpperCase()}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          <a 
            href="https://www.instagram.com/ngariungpurwabakti/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram @ngariungpurwabakti"
            className="bouncy-hover flex items-center gap-2 rounded-2xl bg-white/90 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-xl border border-white/80 hover:text-[#F46392] hover:border-pink-200 transition-all cursor-pointer"
          >
            <InstagramIcon size={18} className="text-[#F46392]" />
            <span className="hidden lg:inline font-medium">@ngariungpurwabakti</span>
          </a>
        </div>
      </header>

      {/* --- Accessible Language Selection Modal / Bottom Sheet --- */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
          <div 
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 sm:p-8 shadow-2xl modal-enter border border-gray-100"
            role="dialog"
            aria-modal="true"
            aria-label={t.langModalTitle}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4F9A52]/10 text-[#4F9A52]">
                  <Globe size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-display">{t.langModalTitle}</h3>
                  <p className="text-xs text-gray-500">{t.langModalDesc}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  playFunSound('pop');
                  setIsLangModalOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Language Options: Large Touch Targets, Clean & Foolproof */}
            <div className="mt-5 space-y-3">
              {[
                { 
                  code: 'id' as Language, 
                  name: 'Bahasa Indonesia', 
                  desc: 'Bahasa resmi & utama nasional', 
                  flag: '🇮🇩',
                  badge: 'Standar'
                },
                { 
                  code: 'su' as Language, 
                  name: 'Basa Sunda', 
                  desc: 'Basa Sunda Lemes / Hormat resmi désa', 
                  flag: '🌾',
                  badge: 'Lokal'
                },
                { 
                  code: 'en' as Language, 
                  name: 'English', 
                  desc: 'International presentation & overview', 
                  flag: '🇬🇧',
                  badge: 'Global'
                },
              ].map((item) => {
                const isActive = lang === item.code;
                return (
                  <button
                    key={item.code}
                    onClick={() => handleLanguageChange(item.code)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                      isActive
                        ? 'border-[#4F9A52] bg-[#4F9A52]/10 shadow-sm'
                        : 'border-gray-100 bg-gray-50/70 hover:bg-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl sm:text-3xl select-none" role="img" aria-label={item.name}>
                        {item.flag}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-bold ${isActive ? 'text-[#4F9A52]' : 'text-gray-900'}`}>
                            {item.name}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-[#4F9A52] text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    {isActive ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4F9A52] text-white shadow-sm">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- HERO SECTION: Parallax & Minimalist --- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-24 text-center overflow-hidden">
        
        {/* Subtle Decorative Floating Badges in Background */}
        <div 
          className="absolute left-10 top-40 hidden lg:flex items-center gap-2 rounded-2xl apple-card px-4 py-2 text-xs font-semibold text-[#76B852] float-slow shadow-sm"
          style={{ transform: `translate3d(0, ${scrollY * -0.15}px, 0)` }}
        >
          <Sprout size={16} /> {t.hero.badgeLeft}
        </div>
        <div 
          className="absolute right-12 top-48 hidden lg:flex items-center gap-2 rounded-2xl apple-card px-4 py-2 text-xs font-semibold text-[#63B3ED] float-medium shadow-sm"
          style={{ transform: `translate3d(0, ${scrollY * -0.22}px, 0)` }}
        >
          <TrendingUp size={16} /> {t.hero.badgeRight}
        </div>
        
        {/* Emblem Hero: Solid White Circular Container with Soft Shadow & Border for Clean Cross-Device Blending */}
        <div className="relative mb-8 flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center rounded-full bg-white p-6 shadow-xl shadow-gray-200/60 border border-gray-100/90 transition-transform hover:scale-105 duration-500">
          <img 
            src="/Logo Ngariung Purwabakti.png" 
            alt="Ngariung Purwabakti" 
            className="h-full w-full object-contain select-none"
          />
        </div>

        {/* Hero Tagline Pill */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#63B3ED]/30 bg-white/80 px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide text-[#2B6CB0] shadow-sm backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#63B3ED] animate-ping" />
          {t.hero.tagline}
        </div>

        {/* Heading: Subtle Float & Smooth Parallax Entrance */}
        <h1 
          className="mb-6 flex flex-col items-center text-6xl font-bold tracking-tight md:text-8xl font-display float-slow"
          style={{ transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }}
        >
          <span className="text-[#4F9A52]">Ngariung</span>
          <span className="text-[#F46392] mt-[-6px]">Purwabakti</span>
        </h1>

        <p 
          className="mb-12 max-w-2xl text-lg sm:text-xl text-gray-600 font-normal leading-relaxed transition-opacity duration-300"
          style={{ transform: `translate3d(0, ${scrollY * 0.02}px, 0)` }}
        >
          {t.hero.descPart1} <strong className="font-semibold text-gray-800">{t.hero.descHighlight}</strong> {t.hero.descPart2}
        </p>

        <a 
          href="#fakta-desa"
          onClick={() => playFunSound('bloop')}
          className="bouncy-hover group inline-flex items-center gap-3 rounded-full bg-[#F46392] px-8 py-4 text-lg font-semibold text-white shadow-[0_15px_35px_-10px_rgba(244,99,146,0.6)] cursor-pointer"
        >
          {t.hero.cta}
          <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
        </a>
      </section>

      {/* --- FAKTA DESA SECTION --- */}
      <section id="fakta-desa" className="relative px-6 py-28 md:px-12 z-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center reveal-section">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#4F9A52] bg-[#4F9A52]/10 px-4 py-1.5 rounded-full inline-block mb-3">
              {t.fakta.badge}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-display">{t.fakta.title}</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">{t.fakta.subtitle}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="reveal-section apple-card apple-card-hover flex flex-col items-center rounded-3xl p-8 text-center">
              <div 
                className="mb-5 rounded-2xl bg-[#63B3ED]/15 p-5 text-[#63B3ED] float-slow"
                style={{ transform: `translate3d(0, ${scrollY * 0.03}px, 0)` }}
              >
                <Users size={36} strokeWidth={2.2} />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-800 font-display">{t.fakta.card1Title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-normal">{t.fakta.card1Desc}</p>
            </div>

            <div className="reveal-section apple-card apple-card-hover flex flex-col items-center rounded-3xl p-8 text-center" style={{ transitionDelay: '150ms' }}>
              <div 
                className="mb-5 rounded-2xl bg-[#76B852]/15 p-5 text-[#76B852] float-medium"
                style={{ transform: `translate3d(0, ${scrollY * -0.02}px, 0)` }}
              >
                <MapPin size={36} strokeWidth={2.2} />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-800 font-display">{t.fakta.card2Title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-normal">{t.fakta.card2Desc}</p>
            </div>

            <div className="reveal-section apple-card apple-card-hover flex flex-col items-center rounded-3xl p-8 text-center" style={{ transitionDelay: '300ms' }}>
              <div 
                className="mb-5 rounded-2xl bg-[#F46392]/15 p-5 text-[#F46392] float-fast"
                style={{ transform: `translate3d(0, ${scrollY * 0.04}px, 0)` }}
              >
                <Award size={36} strokeWidth={2.2} />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-800 font-display">{t.fakta.card3Title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-normal">{t.fakta.card3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FLUID SECTION DIVIDER: Wave Gradient Transition --- */}
      <div className="relative -mb-1 overflow-hidden leading-none text-white pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-16 sm:h-24 preserve-3d" preserveAspectRatio="none">
          <path 
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" 
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* --- PROGRAM MODULES (FLUID APPLE-INSPIRED STACK) --- */}
      <section className="relative bg-white px-6 pt-16 pb-32 md:px-12 z-20">
        <div className="mx-auto max-w-4xl">
          
          <div className="mb-24 text-center reveal-section">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#76B852] bg-[#76B852]/10 px-4 py-1.5 rounded-full inline-block mb-3">
              {t.modules.badge}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-display">{t.modules.title}</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto font-normal">
              {t.modules.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-28">
            {[
              {
                id: 'tata',
                pillar: t.modules.tata.pillar,
                title: t.modules.tata.title,
                subtitle: t.modules.tata.subtitle,
                desc: t.modules.tata.desc,
                accentColor: '#63B3ED',
                badgeText: '#3182CE',
                fromGrad: 'from-[#63B3ED]',
                toGrad: 'to-[#90CDF4]',
                shadowColor: 'rgba(99,179,237,0.5)',
                floatClass: 'float-slow',
                floatTransform: `translate3d(0, ${Math.sin(scrollY * 0.003) * 6}px, 0)`,
                icon: <Calculator size={56} strokeWidth={2.2} />,
                downloadModule: 'TATA',
                downloadLabel: t.modules.tata.btnDownload,
                tools: [
                  { label: t.modules.tata.btnStok, toolKey: 'konversiStok', icon: <Scale size={16} />, hoverText: 'hover:text-[#3182CE]' },
                  { label: t.modules.tata.btnKas, toolKey: 'tata', icon: <Wallet size={16} />, hoverText: 'hover:text-[#3182CE]' }
                ],
                dividerFrom: '#63B3ED',
                dividerTo: '#76B852'
              },
              {
                id: 'utub',
                pillar: t.modules.utub.pillar,
                title: t.modules.utub.title,
                subtitle: t.modules.utub.subtitle,
                desc: t.modules.utub.desc,
                accentColor: '#76B852',
                badgeText: '#2F855A',
                fromGrad: 'from-[#76B852]',
                toGrad: 'to-[#9AE6B4]',
                shadowColor: 'rgba(118,184,82,0.5)',
                floatClass: 'float-medium',
                floatTransform: `translate3d(0, ${Math.cos(scrollY * 0.003) * 6}px, 0)`,
                icon: <TrendingUp size={56} strokeWidth={2.2} />,
                downloadModule: 'UTUB',
                downloadLabel: t.modules.utub.btnDownload,
                tools: [
                  { label: t.modules.utub.btnHpp, toolKey: 'utub', icon: <Percent size={16} />, hoverText: 'hover:text-[#2F855A]' },
                  { label: t.modules.utub.btnVol, toolKey: 'targetVol', icon: <Target size={16} />, hoverText: 'hover:text-[#2F855A]' },
                  { label: t.modules.utub.btnB2b, toolKey: 'floorPrice', icon: <ShieldCheck size={16} />, hoverText: 'hover:text-[#2F855A]' }
                ],
                dividerFrom: '#76B852',
                dividerTo: '#F46392'
              },
              {
                id: 'sekar',
                pillar: t.modules.sekar.pillar,
                title: t.modules.sekar.title,
                subtitle: t.modules.sekar.subtitle,
                desc: t.modules.sekar.desc,
                accentColor: '#F46392',
                badgeText: '#B83280',
                fromGrad: 'from-[#F46392]',
                toGrad: 'to-[#FED7E2]',
                shadowColor: 'rgba(244,99,146,0.5)',
                floatClass: 'float-slow',
                floatTransform: `translate3d(0, ${Math.sin(scrollY * 0.003 + 1) * 6}px, 0)`,
                icon: <Leaf size={56} strokeWidth={2.2} />,
                downloadModule: 'SEKAR',
                downloadLabel: t.modules.sekar.btnDownload,
                tools: [
                  { label: t.modules.sekar.btnBrisma, toolKey: 'brisma', icon: <Flame size={16} />, hoverText: 'hover:text-[#B83280]' }
                ],
                dividerFrom: '#F46392',
                dividerTo: '#4F9A52'
              },
              {
                id: 'digimark',
                pillar: t.modules.digimark.pillar,
                title: t.modules.digimark.title,
                subtitle: t.modules.digimark.subtitle,
                desc: t.modules.digimark.desc,
                accentColor: '#4F9A52',
                badgeText: '#22543D',
                fromGrad: 'from-[#4F9A52]',
                toGrad: 'to-[#9AE6B4]',
                shadowColor: 'rgba(79,154,82,0.5)',
                floatClass: 'float-medium',
                floatTransform: `translate3d(0, ${Math.cos(scrollY * 0.003 + 1) * 6}px, 0)`,
                icon: <Smartphone size={56} strokeWidth={2.2} />,
                downloadModule: 'DIGIMARK',
                downloadLabel: t.modules.digimark.btnDownload,
                tools: [
                  { label: t.modules.digimark.btnCaption, toolKey: 'caption', icon: <Sparkles size={16} />, hoverText: 'hover:text-[#22543D]' },
                  { label: t.modules.digimark.btnEcom, toolKey: 'ecommerce', icon: <ShoppingCart size={16} />, hoverText: 'hover:text-[#22543D]' }
                ],
                dividerFrom: null,
                dividerTo: null
              }
            ].map((program, idx, arr) => (
              <React.Fragment key={program.id}>
                <div id={program.id} className="reveal-section relative group">
                  <div 
                    className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none"
                    style={{ backgroundImage: `linear-gradient(to right, ${program.accentColor}25, transparent, transparent)` }}
                  />
                  
                  <div className="relative rounded-[2.5rem] bg-[#FAF6F0]/70 border border-gray-100 p-8 sm:p-12 transition-all hover:bg-white hover:shadow-xl hover:border-gray-200">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                      
                      {/* Program Emblem Icon */}
                      <div 
                        className={`bouncy-hover relative flex h-32 w-32 shrink-0 items-center justify-center rounded-[2.2rem] bg-gradient-to-tr ${program.fromGrad} ${program.toGrad} text-white ${program.floatClass}`}
                        style={{ 
                          boxShadow: `0 20px 40px -10px ${program.shadowColor}`,
                          transform: program.floatTransform 
                        }}
                      >
                        {program.icon}
                      </div>

                      {/* Program Details */}
                      <div className="flex-1 text-center md:text-left">
                        <div 
                          className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2"
                          style={{ backgroundColor: `${program.accentColor}25`, color: program.badgeText }}
                        >
                          {program.pillar}
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">{program.title}</h3>
                        <p className="text-lg font-semibold mb-3" style={{ color: program.accentColor }}>{program.subtitle}</p>
                        <p className="text-gray-600 text-base leading-relaxed mb-8">
                          {program.desc}
                        </p>

                        {/* Interactive Buttons */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <button 
                            onClick={() => handleDownload(program.downloadModule)}
                            className="bouncy-hover flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-lg cursor-pointer"
                            style={{ 
                              backgroundColor: program.accentColor,
                              boxShadow: `0 10px 25px -5px ${program.shadowColor}`
                            }}
                          >
                            <Download size={18} /> {program.downloadLabel}
                          </button>

                          {program.tools.map((tool) => (
                            <button 
                              key={tool.toolKey}
                              onClick={() => selectTool(tool.toolKey)}
                              className={`bouncy-hover flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition-all cursor-pointer shadow-sm ${tool.hoverText}`}
                              style={{ borderColor: undefined }}
                            >
                              {tool.icon} {tool.label}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Soft Fluid Gradient Spacer between sections */}
                {idx < arr.length - 1 && (
                  <div className="relative flex items-center justify-center">
                    <div 
                      className="h-20 w-px"
                      style={{ 
                        backgroundImage: `linear-gradient(to bottom, ${program.dividerFrom}66, ${program.dividerTo}66, transparent)` 
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER: Clean Apple-Style Minimalist --- */}
      <footer className="relative bg-[#FAF6F0] px-6 pt-24 pb-16 text-center text-gray-500 overflow-hidden">
        
        {/* Soft Radial Ambient Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        
        <div className="flex justify-center gap-2.5 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F46392] float-slow"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#63B3ED] float-medium"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#76B852] float-fast"></span>
        </div>

        <p className="font-bold text-gray-900 text-lg sm:text-xl font-display">
          {t.footer.title}
        </p>
        <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
          {t.footer.location}
        </p>

        {/* Link Instagram */}
        <div className="mt-5 flex justify-center">
          <a 
            href="https://www.instagram.com/ngariungpurwabakti/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bouncy-hover inline-flex items-center gap-2 rounded-full apple-card px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#F46392] hover:border-pink-200 transition-colors shadow-sm"
          >
            <InstagramIcon size={18} className="text-[#F46392]" />
            <span>{t.footer.instagram}</span>
          </a>
        </div>

        {/* Dibangun oleh Gemilang */}
        <div className="mt-10 mx-auto max-w-lg rounded-3xl apple-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://gemilang.club" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Kunjungi Gemilang Club"
              className="shrink-0 transition-transform hover:scale-105"
            >
              <img 
                src="/gemilang_logo.png" 
                alt="Logo Gemilang" 
                className="h-12 w-auto object-contain"
              />
            </a>
            <div className="text-center sm:text-left">
              <span className="inline-block text-[11px] uppercase tracking-wider font-bold text-[#F46392] bg-[#F46392]/10 px-2.5 py-0.5 rounded-full mb-1">
                {t.footer.devBadge}
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t.footer.devText} <a href="https://gemilang.club" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 underline decoration-[#F46392] decoration-2 underline-offset-4 hover:text-[#F46392] transition-colors">Gemilang (gemilang.club)</a>.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}