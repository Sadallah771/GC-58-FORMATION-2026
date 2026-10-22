import React from 'react';
import { 
  Building, 
  Layers, 
  Award, 
  Users, 
  PhoneCall, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Bot
} from 'lucide-react';
import { Language } from '../types';

interface HeroProps {
  language: Language;
  onExploreCourses: () => void;
  onOpenFastEnroll: () => void;
  onOpenAIAssistant?: () => void;
  sitePhone: string;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onExploreCourses,
  onOpenFastEnroll,
  onOpenAIAssistant,
  sitePhone,
}) => {
  const isAr = language === 'ar';
  const algerianIntPhone = sitePhone.replace(/^0/, '213');
  const whatsappUrl = `https://wa.me/${algerianIntPhone}?text=${encodeURIComponent(
    isAr 
      ? 'السلام عليكم، أريد إكمال الطلب والتسجيل في دورات الهندسة المدنية.' 
      : 'Bonjour, je souhaite finaliser ma commande de formation.'
  )}`;

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80">
      {/* Background ambient engineering grid & glowing radial gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-6 shadow-inner shadow-amber-500/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              {isAr ? (
                <>
                  منصة <span className="font-black text-white">GC58 FORMATIONS</span> الأولى بالجزائر | هاتف:{' '}
                  <span dir="ltr" className="font-mono font-bold inline-block">{sitePhone}</span>
                </>
              ) : (
                <>
                  <span className="font-black text-white">GC58 FORMATIONS</span> BTP Algérie | Tél :{' '}
                  <span dir="ltr" className="font-mono font-bold inline-block">{sitePhone}</span>
                </>
              )}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
            {isAr ? (
              <>
                احترف برامج <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">الهندسة المدنية</span> مع GC58 FORMATIONS
              </>
            ) : (
              <>
                Devenez un Ingénieur Expert avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">GC58 FORMATIONS</span>
              </>
            )}
          </h1>

          {/* Subtitle with promo emphasis */}
          <p className="text-base sm:text-lg text-slate-300 mb-6 max-w-3xl mx-auto leading-relaxed">
            {isAr ? (
              <>
                🔥 <span className="text-amber-400 font-extrabold">عرض ترويجي محدود (50 ساعة فقط)</span>: دورات الخرسانة المسلحة بـ (<span dir="ltr" className="font-bold inline-block text-white">3 000</span> دج بدل <span dir="ltr" className="inline-block">5 000</span> دج)، الشاربونت ميتاليك بـ (<span dir="ltr" className="font-bold inline-block text-white">5 000</span> دج بدل <span dir="ltr" className="inline-block">10 000</span> دج)، وحساب الطرقات بـ (<span dir="ltr" className="font-bold inline-block text-white">3 000</span> دج).
              </>
            ) : (
              <>
                🔥 <span className="text-amber-400 font-extrabold">Offre Spéciale (50h seulement)</span> : Formations Béton Armé à <span dir="ltr" className="font-bold inline-block">3 000</span> DA, Charpente Métallique à <span dir="ltr" className="font-bold inline-block">5 000</span> DA, Routes & VRD à <span dir="ltr" className="font-bold inline-block">3 000</span> DA !
              </>
            )}
          </p>

          {/* Reassurance pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-8 max-w-2xl mx-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? 'طمأنة: اختيارك للدورات هو تسجيل أولي مبدئي واستفسار فقط، ولا يُلزمك بأي دفع فوري أو شراء!'
                : 'Rassurez-vous : Sélectionner vos cours est une simple pré-inscription d’information sans aucun engagement.'}
            </span>
          </div>

          {/* Pricing Highlight Badges with strict LTR number containers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-blue-500/30 shadow-lg text-center backdrop-blur-sm relative overflow-hidden">
              <span className="absolute top-1.5 right-2 text-[9px] font-extrabold bg-blue-500 text-white px-1.5 py-0.2 rounded font-mono" dir="ltr">
                -40%
              </span>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                {isAr ? 'دورات الخرسانة المسلحة' : 'Béton Armé'}
              </span>
              <div className="text-2xl font-black text-white mt-0.5">
                <span dir="ltr" className="font-mono inline-block">3 000</span> <span className="text-xs font-bold text-slate-400">دج</span>
              </div>
              <span className="text-[10px] text-slate-500 line-through">
                <span dir="ltr" className="inline-block font-mono">5 000</span> دج
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Robot R+2, ETABS R+4, Tunnel, LECCY</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/40 shadow-lg text-center backdrop-blur-sm ring-1 ring-amber-500/20 relative overflow-hidden">
              <span className="absolute top-1.5 right-2 text-[9px] font-extrabold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-mono font-black" dir="ltr">
                -50%
              </span>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                {isAr ? 'دورات الشاربونت ميتاليك' : 'Charpente Métallique'}
              </span>
              <div className="text-2xl font-black text-amber-300 mt-0.5">
                <span dir="ltr" className="font-mono inline-block">5 000</span> <span className="text-xs font-bold text-slate-400">دج</span>
              </div>
              <span className="text-[10px] text-slate-500 line-through">
                <span dir="ltr" className="inline-block font-mono">10 000</span> دج
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Robot, ETABS, Tekla, IDEA StatiCa</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-lg text-center backdrop-blur-sm relative overflow-hidden">
              <span className="absolute top-1.5 right-2 text-[9px] font-extrabold bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-mono font-bold" dir="ltr">
                -50%
              </span>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                {isAr ? 'حساب الطرقات وVRD' : 'Routes & VRD / CAD'}
              </span>
              <div className="text-2xl font-black text-white mt-0.5">
                <span dir="ltr" className="font-mono inline-block">3 000</span> <span className="text-xs font-bold text-slate-400">دج</span>
              </div>
              <span className="text-[10px] text-slate-500 line-through">
                <span dir="ltr" className="inline-block font-mono">5 000 - 6 000</span> دج
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">AutoCAD GC, Piste 5, Covadis VRD</span>
            </div>
          </div>

          {/* Action CTAs: Direct Registration + AI Consultant + WhatsApp */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenFastEnroll}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'طلب الدورة والتسجيل المباشر' : 'Commander une formation'}</span>
            </button>

            {onOpenAIAssistant && (
              <button
                onClick={onOpenAIAssistant}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/40 shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>{isAr ? '✨ استشر GC58 AI' : '✨ GC58 AI'}</span>
              </button>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-[#25D366]/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>
                {isAr ? 'واتساب الإدارة: ' : 'WhatsApp : '}
                <span dir="ltr" className="font-mono inline-block font-black">{sitePhone}</span>
              </span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 pt-8 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{isAr ? 'مشاريع حقيقية CTC' : 'Conforme CTC'}</p>
                <p className="text-[11px] text-slate-400">{isAr ? 'معايير RPA 2024 و Eurocodes' : 'RPA 2024 & CCM 97'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{isAr ? 'ملفات جاهزة مجاناً' : 'Fichiers DWG & 3D'}</p>
                <p className="text-[11px] text-slate-400">{isAr ? 'نماذج Excel وروبوت' : 'Modèles RTD, EDB, Excel'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{isAr ? 'تأكيد بالاتصال' : 'Suivi Téléphonique'}</p>
                <p className="text-[11px] text-slate-400">
                  <span dir="ltr" className="font-mono inline-block">{sitePhone}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{isAr ? 'شهادة معتمدة' : 'Attestation Certifiée'}</p>
                <p className="text-[11px] text-slate-400">{isAr ? 'إثراء السيرة الذاتية' : 'Valorisation de CV BTP'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
