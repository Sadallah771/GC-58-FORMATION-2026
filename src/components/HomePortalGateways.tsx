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

  return (
    <section className="py-10 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Header title */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
          <Layers className="w-4 h-4" />
          <span>{isAr ? 'أقسام وفروع المنصة المنظمة' : 'Sections & Branches Dédiées'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {isAr ? 'اختر الفرع الذي تريده مباشرة' : 'Accédez Directement à Votre Section'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          {isAr 
            ? 'كل قسم منظم ومستقل بذاته: الدورات التدريبية وحدها، الدورة الهدية وحدها، وبطاقتك والمكافآت في فضاء خاص.' 
            : 'Chaque section est indépendante et structurée pour une expérience fluide sur PC et Mobile.'}
        </p>
      </div>

      {/* 4 Gateway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* CARD 1: COURSES BRANCH */}
        <div 
          onClick={() => onNavigate('courses')}
          className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 sm:p-7 transition-all duration-200 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{isAr ? '14+ دورة احترافية' : '14+ Formations Pro'}</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors mb-2">
              {isAr ? 'فرع الدورات التدريبية المعتمدة 🎓' : 'Catalogue des Formations 🎓'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              {isAr 
                ? 'استعراض كافة دورات الخرسانة المسلحة (Béton Armé)، المنشآت المعدنية (Charpente)، وحساب الطرقات وVRD، مع فلاتر البرامج (Robot, ETABS, Tekla, Covadis).'
                : 'Formations complètes en Génie Civil avec vidéos HD, études de cas réels et calculs aux normes.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'عرض 50 ساعة: أسعار خاصة تبدأ من 3000 دج' : 'Offre 50h : Prix dès 3 000 DA'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isAr 
                    ? `تخفيض بطاقتك الحالي: ${discountPercent}% محسوب تلقائياً` 
                    : `Votre réduction carte : ${discountPercent}%`}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('courses');
            }}
            className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <span>{isAr ? 'دخول قسم الدورات التدريبية' : 'Consulter les formations'}</span>
            <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* CARD 2: GIFT COURSE BRANCH */}
        <div 
          onClick={() => onNavigate('gift')}
          className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-3xl p-5 sm:p-7 transition-all duration-200 hover:shadow-2xl hover:shadow-amber-400/10 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Gift className="w-6 h-6 animate-pulse" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1">
                <span>{isAr ? '🎁 هدية مجانية 100%' : '🎁 Offert 100% Gratuit'}</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors mb-2">
              {isAr ? 'فرع الدورة الهدية المجانية 🎁' : 'Formation Offerte en Cadeau 🎁'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              {isAr 
                ? 'فضاء مستقل ومخصص لمشاهدة دورة الإهداء المجانية بالكامل من منصة GC58 مع مشغل الفيديوهات والحلقات المنظمة دون أي تشتيت.' 
                : 'Accédez à votre formation offerte complète avec lecteur vidéo dédié et épisodes structurés.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'حلقات منظمة وشاملة في الهندسة المدنية' : 'Épisodes organisés en Génie Civil'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'فك التشفير بالكود السري أو المشاهدة المباشرة' : 'Accès par code secret ou direct'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('gift');
            }}
            className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-amber-500/40 text-amber-300 hover:text-amber-200 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>{isAr ? 'دخول فضاء الدورة الهدية' : 'Accéder au Cadeau'}</span>
            <Gift className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* CARD 3: STUDENT & VIP CARD BRANCH */}
        <div 
          onClick={() => onNavigate('student')}
          className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 sm:p-7 transition-all duration-200 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Crown className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
                GC58 PRO CARD
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors mb-2">
              {isAr ? 'فرع بطاقة الطالب ونسب التخفيض 💳' : 'Ma Carte PRO & Réductions 💳'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              {isAr 
                ? 'فضاء العضو الرسمي: تفاصيل بطاقتك (Standard 10%، Silver 20%، Golden 30%)، ومتابعة عداد الدورات للاستفادة من كامل المزايا.' 
                : 'Consultez votre carte de fidélité, vos réductions personnalisées et votre progression.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'تخفيضات تصاعدية من 10% إلى 30% على كل دورة' : 'Réductions cumulables de 10% à 30%'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'أولوية الاستشارات الهندسية لحاملي البطاقة الذهبية' : 'Consultations prioritaires pour les membres Golden'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('student');
            }}
            className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-200 hover:text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>{isAr ? 'فتح فضاء بطاقتي الشخصية' : 'Ouvrir Ma Carte PRO'}</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* CARD 4: EXCEL SHEETS, BOOKS & ASSISTANCE */}
        <div 
          onClick={() => onNavigate('student')}
          className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-5 sm:p-7 transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1">
                <span>{isAr ? 'شرط 14 دورة للدعم الكامل' : '14 Formations pour Support VIP'}</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors mb-2">
              {isAr ? 'شيتات الإكسل والكتب ومساعدة العملاء 📁' : 'Feuilles Excel & Support Technique 📁'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              {isAr 
                ? 'مكتبة هندسية ضخمة: ملفات إكسل احترافية لحساب الأعمدة والأساسات والكميات، مذكرات التخرج، وكتب الكودات الجزائرية مع المساعدة المباشرة.' 
                : 'Bibliothèque de feuilles Excel de calcul, livres de normes algériennes (RPA/CBA) et assistance.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'ملفات إكسل جاهزة ومجربة في مكاتب الدراسات' : 'Feuilles de calcul testées en bureaux d’études'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'المساعدة الهندسية المباشرة تتاح للمشتركين بـ 14 دورة' : 'Support technique complet à partir de 14 formations'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('student');
            }}
            className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>{isAr ? 'استعراض الشيتات وشروط التأهيل' : 'Consulter les fichiers & éligibilité'}</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
