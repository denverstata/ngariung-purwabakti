import React, { useState } from 'react';
import { 
  Leaf, Calculator, TrendingUp, Smartphone, Download, MapPin, Users, Award, 
  Sprout, CheckCircle2, X, ChevronLeft, Wallet, Percent, Coins, ArrowRight,
  Flame, ShoppingCart, Target, ShieldCheck, Scale, Copy, Check, Sparkles, MessageCircle
} from 'lucide-react';
import {
  hitungRasioBrisma,
  generateCaption,
  hitungHargaEcommerce,
  simulasiTargetVolume,
  validasiFloorPrice,
  konversiStokGabah
} from './algorithms';

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

export default function NgariungApp() {
  const [toast, setToast] = useState({ show: false, message: '' });
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; color: string }>>([]);
  
  // State for Toolbox Modal
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('menu'); 
  // Tools: 'menu', 'utub', 'tata', 'brisma', 'caption', 'ecommerce', 'targetVol', 'floorPrice', 'konversiStok'

  // State for UTUB Calculator (Existing HPP)
  const [utubBiaya, setUtubBiaya] = useState('');
  const [utubPanen, setUtubPanen] = useState('');
  const [utubMargin, setUtubMargin] = useState('20');

  // State for TATA Calculator (Existing Kas)
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

  // --- Handlers ---
  const handleDownload = (moduleName: string) => {
    playFunSound('tada');
    setToast({ show: true, message: `PDF Modul ${moduleName} berhasil diunduh!` });

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
  // Existing HPP
  const hppPerKg = utubBiaya && utubPanen ? parseFloat(utubBiaya) / parseFloat(utubPanen) : 0;
  const hargaJual = hppPerKg + (hppPerKg * (parseFloat(utubMargin || '0') / 100));
  const potensiUntung = (hargaJual - hppPerKg) * parseFloat(utubPanen || '0');

  // Existing Kas
  const saldoTata = (parseFloat(tataPemasukan) || 0) - (parseFloat(tataPengeluaran) || 0);

  // 1. BRISMA Calculation
  let brismaRes: { beratTapiokaKg: number; volumeAirLiter: number } | null = null;
  try {
    if (brismaSekam) brismaRes = hitungRasioBrisma(brismaSekam);
  } catch (e) {
    brismaRes = null;
  }

  // 2. Caption Calculation
  let generatedCaption = '';
  try {
    if (captionNama && captionHarga) {
      generatedCaption = generateCaption(captionNama, captionKeunggulan, captionHarga, captionKontak);
    }
  } catch (e) {
    generatedCaption = '';
  }

  // 3. E-Commerce Calculation
  let ecomHargaJual = 0;
  try {
    if (ecomHpp && ecomLaba && ecomFee) {
      ecomHargaJual = hitungHargaEcommerce(ecomHpp, ecomLaba, ecomFee);
    }
  } catch (e) {
    ecomHargaJual = 0;
  }

  // 4. Target Volume Calculation
  let targetVolumeKg = 0;
  try {
    if (targetLabaBulanan && marginPerKg) {
      targetVolumeKg = simulasiTargetVolume(targetLabaBulanan, marginPerKg);
    }
  } catch (e) {
    targetVolumeKg = 0;
  }

  // 5. Floor Price Calculation
  let floorPriceRes: { batasBawah: number; statusTransaksi: string; isDiterima: boolean } | null = null;
  try {
    if (fpHpp && fpVolume && fpHargaTawar) {
      floorPriceRes = validasiFloorPrice(fpHpp, fpVolume, fpHargaTawar);
    }
  } catch (e) {
    floorPriceRes = null;
  }

  // 6. Konversi Stok Calculation
  let konversiStokRes: { estimasiBerasKg: number; potensiOmzetRp: number } | null = null;
  try {
    if (stokGabah && hargaJualBeras) {
      konversiStokRes = konversiStokGabah(stokGabah, hargaJualBeras, rendemenPersen || 62.5);
    }
  } catch (e) {
    konversiStokRes = null;
  }

  const getToolTitle = () => {
    switch(activeTool) {
      case 'menu': return 'Peralatan Desa';
      case 'utub': return 'Kalkulator HPP (UTUB)';
      case 'targetVol': return 'Target Volume (UTUB)';
      case 'floorPrice': return 'Indikator B2B (UTUB)';
      case 'tata': return 'Simulasi Kas (TATA)';
      case 'konversiStok': return 'Konversi Stok (TATA)';
      case 'brisma': return 'Rasio BRISMA (SEKAR)';
      case 'caption': return 'Generator Caption (DIGIMARK)';
      case 'ecommerce': return 'Harga E-Commerce (DIGIMARK)';
      default: return 'Peralatan Desa';
    }
  };

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
        aria-label="Buka Peralatan Desa"
        className="fixed bottom-6 right-6 z-40 float-anim pulse-glow flex h-16 w-16 items-center justify-center rounded-full bg-[#F46392] text-white shadow-[0_10px_25px_rgba(244,99,146,0.5)] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <Calculator size={32} />
      </button>

      {/* --- Toolbox Modal / Bottom Sheet --- */}
      {isToolboxOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2B231D]/50 backdrop-blur-sm sm:items-center p-0 sm:p-4">
          <div className="modal-enter custom-scroll relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-[2.5rem] bg-white p-6 sm:p-8 shadow-2xl sm:rounded-[2.5rem]">
            
            {/* Header Modal */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              {activeTool !== 'menu' ? (
                <button 
                  onClick={() => selectTool('menu')} 
                  className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft size={18} /> Menu
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-[#F46392] animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F46392]">Koleksi Alat Pintar</span>
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-800 text-center truncate px-2">
                {getToolTitle()}
              </h2>
              <button 
                onClick={toggleToolbox} 
                className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-[#F46392] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content: Main Menu (Grouped by Program) */}
            {activeTool === 'menu' && (
              <div className="flex flex-col gap-6">
                
                {/* Section UTUB */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#76B852]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#76B852]">Pilar UTUB (Harga & Profit)</span>
                  </div>
                  <div className="grid gap-2.5">
                    <button onClick={() => selectTool('utub')} className="group flex items-center gap-3.5 rounded-2xl border border-[#76B852]/20 bg-[#76B852]/5 p-3.5 text-left transition-all hover:bg-[#76B852]/15 hover:shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#76B852] text-white group-hover:scale-105 transition-transform">
                        <Percent size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">Kalkulator HPP & Margin</h4>
                        <p className="text-xs text-gray-500">Hitung modal pokok panen & estimasi laba per kg</p>
                      </div>
                      <ArrowRight size={18} className="text-[#76B852] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button onClick={() => selectTool('targetVol')} className="group flex items-center gap-3.5 rounded-2xl border border-[#76B852]/20 bg-[#76B852]/5 p-3.5 text-left transition-all hover:bg-[#76B852]/15 hover:shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#76B852] text-white group-hover:scale-105 transition-transform">
                        <Target size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">Simulasi Target Volume</h4>
                        <p className="text-xs text-gray-500">Berapa kg yang harus dijual demi capai target profit bulanan</p>
                      </div>
                      <ArrowRight size={18} className="text-[#76B852] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button onClick={() => selectTool('floorPrice')} className="group flex items-center gap-3.5 rounded-2xl border border-[#76B852]/20 bg-[#76B852]/5 p-3.5 text-left transition-all hover:bg-[#76B852]/15 hover:shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#76B852] text-white group-hover:scale-105 transition-transform">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">Indikator Floor Price B2B</h4>
                        <p className="text-xs text-gray-500">Validasi harga tawar pembeli borongan agar tidak rugi</p>
                      </div>
                      <ArrowRight size={18} className="text-[#76B852] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                {/* Section TATA */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#63B3ED]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#63B3ED]">Pilar TATA (Kas & Stok)</span>
                  </div>
                  <div className="grid gap-2.5">
                    <button onClick={() => selectTool('tata')} className="group flex items-center gap-3.5 rounded-2xl border border-[#63B3ED]/20 bg-[#63B3ED]/5 p-3.5 text-left transition-all hover:bg-[#63B3ED]/15 hover:shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#63B3ED] text-white group-hover:scale-105 transition-transform">
                        <Wallet size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">Simulasi Kas Harian</h4>
                        <p className="text-xs text-gray-500">Hitung saldo bersih pemasukan & pengeluaran hari ini</p>
                      </div>
                      <ArrowRight size={18} className="text-[#63B3ED] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button onClick={() => selectTool('konversiStok')} className="group flex items-center gap-3.5 rounded-2xl border border-[#63B3ED]/20 bg-[#63B3ED]/5 p-3.5 text-left transition-all hover:bg-[#63B3ED]/15 hover:shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#63B3ED] text-white group-hover:scale-105 transition-transform">
                        <Scale size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">Kalkulator Konversi Stok</h4>
                        <p className="text-xs text-gray-500">Hitung hasil giling gabah ke beras & estimasi potensi omzet</p>
                      </div>
                      <ArrowRight size={18} className="text-[#63B3ED] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                {/* Section SEKAR */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#F46392]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F46392]">Pilar SEKAR (Produksi Briket)</span>
                  </div>
                  <div className="grid gap-2.5">
                    <button onClick={() => selectTool('brisma')} className="group flex items-center gap-3.5 rounded-2xl border border-[#F46392]/20 bg-[#F46392]/5 p-3.5 text-left transition-all hover:bg-[#F46392]/15 hover:shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F46392] text-white group-hover:scale-105 transition-transform">
                        <Flame size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">Kalkulator Rasio BRISMA</h4>
                        <p className="text-xs text-gray-500">Hitung kebutuhan tapioka & air berdasarkan berat sekam</p>
                      </div>
                      <ArrowRight size={18} className="text-[#F46392] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                {/* Section DIGIMARK */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#4F9A52]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4F9A52]">Pilar DIGIMARK (Pemasaran & Toko Online)</span>
                  </div>
                  <div className="grid gap-2.5">
                    <button onClick={() => selectTool('caption')} className="group flex items-center gap-3.5 rounded-2xl border border-[#4F9A52]/20 bg-[#4F9A52]/5 p-3.5 text-left transition-all hover:bg-[#4F9A52]/15 hover:shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4F9A52] text-white group-hover:scale-105 transition-transform">
                        <Sparkles size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">Generator Caption Jualan</h4>
                        <p className="text-xs text-gray-500">Bikin teks promosi medsos & WhatsApp instan siap copy</p>
                      </div>
                      <ArrowRight size={18} className="text-[#4F9A52] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button onClick={() => selectTool('ecommerce')} className="group flex items-center gap-3.5 rounded-2xl border border-[#4F9A52]/20 bg-[#4F9A52]/5 p-3.5 text-left transition-all hover:bg-[#4F9A52]/15 hover:shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4F9A52] text-white group-hover:scale-105 transition-transform">
                        <ShoppingCart size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-base">Kalkulator Harga E-Commerce</h4>
                        <p className="text-xs text-gray-500">Pasang harga aman dari potongan fee admin marketplace</p>
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
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Total Biaya Produksi (Rp)</label>
                  <input type="number" value={utubBiaya} onChange={(e) => setUtubBiaya(e.target.value)} placeholder="Misal: 5000000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Total Panen (Kg)</label>
                  <input type="number" value={utubPanen} onChange={(e) => setUtubPanen(e.target.value)} placeholder="Misal: 1000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Target Margin (%)</label>
                  <input type="number" value={utubMargin} onChange={(e) => setUtubMargin(e.target.value)} placeholder="Misal: 20" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white" />
                </div>

                <div className="mt-2 rounded-2xl bg-[#76B852] p-5 text-white shadow-lg">
                  <div className="mb-3 border-b border-white/20 pb-2">
                    <p className="text-xs text-white/80">Harga Modal (HPP) per Kg</p>
                    <p className="text-2xl font-bold">{formatRp(hppPerKg)}</p>
                  </div>
                  <div className="mb-3 border-b border-white/20 pb-2">
                    <p className="text-xs text-white/80">Saran Harga Jual per Kg</p>
                    <p className="text-2xl font-bold">{formatRp(hargaJual)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Potensi Keuntungan Bersih</p>
                    <p className="text-2xl font-bold text-[#FDF8F2]">{formatRp(potensiUntung)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* --- Tool: UTUB Target Volume --- */}
            {activeTool === 'targetVol' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500">Hitung berapa kg komoditas/produk yang harus terjual untuk mencapai target pendapatan bersih kelompok.</p>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Target Laba Bersih Bulanan (Rp)</label>
                  <input type="number" value={targetLabaBulanan} onChange={(e) => setTargetLabaBulanan(e.target.value)} placeholder="Misal: 5000000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Margin / Laba per Kg (Rp)</label>
                  <input type="number" value={marginPerKg} onChange={(e) => setMarginPerKg(e.target.value)} placeholder="Misal: 2500" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white" />
                </div>

                <div className="mt-2 rounded-2xl bg-[#76B852] p-5 text-center text-white shadow-lg">
                  <p className="text-xs text-white/80">Target Volume Penjualan Minimal</p>
                  <p className="text-4xl font-bold mt-1">
                    {targetVolumeKg ? targetVolumeKg.toLocaleString('id-ID') : 0} <span className="text-xl font-normal">Kg</span>
                  </p>
                  <p className="mt-3 text-xs bg-white/20 rounded-xl py-2 px-3">
                    Setara dengan rata-rata penjualan <strong>{targetVolumeKg ? Math.ceil(targetVolumeKg / 30) : 0} Kg / hari</strong>
                  </p>
                </div>
              </div>
            )}

            {/* --- Tool: UTUB Floor Price B2B --- */}
            {activeTool === 'floorPrice' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500">Cek apakah tawaran borongan dari pengepul / distributor masih di atas harga modal dasar.</p>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">HPP Pokok per Kg (Rp)</label>
                  <input type="number" value={fpHpp} onChange={(e) => setFpHpp(e.target.value)} placeholder="Misal: 11000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Volume Borongan (Kg)</label>
                  <input type="number" value={fpVolume} onChange={(e) => setFpVolume(e.target.value)} placeholder="Misal: 1000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Total Harga Tawar Pembeli (Rp)</label>
                  <input type="number" value={fpHargaTawar} onChange={(e) => setFpHargaTawar(e.target.value)} placeholder="Misal: 12500000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#76B852] focus:bg-white" />
                </div>

                {floorPriceRes && (
                  <div className={`mt-2 rounded-2xl p-5 text-white shadow-lg ${floorPriceRes.isDiterima ? 'bg-[#76B852]' : 'bg-[#E53E3E]'}`}>
                    <div className="flex items-center justify-between border-b border-white/20 pb-2">
                      <span className="text-xs text-white/80">Batas Bawah (Modal Pokok)</span>
                      <span className="font-bold">{formatRp(floorPriceRes.batasBawah)}</span>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-xs text-white/80 uppercase tracking-wider">Hasil Rekomendasi</p>
                      <p className="text-2xl font-bold mt-0.5">{floorPriceRes.statusTransaksi}</p>
                      <p className="text-xs mt-2 bg-black/10 py-1.5 px-3 rounded-xl">
                        {floorPriceRes.isDiterima 
                          ? `Margin untung: ${formatRp(parseFloat(fpHargaTawar) - floorPriceRes.batasBawah)}`
                          : `Potensi rugi: ${formatRp(floorPriceRes.batasBawah - parseFloat(fpHargaTawar))}`}
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
                  <label className="mb-1 block text-sm font-semibold text-[#4F9A52]">Pemasukan Hari Ini (Rp)</label>
                  <input type="number" value={tataPemasukan} onChange={(e) => setTataPemasukan(e.target.value)} placeholder="Uang masuk..." className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base text-[#4F9A52] outline-none focus:border-[#63B3ED] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#F46392]">Pengeluaran Hari Ini (Rp)</label>
                  <input type="number" value={tataPengeluaran} onChange={(e) => setTataPengeluaran(e.target.value)} placeholder="Uang keluar..." className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base text-[#F46392] outline-none focus:border-[#63B3ED] focus:bg-white" />
                </div>

                <div className="mt-2 rounded-2xl bg-[#63B3ED] p-5 text-center text-white shadow-lg">
                  <p className="text-xs text-white/80">Sisa Saldo Kas Bersih</p>
                  <p className="text-4xl font-bold mt-1">{formatRp(saldoTata)}</p>
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white/20 py-2 text-xs">
                    <Coins size={16} /> Jangan lupa dicatat di Buku TATA ya!
                  </div>
                </div>
              </div>
            )}

            {/* --- Tool: TATA Konversi Stok Gabah --- */}
            {activeTool === 'konversiStok' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500">Estimasi output beras dari gabah kering giling (GKG) beserta taksiran omzet penjualan.</p>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Stok Gabah (Kg)</label>
                  <input type="number" value={stokGabah} onChange={(e) => setStokGabah(e.target.value)} placeholder="Misal: 2000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#63B3ED] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Target Harga Jual Beras per Kg (Rp)</label>
                  <input type="number" value={hargaJualBeras} onChange={(e) => setHargaJualBeras(e.target.value)} placeholder="Misal: 14000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#63B3ED] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Rasio Rendemen (%)</label>
                  <input type="number" value={rendemenPersen} onChange={(e) => setRendemenPersen(e.target.value)} placeholder="Default: 62.5" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#63B3ED] focus:bg-white" />
                </div>

                {konversiStokRes && (
                  <div className="mt-2 rounded-2xl bg-[#63B3ED] p-5 text-white shadow-lg">
                    <div className="mb-3 border-b border-white/20 pb-2">
                      <p className="text-xs text-white/80">Estimasi Hasil Beras Siap Jual</p>
                      <p className="text-3xl font-bold mt-0.5">{konversiStokRes.estimasiBerasKg.toLocaleString('id-ID')} <span className="text-lg font-normal">Kg</span></p>
                    </div>
                    <div>
                      <p className="text-xs text-white/80">Potensi Total Omzet</p>
                      <p className="text-3xl font-bold text-[#FDF8F2] mt-0.5">{formatRp(konversiStokRes.potensiOmzetRp)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- Tool: SEKAR Rasio BRISMA --- */}
            {activeTool === 'brisma' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500">Hitung komposisi ideal perekat tapioka & air untuk pencetakan briket sekam padi (BRISMA).</p>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Berat Arang Sekam Padi (Kg)</label>
                  <input type="number" value={brismaSekam} onChange={(e) => setBrismaSekam(e.target.value)} placeholder="Misal: 15" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#F46392] focus:bg-white" />
                </div>

                {brismaRes ? (
                  <div className="mt-2 rounded-2xl bg-[#F46392] p-5 text-white shadow-lg space-y-3">
                    <div className="border-b border-white/20 pb-2">
                      <p className="text-xs text-white/80">Kebutuhan Tepung Tapioka (Perekat)</p>
                      <p className="text-3xl font-bold mt-0.5">{brismaRes.beratTapiokaKg} <span className="text-lg font-normal">Kg</span></p>
                      <p className="text-xs text-white/70 mt-0.5">Rasio: 1/3 dari berat sekam</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/80">Kebutuhan Air Panas Perekat</p>
                      <p className="text-3xl font-bold mt-0.5">{brismaRes.volumeAirLiter} <span className="text-lg font-normal">Liter</span></p>
                      <p className="text-xs text-white/70 mt-0.5">Larutkan tapioka hingga mengental merata</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
                    Ketik berat arang sekam dalam Kg untuk melihat kalkulasi rasio pencampuran bahan baku briket.
                  </div>
                )}
              </div>
            )}

            {/* --- Tool: DIGIMARK Caption Generator --- */}
            {activeTool === 'caption' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Nama Produk</label>
                  <input type="text" value={captionNama} onChange={(e) => setCaptionNama(e.target.value)} placeholder="Misal: Beras Purbaya Wangi" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-[#4F9A52] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Keunggulan Utama / USP</label>
                  <input type="text" value={captionKeunggulan} onChange={(e) => setCaptionKeunggulan(e.target.value)} placeholder="Misal: Pulen alami, tanpa pemutih" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-[#4F9A52] focus:bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-600">Harga (Rp)</label>
                    <input type="number" value={captionHarga} onChange={(e) => setCaptionHarga(e.target.value)} placeholder="15000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-[#4F9A52] focus:bg-white" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-600">No. WhatsApp</label>
                    <input type="text" value={captionKontak} onChange={(e) => setCaptionKontak(e.target.value)} placeholder="08123..." className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-[#4F9A52] focus:bg-white" />
                  </div>
                </div>

                <div className="mt-2 rounded-2xl bg-[#4F9A52]/10 border border-[#4F9A52]/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4F9A52]">Hasil Caption Otomatis</span>
                    <button 
                      onClick={() => copyToClipboard(generatedCaption)}
                      className="flex items-center gap-1.5 rounded-full bg-[#4F9A52] text-white px-3 py-1 text-xs font-semibold hover:bg-[#3e7d41] transition-colors"
                    >
                      {copiedCaption ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCaption ? 'Tersalin!' : 'Salin Teks'}
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed font-sans">
                    {generatedCaption || 'Lengkapi formulir di atas untuk generate caption.'}
                  </div>
                </div>
              </div>
            )}

            {/* --- Tool: DIGIMARK E-Commerce Pricing --- */}
            {activeTool === 'ecommerce' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500">Kalkulasi harga jual listing di marketplace (Shopee/Tokopedia) agar margin laba bersih tidak tergerus komisi platform.</p>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">HPP Pokok Produk (Rp)</label>
                  <input type="number" value={ecomHpp} onChange={(e) => setEcomHpp(e.target.value)} placeholder="Misal: 12000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#4F9A52] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Target Laba Bersih yang Diinginkan (Rp)</label>
                  <input type="number" value={ecomLaba} onChange={(e) => setEcomLaba(e.target.value)} placeholder="Misal: 3000" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#4F9A52] focus:bg-white" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-600">Total Potongan Admin & Fee Platform (%)</label>
                  <input type="number" value={ecomFee} onChange={(e) => setEcomFee(e.target.value)} placeholder="Misal: 7" className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-3.5 text-base outline-none focus:border-[#4F9A52] focus:bg-white" />
                </div>

                <div className="mt-2 rounded-2xl bg-[#4F9A52] p-5 text-white shadow-lg">
                  <p className="text-xs text-white/80">Saran Harga Jual Listing di Toko Online</p>
                  <p className="text-4xl font-bold mt-1">{formatRp(ecomHargaJual)}</p>
                  <div className="mt-3 text-xs bg-white/20 rounded-xl p-2.5 space-y-1">
                    <p>• Modal + Laba Bersih: {formatRp((parseFloat(ecomHpp) || 0) + (parseFloat(ecomLaba) || 0))}</p>
                    <p>• Estimasi potongan fee marketplace ({ecomFee}%): {formatRp(Math.floor(ecomHargaJual * ((parseFloat(ecomFee) || 0) / 100)))}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- HEADER: Logo Ngariung Purwabakti --- */}
      <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-6 md:px-12">
        <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
          <img 
            src="/Logo Ngariung Purwabakti.png" 
            alt="Logo Ngariung Purwabakti" 
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold leading-tight text-[#4F9A52]">Ngariung</span>
            <span className="text-xs font-semibold leading-tight text-[#F46392]">Purwabakti</span>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative flex min-h-[95vh] flex-col items-center justify-center px-6 pt-28 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FDF8F2] via-[#FDF8F2] to-white" />
        
        {/* Emblem Hero: Logo Ngariung Purwabakti */}
        <div className="float-anim mb-8 flex h-52 w-52 items-center justify-center rounded-full bg-white p-4 shadow-[0_20px_60px_rgba(244,99,146,0.18)] border-4 border-white overflow-hidden transition-transform hover:scale-105">
          <img 
            src="/Logo Ngariung Purwabakti.png" 
            alt="Ngariung Purwabakti" 
            className="h-full w-full object-contain"
          />
        </div>

        <p className="mb-3 rounded-full bg-[#63B3ED]/10 px-5 py-2 text-xs font-bold tracking-widest text-[#63B3ED] uppercase">
          Social Project dengan Kelompok Tani Purbaya Mandiri Desa Purwabakti
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
            <h2 className="text-5xl font-semibold text-[#4F9A52]">Modul Belajar & Alat Bantu</h2>
            <p className="mt-4 text-xl text-gray-500 font-medium">4 Pilar peningkatan kemampuan tata kelola pertanian dilengkapi kalkulator terintegrasi.</p>
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
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button 
                  onClick={() => handleDownload('TATA')}
                  className="bouncy-hover flex items-center gap-2.5 rounded-full bg-[#63B3ED] px-7 py-3.5 text-lg font-semibold text-white shadow-lg shadow-[#63B3ED]/30 cursor-pointer"
                >
                  <Download size={20} />
                  Unduh Buku Kas
                </button>
                <button 
                  onClick={() => selectTool('konversiStok')}
                  className="bouncy-hover flex items-center gap-2 rounded-full border-2 border-[#63B3ED] bg-white px-6 py-3.5 text-base font-semibold text-[#63B3ED] hover:bg-[#63B3ED]/10 transition-colors cursor-pointer"
                >
                  <Scale size={18} />
                  Kalkulator Stok Gabah
                </button>
                <button 
                  onClick={() => selectTool('tata')}
                  className="bouncy-hover flex items-center gap-2 rounded-full border-2 border-[#63B3ED] bg-white px-6 py-3.5 text-base font-semibold text-[#63B3ED] hover:bg-[#63B3ED]/10 transition-colors cursor-pointer"
                >
                  <Wallet size={18} />
                  Simulasi Kas
                </button>
              </div>
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
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button 
                  onClick={() => handleDownload('UTUB')}
                  className="bouncy-hover flex items-center gap-2.5 rounded-full bg-[#76B852] px-7 py-3.5 text-lg font-semibold text-white shadow-lg shadow-[#76B852]/30 cursor-pointer"
                >
                  <Download size={20} />
                  Unduh Workbook HPP
                </button>
                <button 
                  onClick={() => selectTool('utub')}
                  className="bouncy-hover flex items-center gap-2 rounded-full border-2 border-[#76B852] bg-white px-6 py-3.5 text-base font-semibold text-[#76B852] hover:bg-[#76B852]/10 transition-colors cursor-pointer"
                >
                  <Percent size={18} />
                  Kalkulator HPP
                </button>
                <button 
                  onClick={() => selectTool('targetVol')}
                  className="bouncy-hover flex items-center gap-2 rounded-full border-2 border-[#76B852] bg-white px-6 py-3.5 text-base font-semibold text-[#76B852] hover:bg-[#76B852]/10 transition-colors cursor-pointer"
                >
                  <Target size={18} />
                  Target Volume
                </button>
                <button 
                  onClick={() => selectTool('floorPrice')}
                  className="bouncy-hover flex items-center gap-2 rounded-full border-2 border-[#76B852] bg-white px-6 py-3.5 text-base font-semibold text-[#76B852] hover:bg-[#76B852]/10 transition-colors cursor-pointer"
                >
                  <ShieldCheck size={18} />
                  Validasi B2B
                </button>
              </div>
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
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button 
                  onClick={() => handleDownload('SEKAR')}
                  className="bouncy-hover flex items-center gap-2.5 rounded-full bg-[#F46392] px-7 py-3.5 text-lg font-semibold text-white shadow-lg shadow-[#F46392]/30 cursor-pointer"
                >
                  <Download size={20} />
                  Unduh SOP Briket
                </button>
                <button 
                  onClick={() => selectTool('brisma')}
                  className="bouncy-hover flex items-center gap-2 rounded-full border-2 border-[#F46392] bg-white px-6 py-3.5 text-base font-semibold text-[#F46392] hover:bg-[#F46392]/10 transition-colors cursor-pointer"
                >
                  <Flame size={18} />
                  Kalkulator Rasio BRISMA
                </button>
              </div>
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
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button 
                  onClick={() => handleDownload('DIGIMARK')}
                  className="bouncy-hover flex items-center gap-2.5 rounded-full bg-[#4F9A52] px-7 py-3.5 text-lg font-semibold text-white shadow-lg shadow-[#4F9A52]/30 cursor-pointer"
                >
                  <Download size={20} />
                  Unduh Modul Katalog
                </button>
                <button 
                  onClick={() => selectTool('caption')}
                  className="bouncy-hover flex items-center gap-2 rounded-full border-2 border-[#4F9A52] bg-white px-6 py-3.5 text-base font-semibold text-[#4F9A52] hover:bg-[#4F9A52]/10 transition-colors cursor-pointer"
                >
                  <Sparkles size={18} />
                  Generator Caption
                </button>
                <button 
                  onClick={() => selectTool('ecommerce')}
                  className="bouncy-hover flex items-center gap-2 rounded-full border-2 border-[#4F9A52] bg-white px-6 py-3.5 text-base font-semibold text-[#4F9A52] hover:bg-[#4F9A52]/10 transition-colors cursor-pointer"
                >
                  <ShoppingCart size={18} />
                  Harga E-Commerce
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER / FYI --- */}
      <footer className="bg-[#FDF8F2] px-6 py-16 text-center text-gray-500">
        <div className="flex justify-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F46392]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#63B3ED]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#76B852]"></span>
        </div>
        <p className="font-semibold text-gray-700 text-lg">Social Project dengan Kelompok Tani Purbaya Mandiri Desa Purwabakti</p>
        <p className="mt-1 text-sm text-gray-500">Berbasis Pendekatan Human-Centered Design</p>

        {/* Kolaborasi Gemilang */}
        <div className="mt-10 mx-auto max-w-lg rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <img 
              src="/gemilang_logo.png" 
              alt="Logo Gemilang" 
              className="h-12 w-auto object-contain transition-transform hover:scale-105"
            />
            <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-wider font-bold text-[#F46392]">Kolaborasi Web App</p>
              <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                Project ini dikolaborasikan dengan <strong className="text-gray-800">Gemilang</strong> untuk pembuatan web appnya untuk sustainability outcome project.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}