import React from 'react';
import { 
  BookOpen, 
  Gift, 
  Crown, 
  FileSpreadsheet, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  FileText,
  ShieldAlert,
  Percent,
  Download
} from 'lucide-react';
import { Language, AppView, ClientLoyaltyData } from '../types';
import { getTierDiscountPercent, getTierNameAr } from '../utils/loyaltyHelper';

interface HomePortalGatewaysProps {
  language: Language;
  onNavigate: (view: AppView) => void;
  userLoyalty?: ClientLoyaltyData | null;
  onOpenGiftModal: () => void;
  onOpenFastEnroll: () => void;
}

export const HomePortalGateways: React.FC<HomePortalGatewaysProps> = ({
  language,
  onNavigate,
  userLoyalty,
  onOpenGiftModal,
  onOpenFastEnroll,
}) => {
  const isAr = language === 'ar';
  const activeTier = userLoyalty?.tier || 'STANDARD';
  const discountPercent = getTierDiscountPercent(activeTier);
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);

  const toggleDetails = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Header title - Minimal */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
          {isAr ? 'أقسام المنصة الرئيسية' : 'Sections Principales'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isAr ? 'اختر القسم الذي تريده مباشرة' : 'Navigation simple et organisée'}
        </p>
      </div>

      {/* 4 Gateway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* CARD 1: COURSES BRANCH */}
        <div 
          onClick={() => onNavigate('courses')}
          className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-amber-400 font-mono">14+ {isAr ? 'دورة' : 'cours'}</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors mb-1.5">
              {isAr ? 'الدورات التدريبية المعتمدة 🎓' : 'Formations Spécialisées 🎓'}
            </h3>

            <p className="text-xs text-slate-400 mb-3">
              {isAr 
                ? 'دورات الخرسانة المسلحة، المنشآت المعدنية، وحساب الطرقات.' 
                : 'Béton Armé, Charpente Métallique, et Routes & VRD.'}
            </p>

            {/* Expandable Details */}
            {expandedCard === 'courses' && (
              <div className="p-3 mb-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-in fade-in duration-200">
                <p>• برامج: Robot, ETABS, Tekla, AutoCAD GC, Covadis.</p>
                <p>• مشاريع واقعية مدروسة وفق معايير CTC الجزائري (RPA 2024 / CCM 97).</p>
                <p>• تخفيض بطاقتك الحالي: {discountPercent}% محسوب تلقائياً في السلة.</p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={(e) => toggleDetails('courses', e)}
              className="text-[11px] font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <span>{expandedCard === 'courses' ? (isAr ? 'إخفاء التفاصيل ▴' : 'Masquer ▴') : (isAr ? 'مزيد من التفاصيل ▾' : 'Plus de détails ▾')}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('courses');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>{isAr ? 'دخول قسم الدورات' : 'Consulter les formations'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* CARD 2: GIFT COURSE BRANCH */}
        <div 
          onClick={() => onNavigate('gift')}
          className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-400 font-mono">{isAr ? 'مجانية 100%' : '100% Gratuit'}</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors mb-1.5">
              {isAr ? 'الدورة الهدية المجانية 🎁' : 'Formation Offerte 🎁'}
            </h3>

            <p className="text-xs text-slate-400 mb-3">
              {isAr 
                ? 'فضاء مستقل لمشاهدة دورة الإهداء المجانية بالكامل بمشغل فيديو مخصص.' 
                : 'Accédez à votre formation offerte avec lecteur vidéo HD dédié.'}
            </p>

            {/* Expandable Details */}
            {expandedCard === 'gift' && (
              <div className="p-3 mb-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-in fade-in duration-200">
                <p>• حلقات مسجلة بجودة عالية ومرفوعة على Google Drive.</p>
                <p>• فك التشفير بكود سري يمنحه لك الأدمين مجاناً عند الطلب.</p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={(e) => toggleDetails('gift', e)}
              className="text-[11px] font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <span>{expandedCard === 'gift' ? (isAr ? 'إخفاء التفاصيل ▴' : 'Masquer ▴') : (isAr ? 'مزيد من التفاصيل ▾' : 'Plus de détails ▾')}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('gift');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>{isAr ? 'مشاهدة الدورة الهدية' : 'Accéder au Cadeau'}</span>
              <Gift className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>

        {/* CARD 3: STUDENT & VIP CARD BRANCH */}
        <div 
          onClick={() => onNavigate('student')}
          className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-amber-300 font-mono">
                {userLoyalty?.hasActiveCard ? `${activeTier}` : (isAr ? 'طلب مجاني' : 'Gratuit')}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors mb-1.5">
              {isAr ? 'بطاقة الطالب والعضوية 💳' : 'Carte Adhérent & Étudiant 💳'}
            </h3>

            <p className="text-xs text-slate-400 mb-3">
              {isAr 
                ? 'اطلب بطاقتك مجاناً (طالب 20% أو Standard 10%) دون الحاجة لشراء دورة.' 
                : 'Demandez votre carte gratuitement (Étudiant 20% ou Standard 10%) sans achat.'}
            </p>

            {/* Expandable Details */}
            {expandedCard === 'card' && (
              <div className="p-3 mb-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-in fade-in duration-200">
                <p>• بطاقة طالب جامعي: تمنح مميزات فئة البرو (20% تخفيض) بعد رفع صورة البطاقة الجامعية.</p>
                <p>• بطاقة ستاندار: تمنح 10% تخفيض فوري بعد اعتمادها من الأدمين.</p>
                <p>• ترقيات آلية في الرتب حسب نقاط زيارات الموقع (1000 نقطة PRO، 5000 Silver، 10000 Gold).</p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={(e) => toggleDetails('card', e)}
              className="text-[11px] font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <span>{expandedCard === 'card' ? (isAr ? 'إخفاء التفاصيل ▴' : 'Masquer ▴') : (isAr ? 'مزيد من التفاصيل ▾' : 'Plus de détails ▾')}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('student');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>
                {userLoyalty?.hasActiveCard 
                  ? (isAr ? 'عرض بطاقتي المعتمدة 🎓' : 'Voir ma carte') 
                  : userLoyalty?.cardStatus === 'pending'
                  ? (isAr ? 'طلب بطاقتي (قيد المراجعة ⏳)' : 'En attente ⏳')
                  : (isAr ? 'طلب بطاقتي مجاناً 💳' : 'Demander ma carte 💳')}
              </span>
              <Crown className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>

        {/* CARD 4: EXCEL SHEETS, BOOKS & ASSISTANCE */}
        <div 
          onClick={() => onNavigate('student')}
          className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-400 font-mono">14 {isAr ? 'دورة للذهبي' : 'cours'}</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-400 transition-colors mb-1.5">
              {isAr ? 'الشيتات والملفات والمساعدة 📁' : 'Feuilles Excel & Fichiers 📁'}
            </h3>

            <p className="text-xs text-slate-400 mb-3">
              {isAr 
                ? 'تحميل شيتات الإكسل، ملفات المشاريع، ومساعدة تسطيب وتفعيل البرامج.' 
                : 'Feuilles de calcul Excel, modèles de projets et support installation.'}
            </p>

            {/* Expandable Details */}
            {expandedCard === 'files' && (
              <div className="p-3 mb-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-in fade-in duration-200">
                <p>• شيتات إكسل حسابية لحساب الأعمدة، الأساسات، والكميات.</p>
                <p>• مذكرات تخرج، نماذج 3D، وكتب الكودات الجزائرية.</p>
                <p>• شرط المستوى الذهبي (14 دورة) لفتح الدعم الفني الكامل وتسطيب البرامج.</p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={(e) => toggleDetails('files', e)}
              className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
            >
              <span>{expandedCard === 'files' ? (isAr ? 'إخفاء التفاصيل ▴' : 'Masquer ▴') : (isAr ? 'مزيد من التفاصيل ▾' : 'Plus de détails ▾')}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('student');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>{isAr ? 'فتح الشيتات والمساعدة' : 'Consulter les fichiers'}</span>
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
