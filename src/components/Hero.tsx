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
  CreditCard
} from 'lucide-react';
import { Language } from '../types';

interface HeroProps {
  language: Language;
  onExploreCourses: () => void;
  onOpenFastEnroll: () => void;
  onRequestCard?: () => void;
  sitePhone: string;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onExploreCourses,
  onOpenFastEnroll,
  onRequestCard,
  sitePhone,
}) => {
  const isAr = language === 'ar';
  const [showDetails, setShowDetails] = React.useState(false);
  const algerianIntPhone = sitePhone.replace(/^0/, '213');
  const whatsappUrl = `https://wa.me/${algerianIntPhone}?text=${encodeURIComponent(
    isAr 
      ? 'السلام عليكم، أريد إكمال الطلب والتسجيل في دورات الهندسة المدنية.' 
      : 'Bonjour, je souhaite finaliser ma commande de formation.'
  )}`;

  return (
    <div className="relative overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-slate-800/80">
      {/* Background ambient engineering grid & glowing radial gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title - Short & Punchy */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-4">
            {isAr ? (
              <>
                احترف برامج <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">الهندسة المدنية</span>
              </>
            ) : (
              <>
                Expertise en <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Génie Civil</span>
              </>
            )}
          </h1>

          {/* Subtitle - Single Clean Line */}
          <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'تكوين تطبيقي احترافي بمشاريع واقعية معتمدة وفق معايير CTC الجزائري.'
              : 'Formations pratiques sur projets réels conformes aux normes CTC.'}
          </p>

          {/* Pricing Summary Cards - Minimal & Clean */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto mb-6">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] sm:text-xs text-blue-400 font-bold block">
                {isAr ? 'خرسانة مسلحة' : 'Béton Armé'}
              </span>
              <div className="text-lg sm:text-xl font-black text-white mt-0.5">
                <span dir="ltr" className="font-mono">3 000</span> <span className="text-[10px] text-slate-400">دج</span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-amber-500/40 text-center ring-1 ring-amber-500/20">
              <span className="text-[10px] sm:text-xs text-amber-400 font-bold block">
                {isAr ? 'شاربونت ميتاليك' : 'Charpente'}
              </span>
              <div className="text-lg sm:text-xl font-black text-amber-300 mt-0.5">
                <span dir="ltr" className="font-mono">5 000</span> <span className="text-[10px] text-slate-400">دج</span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] sm:text-xs text-emerald-400 font-bold block">
                {isAr ? 'طرقات وVRD' : 'Routes'}
              </span>
              <div className="text-lg sm:text-xl font-black text-white mt-0.5">
                <span dir="ltr" className="font-mono">3 000</span> <span className="text-[10px] text-slate-400">دج</span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Direct Registration + Card Request + WhatsApp */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mb-4">
            <button
              onClick={onOpenFastEnroll}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-slate-950 inline-block mr-1.5" />
              <span>{isAr ? 'طلب الدورة والتسجيل' : 'Commander'}</span>
            </button>

            {onRequestCard && (
              <button
                onClick={onRequestCard}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-amber-300 font-bold text-xs sm:text-sm hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'طلب بطاقتي مجاناً 💳' : 'Demander ma carte'}</span>
              </button>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
            </a>
          </div>

          {/* Expandable 'More Details' Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-bold text-slate-400 hover:text-amber-400 inline-flex items-center gap-1 transition-colors py-1 px-3 rounded-lg hover:bg-slate-900 cursor-pointer"
            >
              <span>{showDetails ? (isAr ? 'إخفاء التفاصيل ▴' : 'Masquer les détails ▴') : (isAr ? 'مزيد من التفاصيل والضمانات ▾' : 'Plus de détails & garanties ▾')}</span>
            </button>
          </div>

          {/* Hidden Details (Revealed Only When Client Clicks 'مزيد من التفاصيل') */}
          {showDetails && (
            <div className="mt-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-4 animate-in fade-in duration-200">
              <div className="text-center sm:text-right text-xs text-slate-300 leading-relaxed space-y-2">
                <p>
                  {isAr 
                    ? '💡 اختيارك للدورات هو تسجيل أولي واستفسار فقط، ولا يُلزمك بأي دفع فوري أو شراء.' 
                    : 'La sélection des cours est une simple demande d’information sans engagement.'}
                </p>
                <p className="text-amber-300/90">
                  {isAr
                    ? 'برامج الدورات: Robot Structural, ETABS, Tekla Structures, AutoCAD GC, Covadis VRD, Piste 5.'
                    : 'Logiciels inclus : Robot, ETABS, Tekla, AutoCAD, Covadis, Piste.'}
                </p>
              </div>

              {/* Guarantees Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'مشاريع CTC' : 'Conforme CTC'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'ملفات DWG و3D' : 'Fichiers inclus'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'تأكيد بالاتصال' : 'Suivi direct'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'شهادة معتمدة' : 'Attestation'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
