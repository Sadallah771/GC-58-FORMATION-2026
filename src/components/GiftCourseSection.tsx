import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Lock, 
  Unlock, 
  Play, 
  Clock, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Layers, 
  Sparkles, 
  ShieldCheck,
  ChevronRight,
  LogIn
} from 'lucide-react';
import { GiftCourseSettings, Language } from '../types';

interface GiftCourseSectionProps {
  language: Language;
  giftCourse: GiftCourseSettings;
  sitePhone: string;
  onOpenGiftModal: () => void;
  isAdmin: boolean;
  onOpenAdminGiftTab?: () => void;
  user?: any;
  onOpenAuth?: () => void;
}

export const GiftCourseSection: React.FC<GiftCourseSectionProps> = ({
  language,
  giftCourse,
  sitePhone,
  onOpenGiftModal,
  isAdmin,
  onOpenAdminGiftTab,
  user,
  onOpenAuth,
}) => {
  const isAr = language === 'ar';
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      setIsUnlocked(false);
      return;
    }
    try {
      const expectedCode = (giftCourse.secretAccessCode || 'GC58-GIFT').trim().toUpperCase();
      const savedCode = localStorage.getItem(`gc58_gift_unlocked_code_${user.uid}`);
      if (savedCode && savedCode === expectedCode) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    } catch {
      setIsUnlocked(false);
    }
  }, [user, giftCourse.secretAccessCode]);

  // If the admin deactivated the gift and user is not admin, do not render
  if (!giftCourse.isActive && !isAdmin) {
    return null;
  }

  const algerianIntPhone = sitePhone.replace(/^0/, '213');
  const whatsappCodeRequestUrl = `https://wa.me/${algerianIntPhone}?text=${encodeURIComponent(
    isAr 
      ? `السلام عليكم، أريد الحصول على كود فتح الدورة الهدية المجانية (${giftCourse.title}).`
      : `Bonjour, je souhaite obtenir le code d'accès à la formation gratuite (${giftCourse.title}).`
  )}`;

  return (
    <section id="gift-course-section" className="relative py-16 sm:py-20 overflow-hidden bg-slate-950">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-amber-600/5 to-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Kicker */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black mb-3 shadow-inner">
              <Gift className="w-4 h-4 animate-bounce" />
              <span>{isAr ? 'هدية موقع GC58 FORMATIONS الرسمية' : 'Cadeau Officiel de la Plateforme'}</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-400 font-bold">{isAr ? 'مجانية 100% بكود سري' : '100% Gratuite avec Code'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {isAr ? 'دورة تكوينية هدية برابط Google Drive مشفر' : 'Formation Offerte avec Accès Sécurisé'}
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              {isAr
                ? 'يقدمها لكم المعهد كهدية حصرية لجميع المهندسين وطلبة الهندسة المدنية. الحلقات والمرفقات كاملة ومحفوظة على سيرفرات جوجل درايف ومحمية برمز وصول سري.'
                : 'Une formation complète exclusive accessible avec votre code de déverrouillage, hébergée sur Google Drive avec fichiers de calcul.'}
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              {!giftCourse.isActive && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {isAr ? 'مخفية عن الزوار' : 'Désactivée'}
                </span>
              )}
              {onOpenAdminGiftTab && (
                <button
                  onClick={onOpenAdminGiftTab}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تعديل الهدية والحلقات (الأدمين)' : 'Gérer la formation cadeau'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Hero Showcase Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 lg:p-10 overflow-hidden">
          {/* Subtle Top Gradient Line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-3 text-xs text-amber-400 font-bold mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{giftCourse.totalDuration || '3 ساعات'}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{giftCourse.episodes.length} {isAr ? 'حلقات تدريبية' : 'épisodes'}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isAr ? 'مرفقات ونماذج Google Drive' : 'Fichiers Drive'}</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug">
                  {giftCourse.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {giftCourse.subtitle || (isAr ? giftCourse.descriptionAr : giftCourse.descriptionFr)}
                </p>
              </div>

              {/* Instructor info banner */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-md">
                  GC58
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{giftCourse.instructorName}</h4>
                  <p className="text-[11px] text-slate-400">{giftCourse.instructorTitle}</p>
                </div>
              </div>

              {/* Sample Episodes Preview Pills */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>{isAr ? 'عينة من حلقات الدورة الهدية:' : 'Aperçu du contenu :'}</span>
                  <span className="text-[11px] font-mono text-amber-400">
                    {giftCourse.episodes.length} {isAr ? 'حلقة متوفرة' : 'modules'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {giftCourse.episodes.slice(0, 4).map((ep, idx) => (
                    <div 
                      key={ep.id}
                      className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center gap-2.5 text-slate-300"
                    >
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <span className="truncate text-xs font-medium">{ep.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    if (!user) {
                      onOpenAuth?.();
                    } else {
                      onOpenGiftModal();
                    }
                  }}
                  className={`px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-95 ${
                    !user
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 shadow-amber-500/25'
                      : isUnlocked
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25'
                  }`}
                >
                  {!user ? (
                    <>
                      <LogIn className="w-5 h-5 text-slate-950" />
                      <span>{isAr ? 'دخول الحساب لفتح هدية الموقع' : 'Se connecter pour accéder'}</span>
                    </>
                  ) : isUnlocked ? (
                    <>
                      <Unlock className="w-5 h-5 text-slate-950" />
                      <span>{isAr ? 'فتح المشغل ومتابعة المشاهدة' : 'Accéder aux vidéos débloquées'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 text-slate-950" />
                      <span>{isAr ? 'إدخال الكود السري لفك التشفير' : 'Déverrouiller avec le Code'}</span>
                    </>
                  )}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>

                {!isUnlocked && (
                  <a
                    href={whatsappCodeRequestUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-[#25D366]/40 text-[#25D366] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 fill-[#25D366]" />
                    <span>{isAr ? 'طلب الكود عبر الواتساب مجاناً' : 'Demander le code sur WhatsApp'}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Card / Player Showcase (5 cols) */}
            <div className="lg:col-span-5">
              <div 
                onClick={() => {
                  if (!user) {
                    onOpenAuth?.();
                  } else {
                    onOpenGiftModal();
                  }
                }}
                className="group relative cursor-pointer rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 aspect-video lg:aspect-[4/3] flex flex-col justify-end p-5 shadow-2xl hover:border-amber-500/50 transition-all"
              >
                {/* Background Image / Pattern */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />
                <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                {/* Lock or Unlock Central Button */}
                <div className="relative z-10 m-auto flex flex-col items-center text-center space-y-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform ${
                    !user
                      ? 'bg-slate-800 text-amber-400'
                      : isUnlocked
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950'
                  }`}>
                    {!user ? (
                      <LogIn className="w-7 h-7" />
                    ) : isUnlocked ? (
                      <Play className="w-7 h-7 fill-slate-950 ml-0.5" />
                    ) : (
                      <Lock className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      {!user
                        ? (isAr ? 'تسجيل الدخول مطلوب أولاً' : 'Connexion requise')
                        : isUnlocked
                        ? (isAr ? 'الدورة مفتوحة للمشاهدة' : 'Prêt à visionner')
                        : (isAr ? 'انقر لفك التشفير وإدخال الكود' : 'Cliquer pour entrer le code')}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {!user
                        ? (isAr ? 'متاحة حصرياً للأعضاء داخل الحساب' : 'Réservée aux membres connectés')
                        : isUnlocked
                        ? (isAr ? `${giftCourse.episodes.length} حلقة متوفرة بجودة عالية` : 'Tous les épisodes sont débloqués')
                        : (isAr ? 'يتطلب كود وصول سري خاص بالمهندسين' : 'Code secret requis')}
                    </p>
                  </div>
                </div>

                {/* Footer Badge inside preview */}
                <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Google Drive Video Player</span>
                  </span>
                  <span className="font-mono text-slate-300">GC58-ENGINEERING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
